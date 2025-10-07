'use client';

import { useState, useEffect } from 'react';
import { BarChart3, FileText, Globe, AlertCircle, TrendingUp, RefreshCw } from 'lucide-react';

export default function Dashboard() {
  const [estadisticas, setEstadisticas] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Cargando estadísticas...');
      const response = await fetch('/api/estadisticas');
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Datos cargados:', data);
      
      setEstadisticas(data);
    } catch (error) {
      console.error('❌ Error al cargar estadísticas:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Cargando estadísticas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar datos</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={cargarEstadisticas}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!estadisticas) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay datos disponibles</h3>
          <button 
            onClick={cargarEstadisticas}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Cargar datos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Resumen de la plataforma de scraping</p>
        </div>
        <button 
          onClick={cargarEstadisticas}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </button>
      </div>

      {/* Resumen Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Artículos</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.resumen?.totalArticulos || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Globe className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Fuentes</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.resumen?.totalFuentes || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categorías</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.resumen?.totalCategorias || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Clasificados</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.resumen?.totalClasificados || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Errores</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.resumen?.erroresRecientes || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado del Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Artículos por Categoría</h4>
            <div className="space-y-2">
              {estadisticas.articulosPorCategoria?.slice(0, 5).map((categoria: any) => (
                <div key={categoria.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{categoria.nombre}</span>
                  <span className="text-sm font-medium text-gray-900">{categoria._count?.articulos || 0}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Fuentes Activas</h4>
            <div className="space-y-2">
              {estadisticas.articulosPorFuente?.slice(0, 5).map((fuente: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{fuente.fuente}</span>
                  <span className="text-sm font-medium text-gray-900">{fuente._count?.fuente || 0}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Logs Recientes */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Logs Recientes</h3>
        <div className="space-y-3">
          {estadisticas.logsRecientes?.slice(0, 5).map((log: any) => (
            <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-3 ${
                  log.estado === 'success' ? 'bg-green-500' : 
                  log.estado === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                }`}></div>
                <span className="text-sm text-gray-700">{log.mensaje}</span>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(log.fecha).toLocaleString('es-ES')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}