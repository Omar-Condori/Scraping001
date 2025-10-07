import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

interface ArticuloCategorizadoCSV {
  id: string;
  titulo: string;
  url: string;
  contenido: string;
  imagen: string;
  fuente: string;
  fecha: string;
  categoriaId: string;
  categoriaNombre: string;
  categoriaColor: string;
}

function escapeCSV(value: string | null | undefined): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  const stringValue = String(value);
  
  // Si contiene comas, comillas o saltos de línea, envolver en comillas y escapar comillas internas
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes('\r')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}

function arrayToCSV(data: any[], headers: string[]): string {
  const csvRows = [headers.join(',')];
  
  for (const row of data) {
    const values = headers.map(header => escapeCSV(row[header]));
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
}

async function exportArticulosCategorizados() {
  console.log('📰 Exportando artículos categorizados...');
  
  const articulos = await prisma.articulo.findMany({
    where: {
      categoriaId: {
        not: null
      }
    },
    include: {
      categoria: true
    },
    orderBy: {
      fecha: 'desc'
    }
  });

  const articulosCSV: ArticuloCategorizadoCSV[] = articulos.map(articulo => ({
    id: articulo.id,
    titulo: articulo.titulo,
    url: articulo.url,
    contenido: articulo.contenido || '',
    imagen: articulo.imagen || '',
    fuente: articulo.fuente,
    fecha: articulo.fecha.toISOString(),
    categoriaId: articulo.categoriaId || '',
    categoriaNombre: articulo.categoria?.nombre || 'Sin categoría',
    categoriaColor: articulo.categoria?.color || ''
  }));

  const headers = [
    'id', 'titulo', 'url', 'contenido', 'imagen', 'fuente', 
    'fecha', 'categoriaId', 'categoriaNombre', 'categoriaColor'
  ];

  const csv = arrayToCSV(articulosCSV, headers);
  const filename = `articulos_categorizados_${new Date().toISOString().split('T')[0]}.csv`;
  const filepath = path.join(process.cwd(), 'exports', filename);
  
  // Crear directorio exports si no existe
  fs.mkdirSync(path.join(process.cwd(), 'exports'), { recursive: true });
  
  fs.writeFileSync(filepath, csv, 'utf8');
  console.log(`✅ Artículos categorizados exportados: ${filepath}`);
  console.log(`📊 Total artículos categorizados: ${articulos.length}`);
  
  return filepath;
}

async function exportPorCategoria() {
  console.log('📂 Exportando artículos por categoría...');
  
  const categorias = await prisma.categoria.findMany({
    include: {
      articulos: {
        orderBy: {
          fecha: 'desc'
        }
      }
    },
    orderBy: {
      nombre: 'asc'
    }
  });

  for (const categoria of categorias) {
    if (categoria.articulos.length > 0) {
      const articulosCSV = categoria.articulos.map(articulo => ({
        id: articulo.id,
        titulo: articulo.titulo,
        url: articulo.url,
        contenido: articulo.contenido || '',
        imagen: articulo.imagen || '',
        fuente: articulo.fuente,
        fecha: articulo.fecha.toISOString(),
        categoriaNombre: categoria.nombre
      }));

      const headers = [
        'id', 'titulo', 'url', 'contenido', 'imagen', 'fuente', 
        'fecha', 'categoriaNombre'
      ];

      const csv = arrayToCSV(articulosCSV, headers);
      const filename = `categoria_${categoria.nombre.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
      const filepath = path.join(process.cwd(), 'exports', filename);
      
      fs.writeFileSync(filepath, csv, 'utf8');
      console.log(`✅ ${categoria.nombre}: ${categoria.articulos.length} artículos`);
    }
  }
}

async function main() {
  try {
    console.log('🚀 Iniciando exportación de artículos categorizados...\n');
    
    await exportArticulosCategorizados();
    console.log('');
    await exportPorCategoria();
    
    console.log('\n🎉 Exportación completada exitosamente!');
    console.log('\n📂 Ubicación: ./exports/');
    console.log('\n💡 Archivos generados:');
    console.log('   - articulos_categorizados_YYYY-MM-DD.csv (todos los artículos con categoría)');
    console.log('   - categoria_NOMBRE_YYYY-MM-DD.csv (archivos separados por categoría)');
    
  } catch (error) {
    console.error('❌ Error durante la exportación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar exportación
main();
