# Arquitectura del Sistema - Fragrance Graph 3D

## Diagrama General

```
┌─────────────────────────────────────────────────────────────┐
│                        index.html                           │
│  ┌─────────────────┐  ┌──────────────────────────────────┐  │
│  │    Sidebar      │  │        Main Content              │  │
│  │                 │  │                                  │  │
│  │  Search Box     │  │  ┌────────────────────────────┐  │  │
│  │  Filters        │  │  │     Canvas Three.js        │  │  │
│  │  Perfume List   │  │  │                            │  │  │
│  │                 │  │  │  [Grafo 3D interactivo]   │  │  │
│  │                 │  │  │                            │  │  │
│  └─────────────────┘  │  └────────────────────────────┘  │  │
│                        │  ┌────────────────────────────┐  │  │
│                        │  │    Cascade Menu            │  │  │
│                        │  │  [Detalles del perfume]    │  │  │
│                        │  └────────────────────────────┘  │  │
│                        └──────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Módulos

### 1. `data/perfumes.js` - Capa de Datos

Responsabilidad: Centralizar toda la información de perfumes y configuraciones.

**Exporta:**
- `NOTE_COLORS` - Mapa de subtipo de nota a color hexadecimal
- `FILTER_OPTIONS` - Valores disponibles para cada tipo de filtro
- `PERFUMES` - Array de objetos perfume

**Estructura de datos:**

```
PERFUMES[]
  ├── id: number
  ├── nombre: string
  ├── marca: string
  ├── familia: string (key de FILTER_OPTIONS.familia)
  ├── ocasion: string[]
  ├── estilo: string[]
  ├── genero: string (key de FILTER_OPTIONS.genero)
  ├── temporada: string[]
  ├── rating: number (1-5)
  ├── year: number
  ├── concentracion: string
  ├── description: string
  ├── longevidad: string
  ├── proyeccion: string
  ├── sillage: string
  ├── imagen: string (URL)
  └── notas[]
        ├── nombre: string
        ├── subtipo: string (key de NOTE_COLORS)
        ├── nivel: 'top' | 'middle' | 'base'
        ├── porcentaje: number (0-100)
        └── descripcion: string
```

### 2. `src/scene.js` - Motor 3D

Responsabilidad: Gestionar la escena Three.js, renderizar el grafo y manejar interacciones.

**Clase: `FragranceScene`**

```
FragranceScene
├── constructor(container)
│   ├── scene: THREE.Scene
│   ├── camera: THREE.PerspectiveCamera
│   ├── renderer: THREE.WebGLRenderer
│   ├── controls: THREE.OrbitControls
│   ├── raycaster: THREE.Raycaster
│   └── arrays: nodeMeshes[], lineMeshes[], labelSprites[]
│
├── Métodos Privados
│   ├── init()                    # Configura escena, cámara, renderer, luces
│   ├── addStarfield()            # Crea fondo de estrellas
│   └── clearGraph()              # Elimina todos los meshes de la escena
│
├── Métodos Públicos
│   ├── getNodeRadius(pct)        # Calcula radio del nodo según porcentaje
│   ├── createLabel(...)          # Crea sprite de texto desde Canvas
│   ├── renderPerfumeGraph(p)     # Renderiza el grafo completo de un perfume
│   ├── onClick(event)            # Maneja click en nodos
│   ├── onMouseMove(event)        # Cambia cursor al hover
│   ├── highlightNode(node)       # Resalta un nodo seleccionado
│   ├── onResize()                # Actualiza cámara y renderer al redimensionar
│   ├── animate()                 # Loop de animación con requestAnimationFrame
│   └── start()                   # Inicia el loop de animación
```

**Flujo de renderizado:**

```
renderPerfumeGraph(perfume)
  ├── 1. clearGraph()
  ├── 2. Crear nodo central (icosaedro)
  ├── 3. Crear label central (nombre + marca)
  ├── 4. Para cada nota:
  │     ├── Calcular posición orbital (ángulo circular)
  │     ├── Crear esfera con radio proporcional al %
  │     ├── Aplicar color según subtipo de nota
  │     ├── Crear línea conectora al centro
  │     └── Crear label con nombre + porcentaje
  └── 5. Posicionar cámara y actualizar controles
