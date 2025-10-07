import cron from 'node-cron';
import { ScrapingService } from '@/lib/scraping';
import { prisma } from '@/lib/prisma';

export class CronService {
  private scrapingService: ScrapingService;
  private jobs: Map<string, cron.ScheduledTask> = new Map();

  constructor() {
    this.scrapingService = ScrapingService.getInstance();
  }

  iniciarScrapingAutomatico(): void {
    // Solo scraping de fuentes personalizadas cada hora

    // Scraping de fuentes personalizadas cada hora
    const jobFuentesPersonalizadas = cron.schedule('0 * * * *', async () => {
      console.log('🔄 Ejecutando scraping de fuentes personalizadas...');
      try {
        const fuentes = await prisma.fuente.findMany({
          where: { activa: true },
          include: { categoria: true }
        });

        for (const fuente of fuentes) {
          try {
            const selectores = JSON.parse(fuente.selectoresCss);
            const articulos = await this.scrapingService.scrapeFuentePersonalizada(
              fuente.url,
              selectores,
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
  }

  detenerScrapingAutomatico(): void {
    this.jobs.forEach((job, nombre) => {
      job.stop();
      console.log(`⏹️ Job ${nombre} detenido`);
    });
    this.jobs.clear();
  }

  async ejecutarScrapingManual(): Promise<{ fuentesPersonalizadas: number }> {
    try {
      console.log('🔄 Ejecutando scraping manual...');
      
      // Solo scraping de fuentes personalizadas
      const fuentes = await prisma.fuente.findMany({
        where: { activa: true },
        include: { categoria: true }
      });

      let guardadosFuentesPersonalizadas = 0;
      for (const fuente of fuentes) {
        try {
          const selectores = JSON.parse(fuente.selectoresCss);
          const articulos = await this.scrapingService.scrapeFuentePersonalizada(
            fuente.url,
            selectores,
            fuente.limiteArticulos
          );
          const guardados = await this.scrapingService.guardarArticulos(articulos);
          guardadosFuentesPersonalizadas += guardados;
        } catch (error) {
          console.error(`Error en fuente ${fuente.nombre}:`, error);
        }
      }

      console.log(`✅ Scraping manual completado: ${guardadosFuentesPersonalizadas} artículos guardados`);
      
      return {
        fuentesPersonalizadas: guardadosFuentesPersonalizadas
      };
    } catch (error) {
      console.error('❌ Error en scraping manual:', error);
      throw error;
    }
  }

  obtenerEstadoJobs(): { nombre: string; activo: boolean }[] {
    const estados: { nombre: string; activo: boolean }[] = [];
    
    this.jobs.forEach((job, nombre) => {
      estados.push({
        nombre,
        activo: job.running
      });
    });

    return estados;
  }
}