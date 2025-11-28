function whyChooseUs() {
  return ` <div class="why-secton-main">
          <div class="reason-item">
            <div class="img-placeholder">
              <img
                src="/src/assets/about-us-img/superioricon.svg"
                alt="superior accurancy"
              />
            </div>
            <h4>Superior Accurancy</h4>
            <p class="main-description">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.Lorem
              ipsum dolor.
            </p>
          </div>
          <div class="reason-item">
            <div class="img-placeholder">
              <img src="/src/assets/about-us-img/awardicon.svg" alt="award" />
            </div>
            <h4>Awards</h4>
            <p class="main-description">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.Lorem
              ipsum dolor.
            </p>
          </div>
          <div class="reason-item">
            <div class="img-placeholder">
              <img
                src="/src/assets/about-us-img/ecologicalicon.png"
                alt="ecological"
              />
            </div>
            <h4>Ecological</h4>
            <p class="main-description">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.Lorem
              ipsum dolor.
            </p>
          </div>
          <div class="reason-item">
            <div class="img-placeholder">
              <img
                src="/src/assets/about-us-img/shippingicon.svg"
                alt="shipping woldwild"
              />
            </div>
            <h4>Shipping woldwild</h4>
            <p class="main-description">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.Lorem
              ipsum dolor.
            </p>
          </div>
        </div>`;
}

export function mountWhyChooseUs(selector) {
  const container = document.querySelector(selector);
  if (!container) {
    console.warn(
      `[mountWhyChooseUs] Container not found for selector: '${selector}'`
    );
    return;
  }
  container.innerHTML = whyChooseUs();
}
