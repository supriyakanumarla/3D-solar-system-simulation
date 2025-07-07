// script.js

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 30, 70);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1.5);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Texture loader
const loader = new THREE.TextureLoader();

// Starfield background
scene.background = loader.load("textures/starfield.jpg");

// Sun
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({
  map: loader.load("textures/sun.jpg"),
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Planets
const planetData = [
  { name: "Mercury", size: 0.5, distance: 8, speed: 0.02 },
  { name: "Venus", size: 0.9, distance: 11, speed: 0.015 },
  { name: "Earth", size: 1, distance: 14, speed: 0.01 },
  { name: "Mars", size: 0.8, distance: 17, speed: 0.008 },
  { name: "Jupiter", size: 2, distance: 22, speed: 0.006 },
  { name: "Saturn", size: 1.8, distance: 28, speed: 0.005 },
  { name: "Uranus", size: 1.5, distance: 34, speed: 0.003 },
  { name: "Neptune", size: 1.4, distance: 40, speed: 0.002 },
];

const planets = [];

planetData.forEach((planet) => {
  const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
  const material = new THREE.MeshPhongMaterial({
    map: loader.load(`textures/${planet.name.toLowerCase()}.jpg`),
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData = {
    distance: planet.distance,
    angle: Math.random() * Math.PI * 2,
    speed: planet.speed,
    inclination: (Math.random() - 0.5) * 0.1,
  };
  scene.add(mesh);
  planets.push(mesh);

  // orbit ring dashed
  const orbitPoints = [];
  const segments = 128;
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * 2 * Math.PI;
    orbitPoints.push(
      new THREE.Vector3(
        planet.distance * Math.cos(theta),
        0,
        planet.distance * Math.sin(theta)
      )
    );
  }
  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
  const orbitMaterial = new THREE.LineDashedMaterial({
    color: 0xffffff,
    dashSize: 1,
    gapSize: 0.5,
  });
  const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
  orbitLine.computeLineDistances();
  scene.add(orbitLine);

  // speed sliders
  const controlsDiv = document.getElementById("controls");
  const sliderContainer = document.createElement("div");
  sliderContainer.innerHTML = `
    <label style="color:white;font-size:12px">${planet.name}</label>
    <input type="range" min="0" max="0.05" step="0.001" value="${planet.speed}" id="${planet.name}">
  `;
  controlsDiv.appendChild(sliderContainer);

  document
    .getElementById(planet.name)
    .addEventListener("input", (e) => {
      mesh.userData.speed = parseFloat(e.target.value);
    });
});

// Pause/Resume
let isPaused = false;
document.getElementById("pauseBtn").addEventListener("click", () => {
  isPaused = !isPaused;
  document.getElementById("pauseBtn").innerText = isPaused ? "Resume" : "Pause";
});

// Theme toggle (fixed)
let isDark = true;
document.getElementById("themeBtn").addEventListener("click", () => {
  isDark = !isDark;
  if (isDark) {
    document.body.style.backgroundColor = "black";
    document.getElementById("controls").style.background = "rgba(255,255,255,0.1)";
    tooltip.style.color = "white";
    tooltip.style.background = "rgba(0,0,0,0.7)";
  } else {
    document.body.style.backgroundColor = "white";
    document.getElementById("controls").style.background = "rgba(0,0,0,0.1)";
    tooltip.style.color = "black";
    tooltip.style.background = "rgba(255,255,255,0.7)";
  }
});

// Tooltips (fixed)
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const tooltip = document.createElement("div");
tooltip.style.position = "fixed";
tooltip.style.color = "white";
tooltip.style.padding = "4px 8px";
tooltip.style.background = "rgba(0,0,0,0.7)";
tooltip.style.display = "none";
tooltip.style.zIndex = "10";
document.body.appendChild(tooltip);

// store last mouse event
let lastMouseEvent = null;
window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  lastMouseEvent = e;
});

// Animate
function animate() {
  requestAnimationFrame(animate);

  if (!isPaused) {
    planets.forEach((planet) => {
      planet.userData.angle += planet.userData.speed;
      planet.position.x =
        planet.userData.distance * Math.cos(planet.userData.angle);
      planet.position.z =
        planet.userData.distance * Math.sin(planet.userData.angle);
      planet.position.y =
        planet.userData.distance * Math.sin(planet.userData.inclination);
    });
  }

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(planets);
  if (intersects.length > 0) {
    if (lastMouseEvent) {
      tooltip.style.left = `${lastMouseEvent.clientX + 5}px`;
      tooltip.style.top = `${lastMouseEvent.clientY + 5}px`;
    }
    tooltip.style.display = "block";
    tooltip.innerText =
      planetData[planets.indexOf(intersects[0].object)].name;
  } else {
    tooltip.style.display = "none";
  }

  renderer.render(scene, camera);
}

animate();

// Responsive
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
