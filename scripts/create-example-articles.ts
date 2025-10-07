import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const articulosEjemplo = [
  {
    titulo: "Congreso aprueba reforma tributaria para 2025",
    url: "https://example.com/reforma-tributaria",
    contenido: "El Congreso de la República aprobó la nueva reforma tributaria que incluye cambios en el impuesto a la renta y nuevos incentivos para las empresas. La medida busca aumentar la recaudación fiscal y mejorar la competitividad del país.",
    fuente: "El Comercio",
    categoriaId: null // Se determinará automáticamente
  },
  {
    titulo: "Alianza Lima clasifica a la final del campeonato",
    url: "https://example.com/alianza-lima-final",
    contenido: "Alianza Lima logró clasificar a la final del campeonato peruano tras vencer 2-1 a Universitario. El equipo blanquiazul demostró gran nivel de juego y ahora buscará el título nacional.",
    fuente: "Depor",
    categoriaId: null
  },
  {
    titulo: "Yahaira lanza nuevo tema musical",
    url: "https://example.com/yahaira-nuevo-tema",
    contenido: "La cantante peruana Yahaira presentó su nuevo tema musical 'Amor Eterno' que ya está disponible en todas las plataformas digitales. El video musical fue grabado en las playas de Paracas.",
    fuente: "El Popular",
    categoriaId: null
  },
  {
    titulo: "IA revoluciona la educación en universidades peruanas",
    url: "https://example.com/ia-educacion-peru",
    contenido: "Las universidades peruanas están implementando inteligencia artificial para mejorar la experiencia educativa. La UNSA lidera un proyecto que utiliza IA para personalizar el aprendizaje de los estudiantes.",
    fuente: "Andina",
    categoriaId: null
  },
  {
    titulo: "ONU aprueba nuevo acuerdo global sobre cambio climático",
    url: "https://example.com/onu-cambio-climatico",
    contenido: "La Organización de las Naciones Unidas aprobó un nuevo acuerdo global para combatir el cambio climático. El acuerdo incluye compromisos de reducción de emisiones y financiamiento para países en desarrollo.",
    fuente: "BBC Mundo",
    categoriaId: null
  },
  {
    titulo: "Nuevas medidas contra el dengue en Lima",
    url: "https://example.com/dengue-lima",
    contenido: "El Ministerio de Salud anunció nuevas medidas para combatir el dengue en Lima. Se implementarán campañas de fumigación y educación sobre prevención en los distritos más afectados.",
    fuente: "RPP",
    categoriaId: null
  },
  {
    titulo: "Festival de la Virgen de la Candelaria en Puno",
    url: "https://example.com/festival-candelaria",
    contenido: "Se celebró el tradicional Festival de la Virgen de la Candelaria en Puno con más de 200 grupos de danza. El evento cultural más importante del Altiplano peruano atrajo a miles de turistas.",
    fuente: "La República",
    categoriaId: null
  },
  {
    titulo: "Incendio en Miraflores: bomberos controlan el fuego",
    url: "https://example.com/incendio-miraflores",
    contenido: "Los bomberos lograron controlar el incendio que se registró en un edificio de Miraflores. No se reportaron víctimas fatales, pero sí varios heridos que fueron trasladados al hospital.",
    fuente: "América TV",
    categoriaId: null
  },
  {
    titulo: "Contaminación en el Lago Titicaca preocupa a autoridades",
    url: "https://example.com/contaminacion-titicaca",
    contenido: "Las autoridades ambientales expresaron su preocupación por los niveles de contaminación en el Lago Titicaca. Se implementarán medidas de conservación y limpieza del ecosistema.",
    fuente: "El Peruano",
    categoriaId: null
  },
  {
    titulo: "Startup puneña crea app para reciclaje",
    url: "https://example.com/startup-reciclaje",
    contenido: "Una startup de Puno desarrolló una aplicación móvil que facilita el reciclaje en la ciudad. La app conecta a recicladores con ciudadanos y promueve la economía circular.",
    fuente: "Startup Perú",
    categoriaId: null
  }
];

async function crearArticulosEjemplo() {
  try {
    console.log('🔄 Creando artículos de ejemplo...');
    
    // Obtener todas las categorías para la clasificación automática
    const categorias = await prisma.categoria.findMany();
    console.log(`✅ Se encontraron ${categorias.length} categorías`);
    
    let creados = 0;
    
    for (const articulo of articulosEjemplo) {
      try {
        // Determinar categoría automáticamente
        const categoriaId = await determinarCategoria(articulo.titulo, articulo.contenido, categorias);
        
        await prisma.articulo.create({
          data: {
            titulo: articulo.titulo,
            url: articulo.url,
            contenido: articulo.contenido,
            fuente: articulo.fuente,
            categoriaId: categoriaId
          }
        });
        
        const categoriaNombre = categoriaId ? 
          categorias.find(c => c.id === categoriaId)?.nombre || 'Sin categoría' : 
          'Sin categoría';
        
        console.log(`✅ Artículo creado: "${articulo.titulo}" → ${categoriaNombre}`);
        creados++;
        
      } catch (error) {
        console.error(`❌ Error al crear artículo "${articulo.titulo}":`, error);
      }
    }
    
    console.log(`🎉 ¡Se crearon ${creados} artículos de ejemplo!`);
    
  } catch (error) {
    console.error('❌ Error al crear artículos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Función para determinar categoría automáticamente
async function determinarCategoria(titulo: string, contenido: string, categorias: any[]): Promise<string | null> {
  try {
    const textoCompleto = `${titulo} ${contenido}`.toLowerCase();
    
    let mejorCategoria = null;
    let mejorPuntuacion = 0;
    
    for (const categoria of categorias) {
      if (!categoria.palabrasClave) continue;
      
      const palabrasClave = JSON.parse(categoria.palabrasClave);
      let puntuacion = 0;
      
      // Contar coincidencias de palabras clave
      for (const palabra of palabrasClave) {
        const regex = new RegExp(`\\b${palabra.toLowerCase()}\\b`, 'gi');
        const coincidencias = (textoCompleto.match(regex) || []).length;
        puntuacion += coincidencias;
      }
      
      // Si hay coincidencias y es la mejor puntuación hasta ahora
      if (puntuacion > mejorPuntuacion) {
        mejorPuntuacion = puntuacion;
        mejorCategoria = categoria.id;
      }
    }
    
    // Solo devolver categoría si hay al menos 1 coincidencia
    return mejorPuntuacion > 0 ? mejorCategoria : null;
    
  } catch (error) {
    console.error('Error al determinar categoría:', error);
    return null;
  }
}

crearArticulosEjemplo();
