import { EventTarget } from "event-target-shim"
import {
    EVENT_DEVICE_STARTED_MOVING,
    EVENT_DEVICE_STOPPED_MOVING,
} from '../../constants';

const DEBOUNCE_INTERVAL = 2500;
const MOVEMENT_THRESHOLD = {
    start: 3,
    stop: 2
}; 

const deviceStartedMovingEvent = new CustomEvent(EVENT_DEVICE_STARTED_MOVING);
const deviceStoppedMovingEvent = new CustomEvent(EVENT_DEVICE_STOPPED_MOVING);

/**
 * A wrapper for the Device Motion API
 *
 * @class MotionTracker
 */
class MotionTracker extends EventTarget {
    constructor() {
        super();
        // Init class parameters
        this.deviceIsMoving = null;
        this.lastChange = new Date(new Date().getTime - DEBOUNCE_INTERVAL);

        // Bind methods
        this.handleTick = this.handleTick.bind(this);

        // Bind event listener for device motion
        window.addEventListener('devicemotion', this.handleTick);
    }

    /**
     * Handle an acceleration tick from the Device Motion API
     * 
     * @param {DeviceMotionEvent} event 
     */
    handleTick(event) {
        if (this.lastChange.getTime() + DEBOUNCE_INTERVAL > new Date().getTime()) {
            return;
        }

        // Calculate the total sum of the accelaration on the device
        const sumAcceleration = Math.abs(event.acceleration.x) + Math.abs(event.acceleration.y) + Math.abs(event.acceleration.z);
        // if (new Date().getTime() % 1000 < 20) {
        //     console.log(sumAcceleration);
        // }

        // If the device is not moving and the sum of accelerations exceeds the threshold, we consider the device to be moving
        if (!this.deviceIsMoving && sumAcceleration > MOVEMENT_THRESHOLD.start) {
            this.deviceIsMoving = true;
            this.lastChange = new Date();
            this.dispatchEvent(deviceStartedMovingEvent);
        // If the device is moving and the sum of accelerations drops below the threshold, we consider the device to be still
        } else if (this.deviceIsMoving && sumAcceleration < MOVEMENT_THRESHOLD.stop) {
            this.deviceIsMoving = false;
            this.lastChange = new Date();
            this.dispatchEvent(deviceStoppedMovingEvent);
        }
    }
}

export default MotionTracker;