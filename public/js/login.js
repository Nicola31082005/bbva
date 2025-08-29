// Login form functionality
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const useridInput = document.getElementById("userid");
  const passwordInput = document.getElementById("password");
  const loginBtn = document.getElementById("loginBtn");

  // Enable/disable login button based on form validation
  function validateForm() {
    const userid = useridInput.value.trim();
    const password = passwordInput.value.trim();

    if (userid && password) {
      loginBtn.disabled = false;
      loginBtn.style.backgroundColor = "#0066cc";
      loginBtn.style.cursor = "pointer";
    } else {
      loginBtn.disabled = true;
      loginBtn.style.backgroundColor = "#475569";
      loginBtn.style.cursor = "not-allowed";
    }
  }

  // Add event listeners to inputs
  useridInput.addEventListener("input", validateForm);
  passwordInput.addEventListener("input", validateForm);

  // Initial validation
  validateForm();

  // Form submission
  loginForm.addEventListener("submit", function (e) {
    if (loginBtn.disabled) {
      e.preventDefault();
    }
  });
});

// Password toggle functionality
function togglePassword() {
  const passwordInput = document.getElementById("password");
  const eyeIcon = document.getElementById("eyeIcon");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeIcon.innerHTML =
      '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
  } else {
    passwordInput.type = "password";
    eyeIcon.innerHTML =
      '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
  }
}
