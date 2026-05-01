/**
 * @fileoverview Servidor HTTP estático para Fragrance Graph 3D
 * Sirve los archivos del proyecto (HTML, CSS, JS) en el puerto 3000.
 *
 * Uso: node server.js
 * Acceder: http://localhost:3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

/**
 * Mapa de extensiones a tipos MIME
 * @type {Object<string, string>}
 */
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf'
};

/**
 * Crea un servidor HTTP que sirve archivos estáticos
 * @param {http.IncomingMessage} req - Petición HTTP
 * @param {http.ServerResponse} res - Respuesta HTTP
 */
const server = http.createServer((req, res) => {
  // Resolver la ruta del archivo solicitado
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, filePath);

  // Determinar el tipo MIME por extensión
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      // Manejar errores de lectura
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end('500 Internal Server Error');
      }
    } else {
      // Servir el archivo con el MIME type correcto
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

/**
 * Iniciar el servidor en el puerto configurado
 */
server.listen(PORT, () => {
  console.log(`\x1b[36m\x1b[1mFragrance Graph 3D\x1b[0m`);
  console.log(`\x1b[32mServer running at http://localhost:${PORT}\x1b[0m`);
  console.log(`\x1b[90mPress Ctrl+C to stop\x1b[0m\n`);
});
