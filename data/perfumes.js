/**
 * @fileoverview Datos de perfumes y configuración del sistema
 * Contiene catálogo de colores, opciones de filtro, perfumes de ejemplo
 * y funciones de cálculo para métricas derivadas (sensaciones, vectorPerfil, scores).
 *
 * Para agregar un nuevo perfume, añade un objeto al array PERFUMES_DATA
 * y la función calculatePerfumeMetrics() generará automáticamente las métricas derivadas.
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
 * Definición de cálculos de sensaciones basados en subtipos de notas
 * @constant {Object}
 */
const SENSATION_WEIGHTS = {
    frescura: { citrico: 1.0, acuatico: 1.0, verde: 0.8, floral: 0.2 },
    dulzura: { gourmand: 1.0, frutal: 0.8, floral: 0.3, resina: 0.2 },
    calidez: { madera: 0.8, resina: 1.0, especia: 0.9, animalico: 0.5 },
    intensidad: {},
    elegancia: { floral: 0.7, resina: 0.6, madera: 0.4, especia: 0.2 },
    sensualidad: { gourmand: 0.7, animalico: 0.9, resina: 0.5, especia: 0.4, floral: 0.3 }
};

/**
 * Mapeo de niveles de notas a duración en horas
 * @constant {Object}
 */
const NOTE_DURATION = {
    top:    { start: 0, end: 2, peak: 0.5 },
    middle: { start: 1, end: 6, peak: 3 },
    base:   { start: 3, end: 12, peak: 7 }
};

/**
 * Mapeo de strings a scores numéricos 1-5
 * @constant {Object}
 */
const SCORE_MAP = {
    longevidad: { corta: 1, moderada: 3, media: 3, alta: 5, larga: 5 },
    proyeccion: { baja: 1, moderada: 3, media: 3, alta: 5 }
};

/**
 * Datos base de perfumes (sin métricas derivadas)
 * @constant {Array}
 */
