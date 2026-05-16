// timer.js - Countdown Timer
const timerModule = {
    interval: null,
    endTime: null,
    onExpire: null,

    start(minutes, callback) {
        this.stop();
        this.onExpire = callback;
        this.endTime = Date.now() + (minutes * 60 * 1000);

        this.updateDisplay();
        this.interval = setInterval(() => this.updateDisplay(), 1000);
    },

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    },

    updateDisplay() {
        const now = Date.now();
        const diff = this.endTime - now;

        const display = document.getElementById('timer-display');
        if (!display) return;

        if (diff <= 0) {
            this.stop();
            display.textContent = "00:00";
            if (this.onExpire) this.onExpire();
            return;
        }

        const m = Math.floor(diff / 60000);
        const s = Math.floor((diff % 60000) / 1000);

        display.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

        display.className = 'timer-display';
        if (m < 5) display.classList.add('low');
        if (m < 1) display.classList.add('critical');
    }
};
