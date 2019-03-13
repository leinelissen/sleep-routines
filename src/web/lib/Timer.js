class Timer {
    constructor(element) {
        this.element = element;
        this.timer = null;
        this.iteration = 0;
        this.interval = 0;

        this.handleTick = this.handleTick.bind(this);
    }

    start(seconds) {
        // Reset state variables
        this.iteration = 0;
        this.interval = seconds;

        // Clear the current interval and start a new one
        clearInterval(this.timer);
        this.timer = setInterval(this.handleTick, 1000);
    }

    handleTick() {
        this.iteration += 1;
        const percentage = this.iteration / this.interval * 100;
        this.draw(percentage);
        
        if (this.iteration === this.interval) {
            clearInterval(this.timer);
        }
    }

    draw(percentage) {
        this.element.style.transform = `translateY(-${100 - percentage}%)`;
    }
}

export default Timer;