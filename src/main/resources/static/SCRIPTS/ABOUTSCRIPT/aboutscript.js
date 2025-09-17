/* ================= SELECT ELEMENTS ================= */
const playButton = document.querySelector('.play-button');
const thumbnail = document.getElementById('thumbnail');
const video = document.getElementById('myVideo');
const body = document.body;

/* Custom controls */
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn = document.getElementById('stopBtn');

/* ================= EVENT: PLAY BUTTON CLICK ================= */
playButton.addEventListener('click', () => {
  // Make thumbnail fly up & disappear
  thumbnail.classList.add('fly-up');
  setTimeout(() => {
    thumbnail.style.display = "none"; // fully remove after animation
  }, 1000);

  // Start rumble effect
  body.classList.add('rumble');
  setTimeout(() => {
    body.classList.remove('rumble');
  }, 3000); // rumble for 3 seconds

  // Play video
  video.play();
});

/* ================= CUSTOM VIDEO CONTROLS ================= */
playBtn.addEventListener('click', () => {
  video.play();
});

pauseBtn.addEventListener('click', () => {
  video.pause();
});

stopBtn.addEventListener('click', () => {
  video.pause();
  video.currentTime = 0; // reset to beginning
});
