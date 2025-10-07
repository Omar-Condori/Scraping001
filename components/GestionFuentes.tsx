'use client';

import { useState, useEffect } from 'react';
import { Plus, Play, Pause, Settings, Trash2, Edit, Eye, Zap } from 'lucide-react';

interface Fuente {
  id: string;
  nombre: string;
  url: string;
  selectoresCss: any;
  categoriaId?: string;
  limiteArticulos: number;
  activa: boolean;
  createdAt: string;
  categoria?: {
    id: string;
    nombre: string;
    color: string;
  };
  _count: {
    logs: number;
  };
}

interface Categoria {
  id: string;
  nombre: string;
  color: string;
}

export default function GestionFuentes() {
  const [fuentes, setFuentes] = useState<Fuente[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [fuenteEditando, setFuenteEditando] = useState<Fuente | null>(null);

  useEffect(() => {
    cargarFuentes();
    cargarCategorias();
  }, []);

  const cargarFuentes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/fuentes');
      
      if (!response.ok) {
        console.error('Error al cargar fuentes:', response.statusText);
        setFuentes([]); // Asegurar que fuentes sea un array vacío
        return;
      }
      
      const data = await response.json();
      
      // Verificar que data es un array antes de establecerlo
      if (Array.isArray(data)) {
        setFuentes(data);
      } else {
        console.error('Datos de fuentes no son un array:', data);
        setFuentes([]); // Fallback a array vacío
      }
    } catch (error) {
      console.error('Error al cargar fuentes:', error);
      setFuentes([]); // Asegurar que fuentes sea un array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

  const cargarCategorias = async () => {
    try {
      const response = await fetch('/api/categorias');
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const toggleFuente = async (id: string, activa: boolean) => {
    try {
      await fetch(`/api/fuentes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ activa: !activa }),
      });
      cargarFuentes();
    } catch (error) {
      console.error('Error al cambiar estado de fuente:', error);
    }
  };

  const eliminarFuente = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta fuente?')) {
      return;
    }

    try {
      await fetch(`/api/fuentes/${id}`, {
        method: 'DELETE',
      });
      cargarFuentes();
    } catch (error) {
      console.error('Error al eliminar fuente:', error);
    }
  };

  const ejecutarScrapingFuente = async (fuente: Fuente) => {
    try {
      const response = await fetch('/api/scraping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipo: 'fuente',
          fuenteId: fuente.id,
          url: fuente.url,
          selectores: fuente.selectoresCss
        }),
      });
      
      if (response.ok) {
        alert('Scraping ejecutado correctamente');
        cargarFuentes();
      } else {
        alert('Error al ejecutar scraping');
      }
    } catch (error) {
      console.error('Error al ejecutar scraping:', error);
      alert('Error al ejecutar scraping');
    }
  };

  const ejecutarScrapingTodasLasFuentes = async () => {
    try {
      const response = await fetch('/api/scraping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipo: 'manual'
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        alert(`Scraping completado: ${result.fuentesPersonalizadas} artículos extraídos`);
        cargarFuentes();
      } else {
        alert('Error al ejecutar scraping de todas las fuentes');
      }
    } catch (error) {
      console.error('Error al ejecutar scraping:', error);
      alert('Error al ejecutar scraping de todas las fuentes');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fuentes</h1>
          <p className="mt-2 text-gray-600">
            Gestiona las fuentes de datos para scraping
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={ejecutarScrapingTodasLasFuentes}
            className="btn btn-success btn-md"
            title="Ejecutar scraping de todas las fuentes activas"
          >
            <Zap size={20} className="mr-2" />
            Scraping
          </button>
          <button
            onClick={() => {
              setFuenteEditando(null);
              setMostrarFormulario(true);
            }}
            className="btn btn-primary btn-md"
          >
            <Plus size={20} className="mr-2" />
            Nueva Fuente
          </button>
        </div>
      </div>

      {/* Lista de fuentes */}
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fuente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {fuentes.map((fuente) => (
                  <tr key={fuente.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {fuente.nombre}
                        </p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {fuente.url}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          fuente.activa
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {fuente.activa ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => ejecutarScrapingFuente(fuente)}
                          className="text-green-600 hover:text-green-900"
                          title="Ejecutar scraping"
                        >
                          <Play size={16} />
                        </button>
                        <button
                          onClick={() => toggleFuente(fuente.id, fuente.activa)}
                          className={`hover:text-gray-900 ${
                            fuente.activa ? 'text-yellow-600' : 'text-green-600'
                          }`}
                          title={fuente.activa ? 'Desactivar' : 'Activar'}
                        >
                          {fuente.activa ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                        <button
                          onClick={() => {
                            setFuenteEditando(fuente);
                            setMostrarFormulario(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => eliminarFuente(fuente.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Formulario de fuente */}
      {mostrarFormulario && (
        <FormularioFuente
          fuente={fuenteEditando}
          categorias={categorias}
          onClose={() => {
            setMostrarFormulario(false);
            setFuenteEditando(null);
          }}
          onSuccess={() => {
            setMostrarFormulario(false);
            setFuenteEditando(null);
            cargarFuentes();
          }}
        />
      )}
    </div>
  );
}

interface FormularioFuenteProps {
  fuente?: Fuente | null;
  categorias: Categoria[];
  onClose: () => void;
  onSuccess: () => void;
}

function FormularioFuente({ fuente, categorias, onClose, onSuccess }: FormularioFuenteProps) {
  const [formData, setFormData] = useState({
    nombre: fuente?.nombre || '',
    url: fuente?.url || '',
    activa: fuente?.activa ?? true
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = fuente ? `/api/fuentes/${fuente.id}` : '/api/fuentes';
      const method = fuente ? 'PUT' : 'POST';

      // Usar selectores CSS por defecto para simplificar
      const selectoresCss = {
        titulo: 'h1, h2, h3, .title, .article-title',
        contenido: 'p, .content, .article-body, .text',
        imagen: 'img, .image, .thumbnail',
        enlaces: 'a, .link, .read-more'
      };

      const dataToSend = {
        ...formData,
        limiteArticulos: 50, // Valor por defecto
        selectoresCss: JSON.stringify(selectoresCss)
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        onSuccess();
      } else {
        alert('Error al guardar fuente');
      }
    } catch (error) {
      console.error('Error al guardar fuente:', error);
      alert('Error al guardar fuente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {fuente ? 'Editar Fuente' : 'Nueva Fuente'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Nombre</label>
              <input
                type="text"
                required
                className="input"
                placeholder="Ej: RPP Noticias"
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
              />
            </div>

            <div>
              <label className="label">URL</label>
              <input
                type="url"
                required
                className="input"
                placeholder="https://ejemplo.com"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="activa"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                checked={formData.activa}
                onChange={(e) => setFormData(prev => ({ ...prev, activa: e.target.checked }))}
              />
              <label htmlFor="activa" className="ml-2 text-sm text-gray-900">
                Fuente activa
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary btn-md"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-md"
                disabled={loading}
              >
                {loading ? 'Guardando...' : (fuente ? 'Actualizar' : 'Agregar')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
