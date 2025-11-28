import { mountHeader } from "./components/header.js";
import { mountBenefits } from "./components/benefits.js";
import { mountFooter } from "./components/footer.js";
import { mountCatalogCards } from "./components/catalog-card.js";
import { mountTopBestCard } from "./components/topbest-card.js";

import {
  products,
  getRandomizedTopBest,
  sortTopBestByPriceAsc,
  sortTopBestByPriceDesc,
  sortTopBestByRatingDesc,
  filterProducts,
} from "./product-helpers.js";

// Local state for this page
const catalogState = {
  paginator: null,
  sortValue: "default",
};

function initHeader() {
  mountHeader("#site-header", "catalog");
}

function initTopBestModule() {
  mountTopBestCard({
    containerSelector: ".best-sets-products",
    items: getRandomizedTopBest(),
  });
}

function initBenefits() {
  mountBenefits("#site-benefits");
}

function initFooter() {
  mountFooter("#site-footer");
}

// Pagination helpers
function formatResultsText(pageInfo) {
  const { total, start, end } = pageInfo || {};
  if (!total || total === 0) {
    return "Showing 0 Results";
  }
  return `Showing ${start}-${end} of ${total} Results`;
}

function updateResultsText(selector, pageInfo) {
  const el =
    typeof selector === "string"
      ? document.querySelector(selector)
      : selector || null;

  if (!el) return;
  el.textContent = formatResultsText(pageInfo);
}

function renderPaginatorPages(pageInfo) {
  const container = document.querySelector("#products-pages");
  if (!container) return;

  const { totalPages, currentPage } = pageInfo;

  container.innerHTML = "";

  if (!totalPages || totalPages <= 1) {
    return;
  }

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = String(i);
    btn.className =
      "paginator-page" + (i === currentPage ? " paginator-page-active" : "");

    btn.addEventListener("click", () => {
      if (!catalogState.paginator) return;
      catalogState.paginator.goTo(i - 1);
    });

    container.appendChild(btn);
  }
}

// Filters: read from DOM
function getActiveFiltersFromUI() {
  const sizeEl = document.querySelector("#filter-size");
  const colorEl = document.querySelector("#filter-color");
  const categoryEl = document.querySelector("#filter-category");
  const salesRadio = document.querySelector(
    'input[name="filter-sales"][value="sales-only"]'
  );

  const getValue = (el) => {
    if (!el) return "";
    if (el.value === "all") return "";
    return el.value;
  };

  return {
    size: getValue(sizeEl),
    color: getValue(colorEl),
    category: getValue(categoryEl),
    salesOnly: !!salesRadio?.checked,
  };
}

// Core render function
function renderCatalog() {
  const filters = getActiveFiltersFromUI();
  let items = filterProducts(products, filters);

  switch (catalogState.sortValue) {
    case "price_asc":
      items = sortTopBestByPriceAsc(items);
      break;
    case "price_desc":
      items = sortTopBestByPriceDesc(items);
      break;
    case "popularity_desc":
      items = sortTopBestByRatingDesc(items);
      break;
    default:
      // default sorting
      break;
  }

  if (catalogState.paginator) {
    catalogState.paginator.destroy();
  }

  catalogState.paginator = mountCatalogCards({
    rootSelector: "#products-carousel",
    containerSelector: ".new-catalog-products-container",
    items,
    pageContext: "category",
    pageSize: 12,
    pagingMode: "pagination",
    prevSelector: "#prevBtn-products",
    nextSelector: "#nextBtn-products",
    onPageChange(pageInfo) {
      updateResultsText(".main-description", pageInfo);
      renderPaginatorPages(pageInfo);
    },
  });
}

// Resets each select to value="all"
function initFilterButtons() {
  const clearBtn = document.querySelector("#btn-filters-clear");
  const toggleBtn = document.querySelector("#btn-filters-toggle");
  const panel = document.querySelector(".filters-panel");

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      const sizeInput = document.querySelector("#filter-size");
      const colorInput = document.querySelector("#filter-color");
      const categoryInput = document.querySelector("#filter-category");
      const salesRadio = document.querySelector(
        'input[name="filter-sales"][value="sales-only"]'
      );

      if (sizeInput) sizeInput.value = "all";
      if (colorInput) colorInput.value = "all";
      if (categoryInput) categoryInput.value = "all";
      if (salesRadio) salesRadio.checked = false;

      // reset filter dropdown labels
      const filterDropdowns = document.querySelectorAll(
        ".sorting-dropdown.filter-dropdown"
      );
      filterDropdowns.forEach((dropdown) => {
        const labelEl = dropdown.querySelector(".sorting-dropdown-label");
        if (labelEl) {
          labelEl.textContent = "Choose option";
        }
      });

      // reset sort (optional)
      catalogState.sortValue = "default";

      renderCatalog();
    });
  }

  if (toggleBtn && panel) {
    toggleBtn.addEventListener("click", () => {
      const collapsed = panel.classList.toggle("is-collapsed");
      toggleBtn.textContent = collapsed ? "Show filters" : "Hide filters";
    });
  }
}

// Generic dropdown component
function initDropdown(dropdown, { onChange } = {}) {
  const button = dropdown.querySelector(".sorting-dropdown-button");
  const menu = dropdown.querySelector(".sorting-dropdown-menu");
  const labelEl = dropdown.querySelector(".sorting-dropdown-label");

  if (!button || !menu) return;

  // open / close
  button.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("is-open");
  });

  // click on option
  menu.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (!li) return;

    const text = li.textContent.trim();
    const value = li.dataset.value || "default";

    if (labelEl) {
      labelEl.textContent = text;
    }

    dropdown.classList.remove("is-open");

    if (typeof onChange === "function") {
      onChange({ value, text, dropdown, li });
    }
  });

  // click outside - close
  document.addEventListener("click", (event) => {
    if (!dropdown.contains(event.target)) {
      dropdown.classList.remove("is-open");
    }
  });
}

function initSortingDropdown() {
  const sortDropdown = document.querySelector(
    ".sorting-dropdown--sort[data-sort-dropdown]"
  );
  if (!sortDropdown) return;

  initDropdown(sortDropdown, {
    onChange: ({ value }) => {
      catalogState.sortValue = value || "default";
      renderCatalog();
    },
  });
}

function initFilterDropdowns() {
  const filterDropdowns = document.querySelectorAll(
    ".sorting-dropdown.filter-dropdown"
  );

  filterDropdowns.forEach((dropdown) => {
    const filterId = dropdown.dataset.filterId;
    if (!filterId) return;

    const hiddenInput = document.getElementById(filterId);
    if (!hiddenInput) return;

    initDropdown(dropdown, {
      onChange: ({ value }) => {
        hiddenInput.value = value || "all";
        renderCatalog();
      },
    });
  });
}

function initSalesFilter() {
  const salesRadio = document.querySelector(
    'input[name="filter-sales"][value="sales-only"]'
  );
  if (!salesRadio) return;

  salesRadio.addEventListener("change", () => {
    renderCatalog();
  });
}

// Page entrypoint
export function initCatalogPage() {
  initHeader();

  initSortingDropdown();
  initFilterDropdowns();
  initSalesFilter();
  initFilterButtons();
  renderCatalog();
  initTopBestModule();
  initBenefits();
  initFooter();
}
