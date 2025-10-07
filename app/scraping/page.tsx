'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Settings, Activity, Clock, CheckCircle, XCircle } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

interface EstadoJobs {
  jobs: Array<{
    nombre: string;
    activo: boolean;
  }>;
}

export default function ScrapingControlPage() {
  const [estadoJobs, setEstadoJobs] = useState<EstadoJobs | null>(null);
  const [ejecutando, setEjecutando] = useState(false);
  const [ultimoResultado, setUltimoResultado] = useState<any>(null);

  useEffect(() => {
    cargarEstadoJobs();
    const interval = setInterval(cargarEstadoJobs, 5000); // Actualizar cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  const cargarEstadoJobs = async () => {
    try {
      const response = await fetch('/api/scraping');
      const data = await response.json();
      setEstadoJobs(data);
    } catch (error) {
      console.error('Error al cargar estado de jobs:', error);
    }
  };

  const ejecutarScrapingManual = async () => {
    try {
      setEjecutando(true);
      const response = await fetch('/api/scraping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tipo: 'manual' }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setUltimoResultado(data);
        alert(`Scraping completado: ${data.fuentesPersonalizadas} artículos de fuentes personalizadas`);
        cargarEstadoJobs();
      } else {
        alert('Error al ejecutar scraping');
      }
    } catch (error) {
      console.error('Error al ejecutar scraping:', error);
      alert('Error al ejecutar scraping');
    } finally {
      setEjecutando(false);
    }
  };

  const toggleScrapingAutomatico = async (iniciar: boolean) => {
    try {
      const response = await fetch('/api/scraping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tipo: iniciar ? 'start' : 'stop' }),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(data.message);
        cargarEstadoJobs();
      } else {
        alert('Error al cambiar estado del scraping automático');
      }
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      alert('Error al cambiar estado del scraping automático');
    }
  };

  const scrapingAutomaticoActivo = estadoJobs?.jobs.some(job => job.activo) || false;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Control de Scraping</h1>
              <p className="mt-2 text-gray-600">
                Gestiona la ejecución manual y automática del scraping
              </p>
            </div>

            {/* Estado del sistema */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Scraping Automático</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Ejecución programada cada 30 minutos
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`flex items-center ${scrapingAutomaticoActivo ? 'text-green-600' : 'text-gray-400'}`}>
                      <Activity size={24} />
                      <span className="ml-2 text-sm font-medium">
                        {scrapingAutomaticoActivo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleScrapingAutomatico(!scrapingAutomaticoActivo)}
                      className={`btn btn-md ${
                        scrapingAutomaticoActivo ? 'btn-danger' : 'btn-primary'
                      }`}
                    >
                      {scrapingAutomaticoActivo ? (
                        <>
                          <Pause size={20} className="mr-2" />
                          Detener
                        </>
                      ) : (
                        <>
                          <Play size={20} className="mr-2" />
                          Iniciar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Scraping Manual</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Ejecutar scraping inmediatamente
                    </p>
                  </div>
                  <button
                    onClick={ejecutarScrapingManual}
                    disabled={ejecutando}
                    className="btn btn-primary btn-md"
                  >
                    {ejecutando ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Ejecutando...
                      </>
                    ) : (
                      <>
                        <RotateCcw size={20} className="mr-2" />
                        Ejecutar Ahora
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Estado de jobs */}
            {estadoJobs && (
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Estado de Jobs Automáticos
                </h3>
                <div className="space-y-3">
                  {estadoJobs.jobs.map((job) => (
                    <div key={job.nombre} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Clock size={20} className="text-gray-400 mr-3" />
                        <span className="text-sm font-medium text-gray-900">
                          {job.nombre === 'hacker-news' ? 'Hacker News' : 'Fuentes Personalizadas'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        {job.activo ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 mr-2" />
                        )}
                        <span className={`text-sm font-medium ${
                          job.activo ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {job.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Último resultado */}
            {ultimoResultado && (
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Último Resultado de Scraping
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-sm font-medium text-gray-900">Fuentes Personalizadas</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600 mt-2">
                      {ultimoResultado.fuentesPersonalizadas} artículos
                    </p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Total procesados: {ultimoResultado.fuentesPersonalizadas} artículos
                  </p>
                </div>
              </div>
            )}

            {/* Configuración */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Configuración de Scraping
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-2">Frecuencia Automática</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Hacker News: Cada 30 minutos</li>
                    <li>• Fuentes personalizadas: Cada hora</li>
                    <li>• Horario: 24/7</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-2">Límites por Ejecución</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Hacker News: 30 artículos</li>
                    <li>• Fuentes personalizadas: Según configuración</li>
                    <li>• Timeout: 15 segundos por fuente</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Logs recientes */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Actividad Reciente
              </h3>
              <div className="text-center py-8">
                <Settings className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Logs de actividad</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Los logs de scraping aparecerán aquí. Ve a la sección "Logs" para ver el historial completo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
