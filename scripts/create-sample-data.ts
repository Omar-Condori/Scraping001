import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function crearArticulosEjemplo() {
  try {
    console.log('📝 Creando artículos de ejemplo...');

    // Crear artículos de ejemplo sin categorías primero
    const articulosEjemplo = [
      {
        titulo: "Next.js 14 Released with App Router Improvements",
        url: "https://example.com/nextjs-14",
        contenido: "Next.js 14 introduces new features and performance improvements including enhanced App Router, improved caching, and better developer experience.",
        fuente: "Hacker News"
      },
      {
        titulo: "Machine Learning with TensorFlow.js Tutorial",
        url: "https://example.com/tensorflow-tutorial",
        contenido: "Learn how to implement ML models in the browser using TensorFlow.js. This comprehensive guide covers neural networks, training, and deployment.",
        fuente: "Hacker News"
      },
      {
        titulo: "Python Best Practices for 2024",
        url: "https://example.com/python-best-practices",
        contenido: "Essential Python coding standards and patterns for modern development. Learn about type hints, async programming, and performance optimization.",
        fuente: "Hacker News"
      },
      {
        titulo: "React 18 Concurrent Features Explained",
        url: "https://example.com/react-18",
        contenido: "Understanding React 18's concurrent rendering, Suspense, and automatic batching. Deep dive into the new features that improve user experience.",
        fuente: "Hacker News"
      },
      {
        titulo: "Docker Containerization Guide",
        url: "https://example.com/docker-guide",
        contenido: "Complete guide to containerizing applications with Docker. Learn about Dockerfiles, multi-stage builds, and best practices for production deployments.",
        fuente: "Hacker News"
      },
      {
        titulo: "Mobile App Development with React Native",
        url: "https://example.com/react-native",
        contenido: "Building cross-platform mobile applications using React Native. Tips for performance optimization and native module integration.",
        fuente: "Hacker News"
      },
      {
        titulo: "Advanced JavaScript Patterns",
        url: "https://example.com/js-patterns",
        contenido: "Exploring advanced JavaScript patterns including closures, prototypes, and functional programming concepts for modern web development.",
        fuente: "Hacker News"
      },
      {
        titulo: "AI-Powered Web Applications",
        url: "https://example.com/ai-web-apps",
        contenido: "Integrating artificial intelligence into web applications. Case studies and practical examples of ML-powered user experiences.",
        fuente: "Hacker News"
      }
    ];

    for (const articuloData of articulosEjemplo) {
      await prisma.articulo.upsert({
        where: { url: articuloData.url },
        update: articuloData,
        create: articuloData
      });
    }

    console.log(`✅ ${articulosEjemplo.length} artículos de ejemplo creados`);

    // Crear algunos logs de ejemplo
    const logsEjemplo = [
      {
        fuente: "Hacker News",
        estado: "success",
        mensaje: "Scraping completado exitosamente",
        detalles: JSON.stringify({ articulos: 8, timestamp: new Date().toISOString() })
      },
      {
        fuente: "Sistema",
        estado: "success",
        mensaje: "Base de datos inicializada",
        detalles: JSON.stringify({ categorias: 6, fuentes: 1, timestamp: new Date().toISOString() })
      },
      {
        fuente: "Machine Learning",
        estado: "success",
        mensaje: "Modelo de categorización entrenado",
        detalles: JSON.stringify({ precision: 0.85, datos: 8, timestamp: new Date().toISOString() })
      }
    ];

    for (const logData of logsEjemplo) {
      await prisma.log.create({
        data: logData
      });
    }

    console.log(`✅ ${logsEjemplo.length} logs de ejemplo creados`);
    console.log('🎉 Datos de ejemplo creados exitosamente');
  } catch (error) {
    console.error('❌ Error al crear artículos de ejemplo:', error);
  } finally {
    await prisma.$disconnect();
  }
}

crearArticulosEjemplo();