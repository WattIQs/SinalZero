import { CATEGORIES, type CategoryKey } from "./types";

export function normalizeCategories(value: unknown): CategoryKey[] {
  if (!Array.isArray(value)) return [];
  return [
    ...new Set(
      value.filter(
        (key): key is CategoryKey => typeof key === "string" && Object.hasOwn(CATEGORIES, key),
      ),
    ),
  ];
}

export function scanBatch(value: unknown, page: unknown = 0) {
  const selected = normalizeCategories(value);
  const categories = selected.length ? selected : (Object.keys(CATEGORIES) as CategoryKey[]);
  if (
    typeof page !== "number" ||
    !Number.isInteger(page) ||
    page < 0 ||
    page >= Math.ceil(categories.length / 4)
  ) {
    throw new Error("Lote de pesquisa inválido.");
  }
  const offset = page * 4;
  return {
    categories: categories.slice(offset, offset + 4),
    nextPage: offset + 4 < categories.length ? page + 1 : null,
  };
}
