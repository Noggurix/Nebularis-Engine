import * as THREE from 'three';

export default class CameraControls {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;

        this.isDragging = false;
        this.previousMousePosition = { x: 0, y: 0 };
        this.cameraControlRotation = { x: 0, y: 0 };
        this.cameraSpeed = 0.9;

        this.keys = { w: false, a: false, s: false, d: false };

        this.initEventListeners();
    }

    initEventListeners() {

        // Eventos do mouse
        this.domElement.addEventListener('mousedown', (event) => {
            if (event.button === 0) this.isDragging = true;
            this.previousMousePosition = { x: event.clientX, y: event.clientY };
        });
        this.domElement.addEventListener('mouseup', () => {
            this.isDragging = false;
        });
        this.domElement.addEventListener('mousemove', (event) => {
            if (this.isDragging) {
                // Diferenças entre a posição atual e anterior
                const deltaX = event.clientX - this.previousMousePosition.x;
                const deltaY = event.clientY - this.previousMousePosition.y;

                // Atualiza a rotação da câmera com base no movimento do mouse
                this.cameraControlRotation.y -= deltaX * 0.005; // Rota horizontalmente com base na diferença de posição de deltaX
                this.cameraControlRotation.x -= deltaY * 0.005;

                // Limita a rotação do eixo X entre -PI/2 e PI/2 (impede que a câmera "vire de cabeça para baixo")
                this.cameraControlRotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.cameraControlRotation.x));

                this.previousMousePosition = { x: event.clientX, y: event.clientY };
            }
        });

        // Eventos do teclado
        this.domElement.addEventListener('keydown', (event) => {
            this.keys[event.key.toLowerCase()] = true;
        });
        this.domElement.addEventListener('keyup', (event) => {
            this.keys[event.key.toLowerCase()] = false;
        });
    }

    callCameraUpdates() {
        this.updateCameraPosition();
        this.updateCameraRotation();
    }

    updateCameraPosition() {
        const forwardBackward = new THREE.Vector3();
        const lateral = new THREE.Vector3();
        const up = new THREE.Vector3();

        if (this.keys.w) forwardBackward.z += this.cameraSpeed;
        if (this.keys.s) forwardBackward.z -= this.cameraSpeed;
        if (this.keys.a) lateral.x += this.cameraSpeed;
        if (this.keys.d) lateral.x -= this.cameraSpeed;

        // Mover Y
        const verticalMovementFactor = Math.sin(this.cameraControlRotation.x); // Cria um movimento contínuo baseado na inclinação
        if (this.keys.w) up.y += this.cameraSpeed * verticalMovementFactor;
        if (this.keys.s) up.y -= this.cameraSpeed * verticalMovementFactor;

        forwardBackward.applyEuler(new THREE.Euler(0, this.cameraControlRotation.y, 0));
        lateral.applyEuler(new THREE.Euler(0, this.cameraControlRotation.y, 0));

        this.camera.position.add(forwardBackward).add(lateral).add(up);
    }

    updateCameraRotation() {
        this.camera.lookAt(
            this.camera.position.x + Math.sin(this.cameraControlRotation.y),
            this.camera.position.y + Math.sin(this.cameraControlRotation.x),
            this.camera.position.z + Math.cos(this.cameraControlRotation.y)
        );
    }
}