const PERFUMES_DATA = [
    {
        id: 1, nombre: 'Bleu Intense', marca: 'Maison Fictice',
        familia: 'amaderado', ocasion: ['oficina', 'diario'], estilo: ['elegante', 'sofisticado'],
        genero: 'masculino', temporada: ['primavera', 'otono'],
        rating: 4, year: 2023, concentracion: 'eau de parfum',
        description: 'Fragancia amaderada intensa que combina frescura cítrica con profundidad del cedro y sándalo.',
        longevidad: 'alta', proyeccion: 'media', sillage: 'moderado',
        imagen: 'https://placehold.co/400x500/1a1a2e/6c5ce7?text=Bleu+Intense',
        notas: [
            { nombre: 'bergamota', subtipo: 'citrico', nivel: 'top', porcentaje: 25, descripcion: 'Frescura vibrante' },
            { nombre: 'limon', subtipo: 'citrico', nivel: 'top', porcentaje: 15, descripcion: 'Brillo cítrico' },
            { nombre: 'cedro', subtipo: 'madera', nivel: 'middle', porcentaje: 30, descripcion: 'Corazón amaderado' },
            { nombre: 'sandalos', subtipo: 'madera', nivel: 'base', porcentaje: 20, descripcion: 'Suavidad cremosa' },
            { nombre: 'vetiver', subtipo: 'madera', nivel: 'base', porcentaje: 10, descripcion: 'Toque terroso' }
        ]
    },
    {
        id: 2, nombre: 'Rose Mystique', marca: 'Parfums du Rêve',
        familia: 'floral', ocasion: ['noche', 'cita', 'formal'], estilo: ['elegante', 'sexy', 'sofisticado'],
        genero: 'femenino', temporada: ['primavera', 'invierno'],
        rating: 5, year: 2022, concentracion: 'parfum',
        description: 'Bouquet floral misterioso donde la rosa turca y el jazmín se entrelazan con frambuesa.',
        longevidad: 'larga', proyeccion: 'alta', sillage: 'intenso',
        imagen: 'https://placehold.co/400x500/1a1a2e/FF85A2?text=Rose+Mystique',
        notas: [
            { nombre: 'rosa', subtipo: 'floral', nivel: 'middle', porcentaje: 35, descripcion: 'Rosa turca opulenta' },
            { nombre: 'jazmin', subtipo: 'floral', nivel: 'middle', porcentaje: 25, descripcion: 'Jazmín sambac' },
            { nombre: 'frambuesa', subtipo: 'frutal', nivel: 'top', porcentaje: 20, descripcion: 'Dulzura frutal' },
            { nombre: 'almizcle', subtipo: 'animalico', nivel: 'base', porcentaje: 15, descripcion: 'Base sensual' },
            { nombre: 'ambar', subtipo: 'resina', nivel: 'base', porcentaje: 5, descripcion: 'Resina dorada' }
        ]
    },
    {
        id: 3, nombre: 'Vanille Noire', marca: 'Oud Collection',
        familia: 'oriental', ocasion: ['noche', 'formal', 'fiesta'], estilo: ['misterioso', 'sexy', 'sofisticado'],
        genero: 'unisex', temporada: ['invierno', 'otono'],
        rating: 5, year: 2021, concentracion: 'eau de parfum',
        description: 'Dulzura gourmand de la vainilla con la oscuridad del oud. Noches de invierno junto a la chimenea.',
        longevidad: 'larga', proyeccion: 'alta', sillage: 'intenso',
        imagen: 'https://placehold.co/400x500/1a1a2e/E8A87C?text=Vanille+Noire',
        notas: [
            { nombre: 'vainilla', subtipo: 'gourmand', nivel: 'base', porcentaje: 30, descripcion: 'Vainilla de Madagascar' },
            { nombre: 'haba tonka', subtipo: 'gourmand', nivel: 'base', porcentaje: 20, descripcion: 'Dulzura almondrada' },
            { nombre: 'canela', subtipo: 'especia', nivel: 'middle', porcentaje: 15, descripcion: 'Calidez especiada' },
            { nombre: 'oud', subtipo: 'madera', nivel: 'base', porcentaje: 25, descripcion: 'Madera de agar' },
            { nombre: 'cardamomo', subtipo: 'especia', nivel: 'top', porcentaje: 10, descripcion: 'Especia aromática' }
        ]
    },
    {
        id: 4, nombre: 'Ocean Breeze', marca: 'Aqua Marine',
        familia: 'acuatico', ocasion: ['diario', 'casual', 'deporte'], estilo: ['deportivo', 'juvenil', 'moderno'],
        genero: 'unisex', temporada: ['verano', 'primavera'],
        rating: 3, year: 2024, concentracion: 'eau de toilette',
        description: 'Frescura marina capturada. Notas acuáticas y verdes que transportan a la brisa del océano.',
        longevidad: 'moderada', proyeccion: 'media', sillage: 'ligero',
        imagen: 'https://placehold.co/400x500/1a1a2e/4DA8DA?text=Ocean+Breeze',
        notas: [
            { nombre: 'notas marinas', subtipo: 'acuatico', nivel: 'top', porcentaje: 35, descripcion: 'Acorde marino' },
            { nombre: 'bergamota', subtipo: 'citrico', nivel: 'top', porcentaje: 20, descripcion: 'Frescura mediterránea' },
            { nombre: 'menta', subtipo: 'verde', nivel: 'middle', porcentaje: 15, descripcion: 'Mentolado refrescante' },
            { nombre: 'te verde', subtipo: 'verde', nivel: 'middle', porcentaje: 20, descripcion: 'Té verde delicado' },
            { nombre: 'cashmere wood', subtipo: 'madera', nivel: 'base', porcentaje: 10, descripcion: 'Madera suave' }
        ]
    },
    {
        id: 5, nombre: 'Epic Spice', marca: 'Oriental Nights',
        familia: 'oriental', ocasion: ['noche', 'formal'], estilo: ['misterioso', 'elegante', 'clasico'],
        genero: 'masculino', temporada: ['invierno', 'otono'],
        rating: 4, year: 2020, concentracion: 'parfum',
        description: 'Odisea especiada desde la pimienta negra hasta el incienso sagrado. Carácter y misterio.',
        longevidad: 'larga', proyeccion: 'alta', sillage: 'intenso',
        imagen: 'https://placehold.co/400x500/1a1a2e/C1440E?text=Epic+Spice',
        notas: [
            { nombre: 'pimienta', subtipo: 'especia', nivel: 'top', porcentaje: 20, descripcion: 'Pimienta negra' },
            { nombre: 'azafran', subtipo: 'especia', nivel: 'middle', porcentaje: 25, descripcion: 'Azafrán dorado' },
            { nombre: 'incienso', subtipo: 'resina', nivel: 'base', porcentaje: 20, descripcion: 'Humo sagrado' },
            { nombre: 'tabaco', subtipo: 'animalico', nivel: 'base', porcentaje: 20, descripcion: 'Tabaco ahumado' },
            { nombre: 'cuero', subtipo: 'animalico', nivel: 'base', porcentaje: 15, descripcion: 'Cuero curtido' }
        ]
    },
    {
        id: 6, nombre: 'Fresh Citrus', marca: 'Summer Vibes',
        familia: 'citrico', ocasion: ['diario', 'casual', 'deporte', 'oficina'], estilo: ['juvenil', 'moderno', 'deportivo'],
        genero: 'unisex', temporada: ['verano', 'primavera'],
        rating: 3, year: 2024, concentracion: 'eau de toilette',
        description: 'Explosión cítrica perfecta para el calor. Sinfonía de naranjas, mandarinas y limones.',
        longevidad: 'corta', proyeccion: 'media', sillage: 'ligero',
        imagen: 'https://placehold.co/400x500/1a1a2e/FFD700?text=Fresh+Citrus',
        notas: [
            { nombre: 'naranja', subtipo: 'citrico', nivel: 'top', porcentaje: 30, descripcion: 'Naranja sanguina' },
            { nombre: 'mandarina', subtipo: 'citrico', nivel: 'top', porcentaje: 25, descripcion: 'Mandarina italiana' },
            { nombre: 'toronja', subtipo: 'citrico', nivel: 'top', porcentaje: 20, descripcion: 'Toronja amarga' },
            { nombre: 'limon', subtipo: 'citrico', nivel: 'top', porcentaje: 15, descripcion: 'Limón de Sicilia' },
            { nombre: 'romero', subtipo: 'verde', nivel: 'middle', porcentaje: 10, descripcion: 'Romero herbáceo' }
        ]
    },
    {
        id: 7, nombre: 'Velvet Oud', marca: 'Oud Collection',
        familia: 'oriental', ocasion: ['noche', 'formal', 'cita'], estilo: ['misterioso', 'sofisticado', 'sexy'],
        genero: 'unisex', temporada: ['invierno'],
        rating: 5, year: 2019, concentracion: 'parfum',
        description: 'Oud puro con toques de rosa y especias. Joya de la perfumería oriental.',
        longevidad: 'larga', proyeccion: 'alta', sillage: 'intenso',
        imagen: 'https://placehold.co/400x500/1a1a2e/8B5E3C?text=Velvet+Oud',
        notas: [
            { nombre: 'oud', subtipo: 'madera', nivel: 'base', porcentaje: 35, descripcion: 'Oud camboyano' },
            { nombre: 'rosa', subtipo: 'floral', nivel: 'middle', porcentaje: 20, descripcion: 'Rosa búlgara' },
            { nombre: 'azafran', subtipo: 'especia', nivel: 'top', porcentaje: 15, descripcion: 'Azafrán iraní' },
            { nombre: 'sandalos', subtipo: 'madera', nivel: 'base', porcentaje: 20, descripcion: 'Sándalo cremoso' },
            { nombre: 'almizcle', subtipo: 'animalico', nivel: 'base', porcentaje: 10, descripcion: 'Almizcle blanco' }
        ]
    },
    {
        id: 8, nombre: 'Jardin Secret', marca: 'Parfums du Rêve',
        familia: 'floral', ocasion: ['cita', 'diario', 'formal'], estilo: ['elegante', 'romantico', 'clasico'],
        genero: 'femenino', temporada: ['primavera', 'verano'],
        rating: 4, year: 2023, concentracion: 'eau de parfum',
        description: 'Jardín floral secreto donde jazmines, violetas y magnolias florecen.',
        longevidad: 'moderada', proyeccion: 'media', sillage: 'moderado',
        imagen: 'https://placehold.co/400x500/1a1a2e/FF85A2?text=Jardin+Secret',
        notas: [
            { nombre: 'jazmin', subtipo: 'floral', nivel: 'middle', porcentaje: 30, descripcion: 'Jazmín grandiflorum' },
            { nombre: 'violeta', subtipo: 'floral', nivel: 'middle', porcentaje: 20, descripcion: 'Violeta polvosa' },
            { nombre: 'pera', subtipo: 'frutal', nivel: 'top', porcentaje: 25, descripcion: 'Pera jugosa' },
            { nombre: 'magnolia', subtipo: 'floral', nivel: 'middle', porcentaje: 15, descripcion: 'Magnolia fresca' },
            { nombre: 'almizcle', subtipo: 'animalico', nivel: 'base', porcentaje: 10, descripcion: 'Almizcle suave' }
        ]
    },
    {
        id: 9, nombre: 'Tobacco Vanille', marca: 'Maison Fictice',
        familia: 'oriental', ocasion: ['noche', 'formal', 'oficina'], estilo: ['elegante', 'sofisticado', 'clasico'],
        genero: 'masculino', temporada: ['invierno', 'otono'],
        rating: 5, year: 2018, concentracion: 'eau de parfum',
        description: 'Tabaco aromático con vainilla dulce y cacao. Clásico moderno tipo biblioteca inglesa.',
        longevidad: 'larga', proyeccion: 'alta', sillage: 'intenso',
        imagen: 'https://placehold.co/400x500/1a1a2e/5C4033?text=Tobacco+Vanille',
        notas: [
            { nombre: 'tabaco', subtipo: 'animalico', nivel: 'base', porcentaje: 30, descripcion: 'Tabaco de pipa' },
            { nombre: 'vainilla', subtipo: 'gourmand', nivel: 'base', porcentaje: 25, descripcion: 'Vainilla bourbon' },
            { nombre: 'cacao', subtipo: 'gourmand', nivel: 'middle', porcentaje: 15, descripcion: 'Cacao amargo' },
            { nombre: 'especias secas', subtipo: 'especia', nivel: 'top', porcentaje: 20, descripcion: 'Mezcla cálida' },
            { nombre: 'haba tonka', subtipo: 'gourmand', nivel: 'base', porcentaje: 10, descripcion: 'Haba tonka' }
        ]
    },
    {
        id: 10, nombre: 'Acqua di Gioia', marca: 'Aqua Marine',
        familia: 'acuatico', ocasion: ['diario', 'casual'], estilo: ['juvenil', 'moderno'],
        genero: 'femenino', temporada: ['verano', 'primavera'],
        rating: 4, year: 2023, concentracion: 'eau de parfum',
        description: 'Frescura acuática femenina. Brisa marina en un día soleado.',
        longevidad: 'moderada', proyeccion: 'media', sillage: 'moderado',
        imagen: 'https://placehold.co/400x500/1a1a2e/4DA8DA?text=Acqua+Gioia',
        notas: [
            { nombre: 'limon', subtipo: 'citrico', nivel: 'top', porcentaje: 20, descripcion: 'Limón amalfitano' },
            { nombre: 'menta', subtipo: 'verde', nivel: 'top', porcentaje: 15, descripcion: 'Menta helada' },
            { nombre: 'jazmin', subtipo: 'floral', nivel: 'middle', porcentaje: 25, descripcion: 'Jazmín solar' },
            { nombre: 'notas marinas', subtipo: 'acuatico', nivel: 'middle', porcentaje: 25, descripcion: 'Acuático cristalino' },
            { nombre: 'cedro', subtipo: 'madera', nivel: 'base', porcentaje: 15, descripcion: 'Cedro limpio' }
        ]
    },
    {
        id: 11, nombre: 'Santal Royal', marca: 'Oud Collection',
        familia: 'amaderado', ocasion: ['noche', 'formal', 'fiesta'], estilo: ['elegante', 'misterioso', 'sofisticado'],
        genero: 'unisex', temporada: ['invierno', 'otono'],
        rating: 5, year: 2020, concentracion: 'parfum',
        description: 'Sándalo real en máxima expresión con oud, rosa y cuero. Majestuoso.',
        longevidad: 'larga', proyeccion: 'alta', sillage: 'intenso',
        imagen: 'https://placehold.co/400x500/1a1a2e/8B5E3C?text=Santal+Royal',
        notas: [
            { nombre: 'sandalos', subtipo: 'madera', nivel: 'base', porcentaje: 30, descripcion: 'Sándalo Mysore' },
            { nombre: 'rosa', subtipo: 'floral', nivel: 'middle', porcentaje: 15, descripcion: 'Rosa damascena' },
            { nombre: 'oud', subtipo: 'madera', nivel: 'base', porcentaje: 25, descripcion: 'Oud ahumado' },
            { nombre: 'cuero', subtipo: 'animalico', nivel: 'base', porcentaje: 20, descripcion: 'Cuero refinado' },
            { nombre: 'especias secas', subtipo: 'especia', nivel: 'top', porcentaje: 10, descripcion: 'Especias orientales' }
        ]
    },
    {
        id: 12, nombre: 'Light Blue', marca: 'Summer Vibes',
        familia: 'citrico', ocasion: ['diario', 'casual', 'deporte'], estilo: ['juvenil', 'clasico'],
        genero: 'femenino', temporada: ['verano'],
        rating: 4, year: 2022, concentracion: 'eau de toilette',
        description: 'Frescura del Mediterráneo. Manzana crujiente, rosa blanca y cedro.',
        longevidad: 'moderada', proyeccion: 'media', sillage: 'ligero',
        imagen: 'https://placehold.co/400x500/1a1a2e/FFD700?text=Light+Blue',
        notas: [
            { nombre: 'manzana', subtipo: 'frutal', nivel: 'top', porcentaje: 25, descripcion: 'Manzana verde' },
            { nombre: 'cedro', subtipo: 'madera', nivel: 'base', porcentaje: 20, descripcion: 'Cedro seco' },
            { nombre: 'bambu', subtipo: 'verde', nivel: 'middle', porcentaje: 15, descripcion: 'Bambú fresco' },
            { nombre: 'rosa blanca', subtipo: 'floral', nivel: 'middle', porcentaje: 25, descripcion: 'Rosa blanca' },
            { nombre: 'limon', subtipo: 'citrico', nivel: 'top', porcentaje: 15, descripcion: 'Limón brillante' }
        ]
    },
    {
        id: 13, nombre: 'Noir Extreme', marca: 'Maison Fictice',
        familia: 'oriental', ocasion: ['noche', 'cita', 'formal'], estilo: ['sexy', 'misterioso', 'elegante'],
        genero: 'masculino', temporada: ['invierno', 'otono'],
        rating: 4, year: 2021, concentracion: 'eau de parfum',
        description: 'Oscuridad seductora con cardamomo, vainilla y ámbar. Nocturna y misteriosa.',
        longevidad: 'larga', proyeccion: 'alta', sillage: 'moderado',
        imagen: 'https://placehold.co/400x500/1a1a2e/3d2d94?text=Noir+Extreme',
        notas: [
            { nombre: 'cardamomo', subtipo: 'especia', nivel: 'top', porcentaje: 20, descripcion: 'Cardamomo verde' },
            { nombre: 'nuez moscada', subtipo: 'especia', nivel: 'middle', porcentaje: 15, descripcion: 'Nuez moscada' },
            { nombre: 'vainilla', subtipo: 'gourmand', nivel: 'base', porcentaje: 25, descripcion: 'Vainilla negra' },
            { nombre: 'ambar', subtipo: 'resina', nivel: 'base', porcentaje: 20, descripcion: 'Ámbar dorado' },
            { nombre: 'sandalos', subtipo: 'madera', nivel: 'base', porcentaje: 20, descripcion: 'Sándalo lechoso' }
        ]
    },
    {
        id: 14, nombre: 'Flora Gorgeous', marca: 'Parfums du Rêve',
        familia: 'floral', ocasion: ['diario', 'cita', 'casual'], estilo: ['elegante', 'juvenil', 'moderno'],
        genero: 'femenino', temporada: ['primavera', 'verano'],
        rating: 3, year: 2024, concentracion: 'eau de toilette',
        description: 'Floral moderno con gardenia, rosa y durazno. Fresco y juvenil.',
        longevidad: 'moderada', proyeccion: 'media', sillage: 'ligero',
        imagen: 'https://placehold.co/400x500/1a1a2e/FF85A2?text=Flora+Gorgeous',
        notas: [
            { nombre: 'gardenia', subtipo: 'floral', nivel: 'middle', porcentaje: 30, descripcion: 'Gardenia tropical' },
            { nombre: 'rosa', subtipo: 'floral', nivel: 'middle', porcentaje: 20, descripcion: 'Rosa luminosa' },
            { nombre: 'durazno', subtipo: 'frutal', nivel: 'top', porcentaje: 20, descripcion: 'Durazno dulce' },
            { nombre: 'mandarina', subtipo: 'citrico', nivel: 'top', porcentaje: 15, descripcion: 'Mandarina dulce' },
            { nombre: 'cedro', subtipo: 'madera', nivel: 'base', porcentaje: 15, descripcion: 'Cedro suave' }
        ]
    },
    {
        id: 15, nombre: "Terre d'Orient", marca: 'Oriental Nights',
        familia: 'amaderado', ocasion: ['oficina', 'diario', 'formal'], estilo: ['sofisticado', 'clasico', 'elegante'],
        genero: 'masculino', temporada: ['otono', 'primavera'],
        rating: 4, year: 2022, concentracion: 'eau de parfum',
        description: 'Terroso y elegante con naranja, pimienta y vetiver. Masculino con carácter.',
        longevidad: 'larga', proyeccion: 'moderada', sillage: 'moderado',
        imagen: 'https://placehold.co/400x500/1a1a2e/8B5E3C?text=Terre+Orient',
        notas: [
            { nombre: 'naranja', subtipo: 'citrico', nivel: 'top', porcentaje: 20, descripcion: 'Naranja sanguina' },
            { nombre: 'pimienta', subtipo: 'especia', nivel: 'top', porcentaje: 15, descripcion: 'Pimienta rosa' },
            { nombre: 'vetiver', subtipo: 'madera', nivel: 'base', porcentaje: 30, descripcion: 'Vetiver terroso' },
            { nombre: 'cedro', subtipo: 'madera', nivel: 'base', porcentaje: 25, descripcion: 'Cedro de Virginia' },
            { nombre: 'benjui', subtipo: 'resina', nivel: 'base', porcentaje: 10, descripcion: 'Benjuí balsámico' }
        ]
    },
    {
        id: 16, nombre: 'Cherry Desire', marca: 'Oud Collection',
        familia: 'gourmand', ocasion: ['noche', 'cita', 'fiesta'], estilo: ['sexy', 'moderno', 'juvenil'],
        genero: 'femenino', temporada: ['invierno', 'otono'],
        rating: 4, year: 2023, concentracion: 'eau de parfum',
        description: 'Cereza negra con almendra y vainilla. Gourmand seductor y adictivo.',
        longevidad: 'moderada', proyeccion: 'alta', sillage: 'intenso',
        imagen: 'https://placehold.co/400x500/1a1a2e/FF6B6B?text=Cherry+Desire',
        notas: [
            { nombre: 'cereza', subtipo: 'frutal', nivel: 'top', porcentaje: 30, descripcion: 'Cereza negra' },
            { nombre: 'almendra', subtipo: 'gourmand', nivel: 'middle', porcentaje: 20, descripcion: 'Almendra cremosa' },
            { nombre: 'vainilla', subtipo: 'gourmand', nivel: 'base', porcentaje: 25, descripcion: 'Vainilla envolvente' },
            { nombre: 'rosa turca', subtipo: 'floral', nivel: 'middle', porcentaje: 15, descripcion: 'Rosa turca' },
            { nombre: 'sandalos', subtipo: 'madera', nivel: 'base', porcentaje: 10, descripcion: 'Sándalo cremoso' }
        ]
    },
    {
        id: 17, nombre: 'Sport Extreme', marca: 'Summer Vibes',
        familia: 'fresco', ocasion: ['deporte', 'diario', 'casual'], estilo: ['deportivo', 'juvenil', 'moderno'],
        genero: 'masculino', temporada: ['verano', 'primavera'],
        rating: 3, year: 2024, concentracion: 'eau de toilette',
        description: 'Energía pura. Lima, jengibre y notas marinas activan los sentidos.',
        longevidad: 'moderada', proyeccion: 'moderada', sillage: 'ligero',
        imagen: 'https://placehold.co/400x500/1a1a2e/4ECB71?text=Sport+Extreme',
        notas: [
            { nombre: 'lima', subtipo: 'citrico', nivel: 'top', porcentaje: 25, descripcion: 'Lima vibrante' },
            { nombre: 'jengibre', subtipo: 'especia', nivel: 'top', porcentaje: 15, descripcion: 'Jengibre fresco' },
            { nombre: 'te verde', subtipo: 'verde', nivel: 'middle', porcentaje: 20, descripcion: 'Té verde' },
            { nombre: 'notas marinas', subtipo: 'acuatico', nivel: 'middle', porcentaje: 25, descripcion: 'Acuático fresco' },
            { nombre: 'musk sintetico', subtipo: 'sintetico', nivel: 'base', porcentaje: 15, descripcion: 'Musk limpio' }
        ]
    },
    {
        id: 18, nombre: 'Ambre Mystique', marca: 'Oriental Nights',
        familia: 'oriental', ocasion: ['noche', 'formal', 'cita'], estilo: ['misterioso', 'sofisticado', 'sexy'],
        genero: 'unisex', temporada: ['invierno'],
        rating: 5, year: 2020, concentracion: 'parfum',
        description: 'Ámbar puro con mirra e incienso. Resina divina como abrazo cálido.',
        longevidad: 'larga', proyeccion: 'alta', sillage: 'intenso',
        imagen: 'https://placehold.co/400x500/1a1a2e/8B6914?text=Ambre+Mystique',
        notas: [
            { nombre: 'ambar', subtipo: 'resina', nivel: 'base', porcentaje: 30, descripcion: 'Ámbar gris' },
            { nombre: 'mirra', subtipo: 'resina', nivel: 'base', porcentaje: 20, descripcion: 'Mirra antigua' },
            { nombre: 'incienso', subtipo: 'resina', nivel: 'middle', porcentaje: 15, descripcion: 'Incienso de Omán' },
            { nombre: 'vainilla', subtipo: 'gourmand', nivel: 'base', porcentaje: 20, descripcion: 'Vainilla suave' },
            { nombre: 'bergamota', subtipo: 'citrico', nivel: 'top', porcentaje: 15, descripcion: 'Bergamota' }
        ]
    },
    {
        id: 19, nombre: 'Green Escape', marca: 'Aqua Marine',
        familia: 'verde', ocasion: ['diario', 'casual', 'oficina'], estilo: ['moderno', 'juvenil', 'deportivo'],
        genero: 'unisex', temporada: ['primavera', 'verano'],
        rating: 3, year: 2024, concentracion: 'eau de toilette',
        description: 'Escape verde con albahaca, té verde y pomelo. Conexión con la naturaleza.',
        longevidad: 'moderada', proyeccion: 'moderada', sillage: 'ligero',
        imagen: 'https://placehold.co/400x500/1a1a2e/4ECB71?text=Green+Escape',
        notas: [
            { nombre: 'albahaca', subtipo: 'verde', nivel: 'top', porcentaje: 20, descripcion: 'Albahaca fresca' },
            { nombre: 'pomelo', subtipo: 'citrico', nivel: 'top', porcentaje: 25, descripcion: 'Pomelo rosado' },
            { nombre: 'te verde', subtipo: 'verde', nivel: 'middle', porcentaje: 25, descripcion: 'Té matcha' },
            { nombre: 'vetiver', subtipo: 'madera', nivel: 'base', porcentaje: 20, descripcion: 'Vetiver verde' },
            { nombre: 'musgo', subtipo: 'verde', nivel: 'base', porcentaje: 10, descripcion: 'Musgo terroso' }
        ]
    },
    {
        id: 20, nombre: 'Cuero Real', marca: 'Maison Fictice',
        familia: 'amaderado', ocasion: ['noche', 'formal'], estilo: ['clasico', 'elegante', 'misterioso'],
        genero: 'masculino', temporada: ['otono', 'invierno'],
        rating: 4, year: 2019, concentracion: 'eau de parfum',
        description: 'Cuero auténtico con abedul y oud. Clásico masculino tipo sastrería londinense.',
        longevidad: 'larga', proyeccion: 'moderada', sillage: 'moderado',
        imagen: 'https://placehold.co/400x500/1a1a2e/5C4033?text=Cuero+Real',
        notas: [
            { nombre: 'cuero', subtipo: 'animalico', nivel: 'base', porcentaje: 35, descripcion: 'Cuero ruso' },
            { nombre: 'abedul', subtipo: 'madera', nivel: 'middle', porcentaje: 20, descripcion: 'Alquitrán ahumado' },
            { nombre: 'jengibre', subtipo: 'especia', nivel: 'top', porcentaje: 15, descripcion: 'Jengibre especiado' },
            { nombre: 'oud', subtipo: 'madera', nivel: 'base', porcentaje: 20, descripcion: 'Oud oscuro' },
            { nombre: 'haba tonka', subtipo: 'gourmand', nivel: 'base', porcentaje: 10, descripcion: 'Haba tonka' }
        ]
    }
];

