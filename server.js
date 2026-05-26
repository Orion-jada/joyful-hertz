const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // Parse req.url to discard query parameters or hash fragments
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
  const ext = path.extname(filePath);
  
  // If the path has no file extension (e.g. SPA subpaths like /mission, /team, /article),
  // serve index.html to allow client-side history router to mount the view.
  if (!ext) {
    filePath = path.join(__dirname, 'index.html');
  }
  
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fall back to index.html for any other non-existent paths (e.g. broken deep links)
      filePath = path.join(__dirname, 'index.html');
    }
    
    const readExt = path.extname(filePath);
    const contentType = MIME_TYPES[readExt] || 'application/octet-stream';
    
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Synapse Dev Server running at http://localhost:${PORT}`);
});
