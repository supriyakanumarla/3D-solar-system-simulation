import * as THREE from 'three';
import { OrbitControls } from './js/OrbitControls.js';

try {
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

  // Renderer with shadows
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  // Camera controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 10;
  controls.maxDistance = 100;
  controls.enablePan = false;

  // Lighting with shadows
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0xffffff, 1.5);
  pointLight.position.set(0, 0, 0);
  pointLight.castShadow = true;
  pointLight.shadow.mapSize.width = 2048;
  pointLight.shadow.mapSize.height = 2048;
  scene.add(pointLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
  directionalLight.position.set(10, 10, 10);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  scene.add(directionalLight);

  // Dynamic starfield with twinkling
  const stars = [];
  function createStarfield() {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 10000;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      transparent: true,
      opacity: 0.8
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);
    stars.push(starField);
  }
  createStarfield();

  // Texture loader with error handling
  const loader = new THREE.TextureLoader();
  function loadTexture(path) {
    try {
      return loader.load(
        path,
        undefined,
        undefined,
        (error) => {
          console.error(`Failed to load texture: ${path}`, error);
        }
      );
    } catch (e) {
      console.error(`Error loading texture: ${path}`, e);
      return null;
    }
  }

  // Set background texture
  const backgroundTexture = loadTexture("textures/starfield.jpg");
  if (backgroundTexture) {
    scene.background = backgroundTexture;
  } else {
    console.warn("Starfield background texture not loaded, using default background");
  }

  // Sun with shadow casting
  const sunTexture = loadTexture("textures/sun.jpg");
  const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
  const sunMaterial = new THREE.MeshBasicMaterial({
    map: sunTexture,
  });
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  sun.castShadow = false;
  sun.receiveShadow = false;
  scene.add(sun);

  // Planets with shadows
  const planetData = [
    { name: "Mercury", size: 0.5, distance: 8, speed: 0.02, inclination: 0.01, info: "Closest planet to the Sun - Smallest planet" },
    { name: "Venus", size: 0.9, distance: 11, speed: 0.015, inclination: 0.03, info: "Hottest planet" },
    { name: "Earth", size: 1, distance: 14, speed: 0.01, inclination: 0.02, info: "Our home planet - Only known habitable planet" },
    { name: "Mars", size: 0.8, distance: 17, speed: 0.008, inclination: 0.03, info: "The Red Planet - Red planet with potential for life" },
    { name: "Jupiter", size: 2, distance: 22, speed: 0.006, inclination: 0.01, info: "Largest planet" },
    { name: "Saturn", size: 1.8, distance: 28, speed: 0.005, inclination: 0.02, info: "Known for its rings" },
    { name: "Uranus", size: 1.5, distance: 34, speed: 0.003, inclination: 0.04, info: "Ice giant - Tilts on its side" },
    { name: "Neptune", size: 1.4, distance: 40, speed: 0.002, inclination: 0.03, info: "Deep blue planet - Deepest blue planet" },
  ];

  const planets = [];
  planetData.forEach((planet) => {
    const texture = loadTexture(`textures/${planet.name.toLowerCase()}.jpg`);
    if (!texture) {
      console.warn(`Skipping planet ${planet.name} due to texture loading failure`);
      return;
    }
    const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      map: texture,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = {
      distance: planet.distance,
      angle: Math.random() * Math.PI * 2,
      speed: planet.speed,
      inclination: planet.inclination,
      size: planet.size,
      name: planet.name,
      info: planet.info
    };
    scene.add(mesh);
    planets.push(mesh);

    // Orbit ring
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
    scene.add(orbitLine);

    // Speed and inclination sliders
    const controlsDiv = document.getElementById("controls");
    const sliderContainer = document.createElement("div");
    sliderContainer.className = "slider-container";
    sliderContainer.innerHTML = `
      <label>${planet.name}</label>
      <div>
        <label>Speed</label>
        <input type="range" min="0" max="0.05" step="0.001" value="${planet.speed}" id="${planet.name}-speed">
      </div>
      <div>
        <label>Inclination</label>
        <input type="range" min="0" max="0.1" step="0.001" value="${planet.inclination}" id="${planet.name}-inclination">
      </div>
    `;
    controlsDiv.appendChild(sliderContainer);
    document.getElementById(planet.name + "-speed").addEventListener("input", (e) => {
      mesh.userData.speed = parseFloat(e.target.value);
    });
    document.getElementById(planet.name + "-inclination").addEventListener("input", (e) => {
      mesh.userData.inclination = parseFloat(e.target.value);
    });

    // Saturn rings
    if (planet.name === "Saturn") {
      const ringGeometry = new THREE.RingGeometry(2.2, 3.5, 32);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xcccccc,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.copy(mesh.position);
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);
    }
  });

  // Pause/Resume
  let isPaused = false;
  document.getElementById("pauseBtn").addEventListener("click", () => {
    isPaused = !isPaused;
    document.getElementById("pauseBtn").innerText = isPaused ? "Resume" : "Pause";
    if (!isPaused) isAutoRotating = false;
  });

  // Theme toggle with optimization
  let isDark = true;
  document.getElementById("themeBtn").addEventListener("click", (event) => {
    if (event.detail === 2) {
      isAutoRotating = !isAutoRotating;
      document.getElementById("themeBtn").innerText = isAutoRotating ? "Stop Rotate" : (isDark ? "Dark Mode" : "Light Mode");
      return;
    }
    isDark = !isDark;
    const body = document.body;
    const controls = document.getElementById("controls");
    const tooltip = document.querySelector(".tooltip");
    const infoPanel = document.getElementById("info-panel");
    body.className = isDark ? '' : 'light-theme';
    controls.className = isDark ? '' : 'light-controls';
    tooltip.className = isDark ? 'tooltip' : 'tooltip light-tooltip';
    infoPanel.className = isDark ? '' : 'light-theme';
    document.getElementById("themeBtn").innerText = isDark ? "Dark Mode" : "Light Mode";
    controls.update();
  });

  // Click-to-focus with auto-rotate option
  let targetCameraPosition = camera.position.clone();
  let targetLookAt = new THREE.Vector3(0, 0, 0);
  let isFocusing = false;
  let focusProgress = 0;
  let isAutoRotating = false;
  let autoRotateAngle = 0;

  function focusOnPlanet(planet) {
    isFocusing = true;
    focusProgress = 0;
    targetCameraPosition = new THREE.Vector3(
      planet.position.x,
      planet.position.y + planet.userData.distance * 0.5,
      planet.position.z + planet.userData.distance * 1.5
    );
    targetLookAt = planet.position.clone();
    document.getElementById("infoTitle").textContent = planet.userData.name;
    // Split info into description and specialty, if present
    const [description, specialty] = planet.userData.info.split(" - ");
    document.getElementById("infoText").textContent = `${description} (Distance: ${planet.userData.distance} AU, Size: ${planet.userData.size} units)${specialty ? ` - Specialty: ${specialty}` : ''}`;
  }

  // Raycaster for click detection
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const tooltip = document.createElement("div");
  tooltip.className = "tooltip";
  tooltip.style.position = "fixed";
  tooltip.style.padding = "8px 12px";
  tooltip.style.display = "none";
  tooltip.style.zIndex = "10";
  document.body.appendChild(tooltip);

  window.addEventListener("click", (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([...planets, sun]);
    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      if (clickedObject === sun) {
        isFocusing = true;
        focusProgress = 0;
        targetCameraPosition = new THREE.Vector3(0, 30, 70);
        targetLookAt = new THREE.Vector3(0, 0, 0);
        document.getElementById("infoTitle").textContent = "Solar System";
        document.getElementById("infoText").textContent = "Click a planet to focus or use mouse to rotate/zoom";
      } else {
        focusOnPlanet(clickedObject);
      }
    }
  });

  let lastMouseEvent = null;
  window.addEventListener("mousemove", (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    lastMouseEvent = e;
  });

  // Animation loop with twinkling and auto-rotate
  function animate() {
    requestAnimationFrame(animate);

    if (!isPaused) {
      planets.forEach((planet) => {
        planet.userData.angle += planet.userData.speed;
        planet.position.x = planet.userData.distance * Math.cos(planet.userData.angle);
        planet.position.z = planet.userData.distance * Math.sin(planet.userData.angle);
        planet.position.y = planet.userData.distance * Math.sin(planet.userData.inclination * planet.userData.angle);
      });

      // Twinkling stars
      stars.forEach(star => {
        star.material.opacity = 0.6 + Math.random() * 0.4;
      });

      // Auto-rotate camera
      if (isAutoRotating && !isFocusing) {
        autoRotateAngle += 0.005;
        const radius = 50;
        camera.position.x = radius * Math.cos(autoRotateAngle);
        camera.position.z = radius * Math.sin(autoRotateAngle);
        camera.position.y = 30;
        camera.lookAt(0, 0, 0);
      }
    }

    // Smooth camera transition
    if (isFocusing) {
      focusProgress += 0.02;
      camera.position.lerp(targetCameraPosition, focusProgress);
      camera.lookAt(targetLookAt);
      if (focusProgress >= 1) isFocusing = false;
    }

    // Tooltip handling
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([...planets, sun]);
    if (intersects.length > 0) {
      if (lastMouseEvent) {
        tooltip.style.left = `${lastMouseEvent.clientX + 10}px`;
        tooltip.style.top = `${lastMouseEvent.clientY + 10}px`;
      }
      tooltip.style.display = "block";
      const obj = intersects[0].object;
      tooltip.innerText = obj === sun ? "Sun" : obj.userData.name;
    } else {
      tooltip.style.display = "none";
    }

    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // Responsive
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

} catch (error) {
  console.error("Runtime error in script.js:", error);
  alert("An error occurred while initializing the simulation. Please check the console for details.");
}