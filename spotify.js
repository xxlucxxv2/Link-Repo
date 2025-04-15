const clientId = "38cc5bcece9f4b4dbcf967b07facc0a4";
const redirectUri = "http://localhost:8888/";
const scopes = "user-read-playback-state user-modify-playback-state";

const loginBtn = document.getElementById("login-btn");
const controls = document.getElementById("controls");
const playBtn = document.getElementById("play-btn");
const pauseBtn = document.getElementById("pause-btn");

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
