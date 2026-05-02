/**
 * @fileoverview Lógica de aplicación: filtros, búsqueda, selección, info panel y dashboard
 */

const state = {
    activeFilters: { rating: [], familia: [], ocasion: [], estilo: [], genero: [], temporada: [], notas: [] },
    searchQuery: '',
    selectedPerfumeId: null,
    filteredPerfumes: [...PERFUMES],
    scene: null
};

document.addEventListener('DOMContentLoaded', () => {
    const container3d = document.getElementById('chart-3d-container');
    state.scene = new FragranceScene(container3d);

    Dashboard.init();
    InfoPanel.init();
    initFilters();
    initSearch();
    initDashboardSelector();
    initMobileToggles();
    renderPerfumeList(state.filteredPerfumes);
    state.scene.start();

    if (PERFUMES.length > 0) selectPerfume(PERFUMES[0].id);

    document.getElementById('clear-filters').addEventListener('click', clearFilters);
    window.selectPerfume = selectPerfume;
});

function initMobileToggles() {
    const sidebar = document.getElementById('sidebar');
    const infoPanel = document.getElementById('info-panel');

    document.getElementById('toggle-sidebar').addEventListener('click', () => {
        sidebar.classList.toggle('open');
        infoPanel.classList.remove('open');
    });

    document.getElementById('close-sidebar').addEventListener('click', () => {
        sidebar.classList.remove('open');
    });

    document.getElementById('sidebar-overlay').addEventListener('click', () => {
        sidebar.classList.remove('open');
    });

    document.getElementById('toggle-info-panel').addEventListener('click', () => {
        infoPanel.classList.toggle('open');
        sidebar.classList.remove('open');
    });

    document.getElementById('close-info-panel').addEventListener('click', () => {
        infoPanel.classList.remove('open');
    });

    document.getElementById('info-panel-overlay').addEventListener('click', () => {
        infoPanel.classList.remove('open');
    });
}

/** Crea botones de filtro dinámicamente */
function initFilters() {
    Object.entries(FILTER_OPTIONS).forEach(([filterType, options]) => {
        const container = document.getElementById(`options-${filterType}`);
        options.forEach(option => {
            const btn = document.createElement('button');
            btn.className = 'filter-option';
            btn.textContent = option;
            btn.addEventListener('click', () => toggleFilter(filterType, option, btn));
            container.appendChild(btn);
        });
    });

    const ratingContainer = document.getElementById('options-rating');
    for (let i = 5; i >= 1; i--) {
        const btn = document.createElement('button');
        btn.className = 'rating-option';
        let starsHtml = '';
        for (let s = 1; s <= 5; s++) starsHtml += `<span class="star ${s > i ? 'empty' : ''}">★</span>`;
        btn.innerHTML = starsHtml;
        btn.addEventListener('click', () => toggleRatingFilter(i, btn));
        ratingContainer.appendChild(btn);
    }

    const notasContainer = document.getElementById('options-notas');
    Object.entries(NOTE_COLORS).forEach(([subtipo, color]) => {
        const btn = document.createElement('button');
        btn.className = 'note-type-option';
        btn.innerHTML = `<span class="note-type-dot" style="background: ${color}"></span>${subtipo}`;
        btn.addEventListener('click', () => toggleFilter('notas', subtipo, btn));
        notasContainer.appendChild(btn);
    });

    document.querySelectorAll('.filter-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const filterType = toggle.dataset.filter;
            document.getElementById(`options-${filterType}`).classList.toggle('show');
            toggle.classList.toggle('active');
        });
    });
}

/** Activa/desactiva un filtro */
function toggleFilter(filterType, value, btn) {
    const index = state.activeFilters[filterType].indexOf(value);
    if (index > -1) { state.activeFilters[filterType].splice(index, 1); btn.classList.remove('selected'); }
    else { state.activeFilters[filterType].push(value); btn.classList.add('selected'); }
    updateBadges(); updateClearButton(); applyFilters();
}

