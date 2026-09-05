import type { Establishment, SavedLead } from "./types";
import { supabase } from "./supabase";

const STORAGE_PREFIX = "sinal-zero:saved-leads:v2:";
let activeUserId: string | null = null;
let syncPromise: Promise<SavedLead[]> | null = null;
let lastSyncUsedLocalFallback = false;

export function setSavedLeadUser(userId: string | null): void {
  if (activeUserId === userId) return;
  activeUserId = userId;
  syncPromise = null;
  lastSyncUsedLocalFallback = false;
}

export function didSavedLeadSyncUseLocalFallback(): boolean {
  return lastSyncUsedLocalFallback;
}

function storageKey(userId = activeUserId): string | null {
  return userId ? `${STORAGE_PREFIX}${userId}` : null;
}

function readLocal(userId = activeUserId): SavedLead[] {
  if (typeof window === "undefined") return [];
  const key = storageKey(userId);
  if (!key) return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is SavedLead =>
      Boolean(item && typeof item === "object" && "id" in item),
    );
  } catch {
    return [];
  }
}

function writeLocal(leads: SavedLead[], userId = activeUserId): void {
  if (typeof window === "undefined") return;
  const key = storageKey(userId);
  if (!key) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(leads));
  } catch {
    // Storage may be unavailable in private/restricted browser contexts.
  }
}

async function getCurrentUserId(): Promise<string | null> {
  if (!supabase) return null;
  // The root auth gate already owns session validation. Reading the current
  // session here avoids adding an Auth network request before every database
  // write, which previously made an otherwise valid local session fall back
  // to device-only storage when that extra request was unavailable.
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id ?? null;
}

function syncErrorSummary(error: unknown): string {
  if (!(error instanceof Error)) return "erro desconhecido";
  const cause = error.cause;
  if (!cause || typeof cause !== "object") return error.message;
  const details = cause as {
    code?: unknown;
    status?: unknown;
    message?: unknown;
    details?: unknown;
  };
  const parts = [
    error.message,
    typeof details.code === "string" ? `code=${details.code}` : "",
    typeof details.status === "number" ? `status=${details.status}` : "",
    typeof details.message === "string" ? details.message : "",
    typeof details.details === "string" ? details.details : "",
  ].filter(Boolean);
  return parts.join(" | ");
}

function pendingRemovals(userId = activeUserId): string[] {
  if (!userId || typeof window === "undefined") return [];
  try {
    const value: unknown = JSON.parse(
      window.localStorage.getItem(`${storageKey(userId)}:removed`) ?? "[]",
    );
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function markRemoval(id: string, removed: boolean, userId = activeUserId): void {
  if (!userId || typeof window === "undefined") return;
  const ids = new Set(pendingRemovals(userId));
  if (removed) ids.add(id);
  else ids.delete(id);
  try {
    window.localStorage.setItem(`${storageKey(userId)}:removed`, JSON.stringify([...ids]));
  } catch {
    lastSyncUsedLocalFallback = true;
  }
}

async function persistLead(lead: SavedLead, expectedUserId = activeUserId): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId || !supabase || activeUserId !== userId || userId !== expectedUserId)
    throw new Error("Sessão indisponível para sincronizar o lead.");

  const { data, error } = await supabase
    .from("saved_leads")
    .upsert(
      {
        user_id: userId,
        lead_id: lead.id,
        lead_data: lead,
        saved_at: lead.savedAt,
      },
      { onConflict: "user_id,lead_id" },
    )
    .select("lead_id");

  if (error || !data?.some((row) => row.lead_id === lead.id))
    throw new Error("Não foi possível confirmar o salvamento do lead na sua conta.", {
      cause: error,
    });
}

async function deletePersistedLead(id: string, expectedUserId = activeUserId): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId || !supabase || activeUserId !== userId || userId !== expectedUserId)
    throw new Error("Sessão indisponível para sincronizar a remoção.");

  const { error } = await supabase
    .from("saved_leads")
    .delete()
    .eq("user_id", userId)
    .eq("lead_id", id);

  if (error)
    throw new Error("Não foi possível confirmar a remoção do lead na sua conta.", { cause: error });
}