/**
 * Calcula las métricas derivadas de un perfume basándose en sus notas
 * @param {Object} perfume - Perfume con notas base
 * @returns {Object} Perfume con métricas completas
 */
function calculatePerfumeMetrics(perfume) {
    const p = { ...perfume };

    // Agrupar notas por subtipo
    const subtipoTotals = {};
    const nivelTotals = { top: 0, middle: 0, base: 0 };
    p.notas.forEach(n => {
        subtipoTotals[n.subtipo] = (subtipoTotals[n.subtipo] || 0) + n.porcentaje;
        nivelTotals[n.nivel] += n.porcentaje;
    });

    // Calcular sensaciones (0-100)
    p.sensaciones = {};
    Object.entries(SENSATION_WEIGHTS).forEach(([sensacion, weights]) => {
        let score = 0;
        let maxPossible = 0;
        Object.entries(weights).forEach(([subtipo, weight]) => {
            score += (subtipoTotals[subtipo] || 0) * weight;
            maxPossible += 100 * weight;
        });
        p.sensaciones[sensacion] = maxPossible > 0 ? Math.round((score / maxPossible) * 100) : 0;
    });

    // Calcular intensidad basada en proporción base+middle
    const totalPct = p.notas.reduce((sum, n) => sum + n.porcentaje, 0);
    const baseMiddlePct = nivelTotals.base + nivelTotals.middle;
    p.sensaciones.intensidad = Math.round((baseMiddlePct / totalPct) * 100);

    // Vector de perfil para recomendaciones
    p.vectorPerfil = {
        frescura: p.sensaciones.frescura,
        dulzura: p.sensaciones.dulzura,
        calidez: p.sensaciones.calidez,
        intensidad: p.sensaciones.intensidad
    };

    // Scores normalizados 1-5
    p.longevityScore = SCORE_MAP.longevidad[p.longevidad] || 3;
    p.projectionScore = SCORE_MAP.proyeccion[p.proyeccion] || 3;
    p.massAppeal = p.genero === 'unisex'
        ? Math.min(5, Math.round((p.rating + 1) / 2 * 2))
        : p.rating;

    // Duración de notas
    p.notas = p.notas.map(n => {
        const dur = NOTE_DURATION[n.nivel];
        return {
            ...n,
            duracionHoras: dur.end - dur.start,
            intensidadPorTiempo: Math.round(n.porcentaje * 0.8)
        };
    });

    return p;
}

/**
 * Array de perfumes con métricas derivadas calculadas
 * @constant {Array}
 */
const PERFUMES = PERFUMES_DATA.map(calculatePerfumeMetrics);
