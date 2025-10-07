import { NextRequest, NextResponse } from 'next/server';
import { inicializarCronJobs, obtenerCronService } from '@/lib/server-init';

// Inicializar cron jobs cuando se importa el módulo
inicializarCronJobs();

export async function GET(request: NextRequest) {
  try {
    const cronService = obtenerCronService();
    
    if (!cronService) {
      return NextResponse.json(
        { error: 'Servicio de cron no disponible' },
        { status: 500 }
      );
    }

    const estados = cronService.obtenerEstadoJobs();
    return NextResponse.json({ jobs: estados });
  } catch (error) {
    console.error('Error al obtener estado de jobs:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tipo } = body;

    const cronService = obtenerCronService();
    
    if (!cronService) {
      return NextResponse.json(
        { error: 'Servicio de cron no disponible' },
        { status: 500 }
      );
    }

    let resultado;

    if (tipo === 'manual') {
      resultado = await cronService.ejecutarScrapingManual();
    } else if (tipo === 'start') {
      cronService.iniciarScrapingAutomatico();
      resultado = { message: 'Scraping automático iniciado' };
    } else if (tipo === 'stop') {
      cronService.detenerScrapingAutomatico();
      resultado = { message: 'Scraping automático detenido' };
    } else {
      return NextResponse.json(
        { error: 'Tipo de scraping no válido' },
        { status: 400 }
      );
    }

    return NextResponse.json(resultado);
  } catch (error) {
    console.error('Error en scraping:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}