import * as THREE from 'three'
import CONFIG from './configs/renderer.json' with  { type: 'json' };

export function createScene () {
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer(CONFIG.renderer.antialias);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const skyboxLoader = new THREE.CubeTextureLoader();
    scene.background = skyboxLoader.load(CONFIG.skybox);

    return { scene, renderer };
}