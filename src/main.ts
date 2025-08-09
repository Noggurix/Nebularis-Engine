import * as THREE from 'three';
import Stats from 'stats.js';
import { createDefaultScene } from './scenes.js';
import { createCamera } from './camera/camera.js';
import { createPostProcessing } from './visualEffects.js';
import { animateObjects } from './objectsAnimation.js';
import UnifiedCameraControls from './camera/movimentation.js';
import CONFIG from './configs/bodiesProperties.json'

const loadingScreen = document.getElementById('loading-screen') as HTMLElement;
const progressBar = document.getElementById('progress-bar') as HTMLElement;
const currentItemText = document.getElementById('current-item') as HTMLElement;

let geometryLoader: THREE.BufferGeometryLoader;
let composer: any;
let cameraControls: any;
let CurrentObjects: THREE.Object3D[] = [];

const loadingManager = new THREE.LoadingManager(
  () => {},
  (item, loaded, total) => {
    const progress = (loaded / total) * 100;
    progressBar.style.width = `${progress}%`;
    currentItemText.textContent = `${item}`;
  },
  (error) => {
    alert('Error loading resources:' + error);
  }
);

const textureLoader = new THREE.TextureLoader(loadingManager);
geometryLoader = new THREE.BufferGeometryLoader(loadingManager);

async function preloadTextures(textureLoader: THREE.TextureLoader): Promise<Record<string, THREE.Texture>> {
  const texturesToLoad = CONFIG.celestialBodiesProperties.map(body => ({
    name: body.name,
    url: body.texture
  }));

  const texturePromises = texturesToLoad.map(({ name, url }) =>
    new Promise<[string, THREE.Texture]>((resolve, reject) => {
      textureLoader.load(
        url,
        (texture) => resolve([name, texture]),
        undefined,
        (err) => reject(`Error loading texture ${name}: ${err}`)
      );
    })
  );

  const entries = await Promise.all(texturePromises);
  const textureMap: Record<string, THREE.Texture> = {};
  for (const [name, texture] of entries) {
    textureMap[name] = texture;
  }

  return textureMap;
}

let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let camera: THREE.PerspectiveCamera;

preloadTextures(textureLoader).then((textureMap) => {
    camera = createCamera();
    camera.position.set(0, 70, -200);
    const result = createDefaultScene(textureMap);
    scene = result.scene;
    renderer = result.renderer;
    CurrentObjects = result.currentObjects;

    cameraControls = new UnifiedCameraControls(camera, scene, renderer.domElement);
    composer = createPostProcessing(scene, renderer, camera);

    loadingScreen.style.display = 'none';
    start();
}).catch((error) => {
    alert('Error loading textures:' + error);
});

const performanceStats = new Stats();
performanceStats.showPanel(0);
document.body.appendChild(performanceStats.dom);

function animate() {
    performanceStats.begin();

    cameraControls.callCameraUpdates();
    animateObjects(CurrentObjects);

    composer.render();

    performanceStats.end();

    requestAnimationFrame(animate);
}

function start() {
  animate();
}

window.addEventListener('resize', () => {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});