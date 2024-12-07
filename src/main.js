import Stats from 'stats';
import { createScene } from './scene.js';
import { createCamera } from './camera.js';
import { createPostProcessing } from './visualEffects.js';
import { createPlanets, createSun } from './celestialBodies.js';
import { animateObjects } from './objectsAnimation.js';
import CameraControls from './cameraInputController.js';

const { scene, renderer } = createScene();

const camera = createCamera();
const cameraControls = new CameraControls(camera, document);
cameraControls.cameraControlRotation.x = -650;
camera.position.set(0, 70, -200);

const composer = createPostProcessing(scene, renderer, camera);

createSun(scene);
const planetIteration = createPlanets(scene);

const performanceStats = new Stats();
performanceStats.showPanel(0);
document.body.appendChild(performanceStats.dom);

function animate() {
  performanceStats.begin();

  cameraControls.callCameraUpdates();

  animateObjects(planetIteration);

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