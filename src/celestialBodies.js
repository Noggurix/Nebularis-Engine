import * as THREE from 'three'
import CONFIG from './configs/planets.json' with  { type: 'json' };

const textureLoader = new THREE.TextureLoader();

export function createSun (scene) {
    const sunData = CONFIG.celestialBodiesProperties.find(body => body.name === 'Sun');
    const sunMaterial = new THREE.MeshBasicMaterial({ map: textureLoader.load(sunData.texture) });
    const sun = new THREE.Mesh(new THREE.SphereGeometry(30, 64, 64), sunMaterial);
    scene.add(sun);

    const sunLight = new THREE.PointLight(0xffffff, 0.3, 10000, 0);
    scene.add(sunLight);
    sunLight.position.set(0, 0, 0);
}

export function createPlanets (scene) {
    const planetIteration = CONFIG.celestialBodiesProperties.map(planet => {
        const planetMaterial = new THREE.MeshStandardMaterial({ map: textureLoader.load(planet.texture)});
        const objPlanet = new THREE.Mesh(new THREE.SphereGeometry(planet.size, 64, 64), planetMaterial);
        objPlanet.name = planet.name;

        if (planet.name === "Earth") {
            const moon = createMoon();
        
            const moonOrbitGroup = new THREE.Group();
            moonOrbitGroup.add(moon);
            objPlanet.add(moonOrbitGroup);
        
            moonOrbitGroup.userData = {
            orbitRadius: 0.02 * CONFIG.planetScaleFactor,
            angle: Math.random() * Math.PI * 2,
            speed: (2 * Math.PI) / 27.3 / 100
            };
        }
        
        if (planet.name === "Saturn") {
            const saturnRing = createSaturnRings();
        
            const ringOrbit = new THREE.Group();
            ringOrbit.add(saturnRing);
            objPlanet.add(ringOrbit);
        }

        objPlanet.userData = {
            distance: planet.distance * CONFIG.planetScaleFactor,
            angle: Math.random() * Math.PI * 2,
            speed: (2 * Math.PI) / planet.period / 100
        };
        
        scene.add(objPlanet);

        return objPlanet;
    });

    return planetIteration;
}

function createMoon() {
    return new THREE.Mesh(
        new THREE.SphereGeometry(0.32, 64, 64),
        new THREE.MeshStandardMaterial({ map: textureLoader.load("/src/textures/celestialbodies/moon/moon.jpg") })
    );
}

function createSaturnRings () {
    const saturnRingGeometry = new THREE.RingGeometry(15.5, 21.5, 128);
    const saturnRingMaterial = new THREE.MeshBasicMaterial({
    map: textureLoader.load("/src/textures/celestialbodies/saturn/saturn_ring.png"),
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