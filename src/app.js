/**
 * Estado global de la aplicación
 * @typedef {Object} AppState
 * @property {Object} activeFilters - Filtros activos por categoría
 * @property {number[]} activeFilters.rating - Ratings seleccionados (1-5)
 * @property {string[]} activeFilters.familia - Familias seleccionadas
 * @property {string[]} activeFilters.ocasion - Ocaciones seleccionadas
 * @property {string[]} activeFilters.estilo - Estilos seleccionados
 * @property {string[]} activeFilters.genero - Géneros seleccionados
 * @property {string[]} activeFilters.temporada - Temporadas seleccionadas
 * @property {string[]} activeFilters.notas - Subtipos de nota seleccionados
 * @property {string} searchQuery - Texto de búsqueda actual
 * @property {number|null} selectedPerfumeId - ID del perfume seleccionado
 * @property {Array} filteredPerfumes - Resultados filtrados actuales
 * @property {FragranceScene|null} scene - Referencia a la escena 3D
 */

const state = {
  activeFilters: {
    rating: [],
    familia: [],
    ocasion: [],
    estilo: [],
    genero: [],
    temporada: [],
    notas: []
  },
  searchQuery: '',
  selectedPerfumeId: null,
  filteredPerfumes: [...PERFUMES],
  scene: null
};

/**
 * Inicializa la aplicación al cargar el DOM
 * Configura la escena, filtros, búsqueda y selección inicial
 */
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('canvas-container');
  state.scene = new FragranceScene(container);

  CascadeMenu.init();
  initFilters();
  initSearch();
  renderPerfumeList(state.filteredPerfumes);
  state.scene.start();

  if (PERFUMES.length > 0) {
    selectPerfume(PERFUMES[0].id);
  }

  document.getElementById('clear-filters').addEventListener('click', clearFilters);
});

/**
 * Crea dinámicamente todos los botones de filtro
 * Incluye filtros de texto, rating con estrellas y tipos de nota con colores
 */
function initFilters() {
  // Filtros de texto (familia, ocasion, estilo, genero, temporada)
  Object.entries(FILTER_OPTIONS).forEach(([filterType, options]) => {
    const container = document.getElementById(`options-${filterType}`);
    options.forEach(option => {
      const btn = document.createElement('button');
      btn.className = 'filter-option';
      btn.textContent = option;
      btn.addEventListener('click', () => {
        toggleFilter(filterType, option, btn);
      });
      container.appendChild(btn);
    });
  });

  // Filtro de rating (5 estrellas a 1 estrella)
  const ratingContainer = document.getElementById('options-rating');
  for (let i = 5; i >= 1; i--) {
    const btn = document.createElement('button');
    btn.className = 'rating-option';
    let starsHtml = '';
    for (let s = 1; s <= 5; s++) {
      starsHtml += `<span class="star ${s > i ? 'empty' : ''}">★</span>`;
    }
    btn.innerHTML = starsHtml;
    btn.addEventListener('click', () => {
      toggleRatingFilter(i, btn);
    });
    ratingContainer.appendChild(btn);
  }

  // Filtro de tipos de nota (coloreados)
  const notasContainer = document.getElementById('options-notas');
  Object.entries(NOTE_COLORS).forEach(([subtipo, color]) => {
    const btn = document.createElement('button');
    btn.className = 'note-type-option';
    btn.innerHTML = `<span class="note-type-dot" style="background: ${color}"></span>${subtipo}`;
    btn.addEventListener('click', () => {
      toggleFilter('notas', subtipo, btn);
    });
    notasContainer.appendChild(btn);
  });

  // Toggle para abrir/cerrar grupos de filtros
  document.querySelectorAll('.filter-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const filterType = toggle.dataset.filter;
      const options = document.getElementById(`options-${filterType}`);
      toggle.classList.toggle('active');
      options.classList.toggle('show');
    });
  });
}

/**
 * Activa o desactiva un filtro específico
 * @param {string} filterType - Categoría del filtro
 * @param {string} value - Valor a activar/desactivar
 * @param {HTMLElement} btn - Botón clickeado
 */
