import { createServerFn } from "@tanstack/react-start";
import { CATEGORIES, type BoundingBox, type CategoryKey, type Establishment } from "./types";
import { buildAroundQuery, buildOverpassQuery, buildStateOverpassQuery } from "./overpass-query";
import { isBrazilianStateCode } from "./brazilian-states";
import { fetchWithTimeout, OSM_UA, OVERPASS_MIRRORS, queryOverpass } from "./geo.server";
import { safeQueryOverturePlaces } from "./overture.server";
import { externalVerificationConfigured, verifyLeads, type LeadVerification } from "./web-verification";
import { searchRateLimitMiddleware, scanRateLimitMiddleware, verificationRateLimitMiddleware } from "./server-rate-limit";

export interface OverpassElement { type: string; id: number; lat?: number; lon?: number; center?: { lat: number; lon: number }; tags?: Record<string, string>; }
export interface PlaceSuggestion { label: string; shortLabel: string; lat: number; lon: number; boundingBox: BoundingBox | null; scope?: "state"; stateCode?: string; }
type NominatimAddress = { city?: string; town?: string; municipality?: string; village?: string; state?: string; country?: string; country_code?: string };
type NominatimResult = { display_name: string; name?: string; lat: string; lon: string; type?: string; class?: string; address?: NominatimAddress; boundingbox?: [string, string, string, string] };
type PhotonFeature = { type?: string; properties?: { name?: string; city?: string; state?: string; country?: string; countrycode?: string; type?: string; osm_value?: string; osm_key?: string; }; geometry?: { type?: string; coordinates?: [number, number] }; };
type PhotonResponse = { features?: PhotonFeature[] };
function normalizeText(v: string | null | undefined) { return (v ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim(); }
function editDistance(a: string, b: string): number { const left = normalizeText(a), right = normalizeText(b); if (left === right) return 0; if (!left.length) return right.length; if (!right.length) return left.length; const prev = new Array<number>(right.length + 1), curr = new Array<number>(right.length + 1); for (let j = 0; j <= right.length; j++) prev[j] = j; for (let i = 1; i <= left.length; i++) { curr[0] = i; for (let j = 1; j <= right.length; j++) { const leftChar = left[i - 1] ?? ""; const rightChar = right[j - 1] ?? ""; const cost = leftChar === rightChar ? 0 : 1; curr[j] = Math.min(curr[j - 1] ?? Number.POSITIVE_INFINITY, prev[j] ?? Number.POSITIVE_INFINITY, (prev[j - 1] ?? Number.POSITIVE_INFINITY) + cost); } for (let j = 0; j <= right.length; j++) prev[j] = curr[j] ?? j; } return prev[right.length] ?? Math.max(left.length, right.length); }
function toPlaceSuggestion(r: NominatimResult): PlaceSuggestion { const parts = r.display_name.split(",").map((p) => p.trim()); const city = r.address?.city ?? r.address?.town ?? r.address?.municipality ?? r.address?.village ?? r.name ?? parts[0] ?? ""; const state = r.address?.state; const lat = Number(r.lat); const lon = Number(r.lon); const rawBox = r.boundingbox; const boundingBox = rawBox && rawBox.length === 4 ? { south: Number(rawBox[0]), north: Number(rawBox[1]), west: Number(rawBox[2]), east: Number(rawBox[3]) } : { south: lat - 0.025, north: lat + 0.025, west: lon - 0.03, east: lon + 0.03 }; return { label: r.display_name, shortLabel: [city, state].filter(Boolean).join(", ") || parts.slice(0, 3).join(", "), lat, lon, boundingBox }; }
function placeName(r: NominatimResult) { return normalizeText(r.address?.city ?? r.address?.town ?? r.address?.municipality ?? r.address?.village ?? r.name ?? ""); }
function resultTypePriority(r: NominatimResult) { const type = normalizeText(r.type), cls = normalizeText(r.class); if (cls === "place" && ["city", "town", "municipality", "village"].includes(type)) return 300; if (cls === "boundary" && type === "administrative") return 260; if (type === "city" || type === "town") return 220; if (type === "suburb" || type === "neighbourhood") return 100; return 20; }
function isCityLike(r: NominatimResult) { const type = normalizeText(r.type), cls = normalizeText(r.class); return (cls === "place" && ["city", "town", "municipality", "village"].includes(type)) || (cls === "boundary" && type === "administrative") || ["city", "town"].includes(type); }
function matchScore(q: string, r: NominatimResult) { const name = normalizeText(r.name), city = placeName(r), display = normalizeText(r.display_name); let s = resultTypePriority(r); if (name === q) s += 500; else if (name.startsWith(q)) s += 300; else if (name.includes(q)) s += 120; if (city === q) s += 450; else if (city.startsWith(q)) s += 320; else if (city.includes(q)) s += 140; if (display.startsWith(`${q},`)) s += 150; const ts = q.split(" ").filter(Boolean); if (ts.length) s += Math.round(ts.filter((t) => [name, city, display].some((h) => h.split(" ").some((x) => x === t))).length / ts.length * 100); return s; }
function fuzzyDistance(q: string, r: NominatimResult) { const name = normalizeText(r.name), city = placeName(r); const candidates = [name, city].filter(Boolean); return candidates.length ? Math.min(...candidates.map((value) => editDistance(q, value))) : Number.POSITIVE_INFINITY; }
function fuzzyLimit(q: string) { const length = normalizeText(q).replace(/\s+/g, "").length; return length <= 5 ? 1 : length <= 10 ? 2 : 3; }
function dedupeResults(rs: NominatimResult[]) { const seen = new Set<string>(); return rs.filter((r) => !r.address?.country_code || r.address.country_code.toLowerCase() === "br").filter((r) => { const k = `${Number(r.lat).toFixed(5)}:${Number(r.lon).toFixed(5)}`; if (seen.has(k)) return false; seen.add(k); return true; }); }
function rankPlaceResults(q: string, rs: NominatimResult[]) { const qn = normalizeText(q); return dedupeResults(rs).map((item, index) => ({ item, score: matchScore(qn, item), index })).sort((a, b) => b.score - a.score || a.index - b.index).filter((x) => x.score >= 100).slice(0, 8).map((x) => x.item); }
function rankFuzzyPlaceResults(q: string, rs: NominatimResult[]) { const qn = normalizeText(q), limit = fuzzyLimit(qn); return dedupeResults(rs).map((item, index) => ({ item, distance: fuzzyDistance(qn, item), cityLike: isCityLike(item), score: matchScore(qn, item), index })).filter((x) => x.distance <= limit).sort((a, b) => Number(b.cityLike) - Number(a.cityLike) || a.distance - b.distance || b.score - a.score || a.index - b.index).slice(0, 8).map((x) => x.item); }
async function queryPlaces(q: string, extra: Partial<Record<string, string>> = {}): Promise<NominatimResult[]> { const u = new URL("https://nominatim.openstreetmap.org/search"); const params: Array<[string, string]> = [["format", "jsonv2"], ["limit", "50"], ["q", q], ["countrycodes", "br"], ["accept-language", "pt-BR"], ["addressdetails", "1"], ["namedetails", "1"], ["dedupe", "1"]]; for (const [k, v] of Object.entries(extra)) if (v !== undefined) params.push([k, v]); for (const [k, v] of params) u.searchParams.set(k, v); try { const r = await fetchWithTimeout(u.toString(), { headers: { Accept: "application/json", "User-Agent": OSM_UA } }, 8000); if (!r.ok) return []; return await r.json() as NominatimResult[]; } catch { return []; } }
function photonToNominatimResult(f: PhotonFeature): NominatimResult | null { const p = f.properties; const c = f.geometry?.coordinates; if (!p || !c || c.length < 2 || (p.countrycode && p.countrycode.toLowerCase() !== "br")) return null; const name = p.name ?? p.city; if (!name) return null; const city = p.city ?? name; const state = p.state; return { display_name: [name, city !== name ? city : undefined, state, "Brasil"].filter(Boolean).join(", "), name, lat: String(c[1]), lon: String(c[0]), type: p.type ?? p.osm_value ?? "city", class: "place", address: { city, country: "Brasil", country_code: "br", ...(state ? { state } : {}) } }; }
async function queryPhoton(q: string): Promise<NominatimResult[]> { const u = new URL("https://photon.komoot.io/api/"); u.searchParams.set("q", q); u.searchParams.set("limit", "20"); u.searchParams.set("lang", "pt"); u.searchParams.set("layer", "city"); try { const r = await fetchWithTimeout(u.toString(), { headers: { Accept: "application/json", "User-Agent": OSM_UA } }, 7000); if (!r.ok) return []; const j = await r.json() as PhotonResponse; return (j.features ?? []).map(photonToNominatimResult).filter((x): x is NominatimResult => x !== null); } catch { return []; } }
function isExactOrPrefix(q: string, r: NominatimResult) { const normalized = normalizeText(q), name = normalizeText(r.name), city = placeName(r); return name === normalized || city === normalized || name.startsWith(normalized) || city.startsWith(normalized); }
async function recoverByPrefix(q: string): Promise<NominatimResult[]> { const normalized = normalizeText(q).replace(/\s+/g, ""); if (normalized.length < 4) return []; const prefixes = Array.from(new Set([normalized.slice(0, normalized.length - 1), normalized.slice(0, normalized.length - 2), normalized.slice(0, Math.max(3, normalized.length - 3))])).filter((value) => value.length >= 3 && value.length < normalized.length); const batches = await Promise.all(prefixes.map(async (prefix) => { const [nominatim, photon] = await Promise.all([queryPlaces(prefix), queryPhoton(prefix)]); return [...nominatim, ...photon]; })); return batches.flat(); }
async function findPlaceResults(q: string): Promise<NominatimResult[]> { const normalized = normalizeText(q); const direct = await queryPlaces(q); const exactOrPrefix = direct.filter((r) => isExactOrPrefix(q, r)); if (exactOrPrefix.length > 0) return rankPlaceResults(q, exactOrPrefix); const fuzzyDirect = rankFuzzyPlaceResults(normalized, direct); if (fuzzyDirect.length > 0) return fuzzyDirect; const photon = await queryPhoton(q); const photonExactOrPrefix = photon.filter((r) => isExactOrPrefix(q, r)); if (photonExactOrPrefix.length > 0) return rankPlaceResults(q, photonExactOrPrefix); const fuzzyPhoton = rankFuzzyPlaceResults(normalized, photon); if (fuzzyPhoton.length > 0) return fuzzyPhoton; const recovered = await recoverByPrefix(q); return rankFuzzyPlaceResults(normalized, recovered); }
function normalizeScanArea(value: unknown): BoundingBox {
  if (!value || typeof value !== "object") throw new Error("Área de busca inválida.");
  const area = value as Partial<BoundingBox>;
  const south = Number(area.south);
  const north = Number(area.north);
  const west = Number(area.west);
  const east = Number(area.east);
  if (![south, north, west, east].every(Number.isFinite)) throw new Error("Área de busca inválida.");
  if (south < -90 || north > 90 || west < -180 || east > 180 || south >= north || west >= east) throw new Error("Área de busca inválida.");
  if ((north - south) * (east - west) > 1) throw new Error("Escolha uma área menor para a busca.");
  return { south, north, west, east };
}

function normalizeCategories(value: unknown): CategoryKey[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((category): category is CategoryKey => typeof category === "string" && category in CATEGORIES))].slice(0, 12);
}

