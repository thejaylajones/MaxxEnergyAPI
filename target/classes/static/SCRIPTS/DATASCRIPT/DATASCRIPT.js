document.addEventListener("DOMContentLoaded", () => {
  const iframe = document.getElementById("powerbi-frame");
  const loadingScreen = document.getElementById("loading-screen");

  // When iframe loads, fade it in and remove loading screen
  iframe.addEventListener("load", () => {
    iframe.classList.add("active");

    setTimeout(() => {
      loadingScreen.style.opacity = "0";
      loadingScreen.style.pointerEvents = "none";
    }, 500); // smooth fade-out
  });

  console.log("Dashboard initialized 🚀");
});
