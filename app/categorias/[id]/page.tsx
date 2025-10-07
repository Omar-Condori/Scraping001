'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, ExternalLink, Tag, Filter, Search } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { useRouter } from 'next/navigation';

interface Categoria {
  id: string;
  nombre: string;
  descripcion?: string;
  color: string;
  palabrasClave?: string;
}

interface Articulo {
  id: string;
  titulo: string;
  url: string;
  contenido?: string;
  imagen?: string;
  fuente: string;
  fecha: string;
  categoria?: {
    id: string;
    nombre: string;
    color: string;
  };
}

export default function CategoriaPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'fecha' | 'titulo'>('fecha');

  useEffect(() => {
    if (params.id) {
      cargarCategoria();
      cargarArticulos();
    }
  }, [params.id]);

  const cargarCategoria = async () => {
    try {
      const response = await fetch(`/api/categorias/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setCategoria(data);
      }
    } catch (error) {
      console.error('Error al cargar categoría:', error);
    }
  };

  const cargarArticulos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/articulos?categoria=${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setArticulos(data.articulos || []);
      }
    } catch (error) {
      console.error('Error al cargar artículos:', error);
    } finally {
      setLoading(false);
    }
  };

  const articulosFiltrados = articulos
    .filter(articulo => 
      articulo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      articulo.contenido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      articulo.fuente.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'fecha') {
        return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
      } else {
        return a.titulo.localeCompare(b.titulo);
      }
    });

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando categoría...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!categoria) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Categoría no encontrada</h2>
            <p className="text-gray-600 mb-4">La categoría que buscas no existe o ha sido eliminada</p>
            <button 
              onClick={() => router.push('/categorias')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Volver a Categorías
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
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/categorias')}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft size={20} className="mr-2" />
                  Volver a Categorías
                </button>
                <div className="flex items-center">
                  <div
                    className="w-6 h-6 rounded-full mr-3"
                    style={{ backgroundColor: categoria.color }}
                  />
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {categoria.nombre}
                    </h1>
                    {categoria.descripcion && (
                      <p className="text-gray-600 mt-1">
                        {categoria.descripcion}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
                  <span className="text-sm text-gray-500">Total:</span>
                  <span className="ml-2 font-semibold text-blue-600">{articulos.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filtros y búsqueda */}
          <div className="mb-6 bg-white rounded-lg p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar noticias..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Filter size={20} className="text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'fecha' | 'titulo')}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="fecha">Ordenar por fecha</option>
                  <option value="titulo">Ordenar por título</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lista de artículos */}
          {articulosFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📰</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {searchTerm ? 'No se encontraron noticias' : 'No hay noticias en esta categoría'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? 'Intenta con otros términos de búsqueda' 
                  : 'Ejecuta el scraping para obtener noticias de esta categoría'
                }
              </p>
              {!searchTerm && (
                <button 
                  onClick={() => router.push('/scraping')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
                >
                  <span>🚀</span>
                  <span>Ejecutar Scraping</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {articulosFiltrados.map((articulo) => (
                <div key={articulo.id} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {articulo.titulo}
                      </h3>
                      {articulo.contenido && (
                        <p className="text-gray-600 mb-3 line-clamp-3">
                          {articulo.contenido}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-1" />
                          {new Date(articulo.fecha).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        <div className="flex items-center">
                          <Tag size={16} className="mr-1" />
                          {articulo.fuente}
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex flex-col items-end space-y-2">
                      <a
                        href={articulo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <ExternalLink size={16} className="mr-1" />
                        Ver original
                      </a>
                      {articulo.imagen && (
                        <img
                          src={articulo.imagen}
                          alt={articulo.titulo}
                          className="w-20 h-20 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
