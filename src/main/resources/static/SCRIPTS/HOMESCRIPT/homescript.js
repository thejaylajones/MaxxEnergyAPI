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







// Replace your existing login function with:
async function login() {
    const username = document.getElementById('username').value; // use your field ID
    const password = document.getElementById('password').value; // use your field ID
    const result = await maxxApi.login(username, password);
    if (result.success) {
        alert('Login successful!');
        // Your existing success code here
    } else {
        alert('Login failed: ' + result.error);
        // Your existing error code here
    }
}
