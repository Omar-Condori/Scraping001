#!/bin/bash

# Script simple para cambiar la frecuencia de scraping
# Uso: ./cambiar-frecuencia.sh [minutos]

FRECUENCIA=${1:-30}

echo "🔧 Cambiando frecuencia de scraping a cada $FRECUENCIA minutos..."

# Actualizar directamente el archivo cron.ts
sed -i.bak "s/cron\.schedule('[^']*'/cron.schedule('*\/$FRECUENCIA * * * *'/g" lib/cron.ts

echo "✅ Frecuencia actualizada a cada $FRECUENCIA minutos"
echo "🔄 Expresión cron: */$FRECUENCIA * * * *"
echo ""
echo "⚠️  Para aplicar los cambios:"
echo "   1. Reinicia el servidor: Ctrl+C y luego npm run dev"
echo "   2. O usa: npm run pm2:restart (si usas PM2)"
echo ""
echo "📊 Frecuencias comunes:"
echo "   • 5 minutos: ./cambiar-frecuencia.sh 5"
echo "   • 15 minutos: ./cambiar-frecuencia.sh 15"
echo "   • 30 minutos: ./cambiar-frecuencia.sh 30"
echo "   • 1 hora: ./cambiar-frecuencia.sh 60"
echo "   • 2 horas: ./cambiar-frecuencia.sh 120"
