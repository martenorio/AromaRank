# Fragrance Graph 3D

Visualizador 3D de perfumes en grafo interactivo construido con **Three.js**. Explora perfumes a través de sus notas olfativas representadas como nodos en un espacio tridimensional.

![Three.js](https://img.shields.io/badge/three.js-r128-9cf)
![JavaScript](https://img.shields.io/badge/javascript-es6-f7df1e)
![License](https://img.shields.io/badge/license-MIT-green)

## Vista previa

Un grafo 3D donde:
- **Nodo central**: Representa el perfume seleccionado (icosaedro púrpura)
- **Nodos periféricos**: Cada nota olfativa con color según su tipo y tamaño proporcional a su porcentaje
- **Líneas conectoras**: Unen el perfume con cada una de sus notas
- **Etiquetas**: Muestran el nombre de la nota y su porcentaje de intensidad

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
├── index.html              # Página principal
├── styles.css              # Estilos de la interfaz
├── server.js               # Servidor estático Node.js
├── package.json            # Configuración del proyecto
├── data/
│   └── perfumes.js         # Datos de perfumes y configuración
├── src/
│   ├── scene.js            # Motor 3D con Three.js
│   ├── app.js              # Lógica de filtros y UI
│   └── cascade.js          # Menú de detalles del perfume
├── sistema_perfumes.txt    # Especificaciones del sistema
├── catalogo_tags_perfumes.csv # Catálogo de tags disponibles
├── README.md               # Este archivo
└── docs/
    └── ARCHITECTURE.md     # Documentación técnica
```

## Datos del Perfume

Cada perfume en `data/perfumes.js` incluye:

```javascript
{
  id: 1,
  nombre: 'Bleu Intense',
  marca: 'Maison Fictice',
  familia: 'amaderado',
  ocasion: ['oficina', 'diario'],
  estilo: ['elegante', 'sofisticado'],
  genero: 'masculino',
  temporada: ['primavera', 'otono'],
  rating: 4,                    // 1-5 estrellas
  year: 2023,
  concentracion: 'eau de parfum',
  description: 'Descripción...',
  longevidad: 'alta',
  proyeccion: 'media',
  sillage: 'moderado',
  imagen: 'url-imagen',
  notas: [
    {
      nombre: 'bergamota',
      subtipo: 'citrico',
      nivel: 'top',
      porcentaje: 25,
      descripcion: 'Frescura vibrante...'
    }
  ]
}
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

- **Three.js r128** - Renderizado 3D
- **OrbitControls** - Controles de cámara interactivos
- **Vanilla JavaScript** - Sin frameworks
- **Node.js** - Servidor de archivos estáticos
- **Canvas API** - Generación de etiquetas de texto como sprites

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
