#!/bin/bash

echo "🚀 Iniciando Plataforma de Scraping Inteligente..."
echo "📅 Fecha: $(date)"
echo ""

# Verificar si estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ No estás en el directorio correcto del proyecto"
    echo "💡 Ejecuta: cd /Users/omar/Documents/PageWeb/Scraping001"
    exit 1
fi

# Instalar dependencias si es necesario
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

echo "🔄 Iniciando servidor con scraping automático..."
echo "⏰ El scraping se ejecutará cada 30 minutos"
echo "🌐 Accede a: http://localhost:3000"
echo ""
echo "💡 Para detener: Ctrl+C"
echo ""

# Iniciar el servidor de desarrollo con scraping automático
npm run dev
