import * as THREE from 'three'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import postProcessingConfig from './configs/postProcessing.json'

export function createPostProcessing(
    scene: THREE.Scene,
    renderer: THREE.WebGLRenderer,
    camera: THREE.PerspectiveCamera
): EffectComposer {
    const composer = new EffectComposer(renderer);

    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2),
        postProcessingConfig.bloom.strength, 
        postProcessingConfig.bloom.radius, 
        postProcessingConfig.bloom.threshold
    ));

    return composer;
}