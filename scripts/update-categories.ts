import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const nuevasCategorias = [
  {
    nombre: 'Actualidad',
    descripcion: 'Noticias nacionales e internacionales de política, economía, sociedad, etc.',
    color: '#3B82F6',
    palabrasClave: JSON.stringify(['noticias', 'actualidad', 'nacional', 'internacional', 'política', 'economía', 'sociedad', 'elecciones', 'conflictos', 'leyes'])
  },
  {
    nombre: 'Política',
    descripcion: 'Gobierno, congreso, elecciones, partidos políticos, declaraciones oficiales.',
    color: '#DC2626',
    palabrasClave: JSON.stringify(['política', 'gobierno', 'congreso', 'elecciones', 'partidos', 'presidente', 'ministro', 'gabinete', 'reforma', 'ley'])
  },
  {
    nombre: 'Economía',
    descripcion: 'Finanzas, negocios, emprendimientos, tipo de cambio, minería, energía, empleo.',
    color: '#059669',
    palabrasClave: JSON.stringify(['economía', 'finanzas', 'negocios', 'dólar', 'inflación', 'minería', 'energía', 'empleo', 'empresas', 'mercado'])
  },
  {
    nombre: 'Deportes',
    descripcion: 'Fútbol, vóley, básquet, torneos internacionales, atletas peruanos.',
    color: '#F59E0B',
    palabrasClave: JSON.stringify(['deportes', 'fútbol', 'vóley', 'básquet', 'Alianza Lima', 'Selección peruana', 'Brasil', 'torneos', 'atletas'])
  },
  {
    nombre: 'Farándula / Entretenimiento',
    descripcion: 'Celebridades, cine, música, TV, influencers, espectáculos.',
    color: '#EC4899',
    palabrasClave: JSON.stringify(['farándula', 'entretenimiento', 'celebridades', 'cine', 'música', 'TV', 'influencers', 'Yahaira', 'festival'])
  },
  {
    nombre: 'Ciencia y Tecnología',
    descripcion: 'Avances tecnológicos, IA, investigación, startups tech.',
    color: '#8B5CF6',
    palabrasClave: JSON.stringify(['ciencia', 'tecnología', 'IA', 'inteligencia artificial', 'investigación', 'startups', 'NASA', 'lunar', 'revoluciona'])
  },
  {
    nombre: 'Internacionales',
    descripcion: 'Noticias del mundo, conflictos, diplomacia, cambio climático.',
    color: '#06B6D4',
    palabrasClave: JSON.stringify(['internacional', 'mundo', 'conflictos', 'diplomacia', 'ONU', 'acuerdo global', 'cambio climático'])
  },
  {
    nombre: 'Salud',
    descripcion: 'Medicina, nutrición, campañas, vacunas, bienestar.',
    color: '#10B981',
    palabrasClave: JSON.stringify(['salud', 'medicina', 'nutrición', 'campañas', 'vacunas', 'bienestar', 'dengue', 'alimentación'])
  },
  {
    nombre: 'Sociedad',
    descripcion: 'Cultura, educación, costumbres, turismo, temas sociales.',
    color: '#F97316',
    palabrasClave: JSON.stringify(['sociedad', 'cultura', 'educación', 'costumbres', 'turismo', 'Altiplano', 'zonas rurales', 'digital'])
  },
  {
    nombre: 'Sucesos / Policiales',
    descripcion: 'Accidentes, delitos, emergencias, investigaciones policiales.',
    color: '#EF4444',
    palabrasClave: JSON.stringify(['sucesos', 'policiales', 'accidentes', 'delitos', 'emergencias', 'investigaciones', 'incendio', 'Miraflores', 'banda criminal'])
  },
  {
    nombre: 'Medio Ambiente',
    descripcion: 'Ecología, cambio climático, conservación, energías renovables.',
    color: '#22C55E',
    palabrasClave: JSON.stringify(['medio ambiente', 'ecología', 'cambio climático', 'conservación', 'energías renovables', 'contaminación', 'Lago Titicaca'])
  },
  {
    nombre: 'Innovación / Emprendimiento',
    descripcion: 'Startups, proyectos tecnológicos, innovación social, apps.',
    color: '#6366F1',
    palabrasClave: JSON.stringify(['innovación', 'emprendimiento', 'startups', 'proyectos tecnológicos', 'innovación social', 'apps', 'reciclaje'])
  },
  {
    nombre: 'Educación',
    descripcion: 'Universidades, colegios, investigaciones académicas, becas.',
    color: '#8B5CF6',
    palabrasClave: JSON.stringify(['educación', 'universidades', 'colegios', 'investigaciones académicas', 'becas', 'UNSA', 'proyecto de IA'])
  },
  {
    nombre: 'Cultura',
    descripcion: 'Arte, historia, patrimonio, literatura, festivales culturales.',
    color: '#D97706',
    palabrasClave: JSON.stringify(['cultura', 'arte', 'historia', 'patrimonio', 'literatura', 'festivales culturales', 'Virgen de la Candelaria'])
  },
  {
    nombre: 'Tecnología y Ciencia de Datos',
    descripcion: 'IA, robótica, programación, Big Data, innovación digital.',
    color: '#7C3AED',
    palabrasClave: JSON.stringify(['tecnología', 'ciencia de datos', 'IA', 'robótica', 'programación', 'Big Data', 'innovación digital', 'startups de IA'])
  }
];

async function actualizarCategorias() {
  try {
    console.log('🔄 Actualizando categorías...');
    
    // Eliminar categorías existentes
    await prisma.categoria.deleteMany({});
    console.log('✅ Categorías anteriores eliminadas');
    
    // Crear nuevas categorías
    for (const categoria of nuevasCategorias) {
      await prisma.categoria.create({
        data: categoria
      });
      console.log(`✅ Categoría creada: ${categoria.nombre}`);
    }
    
    console.log('🎉 ¡Todas las categorías han sido actualizadas!');
    
  } catch (error) {
    console.error('❌ Error al actualizar categorías:', error);
  } finally {
    await prisma.$disconnect();
  }
}

actualizarCategorias();
