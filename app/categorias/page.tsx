'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

interface Categoria {
  id: string;
  nombre: string;
  descripcion?: string;
  color: string;
  createdAt: string;
  _count: {
    articulos: number;
    fuentes: number;
  };
}

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(null);

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categorias');
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarCategoria = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      return;
    }

    try {
      await fetch(`/api/categorias/${id}`, {
        method: 'DELETE',
      });
      cargarCategorias();
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Categorías</h1>
                <p className="mt-2 text-gray-600">
                  Gestiona las categorías para organizar los artículos
                </p>
              </div>
              <button
                onClick={() => {
                  setCategoriaEditando(null);
                  setMostrarFormulario(true);
                }}
                className="btn btn-primary btn-md"
              >
                <Plus size={20} className="mr-2" />
                Nueva Categoría
              </button>
            </div>

            {/* Lista de categorías */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                categorias.map((categoria) => (
                  <div key={categoria.id} className="card p-6 hover:shadow-md transition-shadow cursor-pointer group" onClick={() => window.location.href = `/categorias/${categoria.id}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: categoria.color }}
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {categoria.nombre}
                          </h3>
                          {categoria.descripcion && (
                            <p className="text-sm text-gray-600 mt-1">
                              {categoria.descripcion}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCategoriaEditando(categoria);
                            setMostrarFormulario(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            eliminarCategoria(categoria.id);
                          }}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Tag size={16} className="mr-1" />
                        {categoria._count.articulos} artículos
                      </div>
                      <div>
                        {categoria._count.fuentes} fuentes
                      </div>
                    </div>

                    <div className="mt-3">
                      <div
                        className="h-2 rounded-full"
                        style={{ backgroundColor: categoria.color + '20' }}
                      >
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ 
                            backgroundColor: categoria.color,
                            width: `${Math.min(100, (categoria._count.articulos / 100) * 100)}%`
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* Indicador de clic */}
                    <div className="mt-3 text-xs text-gray-400 group-hover:text-blue-500 transition-colors">
                      Haz clic para ver noticias de esta categoría →
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Formulario de categoría */}
            {mostrarFormulario && (
              <FormularioCategoria
                categoria={categoriaEditando}
                onClose={() => {
                  setMostrarFormulario(false);
                  setCategoriaEditando(null);
                }}
                onSuccess={() => {
                  setMostrarFormulario(false);
                  setCategoriaEditando(null);
                  cargarCategorias();
                }}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

interface FormularioCategoriaProps {
  categoria?: Categoria | null;
  onClose: () => void;
  onSuccess: () => void;
}

function FormularioCategoria({ categoria, onClose, onSuccess }: FormularioCategoriaProps) {
  const [formData, setFormData] = useState({
    nombre: categoria?.nombre || '',
    descripcion: categoria?.descripcion || '',
    color: categoria?.color || '#3b82f6'
  });
  const [loading, setLoading] = useState(false);

  const colores = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
    '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = categoria ? `/api/categorias/${categoria.id}` : '/api/categorias';
      const method = categoria ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSuccess();
      } else {
        alert('Error al guardar categoría');
      }
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      alert('Error al guardar categoría');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {categoria ? 'Editar Categoría' : 'Nueva Categoría'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Nombre</label>
              <input
                type="text"
                required
                className="input"
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
              />
            </div>

            <div>
              <label className="label">Descripción</label>
              <textarea
                className="input min-h-[80px] resize-none"
                value={formData.descripcion}
                onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
              />
            </div>

            <div>
              <label className="label">Color</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  className="w-12 h-10 rounded border border-gray-300"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                />
                <div className="flex space-x-2">
                  {colores.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${
                        formData.color === color ? 'border-gray-400' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                    />
                  ))}
                </div>
              </div>
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
                {loading ? 'Guardando...' : (categoria ? 'Actualizar' : 'Crear')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