function toggleFilter(filterType, value, btn) {
  const index = state.activeFilters[filterType].indexOf(value);
  if (index > -1) {
    state.activeFilters[filterType].splice(index, 1);
    btn.classList.remove('selected');
  } else {
    state.activeFilters[filterType].push(value);
    btn.classList.add('selected');
  }
  updateBadges();
  updateClearButton();
  applyFilters();
}

/**
 * Activa o desactiva un filtro de rating
 * @param {number} rating - Valor de estrellas (1-5)
 * @param {HTMLElement} btn - Botón clickeado
 */
function toggleRatingFilter(rating, btn) {
  const idx = state.activeFilters.rating.indexOf(rating);
  if (idx > -1) {
    state.activeFilters.rating.splice(idx, 1);
    btn.classList.remove('selected');
  } else {
    state.activeFilters.rating.push(rating);
    btn.classList.add('selected');
  }
  updateBadges();
  updateClearButton();
  applyFilters();
}

/**
 * Actualiza los badges numéricos en los toggles de filtro
 * Muestra el conteo de filtros activos por categoría
 */
function updateBadges() {
  Object.entries(state.activeFilters).forEach(([filterType, values]) => {
    const badge = document.getElementById(`badge-${filterType}`);
    if (badge) {
      if (values.length > 0) {
        badge.textContent = values.length;
        badge.hidden = false;
      } else {
        badge.hidden = true;
      }
    }
  });
}

/**
 * Muestra u oculta el botón de limpiar filtros
 * según si hay filtros activos o texto de búsqueda
 */
function updateClearButton() {
  const hasActiveFilters = Object.values(state.activeFilters).some(arr => arr.length > 0) || state.searchQuery !== '';
  document.getElementById('clear-filters').classList.toggle('hidden', !hasActiveFilters);
}

/**
 * Limpia todos los filtros y la búsqueda
 * Restaura la lista completa de perfumes
 */
function clearFilters() {
  Object.keys(state.activeFilters).forEach(key => {
    state.activeFilters[key] = [];
  });
  state.searchQuery = '';

  document.getElementById('search-input').value = '';
  document.querySelectorAll('.filter-option.selected, .rating-option.selected, .note-type-option.selected').forEach(btn => btn.classList.remove('selected'));
  document.querySelectorAll('.filter-toggle.active').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.filter-options.show').forEach(el => el.classList.remove('show'));

  updateBadges();
  updateClearButton();

  state.filteredPerfumes = [...PERFUMES];
  renderPerfumeList(state.filteredPerfumes);
  document.getElementById('no-results').classList.add('hidden');
}

/**
 * Inicializa la búsqueda por texto con debounce
 * Filtra por nombre y marca del perfume
 */
function initSearch() {
  let debounceTimer;
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      state.searchQuery = e.target.value.toLowerCase().trim();
      updateClearButton();
      applyFilters();
    }, 150);
  });
}

/**
 * Aplica todos los filtros activos al array de perfumes
 * Usa lógica AND entre categorías y OR dentro de cada categoría
 * Actualiza la lista lateral y la escena 3D
 */
