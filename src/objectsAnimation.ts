let lastTime = 0;

export function animateObjects(planetIteration, moons) {
    const deltaTime = getDeltaTime();

    planetIteration.forEach(objPlanet => {
        animatePlanetOrbit(objPlanet, deltaTime);
    });

    animateMoons(moons, deltaTime);
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

function animateMoons(moons, deltaTime) {
    moons.forEach(moonOrbitGroup => {
        const moonData = moonOrbitGroup.userData;
        const earthLOD = moonData.earthLOD;

        if (!earthLOD) return;

        moonData.angle += moonData.speed * deltaTime;

        moonOrbitGroup.position.x = earthLOD.position.x + Math.cos(moonData.angle) * moonData.orbitRadius;
        moonOrbitGroup.position.z = earthLOD.position.z + Math.sin(moonData.angle) * moonData.orbitRadius;
    });
}