```

**Sistema de tamaños de nodos:**

```
minRadius = 0.35    # Tamaño mínimo visible
maxRadius = 1.0     # Tamaño máximo
normalized = porcentaje / 100
radius = minRadius + (maxRadius - minRadius) * normalized
```

**Sprites de texto:**
- Se generan usando Canvas 2D
- Textura convertida a THREE.SpriteMaterial
- Color neutro (#f0f0f0) para legibilidad sobre cualquier fondo
- Sombra oscura para contraste

### 3. `src/app.js` - Lógica de Aplicación

Responsabilidad: Manejar estado global, filtros, búsqueda y comunicación entre módulos.

**Estado Global:**

```javascript
state = {
  activeFilters: {
    rating: [],      // [3, 4, 5]
    familia: [],     // ['oriental', 'floral']
    ocasion: [],     // ['noche', 'formal']
    estilo: [],      // ['elegante']
    genero: [],      // ['masculino']
    temporada: [],   // ['invierno']
    notas: []        // ['citrico', 'madera']
  },
  searchQuery: '',           // Texto de búsqueda en minúsculas
  selectedPerfumeId: null,   // ID del perfume actualmente seleccionado
  filteredPerfumes: [],      // Resultados actuales tras aplicar filtros
  scene: null                // Referencia a FragranceScene
}
```

**Flujo de filtrado:**

```
Usuario interactúa (búsqueda o filtro)
  ├── initSearch() / toggleFilter() / toggleRatingFilter()
  ├── updateBadges()                # Actualiza contadores visuales
  ├── updateClearButton()           # Muestra/oculta botón limpiar
  └── applyFilters()
        ├── Filtra PERFUMES con todos los criterios activos
        ├── renderPerfumeList()     # Actualiza lista lateral
        ├── Si hay resultados:
        │     └── selectPerfume()   # Selecciona el primero disponible
        └── Si no hay resultados:
              ├── scene.clearGraph()
              └── CascadeMenu.hide()
```

**Lógica de filtrado (AND entre categorías, OR dentro de categoría):**

```
perfume pasa filtros SI:
  ├── (query vacía O nombre/marca contiene query)
  ├── (rating vacío O perfume.rating en activeFilters.rating)
  ├── (familia vacía O perfume.familia en activeFilters.familia)
  ├── (ocasion vacía O alguna ocasión del perfume en activeFilters.ocasion)
  ├── (estilo vacío O algún estilo del perfume en activeFilters.estilo)
  ├── (genero vacío O perfume.genero en activeFilters.genero)
  ├── (temporada vacía O alguna temporada del perfume en activeFilters.temporada)
  └── (notas vacío O algún subtipo de nota en activeFilters.notas)