function applyFilters() {
  state.filteredPerfumes = PERFUMES.filter(perfume => {
    // Filtro por búsqueda de texto
    if (state.searchQuery) {
      const matchesSearch =
        perfume.nombre.toLowerCase().includes(state.searchQuery) ||
        perfume.marca.toLowerCase().includes(state.searchQuery);
      if (!matchesSearch) return false;
    }

    // Filtro por rating
    if (state.activeFilters.rating.length > 0) {
      if (!state.activeFilters.rating.includes(perfume.rating)) return false;
    }

    // Filtro por familia (valor único)
    if (state.activeFilters.familia.length > 0) {
      if (!state.activeFilters.familia.includes(perfume.familia)) return false;
    }

    // Filtro por ocasión (array, match si alguno coincide)
    if (state.activeFilters.ocasion.length > 0) {
      const hasOcas = state.activeFilters.ocasion.some(o => perfume.ocasion.includes(o));
      if (!hasOcas) return false;
    }

    // Filtro por estilo (array, match si alguno coincide)
    if (state.activeFilters.estilo.length > 0) {
      const hasEstilo = state.activeFilters.estilo.some(e => perfume.estilo.includes(e));
      if (!hasEstilo) return false;
    }

    // Filtro por género (valor único)
    if (state.activeFilters.genero.length > 0) {
      if (!state.activeFilters.genero.includes(perfume.genero)) return false;
    }

    // Filtro por temporada (array, match si alguno coincide)
    if (state.activeFilters.temporada.length > 0) {
      const hasTemp = state.activeFilters.temporada.some(t => perfume.temporada.includes(t));
      if (!hasTemp) return false;
    }

    // Filtro por tipo de nota (match si alguna nota del perfume tiene el subtipo)
    if (state.activeFilters.notas.length > 0) {
      const hasNota = state.activeFilters.notas.some(s => perfume.notas.some(n => n.subtipo === s));
      if (!hasNota) return false;
    }

    return true;
  });

  renderPerfumeList(state.filteredPerfumes);

  // Mostrar/ocultar mensaje de sin resultados
  const noResults = document.getElementById('no-results');
  noResults.classList.toggle('hidden', state.filteredPerfumes.length > 0);

  // Mantener selección o seleccionar primer resultado
  const isSelectedInFiltered = state.filteredPerfumes.some(p => p.id === state.selectedPerfumeId);
  if (!isSelectedInFiltered && state.filteredPerfumes.length > 0) {
    selectPerfume(state.filteredPerfumes[0].id);
  } else if (state.filteredPerfumes.length === 0) {
    state.scene.clearGraph();
    CascadeMenu.hide();
  }
}

/**
 * Genera HTML para las estrellas de rating
 * @param {number} rating - Valor del rating (1-5)
 * @returns {string} HTML con estrellas llenas y vacías
 */
function renderStars(rating) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += `<span class="star ${i > rating ? 'empty' : ''}">★</span>`;
  }
  return html;
}

/**
 * Renderiza la lista de perfumes en la sidebar
 * Cada item muestra nombre, marca, rating y metadata
 * @param {Array} perfumes - Array de perfumes a renderizar
 */
function renderPerfumeList(perfumes) {
  const list = document.getElementById('perfume-list');
  const count = document.getElementById('perfume-count');
  list.innerHTML = '';
  count.textContent = perfumes.length;

  perfumes.forEach(perfume => {
    const li = document.createElement('li');
    li.dataset.id = perfume.id;
    li.innerHTML = `
      <div class="perfume-top">
        <div>
          <div class="perfume-name">${perfume.nombre}</div>
          <div class="perfume-brand">${perfume.marca}</div>
        </div>
        <div class="perfume-stars">${renderStars(perfume.rating)}</div>
      </div>
      <div class="perfume-meta">
        <span>${perfume.familia}</span>
        <span>${perfume.genero}</span>
      </div>
    `;
    li.addEventListener('click', () => selectPerfume(perfume.id));
    list.appendChild(li);
  });

  // Mantener clase active en el perfume seleccionado
  if (state.selectedPerfumeId) {
    const activeLi = list.querySelector(`li[data-id="${state.selectedPerfumeId}"]`);
    if (activeLi) activeLi.classList.add('active');
  }
}

/**
 * Selecciona un perfume, actualiza el grafo 3D y el menú cascada
 * @param {number} id - ID del perfume a seleccionar
 */
function selectPerfume(id) {
  const perfume = PERFUMES.find(p => p.id === id);
  if (!perfume) return;

  state.selectedPerfumeId = id;

  document.querySelectorAll('.perfume-list li').forEach(li => li.classList.remove('active'));
  const activeLi = document.querySelector(`.perfume-list li[data-id="${id}"]`);
  if (activeLi) activeLi.classList.add('active');

  state.scene.renderPerfumeGraph(perfume);
  CascadeMenu.show(perfume);
}
