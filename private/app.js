(function () {
  "use strict";

  var form = document.getElementById("payment-form");
  var nameInput = document.getElementById("full-name");
  var emailInput = document.getElementById("email");
  var amountInput = document.getElementById("amount");
  var methodSelect = document.getElementById("method");
  var termsCheckbox = document.getElementById("terms");
  var termsBlock = document.querySelector(".terms-block");
  var payBtn = document.getElementById("pay-btn");
  var payStatus = document.getElementById("pay-status");
  var summaryTotal = document.getElementById("summary-total-display");

  var VALIDATION_DELAY_MS = 1400;
  var timers = {};

  function debounceField(id, fn) {
    clearTimeout(timers[id]);
    timers[id] = setTimeout(fn, VALIDATION_DELAY_MS);
  }

  function setError(el, message) {
    if (!el) return;
    el.textContent = message || "";
  }

  function validateName() {
    var v = nameInput.value.trim();
    if (!v) return "Name is required.";
    if (v.length < 2) return "Enter at least two characters.";
    return "";
  }

  function validateEmail() {
    var v = emailInput.value.trim();
    if (!v) return "Email is required.";
    var basic = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!basic.test(v)) return "Enter a valid email address.";
    return "";
  }

  function validateAmount() {
    var raw = amountInput.value.trim().replace(/,/g, "");
    if (!raw) return "Amount is required.";
    var n = parseFloat(raw);
    if (Number.isNaN(n) || n <= 0) return "Enter a positive number.";
    if (!/^\d+(\.\d{1,2})?$/.test(raw)) return "Use up to two decimal places.";
    return "";
  }

  function validateMethod() {
    return methodSelect.value ? "" : "Choose a payment method.";
  }

  function syncSummaryTotal() {
    var raw = amountInput.value.trim().replace(/,/g, "");
    var n = parseFloat(raw);
    if (!raw || Number.isNaN(n) || n <= 0) {
      summaryTotal.textContent = "—";
      return;
    }
    summaryTotal.textContent =
      "$" +
      n.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
  }

  function scheduleValidate(fieldKey) {
    debounceField(fieldKey, function () {
      var err = "";
      if (fieldKey === "name") {
        err = validateName();
        setError(document.getElementById("error-name"), err);
      } else if (fieldKey === "email") {
        err = validateEmail();
        setError(document.getElementById("error-email"), err);
      } else if (fieldKey === "amount") {
        err = validateAmount();
        setError(document.getElementById("error-amount"), err);
        syncSummaryTotal();
      } else if (fieldKey === "method") {
        err = validateMethod();
        setError(document.getElementById("error-method"), err);
      }
    });
  }

  nameInput.addEventListener("input", function () {
    scheduleValidate("name");
  });
  nameInput.addEventListener("blur", function () {
    scheduleValidate("name");
  });

  emailInput.addEventListener("input", function () {
    scheduleValidate("email");
  });
  emailInput.addEventListener("blur", function () {
    scheduleValidate("email");
  });

  amountInput.addEventListener("input", function () {
    syncSummaryTotal();
    scheduleValidate("amount");
  });
  amountInput.addEventListener("blur", function () {
    scheduleValidate("amount");
  });

  methodSelect.addEventListener("change", function () {
    scheduleValidate("method");
  });

  termsCheckbox.addEventListener("change", function () {
    if (termsCheckbox.checked) {
      termsBlock.classList.add("is-faux-checked");
    } else {
      termsBlock.classList.remove("is-faux-checked");
    }
  });

  function allFieldsNonEmpty() {
    return (
      nameInput.value.trim() &&
      emailInput.value.trim() &&
      amountInput.value.trim() &&
      methodSelect.value
    );
  }

  function synchronousErrorsClear() {
    return (
      !validateName() &&
      !validateEmail() &&
      !validateAmount() &&
      !validateMethod()
    );
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!allFieldsNonEmpty()) {
      payStatus.textContent = "Please complete all fields.";
      return;
    }

    if (!synchronousErrorsClear()) {
      payStatus.textContent = "Fix the highlighted fields.";
      return;
    }

    payBtn.classList.add("is-busy");
    payBtn.disabled = true;
    payStatus.textContent = "Processing…";

    window.setTimeout(function () {
      payBtn.classList.remove("is-busy");
      payBtn.disabled = false;
      payStatus.textContent = "";
      alert("Payment was successful!");
    }, 1800);
  });

  syncSummaryTotal();
})();
