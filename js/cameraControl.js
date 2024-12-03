import * as THREE from 'three';

export default class CameraControls {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;

        this.isDragging = false; // Rastreamento de arrasto do mouse
        this.prevMousePosition = { x: 0, y: 0 }; // Posição anterior do mouse para calculo de deslocamento
        this.cameraControlRotation = { x: 0, y: 0 }; // Estado interno de rotação
        this.cameraSpeed = 0.2;

        this.keys = { w: false, a: false, s: false, d: false }; // Teclas de movimentação

        this.initEventListeners();
    }

    initEventListeners() {
        // Eventos do mouse
        this.domElement.addEventListener('mousedown', (event) => {
            if (event.button === 0) this.isDragging = true; // Se o botão for clicado isDragging se torna True
            this.prevMousePosition = { x: event.clientX, y: event.clientY }; // Guardar posição atual do mouse
        });
        this.domElement.addEventListener('mouseup', () => {
            this.isDragging = false; // Se não houver clique do botão desativa isDragging
        });
        this.domElement.addEventListener('mousemove', (event) => {
            if (this.isDragging) {
                // Diferenças entre a posição atual e anterior
                const deltaX = event.clientX - this.prevMousePosition.x;
                const deltaY = event.clientY - this.prevMousePosition.y;

                // Atualiza a rotação da câmera com base no movimento do mouse
                this.cameraControlRotation.y -= deltaX * 0.005; // Rota horizontalmente com base na diferença de posição de deltaX
                this.cameraControlRotation.x -= deltaY * 0.005; // Rota verticalmente com base na diferença de posição de deltaY

                // Limita a rotação no eixo X entre -PI/2 e PI/2 (impede que a câmera "vire de cabeça para baixo")
                this.cameraControlRotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.cameraControlRotation.x));

                this.prevMousePosition = { x: event.clientX, y: event.clientY }; // Guarda novamente a posição atual do mouse
            }
        });
        // Eventos de teclado para movimentação
        this.domElement.addEventListener('keydown', (event) => {
            this.keys[event.key.toLowerCase()] = true;
        });
        this.domElement.addEventListener('keyup', (event) => {
            this.keys[event.key.toLowerCase()] = false;
        });
    }

    /**
     * Atualiza a posição da câmera com base nas teclas pressionadas.
     */
    updatePosition() {
        const forwardBackward = new THREE.Vector3(); // Vetor para movimentos frente/trás
        const lateral = new THREE.Vector3(); // Vetor para movimentos laterais
        const up = new THREE.Vector3(); // Vetor para movimentos verticais

        // Movimentos laterais (X)
        if (this.keys.d) lateral.x -= this.cameraSpeed;
        if (this.keys.a) lateral.x += this.cameraSpeed;

        // Movimentos para frente/trás (Z)
        if (this.keys.w) forwardBackward.z += this.cameraSpeed;
        if (this.keys.s) forwardBackward.z -= this.cameraSpeed;

        // Calcular o movimento de altura (Y)
        const verticalMovementFactor = Math.sin(this.cameraControlRotation.x); // Isso cria um movimento contínuo baseado na inclinação
        if (this.keys.w) up.y += this.cameraSpeed * verticalMovementFactor; // Se W estiver pressionado, move Y para cima ou baixo dependendo de verticalMovementFactor
        if (this.keys.s) up.y -= this.cameraSpeed * verticalMovementFactor; // Mesmo comportamento acima porém para a tecla S

        // Aplica a rotação da câmera aos vetores de movimento
        forwardBackward.applyEuler(new THREE.Euler(0, this.cameraControlRotation.y, 0));
        lateral.applyEuler(new THREE.Euler(0, this.cameraControlRotation.y, 0));

        // Atualiza a posição da câmera
        this.camera.position.add(forwardBackward).add(lateral).add(up);
    }

    /**
     * Atualiza a rotação da câmera para olhar na direção desejada.
     */
    updateRotation() {
        this.camera.lookAt(
            this.camera.position.x + Math.sin(this.cameraControlRotation.y),
            this.camera.position.y + Math.sin(this.cameraControlRotation.x),
            this.camera.position.z + Math.cos(this.cameraControlRotation.y)
        );
    }

    update() {
        this.updatePosition();
        this.updateRotation();
    }
}