import { mountHeader } from "./components/header.js";
import { mountHeroTitle } from "./components/hero-title.js";
import { mountBenefits } from "./components/benefits.js";
import { mountFooter } from "./components/footer.js";
import { mountWhyChooseUs } from "./components/why-choose-us.js";
import { initFeedbackForm } from "./components/feedback-form.js";

const pageData = {
  title: "Contact US",
  img: "/src/assets/contact-us-img/hero-img.png",
  description:
    "Duis vestibulum elit vel neque pharetra vulputate. Duis rutrum non risus in imperdiet.",
};

export function initContactPage() {
  // Header
  mountHeader("#site-header", "contact");

  // Hero Page Title
  mountHeroTitle("#hero-section", pageData);

  // Why choose us
  mountWhyChooseUs("#why-choose-us");

  initFeedbackForm();

  // Benefits banner
  mountBenefits("#site-benefits");

  // Footer
  mountFooter("#site-footer");
}
