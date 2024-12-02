import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.0/build/three.module.js';

export default class CameraControls {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;

        // Variáveis de controle
        this.isDragging = false;
        this.prevMousePosition = { x: 0, y: 0 };
        this.cameraRotation = { x: 0, y: 0 }; // Rotação da câmera
        this.cameraSpeed = 0.2;
        this.keys = { w: false, a: false, s: false, d: false };

        // Adiciona os event listeners
        this.initEventListeners();
    }

    initEventListeners() {
        // Eventos do mouse
        this.domElement.addEventListener('mousedown', (event) => {
            if (event.button === 0) this.isDragging = true;
            this.isDragging = true;
            this.prevMousePosition = { x: event.clientX, y: event.clientY };
        });

        this.domElement.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        this.domElement.addEventListener('mousemove', (event) => {
            if (this.isDragging) {
                const deltaX = event.clientX - this.prevMousePosition.x;
                const deltaY = event.clientY - this.prevMousePosition.y;

                // Atualiza a rotação da câmera com base no movimento do mouse
                this.cameraRotation.y -= deltaX * 0.005; // Rotação horizontal
                this.cameraRotation.x -= deltaY * 0.005; // Rotação vertical

                // Limita a rotação no eixo X (vertical) entre -PI/2 e PI/2
                this.cameraRotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.cameraRotation.x));

                this.prevMousePosition = { x: event.clientX, y: event.clientY };
            }
        });

        this.domElement.addEventListener('keydown', (event) => {
            this.keys[event.key.toLowerCase()] = true;
        });

        this.domElement.addEventListener('keyup', (event) => {
            this.keys[event.key.toLowerCase()] = false;
        });
    }

    update() {
        const forward = new THREE.Vector3(); // Vetor para movimentos frente/trás
        const lateral = new THREE.Vector3(); // Vetor para movimentos laterais
        const up = new THREE.Vector3(); // Vetor para movimentos verticais (cima/baixo)

        // Movimentos laterais
        if (this.keys.d) lateral.x -= this.cameraSpeed;
        if (this.keys.a) lateral.x += this.cameraSpeed;

        // Movimentos para frente/trás
        if (this.keys.w) forward.z += this.cameraSpeed;
        if (this.keys.s) forward.z -= this.cameraSpeed;

        // Calcular o movimento de altura baseado na rotação da câmera (sem a zona morta)
        const verticalMovementFactor = Math.sin(this.cameraRotation.x); // Isso cria um movimento contínuo baseado na inclinação
        if (this.keys.w) {
            up.y += this.cameraSpeed * verticalMovementFactor; // Move para cima se a câmera olhar para cima
        }

        if (this.keys.s) {
            up.y -= this.cameraSpeed * verticalMovementFactor; // Move para baixo se a câmera olhar para baixo
        }

        // Aplica a rotação horizontal (eixo Y) apenas para o movimento de frente/trás
        forward.applyEuler(new THREE.Euler(0, this.cameraRotation.y, 0));

        // Aplica a rotação horizontal (eixo Y) apenas para o movimento lateral
        lateral.applyEuler(new THREE.Euler(0, this.cameraRotation.y, 0));

        // Move a câmera somando os vetores de movimento
        this.camera.position.add(forward).add(lateral).add(up);

        // Atualiza a orientação da câmera: mantém a rotação vertical e horizontal
        this.camera.rotation.set(this.cameraRotation.x, this.cameraRotation.y, 0);

        // Faz a câmera olhar para a posição desejada
        this.camera.lookAt(
            this.camera.position.x + Math.sin(this.cameraRotation.y),
            this.camera.position.y + Math.sin(this.cameraRotation.x),
            this.camera.position.z + Math.cos(this.cameraRotation.y)
        );
    }
}
