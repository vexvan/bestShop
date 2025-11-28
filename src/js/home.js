import { mountHeader } from "./components/header.js";
import { mountBenefits } from "./components/benefits.js";
import { mountTravelCards } from "./components/travel-card.js";
import { mountCustomerCards } from "./components/customer-card.js";
import {
  mountCatalogCard,
  mountCatalogCards,
} from "./components/catalog-card.js";
import { mountOfferBanner } from "./components/offer-banner.js";
import { mountFooter } from "./components/footer.js";

// Products data
import products from "../assets/data.json";

// Product tag utilities (pure functions)
function normBlocks(item) {
  const blocks = Array.isArray(item?.blocks) ? item.blocks : [];
  return blocks.map((b) =>
    (typeof b === "string" ? b : b?.name || "").toLowerCase()
  );
}

function hasTag(item, tag) {
  if (!tag) return false;
  return normBlocks(item).includes(tag.toLowerCase());
}

/**
 * Partition products by two tags:
 * - "New Products Arrival"
 * - "Selected Products"
 */
function partitionByTags(
  payload,
  tagA = "New Products Arrival",
  tagB = "Selected Products"
) {
  const arr = Array.isArray(payload) ? payload : payload?.data ?? [];

  const A = tagA.toLowerCase();
  const B = tagB.toLowerCase();

  const res = {
    newArrivals: [],
    selectedProducts: [],
    both: [],
    neither: [],
  };

  for (const item of arr) {
    const a = hasTag(item, A);
    const b = hasTag(item, B);
    if (a && b) res.both.push(item);
    else if (a) res.newArrivals.push(item);
    else if (b) res.selectedProducts.push(item);
    else res.neither.push(item);
  }
  return res;
}

// Precompute partitions once
const { newArrivals, selectedProducts, both } =
  partitionByTags(products);

const selectedPlusBoth = [...selectedProducts, ...both];
const newArrivalsPlusBoth = [...newArrivals, ...both];


// Static content data (travel & customer cards)
const TRAVEL_CARDS = [
  {
    title: "A Duis vestibulum elit vel neque.",
    description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.",
    imageUrl: "/src/assets/img-suitcases/travellg01.png",
  },
  {
    title: "B Duis vestibulum elit vel neque.",
    description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.",
    imageUrl: "/src/assets/img-suitcases/travellg01.png",
  },
  {
    title: "C Duis vestibulum elit vel neque.",
    description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.",
    imageUrl: "/src/assets/img-suitcases/travellg01.png",
  },
  {
    title: "D Duis vestibulum elit vel neque.",
    description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.",
    imageUrl: "/src/assets/img-suitcases/travellg01.png",
  },
];

const CUSTOMER_CARDS = [
  {
    title: "Ethan Wade, New York",
    imageUrl: "/src/assets/img/costumer1.png",
  },
  {
    title: "Mia Carter, London",
    imageUrl: "/src/assets/img/costumer1.png",
  },
  {
    title: "Noah Kim, Seoul",
    imageUrl: "/src/assets/img/costumer1.png",
  },
];


// Page-level init
function initHeader() {
  mountHeader("#site-header", "home");
}

function initTravelSection() {
  mountTravelCards(".travel-suitcase", TRAVEL_CARDS, {
    alt: "Travel suitcase",
  });
}

function initCustomerSection() {
  mountCustomerCards(".customer-slot", CUSTOMER_CARDS, {
    alt: "Customer photo",
  });
}

function initMainCatalogCarousels() {
  // Single demo card (only if element exists)
  if (document.querySelector("#catalog-card")) {
    mountCatalogCard("#catalog-card");
  }

  // Main catalog carousel
  mountCatalogCards({
    rootSelector: "#products-carousel",
    containerSelector: ".products-container",
    items: selectedPlusBoth,
    prevSelector: "#prev-btn-products",
    nextSelector: "#next-btn-products",
    pageContext: "home",
    pagingMode: "carousel",
  });

  // New products carousel
  mountCatalogCards({
    rootSelector: "#new-products-carousel",
    containerSelector: ".new-products-container",
    items: newArrivalsPlusBoth,
    prevSelector: "#prev-btn-new-products",
    nextSelector: "#next-btn-new-products",
    pageContext: "home",
    pagingMode: "carousel",
  });
}

function initOfferBanner() {
  mountOfferBanner("#offer-banner", {
    buttonText: "Get Discount",
  });
}

function initBenefits() {
  mountBenefits("#site-benefits");
}

function initFooter() {
  mountFooter("#site-footer");
}

// Page entrypoint
export function initHomePage() {
  initHeader();
  initTravelSection();
  initCustomerSection();
  initMainCatalogCarousels();
  initOfferBanner();
  initBenefits();
  initFooter();
}