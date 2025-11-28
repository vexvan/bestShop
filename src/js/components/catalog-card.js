function getCatalogCard(item = {}, page = "home") {
  const { imageUrl, name, price, salesStatus, blocks, id } = item ?? {};

  // Basic fallbacks
  const rawTitle = name || "Unnamed product";
  const image = imageUrl || "/src/assets/img-suitcases/cataloglg01.png";

  // Escaped for attributes
  const safeTitleAttr = String(rawTitle).replace(/"/g, "&quot;");
  const title = String(rawTitle);

  // Price formatting
  const numericPrice = Number(price);
  const formattedPrice = Number.isFinite(numericPrice)
    ? numericPrice.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    : String(price ?? 0);

  // Detect "New Products Arrival"
  const getBlockLabel = (block) => {
    if (typeof block === "string") return block;
    if (block && typeof block.name === "string") return block.name;
    return "";
  };

  const hasNewProductsArrival =
    Array.isArray(blocks) &&
    blocks.some((block) =>
      getBlockLabel(block).includes("New Products Arrival")
    );

  const isViewProduct = page === "home" && hasNewProductsArrival;
  const cta = isViewProduct ? "View Product" : "Add To Cart";

  // Product page URL
  const productUrl = id
    ? `/src/html/product.html?id=${encodeURIComponent(id)}`
    : "#";

  const badge = salesStatus ? "Sale" : null;

  const ctaContent = `<span class="catalog-card-cta-text">${cta}</span>`;

  // CTA: link only for "View Product", button for "Add To Cart"
  const ctaMarkup = isViewProduct
    ? `
      <a href="${productUrl}" class="catalog-card-cta catalog-card-cta-link">
        ${ctaContent}
      </a>
    `
    : `
      <button
        class="catalog-card-cta"
        type="button"
        data-product-id="${id ?? ""}"
        data-product-name="${safeTitleAttr}"
        data-product-price="${formattedPrice}"
      >
        ${ctaContent}
      </button>
    `;

  const article = `
<article class="catalog-card-container">
  <div class="catalog-card-media">
    <a href="${productUrl}" class="catalog-card-link-image">
      <img src="${image}" alt="${safeTitleAttr}" class="catalog-card-image" />
    </a>
    ${
      badge
        ? `
    <div class="catalog-card-badge">
      <span class="catalog-card-badge-text">${badge}</span>
    </div>`
        : ""
    }
  </div>

  <div class="catalog-card-body">
    <div class="catalog-card-body-container">
      <h4 class="catalog-card-title">
        <a href="${productUrl}" class="catalog-card-link">
          ${title}
        </a>
      </h4>
      <p class="catalog-card-price">
        <a href="${productUrl}" class="catalog-card-link">
          $${formattedPrice}
        </a>
      </p>
      ${ctaMarkup}
    </div>
  </div>
</article>
  `.trim();

  return article;
}

// Mount a single card
export function mountCatalogCard(target, item, page) {
  const container =
    typeof target === "string"
      ? document.querySelector(target)
      : target || null;

  if (!container) {
    console.warn(
      `[mountCatalogCard] Container not found for target: '${target}'`
    );
    return;
  }

  container.innerHTML = getCatalogCard(item, page);
}

function normalizeItems(items) {
  if (Array.isArray(items)) return items;

  const fallback = items?.products ?? items?.items ?? items?.data;
  if (Array.isArray(fallback)) return fallback;

  console.warn(
    "[mountCatalogCards] 'items' could not be normalised to an array."
  );
  return [];
}

function resolveRoot(rootSelector) {
  if (!rootSelector) return null;
  return typeof rootSelector === "string"
    ? document.querySelector(rootSelector)
    : rootSelector || null;
}

function resolveContainer(root, containerSelector) {
  if (!containerSelector) return null;

  if (root) {
    let container = root.querySelector(containerSelector);
    if (!container) {
      container = document.createElement("div");
      container.className = containerSelector.replace(/^[.#]/, "");
      root.appendChild(container);
    }
    return container;
  }

  return typeof containerSelector === "string"
    ? document.querySelector(containerSelector)
    : containerSelector || null;
}

function applyDefaultLayout(container) {
  if (!container) return;
  container.classList.add("products-grid");
}

function findButton(root, selector, name) {
  if (!selector) return null;

  const el = root
    ? root.querySelector(selector)
    : document.querySelector(selector);

  if (!el) {
    console.warn(
      `[mountCatalogCards] ${name} button not found for selector '${selector}'.`
    );
  }

  return el;
}

function renderEmptyState(container, prevBtn, nextBtn, onPageChange) {
  container.innerHTML =
    '<p role="status" style="text-align:center;">No items</p>';

  if (prevBtn) prevBtn.disabled = true;
  if (nextBtn) nextBtn.disabled = true;

  const pageInfo = {
    totalPages: 0,
    total: 0,
    pageIndex: 0,
    currentPage: 1,
    start: 0,
    end: 0,
  };

  if (typeof onPageChange === "function") {
    onPageChange(pageInfo);
  }

  return pageInfo;
}

function getCarouselPage({ data, pageIndex, pageSize, totalPages }) {
  // wrap
  if (pageIndex < 0) pageIndex = totalPages - 1;
  if (pageIndex >= totalPages) pageIndex = 0;

  const startIndex = pageIndex * pageSize;
  const slice = [];
  const count = pageSize; // original logic always used pageSize

  for (let i = 0; i < count; i++) {
    slice.push(data[(startIndex + i) % data.length]);
  }

  const disable = data.length <= pageSize;

  const pageInfo = {
    totalPages,
    total: data.length,
    pageIndex,
    currentPage: pageIndex + 1,
    start: data.length ? startIndex + 1 : 0,
    end: data.length ? startIndex + slice.length : 0,
  };

  return {
    slice,
    disablePrev: disable,
    disableNext: disable,
    pageInfo,
    pageIndex,
  };
}

function getClassicPage({ data, pageIndex, pageSize, totalPages }) {
  if (pageIndex < 0) pageIndex = 0;
  if (pageIndex >= totalPages) pageIndex = totalPages - 1;

  const startIndex = pageIndex * pageSize;
  const endIndex = Math.min(startIndex + pageSize, data.length);
  const slice = data.slice(startIndex, endIndex);

  const total = data.length;
  const visible = slice.length;
  const start = total ? startIndex + 1 : 0;
  const end = total ? startIndex + visible : 0;

  const pageInfo = {
    totalPages,
    total,
    pageIndex,
    currentPage: pageIndex + 1,
    start,
    end,
  };

  return {
    slice,
    disablePrev: pageIndex === 0,
    disableNext: pageIndex >= totalPages - 1,
    pageInfo,
    pageIndex,
  };
}

function renderSlice(container, slice, cardRenderer, pageContext) {
  container.innerHTML = slice
    .map(
      (item) =>
        `<div class="product-cell" style="display:flex;justify-content:center;">${cardRenderer(
          item,
          pageContext
        )}</div>`
    )
    .join("");
}

function updateButtons(prevBtn, nextBtn, disablePrev, disableNext) {
  if (prevBtn) prevBtn.disabled = disablePrev;
  if (nextBtn) nextBtn.disabled = disableNext;
}

// Mount many cards with pagination / carousel
export function mountCatalogCards({
  rootSelector, // optional wrapper (e.g. ".products-carousel")
  containerSelector, // created if missing under root
  items = [],
  prevSelector,
  nextSelector,
  applyLayout = true, // set false if you style via SCSS
  pageSize: rawPageSize = 4,
  pageContext = "home", // "home" | "category" | etc
  renderCard, // optional custom renderer
  pagingMode = "carousel", // "carousel" | "pagination"
  onPageChange,
} = {}) {
  // Guard pageSize
  let pageSize = rawPageSize;
  if (!Number.isFinite(pageSize) || pageSize <= 0) {
    console.warn(
      `[mountCatalogCards] Invalid pageSize '${pageSize}', falling back to 4.`
    );
    pageSize = 4;
  }

  const root = resolveRoot(rootSelector);
  const container = resolveContainer(root, containerSelector);

  if (!container) {
    console.warn(
      `[mountCatalogCards] Container not found for '${containerSelector}'.`
    );
    return;
  }


  if (applyLayout) {
    applyDefaultLayout(container);
  }

  const data = normalizeItems(items);

  const prevBtn = findButton(root, prevSelector, "Prev");
  const nextBtn = findButton(root, nextSelector, "Next");

  const cardRenderer =
    typeof renderCard === "function"
      ? renderCard
      : (item, page) => getCatalogCard(item, page);

  let pageIndex = 0;
  let pageInfo = {
    totalPages: 0,
    total: data.length,
    pageIndex: 0, // 0-based
    currentPage: 1, // 1-based
    start: 0,
    end: 0,
  };

  function render() {
    if (!Array.isArray(data) || data.length === 0) {
      pageInfo = renderEmptyState(container, prevBtn, nextBtn, onPageChange);
      return;
    }

    const totalPages = Math.ceil(data.length / pageSize) || 1;
    const pagingArgs = { data, pageIndex, pageSize, totalPages };

    const {
      slice,
      disablePrev,
      disableNext,
      pageInfo: info,
      pageIndex: newIndex,
    } = pagingMode === "carousel"
      ? getCarouselPage(pagingArgs)
      : getClassicPage(pagingArgs);

    pageIndex = newIndex;
    pageInfo = info;

    if (typeof onPageChange === "function") {
      onPageChange(pageInfo);
    }

    renderSlice(container, slice, cardRenderer, pageContext);
    updateButtons(prevBtn, nextBtn, disablePrev, disableNext);
  }

  const onPrev = () => {
    pageIndex -= 1;
    render();
  };

  const onNext = () => {
    pageIndex += 1;
    render();
  };

  prevBtn?.addEventListener("click", onPrev);
  nextBtn?.addEventListener("click", onNext);

  render();

  return {
    render,
    goTo(i) {
      const totalPages = Math.ceil((data.length || 1) / pageSize) || 1;

      if (pagingMode === "carousel") {
        // wrap index
        pageIndex = ((i % totalPages) + totalPages) % totalPages;
      } else {
        // clamp index
        pageIndex = Math.max(0, Math.min(i, totalPages - 1));
      }

      render();
    },
    destroy() {
      prevBtn?.removeEventListener("click", onPrev);
      nextBtn?.removeEventListener("click", onNext);
    },
    getPageInfo() {
      return { ...pageInfo };
    },
  };
}
