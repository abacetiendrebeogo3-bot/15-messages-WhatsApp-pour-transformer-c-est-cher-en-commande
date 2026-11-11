/**
 * Configuration rapide de la page de vente.
 * Modifie simplement ces valeurs pour ajuster le prix, le lien checkout,
 * le suivi Meta Pixel ou la garantie sans toucher au HTML.
 */
const SITE_CONFIG = {
  price: "2 500 FCFA",
  paymentUrl:
    "https://will-academy-2.mymaketou.shop/products/15-messages-whatsapp-pour-transformer-cest-cher-en-commande/checkout",
  // Paramètres des événements Meta Pixel (XOF = Afrique de l'Ouest, XAF = Afrique Centrale)
  pixelValue: 2500,
  pixelCurrency: "XOF",
  productName: "15 messages WhatsApp pour transformer c'est cher en commande",
  // Passe à false si tu ne souhaites pas proposer la garantie 7 jours
  showGuarantee: true,
};

document.addEventListener("DOMContentLoaded", () => {
  applySiteConfig();
  initMetaPixelEvents();
  initRevealAnimations();
  initStickyMobileBar();
  initLightbox();
});

function applySiteConfig() {
  document.querySelectorAll('[data-config="price"]').forEach((el) => {
    el.textContent = SITE_CONFIG.price;
  });

  if (SITE_CONFIG.paymentUrl) {
    document.querySelectorAll("[data-checkout-link]").forEach((el) => {
      el.setAttribute("href", SITE_CONFIG.paymentUrl);
    });
  }

  const guaranteeEl = document.getElementById("garantie");
  if (guaranteeEl && !SITE_CONFIG.showGuarantee) {
    guaranteeEl.hidden = true;
  }

  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}

function initMetaPixelEvents() {
  if (typeof window.fbq !== "function") return;

  window.fbq("track", "ViewContent", {
    content_name: SITE_CONFIG.productName,
    content_type: "product",
    value: SITE_CONFIG.pixelValue,
    currency: SITE_CONFIG.pixelCurrency,
  });

  document.querySelectorAll("[data-checkout-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const hasModifier =
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
      const href = link.getAttribute("href");
      if (hasModifier || !href || typeof window.fbq !== "function") return;

      event.preventDefault();
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

function initRevealAnimations() {
  const targets = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.02 }
  );

  targets.forEach((el) => observer.observe(el));
}

function initStickyMobileBar() {
  const stickyBar = document.getElementById("mobile-sticky");
  const hero = document.getElementById("accroche");
  const offer = document.getElementById("offre");
  if (!stickyBar || !hero || !("IntersectionObserver" in window)) return;

  let heroVisible = true;
  let offerVisible = false;

  const updateBar = () => {
    const show = !heroVisible && !offerVisible;
    stickyBar.classList.toggle("is-visible", show);
    stickyBar.setAttribute("aria-hidden", show ? "false" : "true");
  };

  const heroObserver = new IntersectionObserver(
    ([entry]) => {
      heroVisible = entry.isIntersecting;
      updateBar();
    },
    { threshold: 0.1 }
  );
  heroObserver.observe(hero);

  if (offer) {
    const offerObserver = new IntersectionObserver(
      ([entry]) => {
        offerVisible = entry.isIntersecting;
        updateBar();
      },
      { threshold: 0.05 }
    );
    offerObserver.observe(offer);
  }
}

function initLightbox() {
  const lightbox = document.getElementById("lightbox-modal");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");

  if (!lightbox || !lightboxImg) return;

  const closeLightbox = () => {
    lightbox.hidden = true;
    lightboxImg.src = "";
    document.body.style.overflow = "";
  };

  document.querySelectorAll("[data-lightbox]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const src = trigger.getAttribute("data-lightbox");
      const caption = trigger.getAttribute("data-caption") || "";
      if (!src) return;

      lightboxImg.src = src;
      lightboxImg.alt = caption;
      if (lightboxCaption) {
        lightboxCaption.textContent = caption;
      }
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
    });
  });

  lightbox.querySelectorAll("[data-close-lightbox]").forEach((el) => {
    el.addEventListener("click", closeLightbox);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) {
      closeLightbox();
    }
  });
}
