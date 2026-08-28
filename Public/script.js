"use strict";

// Escribe aquí el número completo, solo con dígitos. Ejemplo Panamá: 50760000000
const WHATSAPP_NUMBER = "";
const WHATSAPP_MESSAGE = "Hola, quiero información sobre los cursos de manejo.";

const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");
const navigationLinks = [...document.querySelectorAll(".main-nav a")];
const toast = document.querySelector(".toast");
let toastTimer;

function setMenu(open) {
  if (!menuButton || !navigation) return;
  menuButton.classList.toggle("is-open", open);
  navigation.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
}

menuButton?.addEventListener("click", () => {
  setMenu(!navigation?.classList.contains("is-open"));
});

navigationLinks.forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 760) setMenu(false);
});

window.addEventListener(
  "scroll",
  () => header?.classList.toggle("is-scrolled", window.scrollY > 24),
  { passive: true }
);

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 4200);
}

document.querySelectorAll("[data-whatsapp-link]").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (!WHATSAPP_NUMBER) {
      event.preventDefault();
      showToast("Agrega tu número en WHATSAPP_NUMBER dentro de script.js.");
      return;
    }

    link.setAttribute(
      "href",
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
    );
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });
});

document.querySelectorAll(".image-slot img").forEach((image) => {
  const slot = image.closest(".image-slot");
  const markMissing = () => slot?.classList.add("is-missing");
  const markReady = () => slot?.classList.remove("is-missing");

  image.addEventListener("error", markMissing);
  image.addEventListener("load", markReady);

  if (image.complete) {
    image.naturalWidth > 0 ? markReady() : markMissing();
  }
});

const revealItems = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px" }
);

revealItems.forEach((item) => revealObserver.observe(item));

const observedSections = document.querySelectorAll("header[id], section[id], main[id]");
const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    const activeId = visible.target.id === "contenido" ? "inicio" : visible.target.id;
    navigationLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${activeId}`);
    });
  },
  { rootMargin: "-25% 0px -62%", threshold: [0.01, 0.2, 0.5] }
);

observedSections.forEach((section) => sectionObserver.observe(section));

const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const motionAllowed = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canHover && motionAllowed) {
  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${y * -3}deg) rotateY(${x * 4}deg) translateY(-7px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

document.querySelectorAll("[data-counter]").forEach((counter) => {
  const target = Number(counter.getAttribute("data-counter"));
  if (!Number.isFinite(target) || !motionAllowed) return;

  let started = false;
  const counterObserver = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting || started) return;
      started = true;
      const start = performance.now();
      const duration = 900;

      function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = String(Math.round(target * eased));
        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
      counterObserver.disconnect();
    },
    { threshold: 0.5 }
  );

  counterObserver.observe(counter);
});

document.querySelectorAll("[data-current-year]").forEach((item) => {
  item.textContent = String(new Date().getFullYear());
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});
