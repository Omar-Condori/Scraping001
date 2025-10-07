export interface DatosEntrenamiento {
  texto: string;
  categoria: string;
}

export interface Prediccion {
  categoria: string;
  confianza: number;
}

export class ModeloML {
  private modelo: any = null;
  private tokenizer: Map<string, number> = new Map();
  private categorias: string[] = [];
  private maxPalabras = 1000;
  private maxLongitudSecuencia = 100;

  async entrenarModelo(datos: DatosEntrenamiento[]): Promise<number> {
    try {
      console.log('🧠 Entrenando modelo de Machine Learning...');
      
      // Simular entrenamiento del modelo
      this.categorias = [...new Set(datos.map(d => d.categoria))];
      
      // Crear tokenizador simple
      const palabras = new Set<string>();
      datos.forEach(dato => {
        const palabrasTexto = this.tokenizarTexto(dato.texto);
        palabrasTexto.forEach(palabra => palabras.add(palabra));
      });

      const palabrasArray = Array.from(palabras).slice(0, this.maxPalabras - 1);
      this.tokenizer = new Map();
      palabrasArray.forEach((palabra, index) => {
        this.tokenizer.set(palabra, index + 1);
      });

      // Simular modelo entrenado
      this.modelo = {
        entrenado: true,
        precision: 0.85,
        categorias: this.categorias
      };

      console.log(`✅ Modelo entrenado con ${datos.length} ejemplos`);
      return 0.85; // Simular 85% de precisión
    } catch (error) {
      console.error('Error al entrenar modelo:', error);
      throw error;
    }
  }

  private tokenizarTexto(texto: string): string[] {
    return texto
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(palabra => palabra.length > 0);
  }

  async predecirCategoria(texto: string): Promise<Prediccion[]> {
    if (!this.modelo) {
      throw new Error('Modelo no entrenado');
    }

    try {
      // Simular predicción basada en palabras clave
      const palabras = this.tokenizarTexto(texto);
      const resultados: Prediccion[] = [];

      // Palabras clave para diferentes categorías
      const palabrasClave = {
        'JavaScript': ['javascript', 'js', 'react', 'vue', 'angular', 'node'],
        'Python': ['python', 'django', 'flask', 'fastapi'],
        'AI': ['ai', 'artificial intelligence', 'machine learning', 'ml', 'neural'],
        'Web': ['web', 'html', 'css', 'frontend', 'backend'],
        'Mobile': ['mobile', 'ios', 'android', 'react native'],
        'DevOps': ['devops', 'docker', 'kubernetes', 'ci/cd', 'deployment']
      };

      for (const [categoria, keywords] of Object.entries(palabrasClave)) {
        const coincidencias = palabras.filter(palabra => 
          keywords.some(keyword => palabra.includes(keyword))
        ).length;
        
        const confianza = Math.min(0.9, coincidencias * 0.2 + 0.1);
        
        resultados.push({
          categoria,
          confianza
        });
      }

      // Ordenar por confianza
      resultados.sort((a, b) => b.confianza - a.confianza);

      return resultados;
    } catch (error) {
      console.error('Error al predecir:', error);
      throw error;
    }
  }

  async guardarModelo(): Promise<any> {
    if (!this.modelo) {
      throw new Error('Modelo no entrenado');
    }

    const modeloData = {
      modelo: this.modelo,
      tokenizer: Object.fromEntries(this.tokenizer),
      categorias: this.categorias,
      maxPalabras: this.maxPalabras,
      maxLongitudSecuencia: this.maxLongitudSecuencia
    };

    return modeloData;
  }

  async cargarModelo(modeloData: any): Promise<void> {
    try {
      this.tokenizer = new Map(Object.entries(modeloData.tokenizer));
      this.categorias = modeloData.categorias;
      this.maxPalabras = modeloData.maxPalabras;
      this.maxLongitudSecuencia = modeloData.maxLongitudSecuencia;
      this.modelo = modeloData.modelo;
    } catch (error) {
      console.error('Error al cargar modelo:', error);
      throw error;
    }
  }

  obtenerEstadisticas(): {
    totalPalabras: number;
    totalCategorias: number;
    modeloEntrenado: boolean;
  } {
    return {
      totalPalabras: this.tokenizer.size,
      totalCategorias: this.categorias.length,
      modeloEntrenado: this.modelo !== null
    };
  }
}