
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const root = document.querySelector('#universe');

const scene = new THREE.Scene();
scene.background = new THREE.Color('#03050b');
scene.fog = new THREE.FogExp2('#03050b', 0.0007);

const camera = new THREE.PerspectiveCamera(
  45,
  innerWidth / innerHeight,
  0.1,
  3000
);

camera.position.set(0, 65, 115);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: 'high-performance'
});

renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
root.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.045;
controls.minDistance = 9;
controls.maxDistance = 240;
controls.maxPolarAngle = Math.PI * 0.88;
controls.target.set(0, 0, 0);

// Pencahayaan dasar
scene.add(new THREE.AmbientLight('#8192bd', 0.35));

const sunlight = new THREE.PointLight('#fff0cf', 18000, 0, 1.4);
sunlight.position.set(0, 0, 0);
scene.add(sunlight);

// Cahaya lembut tambahan
const fillLight = new THREE.HemisphereLight('#7daaff', '#080b19', 0.55);
scene.add(fillLight);

// Bintang dengan posisi acak
const starGeometry = new THREE.BufferGeometry();
const starPositions = [];

for (let i = 0; i < 5000; i++) {
  const radius = 250 + Math.random() * 900;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);

  starPositions.push(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

starGeometry.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(starPositions, 3)
);

const stars = new THREE.Points(
  starGeometry,
  new THREE.PointsMaterial({
    color: '#dbe7ff',
    size: 0.75,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.85
  })
);

scene.add(stars);

// Data planet
const planets = [
  {
    name: 'Merkurius', color: '#aaa49a', size: 0.8,
    orbit: 10, speed: 0.047, rotation: 0.003,
    diameter: '4.879 km', distance: '57,9 juta km',
    period: '88 hari', temperature: '167°C',
    desc: 'Planet terkecil dan terdekat dengan Matahari.',
    texture: 'https://threejs.org/examples/textures/planets/mercury.jpg'
  },
  {
    name: 'Venus', color: '#d7a86c', size: 1.25,
    orbit: 15, speed: 0.035, rotation: 0.001,
    diameter: '12.104 km', distance: '108,2 juta km',
    period: '225 hari', temperature: '464°C',
    desc: 'Dunia panas dengan atmosfer yang sangat tebal.',
    texture: 'https://threejs.org/examples/textures/planets/venus.jpg'
  },
  {
    name: 'Bumi', color: '#287fda', size: 1.35,
    orbit: 21, speed: 0.029, rotation: 0.008,
    diameter: '12.742 km', distance: '149,6 juta km',
    period: '365 hari', temperature: '15°C',
    desc: 'Dunia biru yang menjadi rumah bagi kehidupan.',
    texture: 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg'
  },
  {
    name: 'Mars', color: '#ce6c4b', size: 1.05,
    orbit: 28, speed: 0.023, rotation: 0.007,
    diameter: '6.779 km', distance: '227,9 juta km',
    period: '687 hari', temperature: '-65°C',
    desc: 'Planet merah yang menyimpan jejak air purba.',
    texture: 'https://threejs.org/examples/textures/planets/mars.jpg'
  },
  {
    name: 'Jupiter', color: '#d3ad86', size: 3.8,
    orbit: 40, speed: 0.013, rotation: 0.018,
    diameter: '139.820 km', distance: '778,6 juta km',
    period: '11,86 tahun', temperature: '-110°C',
    desc: 'Raksasa gas dengan badai besar di atmosfernya.',
    texture: 'https://threejs.org/examples/textures/planets/jupiter.jpg'
  },
  {
    name: 'Saturnus', color: '#ddc393', size: 3.1,
    orbit: 54, speed: 0.009, rotation: 0.015,
    diameter: '116.460 km', distance: '1,43 miliar km',
    period: '29,4 tahun', temperature: '-140°C',
    desc: 'Raksasa gas terkenal dengan sistem cincin es dan batu.',
    texture: 'https://threejs.org/examples/textures/planets/saturn.jpg'
  },
  {
    name: 'Uranus', color: '#8ad7dc', size: 2.15,
    orbit: 68, speed: 0.006, rotation: 0.01,
    diameter: '50.724 km', distance: '2,87 miliar km',
    period: '84 tahun', temperature: '-195°C',
    desc: 'Raksasa es dengan sumbu rotasi yang sangat miring.',
    texture: 'https://threejs.org/examples/textures/planets/uranus.jpg'
  },
  {
    name: 'Neptunus', color: '#416ee9', size: 2.1,
    orbit: 81, speed: 0.004, rotation: 0.009,
    diameter: '49.244 km', distance: '4,50 miliar km',
    period: '165 tahun', temperature: '-200°C',
    desc: 'Dunia biru jauh dengan angin yang sangat kencang.',
    texture: 'https://threejs.org/examples/textures/planets/neptune.jpg'
  }
];

