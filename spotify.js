const clientId = "38cc5bcece9f4b4dbcf967b07facc0a4";
const redirectUri = "https://linkrepo.netlify.app/controls/";
const scopes = "user-read-playback-state user-modify-playback-state";

const loginBtn = document.getElementById("login-btn");
const controls = document.getElementById("controls");
const playBtn = document.getElementById("play-btn");
const pauseBtn = document.getElementById("pause-btn");
const progressBar = document.getElementById("progress-bar");
const currentTime = document.getElementById("current-time");
const duration = document.getElementById("duration");

function getTokenFromUrl() {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  return params.get("access_token");
}

const token = getTokenFromUrl();
if (token) {
  window.history.pushState("", document.title, window.location.pathname);
  localStorage.setItem("spotifyAccessToken", token);
}

const accessToken = localStorage.getItem("spotifyAccessToken");
if (accessToken) {
  loginBtn.style.display = "none";
  controls.style.display = "block";
}

loginBtn.onclick = () => {
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scopes)}`;
  window.location.href = authUrl;
};

playBtn.onclick = () => {
  fetch("https://api.spotify.com/v1/me/player/play", {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("spotifyAccessToken"),
    },
  });
};

pauseBtn.onclick = () => {
  fetch("https://api.spotify.com/v1/me/player/pause", {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("spotifyAccessToken"),
    },
  });
};

function updateProgress() {
  fetch("https://api.spotify.com/v1/me/player", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("spotifyAccessToken"),
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data && data.is_playing) {
        const progress = data.progress_ms;
        const duration_ms = data.item.duration_ms;
        const progressPercentage = (progress / duration_ms) * 100;

        progressBar.value = progressPercentage;

        // Format time
        const currentMinutes = Math.floor(progress / 60000);
        const currentSeconds = Math.floor((progress % 60000) / 1000);
        currentTime.textContent = `${currentMinutes}:${
          currentSeconds < 10 ? "0" : ""
        }${currentSeconds}`;

        const totalMinutes = Math.floor(duration_ms / 60000);
        const totalSeconds = Math.floor((duration_ms % 60000) / 1000);
        duration.textContent = `${totalMinutes}:${
          totalSeconds < 10 ? "0" : ""
        }${totalSeconds}`;
      }
    });
}

// Update progress every second
setInterval(updateProgress, 1000);
