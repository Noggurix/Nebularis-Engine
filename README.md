<div align="center">
   <img src="public/logo.png" alt="Nebularis" width="100" style="margin-top: 4px;">

   <h3 style="margin-top: 1px; margin-bottom: 0px; color: #e2e2e2ff; font-family: 'Times', sans-serif;">Nebularis Engine</h3><br>

   Nebularis Engine is a space simulation engine built with three.js. It enables enables real-time visualization of the Solar System with smooth animations and 3D rendering of celestial bodies.

   [![License](https://img.shields.io/github/license/Noggurix/Nebularis-Engine?style=flat-square)](LICENSE) ![Static Badge](https://img.shields.io/badge/powered%20by-three.js-black?style=flat-square&logo=threedotjs) ![Static Badge](https://img.shields.io/badge/stage-development-blue?style=flat-square&logo=devbox) ![Static Badge](https://img.shields.io/badge/contributions-welcome-lightgreen?style=flat-square&logo=githubactions&logoColor=white) ![GitHub repo size](https://img.shields.io/github/repo-size/Noggurix/Nebularis-Engine?logo=googlecloudstorage&color=%23009e8c)
</div>

### Table of Contents:
- [Overview](#overview)
- [Installation](#installation)
   - [Prerequisites:](#prerequisites)
      - [Local Development:](#local-development)
- [Usage](#usage)
- [Roadmap](#roadmap)
- [License](#license)
- [Contributing](#contributing)

---
## Overview
- **Planet and Star Visualization**: Displays the eight planets of the Solar System, including the Sun, Earth’s Moon, and Saturn’s rings, with smooth animations.
- **Camera Movement**: Free navigation in the scene using keyboard and mouse.

<img src="/screenshots/demo1.png" width="100%" 
alt="Nebularis Engine Demo 1">
<img src="/screenshots/demo2.png" width="100%" alt="Nebularis Engine Demo 2">
<p align="center">
  <img src="/screenshots/demo3.png" width="49%" alt="Nebularis Engine Demo 3">
  <img src="/screenshots/demo4.png" width="49%" alt="Nebularis Engine Demo 4">
</p>
<img src="/screenshots/demo5.png" width="100%" alt="Nebularis Engine Demo 5">

---
## Installation
###### Prerequisites:
- ###### [Node](https://nodejs.org/) v20.19+

#### Local Development:
1. **Clone the repository**
   ```bash
   git clone https://github.com/Noggurix/Nebularis-Engine.git
   cd nebularis-engine
   ```
2. **Install dependencies**
   ```bash
   npm install 
   ```
3. **Start local server**
   ```bash
   npm run dev
   ```

---
## Usage
##### Controls
- Move around: WASD keys
- Rotate camera: Hold left mouse button
- Focus on a planet: Just click on the desired planet.

##### Tuning
If you experience reduced performance or simple want to experiment a new look in the project, you can tweak the post-processing settings.

**Flags in** ```(src/visualEffects.ts)``` :
- ```ENABLE_GLOBAL_POSTPROCESSING``` Toggle all post-processing globally

- ```POSTPROCESSING_ENABLE_BLOOM``` Enable/disable bloom effect

- ```POSTPROCESSING_USE_HDR``` Enable HDR (higher visual fidelity, heavier on GPU)

- ```POSTPROCESSING_RESOLUTION_SCALE``` Scale rendering resolution. Low values improve performance, while higher decrease performance

- ```POSTPROCESSING_BLOOM_RES_SCALE``` Scale bloom effect resolution. Same logic as resolution scale

You can also adjust post-processing values in ```src/configs/postProcessing.json```.
The defaults are tuned to provide a balanced bloom intensity that matches the Sun in the scene, but feel free to experiment on your own machine if you’d like to explore different visuals or performance profiles.

---
## Roadmap
I plan to evolve Nebularis into a robust engine that allows users to build custom space simulations. Some of the future planned features are:

- **Realistic 3D Models**: Replace basic planet models with more realistic GLTF representations.
- **Realistic Physics Simulation**: Implementation of gravitational calculations, precise orbital simulations, and collisions between bodies based on Newton's laws.
- **Interactive UI**: Develop a control panel to manipulate the simulation in real time, allowing control over parameters such as orbit speed and planet positions.
- **Graphics Improvement**: A complete overhaul of the current graphics, using GLSL shaders and advanced post-processing.
- **Scene Management**: Possibility to manipulate different scenes, collaborate with others in real time, and save, load, or share them.

---
## License
This project is licensed under the GPL-3.0 License - see [LICENSE](./LICENSE) for details.

---
## Contributing
Contributions are welcome! Feel free to fork the project and open a pull request.
