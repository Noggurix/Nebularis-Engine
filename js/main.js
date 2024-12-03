import * as THREE from 'three';
import { UnrealBloomPass } from 'UnrealBloomPass';
import { EffectComposer } from 'EffectComposer';
import { RenderPass } from 'RenderPass';
import CameraControls from './cameraControl.js';

const scene = new THREE.Scene(); //Cria uma cena
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000); //Define uma câmera


const renderer = new THREE.WebGLRenderer({ antialias: true }); //Define um renderizador
renderer.setSize(window.innerWidth, window.innerHeight); //Define a área de renderização com a largura e altura do navegador
document.body.appendChild(renderer.domElement); //Adiciona o elemento gerado pelo renderizador ao body desse arquivo

const cameraControls = new CameraControls(camera, document); //Carrega o script de controle de câmera

//Define as imagens do skybox
const loader = new THREE.CubeTextureLoader();
const skyboxTexture = loader.load([
  "skybox/posX.jpg", "skybox/negX.jpg",
  "skybox/posY.jpg", "skybox/negY.jpg",
  "skybox/posZ.jpg", "skybox/negZ.jpg"
]);
scene.background = skyboxTexture;

const textureLoader = new THREE.TextureLoader();

const sunTexture = textureLoader.load("textures/sun/sun.jpg"); //Carrega a textura do sol

const sunMaterial = new THREE.MeshBasicMaterial({  //Define o material do sol
  map: sunTexture,
  emissive: new THREE.Color(1, 1, 1), // Emissão branca
  emissiveIntensity: 0.1, // Intensidade de emissão controlada
});

const sun = new THREE.Mesh(new THREE.SphereGeometry(10, 64, 64), sunMaterial); //Cria o objeto sol já definindo sua geometria e material
scene.add(sun);

//Cria uma luz e a define no sol
const light = new THREE.PointLight(0xffffff, 500);
light.position.set(0, 0, 0);
scene.add(light);

// Carregar texturas dos planetas
const planetTextures = {
  Mercury: textureLoader.load("textures/mercury/mercury.jpg"),
  Venus: textureLoader.load("textures/venus/venus.jpg"),
  Earth: textureLoader.load("textures/earth/earth_daymap.jpg"),
  Mars: textureLoader.load("textures/mars/mars.jpg"),
};

const scaleFactor = 50;

//Propriedades dos planetas
const planetsData = [
  { name: "Mercury", texture: "Mercury", distance: 0.72 * scaleFactor, size: 0.5, period: 88 },
  { name: "Venus", texture: "Venus", distance: 0.96 * scaleFactor, size: 1, period: 225 },
  { name: "Earth", texture: "Earth", distance: 1.34 * scaleFactor, size: 1.2, period: 365.25 },
  { name: "Mars", texture: "Mars", distance: 1.86 * scaleFactor, size: 0.8, period: 687 },
];

const planets = [];

// Adicionar planetas
planetsData.forEach(data => { //Itera sobre planetsData
  const material = new THREE.MeshStandardMaterial({ map: planetTextures[data.texture] }); //Define o material para os planetas
  const planet = new THREE.Mesh(new THREE.SphereGeometry(data.size, 64, 64), material); //Define geometria para os planetas
  planet.userData = {
    //Define distancia, ângulo, velocidade e periodo
    distance: data.distance,
    angle: Math.random() * Math.PI * 2,
    period: data.period,
    speed: (2 * Math.PI) / data.period / 100,
  };
  scene.add(planet); //Adiciona-os a cena
  planets.push(planet); //Adiciona-os ao array
});

//Posição da câmera inicial
camera.position.set(0, 50, 100);
cameraControls.cameraRotation.x = -Math.PI / 6;
cameraControls.cameraRotation.y = Math.atan2(-camera.position.x, -camera.position.z);

// Configurações de bloom
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.3, 0.1, 0.2
)
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(bloomPass);

// Animação
function animate() {
  requestAnimationFrame(animate);
  cameraControls.update();

  planets.forEach(planet => {
    const data = planet.userData; //Acessa userData
    data.angle += data.speed; //Determina o quanto o angulo aumenta a cada frame
    planet.position.x = Math.cos(data.angle) * data.distance; //Define o eixo x
    planet.position.z = Math.sin(data.angle) * data.distance; //Define eixo z
  });

  composer.render(); //Redesenha a cena
}

// Ajustar o canvas ao redimensionar
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
