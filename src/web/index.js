import MotionTracker from './lib/MotionTracker';
import Timer from './lib/Timer';
import SocketConnection from './lib/SocketConnection';
import {
    EVENT_SCANNED_QR_CODE,
    EVENT_DEVICE_STARTED_MOVING,
    EVENT_DEVICE_STOPPED_MOVING,
    EVENT_TIMER_STARTED,
    EVENT_TIMER_COMPLETED,
} from '../constants';

// Do a check on the length of the hash string in the URL bar
if (window.location.pathname.length <= 1) {
    throw new Error('No data was received');
}

// Pull data from URL
const URLData = atob(window.location.pathname.substr(5));
const [
    userId,
    stickerId,
    interval,
    color
] = URLData.split(',');

// Set background color
document.body.style.backgroundColor = color;

// Start connection to Websocket Server
const socket = new SocketConnection(`ws://${location.hostname}:3001`);
console.log(socket);

// Wait for it to open
socket.addEventListener('open', function(event) {
    // Send base data
    socket.send(
        JSON.stringify({
            userId,
            stickerId,
            interval,
            event: EVENT_SCANNED_QR_CODE,
            localTime: new Date(),
            userAgent: navigator.userAgent,
        })
    );
});

// Handle any events coming from the MotionTracker or Timer
function handleTrackingEvent(event) {
    socket.bufferedSend(
        JSON.stringify({
            event: event.type,
            userId,
            stickerId,
        })
    );
}

// Initialise trackers
const tracker = new MotionTracker();
tracker.addEventListener(EVENT_DEVICE_STARTED_MOVING, handleTrackingEvent);
tracker.addEventListener(EVENT_DEVICE_STOPPED_MOVING, handleTrackingEvent);


// Initialise and start timer
const timer = new Timer(document.getElementById('progress-bar'), color);
timer.addEventListener(EVENT_TIMER_STARTED, handleTrackingEvent);
timer.addEventListener(EVENT_TIMER_COMPLETED, handleTrackingEvent);
timer.start(parseInt(interval));