/** Activa/desactiva filtro de rating */
function toggleRatingFilter(rating, btn) {
    const idx = state.activeFilters.rating.indexOf(rating);
    if (idx > -1) { state.activeFilters.rating.splice(idx, 1); btn.classList.remove('selected'); }
    else { state.activeFilters.rating.push(rating); btn.classList.add('selected'); }
    updateBadges(); updateClearButton(); applyFilters();
}

/** Actualiza badges numéricos */
function updateBadges() {
    Object.entries(state.activeFilters).forEach(([type, values]) => {
        const badge = document.getElementById(`badge-${type}`);
        if (badge) { badge.textContent = values.length; badge.hidden = values.length === 0; }
    });
}

/** Muestra/oculta botón de limpiar */
function updateClearButton() {
    const hasActive = Object.values(state.activeFilters).some(arr => arr.length > 0) || state.searchQuery !== '';
    document.getElementById('clear-filters').classList.toggle('hidden', !hasActive);
}

/** Limpia todos los filtros */
function clearFilters() {
    Object.keys(state.activeFilters).forEach(key => state.activeFilters[key] = []);
    state.searchQuery = '';
    document.getElementById('search-input').value = '';
    document.querySelectorAll('.filter-option.selected, .rating-option.selected, .note-type-option.selected').forEach(b => b.classList.remove('selected'));
    document.querySelectorAll('.filter-toggle.active').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.filter-options.show').forEach(el => el.classList.remove('show'));
    updateBadges(); updateClearButton();
    state.filteredPerfumes = [...PERFUMES];
    renderPerfumeList(state.filteredPerfumes);
    document.getElementById('no-results').classList.add('hidden');
}

/** Inicializa búsqueda con debounce */
function initSearch() {
    let debounceTimer;
    document.getElementById('search-input').addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            state.searchQuery = e.target.value.toLowerCase().trim();
            updateClearButton(); applyFilters();
        }, 150);
    });
}

/** Popula el selector del dashboard */
function initDashboardSelector() {
    const select = document.getElementById('dashboard-perfume-select');
    select.innerHTML = '';
    PERFUMES.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = `${p.nombre} - ${p.marca}`;
        select.appendChild(opt);
    });
    select.addEventListener('change', () => selectPerfume(parseInt(select.value)));
}

/** Aplica todos los filtros activos */
function applyFilters() {
    state.filteredPerfumes = PERFUMES.filter(perfume => {
        if (state.searchQuery) {
            if (!perfume.nombre.toLowerCase().includes(state.searchQuery) && !perfume.marca.toLowerCase().includes(state.searchQuery)) return false;
        }
        if (state.activeFilters.rating.length > 0 && !state.activeFilters.rating.includes(perfume.rating)) return false;
        if (state.activeFilters.familia.length > 0 && !state.activeFilters.familia.includes(perfume.familia)) return false;
        if (state.activeFilters.ocasion.length > 0 && !state.activeFilters.ocasion.some(o => perfume.ocasion.includes(o))) return false;
        if (state.activeFilters.estilo.length > 0 && !state.activeFilters.estilo.some(e => perfume.estilo.includes(e))) return false;
        if (state.activeFilters.genero.length > 0 && !state.activeFilters.genero.includes(perfume.genero)) return false;
        if (state.activeFilters.temporada.length > 0 && !state.activeFilters.temporada.some(t => perfume.temporada.includes(t))) return false;
        if (state.activeFilters.notas.length > 0 && !state.activeFilters.notas.some(s => perfume.notas.some(n => n.subtipo === s))) return false;
        return true;
    });

    renderPerfumeList(state.filteredPerfumes);
    document.getElementById('no-results').classList.toggle('hidden', state.filteredPerfumes.length > 0);

    const isSelectedInFiltered = state.filteredPerfumes.some(p => p.id === state.selectedPerfumeId);
    if (!isSelectedInFiltered && state.filteredPerfumes.length > 0) {
        selectPerfume(state.filteredPerfumes[0].id);
    } else if (state.filteredPerfumes.length === 0) {
        state.scene.clearGraph();
    }
}

