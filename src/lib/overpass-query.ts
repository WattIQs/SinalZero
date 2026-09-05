import type { BoundingBox, CategoryKey } from "./types";
import { CATEGORIES } from "./types";

function escapeRegex(value: string): string {
  return value.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
}

const SUPPORTED_BY_KEY: Record<string, string[]> = {
  amenity: ["restaurant", "fast_food", "cafe", "bar", "pub", "pharmacy", "dentist", "doctors", "clinic", "veterinary", "car_wash", "fuel", "bank"],
  shop: [
    "bakery", "pastry", "hairdresser", "barber", "beauty", "massage", "tattoo", "cosmetics", "perfumery",
    "pet", "pet_grooming", "supermarket", "convenience", "kiosk", "general", "clothes", "shoes", "boutique",
    "jewelry", "hardware", "doityourself", "paint", "florist", "furniture", "interior_decoration", "electronics",
    "mobile_phone", "computer", "sports", "books", "toys", "gift", "optician", "travel_agency", "photo", "copyshop", "printing", "car_repair", "car",
  ],
  leisure: ["fitness_centre"],
  healthcare: ["pharmacy", "dentist", "doctor", "clinic", "veterinary"],
  office: ["estate_agent", "insurance", "accountant", "lawyer"],
  craft: ["photographer", "printer"],
};

// The scan is already split into four geographic tiles. Limiting at the
// Overpass output stage prevents a dense city from returning a multi-megabyte
// payload that the serverless runtime rejects before SinalZero can process it.
// 450 per tile still gives up to ~1,800 raw establishments per area, well above
// what the UI renders at once, while keeping broad geographic coverage.
const MAX_ELEMENTS_PER_TILE = 450;
// A state-wide query considers many OSM categories over a large administrative
// relation. A bounded, geographically ordered sample keeps the response useful
// and reliable on public Overpass instances instead of timing out the search.
const MAX_STATE_ELEMENTS = 200;

function blocksForValues(area: string, key: string, values: string[]): string {
  if (values.length === 1) return `nwr["${key}"="${values[0]}"]["name"](${area});`;
  const pattern = values.map(escapeRegex).join("|");
  return `nwr["${key}"~"^(${pattern})$"]["name"](${area});`;
}

function cityDefaultBlocks(area: string): string[] {
  // A broad union of every commercial tag becomes unreliable in dense cities.
  // This deliberately uses a practical cross-section instead: more variety
  // than restaurants alone, but still friendly to public Overpass mirrors.
  return [
    blocksForValues(area, "amenity", ["restaurant", "fast_food", "cafe", "bar", "pharmacy", "dentist", "clinic", "veterinary"]),
    blocksForValues(area, "shop", ["bakery", "hairdresser", "barber", "beauty", "pet", "supermarket", "convenience", "clothes", "shoes", "car_repair"]),
    blocksForValues(area, "leisure", ["fitness_centre"]),
    blocksForValues(area, "office", ["estate_agent", "insurance", "accountant", "lawyer"]),
  ];
}

function stateDefaultBlocks(area: string): string[] {
  // Statewide scans must stay compact to finish on public mirrors. Broader
  // category combinations are still available when the user selects them.
  return [
    blocksForValues(area, "amenity", ["restaurant", "fast_food", "cafe", "bar"]),
  ];
}

function categoryBlocks(area: string, categories: CategoryKey[]): string[] {
  const groups = new Map<string, Set<string>>();
  for (const category of categories) {
    for (const filter of CATEGORIES[category].filters) {
      const values = groups.get(filter.key) ?? new Set<string>();
      for (const value of filter.values) values.add(value);
      groups.set(filter.key, values);
    }
  }

  const blocks: string[] = [];
  for (const [key, values] of groups) {
    if (values.size === 0) continue;
    blocks.push(blocksForValues(area, key, [...values]));
  }
  return blocks.length > 0 ? blocks : cityDefaultBlocks(area);
}

function buildQuery(area: string, categories: CategoryKey[], defaultBlocks: (area: string) => string[] = cityDefaultBlocks): string {
  // "Todas" means every category offered by SinalZero, not every named OSM
  // feature. This avoids returning public infrastructure and unrelated places.
  const blocks = categories.length > 0 ? categoryBlocks(area, categories) : defaultBlocks(area);
  return `[out:json][timeout:32];\n(\n${blocks.join("\n")}\n);\nout center tags qt ${MAX_ELEMENTS_PER_TILE};`;
}

export function buildOverpassQuery(area: BoundingBox, categories: CategoryKey[], _signalZeroOnly = false): string {
  const bbox = `${area.south},${area.west},${area.north},${area.east}`;
  return buildQuery(bbox, categories);
}

export function buildStateOverpassQuery(stateCode: string, categories: CategoryKey[]): string {
  const area = "area.searchArea";
  // An unfiltered union across every supported OSM tag is too expensive at a
  // state scale. Default to high-intent service businesses; explicit category
  // selections still use their exact filters across the full state boundary.
  const blocks = categories.length > 0
    ? categoryBlocks(area, categories)
    : stateDefaultBlocks(area);
  return `[out:json][timeout:60];\narea["ISO3166-2"="BR-${stateCode}"]["boundary"="administrative"]->.searchArea;\n(\n${blocks.join("\n")}\n);\nout center tags qt ${MAX_STATE_ELEMENTS};`;
}

export function buildAroundQuery(lat: number, lon: number, categories: CategoryKey[], radiusMeters = 8000): string {
  return buildQuery(`around:${radiusMeters},${lat},${lon}`, categories);
}

