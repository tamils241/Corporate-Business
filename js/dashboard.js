(function () {
  "use strict";

  const sidebar = document.getElementById("dashboardSidebar");
  const toggle = document.querySelector("[data-sidebar-toggle]");
  const scrim = document.querySelector("[data-sidebar-scrim]");

  if (!sidebar || !toggle || !scrim) return;

  function setSidebarOpen(isOpen) {
    sidebar.classList.toggle("is-open", isOpen);
    scrim.classList.toggle("is-visible", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  }

  toggle.addEventListener("click", function () {
    setSidebarOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  scrim.addEventListener("click", function () {
    setSidebarOpen(false);
  });

  sidebar.querySelectorAll(".sidebar-link").forEach(function (link) {
    link.addEventListener("click", function () {
      setSidebarOpen(false);
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setSidebarOpen(false);
      toggle.focus();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 900) setSidebarOpen(false);
  });
})();
