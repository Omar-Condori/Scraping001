import { inicializarCronJobs } from '@/lib/server-init';

// Inicializar servicios del servidor cuando se importa
if (typeof window === 'undefined') {
  inicializarCronJobs();
}
