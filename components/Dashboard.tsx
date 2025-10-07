'use client';

import { useState, useEffect } from 'react';

interface ScrapingStatus {
  procesando: boolean;
  estado: string;
  jobs: Array<{
    nombre: string;
    activo: boolean;
    progreso?: number;
    inicio?: string;
    fin?: string;
  }>;
  timestamp: string;
}

export default function Dashboard() {
  const [scrapingStatus, setScrapingStatus] = useState<ScrapingStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Función para obtener el estado del scraping
  const fetchScrapingStatus = async () => {
    try {
      const response = await fetch('/api/scraping/status');
      const data = await response.json();
      setScrapingStatus(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error al obtener estado:', error);
    }
  };

  // Función para ejecutar scraping manual
  const ejecutarScraping = async () => {
    setIsLoading(true);
    setMessage('🚀 Iniciando scraping...');
    
    try {
      const response = await fetch('/api/scraping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tipo: 'manual' }),
      });
      
      const data = await response.json();
      
      if (data.estado === 'success') {
        setMessage(`✅ ${data.mensaje}`);
        
        // Iniciar polling para monitorear el progreso
        const interval = setInterval(async () => {
          await fetchScrapingStatus();
          
          // Verificar si el scraping terminó
          const currentStatus = await fetch('/api/scraping/status').then(r => r.json());
          if (!currentStatus.procesando) {
            clearInterval(interval);
            setIsLoading(false);
            setMessage('✅ Scraping completado exitosamente');
            
            // Actualizar contador de artículos
            setTimeout(() => {
              fetchScrapingStatus();
            }, 1000);
          }
        }, 2000); // Polling cada 2 segundos
        
        // Timeout de seguridad (5 minutos)
        setTimeout(() => {
          clearInterval(interval);
          setIsLoading(false);
          setMessage('⏰ Scraping completado (tiempo máximo alcanzado)');
        }, 300000);
        
      } else {
        setMessage(`❌ Error: ${data.mensaje || data.error}`);
        setIsLoading(false);
      }
    } catch (error) {
      setMessage('❌ Error de conexión');
      setIsLoading(false);
    }
  };

  // Cargar estado inicial
  useEffect(() => {
    fetchScrapingStatus();
    const interval = setInterval(fetchScrapingStatus, 10000); // Actualizar cada 10 segundos
    return () => clearInterval(interval);
  }, []);

  // Obtener el job de scraping manual
  const manualJob = scrapingStatus?.jobs.find(job => job.nombre === 'manual-scraping');
  const isProcessing = manualJob?.activo || false;
  const progress = manualJob?.progreso || 0;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard de Scraping</h1>
      
      {/* Estado del Scraping */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Estado del Scraping</h2>
        
        <div className="flex items-center gap-4 mb-4">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            isProcessing 
              ? 'bg-yellow-100 text-yellow-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {isProcessing ? '🔄 Procesando' : '✅ Disponible'}
          </div>
          
          {lastUpdate && (
            <span className="text-sm text-gray-500">
              Última actualización: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>

        {/* Barra de Progreso */}
        {isProcessing && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progreso del scraping</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Botón de Scraping */}
        <button
          onClick={ejecutarScraping}
          disabled={isLoading || isProcessing}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            isLoading || isProcessing
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isLoading || isProcessing ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              {isProcessing ? `Procesando... ${progress}%` : 'Iniciando...'}
            </span>
          ) : (
            '🚀 Ejecutar Scraping Manual'
          )}
        </button>

        {/* Mensaje de Estado */}
        {message && (
          <div className={`mt-4 p-3 rounded-lg ${
            message.includes('✅') 
              ? 'bg-green-100 text-green-800' 
              : message.includes('❌')
              ? 'bg-red-100 text-red-800'
              : 'bg-blue-100 text-blue-800'
          }`}>
            {message}
          </div>
        )}
      </div>

      {/* Información de Jobs */}
      {scrapingStatus?.jobs && scrapingStatus.jobs.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Jobs Activos</h2>
          <div className="space-y-2">
            {scrapingStatus.jobs.map((job, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium">{job.nombre}</span>
                  {job.progreso !== undefined && (
                    <span className="ml-2 text-sm text-gray-600">
                      ({job.progreso}%)
                    </span>
                  )}
                </div>
                <div className={`px-2 py-1 rounded text-xs ${
                  job.activo 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {job.activo ? 'Activo' : 'Inactivo'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}