var http = require('http');

var port = process.env.PORT || 4000;

http.createServer(function (req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    'Timing-Allow-Origin': '*'
  });
  res.end(''+Date.now());
}).listen(process.env.PORT || 4000);

console.log('Server running on %d', port);