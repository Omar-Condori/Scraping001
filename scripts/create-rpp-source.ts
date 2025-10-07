import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function crearFuenteRPP() {
  try {
    console.log('🔄 Creando fuente RPP...');
    
    // Buscar si ya existe la fuente RPP
    const fuenteExistente = await prisma.fuente.findUnique({
      where: { nombre: 'RPP Noticias' }
    });
    
    if (fuenteExistente) {
      console.log('✅ Fuente RPP ya existe');
      return;
    }
    
    // Crear la fuente RPP
    const selectoresRPP = {
      titulo: 'h2 a, .story-title a, .news-title a',
      contenido: '.story-content p, .news-content p, .article-content p',
      imagen: '.story-image img, .news-image img, .article-image img',
      enlaces: '.story-list a, .news-list a, .article-list a',
      paginacion: '.pagination a, .load-more, .ver-mas'
    };
    
    const fuenteRPP = await prisma.fuente.create({
      data: {
        nombre: 'RPP Noticias',
        url: 'https://rpp.pe/',
        selectoresCss: JSON.stringify(selectoresRPP),
        limiteArticulos: 50,
        activa: true
      }
    });
    
    console.log('✅ Fuente RPP creada exitosamente');
    console.log(`   ID: ${fuenteRPP.id}`);
    console.log(`   URL: ${fuenteRPP.url}`);
    console.log(`   Límite: ${fuenteRPP.limiteArticulos} artículos`);
    
  } catch (error) {
    console.error('❌ Error al crear fuente RPP:', error);
  } finally {
    await prisma.$disconnect();
  }
}

crearFuenteRPP();
