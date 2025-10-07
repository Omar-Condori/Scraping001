import axios from 'axios';
import { prisma } from '@/lib/prisma';

export interface ArticuloScraped {
  titulo: string;
  url: string;
  contenido?: string;
  imagen?: string;
  fuente: string;
  categoriaId?: string;
}

export interface SelectoresCSS {
  titulo: string;
  contenido?: string;
  imagen?: string;
  paginacion?: string;
}

export class ScrapingService {
  private static instance: ScrapingService;
  
  private constructor() {}

  static getInstance(): ScrapingService {
    if (!ScrapingService.instance) {
      ScrapingService.instance = new ScrapingService();
    }
    return ScrapingService.instance;
  }

  async scrapeFuentePersonalizada(
    url: string, 
    selectores: SelectoresCSS, 
    limite: number = 50
  ): Promise<ArticuloScraped[]> {
    try {
      console.log(`🔍 Iniciando scraping REAL de: ${url}`);
      
      // Hacer scraping real de la página
      const response = await axios.get(url, {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        }
      });

      const html = response.data;
      const articulos: ArticuloScraped[] = [];
      const hostname = new URL(url).hostname;
      
      // Extraer títulos usando regex (más compatible)
      const tituloRegex = /<h[1-6][^>]*>.*?<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>.*?<\/h[1-6]>/gi;
      const titulosEncontrados: Array<{titulo: string, url: string}> = [];
      
      let match;
      while ((match = tituloRegex.exec(html)) !== null && titulosEncontrados.length < limite) {
        const titulo = match[2].replace(/<[^>]*>/g, '').trim();
        let enlace = match[1];
        
        if (titulo && titulo.length > 10) {
          // Convertir URL relativa a absoluta
          if (enlace.startsWith('/')) {
            enlace = `${new URL(url).protocol}//${new URL(url).host}${enlace}`;
          } else if (!enlace.startsWith('http')) {
            enlace = `${url}${enlace}`;
          }
          
          titulosEncontrados.push({ titulo, url: enlace });
        }
      }

      // Si no encontramos títulos con enlaces, buscar títulos simples
      if (titulosEncontrados.length === 0) {
        const tituloSimpleRegex = /<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi;
        let matchSimple;
        while ((matchSimple = tituloSimpleRegex.exec(html)) !== null && titulosEncontrados.length < limite) {
          const titulo = matchSimple[1].replace(/<[^>]*>/g, '').trim();
          if (titulo && titulo.length > 10) {
            titulosEncontrados.push({ 
              titulo, 
              url: `${url}/articulo-${this.generarHash(titulo)}` 
            });
          }
        }
      }

      // Procesar cada título encontrado
      for (const { titulo, url: enlace } of titulosEncontrados) {
        try {
          // Extraer contenido real del artículo
          let contenido = '';
          let imagen = '';

          if (enlace && !enlace.includes('/articulo-')) {
            try {
              const articuloResponse = await axios.get(enlace, {
                timeout: 10000,
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
              });
              
              const articuloHtml = articuloResponse.data;
              
              // Extraer contenido usando regex
              const contenidoRegex = /<p[^>]*>(.*?)<\/p>/gi;
              const contenidos: string[] = [];
              let contenidoMatch;
              let count = 0;
              
              while ((contenidoMatch = contenidoRegex.exec(articuloHtml)) !== null && count < 3) {
                const texto = contenidoMatch[1].replace(/<[^>]*>/g, '').trim();
                if (texto && texto.length > 20) {
                  contenidos.push(texto);
                  count++;
                }
              }
              
              contenido = contenidos.join(' ');

              // Extraer imagen usando regex
              const imagenRegex = /<img[^>]*src=["']([^"']*)["'][^>]*>/gi;
              const imagenMatch = imagenRegex.exec(articuloHtml);
              if (imagenMatch) {
                imagen = imagenMatch[1];
                if (imagen.startsWith('/')) {
                  imagen = `${new URL(enlace).protocol}//${new URL(enlace).host}${imagen}`;
                }
              }
              
            } catch (error) {
              console.log(`⚠️ No se pudo obtener contenido del artículo: ${enlace}`);
            }
          }

          // Determinar categoría
          const categoriaId = await this.determinarCategoria(titulo, contenido);
          
          articulos.push({
            titulo: titulo,
            url: enlace,
            contenido: contenido || titulo,
            imagen: imagen || null,
            fuente: hostname,
            categoriaId: categoriaId
          });

          console.log(`✅ Artículo real extraído: "${titulo}"`);
        } catch (error) {
          console.error(`Error procesando artículo:`, error);
        }
      }

      // Si no se encontraron artículos reales, generar contenido de respaldo
      if (articulos.length === 0) {
        console.log(`⚠️ No se encontraron artículos reales en ${url}, generando contenido de respaldo`);
        return await this.generarContenidoRespaldo(url, limite);
      }

      console.log(`✅ Se extrajeron ${articulos.length} artículos REALES de ${url}`);
      await this.guardarLog(url, 'success', `Se extrajeron ${articulos.length} artículos reales`);
      return articulos.slice(0, limite);
      
    } catch (error) {
      console.error(`❌ Error en scraping real de ${url}:`, error);
      await this.guardarLog(url, 'error', `Error: ${error.message}`);
      
      // En caso de error, usar contenido de respaldo
      console.log(`🔄 Usando contenido de respaldo para ${url}`);
      return await this.generarContenidoRespaldo(url, limite);
    }
  }

  // Función de respaldo con contenido único
  private async generarContenidoRespaldo(url: string, limite: number): Promise<ArticuloScraped[]> {
    const articulos: ArticuloScraped[] = [];
    const hostname = new URL(url).hostname;
    const timestamp = Date.now();
    
    // Generar contenido único para cada fuente
    const articulosRespaldo = [
      {
        titulo: `Últimas noticias de ${hostname} - ${new Date().toLocaleDateString('es-ES')}`,
        url: `${url}/noticia-${timestamp}-1`,
        contenido: `Contenido de respaldo generado para ${hostname}. El sistema no pudo extraer contenido real de esta fuente en este momento.`,
        imagen: null,
        fuente: hostname,
        categoriaId: await this.determinarCategoria(`Últimas noticias de ${hostname}`, `Contenido de respaldo`)
      }
    ];
    
    articulos.push(...articulosRespaldo);
    
    console.log(`📝 Generado contenido de respaldo único para ${hostname}`);
    return articulos.slice(0, limite);
  }

  async determinarCategoria(titulo: string, contenido: string): Promise<string | null> {
    try {
      const categorias = await prisma.categoria.findMany();
      
      const textoCompleto = `${titulo} ${contenido}`.toLowerCase();
      
      for (const categoria of categorias) {
        if (categoria.palabrasClave) {
          try {
        const palabrasClave = JSON.parse(categoria.palabrasClave);
            const coincidencias = palabrasClave.filter((palabra: string) => 
              textoCompleto.includes(palabra.toLowerCase())
            );
            
            if (coincidencias.length > 0) {
              return categoria.id;
            }
          } catch (error) {
            console.error(`Error parseando palabras clave de ${categoria.nombre}:`, error);
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error determinando categoría:', error);
      return null;
    }
  }

  private async guardarLog(fuente: string, estado: string, mensaje: string): Promise<void> {
    try {
      // Buscar la fuente por URL o crear un log sin relación
      const fuenteEncontrada = await prisma.fuente.findFirst({
        where: { url: fuente }
      });

        await prisma.log.create({
          data: {
          fuenteId: fuenteEncontrada?.id || null,
            estado,
            mensaje,
          fecha: new Date()
          }
        });
    } catch (error) {
      console.error('Error al guardar log:', error);
    }
  }

  async guardarArticulos(articulos: ArticuloScraped[]): Promise<number> {
    let guardados = 0;
    let duplicados = 0;
    
    for (const articulo of articulos) {
      try {
        // Verificar si el artículo ya existe
        const articuloExistente = await prisma.articulo.findFirst({
          where: {
            OR: [
              { url: articulo.url },
              { 
                AND: [
                  { titulo: articulo.titulo },
                  { fuente: articulo.fuente }
                ]
              }
            ]
          }
        });

        if (articuloExistente) {
          // Actualizar artículo existente
          await prisma.articulo.update({
            where: { id: articuloExistente.id },
            data: {
              contenido: articulo.contenido,
              imagen: articulo.imagen,
              categoriaId: articulo.categoriaId,
              fecha: new Date()
            }
          });
          console.log(`🔄 Artículo actualizado: "${articulo.titulo}"`);
        } else {
          // Crear nuevo artículo
          await prisma.articulo.create({
            data: {
              titulo: articulo.titulo,
              url: articulo.url,
              contenido: articulo.contenido,
              imagen: articulo.imagen,
              fuente: articulo.fuente,
              categoriaId: articulo.categoriaId
            }
          });
          console.log(`✅ Artículo guardado: "${articulo.titulo}"`);
        }
        guardados++;
      } catch (error) {
        console.error(`Error al guardar artículo ${articulo.titulo}:`, error);
      }
    }

    console.log(`📊 Resumen: ${guardados} procesados, ${duplicados} duplicados omitidos`);
    return guardados;
  }

  // Función para generar hash consistente del contenido
  private generarHash(texto: string): string {
    let hash = 0;
    if (texto.length === 0) return hash.toString();
    
    for (let i = 0; i < texto.length; i++) {
      const char = texto.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convertir a 32bit integer
    }
    
    return Math.abs(hash).toString(36);
  }
}