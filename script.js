/* =========================================================
   EDIT THIS SECTION — everything personal lives here
   ========================================================= */
const CONFIG = {
  names: "David & Melissa",
  weddingDate: "2011-11-26T00:00:00", // add the ceremony time if you know it, e.g. 2011-11-26T14:00:00
  years: 15,
  slideSeconds: 5,                    // how long each photo shows in "Relive the day"
  heroPhotos: ["images/beach-champagne.jpg", "images/together.jpg", "images/jump.jpg", "images/vows.jpg", "images/lighthouse.jpg"],
};

// The wedding day, chapter by chapter. Change any text; add or remove photos freely.
// Photos live in the images/ folder.
const CHAPTERS = [
  {
    title: "Getting Ready",
    text: "The veil, the nerves, the last little touches. Every big day starts with a quiet moment.",
    photos: [
      { file: "getting-ready-dress.jpg", title: "The final touches", caption: "Almost time." },
      { file: "bride-portrait.jpg",      title: "Radiant",           caption: "Melissa, with a smile that says it all." },
      { file: "bride-bridesmaid.jpg",    title: "Together",          caption: "A happy moment with her bridesmaid." },
      { file: "groom-portrait.jpg",      title: "The groom",         caption: "David, grinning from ear to ear." },
      { file: "groom-car.jpg",           title: "David, in his element", caption: "Always a character." },
    ],
  },
  {
    title: "The Wedding Party",
    text: "The people who stood beside them, dressed in lavender and smiles.",
    photos: [
      { file: "family-trio.jpg",  title: "Family portrait",  caption: "Standing proud together." },
      { file: "groomsmen.jpg",    title: "The gentlemen",    caption: "Waiting at the front." },
      { file: "flower-girls.jpg", title: "The flower girls", caption: "Tiaras, bouquets and petals." },
      { file: "ring-bearer.jpg",  title: "The ring bearer",  caption: "Taking his job very seriously." },
    ],
  },
  {
    title: "The Ceremony",
    text: "Down the aisle, in front of everyone they love, and into forever.",
    photos: [
      { file: "church.jpg", title: "The church",           caption: "Flowers set, doors about to open." },
      { file: "aisle.jpg",  title: "Walking down the aisle", caption: "Every step closer." },
      { file: "vows.jpg",   title: "The vows",             caption: "A moment to remember." },
      { file: "together.jpg", title: "Side by side",       caption: "Husband and wife." },
    ],
  },
  {
    title: "Just Married",
    text: "Laughing in the street, leaping for joy, and a splash of champagne by the sea.",
    photos: [
      { file: "street-dance.jpg",    title: "Dancing in the street", caption: "Nobody could stop laughing." },
      { file: "jump.jpg",            title: "Jumping for joy",       caption: "The whole wedding party in the air." },
      { file: "lighthouse.jpg",      title: "By the lighthouse",     caption: "A family portrait by the sea." },
      { file: "grass.jpg",           title: "A quiet moment",        caption: "Resting in the grass." },
      { file: "beach-champagne.jpg", title: "Pop the champagne!",    caption: "Cheers to the happy couple." },
    ],
  },
  {
    title: "The Dance",
    text: "And then the music began.",
    photos: [
      { file: "first-dance.jpg", title: "The first dance", caption: "Lost in each other's eyes." },
    ],
  },
];
/* ========================================================= */


const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const wedding = new Date(CONFIG.weddingDate);
const anniversary = new Date(wedding);
anniversary.setFullYear(wedding.getFullYear() + CONFIG.years);

// Flat, ordered list of every photo (used by the lightbox + slideshow)
const ALL = [];
CHAPTERS.forEach((c, ci) => c.photos.forEach((p) => ALL.push({ ...p, src: "images/" + p.file, chapter: c.title, ci })));

