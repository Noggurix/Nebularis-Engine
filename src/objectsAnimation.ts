let lastTime = 0;

export function animateObjects(planetIteration) {
    const deltaTime = getDeltaTime();
    
    planetIteration.forEach(objPlanet => {
        animatePlanetOrbit(objPlanet, deltaTime);

        if (objPlanet.name === "Earth") {
            animateEarthMoon(objPlanet, deltaTime);
        }
    });
}

function getDeltaTime() {
    const time = performance.now();
    const deltaTime = (time - lastTime) / 1000;
    lastTime = time;
    return deltaTime;
}

function animatePlanetOrbit(planet, deltaTime) {
    const data = planet.userData;
    data.angle += data.speed * deltaTime;
    planet.position.x = Math.cos(data.angle) * data.distance;
    planet.position.z = Math.sin(data.angle) * data.distance;
}

function animateEarthMoon(earth, deltaTime) {
    if (earth.children.length > 0) {
        const moonOrbitGroup = earth.children[0];
        const moonData = moonOrbitGroup.userData;

        moonData.angle += moonData.speed * deltaTime;
        moonOrbitGroup.position.x = Math.cos(moonData.angle) * moonData.orbitRadius;
        moonOrbitGroup.position.z = Math.sin(moonData.angle) * moonData.orbitRadius;
    }
}
