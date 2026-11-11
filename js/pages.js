/* ============================================================
   Stackly — PankajUX India
   Interior page interactions: blog filtering & contact form
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Blog category filtering ---------- */

  const blogButtons = Array.prototype.slice.call(
    document.querySelectorAll("[data-blog-filter]")
  );
  const blogCards = Array.prototype.slice.call(document.querySelectorAll(".post-card"));
  const blogEmpty = document.getElementById("blogEmpty");

  if (blogButtons.length && blogCards.length) {
    blogButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const filter = button.getAttribute("data-blog-filter");
        let visibleCount = 0;

        blogButtons.forEach(function (item) {
          const isActive = item === button;
          item.classList.toggle("is-active", isActive);
          item.setAttribute("aria-pressed", String(isActive));
        });

        blogCards.forEach(function (card) {
          const matches =
            filter === "all" || card.getAttribute("data-category") === filter;

          card.classList.toggle("is-hidden", !matches);

          if (matches) {
            visibleCount += 1;
            card.classList.add("is-visible");
          }
        });

        if (blogEmpty) {
          blogEmpty.hidden = visibleCount > 0;
        }
      });
    });
  }

  /* ---------- Searchable article archive ---------- */

  const articleSearch = document.getElementById("articleSearch");
  const articleButtons = Array.prototype.slice.call(
    document.querySelectorAll(".article-filter[data-filter]")
  );
  const articleCards = Array.prototype.slice.call(
    document.querySelectorAll(".article-card[data-category]")
  );
  const articlesEmpty = document.getElementById("articlesEmpty");

  if (articleSearch && articleButtons.length && articleCards.length && articlesEmpty) {
    let activeArticleCategory = "all";

    function filterArticles() {
      const searchTerm = articleSearch.value.trim().toLowerCase();
      let visibleCount = 0;

      articleCards.forEach(function (card) {
        const categories = (card.getAttribute("data-category") || "").split(/\s+/);
        const matchesCategory =
          activeArticleCategory === "all" ||
          categories.includes(activeArticleCategory);
        const matchesSearch = card.textContent.toLowerCase().includes(searchTerm);
        const isVisible = matchesCategory && matchesSearch;

        card.hidden = !isVisible;
        if (isVisible) {
          card.classList.add("is-visible");
          visibleCount += 1;
        }
      });

      articlesEmpty.hidden = visibleCount > 0;
    }

    articleButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        activeArticleCategory = button.getAttribute("data-filter") || "all";

        articleButtons.forEach(function (item) {
          const isActive = item === button;
          item.classList.toggle("active", isActive);
          item.setAttribute("aria-pressed", String(isActive));
        });

        filterArticles();
      });
    });

    articleSearch.addEventListener("input", filterArticles);
  }

  /* ---------- Blog newsletter ---------- */

  const blogSubscribeForm = document.getElementById("blogSubscribeForm");
  const blogSubscribeEmail = document.getElementById("blogSubscribeEmail");
  const blogSubscribeMessage = document.getElementById("blogSubscribeMessage");

  if (blogSubscribeForm && blogSubscribeEmail && blogSubscribeMessage) {
    blogSubscribeForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const value = blogSubscribeEmail.value.trim();
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

      if (!isValid) {
        blogSubscribeMessage.setAttribute("data-state", "error");
        blogSubscribeMessage.textContent = value
          ? "Please enter a valid work email."
          : "Please enter your work email.";
        blogSubscribeEmail.setAttribute("aria-invalid", "true");
        blogSubscribeEmail.focus();
        return;
      }

      blogSubscribeMessage.setAttribute("data-state", "success");
      blogSubscribeMessage.textContent =
        "Thanks — you're on the list. The next issue lands in your inbox soon.";
      blogSubscribeEmail.removeAttribute("aria-invalid");
      blogSubscribeForm.reset();
    });

    blogSubscribeEmail.addEventListener("input", function () {
      blogSubscribeEmail.removeAttribute("aria-invalid");
      if (blogSubscribeMessage.textContent) {
        blogSubscribeMessage.textContent = "";
        blogSubscribeMessage.removeAttribute("data-state");
      }
    });
  }

  /* ---------- Contact form ---------- */

  const contactForm = document.getElementById("contactForm");
  const formMessage = document.getElementById("contactFormMessage");

  if (contactForm && formMessage) {
    const nameField = document.getElementById("contactName");
    const emailField = document.getElementById("contactEmail");
    const messageField = document.getElementById("contactMessage");

    function markInvalid(field, invalid) {
      if (!field) return;
      if (invalid) {
        field.setAttribute("aria-invalid", "true");
      } else {
        field.removeAttribute("aria-invalid");
      }
    }

    function clearMessage() {
      formMessage.textContent = "";
      formMessage.removeAttribute("data-state");
    }

    [nameField, emailField, messageField].forEach(function (field) {
      if (!field) return;
      field.addEventListener("input", function () {
        markInvalid(field, false);
        if (formMessage.textContent) clearMessage();
      });
    });

    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = nameField ? nameField.value.trim() : "";
      const email = emailField ? emailField.value.trim() : "";
      const message = messageField ? messageField.value.trim() : "";
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

      markInvalid(nameField, !name);
      markInvalid(emailField, !emailPattern.test(email));
      markInvalid(messageField, !message);

      if (!name) {
        formMessage.setAttribute("data-state", "error");
        formMessage.textContent = "Please tell us your name.";
        if (nameField) nameField.focus();
        return;
      }

      if (!emailPattern.test(email)) {
        formMessage.setAttribute("data-state", "error");
        formMessage.textContent = "Please enter a valid work email.";
        if (emailField) emailField.focus();
        return;
      }

      if (!message) {
        formMessage.setAttribute("data-state", "error");
        formMessage.textContent = "Please add a short note about your project.";
        if (messageField) messageField.focus();
        return;
      }

      formMessage.setAttribute("data-state", "success");
      formMessage.textContent =
        "Thanks, " + name.split(" ")[0] + " — your message is ready. We'll reply within one business day.";
      contactForm.reset();
    });
  }
})();