/* ---------- Hero text + counter ---------- */
$("#couple-names").textContent = CONFIG.names;
$("#footer-names").textContent = CONFIG.names;
$("#years").textContent = CONFIG.years;
document.title = `${CONFIG.names} · ${CONFIG.years} Years`;
const fmt = (d) => d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
$("#hero-date").textContent = `${fmt(wedding)}  ♥  ${fmt(anniversary)}`;

function tick() {
  const now = new Date();
  const before = now < anniversary;
  const diff = before ? anniversary - now : now - anniversary;
  const days = Math.floor(diff / 86400000);
  $("#c-days").textContent = days.toLocaleString();
  $("#c-hours").textContent = Math.floor(diff / 3600000) % 24;
  $("#c-mins").textContent = Math.floor(diff / 60000) % 60;
  $("#c-secs").textContent = Math.floor(diff / 1000) % 60;
  $("#counter-label").textContent = before
    ? `until ${CONFIG.years} years of marriage`
    : `since ${CONFIG.years} years ago, and still counting`;
}
// Before the anniversary: count down. After it: count how long since the 15th.
// (Overall time married is also easy to show; see README to switch.)
tick(); setInterval(tick, 1000);

/* ---------- Hero background crossfade ---------- */
(function heroBg() {
  const a = $("#hero-bg-a"), b = $("#hero-bg-b");
  const list = CONFIG.heroPhotos;
  if (!list.length) return;
  let i = 0, useA = true;
  function show() {
    const el = useA ? a : b, other = useA ? b : a;
    el.style.backgroundImage = `url("${list[i % list.length]}")`;
    el.classList.remove("show"); void el.offsetWidth; el.classList.add("show");
    other.classList.remove("show");
    useA = !useA; i++;
  }
  show();
  if (list.length > 1) setInterval(show, 7000);
})();

/* ---------- Chapters ---------- */
const chaptersEl = $("#chapters");
const chipsEl = $("#chapter-chips");
let globalIndex = 0;

CHAPTERS.forEach((c, ci) => {
  // chip
  const chip = document.createElement("button");
  chip.className = "chip"; chip.textContent = c.title;
  chip.onclick = () => document.getElementById("chapter-" + ci).scrollIntoView({ behavior: "smooth" });
  chipsEl.appendChild(chip);

  // section
  const sec = document.createElement("article");
  sec.className = "chapter"; sec.id = "chapter-" + ci;
  sec.innerHTML = `
    <div class="chapter-head">
      <span class="chapter-num">Chapter ${ci + 1}</span>
      <h3>${esc(c.title)}</h3>
      <p>${esc(c.text)}</p>
    </div>
    <div class="chapter-grid"></div>`;
  const grid = sec.querySelector(".chapter-grid");
  const n = c.photos.length;
  grid.style.columnCount = Math.min(3, n);
  if (n === 1) grid.classList.add("single");

  c.photos.forEach((p) => {
    const idx = globalIndex++;
    const fig = document.createElement("figure");
    fig.className = "g-item";
    fig.innerHTML = `<img loading="lazy" alt="${esc(p.title)}" src="images/${esc(p.file)}" /><figcaption>${esc(p.title)}</figcaption>`;
    fig.onclick = () => openLightbox(idx, false);
    grid.appendChild(fig);
  });
  chaptersEl.appendChild(sec);
});

const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } });
}, { threshold: 0.08 });
document.querySelectorAll(".chapter").forEach((el) => io.observe(el));

/* ---------- Lightbox + "Relive the day" slideshow ---------- */
const lb = $("#lightbox"), fig = $("#lb-figure"), img = $("#lb-img"), bar = $("#lb-bar"), playBtn = $("#lb-play");
let idx = 0, playing = false, timer = null;

