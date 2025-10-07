#!/bin/bash

echo "📊 ESTADO ACTUAL DEL SCRAPING"
echo "=============================="
echo ""

# Verificar si el servidor está corriendo
if curl -s http://localhost:3000/api/scraping > /dev/null 2>&1; then
    echo "✅ Servidor: Activo (http://localhost:3000)"
else
    echo "❌ Servidor: No disponible"
    echo "   Ejecuta: npm run dev"
    exit 1
fi

echo ""

# Obtener estado de los jobs
echo "🔄 Estado de Jobs de Scraping:"
curl -s http://localhost:3000/api/scraping | jq -r '.jobs[] | "   • \(.nombre): \(.activo // "N/A")"' 2>/dev/null || echo "   • No se pudo obtener el estado"

echo ""

# Verificar configuración actual
echo "⚙️  Configuración Actual:"
if [ -f "lib/cron.ts" ]; then
    CRON_LINE=$(grep "cron.schedule" lib/cron.ts | head -1)
    echo "   • Expresión cron: $CRON_LINE"
    
    # Interpretar la frecuencia
    if echo "$CRON_LINE" | grep -q "*/30"; then
        echo "   • Frecuencia: Cada 30 minutos"
    elif echo "$CRON_LINE" | grep -q "*/15"; then
        echo "   • Frecuencia: Cada 15 minutos"
    elif echo "$CRON_LINE" | grep -q "0 \* \* \* \*"; then
        echo "   • Frecuencia: Cada hora"
    elif echo "$CRON_LINE" | grep -q "0 \*/2 \* \* \*"; then
        echo "   • Frecuencia: Cada 2 horas"
    else
        echo "   • Frecuencia: Personalizada"
    fi
else
    echo "   • Archivo de configuración no encontrado"
fi

echo ""

# Mostrar próximas ejecuciones estimadas
echo "⏰ Próximas Ejecuciones Estimadas:"
CURRENT_TIME=$(date)
echo "   • Ahora: $CURRENT_TIME"

# Calcular próximas ejecuciones basadas en la configuración
if echo "$CRON_LINE" | grep -q "*/30"; then
    NEXT_30=$(date -d "+30 minutes" "+%H:%M")
    echo "   • Próxima (30min): $NEXT_30"
elif echo "$CRON_LINE" | grep -q "*/15"; then
    NEXT_15=$(date -d "+15 minutes" "+%H:%M")
    echo "   • Próxima (15min): $NEXT_15"
elif echo "$CRON_LINE" | grep -q "0 \* \* \* \*"; then
    NEXT_HOUR=$(date -d "+1 hour" "+%H:%M")
    echo "   • Próxima (1h): $NEXT_HOUR"
fi

echo ""

# Mostrar estadísticas de artículos
echo "📈 Estadísticas de Artículos:"
TOTAL_ARTICULOS=$(curl -s http://localhost:3000/api/articulos | jq '.length' 2>/dev/null || echo "N/A")
echo "   • Total de artículos: $TOTAL_ARTICULOS"

echo ""

# Mostrar comandos útiles
echo "🛠️  Comandos Útiles:"
echo "   • Scraping manual: curl -X POST http://localhost:3000/api/scraping -H 'Content-Type: application/json' -d '{\"tipo\": \"manual\"}'"
echo "   • Cambiar frecuencia: ./config-scraping.sh [minutos]"
echo "   • Ver logs: npm run pm2:logs (si usas PM2)"
echo "   • Reiniciar: npm run pm2:restart (si usas PM2)"
