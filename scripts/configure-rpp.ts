import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function configurarRPP() {
  try {
    console.log('🔄 Configurando fuente RPP...');
    
    // Buscar si ya existe la fuente RPP
    const fuenteExistente = await prisma.fuente.findUnique({
      where: { nombre: 'RPP Noticias' }
    });
    
    if (fuenteExistente) {
      console.log('✅ Fuente RPP ya existe, actualizando selectores...');
      
      // Actualizar selectores CSS para RPP
      const selectoresRPP = {
        titulo: 'h2 a, .story-title a, .news-title a',
        contenido: '.story-content p, .news-content p, .article-content p',
        imagen: '.story-image img, .news-image img, .article-image img',
        enlaces: '.story-list a, .news-list a, .article-list a',
        paginacion: '.pagination a, .load-more, .ver-mas'
      };
      
      await prisma.fuente.update({
        where: { id: fuenteExistente.id },
        data: {
          selectoresCss: JSON.stringify(selectoresRPP),
          activa: true,
          limiteArticulos: 50
        }
      });
      
      console.log('✅ Selectores de RPP actualizados');
    } else {
      console.log('❌ Fuente RPP no encontrada');
    }
    
  } catch (error) {
    console.error('❌ Error al configurar RPP:', error);
  } finally {
    await prisma.$disconnect();
  }
}

configurarRPP();