```

**Funciones principales:**

| Función | Parámetros | Descripción |
|---------|-----------|-------------|
| `initFilters()` | - | Crea botones de filtro dinámicamente |
| `toggleFilter(type, value, btn)` | tipo, valor, botón | Activa/desactiva filtro |
| `toggleRatingFilter(rating, btn)` | rating, botón | Activa/desactiva filtro de estrellas |
| `applyFilters()` | - | Filtra y renderiza resultados |
| `clearFilters()` | - | Resetea todos los filtros |
| `renderPerfumeList(perfumes)` | array | Renderiza lista lateral |
| `selectPerfume(id)` | ID | Selecciona y muestra perfume |
| `renderStars(rating)` | 1-5 | Genera HTML de estrellas |

### 4. `src/cascade.js` - Menú de Detalles

Responsabilidad: Mostrar información detallada del perfume seleccionado en un panel lateral.

**Objeto: `CascadeMenu`**

```
CascadeMenu
├── menu: DOM element           # Contenedor principal
├── content: DOM element        # Área de contenido scrolleable
├── headerName: DOM element     # Nombre en el header
├── currentPerfume: object      # Perfume actualmente mostrado
│
├── Métodos
│   ├── init()                  # Inicializa referencias DOM y eventos
│   ├── show(perfume)           # Muestra y renderiza detalles
│   ├── hide()                  # Oculta el menú
│   ├── render(perfume)         # Genera HTML completo de secciones
│   └── renderNotes(notesByLevel) # Genera HTML agrupado por nivel
```

**Secciones del menú (renderizado directo, sin desplegables):**

1. **Header**: Imagen + Nombre + Rating + Marca/Año
2. **Descripción**: Texto descriptivo del perfume
3. **Tags**: Familia, género, ocasiones, estilos, temporadas
4. **Stats**: Concentración, longevidad, proyección, sillage
5. **Notas Olfativas**: Agrupadas por nivel (Salida → Corazón → Fondo)

### 5. `styles.css` - Estilos

Variables CSS (custom properties) para theming:

```css
:root {
  --bg-primary: #0a0a0f;      /* Fondo principal */
  --bg-secondary: #12121a;    /* Sidebar */
  --bg-tertiary: #1a1a2e;     /* Cards y items */
  --bg-hover: #222240;        /* Estados hover */
  --accent: #6c5ce7;          /* Color primario */
  --star: #FFD700;            /* Estrellas activas */
  --danger: #ff4757;          /* Botón limpiar */
}
```

**Layout:**
- Flexbox para estructura principal (sidebar + main)
- Sidebar: 300px fijo, scroll interno
- Main: flex:1, canvas ocupa 100%
- Cascade menu: 300px, overlay sobre canvas

## Arquitectura de Renderizado 3D

### Pipeline

```
Datos → Geometría → Material → Mesh → Escena → Renderer → Canvas
```

### Componentes del Grafo

| Componente | Geometría | Material | Color |
|-----------|-----------|----------|-------|
| Centro | IcosahedronGeometry(1.2, 1) | MeshPhongMaterial | #6c5ce7 |
| Nota | SphereGeometry(r, 32, 32) | MeshPhongMaterial | NOTE_COLORS[subtipo] |
| Línea | BufferGeometry + LineBasicMaterial | - | NOTE_COLORS[subtipo] |
| Label | CanvasTexture → Sprite | SpriteMaterial | #f0f0f0 |

### Iluminación

```
AmbientLight(0xffffff, 0.6)     # Luz base uniforme
DirectionalLight(0xffffff, 0.8) # Luz direccional principal
PointLight(0x6c5ce7, 0.5, 30)   # Punto de luz púrpura
```

## Decisiones de Diseño

### ¿Por qué Canvas para las etiquetas y no TextGeometry?

Canvas es más ligero, no requiere cargar fuentes externas y funciona bien para texto 2D simple. TextGeometry generaría meshes 3D costosos en GPU para texto plano.

### ¿Por qué sprites para las etiquetas?

Los sprites siempre miran a la cámara, garantizando legibilidad desde cualquier ángulo sin rotación manual.

### ¿Por qué el grafo usa posición orbital y no force-directed?

Para perfumes con pocas notas (5) una distribución circular es más limpia y predecible. Un layout force-directed añadiría complejidad sin beneficio visual significativo.

### ¿Por qué Node.js para el servidor?

El proyecto usa Three.js cargado por CDN, por lo que solo necesita servir archivos estáticos. Un servidor HTTP básico con Node.js es suficiente y más portable que Python (que requiere instalación aparte).

## Flujo de Usuario

```
1. Usuario abre http://localhost:3000
2. Se carga index.html
3. Scripts cargados:
   a. Three.js (CDN)
   b. OrbitControls (CDN)
   c. data/perfumes.js (datos)
   d. src/scene.js (motor 3D)
   e. src/cascade.js (menú detalles)
   f. src/app.js (lógica app)
4. DOMContentLoaded →
   - Se inicializa FragranceScene
   - Se inicializa CascadeMenu
   - Se crean filtros dinámicamente
   - Se renderiza lista de perfumes
   - Se selecciona primer perfume
   - Inicia loop de animación
5. Usuario interactúa:
   - Busca texto → debounce 150ms → applyFilters()
   - Click en filtro → toggleFilter() → applyFilters()
   - Click en perfume → selectPerfume() → scene + cascade
   - Mouse en canvas → OrbitControls maneja cámara
   - Click en nodo → highlightNode()
```
