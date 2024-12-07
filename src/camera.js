import * as THREE from 'three'
import CONFIG from './configs/camera.json' with  { type: 'json' };

export function createCamera() {
    const camera = new THREE.PerspectiveCamera(
        CONFIG.cameraProperties.fov,
        CONFIG.cameraProperties.aspect,
        CONFIG.cameraProperties.near,
        CONFIG.cameraProperties.far);

    return camera;
}