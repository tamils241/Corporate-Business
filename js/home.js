/* ============================================================
   Stackly — PankajUX India
   Homepage interactions
   ============================================================ */

(function () {
  "use strict";

  document.documentElement.dataset.homeReady = "true";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Hero background video ---------- */

  const heroVideo = document.querySelector(".hero-video, .page-hero__video");
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.defaultMuted = true;
    heroVideo.playsInline = true;
    heroVideo.addEventListener(
      "canplay",
      function () {
        heroVideo.play().catch(function (error) {
          console.warn("Hero video autoplay blocked:", error);
        });
      },
      { once: true }
    );
    heroVideo.load();
  }

  /* ---------- Sticky header & back-to-top ---------- */

  const header = document.getElementById("siteHeader");
  const toTop = document.getElementById("toTop");

  function handleScroll() {
    const y = window.scrollY || window.pageYOffset;

    if (header) {
      header.classList.toggle("is-stuck", y > 8);
    }

    if (toTop) {
      toTop.classList.toggle("is-visible", y > 700);
    }
  }

  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });

  /* ---------- Mobile navigation ---------- */

  const menuToggle = document.getElementById("menuToggle");
  const mobileNav = document.getElementById("mobileNav");
  let navOpen = false;

  function setNav(open) {
    navOpen = open;

    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", String(open));
      const label = menuToggle.querySelector(".sr-only");
      if (label) label.textContent = open ? "Close menu" : "Open menu";
    }

    if (mobileNav) {
      mobileNav.classList.toggle("is-open", open);
    }
  }

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", function () {
      setNav(!navOpen);
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setNav(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && navOpen) {
        setNav(false);
        menuToggle.focus();
      }
    });

    document.addEventListener("click", function (event) {
      if (!navOpen || !header) return;
      if (!header.contains(event.target)) setNav(false);
    });

    const desktopQuery = window.matchMedia("(min-width: 1025px)");
    const closeOnDesktop = function (event) {
      if (event.matches) setNav(false);
    };

    if (desktopQuery.addEventListener) {
      desktopQuery.addEventListener("change", closeOnDesktop);
    } else if (desktopQuery.addListener) {
      desktopQuery.addListener(closeOnDesktop);
    }
  }

  /* ---------- Scroll reveal ---------- */

  const revealItems = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  if (!("IntersectionObserver" in window) || reducedMotion) {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
    );

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });

    // Safety net for very fast scrolling or anchor jumps: reveal anything
    // whose top has passed the bottom edge of the viewport, even if the
    // observer never caught it while it was on screen.
    let revealTicking = false;

    function revealPassedItems() {
      const viewportHeight = window.innerHeight;

      revealItems.forEach(function (item) {
        if (
          !item.classList.contains("is-visible") &&
          item.getBoundingClientRect().top < viewportHeight
        ) {
          item.classList.add("is-visible");
          revealObserver.unobserve(item);
        }
      });

      revealTicking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (revealTicking) return;
        revealTicking = true;
        window.requestAnimationFrame(revealPassedItems);
      },
      { passive: true }
    );
  }

  /* ---------- Animated statistics ---------- */

  const counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
  const statsBlock = document.querySelector(".hero__stats");

  function setFinalValues() {
    counters.forEach(function (counter) {
      const target = Number(counter.getAttribute("data-count")) || 0;
      const suffix = counter.getAttribute("data-suffix") || "";
      counter.textContent = target + suffix;
    });
  }

  function runCounters() {
    counters.forEach(function (counter) {
      if (counter.dataset.animated === "true") return;
      counter.dataset.animated = "true";

      const target = Number(counter.getAttribute("data-count")) || 0;
      const suffix = counter.getAttribute("data-suffix") || "";
      const duration = 1500;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.round(target * eased) + suffix;

        if (progress < 1) {
          window.requestAnimationFrame(tick);
        } else {
          counter.textContent = target + suffix;
        }
      }

      window.requestAnimationFrame(tick);
    });
  }

  if (counters.length) {
    if (reducedMotion || !("IntersectionObserver" in window) || !statsBlock) {
      setFinalValues();
    } else {
      const statsObserver = new IntersectionObserver(
        function (entries, observer) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              runCounters();
              observer.disconnect();
            }
          });
        },
        { threshold: 0.25 }
      );

      statsObserver.observe(statsBlock);
    }
  }

  /* ---------- Project filtering ---------- */

  const filterButtons = Array.prototype.slice.call(document.querySelectorAll(".filter-btn"));
  const projectCards = Array.prototype.slice.call(document.querySelectorAll(".project-card"));
  const emptyState = document.getElementById("workEmpty");

  if (filterButtons.length && projectCards.length) {
    filterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const filter = button.getAttribute("data-filter");
        let visibleCount = 0;

        filterButtons.forEach(function (item) {
          const isActive = item === button;
          item.classList.toggle("is-active", isActive);
          item.setAttribute("aria-pressed", String(isActive));
        });

        projectCards.forEach(function (card) {
          const matches =
            filter === "all" || card.getAttribute("data-category") === filter;

          card.classList.toggle("is-hidden", !matches);

          if (matches) {
            visibleCount += 1;
            card.classList.add("is-visible");
          }
        });

        if (emptyState) {
          emptyState.hidden = visibleCount > 0;
        }
      });
    });
  }

  /* ---------- Newsletter ---------- */

  const newsletterForm = document.getElementById("newsletterForm");
  const newsletterEmail = document.getElementById("newsletterEmail");
  const newsletterMessage = document.getElementById("newsletterMessage");

  if (newsletterForm && newsletterEmail && newsletterMessage) {
    newsletterForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const value = newsletterEmail.value.trim();
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

      if (!isValid) {
        newsletterMessage.setAttribute("data-state", "error");
        newsletterMessage.textContent = value
          ? "Please enter a valid work email."
          : "Please enter your work email.";
        newsletterEmail.setAttribute("aria-invalid", "true");
        newsletterEmail.focus();
        return;
      }

      newsletterMessage.setAttribute("data-state", "success");
      newsletterMessage.textContent =
        "Thanks — you're on the list. The next issue lands in your inbox soon.";
      newsletterEmail.removeAttribute("aria-invalid");
      newsletterForm.reset();
    });

    newsletterEmail.addEventListener("input", function () {
      newsletterEmail.removeAttribute("aria-invalid");
      if (newsletterMessage.textContent) {
        newsletterMessage.textContent = "";
        newsletterMessage.removeAttribute("data-state");
      }
    });
  }

  /* ---------- Active navigation link ---------- */

  const navLinks = Array.prototype.slice.call(document.querySelectorAll(".main-nav a"));
  const navSections = navLinks
    .map(function (link) {
      const href = link.getAttribute("href");
      return href && href.charAt(0) === "#" ? document.querySelector(href) : null;
    })
    .filter(Boolean);

  if (navLinks.length && navSections.length && "IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          navLinks.forEach(function (link) {
            link.classList.toggle(
              "is-active",
              link.getAttribute("href") === "#" + entry.target.id
            );
          });
        });
      },
      { rootMargin: "-38% 0px -54% 0px", threshold: 0 }
    );

    navSections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  /* ---------- Footer year ---------- */

  const year = document.getElementById("year");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
})();
