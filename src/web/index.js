import MotionTracker from './lib/MotionTracker';
import Timer from './lib/Timer';
import {
    EVENT_SCANNED_QR_CODE
} from '../constants';

if (window.location.hash.length <= 1) {
    throw new Error('No data was received');
}

// Pull data from URL
const URLData = atob(window.location.hash.substr(1));
const [
    userId,
    stickerId,
    interval
] = URLData.split(',');

// Initialise trackers
const tracker = new MotionTracker();

// Start timer
const timer = new Timer(document.getElementById('progress-bar'));
timer.start(parseInt(interval));

// Start connection to Websocket Server
const socket = new WebSocket(`ws://${location.hostname}:3001`);

// Wait for it to open
socket.addEventListener('open', function(event) {
    // Send base data
    socket.send(JSON.stringify({
        userId,
        stickerId,
        interval,
        event: EVENT_SCANNED_QR_CODE,
        localTime: new Date(),
        userAgent: navigator.userAgent,
    }));
});