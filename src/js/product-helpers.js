// Helper for Catalog and Product page
import rawProducts from "../assets/data.json";

// Generic helpers
export const toItemsArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

export function shuffleArray(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

// Tag helpers
export const normBlocks = (item) =>
  (Array.isArray(item?.blocks) ? item.blocks : []).map((b) =>
    (typeof b === "string" ? b : b?.name || "").toLowerCase()
  );

export const hasTag = (item, tag) =>
  !!tag && normBlocks(item).includes(tag.toLowerCase());

export const partitionByTags = (payload, tagA = "Top Best Sets") => {
  const arr = Array.isArray(payload) ? payload : payload?.data ?? [];
  const A = tagA.toLowerCase();

  const res = { topBest: [] };

  for (const item of arr) {
    const a = hasTag(item, A);
    if (a) res.topBest.push(item);
  }
  return res;
};

// Base products list
export const products = toItemsArray(rawProducts);

// Top best, randomized – convenient helper
export function getRandomizedTopBest() {
  const { topBest } = partitionByTags(products, "Top Best Sets");
  return shuffleArray(topBest);
}

// Price / rating helpers
export const getPrice = (item) => {
  if (typeof item?.price === "number") return item.price;

  if (typeof item?.price === "string") {
    const cleaned = item.price.replace(/[^0-9.,]/g, "").replace(",", ".");
    const num = Number(cleaned);
    return Number.isNaN(num) ? 0 : num;
  }
  return 0;
};

export const getRating = (item) => {
  if (typeof item?.popularity === "number") return item.popularity;

  if (typeof item?.popularity === "string") {
    const cleaned = item.popularity.replace(/[^0-9.,]/g, "").replace(",", ".");
    const num = Number(cleaned);
    return Number.isNaN(num) ? 0 : num;
  }
  return 0;
};

// Sorting helpers
// Price: low → high
export const sortTopBestByPriceAsc = (items) => {
  const arr = toItemsArray(items);
  return [...arr].sort((a, b) => getPrice(a) - getPrice(b));
};

// Price: high → low
export const sortTopBestByPriceDesc = (items) => {
  const arr = toItemsArray(items);
  return [...arr].sort((a, b) => getPrice(b) - getPrice(a));
};

// Popularity: high → low
export const sortTopBestByRatingDesc = (items) => {
  const arr = toItemsArray(items);
  return [...arr].sort((a, b) => getRating(b) - getRating(a));
};

// Filtering helper
export function filterProducts(items, filters = {}) {
  const arr = toItemsArray(items);

  const normalize = (v) =>
    typeof v === "string" ? v.trim().toLowerCase() : "";

  const { size = "", color = "", category = "", salesOnly = false } = filters;

  const sizeNorm = normalize(size);
  const colorNorm = normalize(color);
  const categoryNorm = normalize(category);
  const salesFlag = !!salesOnly;

  return arr.filter((item) => {
    const itemSize = normalize(item.size);
    const itemColor = normalize(item.color);
    const itemCategory = normalize(item.category);

    return (
      (!sizeNorm || itemSize === sizeNorm) &&
      (!colorNorm || itemColor === colorNorm) &&
      (!categoryNorm || itemCategory === categoryNorm) &&
      (!salesFlag || item.salesStatus)
    );
  });
}

export function getProductById(id) {
  if (!id) return null;

  // ensure string comparison so "SU001" === 1001-style IDs still match safely
  const targetId = String(id);

  return products.find((p) => String(p.id) === targetId) || null;
}