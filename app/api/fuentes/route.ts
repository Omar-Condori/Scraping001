import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const fuentes = await prisma.fuente.findMany({
      include: {
        categoria: true,
        _count: {
          select: {
            logs: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(fuentes);
  } catch (error) {
    console.error('Error al obtener fuentes:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, url, selectoresCss, categoriaId, limiteArticulos, activa } = body;

    if (!nombre || !url || !selectoresCss) {
      return NextResponse.json(
        { error: 'Nombre, URL y selectores CSS son requeridos' },
        { status: 400 }
      );
    }

    const fuente = await prisma.fuente.create({
      data: {
        nombre,
        url,
        selectoresCss: JSON.stringify(selectoresCss),
        categoriaId,
        limiteArticulos: limiteArticulos || 50,
        activa: activa !== undefined ? activa : true
      },
      include: {
        categoria: true
      }
    });

    return NextResponse.json(fuente, { status: 201 });
  } catch (error) {
    console.error('Error al crear fuente:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
