/**
 * Motor de renderizado 3D para la visualización de perfumes en grafo
 * Gestiona la escena Three.js, cámara, iluminación, meshes y controles
 */
class FragranceScene {
  /**
   * @param {HTMLElement} container - Elemento DOM que contendrá el canvas
   */
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.selectedPerfume = null;
    this.nodeMeshes = [];
    this.lineMeshes = [];
    this.labelSprites = [];

    this.init();
  }

  /**
   * Inicializa la escena Three.js completa
   * Configura cámara, renderer, controles, iluminación y fondo estelar
   */
  init() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#0a0a0f');

    // Cámara con perspectiva
    this.camera = new THREE.PerspectiveCamera(
      60,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 15);

    // Renderer con antialiasing
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);

    // Controles orbitales con damping
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 5;
    this.controls.maxDistance = 50;

    // Iluminación ambiental (luz base uniforme)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    // Luz direccional principal (simula luz solar)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    this.scene.add(directionalLight);

    // Luz puntual púrpura para acento visual
    const pointLight = new THREE.PointLight(0x6c5ce7, 0.5, 30);
    pointLight.position.set(0, 0, 5);
    this.scene.add(pointLight);

    // Fondo de estrellas para estética
    this.addStarfield();

    // Event listeners para redimensionar e interacción
    window.addEventListener('resize', () => this.onResize());
    this.renderer.domElement.addEventListener('click', (event) => this.onClick(event));
    this.renderer.domElement.addEventListener('mousemove', (event) => this.onMouseMove(event));
  }

  /**
   * Crea un fondo de estrellas usando partículas (Points)
   * Distribuye 1500 puntos aleatoriamente en el espacio
   */
  addStarfield() {
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 1500;
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 100;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const starsMaterial = new THREE.PointsMaterial({
      color: '#ffffff',
      size: 0.08,
      transparent: true,
      opacity: 0.7
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    this.scene.add(stars);
  }

  /**
   * Elimina todos los meshes del grafo actual de la escena
   * Limpia nodos, líneas y etiquetas
   */
  clearGraph() {
    this.nodeMeshes.forEach(mesh => this.scene.remove(mesh));
    this.lineMeshes.forEach(mesh => this.scene.remove(mesh));
    this.labelSprites.forEach(sprite => this.scene.remove(sprite));

    this.nodeMeshes = [];
    this.lineMeshes = [];
    this.labelSprites = [];
  }

  /**
   * Calcula el radio de un nodo basado en su porcentaje
   * Usa límites mínimo y máximo para mantener visibilidad
   * @param {number} porcentaje - Porcentaje de la nota (0-100)
   * @returns {number} Radio del nodo (0.35 - 1.0)
   */
  getNodeRadius(porcentaje) {
    const minRadius = 0.35;
    const maxRadius = 1.0;
    const normalized = Math.min(Math.max(porcentaje / 100, 0), 1);
    return minRadius + (maxRadius - minRadius) * normalized;
  }

  /**
   * Crea un sprite de texto a partir de un canvas 2D
   * @param {string} title - Texto principal
   * @param {string} subtitle - Texto secundario (opcional)
   * @param {THREE.Vector3} position - Posición 3D del sprite
   * @param {string} titleColor - Color del título
   * @param {string} subtitleColor - Color del subtítulo
   * @returns {THREE.Sprite} Sprite con el texto renderizado
   */
  createLabel(title, subtitle, position, titleColor, subtitleColor) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 256;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // Título con sombra
    context.font = 'Bold 40px Arial, Helvetica, sans-serif';
    context.fillStyle = titleColor || '#ffffff';
    context.shadowColor = 'rgba(0,0,0,0.8)';
    context.shadowBlur = 6;
    context.fillText(title, canvas.width / 2, canvas.height / 2 - 18);

    // Subtítulo con sombra
    if (subtitle) {
      context.font = '32px Arial, Helvetica, sans-serif';
      context.fillStyle = subtitleColor || '#cccccc';
      context.shadowColor = 'rgba(0,0,0,0.8)';
      context.shadowBlur = 6;
      context.fillText(subtitle, canvas.width / 2, canvas.height / 2 + 22);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 0.95
    });

    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.copy(position);
    sprite.position.y -= 1.0;
    sprite.scale.set(2.5, 1.25, 1);

    return sprite;
  }

  /**
   * Renderiza el grafo 3D completo de un perfume
   * Crea nodo central, nodos de notas, líneas conectoras y etiquetas
   * @param {Object} perfume - Objeto perfume con sus notas
   */
  renderPerfumeGraph(perfume) {
    this.clearGraph();
    this.selectedPerfume = perfume;

    // Nodo central (icosaedro púrpura)
    const centerGeometry = new THREE.IcosahedronGeometry(1.2, 1);
    const centerMaterial = new THREE.MeshPhongMaterial({
      color: '#6c5ce7',
      emissive: '#3d2d94',
      emissiveIntensity: 0.5,
      shininess: 100
    });
    const centerNode = new THREE.Mesh(centerGeometry, centerMaterial);
    centerNode.userData = { type: 'perfume', name: perfume.nombre };
    this.scene.add(centerNode);
    this.nodeMeshes.push(centerNode);

    // Label central (nombre + marca)
    const centerLabel = this.createLabel(
      perfume.nombre,
      perfume.marca,
      new THREE.Vector3(0, 0, 0),
      '#ffffff',
      '#8888aa'
    );
    this.scene.add(centerLabel);
    this.labelSprites.push(centerLabel);

    // Nodos de notas en distribución orbital
    const noteCount = perfume.notas.length;
    const baseRadius = 5.5;

    perfume.notas.forEach((nota, index) => {
      // Posición orbital con variación en Y y Z
      const angle = (index / noteCount) * Math.PI * 2;
      const yOffset = (Math.sin(angle * 2) * 1.5) + ((Math.random() - 0.5) * 1.5);
      const zOffset = Math.cos(angle * 1.5) * 0.8;

      const x = Math.cos(angle) * baseRadius;
      const y = yOffset;
      const z = Math.sin(angle) * baseRadius + zOffset;
      const position = new THREE.Vector3(x, y, z);

      // Esfera con tamaño proporcional al porcentaje
      const nodeRadius = this.getNodeRadius(nota.porcentaje);
      const noteGeometry = new THREE.SphereGeometry(nodeRadius, 32, 32);
      const noteColor = NOTE_COLORS[nota.subtipo] || '#ffffff';
      const noteMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(noteColor),
        emissive: new THREE.Color(noteColor),
        emissiveIntensity: 0.35,
        shininess: 80,
        transparent: true,
        opacity: 0.9
      });
      const noteNode = new THREE.Mesh(noteGeometry, noteMaterial);
      noteNode.position.copy(position);
      noteNode.userData = {
        type: 'note',
        name: nota.nombre,
        porcentaje: nota.porcentaje,
        nivel: nota.nivel,
        subtipo: nota.subtipo
      };
      this.scene.add(noteNode);
      this.nodeMeshes.push(noteNode);

      // Línea conectora al centro
      const points = [new THREE.Vector3(0, 0, 0), position];
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: new THREE.Color(noteColor),
        transparent: true,
        opacity: 0.35
      });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      this.scene.add(line);
      this.lineMeshes.push(line);

      // Etiqueta con nombre y porcentaje
      const noteLabel = this.createLabel(
        nota.nombre,
        `${nota.porcentaje}%`,
        position,
        '#f0f0f0',
        '#b0b0b0'
      );
      this.scene.add(noteLabel);
      this.labelSprites.push(noteLabel);
    });

    // Reposicionar cámara
    this.camera.position.set(0, 3, 12);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  /**
   * Maneja el evento click en el canvas
   * Usa raycasting para detectar nodos y resaltar notas
   * @param {MouseEvent} event - Evento de click
   */
  onClick(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.nodeMeshes);

    if (intersects.length > 0) {
      const object = intersects[0].object;
      if (object.userData.type === 'note') {
        this.highlightNode(object);
      }
    }
  }

  /**
   * Maneja el evento mousemove para cambiar el cursor
   * @param {MouseEvent} event - Evento de movimiento
   */
  onMouseMove(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.nodeMeshes);

    if (intersects.length > 0) {
      const object = intersects[0].object;
      this.renderer.domElement.style.cursor = object.userData.type === 'note' ? 'pointer' : 'default';
    } else {
      this.renderer.domElement.style.cursor = 'default';
    }
  }

  /**
   * Resalta un nodo de nota al hacer click
   * Aumenta la intensidad emisiva y escala del nodo seleccionado
   * Reduce la intensidad de los demás nodos
   * @param {THREE.Mesh} node - Mesh del nodo a resaltar
   */
  highlightNode(node) {
    this.nodeMeshes.forEach(mesh => {
      if (mesh !== node) {
        mesh.material.emissiveIntensity = 0.15;
        mesh.scale.set(1, 1, 1);
      }
    });

    node.material.emissiveIntensity = 1.0;
    node.scale.set(1.4, 1.4, 1.4);
  }

  /**
   * Maneja el redimensionamiento de la ventana
   * Actualiza aspect ratio, proyección y tamaño del renderer
   */
  onResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  /**
   * Loop de animación principal
   * Actualiza controles y rota el nodo central
   */
  animate() {
    requestAnimationFrame(() => this.animate());

    this.controls.update();

    // Rotación suave del nodo central
    this.nodeMeshes.forEach((mesh) => {
      if (mesh.userData.type === 'perfume') {
        mesh.rotation.y += 0.005;
        mesh.rotation.x += 0.002;
      }
    });

    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Inicia el loop de animación
   */
  start() {
    this.animate();
  }
}
