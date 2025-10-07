'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Eye, Trash2, ExternalLink, Calendar } from 'lucide-react';

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

interface Categoria {
  id: string;
  nombre: string;
  color: string;
}

interface ListaArticulosProps {
  articulos?: Articulo[];
  onRefresh?: () => void;
}

export default function ListaArticulos({ articulos: articulosProp, onRefresh }: ListaArticulosProps) {
  const [articulos, setArticulos] = useState<Articulo[]>(articulosProp || []);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(!articulosProp);
  const [filtros, setFiltros] = useState({
    busqueda: '',
    categoria: '',
    fuente: '',
    pagina: 1
  });
  const [paginacion, setPaginacion] = useState({
    pagina: 1,
    limite: 20,
    total: 0,
    paginas: 0
  });

  useEffect(() => {
    if (articulosProp && Object.values(filtros).every(val => val === '' || val === 1)) {
      // Solo usar articulosProp si no hay filtros activos
      setArticulos(articulosProp);
      setLoading(false);
    } else {
      // Si hay filtros activos, siempre cargar desde la API
      cargarArticulos();
    }
    cargarCategorias();
  }, [filtros, articulosProp]);

  const cargarArticulos = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        pagina: filtros.pagina.toString(),
        limite: '20'
      });

      if (filtros.busqueda) params.append('busqueda', filtros.busqueda);
      if (filtros.categoria) params.append('categoria', filtros.categoria);
      if (filtros.fuente) params.append('fuente', filtros.fuente);

      const response = await fetch(`/api/articulos?${params}`);
      const data = await response.json();
      
      setArticulos(data.articulos);
      setPaginacion(data.paginacion);
    } catch (error) {
      console.error('Error al cargar noticias:', error);
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

  const eliminarArticulo = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta noticia?')) {
      return;
    }

    try {
      await fetch(`/api/articulos/${id}`, {
        method: 'DELETE'
      });
      cargarArticulos();
    } catch (error) {
      console.error('Error al eliminar noticia:', error);
    }
  };

  const handleFiltroChange = (campo: string, valor: string) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor,
      pagina: 1
    }));
  };

  const cambiarPagina = (nuevaPagina: number) => {
    setFiltros(prev => ({
      ...prev,
      pagina: nuevaPagina
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Noticias</h1>
          <p className="mt-2 text-gray-600">
            Gestiona todas las noticias extraídas
          </p>
        </div>
        <button className="btn btn-primary btn-md">
          <Plus size={20} className="mr-2" />
          Nueva Noticia
        </button>
      </div>

      {/* Filtros */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="label">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar noticias..."
                className="input pl-10"
                value={filtros.busqueda}
                onChange={(e) => handleFiltroChange('busqueda', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="label">Categoría</label>
            <select
              className="input"
              value={filtros.categoria}
              onChange={(e) => handleFiltroChange('categoria', e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Fuente</label>
            <input
              type="text"
              placeholder="Filtrar por fuente..."
              className="input"
              value={filtros.fuente}
              onChange={(e) => handleFiltroChange('fuente', e.target.value)}
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setFiltros({ busqueda: '', categoria: '', fuente: '', pagina: 1 })}
              className="btn btn-secondary btn-md w-full"
            >
              <Filter size={20} className="mr-2" />
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Lista de noticias */}
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Artículo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fuente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {articulos.map((articulo) => (
                    <tr key={articulo.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          {articulo.imagen && (
                            <img
                              src={articulo.imagen}
                              alt={articulo.titulo}
                              className="w-12 h-12 rounded-lg object-cover mr-4"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {articulo.titulo}
                            </p>
                            {articulo.contenido && (
                              <p className="text-sm text-gray-500 truncate mt-1">
                                {articulo.contenido.substring(0, 100)}...
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {articulo.categoria ? (
                          <span
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            style={{ backgroundColor: articulo.categoria.color + '20', color: articulo.categoria.color }}
                          >
                            {articulo.categoria.nombre}
                          </span>
                        ) : (
                          <span className="text-gray-400">Sin categoría</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {articulo.fuente}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-1" />
                          {new Date(articulo.fecha).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <a
                            href={articulo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-900"
                            title="Ver noticia original"
                          >
                            <ExternalLink size={16} />
                          </a>
                          <button
                            className="text-gray-600 hover:text-gray-900"
                            title="Ver detalles"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => eliminarArticulo(articulo.id)}
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

            {/* Paginación */}
            {paginacion.paginas > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => cambiarPagina(paginacion.pagina - 1)}
                    disabled={paginacion.pagina === 1}
                    className="btn btn-secondary btn-sm"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => cambiarPagina(paginacion.pagina + 1)}
                    disabled={paginacion.pagina === paginacion.paginas}
                    className="btn btn-secondary btn-sm"
                  >
                    Siguiente
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Mostrando{' '}
                      <span className="font-medium">
                        {(paginacion.pagina - 1) * paginacion.limite + 1}
                      </span>{' '}
                      a{' '}
                      <span className="font-medium">
                        {Math.min(paginacion.pagina * paginacion.limite, paginacion.total)}
                      </span>{' '}
                      de{' '}
                      <span className="font-medium">{paginacion.total}</span>{' '}
                      resultados
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => cambiarPagina(paginacion.pagina - 1)}
                        disabled={paginacion.pagina === 1}
                        className="btn btn-secondary btn-sm rounded-l-md"
                      >
                        Anterior
                      </button>
                      {Array.from({ length: Math.min(5, paginacion.paginas) }, (_, i) => {
                        const pagina = i + 1;
                        return (
                          <button
                            key={pagina}
                            onClick={() => cambiarPagina(pagina)}
                            className={`btn btn-sm ${
                              pagina === paginacion.pagina
                                ? 'btn-primary'
                                : 'btn-secondary'
                            }`}
                          >
                            {pagina}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => cambiarPagina(paginacion.pagina + 1)}
                        disabled={paginacion.pagina === paginacion.paginas}
                        className="btn btn-secondary btn-sm rounded-r-md"
                      >
                        Siguiente
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
