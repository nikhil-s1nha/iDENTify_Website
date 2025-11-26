const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 8080;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // Maintenance mode: redirect all routes except maintenance.html itself
  if (pathname !== '/maintenance.html' && pathname !== '/favicon.ico') {
    res.writeHead(307, { 'Location': '/maintenance.html' });
    res.end();
    return;
  }

  // Serve maintenance.html
  if (pathname === '/maintenance.html' || pathname === '/') {
    pathname = '/maintenance.html';
  }

  // Remove leading slash for file system
  const filePath = pathname === '/' ? 'index.html' : pathname.slice(1);
  const fullPath = path.join(__dirname, filePath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(fullPath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - File Not Found</h1>');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>500 - Internal Server Error</h1>');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log(`📋 Maintenance mode is ACTIVE`);
  console.log(`   All routes will redirect to /maintenance.html\n`);
  console.log(`   To disable maintenance mode, stop this server\n`);
});

