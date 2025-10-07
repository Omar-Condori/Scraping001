import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function inicializarDatos() {
  try {
    console.log('🌱 Inicializando datos de ejemplo...');

    // Crear categorías por defecto
    const categorias = [
      { nombre: 'JavaScript', descripcion: 'Artículos sobre JavaScript y frameworks', color: '#f7df1e' },
      { nombre: 'Python', descripcion: 'Artículos sobre Python y librerías', color: '#3776ab' },
      { nombre: 'AI', descripcion: 'Inteligencia Artificial y Machine Learning', color: '#ff6b6b' },
      { nombre: 'Web', descripcion: 'Desarrollo web y tecnologías frontend/backend', color: '#4ecdc4' },
      { nombre: 'Mobile', descripcion: 'Desarrollo móvil y aplicaciones', color: '#45b7d1' },
      { nombre: 'DevOps', descripcion: 'DevOps, CI/CD y infraestructura', color: '#96ceb4' }
    ];

    for (const categoriaData of categorias) {
      await prisma.categoria.upsert({
        where: { nombre: categoriaData.nombre },
        update: categoriaData,
        create: categoriaData
      });
    }

    console.log('✅ Categorías creadas');

    // Crear fuente de ejemplo para Hacker News
    const categoriaWeb = await prisma.categoria.findUnique({
      where: { nombre: 'Web' }
    });

    if (categoriaWeb) {
      await prisma.fuente.upsert({
        where: { nombre: 'Hacker News' },
        update: {
          url: 'https://news.ycombinator.com/',
          selectoresCss: JSON.stringify({
            titulo: '.titleline > a',
            enlaces: '.titleline > a'
          }),
          categoriaId: categoriaWeb.id,
          limiteArticulos: 30,
          activa: true
        },
        create: {
          nombre: 'Hacker News',
          url: 'https://news.ycombinator.com/',
          selectoresCss: JSON.stringify({
            titulo: '.titleline > a',
            enlaces: '.titleline > a'
          }),
          categoriaId: categoriaWeb.id,
          limiteArticulos: 30,
          activa: true
        }
      });
    }

    console.log('✅ Fuente de ejemplo creada');

    console.log('🎉 Inicialización completada exitosamente');
  } catch (error) {
    console.error('❌ Error durante la inicialización:', error);
  } finally {
    await prisma.$disconnect();
  }
}

inicializarDatos();