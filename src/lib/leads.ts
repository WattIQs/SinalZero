import type { Lead, SearchPlace } from "./types";

export async function searchPlaces(query: string): Promise<SearchPlace[]> {
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=8&q=${encodeURIComponent(query)}`;
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error("Não foi possível localizar o endereço.");
  return response.json();
}

const categoryQuery: Record<string, string> = {
  "Restaurantes": 'node[amenity=restaurant](AREA);way[amenity=restaurant](AREA);relation[amenity=restaurant](AREA);',
  "Academias": 'node[leisure=fitness_centre](AREA);way[leisure=fitness_centre](AREA);relation[leisure=fitness_centre](AREA);',
  "Clínicas": 'node[amenity=clinic](AREA);way[amenity=clinic](AREA);relation[amenity=clinic](AREA);',
  "Salões": 'node[shop=hairdresser](AREA);way[shop=hairdresser](AREA);relation[shop=hairdresser](AREA);',
  "Imobiliárias": 'node[office=estate_agent](AREA);way[office=estate_agent](AREA);relation[office=estate_agent](AREA);',
  "Hotéis": 'node[tourism=hotel](AREA);way[tourism=hotel](AREA);relation[tourism=hotel](AREA);',
  "Lojas": 'node[shop](AREA);way[shop](AREA);relation[shop](AREA);'
};

function areaFromPlace(place: SearchPlace) {
  if (!place.boundingbox) return `${place.lat - 0.025},${place.lon - 0.03},${place.lat + 0.025},${place.lon + 0.03}`;
  const [south, north, west, east] = place.boundingbox;
  return `${south},${west},${north},${east}`;
}

export async function searchLeads(place: SearchPlace, categories: string[]): Promise<Lead[]> {
  const area = areaFromPlace(place);
  const clauses = (categories.length ? categories : Object.keys(categoryQuery)).map((category) => (categoryQuery[category] ?? categoryQuery["Lojas"]).replaceAll("AREA", area)).join("");
  const query = `[out:json][timeout:25];(${clauses});out center tags;`;
  const response = await fetch("https://overpass-api.de/api/interpreter", { method: "POST", body: query });
  if (!response.ok) throw new Error("A busca de leads demorou demais. Tente uma área menor.");
  const data = await response.json() as { elements: Array<{ id:number; lat?:number; lon?:number; center?:{lat:number;lon:number}; tags?:Record<string,string> }> };
  return data.elements.map((element) => {
    const tags = element.tags ?? {};
    const lat = element.lat ?? element.center?.lat ?? 0;
    const lon = element.lon ?? element.center?.lon ?? 0;
    const contact = [tags.website, tags.phone, tags["contact:phone"], tags["contact:instagram"]].filter(Boolean).length;
    return {
      id: `osm-${element.id}`, name: tags.name ?? "Estabelecimento sem nome", lat, lon,
      address: [tags["addr:street"], tags["addr:housenumber"], tags["addr:city"]].filter(Boolean).join(", "),
      category: tags.amenity ?? tags.shop ?? tags.office ?? tags.tourism ?? tags.leisure ?? "Negócio",
      website: tags.website, phone: tags.phone ?? tags["contact:phone"], instagram: tags["contact:instagram"],
      signals: Math.max(0, 3 - contact)
    };
  }).filter((lead) => lead.lat !== 0 && lead.lon !== 0 && lead.name !== "Estabelecimento sem nome");
}
