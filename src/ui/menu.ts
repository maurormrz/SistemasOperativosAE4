import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import { SimuladorDisco } from '../models/SimuladorDisco';

export async function iniciarMenu() {
  const rl = readline.createInterface({ input, output });
  const disco = new SimuladorDisco(16); // Disco de 16 bloques ideal para pruebas rápidas

  let salir = false;
  while (!salir) {
    console.log('\n=======================================');
    console.log('   SIMULADOR DE SISTEMA DE ARCHIVOS');
    console.log('=======================================');
    console.log('1. Crear archivo');
    console.log('2. Eliminar archivo');
    console.log('3. Ver mapa de bloques');
    console.log('4. Ver tabla de Inodos y métricas');
    console.log('5. Salir');

    const opcion = await rl.question('\nSeleccione una opcion: ');

    switch (opcion.trim()) {
      case '1': {
        const nombre = await rl.question('Nombre del archivo: ');
        const tamStr = await rl.question('Tamano en bloques: ');
        const tam = parseInt(tamStr, 10);
        if (!isNaN(tam) && tam > 0) {
          disco.crearArchivo(nombre.trim(), tam);
        } else {
          console.log('Error: Tamano invalido.');
        }
        break;
      }
      case '2': {
        const nombre = await rl.question('Nombre del archivo a eliminar: ');
        disco.eliminarArchivo(nombre.trim());
        break;
      }
      case '3':
        disco.mostrarMapa();
        break;
      case '4':
        disco.mostrarTablaInodos();
        break;
      case '5':
        console.log('Saliendo del simulador...');
        salir = true;
        break;
      default:
        console.log('Opcion no valida.');
    }
  }

  rl.close();
}