var http = require('http');

var port = process.env.PORT || 4000;

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(''+Date.now());
}).listen(process.env.PORT || 4000, '127.0.0.1');

console.log('Server running at http://127.0.0.1:%d/', port);