function isVerificationLead(value: unknown): value is Establishment {
  if (!value || typeof value !== "object") return false;
  const lead = value as Partial<Establishment>;
  const contact = lead.contact;
  const signals = lead.signals;
  const details = lead.details;
  return typeof lead.id === "string" && lead.id.length > 0 && lead.id.length <= 200
    && typeof lead.name === "string" && lead.name.trim().length > 0 && lead.name.length <= 300
    && typeof lead.lat === "number" && Number.isFinite(lead.lat) && lead.lat >= -90 && lead.lat <= 90
    && typeof lead.lon === "number" && Number.isFinite(lead.lon) && lead.lon >= -180 && lead.lon <= 180
    && typeof lead.tags === "object" && lead.tags !== null
    && typeof signals === "object" && signals !== null
    && typeof signals.website === "boolean" && typeof signals.instagram === "boolean"
    && typeof contact === "object" && contact !== null
    && typeof contact.whatsappValid === "boolean"
    && typeof details === "object" && details !== null;
}

function normalizeVerificationLeads(value: unknown): Establishment[] {
  if (!Array.isArray(value) || value.length > 40) throw new Error("Lote de leads inválido.");
  if (!value.every(isVerificationLead)) throw new Error("Dados de leads inválidos.");
  return value as Establishment[];
}

