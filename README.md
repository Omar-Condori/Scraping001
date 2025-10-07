# 🚀 Plataforma de Scraping Inteligente

Una aplicación web completa construida con Next.js 14, Prisma, PostgreSQL y Machine Learning para automatizar el scraping de contenido web con categorización inteligente.

## ✨ Características Principales

### 🔍 Sistema de Scraping
- **Scraping estático**: Integración con Hacker News
- **Scraping dinámico**: Fuentes personalizadas con selectores CSS configurables
- **Extracción inteligente**: Título, contenido, imágenes y metadatos
- **Manejo de errores**: Sistema robusto de logs y recuperación
- **Scraping automático**: Cron jobs programados cada 30 minutos

### 🧠 Machine Learning
- **Categorización automática**: Modelo de red neuronal con TensorFlow.js
- **Entrenamiento personalizado**: Usa tus propios datos para mejorar la precisión
- **Predicciones en tiempo real**: Clasifica artículos automáticamente
- **Dashboard ML**: Visualización de métricas y rendimiento del modelo

### 📊 Dashboard y Visualización
- **Estadísticas en tiempo real**: Métricas de scraping y rendimiento
- **Gráficos interactivos**: Distribución de categorías y fuentes
- **Gestión completa**: CRUD para artículos, fuentes y categorías
- **Interfaz moderna**: Diseño responsivo con TailwindCSS

### 🛠️ Tecnologías Utilizadas

**Frontend**
- Next.js 14.0.4 (App Router)
- TypeScript
- TailwindCSS
- Lucide React (íconos)
- Recharts (gráficos)

**Backend**
- Next.js API Routes
- Prisma ORM
- PostgreSQL
- Node-cron (tareas programadas)
- Axios (HTTP client)
- Cheerio (HTML parsing)

**Machine Learning**
- TensorFlow.js
- Red neuronal LSTM
- Embedding layers
- Categorización de texto

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- PostgreSQL 13+
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd scraping-platform
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env.local` basado en `env.example`:
```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/scraping_db"
NEXTAUTH_SECRET="tu-secreto-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Configurar la base de datos
```bash
# Generar cliente Prisma
npm run db:generate

# Crear y aplicar migraciones
npm run db:push

# (Opcional) Inicializar con datos de ejemplo
npm run init:data
```

### 5. Ejecutar la aplicación
```bash
# Modo desarrollo
npm run dev

# Modo producción
npm run build
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## 📖 Uso de la Aplicación

### Dashboard Principal
- Visualiza estadísticas generales del sistema
- Monitorea el estado de scraping automático
- Accede a gráficos de distribución de datos

### Gestión de Artículos
- Explora todos los artículos extraídos
- Filtra por categoría, fuente o fecha
- Elimina artículos no deseados
- Accede a contenido original

### Configuración de Fuentes
- Agrega nuevas fuentes de scraping
- Configura selectores CSS personalizados
- Establece límites de artículos por fuente
- Activa/desactiva fuentes según necesidad

### Categorías
- Crea y gestiona categorías personalizadas
- Asigna colores para identificación visual
- Organiza artículos por temas

### Machine Learning
- Entrena modelos con datos históricos
- Prueba predicciones en tiempo real
- Monitorea precisión del modelo
- Visualiza métricas de rendimiento

### Control de Scraping
- Ejecuta scraping manual inmediato
- Inicia/detiene scraping automático
- Monitorea estado de jobs programados
- Revisa resultados de ejecuciones

### Logs del Sistema
- Monitorea actividad del sistema
- Filtra logs por estado (éxito/error/advertencia)
- Revisa detalles de operaciones
- Identifica problemas rápidamente

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo
npm run build        # Construir para producción
npm run start        # Servidor de producción
npm run lint         # Linter de código

# Base de datos
npm run db:generate  # Generar cliente Prisma
npm run db:push      # Aplicar cambios al esquema
npm run db:migrate   # Crear migración
npm run db:studio    # Interfaz visual de BD

# Datos
npm run init:data    # Inicializar datos de ejemplo
```

## 🏗️ Arquitectura del Sistema

```
├── app/                    # App Router de Next.js
│   ├── api/               # API Routes
│   │   ├── articulos/     # CRUD artículos
│   │   ├── categorias/    # CRUD categorías
│   │   ├── fuentes/       # CRUD fuentes
│   │   ├── ml/           # Machine Learning API
│   │   ├── scraping/     # Control de scraping
│   │   ├── logs/         # Logs del sistema
│   │   └── estadisticas/ # Estadísticas generales
│   ├── articulos/         # Página de artículos
│   ├── categorias/        # Página de categorías
│   ├── fuentes/          # Página de fuentes
│   ├── ml/               # Página de ML
│   ├── logs/             # Página de logs
│   └── scraping/         # Página de control
├── components/           # Componentes React
├── lib/                  # Utilidades y servicios
│   ├── prisma.ts        # Cliente Prisma
│   ├── scraping.ts      # Servicio de scraping
│   ├── cron.ts          # Servicio de cron jobs
│   ├── ml.ts            # Modelo de ML
│   └── server-init.ts   # Inicialización del servidor
├── prisma/              # Esquema de base de datos
└── scripts/             # Scripts de utilidad
```

## 🤖 Machine Learning

El sistema incluye un modelo de red neuronal para categorización automática:

### Arquitectura del Modelo
- **Embedding Layer**: 64 dimensiones
- **LSTM Layer**: 64 unidades con dropout
- **Dense Layer**: 32 unidades con activación ReLU
- **Output Layer**: Softmax para clasificación

### Entrenamiento
- Datos: Títulos y contenido de artículos
- Vocabulario: Hasta 1000 palabras únicas
- Secuencia: Máximo 100 tokens por artículo
- Épocas: 10 iteraciones
- Batch size: 32

### Uso
1. Entrena el modelo con datos históricos
2. Prueba predicciones con texto nuevo
3. Monitorea precisión y métricas
4. Mejora iterativamente con más datos

## 🔄 Scraping Automático

El sistema ejecuta scraping programado:

- **Hacker News**: Cada 30 minutos
- **Fuentes personalizadas**: Cada hora
- **Horario**: 24/7
- **Límites**: Configurables por fuente
- **Timeout**: 15 segundos por fuente

## 📝 Logs y Monitoreo

Sistema completo de logging:
- Estados: éxito, error, advertencia
- Detalles: información técnica completa
- Filtros: por estado y fuente
- Historial: acceso completo a logs

## 🚀 Despliegue

### Variables de Entorno de Producción
```env
DATABASE_URL="postgresql://user:pass@host:5432/db"
NEXTAUTH_SECRET="secret-production"
NEXTAUTH_URL="https://yourdomain.com"
```

### Comandos de Despliegue
```bash
npm run build
npm start
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:
1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema

---

**¡Disfruta usando la Plataforma de Scraping Inteligente! 🎉**
