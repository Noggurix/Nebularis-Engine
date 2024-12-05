import * as THREE from 'three';
import Stats from 'stats';
import { UnrealBloomPass } from 'UnrealBloomPass';
import { EffectComposer } from 'EffectComposer';
import { RenderPass } from 'RenderPass';
import CameraControls from './cameraControl.js';

const performanceStats = new Stats();
performanceStats.showPanel(0);
document.body.appendChild(performanceStats.dom);

const CONFIG = {
  camera: { fov: 50, aspect: window.innerWidth / window.innerHeight, near: 0.1, far: 2000 },
  renderer: { antialias: true },
  bloom: { strength: 0.8, radius: 0.9, threshold: 0.1 },
  skybox: [
    "skybox/posX.jpg", "skybox/negX.jpg",
    "skybox/posY.jpg", "skybox/negY.jpg",
    "skybox/posZ.jpg", "skybox/negZ.jpg"
  ],
  planetScaleFactor: 100,
  planets: [
    { name: "Mercury", texture: "textures/mercury/mercury.jpg", distance: 0.387, size: 0.5, period: 88 },
    { name: "Venus", texture: "textures/venus/venus.jpg", distance: 0.722, size: 0.9, period: 225 },
    { name: "Earth", texture: "textures/earth/earth_daymap.jpg", distance: 1.00, size: 1.5, period: 365.25 },
    { name: "Mars", texture: "textures/mars/mars.jpg", distance: 1.52, size: 0.77, period: 687 },
    { name: "Jupiter", texture: "textures/jupiter/jupiter.jpg", distance: 5.2, size: 14.5, period: 4333 },
    { name: "Saturn", texture: "textures/saturn/saturn.jpg", distance: 9.58, size: 12.5, period: 10759 },
    { name: "Uranus", texture: "textures/uranus/uranus.jpg", distance: 14.2, size: 3.87, period: 30687 },   
    { name: "Neptune", texture: "textures/neptune/neptune.jpg", distance: 20.1, size: 3.69, period: 60190 }
  ]
};

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer(CONFIG.renderer);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const skyboxLoader = new THREE.CubeTextureLoader();
scene.background = skyboxLoader.load(CONFIG.skybox);

const camera = new THREE.PerspectiveCamera(CONFIG.camera.fov, CONFIG.camera.aspect, CONFIG.camera.near, CONFIG.camera.far);
const cameraControls = new CameraControls(camera, document);
camera.position.set(0, 50, 100);
cameraControls.cameraControlRotation.x = -Math.PI / 6;
cameraControls.cameraControlRotation.y = Math.atan2(-camera.position.x, -camera.position.z);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight), 
  CONFIG.bloom.strength, CONFIG.bloom.radius, CONFIG.bloom.threshold
));

const sunLight = new THREE.PointLight(0xffffff, 0.3, 10000, 0);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

const textureLoader = new THREE.TextureLoader();

const sunMaterial = new THREE.MeshBasicMaterial({ map: textureLoader.load("textures/sun/sun.jpg") });
const sun = new THREE.Mesh(new THREE.SphereGeometry(30, 64, 64), sunMaterial);
scene.add(sun);

const planetIteration = CONFIG.planets.map(data => {
  const planetMaterial = new THREE.MeshStandardMaterial({ map: textureLoader.load(data.texture)});
  const objPlanet = new THREE.Mesh(new THREE.SphereGeometry(data.size, 64, 64), planetMaterial);
  objPlanet.name = data.name;

  if (data.name === "Earth") {
    const moon = createMoon(textureLoader);

    const moonOrbitGroup = new THREE.Group();
    moonOrbitGroup.add(moon);
    objPlanet.add(moonOrbitGroup);

    moonOrbitGroup.userData = {
      orbitRadius: 0.02 * CONFIG.planetScaleFactor,
      angle: Math.random() * Math.PI * 2,
      speed: (2 * Math.PI) / 27.3 / 100
    };
  }

  if (data.name === "Saturn") {
    const saturnRing = createSaturnRings(textureLoader);

    const ringOrbit = new THREE.Group();
    ringOrbit.add(saturnRing);
    objPlanet.add(ringOrbit);
  }

  objPlanet.userData = {
    distance: data.distance * CONFIG.planetScaleFactor,
    angle: Math.random() * Math.PI * 2,
    speed: (2 * Math.PI) / data.period / 100
  };

  scene.add(objPlanet);

  return objPlanet;
});

function createMoon(textureLoader) {
  const moonMaterial = new THREE.MeshStandardMaterial({ map: textureLoader.load("textures/moon/moon.jpg") });
  const objMoon = new THREE.Mesh(new THREE.SphereGeometry(0.32, 64, 64), moonMaterial);

  return objMoon;
}

function createSaturnRings (textureLoader) {
  const saturnRingGeometry = new THREE.RingGeometry(15.5, 21.5, 128);
  const saturnRingMaterial = new THREE.MeshBasicMaterial({
    map: textureLoader.load("textures/saturn/saturn_ring.png"),
    side: THREE.DoubleSide,
    opacity: 0.4,
    transparent: true,
    color: 0x888888
  });

  const saturnRing = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial);
  saturnRing.rotation.x = 20;
  saturnRing.rotation.z = 10;

  return saturnRing;
}

function animate() {
  performanceStats.begin();

  cameraControls.callCameraUpdates();

  planetIteration.forEach(objPlanet => {
    const data = objPlanet.userData;
    data.angle += data.speed;
    objPlanet.position.x = Math.cos(data.angle) * data.distance; // X baseado no coseno
    objPlanet.position.z = Math.sin(data.angle) * data.distance; // Z baseado no seno

    if (objPlanet.name === "Earth" && objPlanet.children.length > 0) {
      const moonOrbitGroup = objPlanet.children[0];
      const moonData = moonOrbitGroup.userData;

      moonData.angle += moonData.speed;
      moonOrbitGroup.position.x = Math.cos(moonData.angle) * moonData.orbitRadius;
      moonOrbitGroup.position.z = Math.sin(moonData.angle) * moonData.orbitRadius;
    }
  });

  composer.render();

  performanceStats.end();

  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
