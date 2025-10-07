import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testClassification() {
  try {
    console.log('🧪 Probando clasificación...');
    
    const categorias = await prisma.categoria.findMany();
    const textoCompleto = "Gobierno anuncia nuevas medidas económicas para reactivar el país".toLowerCase();
    
    console.log(`📝 Texto: "${textoCompleto}"`);
    
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
      
      console.log(`🏷️ ${categoria.nombre}: ${puntuacion} puntos`);
      
      // Si hay coincidencias y es la mejor puntuación hasta ahora
      if (puntuacion > mejorPuntuacion) {
        mejorPuntuacion = puntuacion;
        mejorCategoria = categoria.nombre;
      }
    }
    
    console.log(`🎯 Mejor categoría: ${mejorCategoria} (${mejorPuntuacion} puntos)`);
  } catch (error) {
    console.error('❌ Error al probar clasificación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testClassification();
