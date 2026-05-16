// app.js - Main Application State and Router

const app = {
    state: {
        currentUser: null,
        currentChallenge: null,
        examStartTime: null,
        submission: null
    },

    init() {
        console.log('SkillVerify App Initialized');
        window.addEventListener('hashchange', () => this.handleRoute());
        this.checkUser();
        this.handleRoute();
    },

    checkUser() {
        try {
            const stored = localStorage.getItem('sv_user');
            if (stored) {
                this.state.currentUser = JSON.parse(stored);
            }
        } catch (e) { }
    },

    navigate(viewId) {
        window.location.hash = viewId;
    },

    handleRoute() {
        const hash = window.location.hash.replace('#', '') || 'landing';

        document.querySelectorAll('.page-view').forEach(el => {
            el.classList.remove('active');
        });

        const targetView = document.getElementById(`view-${hash}`);
        if (targetView) {
            targetView.classList.add('active');

            if (hash === 'student') this.initStudentPortal();
            if (hash === 'evaluator') this.initEvaluatorPortal();
            if (hash === 'landing') {
                this.state.currentUser = null;
                localStorage.removeItem('sv_user');
            }
        } else {
            this.navigate('landing');
        }
    },

    initStudentPortal() {
        if (!this.state.currentUser || this.state.currentUser.role !== 'student') {
            const name = prompt("Enter your full name for the certificate:") || "Guest Student";
            this.state.currentUser = { name, role: 'student' };
            localStorage.setItem('sv_user', JSON.stringify(this.state.currentUser));
        }

        const listEl = document.getElementById('challenge-list');
        listEl.innerHTML = '';

        challengesData.forEach(ch => {
            const card = document.createElement('div');
            card.className = 'card-btn';
            card.innerHTML = `
                <div class="badge-row">
                    <span class="badge">${ch.difficulty}</span>
                    <span class="badge outlined">${ch.category}</span>
                </div>
                <h3 style="margin-top: 1rem;">${ch.title}</h3>
                <p>${ch.description.substring(0, 80)}...</p>
                <div style="margin-top: auto; padding-top: 1rem; color: var(--text-secondary); font-size: 0.85rem">
                    ⏱️ ${ch.duration} Minutes
                </div>
            `;
            card.onclick = () => this.startExam(ch.id);
            listEl.appendChild(card);
        });
    },

    startExam(challengeId) {
        const challenge = challengesData.find(c => c.id === challengeId);
        if (!challenge) return;

        this.state.currentChallenge = challenge;
        this.state.examStartTime = Date.now();

        document.getElementById('exam-title').textContent = challenge.title;
        document.getElementById('exam-difficulty').textContent = challenge.difficulty;
        document.getElementById('exam-category').textContent = challenge.category;
        document.getElementById('exam-description').innerHTML = challenge.descriptionHtml;

        let filename = 'main.js';
        if (challenge.category === 'Python') filename = 'main.py';
        if (challenge.category === 'HTML/CSS') filename = 'style.css';
        document.getElementById('editor-filename').textContent = filename;

        // Reset modules
        if (window.editorModule) editorModule.init(challenge.starterCode);
        if (window.monitorModule) monitorModule.start();
        if (window.timerModule) timerModule.start(challenge.duration, () => this.submitExam());

        this.navigate('exam');
        if (window.ui) ui.toast('Exam started. Screen monitoring is active.', 'warning');
    },

    submitExam() {
        const code = window.editorModule ? editorModule.getValue() : '';

        if (window.timerModule) timerModule.stop();
        if (window.monitorModule) monitorModule.stop();

        const integrityScore = window.monitorModule ? monitorModule.getScore() : 100;
        const originalityResult = window.originalityModule ?
            originalityModule.check(code, this.state.currentChallenge) :
            { score: 100, verdict: 'ORIGINAL' };

        this.state.submission = {
            id: 'sub_' + Math.random().toString(36).substr(2, 9),
            challengeId: this.state.currentChallenge.id,
            challengeTitle: this.state.currentChallenge.title,
            studentName: this.state.currentUser.name,
            code: code,
            integrityScore: integrityScore,
            originalityScore: originalityResult.score,
            verdict: originalityResult.verdict,
            timestamp: new Date().toISOString()
        };

        let subs = JSON.parse(localStorage.getItem('sv_submissions') || '[]');
        subs.push(this.state.submission);
        localStorage.setItem('sv_submissions', JSON.stringify(subs));

        this.showResult();
    },

    showResult() {
        const sub = this.state.submission;

        document.getElementById('result-integrity').textContent = \`\${sub.integrityScore}%\`;
        document.getElementById('result-originality').textContent = \`\${sub.originalityScore}%\`;
        
        const verdictEl = document.getElementById('result-verdict');
        verdictEl.textContent = sub.verdict;
        verdictEl.style.color = sub.verdict === 'ORIGINAL' ? 'var(--success)' : 
                               (sub.verdict === 'FLAGGED' ? 'var(--danger)' : 'var(--warning)');

        if(window.certificateModule) certificateModule.generate(sub);

        this.navigate('result');
    },

    downloadCertificate() {
        if(window.certificateModule) certificateModule.download();
    },

    // Evaluator
    initEvaluatorPortal() {
        if (!this.state.currentUser || this.state.currentUser.role !== 'evaluator') {
            this.state.currentUser = { name: 'Evaluator', role: 'evaluator' };
            localStorage.setItem('sv_user', JSON.stringify(this.state.currentUser));
        }
        this.switchEvaluatorTab('submissions');
    },

    switchEvaluatorTab(tab) {
        document.getElementById('tab-submissions').style.opacity = tab === 'submissions' ? '1' : '0.6';
        document.getElementById('tab-challenges').style.opacity = tab === 'challenges' ? '1' : '0.6';

        const content = document.getElementById('evaluator-content-area');
        content.innerHTML = '';

        if (tab === 'submissions') {
            const subs = JSON.parse(localStorage.getItem('sv_submissions') || '[]');
            if (subs.length === 0) {
                content.innerHTML = '<div class="glass-panel" style="text-align:center; padding: 3rem;"><p style="color:var(--text-secondary)">No submissions yet.</p></div>';
                return;
            }

            subs.reverse().forEach(sub => {
                const card = document.createElement('div');
                card.className = 'glass-panel';
                card.style.marginBottom = '1rem';
                
                let vColor = sub.verdict === 'ORIGINAL' ? 'var(--success)' : 
                            (sub.verdict === 'FLAGGED' ? 'var(--danger)' : 'var(--warning)');
                
                card.innerHTML = \`
                    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                        <div>
                            <h3 style="margin-bottom:0.5rem; display:flex; align-items:center; gap:0.5rem;">
                                \${sub.studentName}
                                <span class="badge outlined">\${sub.challengeTitle}</span>
                            </h3>
                            <div style="font-size:0.85rem; color:var(--text-secondary); margin-bottom: 1rem;">
                                \${new Date(sub.timestamp).toLocaleString()}
                            </div>
                            <button class="secondary-btn" style="font-size: 0.8rem; padding: 0.4rem 0.8rem;" onclick="app.viewCode('\${sub.id}')">View Code</button>
                        </div>
                        <div style="text-align:right">
                            <div style="font-size:1.2rem; font-weight:bold; color:\${vColor}">
                                \${sub.verdict} <span style="font-size:0.9rem; font-weight:normal;">(\${sub.originalityScore}% Match)</span>
                            </div>
                            <div style="font-size:0.9rem; margin-top:0.25rem;">
                                Proctoring Integrity: <span style="font-weight:bold; color:\${sub.integrityScore < 80 ? 'var(--danger)' : 'var(--success)'}">\${sub.integrityScore}%</span>
                            </div>
                        </div>
                    </div>
                    <div id="code-view-\${sub.id}" style="display:none; margin-top:1rem; padding-top:1rem; border-top:1px solid var(--bg-panel-border);">
                        <pre style="background:#0d1117; padding:1rem; border-radius:8px; overflow-x:auto; font-family:var(--font-mono); font-size:14px; color:#e6edf3;">\${this.escapeHtml(sub.code)}</pre>
                    </div>
                \`;
                content.appendChild(card);
            });
        } else {
            content.innerHTML = '<div class="glass-panel" style="text-align:center; padding: 3rem;"><p style="color:var(--text-secondary)">Challenge management module coming soon.</p><button class="primary-btn" style="margin-top: 1rem;">Create Challenge</button></div>';
        }
    },

    viewCode(subId) {
        const el = document.getElementById(\`code-view-\${subId}\`);
        if(el) {
            el.style.display = el.style.display === 'none' ? 'block' : 'none';
        }
    },

    escapeHtml(unsafe) {
        return (unsafe || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }
};

const ui = {
    toast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if(!container) return;
        const el = document.createElement('div');
        el.className = \`toast \${type}\`;
        el.textContent = message;
        container.appendChild(el);
        setTimeout(() => {
            el.style.animation = 'slideInRight 0.3s ease-in reverse forwards';
            setTimeout(() => el.remove(), 300);
        }, 3000);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
