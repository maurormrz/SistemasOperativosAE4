import express from 'express';
import { SimuladorDisco } from './models/SimuladorDisco';

const app = express();
app.use(express.urlencoded({ extended: true }));

// Instanciamos nuestro simulador con 16 bloques
const disco = new SimuladorDisco(16);

// Ruta principal: Interfaz web en Modo Oscuro
app.get('/', (req, res) => {
  const metricas = disco.calcularMetricas();

  // Generamos el HTML visual de los bloques en modo oscuro
  const bloquesHtml = disco.bloques.map((b, i) => `
    <div style="display: inline-block; margin: 4px; padding: 12px; background: ${b ? '#dc2626' : '#16a34a'}; color: #ffffff; border: 1px solid ${b ? '#ef4444' : '#22c55e'}; border-radius: 8px; text-align: center; min-width: 55px; font-family: monospace; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
      <small style="color: #cbd5e1; font-size: 10px;">#${i}</small><br>
      <strong style="font-size: 14px;">${b ? b : 'Libre'}</strong>
    </div>
  `).join('');

  // Listado de inodos activos
  let inodosHtml = '';
  disco.tablaInodos.forEach((inodo, nombre) => {
    inodosHtml += `
      <li style="margin-bottom: 8px; color: #e2e8f0;">
        <span style="color: #38bdf8; font-weight: bold;">${nombre}</span> 
        <span style="color: #94a3b8;">(${inodo.tamBloques} bloques)</span> 
        &rarr; <code style="background: #0f172a; padding: 2px 6px; border-radius: 4px; color: #f43f5e;">Punteros: [${inodo.bloquesAsignados.join(', ')}]</code>
      </li>`;
  });

  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simulador de Sistemas Operativos - Modo Oscuro</title>
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          max-width: 850px; 
          margin: 40px auto; 
          padding: 0 20px; 
          background-color: #0f172a; 
          color: #f8fafc; 
        }
        h1 { color: #f8fafc; margin-bottom: 4px; }
        .subtitle { color: #94a3b8; font-size: 14px; margin-top: 0; margin-bottom: 24px; }
        .card { 
          background-color: #1e293b; 
          padding: 22px; 
          border-radius: 12px; 
          border: 1px solid #334155; 
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3); 
          margin-bottom: 24px; 
        }
        .row { display: flex; gap: 20px; }
        .col { flex: 1; }
        h3 { margin-top: 0; color: #38bdf8; font-size: 18px; border-bottom: 1px solid #334155; padding-bottom: 8px; }
        label { display: block; font-size: 13px; color: #94a3b8; margin-top: 10px; }
        input, button { 
          width: 100%; 
          padding: 10px 12px; 
          margin-top: 6px; 
          margin-bottom: 12px; 
          border: 1px solid #475569; 
          border-radius: 6px; 
          box-sizing: border-box; 
          background-color: #0f172a; 
          color: #f8fafc; 
          font-size: 14px; 
        }
        input:focus { outline: none; border-color: #38bdf8; }
        button { 
          background-color: #2563eb; 
          color: white; 
          border: none; 
          font-weight: 600; 
          cursor: pointer; 
          transition: background 0.2s; 
          margin-top: 12px; 
        }
        button:hover { background-color: #1d4ed8; }
        .btn-danger { background-color: #dc2626; }
        .btn-danger:hover { background-color: #b91c1c; }
        .metric-badge {
          display: inline-block;
          background: #0f172a;
          padding: 8px 14px;
          border-radius: 6px;
          border: 1px solid #334155;
          margin-right: 10px;
          margin-bottom: 10px;
          font-size: 13px;
        }
        ul { padding-left: 20px; margin-bottom: 0; }
      </style>
    </head>
    <body>
      <h1>💻 Simulador de Sistema de Archivos (AE4)</h1>
      <p class="subtitle">Universidad de la Cuenca del Plata &bull; Sistemas Operativos</p>

      <div class="card">
        <h3>🗺️ Mapa de Bloques del Disco</h3>
        <div style="margin-top: 14px;">${bloquesHtml}</div>
      </div>

      <div class="row">
        <div class="card col">
          <h3>📁 Crear Archivo</h3>
          <form action="/crear" method="POST">
            <label>Nombre del archivo:</label>
            <input type="text" name="nombre" placeholder="ej. docA.txt" required autocomplete="off">
            <label>Tamaño en bloques:</label>
            <input type="number" name="tam" placeholder="ej. 4" min="1" required>
            <button type="submit">Crear Archivo</button>
          </form>
        </div>

        <div class="card col">
          <h3>🗑️ Eliminar Archivo</h3>
          <form action="/eliminar" method="POST">
            <label>Nombre del archivo a eliminar:</label>
            <input type="text" name="nombre" placeholder="ej. docA.txt" required autocomplete="off">
            <button type="submit" class="btn-danger">Eliminar Archivo</button>
          </form>
        </div>
      </div>

      <div class="card">
        <h3>📊 Métricas y Tabla de Inodos</h3>
        <div style="margin-top: 12px;">
          <span class="metric-badge"><b>Capacidad:</b> ${metricas.total} bloques</span>
          <span class="metric-badge"><b>Ocupados:</b> ${metricas.ocupados}</span>
          <span class="metric-badge"><b>Libres:</b> ${metricas.libres}</span>
          <span class="metric-badge"><b>Ocupación:</b> ${metricas.porcentajeOcupacion}%</span>
          <span class="metric-badge" style="border-color: #f59e0b; color: #fbbf24;"><b>Fragmentación Externa:</b> ${metricas.fragmentacionExterna}%</span>
        </div>
        
        <h4 style="color: #cbd5e1; margin-top: 20px; margin-bottom: 10px;">Archivos Registrados (Tabla de Inodos):</h4>
        <ul>${inodosHtml || '<li style="color: #64748b;">No hay archivos creados en el disco.</li>'}</ul>
      </div>
    </body>
    </html>
  `);
});

// Endpoint para crear archivo
app.post('/crear', (req, res) => {
  const { nombre, tam } = req.body;
  if (nombre && tam) {
    disco.crearArchivo(nombre.trim(), parseInt(tam, 10));
  }
  res.redirect('/');
});

// Endpoint para eliminar archivo
app.post('/eliminar', (req, res) => {
  const { nombre } = req.body;
  if (nombre) {
    disco.eliminarArchivo(nombre.trim());
  }
  res.redirect('/');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor web en MODO OSCURO corriendo en http://localhost:${PORT}`);
});