async function performSyncSavedLeads(expectedUserId: string | null): Promise<SavedLead[]> {
  const userId = await getCurrentUserId();
  if (!userId || !supabase) return [];
  if (activeUserId !== userId || userId !== expectedUserId) return [];

  for (const id of pendingRemovals(userId)) await deletePersistedLead(id, userId);

  const localLeads = readLocal();
  const { data, error } = await supabase
    .from("saved_leads")
    .select("lead_id, lead_data, saved_at")
    .eq("user_id", userId)
    .order("saved_at", { ascending: false });

  if (error) {
    throw new Error("Não foi possível sincronizar os leads salvos.", { cause: error });
  }
  if (activeUserId !== userId) return [];

  const remoteLeads = (data ?? [])
    .map((row) => {
      const lead = row.lead_data as unknown as Establishment;
      return { ...lead, savedAt: row.saved_at } as SavedLead;
    })
    .filter((lead) => Boolean(lead?.id) && !pendingRemovals(userId).includes(lead.id));

  const remoteIds = new Set(remoteLeads.map((lead) => lead.id));
  const localOnly = localLeads.filter(
    (lead) => !remoteIds.has(lead.id) && !pendingRemovals(userId).includes(lead.id),
  );

  // Do not report a completed sync until every local lead is confirmed by the
  // database. This is what makes saved leads survive another device or login.
  for (const lead of localOnly) await persistLead(lead, userId);

  if (activeUserId !== userId) return [];
  const merged = [
    ...new Map([...remoteLeads, ...readLocal(userId)].map((lead) => [lead.id, lead])).values(),
  ]
    .filter((lead) => !pendingRemovals(userId).includes(lead.id))
    .sort((a, b) => b.savedAt.localeCompare(a.savedAt));
  writeLocal(merged, userId);
  return merged;
}

export async function syncSavedLeads(): Promise<SavedLead[]> {
  if (syncPromise) return syncPromise;
  lastSyncUsedLocalFallback = false;
  const userId = activeUserId;
  const operation = performSyncSavedLeads(userId).catch((error: unknown) => {
    // A temporary REST/Auth failure must never make locally saved leads vanish
    // or surface as an unhandled browser exception. A later app mount retries
    // the remote merge automatically.
    if (activeUserId !== userId) return [];
    lastSyncUsedLocalFallback = true;
    console.warn(
      "[saved-leads] remote sync unavailable; keeping local leads",
      syncErrorSummary(error),
    );
    return readLocal();
  });
  syncPromise = operation;
  try {
    return await operation;
  } finally {
    if (syncPromise === operation) syncPromise = null;
  }
}

export function getSavedLeads(): SavedLead[] {
  return readLocal();
}

export function isLeadSaved(id: string): boolean {
  return readLocal().some((lead) => lead.id === id);
}

export async function saveLead(
  lead: Establishment,
): Promise<{ lead: SavedLead; persisted: boolean }> {
  const userId = activeUserId;
  markRemoval(lead.id, false, userId);
  const current = readLocal();
  const existing = current.find((item) => item.id === lead.id);
  if (existing) return { lead: existing, persisted: !lastSyncUsedLocalFallback };

  const saved: SavedLead = { ...lead, savedAt: new Date().toISOString() };
  writeLocal([saved, ...current]);
  try {
    await persistLead(saved, userId);
    if (activeUserId === userId) lastSyncUsedLocalFallback = false;
    return { lead: saved, persisted: true };
  } catch (error) {
    if (activeUserId === userId) lastSyncUsedLocalFallback = true;
    console.warn(
      "[saved-leads] remote save unavailable; keeping local lead",
      syncErrorSummary(error),
    );
    return { lead: saved, persisted: false };
  }
}

export async function removeLead(id: string): Promise<boolean> {
  const userId = activeUserId;
  markRemoval(id, true, userId);
  writeLocal(readLocal().filter((lead) => lead.id !== id));
  try {
    await deletePersistedLead(id, userId);
    if (activeUserId === userId) lastSyncUsedLocalFallback = false;
    return true;
  } catch (error) {
    if (activeUserId === userId) lastSyncUsedLocalFallback = true;
    console.warn(
      "[saved-leads] remote removal unavailable; keeping local removal",
      syncErrorSummary(error),
    );
    return false;
  }
}

export async function flushSavedLeads(): Promise<boolean> {
  await syncSavedLeads();
  return !lastSyncUsedLocalFallback;
}
