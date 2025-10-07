import { CronService } from '../lib/cron';

// Inicializar servicios de cron al importar este módulo
console.log('🚀 Iniciando servicios de cron automáticamente...');

const cronService = new CronService();
cronService.iniciarServicios();

console.log('✅ Servicios de cron iniciados correctamente');
console.log('📅 Scraping automático programado cada 30 minutos');
console.log('🔄 Para detener: Ctrl+C o cerrar el servidor');

// Mantener el proceso activo
process.on('SIGINT', () => {
  console.log('\n🛑 Deteniendo servicios de cron...');
  cronService.detenerServicios();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Deteniendo servicios de cron...');
  cronService.detenerServicios();
  process.exit(0);
});
