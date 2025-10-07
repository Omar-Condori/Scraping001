import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

interface ArticuloCSV {
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

interface FuenteCSV {
  id: string;
  nombre: string;
  url: string;
  selectoresCss: string;
  categoriaId: string;
  categoriaNombre: string;
  activa: boolean;
  limiteArticulos: number;
  fechaCreacion: string;
}

interface CategoriaCSV {
  id: string;
  nombre: string;
  descripcion: string;
  color: string;
  palabrasClave: string;
}

interface LogCSV {
  id: string;
  fecha: string;
  fuente: string;
  estado: string;
  mensaje: string;
  detalles: string;
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

async function exportArticulos() {
  console.log('📰 Exportando artículos...');
  
  const articulos = await prisma.articulo.findMany({
    include: {
      categoria: true
    },
    orderBy: {
      fecha: 'desc'
    }
  });

  const articulosCSV: ArticuloCSV[] = articulos.map(articulo => ({
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
  const filename = `articulos_${new Date().toISOString().split('T')[0]}.csv`;
  const filepath = path.join(process.cwd(), 'exports', filename);
  
  // Crear directorio exports si no existe
  fs.mkdirSync(path.join(process.cwd(), 'exports'), { recursive: true });
  
  fs.writeFileSync(filepath, csv, 'utf8');
  console.log(`✅ Artículos exportados: ${filepath}`);
  console.log(`📊 Total artículos: ${articulos.length}`);
  
  return filepath;
}

async function exportFuentes() {
  console.log('🌐 Exportando fuentes...');
  
  const fuentes = await prisma.fuente.findMany({
    include: {
      categoria: true
    },
    orderBy: {
      nombre: 'asc'
    }
  });

  const fuentesCSV: FuenteCSV[] = fuentes.map(fuente => ({
    id: fuente.id,
    nombre: fuente.nombre,
    url: fuente.url,
    selectoresCss: fuente.selectoresCss,
    categoriaId: fuente.categoriaId || '',
    categoriaNombre: fuente.categoria?.nombre || 'Sin categoría',
    activa: fuente.activa,
    limiteArticulos: fuente.limiteArticulos,
    fechaCreacion: fuente.createdAt.toISOString()
  }));

  const headers = [
    'id', 'nombre', 'url', 'selectoresCss', 'categoriaId', 
    'categoriaNombre', 'activa', 'limiteArticulos', 'fechaCreacion'
  ];

  const csv = arrayToCSV(fuentesCSV, headers);
  const filename = `fuentes_${new Date().toISOString().split('T')[0]}.csv`;
  const filepath = path.join(process.cwd(), 'exports', filename);
  
  fs.writeFileSync(filepath, csv, 'utf8');
  console.log(`✅ Fuentes exportadas: ${filepath}`);
  console.log(`📊 Total fuentes: ${fuentes.length}`);
  
  return filepath;
}

async function exportCategorias() {
  console.log('📂 Exportando categorías...');
  
  const categorias = await prisma.categoria.findMany({
    orderBy: {
      nombre: 'asc'
    }
  });

  const categoriasCSV: CategoriaCSV[] = categorias.map(categoria => ({
    id: categoria.id,
    nombre: categoria.nombre,
    descripcion: categoria.descripcion || '',
    color: categoria.color,
    palabrasClave: categoria.palabrasClave || ''
  }));

  const headers = ['id', 'nombre', 'descripcion', 'color', 'palabrasClave'];
  const csv = arrayToCSV(categoriasCSV, headers);
  const filename = `categorias_${new Date().toISOString().split('T')[0]}.csv`;
  const filepath = path.join(process.cwd(), 'exports', filename);
  
  fs.writeFileSync(filepath, csv, 'utf8');
  console.log(`✅ Categorías exportadas: ${filepath}`);
  console.log(`📊 Total categorías: ${categorias.length}`);
  
  return filepath;
}

async function exportLogs() {
  console.log('📋 Exportando logs...');
  
  const logs = await prisma.log.findMany({
    orderBy: {
      fecha: 'desc'
    }
  });

  const logsCSV: LogCSV[] = logs.map(log => ({
    id: log.id,
    fecha: log.fecha.toISOString(),
    fuente: log.fuente,
    estado: log.estado,
    mensaje: log.mensaje,
    detalles: log.detalles
  }));

  const headers = ['id', 'fecha', 'fuente', 'estado', 'mensaje', 'detalles'];
  const csv = arrayToCSV(logsCSV, headers);
  const filename = `logs_${new Date().toISOString().split('T')[0]}.csv`;
  const filepath = path.join(process.cwd(), 'exports', filename);
  
  // Crear directorio exports si no existe
  fs.mkdirSync(path.join(process.cwd(), 'exports'), { recursive: true });
  
  fs.writeFileSync(filepath, csv, 'utf8');
  console.log(`✅ Logs exportados: ${filepath}`);
  console.log(`📊 Total logs: ${logs.length}`);
  
  return filepath;
}

async function exportAll() {
  try {
    console.log('🚀 Iniciando exportación completa a CSV...\n');
    
    const files = await Promise.all([
      exportArticulos(),
      exportFuentes(),
      exportCategorias(),
      exportLogs()
    ]);
    
    console.log('\n🎉 Exportación completada exitosamente!');
    console.log('\n📁 Archivos generados:');
    files.forEach(file => {
      console.log(`   - ${path.basename(file)}`);
    });
    
    console.log('\n📂 Ubicación: ./exports/');
    console.log('\n💡 Puedes abrir estos archivos CSV en Excel, Google Sheets o cualquier editor de texto.');
    
  } catch (error) {
    console.error('❌ Error durante la exportación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar exportación
exportAll();
