import * as THREE from 'three';
import Stats from 'stats.js';
import { createDefaultScene } from './scenes.js';
import { createCamera } from './camera/camera.js';
import { createPostProcessing, ENABLE_GLOBAL_POSTPROCESSING } from './visualEffects.js';
import { animateObjects } from './objectsAnimation.js';
import { moons } from './celestialBodies';
import UnifiedCameraControls from './camera/movimentation.js';
import CONFIG from './configs/bodiesProperties.json';
import { EffectComposer } from 'three/examples/jsm/Addons.js';

const loadingScreen = document.getElementById('loading-screen') as HTMLElement;
const progressBar = document.getElementById('progress-bar') as HTMLElement;
const currentItemText = document.getElementById('current-item') as HTMLElement;
const sceneList = document.getElementById("scene-list") as HTMLElement;

let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let camera: THREE.PerspectiveCamera;
let composer: EffectComposer;
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

preloadTextures(textureLoader).then((textureMap) => {
  const result = createDefaultScene(textureMap);
  scene = result.scene;
  renderer = result.renderer;
  CurrentObjects = result.currentObjects;

  updateItemsPanel();

  camera = createCamera();
  cameraControls = new UnifiedCameraControls(camera, scene, renderer.domElement);

  const postProcessing = createPostProcessing(scene, renderer, camera);
  composer = postProcessing.composer;

  loadingScreen.style.display = 'none';
  start();

}).catch((error) => {
    alert('Error loading textures:' + error);
});

function updateItemsPanel() {
  if (!sceneList) return;
  sceneList.innerHTML = "";

  CurrentObjects.forEach(item => {
    const div = document.createElement("div");
    div.className = "item";

    div.textContent = item.name;
    sceneList.appendChild(div);
  });
}

const performanceStats = new Stats();
performanceStats.showPanel(0);
document.body.appendChild(performanceStats.dom);

function animate() {
  performanceStats.begin();

  cameraControls.callCameraUpdates();

  animateObjects(CurrentObjects, moons);

  CurrentObjects.forEach(o => o instanceof THREE.LOD && o.update(camera));

  if (ENABLE_GLOBAL_POSTPROCESSING) {
    composer.render();
  } else {
    renderer.render(scene, camera);
  }

  performanceStats.end();

  requestAnimationFrame(animate);
}

function start() {
  animate();
}