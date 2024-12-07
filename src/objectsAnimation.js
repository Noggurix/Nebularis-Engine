export function animateObjects(planetIteration) {
    planetIteration.forEach(objPlanet => {
        animatePlanetOrbit(objPlanet);

        if (objPlanet.name === "Earth") {
            animateEarthMoon(objPlanet);
        }
    });
}

function animatePlanetOrbit(planet) {
    const data = planet.userData;
    data.angle += data.speed;
    planet.position.x = Math.cos(data.angle) * data.distance;
    planet.position.z = Math.sin(data.angle) * data.distance;
}

function animateEarthMoon(earth) {
    if (earth.children.length > 0) {
        const moonOrbitGroup = earth.children[0];
        const moonData = moonOrbitGroup.userData;

        moonData.angle += moonData.speed;
        moonOrbitGroup.position.x = Math.cos(moonData.angle) * moonData.orbitRadius;
        moonOrbitGroup.position.z = Math.sin(moonData.angle) * moonData.orbitRadius;
    }
}