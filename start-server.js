#!/usr/bin/env node

import { CronService } from './lib/cron.js';
import { inicializarCronJobs } from './lib/server-init.js';

console.log('🚀 Iniciando Plataforma de Scraping Inteligente...');
console.log('📅 Modo:', process.env.NODE_ENV || 'desarrollo');

// Inicializar servicios de cron
inicializarCronJobs();

// Mantener el proceso activo
process.on('SIGINT', () => {
  console.log('\n🛑 Deteniendo servicios...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Deteniendo servicios...');
  process.exit(0);
});

// Mostrar información del sistema
console.log('\n📊 Información del Sistema:');
console.log('   - Puerto:', process.env.PORT || 3000);
console.log('   - Entorno:', process.env.NODE_ENV || 'desarrollo');
console.log('   - PID:', process.pid);
console.log('   - Directorio:', process.cwd());

console.log('\n✅ Sistema iniciado correctamente');
console.log('🔄 Scraping automático activo');
console.log('🌐 Accede a: http://localhost:' + (process.env.PORT || 3000));
console.log('\n💡 Para detener: Ctrl+C');
