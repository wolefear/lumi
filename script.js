const openBtn = document.getElementById("open");
const intro = document.getElementById("intro");
const story = document.getElementById("story");
const screens = document.querySelectorAll(".screen");
const birthdayBtn = document.getElementById("birthdayBtn");
const birthday = document.getElementById("birthday");

/* OPEN */
openBtn.onclick = () => {
  intro.style.opacity = "0";
  setTimeout(() => {
    intro.style.display = "none";
    story.classList.remove("hidden");
    startConfetti();
    observe();
  }, 1500);
};

/* FADE IN ON SCROLL */
function observe() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, { threshold: 0.6 });

  screens.forEach(s => observer.observe(s));
}

/* BIRTHDAY */
birthdayBtn.onclick = () => birthday.classList.remove("hidden");

/* CONFETTI */
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

let pieces = [];

function startConfetti() {
  for (let i = 0; i < 120; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      s: Math.random() * 5 + 2,
      v: Math.random() * 3 + 2
    });
  }
  animate();
}

function animate() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  pieces.forEach(p => {
    ctx.fillStyle = "rgba(255,215,0,0.6)";
    ctx.fillRect(p.x,p.y,p.s,p.s);
    p.y += p.v;
    if(p.y > canvas.height) p.y = -10;
  });
  requestAnimationFrame(animate);
}
