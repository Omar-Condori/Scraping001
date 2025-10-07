import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function generarResumenEstadistico() {
  console.log('📊 Generando resumen estadístico...');
  
  // Estadísticas generales
  const totalArticulos = await prisma.articulo.count();
  const articulosConCategoria = await prisma.articulo.count({
    where: {
      categoriaId: {
        not: null
      }
    }
  });
  const totalFuentes = await prisma.fuente.count();
  const totalCategorias = await prisma.categoria.count();
  const totalLogs = await prisma.log.count();

  // Estadísticas por categoría
  const articulosPorCategoria = await prisma.categoria.findMany({
    include: {
      _count: {
        select: {
          articulos: true
        }
      }
    },
    orderBy: {
      articulos: {
        _count: 'desc'
      }
    }
  });

  // Estadísticas por fuente
  const articulosPorFuente = await prisma.articulo.groupBy({
    by: ['fuente'],
    _count: {
      id: true
    },
    orderBy: {
      _count: {
        id: 'desc'
      }
    }
  });

  // Crear contenido del resumen
  const resumen = `
# RESUMEN ESTADÍSTICO - PLATAFORMA DE SCRAPING
Fecha: ${new Date().toLocaleString('es-ES')}

## 📊 ESTADÍSTICAS GENERALES
- **Total de Artículos**: ${totalArticulos.toLocaleString()}
- **Artículos Categorizados**: ${articulosConCategoria.toLocaleString()} (${((articulosConCategoria / totalArticulos) * 100).toFixed(1)}%)
- **Artículos Sin Categoría**: ${(totalArticulos - articulosConCategoria).toLocaleString()} (${(((totalArticulos - articulosConCategoria) / totalArticulos) * 100).toFixed(1)}%)
- **Total de Fuentes**: ${totalFuentes}
- **Total de Categorías**: ${totalCategorias}
- **Total de Logs**: ${totalLogs}

## 📂 ARTÍCULOS POR CATEGORÍA
${articulosPorCategoria.map(cat => 
  `- **${cat.nombre}**: ${cat._count.articulos} artículos`
).join('\n')}

## 🌐 ARTÍCULOS POR FUENTE (Top 10)
${articulosPorFuente.slice(0, 10).map(fuente => 
  `- **${fuente.fuente}**: ${fuente._count.id} artículos`
).join('\n')}

## 📈 DISTRIBUCIÓN TEMPORAL
- **Artículos más recientes**: ${new Date().toLocaleDateString('es-ES')}
- **Período de scraping**: Datos desde el inicio del sistema

## 📁 ARCHIVOS CSV GENERADOS
- \`articulos_${new Date().toISOString().split('T')[0]}.csv\` - Todos los artículos (${totalArticulos})
- \`articulos_categorizados_${new Date().toISOString().split('T')[0]}.csv\` - Solo artículos categorizados (${articulosConCategoria})
- \`categorias_${new Date().toISOString().split('T')[0]}.csv\` - Todas las categorías (${totalCategorias})
- \`fuentes_${new Date().toISOString().split('T')[0]}.csv\` - Todas las fuentes (${totalFuentes})
- \`logs_${new Date().toISOString().split('T')[0]}.csv\` - Logs del sistema (${totalLogs})
- \`categoria_[NOMBRE]_${new Date().toISOString().split('T')[0]}.csv\` - Archivos separados por categoría

## 💡 NOTAS
- Los archivos CSV están en formato UTF-8 y pueden abrirse en Excel, Google Sheets o cualquier editor de texto
- Los artículos están ordenados por fecha (más recientes primero)
- Las categorías incluyen palabras clave para clasificación automática
- Los logs registran todas las operaciones de scraping realizadas

---
Generado automáticamente por la Plataforma de Scraping Inteligente
`;

  // Guardar resumen
  const filename = `resumen_estadistico_${new Date().toISOString().split('T')[0]}.md`;
  const filepath = path.join(process.cwd(), 'exports', filename);
  
  fs.mkdirSync(path.join(process.cwd(), 'exports'), { recursive: true });
  fs.writeFileSync(filepath, resumen, 'utf8');
  
  console.log(`✅ Resumen estadístico generado: ${filepath}`);
  
  return filepath;
}

async function main() {
  try {
    console.log('🚀 Generando resumen estadístico...\n');
    
    await generarResumenEstadistico();
    
    console.log('\n🎉 Resumen completado exitosamente!');
    console.log('\n📂 Ubicación: ./exports/');
    console.log('\n💡 Puedes abrir el archivo .md en cualquier editor de texto o visualizador de Markdown.');
    
  } catch (error) {
    console.error('❌ Error durante la generación del resumen:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar generación de resumen
main();
