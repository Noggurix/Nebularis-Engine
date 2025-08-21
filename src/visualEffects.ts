import * as THREE from 'three'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import VFX_CONFIG from './configs/postProcessing.json'

export const ENABLE_GLOBAL_POSTPROCESSING = true;
export const POSTPROCESSING_ENABLE_BLOOM = true;
export const POSTPROCESSING_USE_HDR = true;
export const POSTPROCESSING_RESOLUTION_SCALE = 1.5;
export const POSTPROCESSING_BLOOM_RES_SCALE = 1;

export function createPostProcessing(
    scene: THREE.Scene,
    renderer: THREE.WebGLRenderer,
    camera: THREE.PerspectiveCamera
): { 
  composer: EffectComposer, 
  bloomPass?: UnrealBloomPass
} {
  const renderTarget = new THREE.WebGLRenderTarget(
    window.innerWidth * POSTPROCESSING_RESOLUTION_SCALE,
    window.innerHeight * POSTPROCESSING_RESOLUTION_SCALE,
    {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: POSTPROCESSING_USE_HDR ? THREE.HalfFloatType : THREE.UnsignedByteType,
      stencilBuffer: false,
      depthBuffer: true
    }
  );

  const renderPass = new RenderPass(scene, camera);
  const composer = new EffectComposer(renderer, renderTarget); 
  composer.addPass(renderPass); 

  let bloomPass: UnrealBloomPass | undefined = undefined;
  
  if (POSTPROCESSING_ENABLE_BLOOM) {
      bloomPass = new UnrealBloomPass(
        new THREE.Vector2(
          window.innerWidth * POSTPROCESSING_BLOOM_RES_SCALE,
          window.innerHeight * POSTPROCESSING_BLOOM_RES_SCALE
        ),
        VFX_CONFIG.bloom.strength, 
        VFX_CONFIG.bloom.radius, 
        VFX_CONFIG.bloom.threshold
      );
    composer.addPass(bloomPass);
  }

  window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.setSize(width, height);
    composer.setSize(width, height);

    if (bloomPass) bloomPass.setSize(width, height);
  });

  return { composer, bloomPass };
}