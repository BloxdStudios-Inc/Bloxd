// LOGIN
function login() {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;

  if (u === "admin" && p === "1234") {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("mainSite").classList.remove("hidden");
    loadPosts();
  }
}

// LOGOUT
function logout() {
  location.reload();
}

// POSTS
function addPost() {
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  posts.unshift({ title, content });

  localStorage.setItem("posts", JSON.stringify(posts));
  loadPosts();
}

function loadPosts() {
  const grid = document.getElementById("newsGrid");
  grid.innerHTML = "";

  let posts = JSON.parse(localStorage.getItem("posts")) || [];

  posts.forEach(p => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<h3>${p.title}</h3><p>${p.content}</p>`;
    grid.appendChild(div);
  });
}

// BREAKING NEWS
function triggerBreaking() {
  const text = document.getElementById("breakingText").value;
  if (!text) return;

  document.getElementById("popupText").innerText = text;
  const popup = document.getElementById("breakingPopup");

  popup.classList.remove("hidden");

  setTimeout(() => popup.classList.add("hidden"), 4000);
}

// COUNTDOWN
const nextBroadcast = new Date("2026-04-12T18:00:00").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const dist = nextBroadcast - now;

  if (dist <= 0) {
    document.getElementById("countdown").innerText = "🔴 LIVE NOW";
    return;
  }

  const h = Math.floor(dist / (1000 * 60 * 60));
  const m = Math.floor((dist % (1000 * 60 * 60)) / 1000 / 60);
  const s = Math.floor((dist % 60000) / 1000);

  document.getElementById("countdown").innerText =
    `${h}h ${m}m ${s}s`;
}

setInterval(updateCountdown, 1000);
updateCountdown();

// TV INTRO REMOVE
window.addEventListener("load", () => {
  setTimeout(() => {
    const intro = document.getElementById("tvIntro");
    if (intro) intro.style.display = "none";
  }, 6000);
});
