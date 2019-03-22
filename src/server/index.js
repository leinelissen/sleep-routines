require('dotenv').config()
const WebSocket = require('ws');
const handler = require('serve-handler');
const http = require('http');
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

// Create HTTP Server
const server = http.createServer((request, response) => {
    return handler(request, response, {
        public: './public',
        rewrites: [
            { source: "app/**", destination: "/index.html" },        
        ]
    });
});

server.listen(process.env.HTTP_PORT, () => {
    console.log('HTTP Server is running...');
});