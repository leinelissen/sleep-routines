const WebSocket = require('ws');

// Setup base WebSockets Server
const wss = new WebSocket.Server({ port: 3001 });

// Listen for connections
wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log(`[${new Date().toISOString()}] Received: ${message}`);
        ws.send('ACK');
    });
    console.log(ws._socket.remoteAddress);
});

// Log any errors
wss.on('error', console.error);

// Notify CLI that the server has started
wss.on('listening', () => console.log('Server has started...'));

