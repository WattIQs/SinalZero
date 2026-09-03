import type { OverpassElement } from "./geo.functions";

export const OSM_UA = "SinalZeroLeadScanner/1.0 (lead prospecting tool)";

export const OVERPASS_MIRRORS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.openstreetmap.fr/api/interpreter",
];

const OVERPASS_REQUEST_TIMEOUT_MS = 12000;
const OVERPASS_TOTAL_TIMEOUT_MS = 16000;
const MIRROR_HEDGE_DELAY_MS = 900;

export async function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
  timeoutMs = 60000
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function queryMirror(mirror: string, query: string, timeoutMs: number): Promise<OverpassElement[]> {
  const response = await fetchWithTimeout(
    mirror,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": OSM_UA,
      },
      body: `data=${encodeURIComponent(query)}`,
    },
    timeoutMs
  );

  if (!response.ok) throw new Error(`Overpass mirror failed with ${response.status}`);
  const json = (await response.json()) as { elements?: OverpassElement[] };
  return json.elements ?? [];
}

function delayedMirror(mirror: string, query: string, delayMs: number, deadline: number): Promise<OverpassElement[]> {
  return new Promise((resolve, reject) => {
    const start = async () => {
      const remainingMs = deadline - Date.now();
      if (remainingMs <= 0) {
        reject(new Error("Overpass deadline exceeded"));
        return;
      }
      try {
        resolve(await queryMirror(mirror, query, Math.min(OVERPASS_REQUEST_TIMEOUT_MS, remainingMs)));
      } catch (error) {
        reject(error);
      }
    };

    if (delayMs <= 0) void start();
    else setTimeout(() => void start(), delayMs);
  });
}

export async function queryOverpass(query: string): Promise<OverpassElement[] | null> {
  const deadline = Date.now() + OVERPASS_TOTAL_TIMEOUT_MS;

  const attempts = OVERPASS_MIRRORS.map((mirror, index) =>
    delayedMirror(mirror, query, index * MIRROR_HEDGE_DELAY_MS, deadline)
  );

  try {
    return await Promise.any(attempts);
  } catch {
    return null;
  }
}
