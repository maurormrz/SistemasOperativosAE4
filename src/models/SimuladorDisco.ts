import { Inodo } from './Inodo';

export class SimuladorDisco {
  totalBloques: number;
  bloques: (string | null)[];
  tablaInodos: Map<string, Inodo>;

  constructor(totalBloques: number = 32) {
    this.totalBloques = totalBloques;
    this.bloques = new Array(totalBloques).fill(null);
    this.tablaInodos = new Map<string, Inodo>();
  }

  crearArchivo(nombre: string, tamBloques: number): boolean {
    if (this.tablaInodos.has(nombre)) {
      console.log(`Error: El archivo '${nombre}' ya existe.`);
      return false;
    }

    const bloquesLibres: number[] = [];
    this.bloques.forEach((b, i) => {
      if (b === null) bloquesLibres.push(i);
    });

    if (bloquesLibres.length < tamBloques) {
      console.log('Error: Espacio en disco insuficiente / Bloques agotados.');
      return false;
    }

    const nuevoInodo = new Inodo(nombre, tamBloques);
    for (let i = 0; i < tamBloques; i++) {
      const idx = bloquesLibres[i];
      this.bloques[idx] = nombre;
      nuevoInodo.bloquesAsignados.push(idx);
    }

    this.tablaInodos.set(nombre, nuevoInodo);
    console.log(`Archivo '${nombre}' creado con éxito. Bloques: [${nuevoInodo.bloquesAsignados}]`);
    return true;
  }

  eliminarArchivo(nombre: string): boolean {
    if (!this.tablaInodos.has(nombre)) {
      console.log(`Error: Archivo '${nombre}' no encontrado.`);
      return false;
    }

    const inodo = this.tablaInodos.get(nombre)!;
    inodo.bloquesAsignados.forEach((idx) => {
      this.bloques[idx] = null;
    });

    this.tablaInodos.delete(nombre);
    console.log(`Archivo '${nombre}' eliminado correctamente.`);
    return true;
  }

  mostrarMapa(): void {
    const mapa = this.bloques.map((b) => (b ? '[O]' : '[L]')).join('');
    console.log('\nMapa del Disco:', mapa);
  }

  calcularMetricas() {
    const ocupados = this.bloques.filter((b) => b !== null).length;
    const libres = this.totalBloques - ocupados;
    const porcentajeOcupacion = Number(((ocupados / this.totalBloques) * 100).toFixed(2));

    // Cálculo del mayor hueco contiguo libre para la fragmentación externa
    let mayorHueco = 0;
    let huecoActual = 0;

    for (const b of this.bloques) {
      if (b === null) {
        huecoActual++;
        if (huecoActual > mayorHueco) mayorHueco = huecoActual;
      } else {
        huecoActual = 0;
      }
    }

    let fragmentacionExterna = 0;
    if (libres > 0) {
      fragmentacionExterna = Number(((1 - mayorHueco / libres) * 100).toFixed(2));
    }

    return {
      total: this.totalBloques,
      ocupados,
      libres,
      porcentajeOcupacion,
      fragmentacionExterna,
    };
  }

  mostrarTablaInodos(): void {
    console.log('\n--- TABLA DE INODOS Y MÉTRICAS ---');
    if (this.tablaInodos.size === 0) {
      console.log('No hay archivos en el disco.');
    } else {
      this.tablaInodos.forEach((inodo, nombre) => {
        console.log(`- Archivo: ${nombre} | Tamaño: ${inodo.tamBloques} blq | Punteros: [${inodo.bloquesAsignados}]`);
      });
    }

    const m = this.calcularMetricas();
    console.log(`\n[Métricas] Total: ${m.total} | Ocupados: ${m.ocupados} | Libres: ${m.libres}`);
    console.log(`Ocupación: ${m.porcentajeOcupacion}% | Fragmentación Externa: ${m.fragmentacionExterna}%`);
  }
}