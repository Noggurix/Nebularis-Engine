import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.140.0/build/three.module.js';

const scene = new THREE.Scene(); //Cria uma cena
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000); //Define uma câmera
const renderer = new THREE.WebGLRenderer(); //Define um renderizador
renderer.setSize(window.innerWidth, window.innerHeight); //Define a área de renderização com a largura e altura do navegador
document.body.appendChild(renderer.domElement); //Adiciona o elemento gerado pelo renderizador ao body desse arquivo

// Sol
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 }); //Cria o material do sol
const sun = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), sunMaterial); //Cria o objeto sol já definindo sua geometria e material
scene.add(sun);

// Planetas
const planetsData = [
  { name: "Mercury", color: 0xaaaaaa, distance: 8, size: 0.5, speed: 0.02 },
  { name: "Venus", color: 0xffcc00, distance: 12, size: 1, speed: 0.015 },
  { name: "Earth", color: 0x0000ff, distance: 16, size: 1.2, speed: 0.01 },
  { name: "Mars", color: 0xff4500, distance: 20, size: 0.8, speed: 0.008 },
]; //Array contendo nome, cor, distância do Sol, tamanho e velocidade orbital de todos os planetas

const planets = [];

// Adicionar planetas
planetsData.forEach(data => { //Itera sobre planetsData
  const material = new THREE.MeshBasicMaterial({ color: data.color }); //Define o material para os planetas
  const planet = new THREE.Mesh(new THREE.SphereGeometry(data.size, 32, 32), material); //Define geometria para os planetas
  planet.userData = { distance: data.distance, angle: 0, speed: data.speed }; //Define distancia, angulo e velocidade
  scene.add(planet); //Adiciona-os a cena
  planets.push(planet); //Adiciona-os ao array
});

// Posição inicial da câmera
camera.position.set(20, 20, 50);
camera.lookAt(0, 0, 0);

// Animação
function animate() {
  requestAnimationFrame(animate);

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
