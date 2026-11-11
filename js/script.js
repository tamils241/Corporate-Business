/* ============================================================
   Stackly — PankajUX India
   Authentication pages: registration & sign-in validation
   ============================================================ */

(function () {
  "use strict";

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /* ---------- Password visibility ---------- */

  document.querySelectorAll(".toggle-password").forEach(function (button) {
    const targetId = button.getAttribute("data-target");
    const input = targetId
      ? document.getElementById(targetId)
      : button.closest(".input-wrap")?.querySelector("input");

    if (!input) return;

    button.addEventListener("click", function () {
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      button.setAttribute("aria-label", show ? "Hide password" : "Show password");
    });
  });

  /* ---------- Helpers ---------- */

  function setMessage(element, text, state) {
    if (!element) return;
    element.textContent = text;
    element.setAttribute("data-state", state);
    element.style.color = state === "success" ? "#16834a" : state === "error" ? "#d71932" : "#526071";
  }

  function clearOnInput(form, message) {
    if (!form) return;
    form.querySelectorAll("input, select").forEach(function (input) {
      input.addEventListener(input.tagName === "SELECT" ? "change" : "input", function () {
        input.removeAttribute("aria-invalid");
        if (message && message.textContent) {
          message.textContent = "";
          message.removeAttribute("data-state");
        }
      });
    });
  }

  function markInvalid(input, invalid) {
    if (!input) return;
    if (invalid) {
      input.setAttribute("aria-invalid", "true");
    } else {
      input.removeAttribute("aria-invalid");
    }
  }

  /* ---------- Registration ---------- */

  const registerForm = document.getElementById("registerForm");
  const registerMessage = document.getElementById("registerMessage");

  if (registerForm) {
    const name = document.getElementById("registerName");
    const email = document.getElementById("registerEmail");
    const role = document.getElementById("registerRole");
    const password = document.getElementById("registerPassword");
    const confirm = document.getElementById("registerConfirm");
    const terms = document.getElementById("registerTerms");

    clearOnInput(registerForm, registerMessage);

    registerForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const nameValue = name ? name.value.trim() : "";
      const emailValue = email ? email.value.trim() : "";
      const roleValue = role ? role.value : "";
      const passwordValue = password ? password.value : "";
      const confirmValue = confirm ? confirm.value : "";
      const accepted = terms ? terms.checked : true;

      markInvalid(name, !nameValue);
      markInvalid(email, !emailPattern.test(emailValue));
      markInvalid(role, roleValue !== "client" && roleValue !== "admin");
      markInvalid(password, passwordValue.length < 8);
      if (confirm) markInvalid(confirm, confirmValue !== passwordValue || !confirmValue);
      markInvalid(terms, !accepted);

      if (!nameValue) {
        setMessage(registerMessage, "Please enter your full name.", "error");
        name?.focus();
        return;
      }

      if (!emailPattern.test(emailValue)) {
        setMessage(registerMessage, "Please enter a valid email address.", "error");
        email?.focus();
        return;
      }

      if (roleValue !== "client") {
        setMessage(registerMessage, "New accounts can only be registered as Client.", "error");
        role?.focus();
        return;
      }

      if (passwordValue.length < 8) {
        setMessage(registerMessage, "Password must be at least 8 characters.", "error");
        password?.focus();
        return;
      }

      if (confirm && confirmValue !== passwordValue) {
        setMessage(registerMessage, "Passwords do not match. Please try again.", "error");
        confirm.focus();
        return;
      }

      if (!accepted) {
        setMessage(registerMessage, "Please agree to the Terms and Privacy.", "error");
        terms?.focus();
        return;
      }

      setMessage(
        registerMessage,
        "Account details validated. Connect your signup API to create the account.",
        "success"
      );
    });
  }

  /* ---------- Sign in ---------- */

  const loginForm = document.getElementById("loginForm");
  const loginMessage = document.getElementById("loginMessage");

  if (loginForm) {
    const email = document.getElementById("loginEmail");
    const role = document.getElementById("loginRole");
    const password = document.getElementById("loginPassword");

    clearOnInput(loginForm, loginMessage);

    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const emailValue = email ? email.value.trim() : "";
      const roleValue = role ? role.value : "";
      const passwordValue = password ? password.value : "";

      markInvalid(email, !emailPattern.test(emailValue));
      markInvalid(role, roleValue !== "admin" && roleValue !== "client");
      markInvalid(password, !passwordValue);

      if (!emailPattern.test(emailValue)) {
        setMessage(loginMessage, "Please enter a valid email address.", "error");
        email?.focus();
        return;
      }

      if (roleValue !== "admin" && roleValue !== "client") {
        setMessage(loginMessage, "Please select a valid account role.", "error");
        role?.focus();
        return;
      }

      if (!passwordValue) {
        setMessage(loginMessage, "Please enter your password.", "error");
        password?.focus();
        return;
      }

      setMessage(
        loginMessage,
        "Sign-in details validated for the " + (roleValue === "admin" ? "Admin" : "Client") + " role. Connect your authentication API to continue.",
        "success"
      );
    });
  }

  /* ---------- Google OAuth placeholders ---------- */

  document.querySelectorAll(".google-button").forEach(function (button) {
    button.addEventListener("click", function () {
      const messageId = button.getAttribute("data-message");
      const message = messageId ? document.getElementById(messageId) : null;
      const isSignup = /sign up/i.test(button.textContent);
      setMessage(
        message,
        "Connect Google OAuth here to enable Google " + (isSignup ? "sign-up." : "sign-in."),
        "info"
      );
    });
  });
})();
