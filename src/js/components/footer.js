function renderList(items = []) {
  if (!Array.isArray(items) || !items.length) return "";
  return items.map((text) => `<li>${text}</li>`).join("");
}

// Returns footer HTML string
export function getFooterHtml(data = {}) {
  const {
    aboutTitle = "About us",
    aboutLinks = ["Organisation", "Partners", "Clients"],

    interestingTitle = "Interesting Links",
    interestingLinks = ["Photo Gallery", "Our Team", "Socials"],

    achievementsTitle = "Achivements",
    achievementsLinks = ["Winning Awards", "Press", "Our Amazing Clients"],

    contactTitle = "Contact Us",
    contactText = "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deserunt laudantium vitae minima qui ut corrupti, praesentium quia delectus, tempora libero repellat.",

    shippingTitle = "Shipping Information",
    shippingText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis nesciunt delectus eveniet nostrum, inventore hic eaque iusto, incidunt vitae, cumque necessitatibus laborum at. Lorem ipsum dolor sit amet consectetur adipisicing elit.",

    phoneLabel = "Phone:",
    phoneNumber = "(+63) 236 6322",
    emailLabel = "",
    emailAddress = "public@news.com",
    timeLabel = "",
    timeText = "Mon - Fri: 10am - 6pm Sat-Sun: 10am - 6pm",
    placeLabel = "",
    placeText = "639 Jade Valley, Washington Dc",
  } = data;

  return `
<div class="layout-container">
  <div class="site-footer-top">
    <div class="site-footer-submenu">
      <h4><a href="/src/html/about.html" class="link-reset">${aboutTitle}</a></h4>
      <ul>
        ${renderList(aboutLinks)}
      </ul>
    </div>

    <div class="site-footer-submenu">
      <h4>${interestingTitle}</h4>
      <ul>
        ${renderList(interestingLinks)}
      </ul>
    </div>

    <div class="site-footer-submenu">
      <h4>${achievementsTitle}</h4>
      <ul>
        ${renderList(achievementsLinks)}
      </ul>
    </div>

    <div></div>

    <div class="site-footer-info">
      <h4><a href="/src/html/contact.html" class="link-reset">${contactTitle}</a></h4>
      <p class="line-height-custom">
        ${contactText}
      </p>
    </div>
  </div>

  <div class="site-footer-bottom">
    <div class="site-footer-info">
      <h4>${shippingTitle}</h4>
      <p class="line-height-custom">
        ${shippingText}
      </p>
    </div>

    <div></div>

    <div class="info-layout-container">
      <div class="site-footer-contact-details">
        <img src="/src/assets/img/iconphone.svg" alt="Phone" />
        <p>${phoneLabel} ${phoneNumber}</p>
      </div>

      <div class="site-footer-contact-details">
        <img src="/src/assets/img/iconemail.svg" alt="Email" />
        <p>${emailLabel} ${emailAddress}</p>
      </div>

      <div class="site-footer-contact-details">
        <img src="/src/assets/img/icontime.svg" alt="Time" />
        <p class="line-height-custom">
          ${timeLabel} ${timeText}
        </p>
      </div>

      <div class="site-footer-contact-details">
        <img src="/src/assets/img/map-pin.svg" alt="Place" />
        <p class="line-height-custom">
          ${placeLabel} ${placeText}
        </p>
      </div>
    </div>
    <div class="copyright">© Copyright 2025</div>
  </div>
</div>
  `;
}

// Mounts the footer into a selector /or a DOM element
export function mountFooter(target, data) {
  let container = null;

  if (typeof target === "string") {
    container = document.querySelector(target);
  } else {
    container = target || null;
  }

  if (!container) {
    console.warn(`[mountFooter] Container not found for target: '${target}'`);
    return;
  }

  container.innerHTML = getFooterHtml(data);
}
