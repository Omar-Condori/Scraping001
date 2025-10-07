#!/bin/bash

# Script para configurar la frecuencia de scraping
# Uso: ./config-scraping.sh [frecuencia]
# Ejemplos:
#   ./config-scraping.sh 15    # Cada 15 minutos
#   ./config-scraping.sh 30    # Cada 30 minutos  
#   ./config-scraping.sh 60    # Cada hora
#   ./config-scraping.sh 120   # Cada 2 horas

FRECUENCIA=${1:-30}  # Por defecto 30 minutos

echo "🔧 Configurando frecuencia de scraping a cada $FRECUENCIA minutos..."

# Crear archivo de configuración
cat > lib/scraping-config.ts << EOF
// Configuración de frecuencia de scraping
export const SCRAPING_CONFIG = {
  // Frecuencia en minutos
  FRECUENCIA_MINUTOS: $FRECUENCIA,
  
  // Expresión cron correspondiente
  CRON_EXPRESSION: '*/$FRECUENCIA * * * *',
  
  // Descripción legible
  DESCRIPCION: 'Cada $FRECUENCIA minutos'
};

// Función para obtener la expresión cron
export function getCronExpression(): string {
  return \`*/\${SCRAPING_CONFIG.FRECUENCIA_MINUTOS} * * * *\`;
}

// Función para obtener la descripción
export function getDescripcion(): string {
  return SCRAPING_CONFIG.DESCRIPCION;
}
EOF

echo "✅ Configuración creada en lib/scraping-config.ts"
echo "📅 Frecuencia: Cada $FRECUENCIA minutos"
echo "🔄 Expresión cron: */$FRECUENCIA * * * *"
echo ""
echo "⚠️  Para aplicar los cambios:"
echo "   1. Reinicia el servidor: Ctrl+C y luego npm run dev"
echo "   2. O usa: npm run pm2:restart (si usas PM2)"
echo ""
echo "📊 Opciones comunes:"
echo "   • 15 minutos: */15 * * * *"
echo "   • 30 minutos: */30 * * * *" 
echo "   • 1 hora: 0 * * * *"
echo "   • 2 horas: 0 */2 * * *"
echo "   • 6 horas: 0 */6 * * *"
echo "   • 12 horas: 0 */12 * * *"
echo "   • 24 horas: 0 0 * * *"
