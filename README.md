# Fragrance Graph 3D

Dashboard interactivo de perfumes con visualización 3D y gráficos analíticos construido con **Three.js** y **Apache ECharts**.

![Three.js](https://img.shields.io/badge/three.js-r128-9cf)
![ECharts](https://img.shields.io/badge/echarts-5.4-blue)
![JavaScript](https://img.shields.io/badge/javascript-es6-f7df1e)
![License](https://img.shields.io/badge/license-MIT-green)

## Vista previa

Dashboard con múltiples visualizaciones:

| Gráfico | Descripción |
|---------|-------------|
| **ADN (Radar)** | Perfil sensorial: frescura, dulzura, calidez, intensidad, elegancia, sensualidad |
| **Termómetros** | Barras horizontales con emojis de cada dimensión emocional |
| **Treemap** | Composición del perfume por notas (tamaño = porcentaje, color = tipo) |
| **Timeline** | Evolución temporal de las notas (salida → corazón → fondo) en 12 horas |
| **Galaxia** | Scatter de todos los perfumes (X=frescura, Y=calidez, tamaño=rating, color=familia) |
| **Grafo 3D** | Perfume central con nodos de notas conectados por líneas |
| **Recomendador** | Perfumes similares basados en similitud de coseno del vector perfil |

## Panel de Información (Cascade Menu)

Al seleccionar un perfume se actualiza automáticamente el **panel lateral derecho** (botón ℹ️) con:
- Imagen del perfume, nombre, marca, año y rating
- Descripción completa
- Tags (familia, género, ocasión, estilo, temporada)
- Estadísticas (concentración, longevidad, proyección, sillage)
- Notas olfativas agrupadas por nivel (Salida → Corazón → Fondo) con color, % y descripción

## Instalación

```bash
npm install
npm start
```

El servidor se inicia en `http://localhost:3000`.

## Uso

1. Abre `http://localhost:3000` en tu navegador
2. Selecciona un perfume de la lista lateral
3. Usa el **mouse** para rotar, hacer zoom y explorar el grafo 3D
4. Usa los **filtros** en la barra lateral para buscar por:
   - Texto (nombre o marca)
   - Rating (1-5 estrellas)
   - Familia olfativa
   - Ocasión
   - Estilo
   - Género
   - Temporada
   - Tipo de nota
5. Haz clic en el menú cascada para ver los detalles del perfume

## Controles del Grafo 3D

| Acción | Control |
|--------|---------|
| Rotar | Click izquierdo + arrastrar |
| Zoom | Scroll del mouse |
| Pan | Click derecho + arrastrar |
| Highlight nota | Hover sobre un nodo |
| Seleccionar nota | Click en un nodo |

## Estructura del Proyecto

```
graph-3d-fragance/
├── index.html              # Dashboard principal con grid de gráficos
├── styles.css              # Estilos del dashboard
├── server.js               # Servidor estático Node.js
├── package.json            # Configuración del proyecto
├── data/
│   └── perfumes.js         # Datos + métricas derivadas (sensaciones, vectorPerfil, scores)
├── src/
│   ├── scene.js            # Motor 3D con Three.js (panel del dashboard)
│   ├── dashboard.js        # Gráficos ECharts (Radar, Thermo, Treemap, Timeline, Scatter, Recomendador)
│   └── app.js              # Filtros, búsqueda y coordinación entre sidebar y dashboard
├── sistema_perfumes.txt    # Especificaciones del sistema
├── catalogo_tags_perfumes.csv # Catálogo de tags
└── docs/
    └── ARCHITECTURE.md     # Documentación técnica
```

## Datos del Perfume

Cada perfume incluye métricas derivadas calculadas automáticamente:

```javascript
{
  // Datos base
  id: 1, nombre: 'Bleu Intense', marca: 'Maison Fictice',
  familia: 'amaderado', rating: 4, notas: [...],
  
  // Métricas derivadas (calculadas automáticamente)
  sensaciones: { frescura: 40, dulzura: 5, calidez: 65, intensidad: 70, elegancia: 50, sensualidad: 15 },
  vectorPerfil: { frescura: 40, dulzura: 5, calidez: 65, intensidad: 70 },
  longevityScore: 5,    // 1-5
  projectionScore: 3,   // 1-5
  massAppeal: 4         // 1-5
}
```
```

## Tipos de Notas y Colores

| Tipo | Color |
|------|-------|
| Cítrico | Dorado (#FFD700) |
| Frutal | Rojo (#FF6B6B) |
| Floral | Rosa (#FF85A2) |
| Madera | Café (#8B5E3C) |
| Gourmand | Melocotón (#E8A87C) |
| Especia | Naranja (#C1440E) |
| Verde | Verde (#4ECB71) |
| Resina | Ámbar (#8B6914) |
| Animalico | Marrón (#5C4033) |
| Acuático | Azul (#4DA8DA) |
| Sintético | Púrpura (#A78BFA) |

## Niveles de Notas

| Nivel | Posición | Descripción |
|-------|----------|-------------|
| Top | Salida | Primeras impresiones, volátiles |
| Middle | Corazón | Identidad principal del perfume |
| Base | Fondo | Notas de larga duración |

## Tecnologías

- **Three.js r128** - Renderizado 3D del grafo
- **OrbitControls** - Controles de cámara interactivos
- **Apache ECharts 5.4** - Radar, barras, treemap, líneas, scatter
- **Vanilla JavaScript** - Sin frameworks
- **Node.js** - Servidor de archivos estáticos
- **Canvas API** - Generación de etiquetas de texto como sprites (Three.js)

## Métricas Derivadas

Las siguientes métricas se calculan automáticamente a partir de las notas:

| Métrica | Fórmula |
|---------|---------|
| **Frescura** | % de notas cítricas + acuáticas + verdes |
| **Dulzura** | % de notas gourmand + frutales |
| **Calidez** | % de notas madera + resinas + especias |
| **Intensidad** | Proporción de notas base + middle vs total |
| **Elegancia** | % floral + resina + madera (pesos ajustados) |
| **Sensualidad** | % gourmand + animalico + resina |
| **Vector Perfil** | {frescura, dulzura, calidez, intensidad} para similitud |
| **Similitud** | Coseno entre vectores de perfil (0-1) |

## Agregar Nuevos Perfumes

1. Abre `data/perfumes.js`
2. Agrega un nuevo objeto al array `PERFUMES`
3. El grafo se actualizará automáticamente al recargar

```javascript
{
  id: 21,
  nombre: 'Nuevo Perfume',
  marca: 'Tu Marca',
  familia: 'floral',
  ocasion: ['diario'],
  estilo: ['moderno'],
  genero: 'femenino',
  temporada: ['verano'],
  rating: 4,
  year: 2024,
  concentracion: 'eau de parfum',
  description: 'Descripción del perfume',
  longevidad: 'moderada',
  proyeccion: 'media',
  sillage: 'moderado',
  imagen: 'https://placehold.co/400x500/1a1a2e/6c5ce7?text=Perfume',
  notas: [
    { nombre: 'rosa', subtipo: 'floral', nivel: 'middle', porcentaje: 30, descripcion: '...' },
    // ... más notas
  ]
}
```

## Licencia

MIT
