import cron from 'node-cron';
import { ScrapingService } from '@/lib/scraping';
import { prisma } from '@/lib/prisma';
import { getCronExpression, getDescripcion } from '@/lib/scraping-config';

export class CronService {
  private scrapingService: ScrapingService;
  private jobs: Map<string, cron.ScheduledTask> = new Map();
  private jobStates: Map<string, { activo: boolean; inicio?: Date; fin?: Date; progreso?: number }> = new Map();

  constructor() {
    this.scrapingService = ScrapingService.getInstance();
  }

  iniciarScrapingAutomatico(): void {
    // Scraping de fuentes personalizadas cada 30 minutos

    // Scraping de fuentes personalizadas con frecuencia configurable
    const jobFuentesPersonalizadas = cron.schedule(getCronExpression(), async () => {
      console.log('🔄 Ejecutando scraping de fuentes personalizadas...');
      try {
        const fuentes = await prisma.fuente.findMany({
          where: { activa: true },
          include: { categoria: true }
        });

        for (const fuente of fuentes) {
          try {
                 const articulos = await this.scrapingService.scrapeFuentePersonalizada(
                   fuente.url,
                   fuente.selectoresCss ? JSON.parse(fuente.selectoresCss) : {},
                   fuente.limiteArticulos
                 );
            const guardados = await this.scrapingService.guardarArticulos(articulos);
            console.log(`✅ Fuente ${fuente.nombre}: ${guardados} artículos guardados`);
          } catch (error) {
            console.error(`❌ Error en fuente ${fuente.nombre}:`, error);
          }
        }
      } catch (error) {
        console.error('❌ Error en scraping de fuentes personalizadas:', error);
      }
    }, {
      scheduled: false,
      timezone: 'America/Mexico_City'
    });

    this.jobs.set('fuentes-personalizadas', jobFuentesPersonalizadas);
    jobFuentesPersonalizadas.start();

    console.log('🚀 Servicios de cron iniciados correctamente');
    console.log(`📅 Scraping automático programado: ${getDescripcion()}`);
  }

  detenerScrapingAutomatico(): void {
    this.jobs.forEach((job, nombre) => {
      job.stop();
      console.log(`⏹️ Job ${nombre} detenido`);
    });
    this.jobs.clear();
  }

  async ejecutarScrapingManual(): Promise<{ fuentesPersonalizadas: number }> {
    const jobId = 'manual-scraping';
    
    // Marcar como activo
    this.jobStates.set(jobId, { 
      activo: true, 
      inicio: new Date(),
      progreso: 0
    });
    
    try {
      console.log('🔄 Ejecutando scraping manual...');
      
      // Solo scraping de fuentes personalizadas
      const fuentes = await prisma.fuente.findMany({
        where: { activa: true },
        include: { categoria: true }
      });

      let guardadosFuentesPersonalizadas = 0;
      const totalFuentes = fuentes.length;
      
      for (let i = 0; i < fuentes.length; i++) {
        const fuente = fuentes[i];
        
        try {
          // Actualizar progreso
          const progreso = Math.round((i / totalFuentes) * 100);
          this.jobStates.set(jobId, { 
            activo: true, 
            inicio: this.jobStates.get(jobId)?.inicio,
            progreso
          });
          
          const articulos = await this.scrapingService.scrapeFuentePersonalizada(
            fuente.url,
            fuente.selectoresCss ? JSON.parse(fuente.selectoresCss) : {},
            fuente.limiteArticulos
          );
          const guardados = await this.scrapingService.guardarArticulos(articulos);
          guardadosFuentesPersonalizadas += guardados;
        } catch (error) {
          console.error(`Error en fuente ${fuente.nombre}:`, error);
        }
      }

      // Marcar como completado
      this.jobStates.set(jobId, { 
        activo: false, 
        inicio: this.jobStates.get(jobId)?.inicio,
        fin: new Date(),
        progreso: 100
      });

      console.log(`✅ Scraping manual completado: ${guardadosFuentesPersonalizadas} artículos guardados`);
      
      return {
        fuentesPersonalizadas: guardadosFuentesPersonalizadas
      };
    } catch (error) {
      // Marcar como error
      this.jobStates.set(jobId, { 
        activo: false, 
        inicio: this.jobStates.get(jobId)?.inicio,
        fin: new Date(),
        progreso: 0
      });
      
      console.error('❌ Error en scraping manual:', error);
      throw error;
    }
  }

  obtenerEstadoJobs(): { nombre: string; activo: boolean; progreso?: number; inicio?: Date; fin?: Date }[] {
    const estados: { nombre: string; activo: boolean; progreso?: number; inicio?: Date; fin?: Date }[] = [];
    
    // Estados de jobs automáticos
    this.jobs.forEach((job, nombre) => {
      estados.push({
        nombre,
        activo: job.running
      });
    });

    // Estados de jobs manuales
    this.jobStates.forEach((estado, nombre) => {
      estados.push({
        nombre,
        activo: estado.activo,
        progreso: estado.progreso,
        inicio: estado.inicio,
        fin: estado.fin
      });
    });

    return estados;
  }
}