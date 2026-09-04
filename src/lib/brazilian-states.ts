export type BrazilianState = {
  code: string;
  name: string;
  lat: number;
  lon: number;
};

export const BRAZILIAN_STATES: readonly BrazilianState[] = [
  { code: "AC", name: "Acre", lat: -9.02, lon: -70.81 },
  { code: "AL", name: "Alagoas", lat: -9.57, lon: -36.78 },
  { code: "AP", name: "Amapá", lat: 1.41, lon: -51.77 },
  { code: "AM", name: "Amazonas", lat: -4.17, lon: -64.48 },
  { code: "BA", name: "Bahia", lat: -12.97, lon: -41.68 },
  { code: "CE", name: "Ceará", lat: -5.2, lon: -39.53 },
  { code: "DF", name: "Distrito Federal", lat: -15.8, lon: -47.86 },
  { code: "ES", name: "Espírito Santo", lat: -19.19, lon: -40.34 },
  { code: "GO", name: "Goiás", lat: -15.98, lon: -49.86 },
  { code: "MA", name: "Maranhão", lat: -5.42, lon: -45.44 },
  { code: "MT", name: "Mato Grosso", lat: -12.64, lon: -55.42 },
  { code: "MS", name: "Mato Grosso do Sul", lat: -20.77, lon: -54.79 },
  { code: "MG", name: "Minas Gerais", lat: -18.51, lon: -44.56 },
  { code: "PA", name: "Pará", lat: -3.79, lon: -52.48 },
  { code: "PB", name: "Paraíba", lat: -7.24, lon: -36.78 },
  { code: "PR", name: "Paraná", lat: -24.89, lon: -51.55 },
  { code: "PE", name: "Pernambuco", lat: -8.38, lon: -37.86 },
  { code: "PI", name: "Piauí", lat: -7.72, lon: -42.73 },
  { code: "RJ", name: "Rio de Janeiro", lat: -22.25, lon: -42.66 },
  { code: "RN", name: "Rio Grande do Norte", lat: -5.81, lon: -36.59 },
  { code: "RS", name: "Rio Grande do Sul", lat: -30.03, lon: -53.21 },
  { code: "RO", name: "Rondônia", lat: -10.9, lon: -62.83 },
  { code: "RR", name: "Roraima", lat: 1.99, lon: -61.33 },
  { code: "SC", name: "Santa Catarina", lat: -27.24, lon: -50.22 },
  // Capital-centred fallback keeps a statewide scan useful when an Overpass mirror cannot resolve the administrative relation in time.\n  { code: "SP", name: "São Paulo", lat: -23.55, lon: -46.63 },
  { code: "SE", name: "Sergipe", lat: -10.57, lon: -37.39 },
  { code: "TO", name: "Tocantins", lat: -10.18, lon: -48.33 },
];

const normalize = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

export function findBrazilianStates(query: string): BrazilianState[] {
  const term = normalize(query);
  if (term.length < 2) return [];
  return BRAZILIAN_STATES.filter((state) => normalize(state.name).includes(term) || state.code.toLowerCase() === term).slice(0, 4);
}

export function isBrazilianStateCode(value: unknown): value is string {
  return typeof value === "string" && BRAZILIAN_STATES.some((state) => state.code === value.toUpperCase());
}

