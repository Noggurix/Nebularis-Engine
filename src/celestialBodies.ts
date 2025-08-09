import * as THREE from 'three';
import CONFIG from './configs/bodiesProperties.json'
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

    const sun = new THREE.Mesh(new THREE.SphereGeometry(30, 64, 64), sunMaterial);
    scene.add(sun);

    const sunLight = new THREE.PointLight(0xffeaab, 0.3, 10000, 0);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);
}

export function createAllPlanets (scene: THREE.Scene, textureMap: Record<string, THREE.Texture>): THREE.Mesh[] {
        const moonData: CelestialBody = getCelestialBodyOrThrow('Moon');
        const saturnRingData: CelestialBody = getCelestialBodyOrThrow('Saturn Ring');

        const currentObjects: THREE.Mesh[] = configTyped.celestialBodiesProperties
           .filter((body): body is CelestialBody => body.type === 'planet')
            .map((planet: CelestialBody) => {
                const planetMaterial = new THREE.MeshStandardMaterial({ map: textureMap[planet.name]});
        
                const objPlanet = new THREE.Mesh(new THREE.SphereGeometry(planet.size, 64, 64), planetMaterial);
                objPlanet.name = planet.name;

                if (planet.name === "Earth" && moonData) {
                    const moon = createMoon(textureMap, moonData);
                    const moonOrbitGroup = new THREE.Group();
                    moonOrbitGroup.add(moon);
                    objPlanet.add(moonOrbitGroup);

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
                    objPlanet.add(ringOrbit);
                }

                if (planet.distance === undefined || planet.period === undefined) {
                    throw new Error(`Planet ${planet.name} is missing distance or period.`);
                }

                objPlanet.userData = {
                    distance: planet.distance * configTyped.planetScaleFactor,
                    angle: Math.random() * Math.PI * 2,
                    speed: (2 * Math.PI) / planet.period / 100
                };
                
                scene.add(objPlanet);
                return objPlanet;
            });

    return currentObjects;
}

function createMoon(textureMap: Record<string, THREE.Texture>, moonData: CelestialBody): THREE.Mesh {
    return new THREE.Mesh(
        new THREE.SphereGeometry(moonData.size, 64, 64),
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