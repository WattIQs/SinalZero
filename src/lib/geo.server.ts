import type { OverpassElement } from "./geo.functions";

export const OSM_UA = "SinalZeroLeadScanner/1.1 (+https://zero-sinal.vercel.app)";

export const OVERPASS_MIRRORS = [
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
  "https://overpass-api.de/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];

const OVERPASS_REQUEST_TIMEOUT_MS = 12000;
const OVERPASS_TOTAL_TIMEOUT_MS = 16000;
type OverpassTimeouts = { requestTimeoutMs?: number; totalTimeoutMs?: number };

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

export async function queryOverpass(query: string, timeouts: OverpassTimeouts = {}): Promise<OverpassElement[] | null> {
  const requestTimeoutMs = timeouts.requestTimeoutMs ?? OVERPASS_REQUEST_TIMEOUT_MS;
  const deadline = Date.now() + (timeouts.totalTimeoutMs ?? OVERPASS_TOTAL_TIMEOUT_MS);

  // Query a single instance at a time. Hedging every request across all
  // mirrors multiplied load and made an ordinary scan look unavailable when
  // public instances throttled the app. A bounded sequential fallback is
  // friendlier to the source operators and still recovers from outages.
  for (const mirror of OVERPASS_MIRRORS) {
    const remainingMs = deadline - Date.now();
    if (remainingMs <= 0) break;
    try {
      return await queryMirror(mirror, query, Math.min(requestTimeoutMs, remainingMs));
    } catch {
      // Try the next independent mirror within the same request budget.
    }
  }
  return null;
}