/** Genera HTML de estrellas */
function renderStars(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) html += `<span class="star ${i > rating ? 'empty' : ''}">★</span>`;
    return html;
}

/** Renderiza la lista lateral */
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
                <div><div class="perfume-name">${perfume.nombre}</div><div class="perfume-brand">${perfume.marca}</div></div>
                <div class="perfume-stars">${renderStars(perfume.rating)}</div>
            </div>
            <div class="perfume-meta"><span>${perfume.familia}</span><span>${perfume.genero}</span></div>
        `;
        li.addEventListener('click', () => selectPerfume(perfume.id));
        list.appendChild(li);
    });

    if (state.selectedPerfumeId) {
        const activeLi = list.querySelector(`li[data-id="${state.selectedPerfumeId}"]`);
        if (activeLi) activeLi.classList.add('active');
    }
}

/**
 * Selecciona un perfume y actualiza todo
 * @param {number} id - ID del perfume
 */
function selectPerfume(id) {
    const perfume = PERFUMES.find(p => p.id === id);
    if (!perfume) return;

    state.selectedPerfumeId = id;
    document.querySelectorAll('.perfume-list li').forEach(li => li.classList.remove('active'));
    const activeLi = document.querySelector(`.perfume-list li[data-id="${id}"]`);
    if (activeLi) activeLi.classList.add('active');

    const select = document.getElementById('dashboard-perfume-select');
    if (select) select.value = id;

    state.scene.renderPerfumeGraph(perfume);
    Dashboard.update(perfume);
    updateQuickStats(perfume);
    InfoPanel.update(perfume);
    updateDashboardBgColor(perfume);
}

/** Actualiza las estadísticas rápidas en el header */
function updateQuickStats(perfume) {
    const container = document.getElementById('dashboard-quick-stats');
    const s = perfume.sensaciones;
    const dominant = Object.entries(s).sort((a, b) => b[1] - a[1])[0];
    container.innerHTML = `
        <div class="quick-stat"><span class="quick-stat__label">Familia</span><span class="quick-stat__value">${perfume.familia}</span></div>
        <div class="quick-stat"><span class="quick-stat__label">Rating</span><span class="quick-stat__value">${perfume.rating}★</span></div>
        <div class="quick-stat"><span class="quick-stat__label">Dominante</span><span class="quick-stat__value">${dominant[0]}</span></div>
        <div class="quick-stat"><span class="quick-stat__label">Notas</span><span class="quick-stat__value">${perfume.notas.length}</span></div>
    `;
}

/**
 * Cambia el color de fondo del dashboard basado en los termómetros emocionales
 * Mezcla ponderada de frescura, dulzura, calidez, intensidad, elegancia, sensualidad
 * Aplica un tinte muy sutil (3-4%) para no sobrecargar la UI
 * @param {Object} perfume - Perfume seleccionado
 */
function updateDashboardBgColor(perfume) {
    const thermoColors = {
        frescura:    { r: 77,  g: 168, b: 218 },
        dulzura:     { r: 232, g: 168, b: 124 },
        calidez:     { r: 193, g: 68,  b: 14  },
        intensidad:  { r: 255, g: 107, b: 107 },
        elegancia:   { r: 255, g: 215, b: 0   },
        sensualidad: { r: 255, g: 133, b: 162 }
    };

    const s = perfume.sensaciones;
    const totalScore = Object.values(s).reduce((sum, v) => sum + v, 0) || 1;

    let mixedR = 0, mixedG = 0, mixedB = 0;
    Object.entries(s).forEach(([key, value]) => {
        const weight = value / totalScore;
        const c = thermoColors[key];
        mixedR += c.r * weight;
        mixedG += c.g * weight;
        mixedB += c.b * weight;
    });

    mixedR = Math.round(mixedR);
    mixedG = Math.round(mixedG);
    mixedB = Math.round(mixedB);

    const tintOpacity = 0.04;
    const mainBg = `rgba(${mixedR}, ${mixedG}, ${mixedB}, ${tintOpacity})`;
    const cardBg = `rgba(${mixedR}, ${mixedG}, ${mixedB}, 0.03)`;
    const cardBorder = `rgba(${mixedR}, ${mixedG}, ${mixedB}, 0.1)`;

    const mainContent = document.getElementById('main-content');
    mainContent.style.backgroundColor = mainBg;

    document.querySelectorAll('.chart-card').forEach(card => {
        card.style.backgroundColor = cardBg;
        card.style.borderColor = cardBorder;
    });
}

/**
 * Panel lateral izquierdo de información detallada del perfume
 */
const InfoPanel = {
    content: null,
    currentPerfume: null,

    init() {
        this.content = document.getElementById('info-panel__content');
    },

    update(perfume) {
        this.currentPerfume = perfume;

        let starsHtml = '';
        for (let i = 1; i <= 5; i++) starsHtml += `<span class="star ${i > perfume.rating ? 'empty' : ''}">★</span>`;

        const tags = [perfume.familia, perfume.genero, ...perfume.ocasion, ...perfume.estilo, ...perfume.temporada];
        const notesByLevel = { top: [], middle: [], base: [] };
        perfume.notas.forEach(n => notesByLevel[n.nivel].push(n));

        this.content.innerHTML = `
            <div class="cascade-section">
                <img src="${perfume.imagen}" alt="${perfume.nombre}" class="cascade-perfume-image" />
                <div class="cascade-name-row">
                    <h3 class="cascade-name">${perfume.nombre}</h3>
                    <div class="cascade-rating">${starsHtml}<span>${perfume.rating}/5</span></div>
                </div>
                <p class="cascade-brand">${perfume.marca} · ${perfume.year}</p>
            </div>
            <div class="cascade-section"><p class="cascade-desc">${perfume.description}</p></div>
            <div class="cascade-section"><div class="cascade-tags">${tags.map(t => `<span class="cascade-tag">${t}</span>`).join('')}</div></div>
            <div class="cascade-section">
                <div class="cascade-stats">
                    <div class="cascade-stat"><span class="stat-label">Familia</span><span class="stat-value">${perfume.familia}</span></div>
                    <div class="cascade-stat"><span class="stat-label">Género</span><span class="stat-value">${perfume.genero}</span></div>
                    <div class="cascade-stat"><span class="stat-label">Concentración</span><span class="stat-value">${perfume.concentracion}</span></div>
                    <div class="cascade-stat"><span class="stat-label">Longevidad</span><span class="stat-value">${perfume.longevidad}</span></div>
                    <div class="cascade-stat"><span class="stat-label">Proyección</span><span class="stat-value">${perfume.proyeccion}</span></div>
                    <div class="cascade-stat"><span class="stat-label">Sillage</span><span class="stat-value">${perfume.sillage}</span></div>
                </div>
            </div>
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

    renderNotes(notesByLevel) {
        let html = '';
        const levelLabels = { top: '💨 Salida', middle: '💎 Corazón', base: '🪵 Fondo' };
        ['top', 'middle', 'base'].forEach(level => {
            const notes = notesByLevel[level];
            if (notes.length === 0) return;
            html += `<div class="cascade-notes-group"><div class="cascade-notes-group-header">${levelLabels[level]}</div>`;
            notes.forEach(n => {
                const color = NOTE_COLORS[n.subtipo] || '#ffffff';
                html += `<div class="cascade-note-item">
                    <div class="cascade-note-main">
                        <span class="cascade-note-dot" style="background: ${color}"></span>
                        <span class="cascade-note-name">${n.nombre}</span>
                        <span class="cascade-note-pct">${n.porcentaje}%</span>
                    </div>
                    <div class="cascade-note-desc">${n.descripcion}</div>
                </div>`;
            });
            html += '</div>';
        });
        return html;
    }
};
