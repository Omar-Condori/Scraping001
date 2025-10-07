import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pagina = parseInt(searchParams.get('pagina') || '1');
    const limite = parseInt(searchParams.get('limite') || '20');
    const categoria = searchParams.get('categoria');
    const fuente = searchParams.get('fuente');
    const busqueda = searchParams.get('busqueda');

    const skip = (pagina - 1) * limite;

    const where: any = {};
    
    if (categoria) {
      where.categoriaId = categoria;
    }
    
    if (fuente) {
      where.fuente = fuente;
    }
    
    if (busqueda) {
      where.titulo = {
        contains: busqueda,
        mode: 'insensitive'
      };
    }

    const [articulos, total] = await Promise.all([
      prisma.articulo.findMany({
        where,
        include: {
          categoria: true
        },
        orderBy: {
          fecha: 'desc'
        },
        skip,
        take: limite
      }),
      prisma.articulo.count({ where })
    ]);

    return NextResponse.json({
      articulos,
      paginacion: {
        pagina,
        limite,
        total,
        paginas: Math.ceil(total / limite)
      }
    });
  } catch (error) {
    console.error('Error al obtener artículos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { titulo, url, contenido, imagen, fuente, categoriaId } = body;

    if (!titulo || !url) {
      return NextResponse.json(
        { error: 'Título y URL son requeridos' },
        { status: 400 }
      );
    }

    const articulo = await prisma.articulo.create({
      data: {
        titulo,
        url,
        contenido,
        imagen,
        fuente,
        categoriaId
      },
      include: {
        categoria: true
      }
    });

    return NextResponse.json(articulo, { status: 201 });
  } catch (error) {
    console.error('Error al crear artículo:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
