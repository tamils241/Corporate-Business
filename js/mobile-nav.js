(function () {
  "use strict";

  const toggle = document.getElementById("menuToggle");
  const mobileNav = document.getElementById("mobileNav");

  if (!toggle || !mobileNav) return;

  const header = toggle.closest(".site-mobile-header");

  function setNavOpen(isOpen) {
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    const label = toggle.querySelector(".sr-only");
    if (label) label.textContent = isOpen ? "Close menu" : "Open menu";
    mobileNav.classList.toggle("is-open", isOpen);
    mobileNav.setAttribute("aria-hidden", String(!isOpen));
  }

  toggle.addEventListener("click", function () {
    setNavOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  mobileNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      setNavOpen(false);
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setNavOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener("click", function (event) {
    if (toggle.getAttribute("aria-expanded") === "true" && !header.contains(event.target)) {
      setNavOpen(false);
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 760) setNavOpen(false);
  });
})();
