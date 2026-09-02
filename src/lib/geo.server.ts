import type { OverpassElement } from "./geo.functions";

export const OSM_UA = "SinalZeroLeadScanner/1.0 (lead prospecting tool)";

export const OVERPASS_MIRRORS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.openstreetmap.fr/api/interpreter",
];

// Public Overpass instances can take several seconds for broad city scans.
// Keep the first attempt long enough for a healthy mirror, while bounding the
// whole fallback chain so a scan cannot leave the interface loading indefinitely.
const OVERPASS_REQUEST_TIMEOUT_MS = 15000;
const OVERPASS_TOTAL_TIMEOUT_MS = 20000;

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

export async function queryOverpass(query: string): Promise<OverpassElement[] | null> {
  const deadline = Date.now() + OVERPASS_TOTAL_TIMEOUT_MS;
  for (const mirror of OVERPASS_MIRRORS) {
    const remainingMs = deadline - Date.now();
    if (remainingMs <= 0) break;
    try {
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
        Math.min(OVERPASS_REQUEST_TIMEOUT_MS, remainingMs)
      );
      if (!response.ok) continue;
      const json = (await response.json()) as { elements?: OverpassElement[] };
      return json.elements ?? [];
    } catch {
      // Try the next Overpass mirror.
    }
  }
  return null;
}

