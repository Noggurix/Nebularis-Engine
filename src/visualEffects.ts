import * as THREE from 'three'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import postProcessingConfig from './configs/postProcessing.json'

export const POSTPROCESSING_SCALE = 0.75;

export function createPostProcessing(
    scene: THREE.Scene,
    renderer: THREE.WebGLRenderer,
    camera: THREE.PerspectiveCamera
): { composer: EffectComposer, bloomPass: UnrealBloomPass } {
    const renderTarget = new THREE.WebGLRenderTarget(
      window.innerWidth  * POSTPROCESSING_SCALE,
      window.innerHeight  * POSTPROCESSING_SCALE,
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        stencilBuffer: false,
      }
    );

    const composer = new EffectComposer(renderer, renderTarget);

    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2),
        postProcessingConfig.bloom.strength, 
        postProcessingConfig.bloom.radius, 
        postProcessingConfig.bloom.threshold
    );
    composer.addPass(bloomPass);

    return { composer, bloomPass };
}