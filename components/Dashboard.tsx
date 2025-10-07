'use client';

import { useState, useEffect } from 'react';
import { BarChart3, FileText, Globe, AlertCircle, TrendingUp, Clock, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface Estadisticas {
  resumen: {
    totalArticulos: number;
    totalFuentes: number;
    totalCategorias: number;
    totalClasificados: number;
    erroresRecientes: number;
  };
  articulosPorCategoria: Array<{
    id: string;
    nombre: string;
    color: string;
    _count: { articulos: number };
  }>;
  articulosPorFuente: Array<{
    fuente: string;
    _count: { fuente: number };
  }>;
  logsRecientes: Array<{
    id: string;
    fecha: string;
    estado: string;
    mensaje: string;
  }>;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16', '#ec4899', '#6366f1'];

export default function Dashboard() {
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [ultimaActualizacion, setUltimaActualizacion] = useState<Date | null>(null);

  useEffect(() => {
    cargarEstadisticas();
    
    // Actualizar estadísticas cada 30 segundos
    const interval = setInterval(cargarEstadisticas, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const cargarEstadisticas = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setRefreshing(true);
      }
      // Agregar timestamp para evitar cache del navegador
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/estadisticas?t=${timestamp}`);
      const data = await response.json();
      console.log('📊 Dashboard - Datos cargados:', data.resumen);
      setEstadisticas(data);
      setUltimaActualizacion(new Date());
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
      if (isManualRefresh) {
        setRefreshing(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!estadisticas) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error al cargar datos</h3>
        <p className="mt-1 text-sm text-gray-500">No se pudieron cargar las estadísticas</p>
      </div>
    );
  }

  // Preparar datos para gráficos con mejor formato
  const datosCategoria = estadisticas.articulosPorCategoria
    .filter(cat => cat._count.articulos > 0) // Solo mostrar categorías con artículos
    .map((cat, index) => ({
      name: cat.nombre.length > 15 ? cat.nombre.substring(0, 15) + '...' : cat.nombre, // Truncar nombres largos
      fullName: cat.nombre,
      value: cat._count.articulos,
      color: cat.color || COLORS[index % COLORS.length]
    }));

  const datosFuente = estadisticas.articulosPorFuente.map(fuente => ({
    name: fuente.fuente.length > 20 ? fuente.fuente.substring(0, 20) + '...' : fuente.fuente, // Truncar nombres largos
    fullName: fuente.fuente,
    articulos: fuente._count.fuente
  }));

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 lg:mt-2 text-sm lg:text-base text-gray-600">
            Resumen general de la plataforma de scraping
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          {ultimaActualizacion && (
            <div className="text-xs sm:text-sm text-gray-500">
              Última actualización: {ultimaActualizacion.toLocaleTimeString('es-ES')}
            </div>
          )}
          <button
            onClick={() => cargarEstadisticas(true)}
            disabled={refreshing}
            className="btn btn-secondary btn-sm sm:btn-md flex items-center space-x-2 w-full sm:w-auto"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            <span>{refreshing ? 'Actualizando...' : 'Actualizar'}</span>
          </button>
        </div>
      </div>

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
        <div className="card p-4 lg:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
            </div>
            <div className="ml-3 lg:ml-4">
              <p className="text-xs lg:text-sm font-medium text-gray-500">Total Noticias</p>
              <p className="text-lg lg:text-2xl font-semibold text-gray-900">
                {estadisticas.resumen.totalArticulos.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-4 lg:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BarChart3 className="h-6 w-6 lg:h-8 lg:w-8 text-green-600" />
            </div>
            <div className="ml-3 lg:ml-4">
              <p className="text-xs lg:text-sm font-medium text-gray-500">Categorías</p>
              <p className="text-lg lg:text-2xl font-semibold text-gray-900">
                {estadisticas.resumen.totalCategorias}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-4 lg:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Globe className="h-6 w-6 lg:h-8 lg:w-8 text-purple-600" />
            </div>
            <div className="ml-3 lg:ml-4">
              <p className="text-xs lg:text-sm font-medium text-gray-500">Fuentes Activas</p>
              <p className="text-lg lg:text-2xl font-semibold text-gray-900">
                {estadisticas.resumen.totalFuentes}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-4 lg:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-6 w-6 lg:h-8 lg:w-8 text-orange-600" />
            </div>
            <div className="ml-3 lg:ml-4">
              <p className="text-xs lg:text-sm font-medium text-gray-500">Clasificados</p>
              <p className="text-lg lg:text-2xl font-semibold text-gray-900">
                {estadisticas.resumen.totalClasificados}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-4 lg:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertCircle className="h-6 w-6 lg:h-8 lg:w-8 text-red-600" />
            </div>
            <div className="ml-3 lg:ml-4">
              <p className="text-xs lg:text-sm font-medium text-gray-500">Errores</p>
              <p className="text-lg lg:text-2xl font-semibold text-gray-900">
                {estadisticas.resumen.erroresRecientes}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {/* Gráfico de noticias por categoría */}
        <div className="card p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">
            Noticias por Categoría
          </h3>
          <div className="h-64 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={datosCategoria}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => 
                    percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : '' // Solo mostrar etiquetas si el porcentaje es > 5%
                  }
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {datosCategoria.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any, name: any, props: any) => [
                    `${value} artículos`, 
                    props.payload.fullName
                  ]}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value: any, entry: any) => (
                    <span style={{ color: entry.color, fontSize: '12px' }}>
                      {entry.payload.fullName}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de noticias por fuente */}
        <div className="card p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">
            Noticias por Fuente
          </h3>
          {datosFuente.length <= 15 ? (
            // Gráfico de barras para pocas fuentes
            <div className="h-64 lg:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={datosFuente} 
                  margin={{ top: 20, right: 30, left: 20, bottom: datosFuente.length > 8 ? 100 : 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={datosFuente.length > 8 ? -45 : -30}
                    textAnchor="end"
                    height={datosFuente.length > 8 ? 120 : 80}
                    fontSize={datosFuente.length > 10 ? 10 : 12}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    formatter={(value: any, name: any, props: any) => [
                      `${value} artículos`, 
                      props.payload.fullName
                    ]}
                  />
                  <Bar dataKey="articulos" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            // Tabla para muchas fuentes
            <div className="h-64 lg:h-80 overflow-y-auto">
              <div className="space-y-2">
                {datosFuente
                  .sort((a, b) => b.articulos - a.articulos)
                  .slice(0, 20)
                  .map((fuente, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-900 truncate max-w-xs" title={fuente.fullName}>
                          {fuente.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ 
                              width: `${Math.min((fuente.articulos / Math.max(...datosFuente.map(f => f.articulos))) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-700 min-w-[3rem] text-right">
                          {fuente.articulos}
                        </span>
                      </div>
                    </div>
                  ))}
                {datosFuente.length > 20 && (
                  <div className="text-center text-xs text-gray-500 py-2">
                    Y {datosFuente.length - 20} fuentes más...
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Logs recientes */}
      <div className="card p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base lg:text-lg font-semibold text-gray-900">
            Actividad Reciente
          </h3>
          <Clock className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400" />
        </div>
        <div className="space-y-2 lg:space-y-3">
          {estadisticas.logsRecientes.map((log) => (
            <div key={log.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 border-b border-gray-100 last:border-b-0 gap-1 sm:gap-0">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-3 ${
                  log.estado === 'success' ? 'bg-green-500' :
                  log.estado === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                }`} />
                <span className="text-xs lg:text-sm text-gray-900 truncate">{log.mensaje}</span>
              </div>
              <span className="text-xs text-gray-500 ml-5 sm:ml-0">
                {new Date(log.fecha).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
