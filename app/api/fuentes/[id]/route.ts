import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const fuente = await prisma.fuente.findUnique({
      where: { id: params.id },
      include: {
        categoria: true,
        articulos: {
          take: 10,
          orderBy: { fecha: 'desc' }
        },
        logs: {
          take: 20,
          orderBy: { fecha: 'desc' }
        }
      }
    });

    if (!fuente) {
      return NextResponse.json(
        { error: 'Fuente no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(fuente);
  } catch (error) {
    console.error('Error al obtener fuente:', error);
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
    const { nombre, url, selectoresCss, categoriaId, limiteArticulos, activa } = body;

    const fuente = await prisma.fuente.update({
      where: { id: params.id },
      data: {
        nombre,
        url,
        selectoresCss: JSON.stringify(selectoresCss),
        categoriaId,
        limiteArticulos,
        activa
      },
      include: {
        categoria: true
      }
    });

    return NextResponse.json(fuente);
  } catch (error) {
    console.error('Error al actualizar fuente:', error);
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
    await prisma.fuente.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Fuente eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar fuente:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
