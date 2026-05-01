/**
 * @fileoverview Datos de perfumes y configuración del sistema
 * Contiene el catálogo de colores de notas, opciones de filtro y perfumes de ejemplo.
 *
 * Para agregar un nuevo perfume, añade un objeto al array PERFUMES siguiendo la estructura:
 * { id, nombre, marca, familia, ocasion[], estilo[], genero, temporada[],
 *   rating, year, concentracion, description, longevidad, proyeccion, sillage, imagen, notas[] }
 */

/**
 * Mapa de colores por subtipo de nota olfativa
 * @constant {Object<string, string>}
 */
const NOTE_COLORS = {
    citrico: '#FFD700',
    frutal: '#FF6B6B',
    floral: '#FF85A2',
    madera: '#8B5E3C',
    gourmand: '#E8A87C',
    especia: '#C1440E',
    verde: '#4ECB71',
    resina: '#8B6914',
    animalico: '#5C4033',
    acuatico: '#4DA8DA',
    sintetico: '#A78BFA'
};

/**
 * Opciones disponibles para cada tipo de filtro
 * Las claves corresponden a las categorías del sistema de filtrado
 * @constant {Object}
 */
const FILTER_OPTIONS = {
    familia: ['calido', 'fresco', 'oriental', 'amaderado', 'floral', 'citrico', 'gourmand', 'acuatico', 'verde'],
    ocasion: ['diario', 'oficina', 'noche', 'formal', 'casual', 'cita', 'fiesta', 'deporte'],
    estilo: ['elegante', 'sexy', 'deportivo', 'juvenil', 'sofisticado', 'misterioso', 'clasico', 'moderno'],
    genero: ['masculino', 'femenino', 'unisex'],
    temporada: ['verano', 'invierno', 'otono', 'primavera']
};

/**
 * Catálogo de perfumes con sus notas y metadatos
 * Cada perfume contiene información de clasificación (familia, ocasion, estilo, etc.)
 * y un array de notas con nivel, porcentaje y descripción.
 *
 * @typedef {Object} PerfumeNote
 * @property {string} nombre - Nombre de la nota
 * @property {string} tipo - Tipo de tag (siempre 'nota')
 * @property {string} subtipo - Subtipo de nota (clave de NOTE_COLORS)
 * @property {string} nivel - Nivel olfativo: 'top', 'middle', 'base'
 * @property {number} porcentaje - Intensidad de la nota (0-100)
 * @property {string} descripcion - Descripción de la nota
 *
 * @typedef {Object} Perfume
 * @property {number} id - Identificador único
 * @property {string} nombre - Nombre del perfume
 * @property {string} marca - Marca del perfume
 * @property {string} familia - Familia olfativa (clave de FILTER_OPTIONS.familia)
 * @property {string[]} ocasion - Ocaciones de uso
 * @property {string[]} estilo - Estilos asociados
 * @property {string} genero - Género (clave de FILTER_OPTIONS.genero)
 * @property {string[]} temporada - Temporadas recomendadas
 * @property {number} rating - Rating de 1 a 5 estrellas
 * @property {number} year - Año de lanzamiento
 * @property {string} concentracion - Tipo de concentración
 * @property {string} description - Descripción del perfume
 * @property {string} longevidad - Duración: 'corta', 'moderada', 'larga'
 * @property {string} proyeccion - Alcance: 'baja', 'moderada', 'alta'
 * @property {string} sillage - Estela: 'ligero', 'moderado', 'intenso'
 * @property {string} imagen - URL de imagen
 * @property {PerfumeNote[]} notas - Array de notas olfativas
 *
 * @constant {Perfume[]}
 */
