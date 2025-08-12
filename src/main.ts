import * as THREE from 'three';
import Stats from 'stats.js';
import { createDefaultScene } from './scenes.js';
import { createCamera } from './camera/camera.js';
import { createPostProcessing, POSTPROCESSING_SCALE } from './visualEffects.js';
import { animateObjects } from './objectsAnimation.js';
import UnifiedCameraControls from './camera/movimentation.js';
import CONFIG from './configs/bodiesProperties.json';

const loadingScreen = document.getElementById('loading-screen') as HTMLElement;
const progressBar = document.getElementById('progress-bar') as HTMLElement;
const currentItemText = document.getElementById('current-item') as HTMLElement;
const sceneList = document.getElementById("scene-list") as HTMLElement;

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
    updateItemsPanel();

    cameraControls = new UnifiedCameraControls(camera, scene, renderer.domElement);

    const postProcessing = createPostProcessing(scene, renderer, camera);
    composer = postProcessing.composer;
    const bloomPass = postProcessing.bloomPass;

    loadingScreen.style.display = 'none';
    start();

    window.addEventListener('resize', () => {
      if (!camera || !renderer || !composer || !bloomPass) return;

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);

      const w = window.innerWidth * POSTPROCESSING_SCALE;
      const h = window.innerHeight * POSTPROCESSING_SCALE;

      composer.setSize(w, h);
      bloomPass.setSize(w, h);
    });
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
    animateObjects(CurrentObjects);

     CurrentObjects.forEach(obj => {
      if (obj instanceof THREE.LOD) {
        obj.update(camera);
      }
    });

    composer.render(renderer);

    performanceStats.end();

    requestAnimationFrame(animate);
}

function start() {
  animate();
}