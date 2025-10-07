import { NextRequest, NextResponse } from 'next/server';
import { obtenerCronService } from '@/lib/server-init';

export async function GET(request: NextRequest) {
  try {
    const cronService = obtenerCronService();
    
    if (!cronService) {
      return NextResponse.json(
        { 
          error: 'Servicio de cron no disponible',
          procesando: false,
          estado: 'error'
        },
        { status: 500 }
      );
    }

    const estados = cronService.obtenerEstadoJobs();
    const procesando = estados.some(job => job.activo);
    
    return NextResponse.json({
      procesando,
      estado: procesando ? 'procesando' : 'disponible',
      jobs: estados,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al obtener estado:', error);
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        procesando: false,
        estado: 'error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
