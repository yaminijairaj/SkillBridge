// monitor.js - Screen Proctoring Module
const monitorModule = {
    score: 100,
    active: false,
    incidents: [],

    start() {
        this.score = 100;
        this.incidents = [];
        this.active = true;
        this.updateDisplay();

        this._visibilityHandler = () => this.handleVisibility();
        this._blurHandler = () => this.handleBlur();

        document.addEventListener('visibilitychange', this._visibilityHandler);
        window.addEventListener('blur', this._blurHandler);
    },

    stop() {
        this.active = false;
        if (this._visibilityHandler) {
            document.removeEventListener('visibilitychange', this._visibilityHandler);
            window.removeEventListener('blur', this._blurHandler);
        }
    },

    handleVisibility() {
        if (!this.active) return;
        if (document.hidden) {
            this.recordIncident('Tab switch detected');
        }
    },

    handleBlur() {
        if (!this.active) return;
        this.recordIncident('Window focus lost');
    },

    recordIncident(type) {
        const last = this.incidents[this.incidents.length - 1];
        const now = Date.now();
        // Debounce to avoid multi-counting (e.g. blur then visibility hide quickly together)
        if (last && (now - last.timestamp < 1000)) return;

        this.incidents.push({ type, timestamp: now });

        this.score = Math.max(0, this.score - 10);
        this.updateDisplay();

        if (window.ui) {
            ui.toast(`Proctoring Alert: ${type}. Integrity score decreased.`, 'error');
        }
    },

    getScore() {
        return this.score;
    },

    updateDisplay() {
        const el = document.getElementById('integrity-score-display');
        const statusEl = document.getElementById('integrity-status-display');
        if (!el) return;

        el.textContent = `${this.score}%`;
        el.className = 'integrity-score';
        if (this.score < 80) el.classList.add('warning');
        if (this.score < 60) el.classList.add('danger');

        if (statusEl) {
            statusEl.textContent = this.score >= 80 ? 'Monitoring Active 🟢' :
                (this.score >= 60 ? 'Suspicious Activity 🟡' : 'Review Required 🔴');
        }
    }
};