const PERFUMES = [
    {
        id: 1,
        nombre: 'Bleu Intense',
        marca: 'Maison Fictice',
        familia: 'amaderado',
        ocasion: ['oficina', 'diario'],
        estilo: ['elegante', 'sofisticado'],
        genero: 'masculino',
        temporada: ['primavera', 'otono'],
        rating: 4,
        year: 2023,
        concentracion: 'eau de parfum',
        description: 'Una fragancia amaderada intensa que combina la frescura cítrica del bergamota con la profundidad del cedro y sándalo. Ideal para el profesional moderno que busca presencia sin exceso.',
        longevidad: 'alta',
        proyeccion: 'media',
        sillage: 'moderado',
        imagen: 'https://placehold.co/400x500/1a1a2e/6c5ce7?text=Bleu+Intense',
        notas: [
            { nombre: 'bergamota', tipo: 'nota', subtipo: 'citrico', nivel: 'top', porcentaje: 25, descripcion: 'Frescura vibrante y chispeante' },
            { nombre: 'limon', tipo: 'nota', subtipo: 'citrico', nivel: 'top', porcentaje: 15, descripcion: 'Brillo cítrico inicial' },
            { nombre: 'cedro', tipo: 'nota', subtipo: 'madera', nivel: 'middle', porcentaje: 30, descripcion: 'Corazón amaderado cálido' },
            { nombre: 'sandalos', tipo: 'nota', subtipo: 'madera', nivel: 'base', porcentaje: 20, descripcion: 'Suavidad cremosa y noble' },
            { nombre: 'vetiver', tipo: 'nota', subtipo: 'madera', nivel: 'base', porcentaje: 10, descripcion: 'Toque terroso y elegante' }
        ]
    },
    {
        id: 2,
        nombre: 'Rose Mystique',
        marca: 'Parfums du Rêve',
        familia: 'floral',
        ocasion: ['noche', 'cita', 'formal'],
        estilo: ['elegante', 'sexy', 'sofisticado'],
        genero: 'femenino',
        temporada: ['primavera', 'invierno'],
        rating: 5,
        year: 2022,
        concentracion: 'parfum',
        description: 'Un bouquet floral misterioso donde la rosa turca y el jazmin se entrelazan con frambuesa. Una fragancia seductora para noches memorables.',
        longevidad: 'larga',
        proyeccion: 'alta',
        sillage: 'intenso',
        imagen: 'https://placehold.co/400x500/1a1a2e/FF85A2?text=Rose+Mystique',
        notas: [
            { nombre: 'rosa', tipo: 'nota', subtipo: 'floral', nivel: 'middle', porcentaje: 35, descripcion: 'Rosa turca opulenta' },
            { nombre: 'jazmin', tipo: 'nota', subtipo: 'floral', nivel: 'middle', porcentaje: 25, descripcion: 'Jazmin sambac intenso' },
            { nombre: 'frambuesa', tipo: 'nota', subtipo: 'frutal', nivel: 'top', porcentaje: 20, descripcion: 'Dulzura frutal jugosa' },
            { nombre: 'almizcle', tipo: 'nota', subtipo: 'animalico', nivel: 'base', porcentaje: 15, descripcion: 'Base sensual y cálida' },
            { nombre: 'ambar', tipo: 'nota', subtipo: 'resina', nivel: 'base', porcentaje: 5, descripcion: 'Resina dorada envolvente' }
        ]
    },
    {
        id: 3,
        nombre: 'Vanille Noire',
        marca: 'Oud Collection',
        familia: 'oriental',
        ocasion: ['noche', 'formal', 'fiesta'],
        estilo: ['misterioso', 'sexy', 'sofisticado'],
        genero: 'unisex',
        temporada: ['invierno', 'otono'],
        rating: 5,
        year: 2021,
        concentracion: 'eau de parfum',
        description: 'La combinación perfecta entre la dulzura gourmand de la vainilla y la oscuridad del oud. Un perfume que evoca noches de invierno junto a una chimenea.',
        longevidad: 'larga',
        proyeccion: 'alta',
        sillage: 'intenso',
        imagen: 'https://placehold.co/400x500/1a1a2e/E8A87C?text=Vanille+Noire',
        notas: [
            { nombre: 'vainilla', tipo: 'nota', subtipo: 'gourmand', nivel: 'base', porcentaje: 30, descripcion: 'Vainilla de Madagascar pura' },
            { nombre: 'haba tonka', tipo: 'nota', subtipo: 'gourmand', nivel: 'base', porcentaje: 20, descripcion: 'Dulzura almondrada' },
            { nombre: 'canela', tipo: 'nota', subtipo: 'especia', nivel: 'middle', porcentaje: 15, descripcion: 'Calidez especiada' },
            { nombre: 'oud', tipo: 'nota', subtipo: 'madera', nivel: 'base', porcentaje: 25, descripcion: 'Madera de agar intensa' },
            { nombre: 'cardamomo', tipo: 'nota', subtipo: 'especia', nivel: 'top', porcentaje: 10, descripcion: 'Especia aromática fresca' }
        ]
    },
    {
        id: 4,
        nombre: 'Ocean Breeze',
        marca: 'Aqua Marine',
        familia: 'acuatico',
        ocasion: ['diario', 'casual', 'deporte'],
        estilo: ['deportivo', 'juvenil', 'moderno'],
        genero: 'unisex',
        temporada: ['verano', 'primavera'],
        rating: 3,
        year: 2024,
        concentracion: 'eau de toilette',
        description: 'Frescura marina capturada en una botella. Notas acuáticas y verdes que transportan a la brisa del océano en un día de verano.',
        longevidad: 'moderada',
        proyeccion: 'media',
        sillage: 'ligero',
        imagen: 'https://placehold.co/400x500/1a1a2e/4DA8DA?text=Ocean+Breeze',
        notas: [
            { nombre: 'notas marinas', tipo: 'nota', subtipo: 'acuatico', nivel: 'top', porcentaje: 35, descripcion: 'Acorde marino salino' },
            { nombre: 'bergamota', tipo: 'nota', subtipo: 'citrico', nivel: 'top', porcentaje: 20, descripcion: 'Frescura mediterránea' },
            { nombre: 'menta', tipo: 'nota', subtipo: 'verde', nivel: 'middle', porcentaje: 15, descripcion: 'Mentolado refrescante' },
            { nombre: 'te verde', tipo: 'nota', subtipo: 'verde', nivel: 'middle', porcentaje: 20, descripcion: 'Té verde delicado' },
            { nombre: 'cashmere wood', tipo: 'nota', subtipo: 'madera', nivel: 'base', porcentaje: 10, descripcion: 'Madera suave y aterciopelada' }
        ]
    },
    {
        id: 5,
        nombre: 'Epic Spice',
        marca: 'Oriental Nights',
        familia: 'oriental',
        ocasion: ['noche', 'formal'],
        estilo: ['misterioso', 'elegante', 'clasico'],
        genero: 'masculino',
        temporada: ['invierno', 'otono'],
        rating: 4,
        year: 2020,
        concentracion: 'parfum',
        description: 'Una odisea especíada que recorre desde la pimienta negra hasta el incienso sagrado. Para quienes buscan una fragancia con carácter y misterio.',
        longevidad: 'larga',
        proyeccion: 'alta',
        sillage: 'intenso',
        imagen: 'https://placehold.co/400x500/1a1a2e/C1440E?text=Epic+Spice',
        notas: [
            { nombre: 'pimienta', tipo: 'nota', subtipo: 'especia', nivel: 'top', porcentaje: 20, descripcion: 'Pimienta negra picante' },
            { nombre: 'azafran', tipo: 'nota', subtipo: 'especia', nivel: 'middle', porcentaje: 25, descripcion: 'Azafran dorado lujoso' },
            { nombre: 'incienso', tipo: 'nota', subtipo: 'resina', nivel: 'base', porcentaje: 20, descripcion: 'Humo sagrado místico' },
            { nombre: 'tabaco', tipo: 'nota', subtipo: 'animalico', nivel: 'base', porcentaje: 20, descripcion: 'Tabaco rubio ahumado' },
            { nombre: 'cuero', tipo: 'nota', subtipo: 'animalico', nivel: 'base', porcentaje: 15, descripcion: 'Cuero curtido sofisticado' }
        ]
    },
    {
        id: 6,
        nombre: 'Fresh Citrus',
        marca: 'Summer Vibes',
        familia: 'citrico',
        ocasion: ['diario', 'casual', 'deporte', 'oficina'],
        estilo: ['juvenil', 'moderno', 'deportivo'],
        genero: 'unisex',
        temporada: ['verano', 'primavera'],
        rating: 3,
        year: 2024,
        concentracion: 'eau de toilette',
        description: 'Explosión cítrica perfecta para el calor. Una sinfonía de naranjas, mandarinas y limones que despierta los sentidos.',
        longevidad: 'corta',
        proyeccion: 'media',
        sillage: 'ligero',
        imagen: 'https://placehold.co/400x500/1a1a2e/FFD700?text=Fresh+Citrus',
        notas: [
            { nombre: 'naranja', tipo: 'nota', subtipo: 'citrico', nivel: 'top', porcentaje: 30, descripcion: 'Naranja sanguina jugosa' },
            { nombre: 'mandarina', tipo: 'nota', subtipo: 'citrico', nivel: 'top', porcentaje: 25, descripcion: 'Mandarina dulce italiana' },
            { nombre: 'toronja', tipo: 'nota', subtipo: 'citrico', nivel: 'top', porcentaje: 20, descripcion: 'Toronja amarga refrescante' },
            { nombre: 'limon', tipo: 'nota', subtipo: 'citrico', nivel: 'top', porcentaje: 15, descripcion: 'Limón de Sicilia vibrante' },
            { nombre: 'romero', tipo: 'nota', subtipo: 'verde', nivel: 'middle', porcentaje: 10, descripcion: 'Romero aromático herbáceo' }
        ]
    },
    {
        id: 7,
        nombre: 'Velvet Oud',
        marca: 'Oud Collection',
        familia: 'oriental',
        ocasion: ['noche', 'formal', 'cita'],
        estilo: ['misterioso', 'sofisticado', 'sexy'],
        genero: 'unisex',
        temporada: ['invierno'],
        rating: 5,
        year: 2019,
        concentracion: 'parfum',
        description: 'Oud puro con toques de rosa y especias. Una joya de la perfumería oriental que define el lujo y la exclusividad.',
        longevidad: 'larga',
        proyeccion: 'alta',
        sillage: 'intenso',
        imagen: 'https://placehold.co/400x500/1a1a2e/8B5E3C?text=Velvet+Oud',
        notas: [
            { nombre: 'oud', tipo: 'nota', subtipo: 'madera', nivel: 'base', porcentaje: 35, descripcion: 'Oud real camboyano' },
            { nombre: 'rosa', tipo: 'nota', subtipo: 'floral', nivel: 'middle', porcentaje: 20, descripcion: 'Rosa búlgara aterciopelada' },
            { nombre: 'azafran', tipo: 'nota', subtipo: 'especia', nivel: 'top', porcentaje: 15, descripcion: 'Azafran iraní preciado' },
            { nombre: 'sandalos', tipo: 'nota', subtipo: 'madera', nivel: 'base', porcentaje: 20, descripcion: 'Sándalo indio cremoso' },
            { nombre: 'almizcle', tipo: 'nota', subtipo: 'animalico', nivel: 'base', porcentaje: 10, descripcion: 'Almizcle blanco limpio' }
        ]
    },
    {
        id: 8,
        nombre: 'Jardin Secret',
        marca: 'Parfums du Rêve',
        familia: 'floral',
        ocasion: ['cita', 'diario', 'formal'],
        estilo: ['elegante', 'romantico', 'clasico'],
        genero: 'femenino',
        temporada: ['primavera', 'verano'],
        rating: 4,
        year: 2023,
        concentracion: 'eau de parfum',
        description: 'Un jardín floral secreto donde jazmines, violetas y magnolias florecen bajo el sol primaveral. Romántico y atemporal.',
        longevidad: 'moderada',
        proyeccion: 'media',
        sillage: 'moderado',
        imagen: 'https://placehold.co/400x500/1a1a2e/FF85A2?text=Jardin+Secret',
        notas: [
            { nombre: 'jazmin', tipo: 'nota', subtipo: 'floral', nivel: 'middle', porcentaje: 30, descripcion: 'Jazmin grandiflorum blanco' },
            { nombre: 'violeta', tipo: 'nota', subtipo: 'floral', nivel: 'middle', porcentaje: 20, descripcion: 'Violeta dulce y polvosa' },
            { nombre: 'pera', tipo: 'nota', subtipo: 'frutal', nivel: 'top', porcentaje: 25, descripcion: 'Pera madura jugosa' },
            { nombre: 'magnolia', tipo: 'nota', subtipo: 'floral', nivel: 'middle', porcentaje: 15, descripcion: 'Magnolia fresca y limpia' },
            { nombre: 'almizcle', tipo: 'nota', subtipo: 'animalico', nivel: 'base', porcentaje: 10, descripcion: 'Almizcle suave envolvente' }
        ]
    },
    {
        id: 9,
        nombre: 'Tobacco Vanille',
        marca: 'Maison Fictice',
        familia: 'oriental',
        ocasion: ['noche', 'formal', 'oficina'],
        estilo: ['elegante', 'sofisticado', 'clasico'],
        genero: 'masculino',
        temporada: ['invierno', 'otono'],
        rating: 5,
        year: 2018,
        concentracion: 'eau de parfum',
        description: 'Tabaco aromático mezclado con vainilla dulce y cacao. Un clásico moderno que evoca las bibliotecas inglesas con chimenea.',
        longevidad: 'larga',
        proyeccion: 'alta',
        sillage: 'intenso',
        imagen: 'https://placehold.co/400x500/1a1a2e/5C4033?text=Tobacco+Vanille',
        notas: [
            { nombre: 'tabaco', tipo: 'nota', subtipo: 'animalico', nivel: 'base', porcentaje: 30, descripcion: 'Tabaco de pipa aromático' },
            { nombre: 'vainilla', tipo: 'nota', subtipo: 'gourmand', nivel: 'base', porcentaje: 25, descripcion: 'Vainilla bourbon dulce' },
            { nombre: 'cacao', tipo: 'nota', subtipo: 'gourmand', nivel: 'middle', porcentaje: 15, descripcion: 'Cacao amargo intenso' },
            { nombre: 'especias secas', tipo: 'nota', subtipo: 'especia', nivel: 'top', porcentaje: 20, descripcion: 'Mezcla de especias cálidas' },
            { nombre: 'haba tonka', tipo: 'nota', subtipo: 'gourmand', nivel: 'base', porcentaje: 10, descripcion: 'Haba tonka almondrada' }
        ]
    },
    {
        id: 10,
        nombre: 'Acqua di Gioia',
        marca: 'Aqua Marine',
        familia: 'acuatico',
        ocasion: ['diario', 'casual'],
        estilo: ['juvenil', 'moderno'],
        genero: 'femenino',
        temporada: ['verano', 'primavera'],
        rating: 4,
        year: 2023,
        concentracion: 'eau de parfum',
        description: 'Frescura acuática femenina que combina limón vibrante con jazmin y notas marinas. Como una brisa marina en un día soleado.',
        longevidad: 'moderada',
        proyeccion: 'media',
        sillage: 'moderado',
        imagen: 'https://placehold.co/400x500/1a1a2e/4DA8DA?text=Acqua+di+Gioia',
        notas: [
            { nombre: 'limon', tipo: 'nota', subtipo: 'citrico', nivel: 'top', porcentaje: 20, descripcion: 'Limón amalfitano brillante' },
            { nombre: 'menta', tipo: 'nota', subtipo: 'verde', nivel: 'top', porcentaje: 15, descripcion: 'Menta fresca helada' },
            { nombre: 'jazmin', tipo: 'nota', subtipo: 'floral', nivel: 'middle', porcentaje: 25, descripcion: 'Jazmin luminoso y solar' },
            { nombre: 'notas marinas', tipo: 'nota', subtipo: 'acuatico', nivel: 'middle', porcentaje: 25, descripcion: 'Acuático marino cristalino' },
            { nombre: 'cedro', tipo: 'nota', subtipo: 'madera', nivel: 'base', porcentaje: 15, descripcion: 'Cedro suave y limpio' }
        ]
    },
    {
        id: 11,
        nombre: 'Santal Royal',
        marca: 'Oud Collection',
        familia: 'amaderado',
        ocasion: ['noche', 'formal', 'fiesta'],
        estilo: ['elegante', 'misterioso', 'sofisticado'],
        genero: 'unisex',
        temporada: ['invierno', 'otono'],
        rating: 5,
        year: 2020,
        concentracion: 'parfum',
        description: 'Sándalo real en su máxima expresión, enriquecido con oud, rosa y cuero. Una fragancia majestuosa para ocasiones especiales.',
        longevidad: 'larga',
        proyeccion: 'alta',
        sillage: 'intenso',
        imagen: 'https://placehold.co/400x500/1a1a2e/8B5E3C?text=Santal+Royal',
        notas: [
            { nombre: 'sandalos', tipo: 'nota', subtipo: 'madera', nivel: 'base', porcentaje: 30, descripcion: 'Sándalo Mysore puro' },
            { nombre: 'rosa', tipo: 'nota', subtipo: 'floral', nivel: 'middle', porcentaje: 15, descripcion: 'Rosa damascena delicada' },
            { nombre: 'oud', tipo: 'nota', subtipo: 'madera', nivel: 'base', porcentaje: 25, descripcion: 'Oud ahumado profundo' },
            { nombre: 'cuero', tipo: 'nota', subtipo: 'animalico', nivel: 'base', porcentaje: 20, descripcion: 'Cuero noble refinado' },
            { nombre: 'especias secas', tipo: 'nota', subtipo: 'especia', nivel: 'top', porcentaje: 10, descripcion: 'Especias orientales secas' }
        ]
    },
    {
        id: 12,
        nombre: 'Light Blue',
        marca: 'Summer Vibes',
        familia: 'citrico',
        ocasion: ['diario', 'casual', 'deporte'],
        estilo: ['juvenil', 'clasico'],
        genero: 'femenino',
        temporada: ['verano'],
        rating: 4,
        year: 2022,
        concentracion: 'eau de toilette',
        description: 'La frescura del Mediterráneo en una fragancia. Manzana crujiente, rosa blanca y cedro crean una armonía perfecta para el verano.',
        longevidad: 'moderada',
        proyeccion: 'media',
        sillage: 'ligero',
        imagen: 'https://placehold.co/400x500/1a1a2e/FFD700?text=Light+Blue',
        notas: [
            { nombre: 'manzana', tipo: 'nota', subtipo: 'frutal', nivel: 'top', porcentaje: 25, descripcion: 'Manzana verde crujiente' },
            { nombre: 'cedro', tipo: 'nota', subtipo: 'madera', nivel: 'base', porcentaje: 20, descripcion: 'Cedro seco y limpio' },
            { nombre: 'bambu', tipo: 'nota', subtipo: 'verde', nivel: 'middle', porcentaje: 15, descripcion: 'Bambú fresco y verde' },
            { nombre: 'rosa blanca', tipo: 'nota', subtipo: 'floral', nivel: 'middle', porcentaje: 25, descripcion: 'Rosa blanca delicada' },
            { nombre: 'limon', tipo: 'nota', subtipo: 'citrico', nivel: 'top', porcentaje: 15, descripcion: 'Limón siciliano brillante' }
        ]
    },
    {
        id: 13,
        nombre: 'Noir Extreme',
        marca: 'Maison Fictice',
        familia: 'oriental',
        ocasion: ['noche', 'cita', 'formal'],
        estilo: ['sexy', 'misterioso', 'elegante'],
        genero: 'masculino',
        temporada: ['invierno', 'otono'],
        rating: 4,
        year: 2021,
        concentracion: 'eau de parfum',
        description: 'Oscuridad seductora con cardamomo, vainilla y ámbar. Una fragancia nocturna que envuelve y atrae con su misterio.',
        longevidad: 'larga',
        proyeccion: 'alta',
        sillage: 'moderado',
        imagen: 'https://placehold.co/400x500/1a1a2e/3d2d94?text=Noir+Extreme',
        notas: [
            { nombre: 'cardamomo', tipo: 'nota', subtipo: 'especia', nivel: 'top', porcentaje: 20, descripcion: 'Cardamomo verde especiado' },
            { nombre: 'nuez moscada', tipo: 'nota', subtipo: 'especia', nivel: 'middle', porcentaje: 15, descripcion: 'Nuez moscada cálida' },
            { nombre: 'vainilla', tipo: 'nota', subtipo: 'gourmand', nivel: 'base', porcentaje: 25, descripcion: 'Vainilla negra profunda' },
            { nombre: 'ambar', tipo: 'nota', subtipo: 'resina', nivel: 'base', porcentaje: 20, descripcion: 'Ámbar dorado resinoso' },
            { nombre: 'sandalos', tipo: 'nota', subtipo: 'madera', nivel: 'base', porcentaje: 20, descripcion: 'Sándalo suave y lechoso' }
        ]
    },
    {
        id: 14,
        nombre: 'Flora Gorgeous',
        marca: 'Parfums du Rêve',
        familia: 'floral',
        ocasion: ['diario', 'cita', 'casual'],
        estilo: ['elegante', 'juvenil', 'moderno'],
        genero: 'femenino',
        temporada: ['primavera', 'verano'],
        rating: 3,
        year: 2024,
        concentracion: 'eau de toilette',
        description: 'Floral moderno y luminoso con gardenia, rosa y durazno. Fresco, juvenil y perfecto para el día a día.',
        longevidad: 'moderada',
        proyeccion: 'media',
        sillage: 'ligero',
        imagen: 'https://placehold.co/400x500/1a1a2e/FF85A2?text=Flora+Gorgeous',
        notas: [
            { nombre: 'gardenia', tipo: 'nota', subtipo: 'floral', nivel: 'middle', porcentaje: 30, descripcion: 'Gardenia blanca tropical' },
            { nombre: 'rosa', tipo: 'nota', subtipo: 'floral', nivel: 'middle', porcentaje: 20, descripcion: 'Rosa rosa luminosa' },
            { nombre: 'durazno', tipo: 'nota', subtipo: 'frutal', nivel: 'top', porcentaje: 20, descripcion: 'Durazno maduro dulce' },
            { nombre: 'mandarina', tipo: 'nota', subtipo: 'citrico', nivel: 'top', porcentaje: 15, descripcion: 'Mandarina italiana dulce' },
            { nombre: 'cedro', tipo: 'nota', subtipo: 'madera', nivel: 'base', porcentaje: 15, descripcion: 'Cedro limpio y suave' }
        ]
    },
    {
        id: 15,
        nombre: "Terre d'Orient",
        marca: 'Oriental Nights',
        familia: 'amaderado',
        ocasion: ['oficina', 'diario', 'formal'],
        estilo: ['sofisticado', 'clasico', 'elegante'],
        genero: 'masculino',
        temporada: ['otono', 'primavera'],
        rating: 4,
        year: 2022,
        concentracion: 'eau de parfum',
        description: 'Terroso y elegante, con naranja, pimienta y vetiver. Un perfume masculino con carácter para el caballero moderno.',
        longevidad: 'larga',
        proyeccion: 'moderada',
        sillage: 'moderado',
        imagen: 'https://placehold.co/400x500/1a1a2e/8B5E3C?text=Terre+Orient',
        notas: [
            { nombre: 'naranja', tipo: 'nota', subtipo: 'citrico', nivel: 'top', porcentaje: 20, descripcion: 'Naranja sanguina dulce' },
            { nombre: 'pimienta', tipo: 'nota', subtipo: 'especia', nivel: 'top', porcentaje: 15, descripcion: 'Pimienta rosa especíada' },
            { nombre: 'vetiver', tipo: 'nota', subtipo: 'madera', nivel: 'base', porcentaje: 30, descripcion: 'Vetiver haitiano terroso' },
            { nombre: 'cedro', tipo: 'nota', subtipo: 'madera', nivel: 'base', porcentaje: 25, descripcion: 'Cedro de Virginia seco' },
            { nombre: 'benjui', tipo: 'nota', subtipo: 'resina', nivel: 'base', porcentaje: 10, descripcion: 'Benjuí balsámico cálido' }
        ]
    },
    {
        id: 16,
        nombre: 'Cherry Desire',
        marca: 'Oud Collection',
        familia: 'gourmand',
        ocasion: ['noche', 'cita', 'fiesta'],
        estilo: ['sexy', 'moderno', 'juvenil'],
        genero: 'femenino',
        temporada: ['invierno', 'otono'],
        rating: 4,
        year: 2023,
        concentracion: 'eau de parfum',
        description: 'Cereza negra tentadora con almendra y vainilla. Un gourmand seductor que deleita con su dulzura adictiva.',
        longevidad: 'moderada',
        proyeccion: 'alta',
        sillage: 'intenso',
        imagen: 'https://placehold.co/400x500/1a1a2e/FF6B6B?text=Cherry+Desire',
        notas: [
            { nombre: 'cereza', tipo: 'nota', subtipo: 'frutal', nivel: 'top', porcentaje: 30, descripcion: 'Cereza negra madura' },
            { nombre: 'almendra', tipo: 'nota', subtipo: 'gourmand', nivel: 'middle', porcentaje: 20, descripcion: 'Almendra amarga cremosa' },
            { nombre: 'vainilla', tipo: 'nota', subtipo: 'gourmand', nivel: 'base', porcentaje: 25, descripcion: 'Vainilla dulce envolvente' },
            { nombre: 'rosa turca', tipo: 'nota', subtipo: 'floral', nivel: 'middle', porcentaje: 15, descripcion: 'Rosa turca profunda' },
            { nombre: 'sandalos', tipo: 'nota', subtipo: 'madera', nivel: 'base', porcentaje: 10, descripcion: 'Sándalo cremoso suave' }
        ]
    },
    {
        id: 17,
        nombre: 'Sport Extreme',
        marca: 'Summer Vibes',
        familia: 'fresco',
        ocasion: ['deporte', 'diario', 'casual'],
        estilo: ['deportivo', 'juvenil', 'moderno'],
        genero: 'masculino',
        temporada: ['verano', 'primavera'],
        rating: 3,
        year: 2024,
        concentracion: 'eau de toilette',
        description: 'Energía pura en una fragancia. Lima, jengibre y notas marinas crean un perfume deportivo que activa los sentidos.',
        longevidad: 'moderada',
        proyeccion: 'moderada',
        sillage: 'ligero',
        imagen: 'https://placehold.co/400x500/1a1a2e/4ECB71?text=Sport+Extreme',
        notas: [
            { nombre: 'lima', tipo: 'nota', subtipo: 'citrico', nivel: 'top', porcentaje: 25, descripcion: 'Lima verde vibrante' },
            { nombre: 'jengibre', tipo: 'nota', subtipo: 'especia', nivel: 'top', porcentaje: 15, descripcion: 'Jengibre fresco picante' },
            { nombre: 'te verde', tipo: 'nota', subtipo: 'verde', nivel: 'middle', porcentaje: 20, descripcion: 'Té verde energizante' },
            { nombre: 'notas marinas', tipo: 'nota', subtipo: 'acuatico', nivel: 'middle', porcentaje: 25, descripcion: 'Acuático marino fresco' },
            { nombre: 'musk sintetico', tipo: 'nota', subtipo: 'sintetico', nivel: 'base', porcentaje: 15, descripcion: 'Musk limpio y fresco' }
        ]
    },
    {
        id: 18,
        nombre: 'Ambre Mystique',
        marca: 'Oriental Nights',
        familia: 'oriental',
        ocasion: ['noche', 'formal', 'cita'],
        estilo: ['misterioso', 'sofisticado', 'sexy'],
        genero: 'unisex',
        temporada: ['invierno'],
        rating: 5,
        year: 2020,
        concentracion: 'parfum',
        description: 'Ámbar puro elevado con mirra e incienso. Una resina divina que envuelve como un abrazo cálido en noches frías.',
        longevidad: 'larga',
        proyeccion: 'alta',
        sillage: 'intenso',
        imagen: 'https://placehold.co/400x500/1a1a2e/8B6914?text=Ambre+Mystique',
        notas: [
            { nombre: 'ambar', tipo: 'nota', subtipo: 'resina', nivel: 'base', porcentaje: 30, descripcion: 'Ámbar gris puro' },
            { nombre: 'mirra', tipo: 'nota', subtipo: 'resina', nivel: 'base', porcentaje: 20, descripcion: 'Mirra balsámica antigua' },
            { nombre: 'incienso', tipo: 'nota', subtipo: 'resina', nivel: 'middle', porcentaje: 15, descripcion: 'Incienso de Omán sagrado' },
            { nombre: 'vainilla', tipo: 'nota', subtipo: 'gourmand', nivel: 'base', porcentaje: 20, descripcion: 'Vainilla dulce suave' },
            { nombre: 'bergamota', tipo: 'nota', subtipo: 'citrico', nivel: 'top', porcentaje: 15, descripcion: 'Bergamota fresca brillante' }
        ]
    },
    {
        id: 19,
        nombre: 'Green Escape',
        marca: 'Aqua Marine',
        familia: 'verde',
        ocasion: ['diario', 'casual', 'oficina'],
        estilo: ['moderno', 'juvenil', 'deportivo'],
        genero: 'unisex',
        temporada: ['primavera', 'verano'],
        rating: 3,
        year: 2024,
        concentracion: 'eau de toilette',
        description: 'Escape verde con albahaca, té verde y pomelo. Frescura natural que conecta con la naturaleza.',
        longevidad: 'moderada',
        proyeccion: 'moderada',
        sillage: 'ligero',
        imagen: 'https://placehold.co/400x500/1a1a2e/4ECB71?text=Green+Escape',
        notas: [
            { nombre: 'albahaca', tipo: 'nota', subtipo: 'verde', nivel: 'top', porcentaje: 20, descripcion: 'Albahaca fresca aromática' },
            { nombre: 'pomelo', tipo: 'nota', subtipo: 'citrico', nivel: 'top', porcentaje: 25, descripcion: 'Pomelo rosado cítrico' },
            { nombre: 'te verde', tipo: 'nota', subtipo: 'verde', nivel: 'middle', porcentaje: 25, descripcion: 'Té verde matcha puro' },
            { nombre: 'vetiver', tipo: 'nota', subtipo: 'madera', nivel: 'base', porcentaje: 20, descripcion: 'Vetiver fresco y verde' },
            { nombre: 'musgo', tipo: 'nota', subtipo: 'verde', nivel: 'base', porcentaje: 10, descripcion: 'Musgo de roble terroso' }
        ]
    },
    {
        id: 20,
        nombre: 'Cuero Real',
        marca: 'Maison Fictice',
        familia: 'amaderado',
        ocasion: ['noche', 'formal'],
        estilo: ['clasico', 'elegante', 'misterioso'],
        genero: 'masculino',
        temporada: ['otono', 'invierno'],
        rating: 4,
        year: 2019,
        concentracion: 'eau de parfum',
        description: 'Cuero auténtico con abedul y oud. Un perfume clásico y masculino que evoca las sastrerías londinenses.',
        longevidad: 'larga',
        proyeccion: 'moderada',
        sillage: 'moderado',
        imagen: 'https://placehold.co/400x500/1a1a2e/5C4033?text=Cuero+Real',
        notas: [
            { nombre: 'cuero', tipo: 'nota', subtipo: 'animalico', nivel: 'base', porcentaje: 35, descripcion: 'Cuero ruso auténtico' },
            { nombre: 'abedul', tipo: 'nota', subtipo: 'madera', nivel: 'middle', porcentaje: 20, descripcion: 'Alquitrán de abedul ahumado' },
            { nombre: 'jengibre', tipo: 'nota', subtipo: 'especia', nivel: 'top', porcentaje: 15, descripcion: 'Jengibre fresco especiado' },
            { nombre: 'oud', tipo: 'nota', subtipo: 'madera', nivel: 'base', porcentaje: 20, descripcion: 'Oud oscuro profundo' },
            { nombre: 'haba tonka', tipo: 'nota', subtipo: 'gourmand', nivel: 'base', porcentaje: 10, descripcion: 'Haba tonka vainillosa' }
        ]
    }
];
