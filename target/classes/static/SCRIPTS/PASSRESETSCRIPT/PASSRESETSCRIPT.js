// Step 1: Request reset link
document.getElementById("request-reset-form").addEventListener("submit", async function(e) {
  e.preventDefault();
  const email = document.getElementById("email").value;

  // === BACKEND: Request password reset link ===
  // Use the correct backend endpoint with ngrok URL:
  const resetRequestUrl = "https://b5e776df14c2.ngrok-free.app/auth/reset-password";

  try {
    const response = await fetch(resetRequestUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    if (!response.ok) {
      const errorText = await response.text();
      document.getElementById("message").innerText = "Error: " + errorText;
      return;
    }
    document.getElementById("message").innerText = "Reset link sent! Check your email.";
    document.getElementById("request-reset-form").style.display = "none";
    document.getElementById("new-password-form").style.display = "block";
    document.getElementById("message").innerText = "Enter your new password.";
  } catch (error) {
    document.getElementById("message").innerText = "Network error: " + error.message;
  }
});

// Step 2: Validate password strength
document.getElementById("new-password").addEventListener("input", function() {
  const strength = document.getElementById("password-strength");
  const password = this.value;

  if (password.length < 6) {
    strength.innerText = "Weak: At least 6 characters required.";
    strength.style.color = "red";
  } else if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    strength.innerText = "Medium: Add uppercase and numbers.";
    strength.style.color = "orange";
  } else {
    strength.innerText = "Strong password!";
    strength.style.color = "lightgreen";
  }
});

// Step 3: Reset password
document.getElementById("new-password-form").addEventListener("submit", async function(e) {
  e.preventDefault();

  const newPassword = document.getElementById("new-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (newPassword !== confirmPassword) {
    document.getElementById("message").innerText = "Passwords do not match!";
    return;
  }

  // === BACKEND: Submit new password ===
  // Use the correct backend endpoint with ngrok URL:
  const resetPasswordUrl = "https://b5e776df14c2.ngrok-free.app/auth/change-password";

  try {
    const response = await fetch(resetPasswordUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword })
    });
    if (!response.ok) {
      const errorText = await response.text();
      document.getElementById("message").innerText = "Error: " + errorText;
      return;
    }
    document.getElementById("message").innerText = "Password reset successful! You can log in now.";
    document.getElementById("new-password-form").reset();
  } catch (error) {
    document.getElementById("message").innerText = "Network error: " + error.message;
  }
});



(function() {
  const openBtn = document.getElementById('open-signup');
  const modal = document.getElementById('signup-modal');
  const closeBtn = modal.querySelector('.modal-close');
  const returnInput = document.getElementById('returnUrl');

  function open() {
    modal.setAttribute('aria-hidden', 'false');
    // set returnUrl so server can redirect back to this reset page
    returnInput.value = window.location.href;
    // focus trap simple
    modal.querySelector('input,button,textarea,select').focus();
  }
  function close() {
    modal.setAttribute('aria-hidden', 'true');
    openBtn.focus();
  }

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') close();
  });
})();
