/**
 * Menú de detalles del perfume en formato cascada
 * Muestra información completa del perfume seleccionado
 * sin menús desplegables, todo visible directamente
 */
const CascadeMenu = {
  /** @type {HTMLElement|null} */
  menu: null,
  /** @type {HTMLElement|null} */
  content: null,
  /** @type {HTMLElement|null} */
  headerName: null,
  /** @type {Object|null} */
  currentPerfume: null,

  /**
   * Inicializa el menú cascada
   * Obtiene referencias al DOM y configura el evento de cierre
   */
  init() {
    this.menu = document.getElementById('cascade-menu');
    this.content = document.getElementById('cascade-content');
    this.headerName = document.getElementById('cascade-perfume-name');

    document.getElementById('close-cascade').addEventListener('click', () => this.hide());
  },

  /**
   * Muestra el menú con los datos del perfume seleccionado
   * @param {Object} perfume - Objeto perfume con toda su información
   */
  show(perfume) {
    this.currentPerfume = perfume;
    this.headerName.textContent = perfume.nombre;
    this.render(perfume);
    this.menu.classList.remove('hidden');
  },

  /**
   * Oculta el menú y limpia el perfume actual
   */
  hide() {
    this.menu.classList.add('hidden');
    this.currentPerfume = null;
  },

  /**
   * Genera el HTML completo de las secciones del menú
   * Imagen, descripción, tags, stats y notas olfativas
   * @param {Object} perfume - Perfume a renderizar
   */
  render(perfume) {
    // Recopilar todos los tags del perfume
    const tags = [perfume.familia, perfume.genero, ...perfume.ocasion, ...perfume.estilo, ...perfume.temporada];

    // Generar estrellas del rating
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
      starsHtml += `<span class="star ${i > perfume.rating ? 'empty' : ''}">★</span>`;
    }

    // Agrupar notas por nivel
    const notesByLevel = { top: [], middle: [], base: [] };
    perfume.notas.forEach(n => notesByLevel[n.nivel].push(n));

    // Renderizar todas las secciones
    this.content.innerHTML = `
      <!-- Sección 1: Imagen + Identidad -->
      <div class="cascade-section">
        <img src="${perfume.imagen}" alt="${perfume.nombre}" class="cascade-perfume-image" />
        <div class="cascade-name-row">
          <h3 class="cascade-name">${perfume.nombre}</h3>
          <div class="cascade-rating">${starsHtml}<span>${perfume.rating}/5</span></div>
        </div>
        <p class="cascade-brand">${perfume.marca} · ${perfume.year}</p>
      </div>

      <!-- Sección 2: Descripción -->
      <div class="cascade-section">
        <p class="cascade-desc">${perfume.description}</p>
      </div>

      <!-- Sección 3: Tags -->
      <div class="cascade-section">
        <div class="cascade-tags">${tags.map(t => `<span class="cascade-tag">${t}</span>`).join('')}</div>
      </div>

      <!-- Sección 4: Estadísticas de rendimiento -->
      <div class="cascade-section">
        <div class="cascade-stats">
          <div class="cascade-stat">
            <span class="stat-label">Familia</span>
            <span class="stat-value">${perfume.familia}</span>
          </div>
          <div class="cascade-stat">
            <span class="stat-label">Género</span>
            <span class="stat-value">${perfume.genero}</span>
          </div>
          <div class="cascade-stat">
            <span class="stat-label">Concentración</span>
            <span class="stat-value">${perfume.concentracion}</span>
          </div>
          <div class="cascade-stat">
            <span class="stat-label">Longevidad</span>
            <span class="stat-value">${perfume.longevidad}</span>
          </div>
          <div class="cascade-stat">
            <span class="stat-label">Proyección</span>
            <span class="stat-value">${perfume.proyeccion}</span>
          </div>
          <div class="cascade-stat">
            <span class="stat-label">Sillage</span>
            <span class="stat-value">${perfume.sillage}</span>
          </div>
        </div>
      </div>

      <!-- Sección 5: Notas olfativas agrupadas por nivel -->
      <div class="cascade-section">
        <div class="cascade-notes-header">
          <span class="cascade-section-title">Notas Olfativas</span>
          <span class="cascade-notes-count">${perfume.notas.length}</span>
        </div>
        <div class="cascade-notes-list">
          ${this.renderNotes(notesByLevel)}
        </div>
      </div>
    `;
  },

  /**
   * Genera el HTML de las notas agrupadas por nivel
   * Cada nivel tiene un header y lista de notas con color, nombre, % y descripción
   * @param {Object} notesByLevel - Notas agrupadas por {top, middle, base}
   * @returns {string} HTML de las notas
   */
  renderNotes(notesByLevel) {
    let html = '';

    // Definir etiquetas e iconos por nivel
    const levelLabels = { top: '💨 Salida', middle: '💎 Corazón', base: '🪵 Fondo' };

    // Renderizar cada nivel que tenga notas
    ['top', 'middle', 'base'].forEach(level => {
      const notes = notesByLevel[level];
      if (notes.length === 0) return;

      html += `<div class="cascade-notes-group">
        <div class="cascade-notes-group-header">${levelLabels[level]}</div>`;

      notes.forEach(n => {
        const color = NOTE_COLORS[n.subtipo] || '#ffffff';
        html += `
          <div class="cascade-note-item">
            <div class="cascade-note-main">
              <span class="cascade-note-dot" style="background: ${color}"></span>
              <span class="cascade-note-name">${n.nombre}</span>
              <span class="cascade-note-pct">${n.porcentaje}%</span>
            </div>
            <div class="cascade-note-desc">${n.descripcion}</div>
          </div>
        `;
      });

      html += '</div>';
    });

    return html;
  }
};
