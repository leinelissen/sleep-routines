/**
 * Create a wrapper so that we can inject some custom logic to wait for the first message to come through, before we send any other events
 *
 * @param {*} args
 * @returns {WebSocket}
 */
function SocketConnection(...args) {
    // Initialise a WebSocket connection
    const socket = new WebSocket(...args);

    // Create a buffer for messages that cannot be sent yet
    socket.bufferedMessages = [];

    // Create a function to send a buffered message
    socket.bufferedSend = function(message) {
        if (this.readyState !== 1) {
            this.bufferedMessages.push(message);
        } else {
            this.send(message);
        }
    }

    // Add an event to listen to when the socket opens
    socket.addEventListener('open', function(event) {
        // Loop through all unsent messages
        event.currentTarget.bufferedMessages.forEach(message => {
            // Send actual message
            event.currentTarget.send(message);
        });
    });

    // Return the wrapped object
    return socket;
}

export default SocketConnection;