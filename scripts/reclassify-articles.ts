import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function reclasificarNoticias() {
  try {
    console.log('🔄 Reclasificando noticias existentes...');
    
    const categorias = await prisma.categoria.findMany();
    const articulos = await prisma.articulo.findMany();
    
    console.log(`📰 Se encontraron ${articulos.length} noticias`);
    
    let reclasificadas = 0;
    
    for (const articulo of articulos) {
      const textoCompleto = `${articulo.titulo} ${articulo.contenido || ''}`.toLowerCase();
      
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
      
      if (mejorCategoria && mejorPuntuacion > 0) {
        await prisma.articulo.update({
          where: { id: articulo.id },
          data: { categoriaId: mejorCategoria }
        });
        
        const categoriaNombre = categorias.find(c => c.id === mejorCategoria)?.nombre;
        console.log(`✅ "${articulo.titulo}" → ${categoriaNombre} (${mejorPuntuacion} puntos)`);
        reclasificadas++;
      } else {
        console.log(`❌ "${articulo.titulo}" → Sin categoría`);
      }
    }
    
    console.log(`🎉 Se reclasificaron ${reclasificadas} noticias`);
  } catch (error) {
    console.error('❌ Error al reclasificar noticias:', error);
  } finally {
    await prisma.$disconnect();
  }
}

reclasificarNoticias();
