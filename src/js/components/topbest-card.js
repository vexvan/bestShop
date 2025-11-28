import { getStarsHtml } from "./rating-stars.js";

// Single card
export function getTopBestCard(item = {}) {
  const {
    imageUrlTopBestMini = "/src/assets/img-suitcases/ctminicatalog01.png",
    name = "",
    price = "",
    rating = 0,
  } = item;

  const safeName = String(name);
  const safePrice = String(price);

  return `
<article class="topbestsets-card-container">
  <div class="topbestsets-card-media">
    <img src="${imageUrlTopBestMini}" alt="${safeName}">
  </div>
  <div class="topbestsets-card-body">
    <p class="topbestsets-card-description">${safeName}</p>
    <div class="topbestsets-card-star-container">
      ${getStarsHtml(rating)}
    </div>
    <p class="topbestsets-card-price">$${safePrice}</p>
  </div>
</article>
`;
}

// Multiple cards, using an options object
export function mountTopBestCard({ containerSelector, container, items } = {}) {
  // Resolve container: allow passing either a selector or a DOM element
  const target =
    container ||
    (typeof containerSelector === "string"
      ? document.querySelector(containerSelector)
      : null);

  if (!target) {
    console.warn(
      `[mountTopBestCard] Container not found for selector: '${containerSelector}'`
    );
    return;
  }

  if (!Array.isArray(items) || items.length === 0) {
    console.warn("[mountTopBestCard] 'items' should be a non-empty array.");
    target.innerHTML = "";
    return;
  }

  target.innerHTML = items.map((item) => getTopBestCard(item)).join("");
}
