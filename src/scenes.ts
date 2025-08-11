import * as THREE from 'three';
import { createAllPlanets, createSun } from './celestialBodies.js';
import CONFIG from './configs/renderer.json';
import SKYBOX from './configs/skybox.json';

export function createDefaultScene (
    textureMap: Record<string, THREE.Texture>
) {
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialias: CONFIG.renderer.antialias });
    const MAX_PIXEL_RATIO = 2;

    renderer.setPixelRatio(Math.min(MAX_PIXEL_RATIO, window.devicePixelRatio)); 
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    const skyboxLoader = new THREE.CubeTextureLoader();
    scene.background = skyboxLoader.load(SKYBOX.skybox);

    createSun(scene, textureMap);
    const currentObjects = createAllPlanets(scene, textureMap);
    console.log("Criou a cena");

    return { scene, renderer, currentObjects };
}