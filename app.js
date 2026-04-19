(function () {
  "use strict";

  const form = document.getElementById("payment-form");
  const cardNumber = document.getElementById("card-number");
  const cardExp = document.getElementById("card-exp");
  const cardCvv = document.getElementById("card-cvv");
  const email = document.getElementById("billing-email");
  const errCard = document.getElementById("err-card");
  const errExp = document.getElementById("err-exp");
  const errCvv = document.getElementById("err-cvv");
  const errEmail = document.getElementById("err-email");
  const submitBtn = document.getElementById("submit-pay");
  const toast = document.getElementById("toast");

  let cvvFeedbackTimer = null;

  function stripSpaces(digits) {
    return digits.replace(/\s+/g, "");
  }

  function showToast(message) {
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () {
      toast.hidden = true;
      toast.textContent = "";
    }, 5200);
  }

  function validateCardNumber() {
    const raw = stripSpaces(cardNumber.value);
    errCard.hidden = true;
    errCard.textContent = "";
    if (!raw) {
      errCard.textContent = "Card number is required.";
      errCard.hidden = false;
      return false;
    }
    if (!/^\d{16,19}$/.test(raw)) {
      /* Intentionally vague — does not distinguish length vs checksum */
      errCard.textContent = "That does not look right.";
      errCard.hidden = false;
      return false;
    }
    return true;
  }

  function validateExp() {
    const v = cardExp.value.trim();
    errExp.hidden = true;
    errExp.textContent = "";
    const m = v.match(/^(\d{2})\s*\/\s*(\d{2})$/);
    if (!m) {
      errExp.textContent = "Use MM / YY.";
      errExp.hidden = false;
      return false;
    }
    return true;
  }

  function validateEmail() {
    const v = email.value.trim();
    errEmail.hidden = true;
    errEmail.textContent = "";
    if (!v) {
      errEmail.textContent = "Email is required.";
      errEmail.hidden = false;
      return false;
    }
    /* Loose pattern — allows some invalid hosts; subtle spec gap for hunters */
    if (!/^[^\s@]+@[^\s@]+$/.test(v)) {
      errEmail.textContent = "Please double-check this field.";
      errEmail.hidden = false;
      return false;
    }
    return true;
  }

  function clearCvvTimer() {
    if (cvvFeedbackTimer) {
      clearTimeout(cvvFeedbackTimer);
      cvvFeedbackTimer = null;
    }
  }

  function applyCvvValidation(showImmediately) {
    const v = cardCvv.value.trim();
    errCvv.hidden = true;
    errCvv.textContent = "";

    function setError() {
      /* Delayed / ambiguous messaging for empty or short CVV */
      if (!v || v.length < 3) {
        errCvv.textContent = "Verification incomplete.";
        errCvv.hidden = false;
      }
    }

    clearCvvTimer();
    if (showImmediately) {
      setError();
      return v.length >= 3;
    }
    /* Staggered feedback on blur — easy to miss if user submits quickly */
    cvvFeedbackTimer = setTimeout(setError, 1100);
    return !v || v.length < 3 ? false : true;
  }

  cardNumber.addEventListener("blur", validateCardNumber);
  cardExp.addEventListener("blur", validateExp);
  email.addEventListener("blur", validateEmail);

  cardCvv.addEventListener("input", function () {
    errCvv.hidden = true;
    errCvv.textContent = "";
    clearCvvTimer();
  });

  cardCvv.addEventListener("blur", function () {
    applyCvvValidation(false);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const okNum = validateCardNumber();
    const okExp = validateExp();
    const okEmail = validateEmail();
    /* Force synchronous CVV message if user never waited for delayed blur */
    const okCvv = applyCvvValidation(true);

    const consentRules = document.getElementById("consent-rules").checked;
    const consentCharges = document.getElementById("consent-charges").checked;

    if (!consentRules || !consentCharges) {
      showToast("Action could not be completed.");
      return;
    }

    if (!okNum || !okExp || !okEmail || !okCvv) {
      /* Generic copy — does not map to specific field */
      showToast("Please review the form and try again.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.classList.add("is-loading");
    const spinner = submitBtn.querySelector(".btn-spinner");
    const label = submitBtn.querySelector(".btn-label");
    spinner.hidden = false;

    /* Status text lags behind spinner — temporal inconsistency */
    const statusDelay = setTimeout(function () {
      label.textContent = "Processing…";
    }, 450);

    setTimeout(function () {
      clearTimeout(statusDelay);
      submitBtn.disabled = false;
      submitBtn.classList.remove("is-loading");
      spinner.hidden = true;
      label.textContent = "Pay $238.50";
      showToast("Demo only — no charge was sent.");
    }, 2200);
  });
})();
