import * as THREE from 'three';

export default class UnifiedCameraControls {
  camera: THREE.Camera;
  scene: THREE.Scene;
  domElement: HTMLElement;

  minDistance: number;
  maxDistance: number;
  trackedObject: THREE.Object3D | null;
  isExiting: boolean;
  raycaster: THREE.Raycaster;
  mouse: THREE.Vector2;

  isDragging: boolean;
  previousMousePosition: { x: number; y: number };
  cameraControlRotation: { x: number; y: number };
  mouseDownPosition: { x: number; y: number };
  cameraSpeed: number;

  keys: Record<string, boolean>;
  mode: 'free' | 'tracking';

  constructor(camera: THREE.Camera, scene: THREE.Scene, domElement: HTMLElement) {
    this.camera = camera;
    this.scene = scene;
    this.domElement = domElement;

    this.minDistance = 45;
    this.maxDistance = 70;
    this.trackedObject = null;
    this.isExiting = false;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.mouseDownPosition = { x: 0, y: 0 };

    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.cameraControlRotation = { x: 0, y: 0 };
    this.cameraSpeed = 0.9;

    this.keys = { w: false, a: false, s: false, d: false };

    this.mode = 'free';

    this.initEventListeners();
  }

  initEventListeners() {
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        this.isExiting = true;
      }
      this.keys[event.key.toLowerCase()] = true;
    });

    window.addEventListener('keyup', (event: KeyboardEvent) => {
      this.keys[event.key.toLowerCase()] = false;
    });

    window.addEventListener('mousedown', (event: MouseEvent) => {
      if (event.button === 0) this.isDragging = true;
      this.previousMousePosition = { x: event.clientX, y: event.clientY };
      this.mouseDownPosition = { x: event.clientX, y: event.clientY };
    });

    window.addEventListener('mouseup', (event: MouseEvent) => {
      this.isDragging = false;

      const dx = event.clientX - this.mouseDownPosition.x;
      const dy = event.clientY - this.mouseDownPosition.y;
      const distanceSquared = dx * dx + dy * dy;

      if (distanceSquared < 25) {
        this.handleObjectSelection(event);
      }
    });

    window.addEventListener('mousemove', (event: MouseEvent) => {
      if (this.isDragging && this.mode === 'free') {
        const deltaX = event.clientX - this.previousMousePosition.x;
        const deltaY = event.clientY - this.previousMousePosition.y;

        this.cameraControlRotation.y -= deltaX * 0.005;
        this.cameraControlRotation.x -= deltaY * 0.005;
        this.cameraControlRotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.cameraControlRotation.x));

        this.previousMousePosition = { x: event.clientX, y: event.clientY };
      }
    });
  }

  handleObjectSelection(event: MouseEvent) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);
    
    

  if (intersects.length > 0) {
      const selectedObject = intersects[0].object;
      this.startTracking(selectedObject);
    }
  }

  startTracking(object: THREE.Object3D) {
    this.trackedObject = object;
    this.mode = 'tracking';
  }

  stopTracking() {
    this.trackedObject = null;
    this.mode = 'free';
  }

  update() {
    if (this.mode === 'tracking' && this.trackedObject) {
      const targetPosition = new THREE.Vector3();
      this.trackedObject.getWorldPosition(targetPosition);
      const direction = targetPosition.clone().sub(this.camera.position).normalize();

      this.cameraControlRotation.y = Math.atan2(direction.x, direction.z);
      this.cameraControlRotation.x = Math.asin(direction.y);

      const distance = this.camera.position.distanceTo(targetPosition);

      if (this.isExiting) {
        this.camera.position.lerp(targetPosition.clone().add(new THREE.Vector3(0, 10, this.maxDistance)), 0.08);
        if (distance >= this.maxDistance) {
          this.isExiting = false;
          this.stopTracking();
        }
      } else {
        if (distance > this.minDistance) {
          this.camera.position.lerp(targetPosition.clone().add(new THREE.Vector3(0, 10, this.minDistance)), 0.08);
        }
      }

      this.camera.lookAt(targetPosition);
    } else if (this.mode === 'free') {
      this.updateCameraPosition();
      this.updateCameraRotation();
    }
  }

  updateCameraPosition() {
    const forwardBackward = new THREE.Vector3();
    const lateral = new THREE.Vector3();
    const up = new THREE.Vector3();

    if (this.keys.w) forwardBackward.z += this.cameraSpeed;
    if (this.keys.s) forwardBackward.z -= this.cameraSpeed;
    if (this.keys.a) lateral.x += this.cameraSpeed;
    if (this.keys.d) lateral.x -= this.cameraSpeed;

    const verticalMovementFactor = Math.sin(this.cameraControlRotation.x);
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

    callCameraUpdates() {
      this.update();
    }
}