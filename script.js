import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

// 1. THREE.JS PLANET

const container = document.getElementById("three-container");

if (container) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100,
  );

  camera.position.z = 6;

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const planet = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.35, 5),
    new THREE.MeshStandardMaterial({
      color: 0x1267a9,
      metalness: 0.65,
      roughness: 0.28,
      emissive: 0x031d49,
    }),
  );

  scene.add(planet);

  const shell = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.48, 2),
    new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      wireframe: true,
      transparent: true,
      opacity: 0.19,
    }),
  );

  scene.add(shell);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2, 0.009, 8, 150),
    new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.8,
    }),
  );

  ring.rotation.x = 1.1;
  ring.rotation.y = 0.3;
  scene.add(ring);

  const ringTwo = new THREE.Mesh(
    new THREE.TorusGeometry(2.3, 0.006, 8, 150),
    new THREE.MeshBasicMaterial({
      color: 0x9b5cff,
      transparent: true,
      opacity: 0.6,
    }),
  );

  ringTwo.rotation.x = 1.5;
  ringTwo.rotation.y = -0.4;
  scene.add(ringTwo);

  scene.add(new THREE.AmbientLight(0xffffff, 1.2));

  const blueLight = new THREE.PointLight(0x00d9ff, 25);
  blueLight.position.set(3, 3, 4);
  scene.add(blueLight);

  const purpleLight = new THREE.PointLight(0x914fff, 15);
  purpleLight.position.set(-4, -2, 2);
  scene.add(purpleLight);

  const satellite = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 24, 24),
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x00cfff,
      emissiveIntensity: 1.5,
    }),
  );

  scene.add(satellite);

  let pointerX = 0;
  let pointerY = 0;

  container.addEventListener("pointermove", (event) => {
    const rect = container.getBoundingClientRect();

    pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.5;
    pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 0.5;
  });

  function animatePlanet() {
    requestAnimationFrame(animatePlanet);

    planet.rotation.y += 0.0025;
    planet.rotation.x += 0.0007;

    shell.rotation.y -= 0.001;
    ring.rotation.z += 0.0018;
    ringTwo.rotation.z -= 0.0012;

    satellite.position.set(
      Math.cos(Date.now() * 0.0007) * 2,
      Math.sin(Date.now() * 0.0007) * 0.55,
      Math.sin(Date.now() * 0.0007) * 0.5,
    );

    scene.rotation.y += (pointerX * 0.12 - scene.rotation.y) * 0.03;
    scene.rotation.x += (-pointerY * 0.12 - scene.rotation.x) * 0.03;

    renderer.render(scene, camera);
  }

  animatePlanet();

  window.addEventListener("resize", () => {
    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
}

// 2. ANIMATED STARFIELD

const starCanvas = document.getElementById("starfield");
const ctx = starCanvas.getContext("2d");

let stars = [];
let canvasWidth = 0;
let canvasHeight = 0;

function createStars() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;

  starCanvas.width = canvasWidth * dpr;
  starCanvas.height = canvasHeight * dpr;

  starCanvas.style.width = canvasWidth + "px";
  starCanvas.style.height = canvasHeight + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  stars = [];

  const count = Math.min(Math.floor((canvasWidth * canvasHeight) / 3500), 300);

  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      radius: Math.random() * 1.5 + 0.3,
      speed: Math.random() * 0.35 + 0.08,
      opacity: Math.random() * 0.7 + 0.2,
    });
  }
}

function animateStars() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  stars.forEach((star) => {
    star.y += star.speed;

    if (star.y > canvasHeight) {
      star.y = 0;
      star.x = Math.random() * canvasWidth;
    }

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(160,220,255,${star.opacity})`;
    ctx.fill();
  });

  requestAnimationFrame(animateStars);
}

createStars();
animateStars();

window.addEventListener("resize", createStars);

// 3. TYPING EFFECT

const typingElement = document.getElementById("typing");

const words = [
  "WEB DEVELOPER",
  "CREATIVE DESIGNER",
  "FRONTEND DEVELOPER",
  "TECH ENTHUSIAST",
  "FUTURE INNOVATOR",
];

let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typeWords() {
  const currentWord = words[wordIndex];

  if (deleting) {
    charIndex--;
  } else {
    charIndex++;
  }

  typingElement.textContent = currentWord.substring(0, charIndex);

  let speed = deleting ? 45 : 90;

  if (!deleting && charIndex === currentWord.length) {
    deleting = true;
    speed = 1400;
  } else if (deleting && charIndex === 0) {
    deleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    speed = 400;
  }

  setTimeout(typeWords, speed);
}

typeWords();

// 4. SCROLL REVEAL

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
  },
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

// 5. MOBILE NAVIGATION

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");

  menuToggle.textContent = navLinks.classList.contains("open") ? "✕" : "☰";
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.textContent = "☰";
  });
});

// 6. PROJECT CARD GLOW

document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    card.style.background = `
      radial-gradient(
        circle at ${x}px ${y}px,
        rgba(0,229,255,0.13),
        rgba(13,26,49,0.72) 65%
      )
    `;
  });

  card.addEventListener("pointerleave", () => {
    card.style.background = "";
  });
});

// 7. FOOTER YEAR

document.getElementById("year").textContent = new Date().getFullYear();
