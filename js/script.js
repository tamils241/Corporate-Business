/* ============================================================
   Stackly — PankajUX India
   Authentication pages: registration & sign-in validation
   ============================================================ */

(function () {
  "use strict";

  /* Valid email IDs:   sun@gmail.com, sun122@gmail.com
     Invalid email IDs: sun@123.com, sun@123hhd.com (the domain must
     start with a letter; the local part starts with a letter and can
     contain letters and digits only). */
  const emailPattern = /^[A-Za-z][A-Za-z0-9]*@[A-Za-z][A-Za-z0-9]*(\.[A-Za-z][A-Za-z0-9]*)*\.[A-Za-z]{2,}$/;

  /* Name: letters only, maximum 16 characters. Numbers, spaces and
     special characters are not allowed. */
  const namePattern = /^[A-Za-z]{1,16}$/;

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

  /* Failed check: alert the user and show the inline message. */
  function fail(input, message, text) {
    alert(text);
    setMessage(message, text, "error");
    if (input) input.focus();
  }

  /* Strong password: at least 8 characters with an uppercase letter,
     a lowercase letter, a number and a special character. Returns ""
     when the password is strong, otherwise the reason it is not. */
  function getPasswordError(value) {
    if (value.length < 8) return "Password must be at least 8 characters long.";
    if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter (A-Z).";
    if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter (a-z).";
    if (!/[0-9]/.test(value)) return "Password must contain at least one number (0-9).";
    if (!/[^A-Za-z0-9]/.test(value)) return "Password must contain at least one special character (e.g. !@#$%).";
    return "";
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
      const passwordError = getPasswordError(passwordValue);
      const confirmValue = confirm ? confirm.value : "";
      const accepted = terms ? terms.checked : true;

      markInvalid(name, !namePattern.test(nameValue));
      markInvalid(email, !emailValue || !emailPattern.test(emailValue));
      markInvalid(role, roleValue !== "client" && roleValue !== "admin");
      markInvalid(password, Boolean(passwordError));
      if (confirm) markInvalid(confirm, confirmValue !== passwordValue || !confirmValue);
      markInvalid(terms, !accepted);

      if (roleValue !== "client" && roleValue !== "admin") {
        fail(role, registerMessage, "Please select your role (Client or Admin).");
        return;
      }

      if (!nameValue) {
        fail(name, registerMessage, "Please enter your name.");
        return;
      }

      if (!namePattern.test(nameValue)) {
        fail(
          name,
          registerMessage,
          nameValue.length > 16
            ? "Name can only be up to 16 characters."
            : "Name can only contain letters (no numbers, spaces or special characters)."
        );
        return;
      }

      if (!emailValue) {
        fail(email, registerMessage, "Please enter your email.");
        return;
      }

      if (!emailPattern.test(emailValue)) {
        fail(email, registerMessage, "Invalid email. Use a valid email like sun@gmail.com or sun122@gmail.com.");
        return;
      }

      if (passwordError) {
        fail(password, registerMessage, passwordError);
        return;
      }

      if (confirm && confirmValue !== passwordValue) {
        fail(confirm, registerMessage, "Passwords do not match. Please try again.");
        return;
      }

      if (!accepted) {
        fail(terms, registerMessage, "Please agree with the Terms and Privacy.");
        return;
      }

      setMessage(
        registerMessage,
        "Account created successfully. Redirecting to the sign-in page...",
        "success"
      );

      window.location.href = "login.html";
    });
  }

  /* ---------- Sign in ---------- */

  const loginForm = document.getElementById("loginForm");
  const loginMessage = document.getElementById("loginMessage");

  if (loginForm) {
    const email = document.getElementById("loginEmail");
    const role = document.getElementById("loginRole");
    const password = document.getElementById("loginPassword");
    const remember = document.getElementById("rememberMe");

    clearOnInput(loginForm, loginMessage);

    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const emailValue = email ? email.value.trim() : "";
      const roleValue = role ? role.value : "";
      const passwordValue = password ? password.value : "";
      const passwordError = getPasswordError(passwordValue);
      const remembered = remember ? remember.checked : true;

      markInvalid(email, !emailValue || !emailPattern.test(emailValue));
      markInvalid(role, roleValue !== "admin" && roleValue !== "client");
      markInvalid(password, Boolean(passwordError));
      markInvalid(remember, !remembered);

      if (roleValue !== "admin" && roleValue !== "client") {
        fail(role, loginMessage, "Please select your role (Client or Admin).");
        return;
      }

      if (!emailValue) {
        fail(email, loginMessage, "Please enter your email.");
        return;
      }

      if (!emailPattern.test(emailValue)) {
        fail(email, loginMessage, "Invalid email. Use a valid email like sun@gmail.com or sun122@gmail.com.");
        return;
      }

      if (passwordError) {
        fail(password, loginMessage, passwordError);
        return;
      }

      if (!remembered) {
        fail(remember, loginMessage, "Please select the Remember me checkbox.");
        return;
      }

      setMessage(
        loginMessage,
        "Sign-in successful. Redirecting to your " + (roleValue === "admin" ? "Admin" : "Client") + " dashboard...",
        "success"
      );

      window.location.href = roleValue === "admin" ? "admin-dashboard.html" : "client-dashboard.html";
    });
  }

  /* ---------- Google OAuth placeholders ---------- */

  document.querySelectorAll(".google-button").forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const messageId = link.getAttribute("data-message");
      const message = messageId ? document.getElementById(messageId) : null;
      const isSignup = /sign up/i.test(link.textContent);
      setMessage(
        message,
        "Connect Google OAuth here to enable Google " + (isSignup ? "sign-up." : "sign-in."),
        "info"
      );
    });
  });
})();
