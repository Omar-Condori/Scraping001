import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function probarFormularioSimplificado() {
  try {
    console.log('🔄 Probando formulario simplificado...');
    
    // Crear una fuente de prueba con el formulario simplificado
    const selectoresCss = {
      titulo: 'h1, h2, h3, .title, .article-title',
      contenido: 'p, .content, .article-body, .text',
      imagen: 'img, .image, .thumbnail',
      enlaces: 'a, .link, .read-more'
    };
    
    const fuentePrueba = await prisma.fuente.create({
      data: {
        nombre: 'El Comercio',
        url: 'https://elcomercio.pe/',
        selectoresCss: JSON.stringify(selectoresCss),
        limiteArticulos: 50,
        activa: true
      }
    });
    
    console.log('✅ Fuente de prueba creada exitosamente');
    console.log(`   Nombre: ${fuentePrueba.nombre}`);
    console.log(`   URL: ${fuentePrueba.url}`);
    console.log(`   Activa: ${fuentePrueba.activa}`);
    console.log(`   Límite: ${fuentePrueba.limiteArticulos} artículos`);
    console.log(`   Selectores CSS: Configurados automáticamente`);
    
  } catch (error) {
    console.error('❌ Error al crear fuente de prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

probarFormularioSimplificado();
