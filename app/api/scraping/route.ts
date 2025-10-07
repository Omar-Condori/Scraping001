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
        { 
          error: 'Servicio de cron no disponible',
          mensaje: 'El servicio de cron no está inicializado correctamente'
        },
        { status: 500 }
      );
    }

    let resultado;

    if (tipo === 'manual') {
      console.log('🚀 Iniciando scraping manual...');
      
      // Iniciar scraping en background y responder inmediatamente
      cronService.ejecutarScrapingManual().catch(error => {
        console.error('Error en scraping manual:', error);
      });
      
      resultado = { 
        mensaje: 'Scraping iniciado en segundo plano',
        estado: 'success',
        procesando: true,
        estimado: '2-3 minutos'
      };
    } else if (tipo === 'start') {
      cronService.iniciarScrapingAutomatico();
      resultado = { 
        mensaje: 'Scraping automático iniciado',
        estado: 'success'
      };
    } else if (tipo === 'stop') {
      cronService.detenerScrapingAutomatico();
      resultado = { 
        mensaje: 'Scraping automático detenido',
        estado: 'success'
      };
    } else if (tipo === 'status') {
      // Verificar estado del scraping
      const estado = cronService.obtenerEstadoJobs();
      resultado = { 
        mensaje: 'Estado del scraping',
        estado: 'success',
        jobs: estado
      };
    } else {
      return NextResponse.json(
        { 
          error: 'Tipo de scraping no válido',
          mensaje: 'El tipo debe ser "manual", "start", "stop" o "status"'
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ...resultado,
      estado: 'success',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error en scraping:', error);
    
    // Determinar el tipo de error
    let mensajeError = 'Error interno del servidor';
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        mensajeError = 'Timeout: El scraping tardó demasiado tiempo';
      } else if (error.message.includes('ENOTFOUND')) {
        mensajeError = 'Error de conexión: No se pudo conectar a las fuentes';
      } else if (error.message.includes('ECONNREFUSED')) {
        mensajeError = 'Error de conexión: Conexión rechazada';
      } else {
        mensajeError = `Error: ${error.message}`;
      }
    }
    
    return NextResponse.json(
      { 
        error: mensajeError,
        mensaje: 'Error al ejecutar scraping de todas las fuentes',
        estado: 'error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}