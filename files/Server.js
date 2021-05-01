const http = require('http');
const result = require('result');

const hostname = '127.0.0.1';
const port = 3000;

let server = http.createServer().listen(3000);
server.on('request' , function (request, response) {

switch (request.method){
    case 'GET':
        handleGET(request, response);
    break;

    case 'POST':
        handlePOST(request, response);
    break;

    default:
        res.writeHead(404);
        res.end();
    break;
}

function handleGET (req, res) {
  res.writeHead(200, {
    'Content-Type' : 'application/json'
    });
  res.write(JSON.stringify(scraperController.result))
  res.end()
}
})