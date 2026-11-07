export class Inodo {
  nombre: string;
  tamBloques: number;
  bloquesAsignados: number[];

  constructor(nombre: string, tamBloques: number) {
    this.nombre = nombre;
    this.tamBloques = tamBloques;
    this.bloquesAsignados = [];
  }
}