function render() {
  const p = ALL[idx];
  fig.classList.add("fade");
  setTimeout(() => {
    img.src = p.src; img.alt = p.title;
    $("#lb-chapter").textContent = p.chapter;
    $("#lb-title").textContent = p.title;
    $("#lb-caption").textContent = p.caption || "";
    $("#lb-count").textContent = `${idx + 1} / ${ALL.length}`;
    img.onload = () => fig.classList.remove("fade");
    if (img.complete) fig.classList.remove("fade");
  }, 180);
  // preload the next photo
  const nxt = new Image(); nxt.src = ALL[(idx + 1) % ALL.length].src;
  restartBar();
}
function restartBar() {
  bar.classList.remove("run");
  if (!playing) return;
  bar.style.setProperty("--dur", CONFIG.slideSeconds + "s");
  void bar.offsetWidth; bar.classList.add("run");
  clearTimeout(timer);
  timer = setTimeout(() => step(1, true), CONFIG.slideSeconds * 1000);
}
function step(d) { idx = (idx + d + ALL.length) % ALL.length; render(); }
function setPlaying(v) {
  playing = v; playBtn.textContent = v ? "⏸" : "▶";
  clearTimeout(timer); bar.classList.remove("run");
  if (v) restartBar();
}
function openLightbox(i, autoplay) {
  idx = i; lb.hidden = false; document.body.style.overflow = "hidden";
  setPlaying(autoplay); render();
}
function closeLb() { lb.hidden = true; document.body.style.overflow = ""; setPlaying(false); }

$("#lb-close").onclick = closeLb;
$("#lb-prev").onclick = () => step(-1);
$("#lb-next").onclick = () => step(1);
playBtn.onclick = () => setPlaying(!playing);
lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
document.addEventListener("keydown", (e) => {
  if (lb.hidden) return;
  if (e.key === "Escape") closeLb();
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "ArrowRight") step(1);
  if (e.key === " ") { e.preventDefault(); setPlaying(!playing); }
});
let touchX = null;
lb.addEventListener("touchstart", (e) => (touchX = e.touches[0].clientX), { passive: true });
lb.addEventListener("touchend", (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  touchX = null;
});
$("#relive-btn").onclick = () => openLightbox(0, true);

/* ---------- Floating hearts ---------- */
const canvas = $("#hearts"), ctx = canvas.getContext("2d");
let hearts = [];
function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
resize(); addEventListener("resize", resize);

function spawn(x, y, n = 1) {
  for (let i = 0; i < n; i++) {
    hearts.push({
      x: x ?? Math.random() * canvas.width, y: y ?? canvas.height + 20,
      vx: (Math.random() - 0.5) * (n > 1 ? 6 : 1), vy: -(Math.random() * (n > 1 ? 6 : 1.2) + 0.6),
      size: 10 + Math.random() * 16, life: 1, rot: Math.random() * 0.6 - 0.3,
      color: Math.random() > 0.3 ? "#8b6bb8" : "#b8924a",
    });
  }
}
function drawHeart(h) {
  ctx.save(); ctx.translate(h.x, h.y); ctx.rotate(h.rot); ctx.globalAlpha = h.life; ctx.fillStyle = h.color;
  const s = h.size; ctx.beginPath();
  ctx.moveTo(0, s / 4);
  ctx.bezierCurveTo(0, -s / 3, -s, -s / 3, -s, s / 4);
  ctx.bezierCurveTo(-s, s * 0.8, 0, s, 0, s * 1.2);
  ctx.bezierCurveTo(0, s, s, s * 0.8, s, s / 4);
  ctx.bezierCurveTo(s, -s / 3, 0, -s / 3, 0, s / 4);
  ctx.fill(); ctx.restore();
}
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!reduce && Math.random() < 0.04) spawn();
  hearts.forEach((h) => { h.x += h.vx; h.y += h.vy; h.vy += 0.01; h.life -= 0.004; drawHeart(h); });
  hearts = hearts.filter((h) => h.life > 0 && h.y > -40);
  requestAnimationFrame(loop);
}
loop();
$("#burst-btn").addEventListener("click", (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  spawn(r.left + r.width / 2, r.top + r.height / 2, 40);
});
