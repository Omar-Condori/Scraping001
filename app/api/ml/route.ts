import { NextRequest, NextResponse } from 'next/server';
import { ModeloML } from '@/lib/ml';
import { prisma } from '@/lib/prisma';

const modeloML = new ModeloML();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accion, datos } = body;

    switch (accion) {
      case 'entrenar':
        return await entrenarModelo(datos);
      case 'predecir':
        return await predecirCategoria(datos.texto);
      case 'guardar':
        return await guardarModelo();
      case 'cargar':
        return await cargarModelo(datos);
      default:
        return NextResponse.json(
          { error: 'Acción no válida' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error en ML API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const estadisticas = modeloML.obtenerEstadisticas();
    
    // Obtener datos de entrenamiento de la base de datos
    const articulos = await prisma.articulo.findMany({
      where: {
        categoriaId: { not: null },
        contenido: { not: null }
      },
      include: {
        categoria: true
      },
      take: 1000
    });

    const datosEntrenamiento = articulos.map(articulo => ({
      texto: `${articulo.titulo} ${articulo.contenido}`,
      categoria: articulo.categoria?.nombre || 'Sin categoría'
    }));

    return NextResponse.json({
      estadisticas,
      datosDisponibles: datosEntrenamiento.length,
      categoriasDisponibles: [...new Set(datosEntrenamiento.map(d => d.categoria))]
    });
  } catch (error) {
    console.error('Error al obtener estadísticas ML:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

async function entrenarModelo(datos?: any[]) {
  try {
    let datosEntrenamiento = datos;

    if (!datosEntrenamiento) {
      // Obtener datos de la base de datos
      const articulos = await prisma.articulo.findMany({
        where: {
          categoriaId: { not: null },
          contenido: { not: null }
        },
        include: {
          categoria: true
        },
        take: 1000
      });

      datosEntrenamiento = articulos.map(articulo => ({
        texto: `${articulo.titulo} ${articulo.contenido}`,
        categoria: articulo.categoria?.nombre || 'Sin categoría'
      }));
    }

    if (datosEntrenamiento.length < 10) {
      return NextResponse.json(
        { error: 'Se necesitan al menos 10 artículos para entrenar' },
        { status: 400 }
      );
    }

    const precision = await modeloML.entrenarModelo(datosEntrenamiento);
    
    // Guardar modelo en base de datos
    const modeloData = await modeloML.guardarModelo();
    await prisma.modeloML.upsert({
      where: { nombre: 'categorizacion' },
      update: {
        precision,
        modeloData: JSON.stringify(modeloData),
        entrenado: true
      },
      create: {
        nombre: 'categorizacion',
        tipo: 'categoria',
        precision,
        modeloData: JSON.stringify(modeloData),
        entrenado: true
      }
    });

    return NextResponse.json({
      precision,
      mensaje: 'Modelo entrenado correctamente',
      datosUsados: datosEntrenamiento.length
    });
  } catch (error) {
    console.error('Error al entrenar modelo:', error);
    return NextResponse.json(
      { error: 'Error al entrenar modelo' },
      { status: 500 }
    );
  }
}

async function predecirCategoria(texto: string) {
  try {
    const predicciones = await modeloML.predecirCategoria(texto);
    
    return NextResponse.json({
      predicciones,
      categoriaRecomendada: predicciones[0]
    });
  } catch (error) {
    console.error('Error al predecir:', error);
    return NextResponse.json(
      { error: 'Error al hacer predicción' },
      { status: 500 }
    );
  }
}

async function guardarModelo() {
  try {
    const modeloData = await modeloML.guardarModelo();
    
    await prisma.modeloML.upsert({
      where: { nombre: 'categorizacion' },
      update: {
        modeloData: JSON.stringify(modeloData),
        entrenado: true
      },
      create: {
        nombre: 'categorizacion',
        tipo: 'categoria',
        modeloData: JSON.stringify(modeloData),
        entrenado: true
      }
    });

    return NextResponse.json({
      mensaje: 'Modelo guardado correctamente'
    });
  } catch (error) {
    console.error('Error al guardar modelo:', error);
    return NextResponse.json(
      { error: 'Error al guardar modelo' },
      { status: 500 }
    );
  }
}

async function cargarModelo(datos: any) {
  try {
    await modeloML.cargarModelo(datos);
    
    return NextResponse.json({
      mensaje: 'Modelo cargado correctamente'
    });
  } catch (error) {
    console.error('Error al cargar modelo:', error);
    return NextResponse.json(
      { error: 'Error al cargar modelo' },
      { status: 500 }
    );
  }
}
