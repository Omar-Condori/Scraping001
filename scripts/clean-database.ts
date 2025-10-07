import { prisma } from '@/lib/prisma';

async function cleanDatabase() {
  console.log('🧹 Limpiando base de datos...');
  
  try {
    // Eliminar todos los artículos
    const deletedArticulos = await prisma.articulo.deleteMany({});
    console.log(`✅ Eliminados ${deletedArticulos.count} artículos`);
    
    // Eliminar todos los logs
    const deletedLogs = await prisma.log.deleteMany({});
    console.log(`✅ Eliminados ${deletedLogs.count} logs`);
    
    console.log('🎉 Base de datos limpiada exitosamente');
  } catch (error) {
    console.error('❌ Error al limpiar la base de datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDatabase();