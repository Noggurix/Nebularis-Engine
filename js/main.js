import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.0/build/three.module.js';
import CameraControls from './cameraControl.js';

const scene = new THREE.Scene(); //Cria uma cena
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000); //Define uma câmera
const renderer = new THREE.WebGLRenderer({ antialias: true }); //Define um renderizador
renderer.setSize(window.innerWidth, window.innerHeight); //Define a área de renderização com a largura e altura do navegador
document.body.appendChild(renderer.domElement); //Adiciona o elemento gerado pelo renderizador ao body desse arquivo

const cameraControls = new CameraControls(camera, document);

// Carregar skybox
const loader = new THREE.CubeTextureLoader();
const skyboxTexture = loader.load([
  "skybox/posX.jpg", "skybox/negX.jpg",
  "skybox/posY.jpg", "skybox/negY.jpg",
  "skybox/posZ.jpg", "skybox/negZ.jpg"
]);
scene.background = skyboxTexture;

const textureLoader = new THREE.TextureLoader();

// Sol
const sunTexture = textureLoader.load("textures/sun.jpg");
const sunMaterial = new THREE.MeshBasicMaterial({
  map: sunTexture,
  emissive: new THREE.Color(0xFFFF00), // A cor do brilho emitido pelo Sol
  emissiveIntensity: 1.5, // Intensidade do brilho do Sol
});

const sun = new THREE.Mesh(new THREE.SphereGeometry(10, 128, 128), sunMaterial);
scene.add(sun);

const light = new THREE.PointLight(0xffffff, 1000); // Intensity aumentada
light.position.set(0, 0, 0);
scene.add(light);

// Carregar texturas para os planetas
const planetTextures = {
  Mercury: textureLoader.load("textures/mercury.jpg"),
  Venus: textureLoader.load("textures/venus.jpg"),
  Earth: textureLoader.load("textures/earth_daymap.jpg"),
  Mars: textureLoader.load("textures/mars.jpg"),
};

const scaleFactor = 50; // Escala para distâncias mais amplas

// Planetas
const planetsData = [
  { name: "Mercury", texture: "Mercury", distance: 0.39 * scaleFactor, size: 0.5, period: 88 },
  { name: "Venus", texture: "Venus", distance: 0.72 * scaleFactor, size: 1, period: 225 },
  { name: "Earth", texture: "Earth", distance: 1.00 * scaleFactor, size: 1.2, period: 365.25 },
  { name: "Mars", texture: "Mars", distance: 1.52 * scaleFactor, size: 0.8, period: 687 },
];

const planets = [];

// Adicionar planetas
planetsData.forEach(data => {
  const material = new THREE.MeshStandardMaterial({ map: planetTextures[data.texture] });
  const planet = new THREE.Mesh(new THREE.SphereGeometry(data.size, 64, 64), material);
  planet.userData = {
    distance: data.distance,
    angle: Math.random() * Math.PI * 2,  // Inicia a posição aleatoriamente
    period: data.period,
    speed: (2 * Math.PI) / data.period / 100 // Ajusta a velocidade com base no período (escala temporal)
  };
  scene.add(planet);
  planets.push(planet);
});

// Posição inicial da câmera
camera.position.set(0, 50, 100);
cameraControls.cameraRotation.x = -Math.PI / 6;  // Olhar para baixo a 30 graus
cameraControls.cameraRotation.y = Math.atan2(-camera.position.x, -camera.position.z);

// Animação
function animate() {
  requestAnimationFrame(animate);

  cameraControls.update(); // Atualiza os controles da câmera

  planets.forEach(planet => {
    const data = planet.userData; //Acessa userData
    data.angle += data.speed; //Determina o quanto o angulo aumenta a cada frame
    planet.position.x = Math.cos(data.angle) * data.distance; //Define o eixo x
    planet.position.z = Math.sin(data.angle) * data.distance; //Define eixo z
  });

  renderer.render(scene, camera); //Redesenha a cena
}

// Ajustar o canvas ao redimensionar
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
