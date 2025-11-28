import { mountHeader } from "./components/header.js";
import { mountHeroTitle } from "./components/hero-title.js";
import { mountBenefits } from "./components/benefits.js";
import { mountOfferBanner } from "./components/offer-banner.js";
import { mountFooter } from "./components/footer.js";
import { mountWhyChooseUs } from "./components/why-choose-us.js";

const pageData = {
  title: "About US",
  img: "/src/assets/about-us-img/hero-img.png",
  description:
    "Duis vestibulum elit vel neque pharetra vulputate. Duis rutrum non risus in imperdiet.",
};

function initHeader() {
  mountHeader("#site-header", "about");
}

function initHeroTitle() {
  mountHeroTitle("#hero-section", pageData);
}

function initWhyChooseUs() {
  mountWhyChooseUs("#why-choose-us");
}

function initOfferBanner() {
  mountOfferBanner("#offer-banner", {
    buttonText: "Get Offer Today",
  });
}

function initBenefits() {
  mountBenefits("#site-benefits");
}

function initFooter() {
  mountFooter("#site-footer");
}

// Page entrypoint
export function initAboutPage() {
  // Header
  initHeader();

  // Hero Page Title
  initHeroTitle();

  // Why choose us
  initWhyChooseUs();

  initOfferBanner();

  // Benefits banner
  initBenefits();

  // Footer
  initFooter();
}
