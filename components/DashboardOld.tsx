'use client';

import { useState, useEffect } from 'react';
import { BarChart3, FileText, Globe, AlertCircle, TrendingUp, Clock, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

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

  const datosCategoria = estadisticas.articulosPorCategoria.map(cat => ({
    name: cat.nombre,
    value: cat._count.articulos,
    color: cat.color
  }));

  const datosFuente = estadisticas.articulosPorFuente.map(fuente => ({
    name: fuente.fuente,
    articulos: fuente._count.fuente
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Resumen general de la plataforma de scraping
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {ultimaActualizacion && (
            <div className="text-sm text-gray-500">
              Última actualización: {ultimaActualizacion.toLocaleTimeString('es-ES')}
            </div>
          )}
          <button
            onClick={() => cargarEstadisticas(true)}
            disabled={refreshing}
            className="btn btn-secondary btn-md flex items-center space-x-2"
          >
            <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
            <span>{refreshing ? 'Actualizando...' : 'Actualizar'}</span>
          </button>
        </div>
      </div>

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Noticias</p>
              <p className="text-2xl font-semibold text-gray-900">
                {estadisticas.resumen.totalArticulos.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Categorías</p>
              <p className="text-2xl font-semibold text-gray-900">
                {estadisticas.resumen.totalCategorias}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Globe className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Fuentes Activas</p>
              <p className="text-2xl font-semibold text-gray-900">
                {estadisticas.resumen.totalFuentes}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Clasificados</p>
              <p className="text-2xl font-semibold text-gray-900">
                {estadisticas.resumen.totalClasificados}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Errores</p>
              <p className="text-2xl font-semibold text-gray-900">
                {estadisticas.resumen.erroresRecientes}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de noticias por categoría */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Noticias por Categoría
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={datosCategoria}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {datosCategoria.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de noticias por fuente */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Noticias por Fuente
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datosFuente}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="articulos" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Logs recientes */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Actividad Reciente
          </h3>
          <Clock className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-3">
          {estadisticas.logsRecientes.map((log) => (
            <div key={log.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-3 ${
                  log.estado === 'success' ? 'bg-green-500' :
                  log.estado === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                }`} />
                <span className="text-sm text-gray-900">{log.mensaje}</span>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(log.fecha).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
