import { SimuladorDisco } from '../src/models/SimuladorDisco';

describe('Pruebas del Simulador de Disco (Sistemas Operativos AE4)', () => {

  // Test 1: Asignación de un archivo en disco
  test('Debe crear un archivo y asignar sus bloques correctamente', () => {
    const disco = new SimuladorDisco(10); // Disco pequeño de 10 bloques para pruebas
    const resultado = disco.crearArchivo('archivo1.txt', 3);

    expect(resultado).toBe(true);
    expect(disco.tablaInodos.has('archivo1.txt')).toBe(true);
  });

  // Test 2: Manejo de error por falta de espacio
  test('Debe fallar si no hay suficiente espacio en disco', () => {
    const disco = new SimuladorDisco(5);
    const resultado = disco.crearArchivo('grande.iso', 10); // Supera los 5 bloques libres

    expect(resultado).toBe(false);
  });

  // Test 3: Liberación de espacio al eliminar un archivo
  test('Debe eliminar un archivo y liberar los bloques en uso', () => {
    const disco = new SimuladorDisco(10);
    disco.crearArchivo('borrar.txt', 4);
    
    const eliminado = disco.eliminarArchivo('borrar.txt');

    expect(eliminado).toBe(true);
    expect(disco.tablaInodos.has('borrar.txt')).toBe(false);
  });

  // Caso del Taller - Verificación de Fragmentación Externa
  test('Debe calcular correctamente la fragmentación externa al quedar huecos', () => {
    const disco = new SimuladorDisco(12);

    // Caso de prueba práctico del taller
    disco.crearArchivo('docA.txt', 4);
    disco.crearArchivo('docB.txt', 4);
    disco.crearArchivo('docC.txt', 4);
    disco.eliminarArchivo('docB.txt'); // Deja un hueco contiguo de 4 bloques en el medio

    const metricas = disco.calcularMetricas();

    // Quedan 4 bloques libres. El mayor hueco contiguo es de 4.
    // Frag = (1 - 4/4) * 100 = 0%
    expect(metricas.fragmentacionExterna).toBe(0);
  });

});