import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const [
      totalArticulos,
      totalFuentes,
      totalCategorias,
      articulosPorCategoria,
      articulosPorFuente,
      logsRecientes,
      erroresRecientes
    ] = await Promise.all([
      prisma.articulo.count(),
      prisma.fuente.count(),
      prisma.categoria.count(),
      prisma.categoria.findMany({
        include: {
          _count: {
            select: { articulos: true }
          }
        }
      }),
      prisma.articulo.groupBy({
        by: ['fuente'],
        _count: {
          fuente: true
        },
        orderBy: {
          _count: {
            fuente: 'desc'
          }
        },
        take: 10
      }),
      prisma.log.findMany({
        take: 10,
        orderBy: { fecha: 'desc' }
      }),
      prisma.log.count({
        where: { estado: 'error' }
      })
    ]);

    // Calcular total de artículos clasificados
    const totalClasificados = articulosPorCategoria.reduce((sum, cat) => sum + cat._count.articulos, 0);

    const estadisticas = {
      resumen: {
        totalArticulos,
        totalFuentes,
        totalCategorias,
        totalClasificados,
        erroresRecientes
      },
      articulosPorCategoria,
      articulosPorFuente,
      logsRecientes
    };

    return NextResponse.json(estadisticas);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
