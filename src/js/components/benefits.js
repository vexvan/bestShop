function getBenefitsHtml() {
  return `
<section class="our-benefits">
    <img src="/src/assets/img/vectorlines.svg" alt="Time" class="our-benefits-bg" />
    <div class="our-benefits-container layout-container">
        <h4 class="benefits-title">Our Benefits</h4>
        <div class="section-benefits-item">
        <div class="benefits-item">
            <img src="/src/assets/img/imgfly.svg" alt="Fly" />
            <p class="benefits-text">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            </p>
        </div>
        <div class="benefits-item">
            <img src="/src/assets/img/imgtrack.svg" alt="Track" />
            <p class="benefits-text">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            </p>
        </div>
        <div class="benefits-item">
            <img src="/src/assets/img/imgmoney.svg" alt="Money" />
            <p class="benefits-text">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            </p>
        </div>
        <div class="benefits-item">
            <img src="/src/assets/img/imgschool.svg" alt="School" />
            <p class="benefits-text">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            </p>
        </div>
        </div>
    </div>
</section>       
  `;
}

export function mountBenefits(selector) {
  const container = document.querySelector(selector);
  if (!container) {
    console.warn(
      `[mountBenefits] Container not found for selector: '${selector}'`
    );
    return;
  }
  container.innerHTML = getBenefitsHtml();
}
