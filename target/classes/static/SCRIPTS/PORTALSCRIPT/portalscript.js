// ===== Login Button Revolve Effect =====
document.getElementById("loginBtn").addEventListener("click", function() {
  let container = document.querySelector(".glass-container");

  // Get username and password from input fields
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Call backend login function
  loginToBackend(username, password).then(() => {
    // Rotate animation
    container.style.transform = "rotateY(360deg)";

    // Redirect after animation
    setTimeout(() => {
      window.location.href = "user-profile.html"; // Redirect to MAXX Energy user profile
    }, 1000);
  }).catch((error) => {
    alert("Login failed: " + error.message);
  });
});

// ===== Video Background Toggle =====
const videoSources = [
  "videos/abstract-motion.mp4",
  "videos/tech-grid.mp4",
  "videos/energy-wave.mp4"
];

const heroVideo = document.querySelector(".hero-video");
const buttons = document.querySelectorAll(".video-options button");

buttons.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    heroVideo.src = videoSources[index];
    heroVideo.play();
  });
});




// ===== BACKEND CODE =====

// Example: call this inside an async function or event handler
async function loginToBackend(username, password) {
  try {
    // Use the correct backend API endpoint with ngrok URL
    const response = await fetch("https://6b8717b54326.ngrok-free.app/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true"
      },
      body: JSON.stringify({ email: username, password })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Login failed" }));
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();
    console.log("Login success:", data);
    
    // Store the token if provided
    if (data.token) {
      localStorage.setItem('maxxenergy_token', data.token);
    }
    
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}
