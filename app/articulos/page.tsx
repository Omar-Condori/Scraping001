'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ListaArticulos from '@/components/ListaArticulos';

export default function ArticulosPage() {
  const [articulos, setArticulos] = useState<any[]>([]);
  const [estadisticas, setEstadisticas] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState<Date | null>(null);

  useEffect(() => {
    fetchArticulos();
    fetchEstadisticas();
  }, []);

  const fetchEstadisticas = async () => {
    try {
      const response = await fetch('/api/estadisticas');
      if (!response.ok) throw new Error('Error al cargar estadísticas');
      const data = await response.json();
      setEstadisticas(data);
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    }
  };

  const fetchArticulos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/articulos');
      if (!response.ok) throw new Error('Error al cargar noticias');
      const data = await response.json();
      
      // Ordenar noticias por fecha (más recientes primero)
      const noticiasOrdenadas = (data.articulos || []).sort((a: any, b: any) => 
        new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );
      
      setArticulos(noticiasOrdenadas);
      setUltimaActualizacion(new Date());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      
      // Ejecutar scraping primero
      const scrapingResponse = await fetch('/api/scraping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipo: 'manual'
        }),
      });
      
      if (scrapingResponse.ok) {
        const scrapingResult = await scrapingResponse.json();
        console.log('Scraping completado:', scrapingResult);
        
             // Luego cargar las noticias actualizadas
             await fetchArticulos();
             await fetchEstadisticas();
        
        // Mostrar mensaje de éxito
        alert(`Scraping completado: ${scrapingResult.fuentesPersonalizadas} noticias extraídas`);
      } else {
        throw new Error('Error al ejecutar scraping');
      }
    } catch (err) {
      console.error('Error al actualizar:', err);
      alert('Error al ejecutar scraping');
      // Aún así, intentar cargar las noticias existentes
      await fetchArticulos();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando noticias...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error al cargar noticias</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={handleRefresh}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  📰 Noticias Scrapeadas
                </h1>
                <p className="text-gray-600">
                  Todas las noticias extraídas de las fuentes configuradas
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
                  <span className="text-sm text-gray-500">Total:</span>
                  <span className="ml-2 font-semibold text-blue-600">{articulos.length}</span>
                </div>
                {ultimaActualizacion && (
                  <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
                    <span className="text-sm text-gray-500">Última actualización:</span>
                    <span className="ml-2 text-sm text-gray-700">
                      {ultimaActualizacion.toLocaleTimeString('es-ES')}
                    </span>
                  </div>
                )}
                <button 
                  onClick={handleRefresh}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  disabled={loading}
                >
                  <span>{loading ? '⏳' : '🔄'}</span>
                  <span>{loading ? 'Actualizando...' : 'Actualizar'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Estadísticas rápidas */}
          {estadisticas && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">📰</div>
                  <div>
                    <p className="text-sm text-gray-500">Total Noticias</p>
                    <p className="text-xl font-bold text-gray-900">{estadisticas.resumen.totalArticulos}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">🏷️</div>
                  <div>
                    <p className="text-sm text-gray-500">Categorías</p>
                    <p className="text-xl font-bold text-gray-900">{estadisticas.resumen.totalCategorias}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">🌐</div>
                  <div>
                    <p className="text-sm text-gray-500">Fuentes</p>
                    <p className="text-xl font-bold text-gray-900">{estadisticas.resumen.totalFuentes}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">🤖</div>
                  <div>
                    <p className="text-sm text-gray-500">Clasificados</p>
                    <p className="text-xl font-bold text-gray-900">{estadisticas.resumen.totalClasificados}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lista de artículos */}
          {articulos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📰</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No hay noticias disponibles</h3>
              <p className="text-gray-600 mb-6">
                Ejecuta el scraping para obtener noticias de las fuentes configuradas
              </p>
              <a 
                href="/scraping"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
              >
                <span>🚀</span>
                <span>Ejecutar Scraping</span>
              </a>
            </div>
          ) : (
            <ListaArticulos articulos={articulos} onRefresh={handleRefresh} />
          )}
        </div>
      </main>
    </div>
  );
}
