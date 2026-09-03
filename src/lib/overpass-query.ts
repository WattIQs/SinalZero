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
// 300 per tile still gives up to ~1,200 raw establishments per area, well above
// what the UI renders at once, while keeping broad geographic coverage.
const MAX_ELEMENTS_PER_TILE = 300;
const MAX_STATE_ELEMENTS = 1_200;

function blocksForValues(area: string, key: string, values: string[]): string {
  const pattern = values.map(escapeRegex).join("|");
  return `nwr["${key}"~"^(${pattern})$"]["name"](${area});`;
}

function generalBlocks(area: string): string[] {
  return Object.entries(SUPPORTED_BY_KEY).map(([key, values]) => blocksForValues(area, key, values));
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
  return blocks.length > 0 ? blocks : generalBlocks(area);
}

function buildQuery(area: string, categories: CategoryKey[]): string {
  // "Todas" means every category offered by SinalZero, not every named OSM
  // feature. This avoids returning public infrastructure and unrelated places.
  const blocks = categories.length > 0 ? categoryBlocks(area, categories) : generalBlocks(area);
  return `[out:json][timeout:32];\n(\n${blocks.join("\n")}\n);\nout center tags qt ${MAX_ELEMENTS_PER_TILE};`;
}

export function buildOverpassQuery(area: BoundingBox, categories: CategoryKey[], _signalZeroOnly = false): string {
  const bbox = `${area.south},${area.west},${area.north},${area.east}`;
  return buildQuery(bbox, categories);
}

export function buildStateOverpassQuery(stateCode: string, categories: CategoryKey[]): string {
  const area = "area.searchArea";
  const blocks = categories.length > 0 ? categoryBlocks(area, categories) : generalBlocks(area);
  return `[out:json][timeout:32];\narea["ISO3166-2"="BR-${stateCode}"]["boundary"="administrative"]->.searchArea;\n(\n${blocks.join("\n")}\n);\nout center tags qt ${MAX_STATE_ELEMENTS};`;
}

export function buildAroundQuery(lat: number, lon: number, categories: CategoryKey[], radiusMeters = 8000): string {
  return buildQuery(`around:${radiusMeters},${lat},${lon}`, categories);
}

