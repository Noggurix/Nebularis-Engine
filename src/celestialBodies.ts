import * as THREE from 'three';
import CONFIG from './configs/bodiesProperties.json';
import type { CelestialBody, BodiesProperties } from './types/bodies';

const configTyped = CONFIG as BodiesProperties;

export function getCelestialBodyOrThrow(name: string): CelestialBody {
  const body = configTyped.celestialBodiesProperties.find(b => b.name === name);

  if (!body) {
    throw new Error(`Celestial body '${name}' not found.`);
  }

  return body;
}

export function createSun (scene: THREE.Scene, textureMap: Record<string, THREE.Texture>) {
    const sunData: CelestialBody = getCelestialBodyOrThrow('Sun');
    const texture = textureMap[sunData.name];

    const sunMaterial = new THREE.MeshStandardMaterial({ 
        map: texture,
        emissiveMap: texture,
        emissive: new THREE.Color(0xffcc33),
        emissiveIntensity: 0.8
    });

    const sun = new THREE.Mesh(new THREE.SphereGeometry(30, 32, 32), sunMaterial);
    scene.add(sun);

    const sunLight = new THREE.PointLight(0xffeaab, 0.3, 10000, 0);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);
}

export function createAllPlanets (scene: THREE.Scene, textureMap: Record<string, THREE.Texture>): THREE.LOD[] {
        const moonData: CelestialBody = getCelestialBodyOrThrow('Moon');
        const saturnRingData: CelestialBody = getCelestialBodyOrThrow('Saturn Ring');

        const currentObjects: THREE.LOD[] = configTyped.celestialBodiesProperties
           .filter((body): body is CelestialBody => body.type === 'planet')
            .map((planet: CelestialBody) => {

                const lod = new THREE.LOD();

                const planetMaterial = new THREE.MeshStandardMaterial({ map: textureMap[planet.name] });

                const highDetail = new THREE.Mesh(new THREE.SphereGeometry(planet.size, 32, 32), planetMaterial);
                const midDetail = new THREE.Mesh(new THREE.SphereGeometry(planet.size, 16, 16), planetMaterial);
                const lowDetail = new THREE.Mesh(new THREE.SphereGeometry(planet.size, 8, 8), planetMaterial);

                highDetail.name = planet.name + "_high";
                midDetail.name = planet.name + "_mid";
                lowDetail.name = planet.name + "_low";

                lod.addLevel(highDetail, 0);
                lod.addLevel(midDetail, 70);
                lod.addLevel(lowDetail, 100);

                lod.name = planet.name;

                if (planet.name === "Earth" && moonData) {
                    const moon = createMoon(textureMap, moonData);
                    const moonOrbitGroup = new THREE.Group();
                    moonOrbitGroup.add(moon);
                    lod.add(moonOrbitGroup);

                    moonOrbitGroup.userData = {
                    orbitRadius: 0.0228 * configTyped.planetScaleFactor,
                    angle: Math.random() * Math.PI * 2,
                    speed: (2 * Math.PI) / 27.3 / 100
                    };
                }
                
                if (planet.name === "Saturn" && saturnRingData) {
                    const saturnRing = createSaturnRings(textureMap, saturnRingData);
                    const ringOrbit = new THREE.Group();
                    ringOrbit.add(saturnRing);
                    lod.add(ringOrbit);
                }

                if (planet.distance === undefined || planet.period === undefined) {
                    throw new Error(`Planet ${planet.name} is missing distance or period.`);
                }

                lod.userData = {
                    distance: planet.distance * configTyped.planetScaleFactor,
                    angle: Math.random() * Math.PI * 2,
                    speed: (2 * Math.PI) / planet.period / 100
                };
                
                scene.add(lod);

                return lod;
            });

    return currentObjects;
}

function createMoon(textureMap: Record<string, THREE.Texture>, moonData: CelestialBody): THREE.Mesh {
    return new THREE.Mesh(
        new THREE.SphereGeometry(moonData.size, 32, 32),
        new THREE.MeshStandardMaterial({ map: textureMap[moonData.name] })
    );
}

function createSaturnRings (textureMap: Record<string, THREE.Texture>, saturnRingData: CelestialBody): THREE.Mesh {
    const saturnRingGeometry = new THREE.RingGeometry(
        saturnRingData.innerRadius, 
        saturnRingData.outerRadius, 
        saturnRingData.thetaSegments
    );
    const saturnRingMaterial = new THREE.MeshBasicMaterial({
        map: textureMap[saturnRingData.name],
        side: THREE.DoubleSide,
        opacity: 0.4,
        transparent: true,
        color: 0x888888
    });

    const saturnRing = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial);
    saturnRing.rotation.x = 20;
    saturnRing.rotation.z = 10;

    return saturnRing;
}