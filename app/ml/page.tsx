'use client';

import { useState, useEffect } from 'react';
import { Brain, Play, Save, Upload, BarChart3, Target, Zap } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface EstadisticasML {
  estadisticas: {
    totalPalabras: number;
    totalCategorias: number;
    modeloEntrenado: boolean;
  };
  datosDisponibles: number;
  categoriasDisponibles: string[];
}

interface Prediccion {
  categoria: string;
  confianza: number;
}

export default function MLPage() {
  const [estadisticas, setEstadisticas] = useState<EstadisticasML | null>(null);
  const [loading, setLoading] = useState(true);
  const [entrenando, setEntrenando] = useState(false);
  const [textoPrueba, setTextoPrueba] = useState('');
  const [predicciones, setPredicciones] = useState<Prediccion[]>([]);
  const [precision, setPrecision] = useState<number | null>(null);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ml');
      const data = await response.json();
      setEstadisticas(data);
    } catch (error) {
      console.error('Error al cargar estadísticas ML:', error);
    } finally {
      setLoading(false);
    }
  };

  const entrenarModelo = async () => {
    try {
      setEntrenando(true);
      const response = await fetch('/api/ml', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accion: 'entrenar'
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setPrecision(data.precision);
        alert(`Modelo entrenado con ${data.precision.toFixed(2)}% de precisión`);
        cargarEstadisticas();
      } else {
        alert(data.error || 'Error al entrenar modelo');
      }
    } catch (error) {
      console.error('Error al entrenar modelo:', error);
      alert('Error al entrenar modelo');
    } finally {
      setEntrenando(false);
    }
  };

  const predecirCategoria = async () => {
    if (!textoPrueba.trim()) {
      alert('Por favor ingresa un texto para predecir');
      return;
    }

    try {
      const response = await fetch('/api/ml', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accion: 'predecir',
          datos: { texto: textoPrueba }
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setPredicciones(data.predicciones);
      } else {
        alert(data.error || 'Error al hacer predicción');
      }
    } catch (error) {
      console.error('Error al hacer predicción:', error);
      alert('Error al hacer predicción');
    }
  };

  const datosGrafico = estadisticas?.categoriasDisponibles.map(categoria => ({
    categoria,
    articulos: Math.floor(Math.random() * 50) + 10 // Datos simulados
  }));

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Machine Learning</h1>
              <p className="mt-2 text-gray-600">
                Entrena y utiliza modelos de IA para categorización automática
              </p>
            </div>

            {/* Cards de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Brain className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Estado del Modelo</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {estadisticas?.estadisticas.modeloEntrenado ? 'Entrenado' : 'No Entrenado'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Categorías</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {estadisticas?.estadisticas.totalCategorias || 0}
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
                    <p className="text-sm font-medium text-gray-500">Datos Disponibles</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {estadisticas?.datosDisponibles || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Controles de entrenamiento */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Entrenamiento del Modelo
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    Entrena el modelo con los artículos existentes para categorización automática
                  </p>
                  {precision && (
                    <p className="text-sm text-green-600 mt-1">
                      Última precisión: {(precision * 100).toFixed(2)}%
                    </p>
                  )}
                </div>
                <button
                  onClick={entrenarModelo}
                  disabled={entrenando || (estadisticas?.datosDisponibles || 0) < 10}
                  className="btn btn-primary btn-md"
                >
                  {entrenando ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Entrenando...
                    </>
                  ) : (
                    <>
                      <Play size={20} className="mr-2" />
                      Entrenar Modelo
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Prueba de predicción */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Prueba de Predicción
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="label">Texto para categorizar</label>
                  <textarea
                    className="input min-h-[100px] resize-none"
                    placeholder="Ingresa el título y contenido de un artículo para predecir su categoría..."
                    value={textoPrueba}
                    onChange={(e) => setTextoPrueba(e.target.value)}
                  />
                </div>
                <button
                  onClick={predecirCategoria}
                  disabled={!estadisticas?.estadisticas.modeloEntrenado}
                  className="btn btn-primary btn-md"
                >
                  <Zap size={20} className="mr-2" />
                  Predecir Categoría
                </button>
              </div>

              {/* Resultados de predicción */}
              {predicciones.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">
                    Resultados de la Predicción
                  </h4>
                  <div className="space-y-2">
                    {predicciones.slice(0, 5).map((prediccion, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-sm font-medium text-gray-900">
                          {prediccion.categoria}
                        </span>
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                            <div
                              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${prediccion.confianza * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-12 text-right">
                            {(prediccion.confianza * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Gráfico de categorías */}
            {datosGrafico && datosGrafico.length > 0 && (
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Distribución de Categorías
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={datosGrafico}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="categoria" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="articulos" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Información técnica */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Información Técnica
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-2">Arquitectura del Modelo</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Embedding Layer (64 dimensiones)</li>
                    <li>• LSTM Layer (64 unidades)</li>
                    <li>• Dense Layer (32 unidades)</li>
                    <li>• Output Layer (Softmax)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-2">Parámetros</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Vocabulario: {estadisticas?.estadisticas.totalPalabras || 0} palabras</li>
                    <li>• Secuencia máxima: 100 tokens</li>
                    <li>• Épocas: 10</li>
                    <li>• Batch size: 32</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
