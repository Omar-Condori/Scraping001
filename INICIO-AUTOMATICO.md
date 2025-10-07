# 🚀 INICIO AUTOMÁTICO - PLATAFORMA DE SCRAPING

## 📋 **RESPUESTA A TU PREGUNTA:**

**❌ NO** - Si cierras el programa y lo abres mañana, **NO seguirá haciendo scraping automáticamente** por defecto.

**✅ SÍ** - Con las soluciones que he creado, **SÍ puede hacer scraping automático** cuando inicies el programa.

---

## 🛠️ **SOLUCIONES IMPLEMENTADAS:**

### **Opción 1: Inicio Automático Simple**
```bash
# Ejecutar este comando cada vez que abras el programa
npm run start:auto
```

### **Opción 2: Script de Inicio (Recomendado)**
```bash
# Hacer ejecutable una sola vez
chmod +x start-scraping.sh

# Ejecutar cada vez que abras el programa
./start-scraping.sh
```

### **Opción 3: PM2 (Producción)**
```bash
# Instalar PM2
npm install -g pm2

# Iniciar con PM2 (se mantiene corriendo)
npm run pm2:start

# Ver estado
npm run pm2:status

# Ver logs
npm run pm2:logs

# Detener
npm run pm2:stop
```

---

## ⏰ **CONFIGURACIÓN ACTUAL:**

- **Frecuencia**: Cada 30 minutos
- **Fuentes**: Solo las que agregaste manualmente
- **Categorización**: Automática por palabras clave
- **Logs**: Se guardan en la base de datos

---

## 🔄 **FLUJO DE TRABAJO RECOMENDADO:**

### **Para Uso Diario:**
1. Abrir terminal
2. Ir al directorio del proyecto: `cd /Users/omar/Documents/PageWeb/Scraping001`
3. Ejecutar: `./start-scraping.sh`
4. El scraping comenzará automáticamente cada 30 minutos

### **Para Uso Continuo (24/7):**
1. Instalar PM2: `npm install -g pm2`
2. Iniciar: `npm run pm2:start`
3. El sistema funcionará continuamente, incluso si cierras la terminal

---

## 📊 **VERIFICAR QUE FUNCIONA:**

1. **Ver logs en tiempo real:**
   ```bash
   npm run pm2:logs
   ```

2. **Ver estado del sistema:**
   ```bash
   npm run pm2:status
   ```

3. **Verificar scraping manual:**
   - Ir a http://localhost:3000/fuentes
   - Hacer clic en "Scraping"
   - Verificar que aparecen nuevos artículos

---

## 🚨 **IMPORTANTE:**

- **Desarrollo**: Usa `npm run dev` para desarrollo
- **Producción**: Usa `./start-scraping.sh` o PM2 para uso continuo
- **Datos**: Se guardan automáticamente en la base de datos SQLite
- **Exportar**: Usa `npm run export:csv` para exportar datos

---

## 💡 **RECOMENDACIÓN:**

Para uso diario, usa el **script de inicio** (`./start-scraping.sh`) porque:
- ✅ Inicia automáticamente el scraping
- ✅ Muestra información útil
- ✅ Fácil de usar
- ✅ No requiere configuración adicional

**¡Ahora tu plataforma hará scraping automáticamente cada vez que la inicies!** 🎉
