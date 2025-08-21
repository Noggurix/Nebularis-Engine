import * as THREE from 'three';
import CONFIG from '../configs/camera.json' with  { type: 'json' };

export function createCamera() {
    const aspectRatio = window.innerWidth / window.innerHeight;

    const camera = new THREE.PerspectiveCamera(
        CONFIG.cameraProperties.fov,
        aspectRatio,
        CONFIG.cameraProperties.near,
        CONFIG.cameraProperties.far);

    camera.position.set(0, 70, -200);

    return camera;
}