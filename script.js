const SITE_CONFIG = {
  price: "2 500 FCFA",
  paymentUrl:
    "https://will-academy-2.mymaketou.shop/products/15-messages-whatsapp-pour-transformer-cest-cher-en-commande/checkout",
  pixelValue: 2500,
  pixelCurrency: "XOF",
  productName: "15 messages WhatsApp pour transformer c'est cher en commande",
  showGuarantee: true,
};

document.addEventListener("DOMContentLoaded", () => {
  applySiteConfig();
  initMetaPixelEvents();
  initStickyMobileBar();
  initLightbox();
});

function applySiteConfig() {
  if (!SITE_CONFIG.showGuarantee) {
    const g = document.getElementById("garantie");
    if (g) g.hidden = true;
  }
  document.querySelectorAll('[data-config="price"]').forEach((el) => {
    if (el.textContent !== SITE_CONFIG.price) el.textContent = SITE_CONFIG.price;
  });
  if (SITE_CONFIG.paymentUrl) {
    document.querySelectorAll("[data-checkout-link]").forEach((el) => {
      if (el.getAttribute("href") !== SITE_CONFIG.paymentUrl) {
        el.setAttribute("href", SITE_CONFIG.paymentUrl);
      }
    });
  }
  const y = document.getElementById("current-year");
  const yr = String(new Date().getFullYear());
  if (y && y.textContent !== yr) y.textContent = yr;
}

function initMetaPixelEvents() {
  if (typeof window.fbq !== "function") return;

  window.fbq("track", "ViewContent", {
    content_name: SITE_CONFIG.productName,
    content_type: "product",
    value: SITE_CONFIG.pixelValue,
    currency: SITE_CONFIG.pixelCurrency,
  });

  let navigating = false;
  document.querySelectorAll("[data-checkout-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const hasModifier =
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
      const href = link.getAttribute("href");
      if (hasModifier || !href || typeof window.fbq !== "function") return;

      event.preventDefault();
      if (navigating) return;
      navigating = true;

      window.fbq("track", "InitiateCheckout", {
        content_name: SITE_CONFIG.productName,
        content_type: "product",
        num_items: 1,
        value: SITE_CONFIG.pixelValue,
        currency: SITE_CONFIG.pixelCurrency,
      });

      window.setTimeout(() => {
        window.location.href = href;
      }, 150);
    });
  });
}

function initStickyMobileBar() {
  const stickyBar = document.getElementById("mobile-sticky");
  const hero = document.getElementById("accroche");
  const offer = document.getElementById("offre");
  if (!stickyBar || !hero || !("IntersectionObserver" in window)) return;

  let heroVisible = true;
  let offerVisible = false;
  const update = () => {
    const show = !heroVisible && !offerVisible;
    stickyBar.classList.toggle("is-visible", show);
    stickyBar.setAttribute("aria-hidden", show ? "false" : "true");
  };

  new IntersectionObserver(
    ([e]) => {
      heroVisible = e.isIntersecting;
      update();
    },
    { threshold: 0.1 }
  ).observe(hero);

  if (offer) {
    new IntersectionObserver(
      ([e]) => {
        offerVisible = e.isIntersecting;
        update();
      },
      { threshold: 0.05 }
    ).observe(offer);
  }
}

function initLightbox() {
  const lightbox = document.getElementById("lightbox-modal");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  if (!lightbox || !lightboxImg) return;

  const close = () => {
    lightbox.hidden = true;
    lightboxImg.src = "";
    document.body.style.overflow = "";
  };

  document.querySelectorAll("[data-lightbox]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const src = trigger.getAttribute("data-lightbox");
      if (!src) return;
      const caption = trigger.getAttribute("data-caption") || "";
      lightboxImg.src = src;
      lightboxImg.alt = caption;
      if (lightboxCaption) lightboxCaption.textContent = caption;
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
    });
  });

  lightbox.querySelectorAll("[data-close-lightbox]").forEach((el) => el.addEventListener("click", close));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightbox.hidden) close();
  });
}
