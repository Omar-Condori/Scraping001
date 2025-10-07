import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Verificando base de datos...');
    
    // Verificar categorías
    const categorias = await prisma.categoria.findMany();
    console.log(`📋 Categorías: ${categorias.length}`);
    
    // Verificar artículos con categorías
    const articulosConCategoria = await prisma.articulo.findMany({
      where: {
        categoriaId: {
          not: null
        }
      },
      include: {
        categoria: true
      },
      take: 5
    });
    
    console.log(`📰 Artículos con categoría: ${articulosConCategoria.length}`);
    
    for (const articulo of articulosConCategoria) {
      console.log(`✅ "${articulo.titulo}" → ${articulo.categoria?.nombre}`);
    }
    
    // Verificar total de artículos
    const totalArticulos = await prisma.articulo.count();
    console.log(`📊 Total artículos: ${totalArticulos}`);
    
  } catch (error) {
    console.error('❌ Error al verificar base de datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
