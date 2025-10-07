'use client';

import { useState, useEffect } from 'react';

export default function DashboardTest() {
  const [estadisticas, setEstadisticas] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      console.log('🔄 Cargando estadísticas...');
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/estadisticas?t=${timestamp}`);
      const data = await response.json();
      console.log('📊 Datos recibidos:', data.resumen);
      setEstadisticas(data.resumen);
    } catch (error) {
      console.error('❌ Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Test</h1>
        <p className="mt-2 text-gray-600">Prueba de estadísticas en tiempo real</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="text-2xl mr-3">📰</div>
            <div>
              <p className="text-sm text-gray-500">Total Noticias</p>
              <p className="text-2xl font-bold text-gray-900">
                {estadisticas?.totalArticulos || 'Cargando...'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="text-2xl mr-3">🏷️</div>
            <div>
              <p className="text-sm text-gray-500">Categorías</p>
              <p className="text-2xl font-bold text-gray-900">
                {estadisticas?.totalCategorias || 'Cargando...'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="text-2xl mr-3">🌐</div>
            <div>
              <p className="text-sm text-gray-500">Fuentes</p>
              <p className="text-2xl font-bold text-gray-900">
                {estadisticas?.totalFuentes || 'Cargando...'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="text-2xl mr-3">🤖</div>
            <div>
              <p className="text-sm text-gray-500">Clasificados</p>
              <p className="text-2xl font-bold text-gray-900">
                {estadisticas?.totalClasificados || 'Cargando...'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="text-2xl mr-3">⚠️</div>
            <div>
              <p className="text-sm text-gray-500">Errores</p>
              <p className="text-2xl font-bold text-gray-900">
                {estadisticas?.erroresRecientes || 'Cargando...'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Datos Raw</h3>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
          {JSON.stringify(estadisticas, null, 2)}
        </pre>
      </div>

      <button
        onClick={cargarEstadisticas}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        🔄 Actualizar Datos
      </button>
    </div>
  );
}
