import { CronService } from '@/lib/cron';

let cronService: CronService | null = null;

export function inicializarCronJobs() {
  if (!cronService) {
    cronService = new CronService();
    cronService.iniciarScrapingAutomatico();
    console.log('🚀 Servicios de cron inicializados');
    console.log('📅 Scraping automático programado cada 30 minutos');
    console.log('⏰ Próximo scraping:', new Date(Date.now() + 30 * 60 * 1000).toLocaleString('es-ES'));
  }
}

export function obtenerCronService(): CronService | null {
  return cronService;
}

// Inicializar automáticamente al importar este módulo
inicializarCronJobs();
