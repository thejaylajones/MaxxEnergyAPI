document.getElementById("signup-form").addEventListener("submit", function (e) {
  e.preventDefault();

  let valid = true;

  // Clear old errors
  document.querySelectorAll(".error-message").forEach(msg => msg.style.display = "none");

  // Validate Name
  const name = document.getElementById("name");
  if (!name.value.trim()) {
    showError(name, "Name is required.");
    valid = false;
  }

  // Validate Email
  const email = document.getElementById("email");
  if (!email.value.trim()) {
    showError(email, "Email is required.");
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    showError(email, "Enter a valid email.");
    valid = false;
  } else if (email.value === "test@example.com") {
    // Fake case for "already used email"
    showError(email, "This email is already registered.");
    valid = false;
  }

  // Validate Password
  const password = document.getElementById("password");
  if (!password.value.trim()) {
    showError(password, "Password is required.");
    valid = false;
  } else if (password.value.length < 6) {
    showError(password, "Password must be at least 6 characters.");
    valid = false;
  }

  if (valid) {
    // === BACKEND CONNECTION ===
    // Use the correct backend signup endpoint with ngrok URL
    const backendUrl = "https://b5e776df14c2.ngrok-free.app/auth/register";

    // Prepare data to send
    const signupData = {
      name: name.value,
      email: email.value,
      password: password.value,
      username: email.value, // Use email as username for now
      employeeId: "EMP" + Date.now() // Generate a unique employee ID
    };

    // Send data to backend
    fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(signupData)
    })
      .then(async response => {
        const feedback = document.getElementById("signup-feedback");
        if (!feedback) {
          // If feedback element doesn't exist, create it below the form
          const form = document.getElementById("signup-form");
          const newDiv = document.createElement("div");
          newDiv.id = "signup-feedback";
          newDiv.style.marginTop = "16px";
          newDiv.style.fontWeight = "bold";
          form.parentNode.insertBefore(newDiv, form.nextSibling);
        }
        const feedbackDiv = document.getElementById("signup-feedback");
        if (!response.ok) {
          const errorText = await response.text();
          feedbackDiv.textContent = "Signup failed: " + errorText;
          feedbackDiv.style.color = "red";
          return;
        }
        
        // Handle plain text response from backend
        const responseText = await response.text();
        feedbackDiv.textContent = "Registration successful! " + responseText + " Thank you for signing up with MAXX ENERGY! Access your account now!";
        feedbackDiv.style.color = "green";
        document.getElementById("signup-form").reset();
        // Optionally redirect user here
        // window.location.href = "login.html";
      })
      .catch(error => {
        const feedbackDiv = document.getElementById("signup-feedback");
        if (feedbackDiv) {
          feedbackDiv.textContent = "Signup error: " + error.message;
          feedbackDiv.style.color = "red";
        } else {
          alert("Signup error: " + error.message);
        }
      });
  }
});

// Helper function
function showError(input, message) {
  const errorMessage = input.parentElement.querySelector(".error-message");
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
}

// Replace your existing register function with:
async function register() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    const employeeId = document.getElementById('employeeId').value;
    const result = await maxxApi.register(username, email, password, name, employeeId);
    if (result.success) {
        alert('Registration successful!');
        // Your existing success code here
    } else {
        alert('Registration failed: ' + result.error);
        // Your existing error code here
    }
}
