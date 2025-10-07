#!/bin/bash

# Script de inicio automático para Plataforma de Scraping
# Ejecutar: chmod +x start-scraping.sh && ./start-scraping.sh

echo "🚀 Iniciando Plataforma de Scraping Inteligente..."
echo "📅 Fecha: $(date)"
echo "👤 Usuario: $(whoami)"
echo "📂 Directorio: $(pwd)"

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Instálalo desde https://nodejs.org/"
    exit 1
fi

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado."
    exit 1
fi

# Instalar dependencias si es necesario
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Crear directorio de logs si no existe
mkdir -p logs

# Iniciar el servidor con scraping automático
echo "🔄 Iniciando servidor con scraping automático..."
echo "⏰ El scraping se ejecutará cada 30 minutos automáticamente"
echo "🌐 Accede a: http://localhost:3000"
echo ""
echo "💡 Para detener: Ctrl+C"
echo "📋 Para ver logs: tail -f logs/combined.log"
echo ""

# Ejecutar el servidor
npm run start:auto
