import * as THREE from 'three';
import Stats from 'stats';
import { UnrealBloomPass } from 'UnrealBloomPass';
import { EffectComposer } from 'EffectComposer';
import { RenderPass } from 'RenderPass';
import CameraControls from './cameraControl.js';

// stats.js (Medidor de performance)
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

// Configurações gerais
const CONFIG = {
  scaleFactor: 60,
  camera: { fov: 50, aspect: window.innerWidth / window.innerHeight, near: 0.1, far: 2000 },
  renderer: { antialias: true },
  bloom: { strength: 0.8, radius: 0.9, threshold: 0.1 },
  skybox: [
    "skybox/posX.jpg", "skybox/negX.jpg",
    "skybox/posY.jpg", "skybox/negY.jpg",
    "skybox/posZ.jpg", "skybox/negZ.jpg"
  ],
  planets: [
    { name: "Mercury", texture: "textures/mercury/mercury.jpg", distance: 0.39, size: 0.5, period: 88 },
    { name: "Venus", texture: "textures/venus/venus.jpg", distance: 0.72, size: 1, period: 225 },
    { name: "Earth", texture: "textures/earth/earth_daymap.jpg", distance: 1.0, size: 1.2, period: 365.25 },
    { name: "Mars", texture: "textures/mars/mars.jpg", distance: 1.52, size: 0.8, period: 687 },
  ],
};

// Configuração da cena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(CONFIG.camera.fov, CONFIG.camera.aspect, CONFIG.camera.near, CONFIG.camera.far);
const renderer = new THREE.WebGLRenderer(CONFIG.renderer);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Carregar skybox
const loader = new THREE.CubeTextureLoader();
scene.background = loader.load(CONFIG.skybox);

// Controles da câmera
const cameraControls = new CameraControls(camera, document); // Carrega o script de controle de câmera
camera.position.set(0, 50, 100);
cameraControls.cameraControlRotation.x = -Math.PI / 6;
cameraControls.cameraControlRotation.y = Math.atan2(-camera.position.x, -camera.position.z);

// Pós-processamento
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight), 
  CONFIG.bloom.strength, CONFIG.bloom.radius, CONFIG.bloom.threshold
));

//Luz do sol
const sunLight = new THREE.PointLight(0xffffff, 500);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

// Carregador de texturas
const textureLoader = new THREE.TextureLoader();

// Adiciona Sol
const sunMaterial = new THREE.MeshBasicMaterial({ map: textureLoader.load("textures/sun/sun.jpg") }); // Material do sol
const sun = new THREE.Mesh(new THREE.SphereGeometry(10, 64, 64), sunMaterial); // Objeto sol com sua geometria e material
scene.add(sun);

// Adiciona planetas
const planets = CONFIG.planets.map(data => {
  const planetMaterial = new THREE.MeshStandardMaterial({ map: textureLoader.load(data.texture) });
  const planet = new THREE.Mesh(new THREE.SphereGeometry(data.size, 64, 64), planetMaterial); // Objeto planeta com geometria e material
  planet.userData = {
    distance: data.distance * CONFIG.scaleFactor,
    angle: Math.random() * Math.PI * 2,
    speed: (2 * Math.PI) / data.period / 100
  };
  scene.add(planet);
  return planet;
});

// Animação
function animate() {
  stats.begin();
  
  cameraControls.update();

  planets.forEach(planet => {
    const data = planet.userData;
    data.angle += data.speed; // Atualiza o ângulo de rotação
    planet.position.x = Math.cos(data.angle) * data.distance; // X baseado no coseno
    planet.position.z = Math.sin(data.angle) * data.distance; // Z baseado no seno
  });

  composer.render(); // Desenha a cena
  stats.end();
  requestAnimationFrame(animate);
}

// Ajustar o canvas ao redimensionar
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
