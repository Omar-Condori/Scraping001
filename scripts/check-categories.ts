import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkCategories() {
  try {
    console.log('🔍 Verificando categorías...');
    
    const categorias = await prisma.categoria.findMany();
    console.log(`✅ Se encontraron ${categorias.length} categorías`);
    
    for (const categoria of categorias.slice(0, 3)) {
      console.log(`📋 ${categoria.nombre}:`);
      console.log(`   Palabras clave: ${categoria.palabrasClave}`);
      console.log(`   Color: ${categoria.color}`);
    }
  } catch (error) {
    console.error('❌ Error al verificar categorías:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCategories();
