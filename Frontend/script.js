/* ==========================================================================
   Meridian — script.js
   Client-side form validation + dynamic navigation
   Loaded on every page. Each block checks for the elements it needs
   before doing anything, so this one file is safe to include everywhere.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  initMobileNav();
  highlightActiveNav();
  initRegisterForm();
  initLoginForm();
  initForgotPasswordForm();
  initResetPasswordForm();
  initAddCourseForm();
  initEditCourseForm();
  initGenericRequiredForms();
});

/* -------------------------------------------------------------------------
   Dynamic navigation
   ------------------------------------------------------------------------- */

// Toggle the mobile nav menu open/closed
function initMobileNav() {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', function () {
    var isOpen = links.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close the menu once a link is chosen (useful on mobile)
  links.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      links.classList.remove('open');
      toggle.classList.remove('open');
    });
  });
}

// Mark the nav link that matches the current page as active
function highlightActiveNav() {
  var current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === current) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

// Send the user to `url` after a short delay, so they can read a success message first
function goTo(url, delay) {
  window.setTimeout(function () {
    window.location.href = url;
  }, delay || 900);
}

/* -------------------------------------------------------------------------
   Shared validation helpers
   ------------------------------------------------------------------------- */

function setFieldError(fieldEl, message) {
  if (!fieldEl) return;
  fieldEl.classList.add('error');
  var msg = fieldEl.querySelector('.error-message');
  if (msg) msg.textContent = message;
}

function clearFieldError(fieldEl) {
  if (!fieldEl) return;
  fieldEl.classList.remove('error');
}

function showAlert(alertEl, message, type) {
  if (!alertEl) return;
  alertEl.textContent = message;
  alertEl.className = 'form-alert show ' + (type || 'success');
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isStrongPassword(value) {
  // At least 8 characters, one letter and one number
  return value.length >= 8 && /[A-Za-z]/.test(value) && /[0-9]/.test(value);
}

/* -------------------------------------------------------------------------
   Register form (register.html)
   ------------------------------------------------------------------------- */
function initRegisterForm() {
  var form = document.getElementById('register-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var valid = true;

    var name = form.querySelector('#full-name');
    var nameField = name.closest('.field');
    if (name.value.trim().length < 2) {
      setFieldError(nameField, 'Enter your full name.');
      valid = false;
    } else {
      clearFieldError(nameField);
    }

    var email = form.querySelector('#email');
    var emailField = email.closest('.field');
    if (!isValidEmail(email.value)) {
      setFieldError(emailField, 'Enter a valid email address.');
      valid = false;
    } else {
      clearFieldError(emailField);
    }

    var password = form.querySelector('#password');
    var passwordField = password.closest('.field');
    if (!isStrongPassword(password.value)) {
      setFieldError(passwordField, 'Password needs 8+ characters, including a letter and a number.');
      valid = false;
    } else {
      clearFieldError(passwordField);
    }

    var confirm = form.querySelector('#confirm-password');
    var confirmField = confirm.closest('.field');
    if (confirm.value !== password.value || confirm.value === '') {
      setFieldError(confirmField, 'Passwords do not match.');
      valid = false;
    } else {
      clearFieldError(confirmField);
    }

    var terms = form.querySelector('#agree-terms');
    var termsField = terms.closest('.field');
    if (!terms.checked) {
      setFieldError(termsField, 'You must accept the terms to continue.');
      valid = false;
    } else {
      clearFieldError(termsField);
    }

    var alertBox = form.querySelector('.form-alert');
    if (!valid) {
      showAlert(alertBox, 'Please fix the highlighted fields.', 'danger');
      return;
    }

    showAlert(alertBox, 'Account created! Redirecting you to sign in\u2026', 'success');
    form.querySelector('button[type="submit"]').disabled = true;
    goTo('login.html');
  });
}

/* -------------------------------------------------------------------------
   Login form (login.html)
   ------------------------------------------------------------------------- */
function initLoginForm() {
  var form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var valid = true;

    var email = form.querySelector('#email');
    var emailField = email.closest('.field');
    if (!isValidEmail(email.value)) {
      setFieldError(emailField, 'Enter a valid email address.');
      valid = false;
    } else {
      clearFieldError(emailField);
    }

    var password = form.querySelector('#password');
    var passwordField = password.closest('.field');
    if (password.value.trim() === '') {
      setFieldError(passwordField, 'Enter your password.');
      valid = false;
    } else {
      clearFieldError(passwordField);
    }

    var alertBox = form.querySelector('.form-alert');
    if (!valid) {
      showAlert(alertBox, 'Please fix the highlighted fields.', 'danger');
      return;
    }

    // Demo-only routing: an address containing "admin" goes to the admin dashboard
    var destination = email.value.toLowerCase().indexOf('admin') !== -1
      ? 'admin-dashboard.html'
      : 'student-dashboard.html';

    showAlert(alertBox, 'Signed in! Taking you to your dashboard\u2026', 'success');
    form.querySelector('button[type="submit"]').disabled = true;
    goTo(destination);
  });
}

/* -------------------------------------------------------------------------
   Forgot password form (forgot-password.html)
   ------------------------------------------------------------------------- */
function initForgotPasswordForm() {
  var form = document.getElementById('forgot-password-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = form.querySelector('#email');
    var emailField = email.closest('.field');
    var alertBox = form.querySelector('.form-alert');

    if (!isValidEmail(email.value)) {
      setFieldError(emailField, 'Enter a valid email address.');
      showAlert(alertBox, 'Please fix the highlighted field.', 'danger');
      return;
    }

    clearFieldError(emailField);
    showAlert(alertBox, 'Reset link sent. Check your inbox \u2014 redirecting\u2026', 'success');
    form.querySelector('button[type="submit"]').disabled = true;
    goTo('reset-password.html', 1200);
  });
}

/* -------------------------------------------------------------------------
   Reset password form (reset-password.html)
   ------------------------------------------------------------------------- */
function initResetPasswordForm() {
  var form = document.getElementById('reset-password-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var valid = true;

    var password = form.querySelector('#new-password');
    var passwordField = password.closest('.field');
    if (!isStrongPassword(password.value)) {
      setFieldError(passwordField, 'Password needs 8+ characters, including a letter and a number.');
      valid = false;
    } else {
      clearFieldError(passwordField);
    }

    var confirm = form.querySelector('#confirm-new-password');
    var confirmField = confirm.closest('.field');
    if (confirm.value !== password.value || confirm.value === '') {
      setFieldError(confirmField, 'Passwords do not match.');
      valid = false;
    } else {
      clearFieldError(confirmField);
    }

    var alertBox = form.querySelector('.form-alert');
    if (!valid) {
      showAlert(alertBox, 'Please fix the highlighted fields.', 'danger');
      return;
    }

    showAlert(alertBox, 'Password updated! Redirecting to sign in\u2026', 'success');
    form.querySelector('button[type="submit"]').disabled = true;
    goTo('login.html');
  });
}

/* -------------------------------------------------------------------------
   Add course form (add-course.html)
   ------------------------------------------------------------------------- */
function initAddCourseForm() {
  var form = document.getElementById('course-form');
  if (!form || form.dataset.mode !== 'add') return;
  validateCourseForm(form, 'Course created! Redirecting to your course list\u2026', 'courses.html');
}

/* -------------------------------------------------------------------------
   Edit course form (edit-course.html)
   ------------------------------------------------------------------------- */
function initEditCourseForm() {
  var form = document.getElementById('course-form');
  if (!form || form.dataset.mode !== 'edit') return;
  validateCourseForm(form, 'Changes saved! Redirecting to your course list\u2026', 'courses.html');
}

// Shared validation for the add/edit course forms
function validateCourseForm(form, successMessage, redirectUrl) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var valid = true;

    var requiredFields = [
      { id: '#course-title', message: 'Give the course a title.' },
      { id: '#course-category', message: 'Choose a category.' },
      { id: '#course-instructor', message: 'Enter the instructor name.' },
      { id: '#course-duration', message: 'Enter a duration.' },
      { id: '#course-description', message: 'Add a short description.' }
    ];

    requiredFields.forEach(function (item) {
      var input = form.querySelector(item.id);
      if (!input) return;
      var field = input.closest('.field');
      if (input.value.trim() === '') {
        setFieldError(field, item.message);
        valid = false;
      } else {
        clearFieldError(field);
      }
    });

    var price = form.querySelector('#course-price');
    if (price) {
      var priceField = price.closest('.field');
      if (price.value !== '' && (isNaN(price.value) || Number(price.value) < 0)) {
        setFieldError(priceField, 'Enter a valid, non-negative price.');
        valid = false;
      } else {
        clearFieldError(priceField);
      }
    }

    var alertBox = form.querySelector('.form-alert');
    if (!valid) {
      showAlert(alertBox, 'Please fix the highlighted fields.', 'danger');
      return;
    }

    showAlert(alertBox, successMessage, 'success');
    form.querySelector('button[type="submit"]').disabled = true;
    goTo(redirectUrl);
  });
}

/* -------------------------------------------------------------------------
   Generic fallback: any other form marked data-validate="required"
   simply checks that its required fields are filled before "submitting"
   ------------------------------------------------------------------------- */
function initGenericRequiredForms() {
  var forms = document.querySelectorAll('form[data-validate="required"]');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      form.querySelectorAll('[required]').forEach(function (input) {
        var field = input.closest('.field');
        if (input.type === 'checkbox' ? !input.checked : input.value.trim() === '') {
          setFieldError(field, 'This field is required.');
          valid = false;
        } else {
          clearFieldError(field);
        }
      });

      var alertBox = form.querySelector('.form-alert');
      if (!valid) {
        showAlert(alertBox, 'Please fix the highlighted fields.', 'danger');
        return;
      }

      showAlert(alertBox, 'Saved successfully.', 'success');
      var redirect = form.getAttribute('data-redirect');
      if (redirect) goTo(redirect);
    });
  });
}
