require('dotenv').config()
const WebSocket = require('ws');
const http = require('http');
const serveStatic = require('serve-static');
var finalhandler = require('finalhandler');
const nano = require('nano')(process.env.COUCHDB_URL);
const db = nano.db.use(process.env.COUCHDB_DB);

// Setup base WebSockets Server
const wss = new WebSocket.Server({ port: 3001 });

// Listen for connections
wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log(`[${new Date().toISOString()}] Received: ${message}`);
        ws.send('ACK');
        db.insert(JSON.parse(message));
    });
    console.log(ws._socket.remoteAddress);
});

// Log any errors
wss.on('error', console.error);

// Notify CLI that the server has started
wss.on('listening', () => console.log('Websockets server has started...'));

// Create static server
const serve = serveStatic('./public');

// Define node HTTP server
var server = http.createServer(function onRequest (req, res) {
    serve(req, res, finalhandler(req, res));
});

// Make HTTP server listen on supplied port
server.listen(process.env.HTTP_PORT);
console.log('HTTP server has started...');