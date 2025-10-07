// Configuración de frecuencia de scraping
export const SCRAPING_CONFIG = {
  // Frecuencia en minutos
  FRECUENCIA_MINUTOS: 15,
  
  // Expresión cron correspondiente
  CRON_EXPRESSION: '*/15 * * * *',
  
  // Descripción legible
  DESCRIPCION: 'Cada 15 minutos'
};

// Función para obtener la expresión cron
export function getCronExpression(): string {
  return `*/${SCRAPING_CONFIG.FRECUENCIA_MINUTOS} * * * *`;
}

// Función para obtener la descripción
export function getDescripcion(): string {
  return SCRAPING_CONFIG.DESCRIPCION;
}
