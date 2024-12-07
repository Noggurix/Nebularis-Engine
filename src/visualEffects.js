import * as THREE from 'three'
import { UnrealBloomPass } from 'UnrealBloomPass';
import { EffectComposer } from 'EffectComposer';
import { RenderPass } from 'RenderPass';
import postProcessingConfig from './configs/postProcessing.json' with  { type: 'json' };

export function createPostProcessing(scene, renderer, camera) {
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight), 
        postProcessingConfig.bloom.strength, 
        postProcessingConfig.bloom.radius, 
        postProcessingConfig.bloom.threshold
    ));

    return composer;
}