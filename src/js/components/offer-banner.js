function offerBanner(data) {
  const {
    discount = "50%",
    eyebrow = "Offer Of The Month",
    leadText = "Lorem ipsum dolor sit amet, consectetur",
    description = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse et inventore dolor",
    buttonText = "Shop now",
  } = data ?? {};

  return `<div class="offer-img">
          <div class="offer-center">
            <div class="offer-left-side">
              <div class="offer-body-text">
                <p class="discount-num">${discount}</p>
                <p class="main-description">
                  ${leadText}
                </p>
              </div>
            </div>
            <div class="offer-right-side">
              <div class="offer-body-text">
                <p>${eyebrow}</p>
                <p class="main-description">
                  ${description}
                </p>
                <button class="button-pink button-pink-60"> ${buttonText}</button>
              </div>
            </div>
          </div>
        </div>`;
}

export function mountOfferBanner(selector, data) {
  const container = document.querySelector(selector);
  if (!container) {
    console.warn(
      `[mountOfferBanner] Container not found for selector: '${selector}'`
    );
    return;
  }

  container.innerHTML = offerBanner(data);
}
