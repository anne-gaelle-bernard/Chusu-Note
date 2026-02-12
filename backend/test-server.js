// Test simple de serveur HTTP
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Test OK!', path: req.url }));
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`✅ Serveur de test démarré sur http://localhost:${PORT}`);
});
