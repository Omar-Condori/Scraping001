import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const articulo = await prisma.articulo.findUnique({
      where: { id: params.id },
      include: {
        categoria: true
      }
    });

    if (!articulo) {
      return NextResponse.json(
        { error: 'Artículo no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(articulo);
  } catch (error) {
    console.error('Error al obtener artículo:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { titulo, url, contenido, imagen, fuente, categoriaId } = body;

    const articulo = await prisma.articulo.update({
      where: { id: params.id },
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

    return NextResponse.json(articulo);
  } catch (error) {
    console.error('Error al actualizar artículo:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.articulo.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Artículo eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar artículo:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