const textureLoader = new THREE.TextureLoader();
textureLoader.setCrossOrigin('anonymous');

const planetObjects = [];
const orbitLines = [];

function createOrbit(radius) {
  const points = [];

  for (let i = 0; i <= 256; i++) {
    const angle = (i / 256) * Math.PI * 2;
    points.push(
      new THREE.Vector3(
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      )
    );
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.LineLoop(
    geometry,
    new THREE.LineBasicMaterial({
      color: '#40516e',
      transparent: true,
      opacity: 0.34
    })
  );

  scene.add(line);
  orbitLines.push(line);
}

planets.forEach((data, index) => {
  createOrbit(data.orbit);

  const pivot = new THREE.Group();
  scene.add(pivot);

  const geometry = new THREE.SphereGeometry(data.size, 64, 48);

  const material = new THREE.MeshStandardMaterial({
    color: data.color,
    roughness: 0.9,
    metalness: 0
  });

  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.x = data.orbit;
  sphere.rotation.z = index === 6 ? Math.PI / 2 : 0;
  sphere.userData.planetIndex = index;

  pivot.add(sphere);

  // Muat tekstur jika berhasil; warna dasar tetap tersedia jika gagal.
  textureLoader.load(
    data.texture,
    texture => {
      texture.colorSpace = THREE.SRGBColorSpace;
      material.map = texture;
      material.color.set('#ffffff');
      material.needsUpdate = true;
    },
    undefined,
    () => console.info(`Tekstur ${data.name} tidak tersedia; warna dasar digunakan.`)
  );

  // Atmosfer tipis pada Bumi
  if (data.name === 'Bumi') {
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(data.size * 1.08, 48, 32),
      new THREE.MeshBasicMaterial({
        color: '#4ca6ff',
        transparent: true,
        opacity: 0.11,
        side: THREE.BackSide
      })
    );

    sphere.add(atmosphere);
  }

  // Cincin Saturnus
  if (data.name === 'Saturnus') {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(data.size * 1.35, data.size * 2.15, 128),
      new THREE.MeshStandardMaterial({
        color: '#d7c49e',
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.82,
        roughness: 0.95
      })
    );

    ring.rotation.x = Math.PI / 2.35;
    sphere.add(ring);
  }

  planetObjects.push({
    data,
    pivot,
    sphere,
    angle: Math.random() * Math.PI * 2
  });
});

// Matahari
const sunGeometry = new THREE.SphereGeometry(5, 64, 48);

const sunMaterial = new THREE.MeshBasicMaterial({
  color: '#ffbf55'
});

const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

const sunGlow = new THREE.Sprite(
  new THREE.SpriteMaterial({
    map: makeGlowTexture(),
    color: '#ffb84d',
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })
);

sunGlow.scale.set(27, 27, 1);
scene.add(sunGlow);

function makeGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;

  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(64, 64, 3, 64, 64, 64);

  gradient.addColorStop(0, 'rgba(255,245,200,1)');
  gradient.addColorStop(0.15, 'rgba(255,190,75,.7)');
  gradient.addColorStop(0.45, 'rgba(255,125,30,.15)');
  gradient.addColorStop(1, 'rgba(255,100,20,0)');

  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);

  return new THREE.CanvasTexture(canvas);
}

// Antarmuka planet
const list = document.querySelector('#planet-list');
let selected = 2;
let orbitEnabled = true;
let speedMultiplier = 1;
let focusedObject = null;

planets.forEach((planet, index) => {
  const button = document.createElement('button');
  button.className = 'planet-option';
  button.innerHTML = `
    <span class="planet-dot" style="background:${planet.color}"></span>
    <span>${String(index + 1).padStart(2, '0')}. ${planet.name}</span>
  `;

  button.addEventListener('click', () => selectPlanet(index));
  list.appendChild(button);
});

function selectPlanet(index) {
  selected = index;
  focusedObject = planetObjects[index];

  const planet = planets[index];

  document.querySelector('#planet-index').textContent =
    `${String(index + 1).padStart(2, '0')} / 08`;

  document.querySelector('#planet-name').textContent = planet.name;
  document.querySelector('#planet-desc').textContent = planet.desc;
  document.querySelector('#diameter').textContent = planet.diameter;
  document.querySelector('#distance').textContent = planet.distance;
  document.querySelector('#period').textContent = planet.period;
  document.querySelector('#temperature').textContent = planet.temperature;

  [...list.children].forEach((button, i) => {
    button.classList.toggle('active', i === index);
  });

  const object = planetObjects[index].sphere;
  const position = new THREE.Vector3();

  object.getWorldPosition(position);

  const direction = new THREE.Vector3(0.7, 0.4, 1).normalize();

  controls.target.copy(position);
  camera.position.copy(position).addScaledVector(direction, planet.size * 7 + 10);
  controls.update();
}

document.querySelector('#zoom-in').addEventListener('click', () => {
  camera.position.addScaledVector(
    camera.position.clone().sub(controls.target).normalize(),
    -5
  );
});

document.querySelector('#zoom-out').addEventListener('click', () => {
  camera.position.addScaledVector(
    camera.position.clone().sub(controls.target).normalize(),
    5
  );
});

document.querySelector('#focus-btn').addEventListener('click', () => {
  selectPlanet(selected);
});

document.querySelector('#orbit-btn').addEventListener('click', event => {
  orbitEnabled = !orbitEnabled;
  event.currentTarget.textContent = orbitEnabled ? 'Orbit ON' : 'Orbit OFF';
});

document.querySelector('#speed-btn').addEventListener('click', event => {
  speedMultiplier = speedMultiplier === 1 ? 3 : speedMultiplier === 3 ? 0.25 : 1;
  event.currentTarget.textContent = `Kecepatan ${speedMultiplier}×`;
});

document.querySelector('#reset-btn').addEventListener('click', () => {
  camera.position.set(0, 65, 115);
  controls.target.set(0, 0, 0);
  controls.update();

  speedMultiplier = 1;
  orbitEnabled = true;

  document.querySelector('#orbit-btn').textContent = 'Orbit ON';
  document.querySelector('#speed-btn').textContent = 'Kecepatan 1×';
});

// Animasi utama
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.05);

  sun.rotation.y += delta * 0.08;
  sunGlow.material.opacity = 0.86 + Math.sin(clock.elapsedTime * 1.5) * 0.1;

  if (orbitEnabled) {
    planetObjects.forEach(item => {
      item.angle += item.data.speed * speedMultiplier * delta * 8;
      item.pivot.rotation.y = item.angle;
      item.sphere.rotation.y += item.data.rotation * speedMultiplier;
    });
  }

  stars.rotation.y += delta * 0.0015;

  controls.update();
  renderer.render(scene, camera);
}

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
});

selectPlanet(2);
animate();

document.querySelector('#loading').classList.add('hidden');
setTimeout(() => {
  document.querySelector('#loading').remove();
}, 700);