function merge(responses: Array<OverpassElement[] | null>) { const m = new Map<string, OverpassElement>(); for (const rs of responses) for (const e of rs ?? []) { const k = `${e.type}-${e.id}`; if (!m.has(k)) m.set(k, e); } return [...m.values()]; }
function sameNamedLocation(a: OverpassElement, b: OverpassElement): boolean { const at = a.tags?.name ?? a.tags?.official_name; const bt = b.tags?.name ?? b.tags?.official_name; if (!at || !bt || normalizeText(at) !== normalizeText(bt)) return false; const alat = a.center?.lat ?? a.lat, alon = a.center?.lon ?? a.lon, blat = b.center?.lat ?? b.lat, blon = b.center?.lon ?? b.lon; if (![alat, alon, blat, blon].every((v) => Number.isFinite(v))) return false; const dLat = (Number(alat) - Number(blat)) * 111000; const dLon = (Number(alon) - Number(blon)) * 111000 * Math.cos((Number(alat) * Math.PI) / 180); return Math.hypot(dLat, dLon) <= 40; }
function dedupeNamedPlaces(elements: OverpassElement[]): OverpassElement[] { const kept: OverpassElement[] = []; for (const element of elements) { if (kept.some((existing) => existing.type !== element.type && sameNamedLocation(existing, element))) continue; kept.push(element); } return kept; }
async function queryArea(a: BoundingBox, c: CategoryKey[]) {
  const defaultCategories: CategoryKey[] = ["restaurant", "fast_food", "cafe", "bar", "pharmacy", "fuel"];
  const queryGroups = c.length ? [c] : defaultCategories.map((category) => [category]);
  const rs = (await Promise.all(queryGroups.map((group) => Promise.all(splitArea(a).map((t) => queryOverpass(buildOverpassQuery(t, group, false))))))).flat();
  const merged = merge(rs);
  console.info("[geo:area] tiled scan completed", { tiles: rs.length, successfulTiles: rs.filter((result) => result !== null).length, resultCount: merged.length, categoryCount: c.length });
  if (merged.length > 0) return merged;

  // Public Overpass mirrors occasionally return an empty partial result for a
  // tiled city scan. Retry once with a compact query around the selected area
  // so a transient mirror response does not look like a permanent outage.
  const lat = (a.south + a.north) / 2;
  const lon = (a.west + a.east) / 2;
  console.warn("[geo:area] retrying empty tiled scan with compact fallback", { lat, lon, categoryCount: c.length });
  const fallback = await queryOverpass(buildAroundQuery(lat, lon, c, 5000), { requestTimeoutMs: 18000, totalTimeoutMs: 24000 });
  console.info("[geo:area] compact fallback completed", { resultCount: fallback?.length ?? null });
  return fallback;
}
async function queryStateArea(stateCode: string, categories: CategoryKey[]) { return queryOverpass(buildStateOverpassQuery(stateCode, categories), { requestTimeoutMs: 30000, totalTimeoutMs: 40000 }); }
function splitArea(a: BoundingBox) { const s = Math.min(a.south, a.north), n = Math.max(a.south, a.north), w = Math.min(a.west, a.east), e = Math.max(a.west, a.east), dh = (n - s) / 2, dw = (e - w) / 2; return [0, 1, 2, 3].map((i) => { const row = Math.floor(i / 2), col = i % 2; return { south: s + row * dh, north: row === 1 ? n : s + (row + 1) * dh, west: w + col * dw, east: col === 1 ? e : w + (col + 1) * dw }; }); }
export const searchPlacesServer = createServerFn({ method: "POST" }).middleware([searchRateLimitMiddleware]).validator((data: { q?: unknown }) => data).handler(async ({ data }): Promise<PlaceSuggestion[]> => {
  const q = typeof data?.q === "string" ? data.q.trim().replace(/\s+/g, " ").slice(0, 120) : "";
  if (q.length < 2) return [];
  const ranked = await findPlaceResults(q);
  return ranked.map(toPlaceSuggestion);
});
export const searchOverpassServer = createServerFn({ method: "POST" }).middleware([scanRateLimitMiddleware]).validator((data: { area?: unknown; categories?: unknown; stateCode?: unknown }) => data).handler(async ({ data }) => {
  const stateCode = isBrazilianStateCode(data?.stateCode) ? data.stateCode.toUpperCase() : undefined;
  const area = stateCode ? undefined : normalizeScanArea(data?.area);
  const categories = normalizeCategories(data?.categories);
  const [osmResult, overtureResult] = stateCode
    ? [await queryStateArea(stateCode, categories), []]
    : await Promise.all([queryArea(area!, categories), safeQueryOverturePlaces(area!)]);
  const combined = dedupeNamedPlaces([...(osmResult ?? []), ...overtureResult]);
  if (combined.length === 0 && osmResult === null && overtureResult.length === 0) throw new Error("As fontes de estabelecimentos estão indisponíveis no momento. Tente novamente em alguns segundos.");
  return { elements: combined };
});
export const verifyLeadsServer = createServerFn({ method: "POST" }).middleware([verificationRateLimitMiddleware]).validator((data: { leads?: unknown }) => data).handler(async ({ data }): Promise<{ leads: (Establishment & { verification: LeadVerification })[]; external: boolean }> => { const leads = normalizeVerificationLeads(data?.leads); if (!externalVerificationConfigured()) return { leads: leads.map((lead) => ({ ...lead, verification: { status: "unverified", score: 0, reasons: ["Verificação externa não configurada; usados os dados do OpenStreetMap."], checked: false, foundDigitalPresence: Boolean(lead.signals.website || lead.signals.instagram || lead.contact.whatsappValid || lead.contact.instagramUrl), foundWebsite: Boolean(lead.signals.website || lead.contact.websiteUrl), contactConfidence: "low" as const } })), external: false }; return { leads: await verifyLeads(leads), external: true }; });

