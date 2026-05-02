# AGENTS.md - Fragrance Graph 3D

## Project Overview
Interactive 3D perfume visualization dashboard with graph visualization, analytical charts, filtering system, and responsive design.

## Stack
- **Runtime:** Node.js (static file server)
- **3D Engine:** Three.js r128 (CDN)
- **Charts:** Apache ECharts 5.4.3 (CDN)
- **No build system** - vanilla JS served as static files

## Project Structure
```
├── index.html           # Main layout, CDN scripts, responsive toggles
├── styles.css           # All styles + responsive breakpoints
├── server.js            # Node.js static server (port 3000)
├── package.json         # Project metadata & dependencies
├── .gitignore           # Git ignore rules
├── catalogo_tags_perfumes.csv  # Tag taxonomy reference
├── sistema_perfumes.txt        # Classification system docs
├── data/
│   └── perfumes.js      # Perfume data, colors, filters, metric calculations
├── src/
│   ├── scene.js         # Three.js 3D graph engine (FragranceScene class)
│   ├── dashboard.js     # ECharts initialization (6 charts)
│   └── app.js           # App logic: filters, search, selection, info panel, mobile toggles
└── docs/
    └── ARCHITECTURE.md  # Architecture documentation
```

## Commands
- **Start server:** `node server.js` (port 3000)
- **Syntax check:** `node -c src/app.js`

## Key Architecture Patterns

### State Management
- Global `state` object in `app.js` manages filters, search query, selected perfume, filtered list, and Three.js scene reference
- No framework - vanilla JS with DOM manipulation

### Data Flow
1. `perfumes.js` defines `PERFUMES_DATA` (20 perfumes) + `calculatePerfumeMetrics()` derives:
   - `sensaciones` (6 emotional scores 0-100): frescura, dulzura, calidez, intensidad, elegancia, sensualidad
   - `vectorPerfil` (for cosine similarity recommendations)
   - `longevityScore`, `projectionScore`, `massAppeal`
2. `app.js` applies filters → `applyFilters()` → updates list, scene, dashboard, info panel
3. Scene and dashboard react to `selectPerfume()` calls

### 3D Graph (scene.js)
- Central node: perfume (icosahedron)
- Peripheral nodes: notes (spheres, colored by subtipo, sized by %)
- Lines connect center to each note
- Labels via Canvas 2D sprites
- Background starfield (1500 particles)
- Node radius: 0.35-1.0 based on percentage

### Dashboard Charts (dashboard.js)
1. **Radar** - DNA/ADN (6 sensations)
2. **Thermometers** - Emotional gauges (6 bars)
3. **Treemap** - Composition by level (top/middle/base)
4. **Timeline** - Temporal evolution of notes
5. **Scatter** - Perfume galaxy (similarity clustering)
6. **Recommender** - Top 10 similar fragances (custom carousel cards, not ECharts)
   - Combined score: 60% cosine similarity + 15% family bonus + 10% gender bonus + 10% rating factor
   - Cards show: image, rank, name, brand, rating, similarity %, family/gender tags
   - Carousel with prev/next buttons, dots navigation, click-to-select

### Responsive Breakpoints (styles.css)
| Breakpoint | Changes |
|------------|---------|
| >1200px | Full desktop: sidebar + info panel + 3-column dashboard |
| ≤1200px | Dashboard: 2 columns, main row stacks |
| ≤1024px | Sidebar & info panel become slide-in overlays with toggles |
| ≤768px | Dashboard header stacks, all charts single column |
| ≤480px | Compact chart cards, smaller fonts |

### Dynamic Background Color
- `updateDashboardBgColor()` in `app.js` calculates weighted RGB mix from 6 sensation thermometers
- Applied at ~3-4% opacity for subtle tint (not overwhelming)
- CSS transition: `0.8s ease`

### Note Color Map (`NOTE_COLORS` in perfumes.js)
| Subtipo | Color |
|---------|-------|
| citrico | #FFD700 |
| frutal | #FF6B6B |
| floral | #FF85A2 |
| madera | #8B5E3C |
| gourmand | #E8A87C |
| especia | #C1440E |
| verde | #4ECB71 |
| resina | #8B6914 |
| animalico | #5C4033 |
| acuatico | #4DA8DA |
| sintetico | #A78BFA |

## Code Conventions
- No comments unless necessary
- Spanish for UI text, English for code identifiers
- BEM-ish CSS naming for panels (`.info-panel__content`)
- Class-based architecture for `FragranceScene`
- Object literal pattern for `Dashboard` and `InfoPanel`
- No dependencies beyond Three.js and ECharts CDN

## Important Gotchas
- ECharts needs explicit `chart.resize()` on window resize
- `FragranceScene.onResize()` validates `clientWidth/Height > 0` to prevent NaN in PerspectiveCamera
- Server must be running for proper Three.js module loading
- All scripts loaded via CDN in specific order: Three.js → OrbitControls → ECharts → data → scene → dashboard → app
