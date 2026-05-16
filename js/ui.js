class UI {
    // --- Navigation ---
    static showView(viewId) {
        document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
        const targetView = document.getElementById(`view-${viewId}`);
        if (targetView) { targetView.classList.add('active'); window.scrollTo(0, 0); }
    }

    static showToast(message, type = 'info', duration = 4000) {
        // Remove existing toast if any
        const existing = document.getElementById('sb-toast');
        if (existing) existing.remove();

        const colors = {
            success: { bg: 'rgba(16,185,129,0.15)', border: '#10b981', icon: 'bx-check-circle', text: '#10b981' },
            error:   { bg: 'rgba(248,81,73,0.15)',  border: '#f85149', icon: 'bx-error-circle', text: '#f85149' },
            info:    { bg: 'rgba(0,243,255,0.10)',   border: '#00f3ff', icon: 'bx-info-circle',  text: '#00f3ff' }
        };
        const c = colors[type] || colors.info;

        const toast = document.createElement('div');
        toast.id = 'sb-toast';
        toast.style.cssText = `
            position:fixed; top:1.25rem; right:1.25rem; z-index:9999;
            background:${c.bg}; border:1px solid ${c.border};
            border-radius:12px; padding:0.85rem 1.25rem;
            display:flex; align-items:center; gap:0.75rem;
            backdrop-filter:blur(12px); box-shadow:0 8px 32px rgba(0,0,0,0.3);
            max-width:360px; animation:toastIn 0.35s ease;
            font-family:inherit; color:#fff; font-size:0.92rem; line-height:1.4;
        `;
        toast.innerHTML = `
            <i class='bx ${c.icon}' style="font-size:1.4rem; color:${c.text}; flex-shrink:0;"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" style="
                margin-left:auto; background:none; border:none; color:rgba(255,255,255,0.5);
                cursor:pointer; font-size:1.1rem; padding:0; flex-shrink:0;
            ">✕</button>
        `;

        // Inject keyframe if not already present
        if (!document.getElementById('toast-style')) {
            const style = document.createElement('style');
            style.id = 'toast-style';
            style.textContent = '@keyframes toastIn{from{opacity:0;transform:translateX(100%)}to{opacity:1;transform:translateX(0)}}';
            document.head.appendChild(style);
        }

        document.body.appendChild(toast);
        setTimeout(() => toast && toast.remove(), duration);
    }

    static updateAuthNav() {
        const navAuth = document.getElementById('nav-auth');
        const navUser = document.getElementById('nav-user');
        const navUserName = document.getElementById('nav-user-name');
        if (state.user) {
            if (navAuth) navAuth.style.display = 'none';
            if (navUser) navUser.style.display = 'flex';
            if (navUserName) navUserName.textContent = state.user.name;
        } else {
            if (navAuth) navAuth.style.display = 'flex';
            if (navUser) navUser.style.display = 'none';
        }
    }

    // --- Student Views ---
    static renderRoles() {
        const container = document.getElementById('role-selector');
        container.innerHTML = '';
        if (!state.roles || state.roles.length === 0) {
            container.innerHTML = '<p class="text-muted">Loading roles...</p>';
            return;
        }
        state.roles.forEach(role => {
            const el = document.createElement('div');
            el.className = `role-card ${state.goalRoleId === role.id ? 'selected' : ''}`;
            el.innerHTML = `<i class='bx ${role.icon}'></i><h4 style="margin:0; font-size:1.1rem;">${role.title}</h4>`;
            el.onclick = () => {
                state.setGoal(role.id);
                UI.renderRoles();
                document.getElementById('step-2-card').style.opacity = '1';
                document.getElementById('step-2-card').style.pointerEvents = 'auto';
                UI.checkAnalysisReady();
            };
            container.appendChild(el);
        });
    }

    static renderManualSkills() {
        const container = document.getElementById('manual-skills-container');
        container.innerHTML = '';
        state.existingSkills.forEach(skill => {
            const tag = document.createElement('span');
            tag.className = 'tag tag-success tag-removable';
            tag.innerHTML = `${skill} <i class='bx bx-x' style="font-size:1.2rem; cursor:pointer;" onclick="app.removeSkill('${skill}')"></i>`;
            container.appendChild(tag);
        });
        UI.checkAnalysisReady();
    }

    static checkAnalysisReady() {
        const btn = document.getElementById('btn-analyze');
        if (state.goalRoleId && state.existingSkills.size > 0) {
            btn.style.display = 'inline-block';
        } else {
            btn.style.display = 'none';
        }
    }

    static renderSkillProfile() {
        const container = document.getElementById('profile-skills-list');
        const quizBanMessage = document.getElementById('quiz-ban-message');
        const quizTestsContainer = document.getElementById('quiz-tests-container');
        container.innerHTML = '';
        state.existingSkills.forEach(skill => {
            container.innerHTML += `
                <div class="skill-row">
                    <span style="font-weight: 500; font-size: 1.05rem;"><i class='bx bx-check-shield text-success' style="margin-right:0.5rem;"></i>${skill}</span>
                </div>`;
        });
        if (!quizBanMessage || !quizTestsContainer) return;
        if (!state.quizTests || state.quizTests.length === 0) {
            quizTestsContainer.innerHTML = '<p class="text-muted">Loading aptitude tests...</p>';
            return;
        }
        quizTestsContainer.innerHTML = state.quizTests.map(test => {
            const kickerText = test.id === 'technical' ? 'Technical Test' : 'Aptitude Test';
            return `
            <button class="quiz-test-card" onclick="app.startQuiz('${test.id}')">
                <span class="quiz-test-kicker">${kickerText}</span>
                <strong>${test.title}</strong>
                <span>${test.description}</span>
                <span class="quiz-test-meta">${test.totalQuestions} questions</span>
            </button>`;
        }).join('');
        if (state.isQuizBanned()) {
            const banTime = state.quizBan.bannedAt ? new Date(state.quizBan.bannedAt).toLocaleString() : 'this session';
            quizBanMessage.style.display = 'block';
            quizBanMessage.textContent = `You are banned from taking another aptitude test because copied behavior was detected on ${banTime}. ${state.quizBan.reason}`;
            quizTestsContainer.querySelectorAll('.quiz-test-card').forEach(card => { card.disabled = true; card.classList.add('blocked'); });
        } else {
            quizBanMessage.style.display = 'none';
            quizBanMessage.textContent = '';
        }
    }

    static renderAnalysisResults() {
        const role = state.getGoalRole();
        if (!role) return;
        document.getElementById('analysis-role-name').textContent = role.title;
        const circle = document.getElementById('match-circle');
        const text = document.getElementById('match-percentage');
        setTimeout(() => {
            const matchPct = state.getMatchPercentage();
            text.textContent = `${matchPct}%`;
            circle.style.strokeDasharray = `${matchPct}, 100`;
        }, 100);
        const existingList = document.getElementById('analysis-existing-list');
        const missingList = document.getElementById('analysis-missing-list');
        existingList.innerHTML = '';
        missingList.innerHTML = '';
        const mySkillsLower = Array.from(state.existingSkills).map(s => s.toLowerCase());
        role.skills.forEach(skill => {
            const el = document.createElement('div');
            el.className = 'analysis-item';
            if (mySkillsLower.includes(skill.toLowerCase())) {
                el.innerHTML = `<span><i class='bx bx-check' style="color:var(--success); margin-right:0.5rem;"></i>${skill}</span> <span class="text-muted" style="font-size:0.8rem;">Mastered</span>`;
                existingList.appendChild(el);
            } else {
                el.innerHTML = `<span><i class='bx bx-x' style="color:var(--danger); margin-right:0.5rem;"></i>${skill}</span> <span class="text-muted" style="font-size:0.8rem;">Required Gap</span>`;
                missingList.appendChild(el);
            }
        });
        if (existingList.children.length === 0) {
            existingList.innerHTML = '<p class="text-muted" style="padding: 1rem; text-align:center; font-size:0.9rem;">None of your current skills map to the core requirements of this role.</p>';
        }
    }

    static renderRoadmap() {
        const container = document.getElementById('roadmap-stages');
        container.innerHTML = '';
        const role = state.getGoalRole();
        if (role) document.getElementById('roadmap-role-name').textContent = role.title;
        if (state.roadmap.length === 0) {
            container.innerHTML = '<p class="text-muted">You have totally mastered this role! No roadmap generated.</p>';
            return;
        }
        state.roadmap.forEach(skillMap => {
            skillMap.steps.forEach(step => {
                const globalIndex = `${skillMap.skillName}-${step.id}`;
                const isCompleted = state.completedSkills.has(globalIndex);
                const stageEl = document.createElement('div');
                stageEl.className = `roadmap-stage ${isCompleted ? 'completed' : ''}`;
                let resourcesHtml = '';
                if (step.resources) {
                    resourcesHtml = `<div class="roadmap-resources">`;
                    step.resources.forEach(r => {
                        resourcesHtml += `<a href="${r.url}" target="_blank" rel="noopener noreferrer" class="resource-link"><i class='bx bx-link-external'></i> ${r.title}</a>`;
                    });
                    resourcesHtml += `</div>`;
                }
                stageEl.innerHTML = `
                    <div class="roadmap-header">
                        <div>
                            <span class="text-muted" style="font-size:0.85rem; text-transform:uppercase; letter-spacing:1px; margin-bottom:0.25rem; display:block;">Skill: ${skillMap.skillName}</span>
                            <h3 style="margin:0;">${step.title}</h3>
                            <span class="text-muted" style="font-size:0.9rem;"><i class='bx bx-time-five'></i> Est. ${step.estimatedTime}</span>
                        </div>
                        <label class="custom-checkbox">
                            <input type="checkbox" onchange="app.toggleStep('${globalIndex}', this.checked)" ${isCompleted ? 'checked' : ''}>
                            <div class="checkmark"></div>
                            <span class="text-muted" style="font-size:0.9rem;">Mark complete</span>
                        </label>
                    </div>
                    ${resourcesHtml}`;
                container.appendChild(stageEl);
            });
        });
    }

    static updateDashboard() {
        const emptyState = document.getElementById('dashboard-empty');
        const contentState = document.getElementById('dashboard-content');
        const guestLogin = document.getElementById('dash-guest-login');
        if (guestLogin) guestLogin.style.display = state.user ? 'none' : 'block';
        if (!state.goalRoleId) {
            emptyState.style.display = 'block';
            contentState.style.display = 'none';
            return;
        }
        emptyState.style.display = 'none';
        contentState.style.display = 'block';
        const role = state.getGoalRole();
        document.getElementById('dash-role-title').textContent = role.title;
        document.getElementById('dash-score').textContent = `${state.getMatchPercentage()}%`;
        const aptitudeScoreEl = document.getElementById('dash-aptitude');
        if (!aptitudeScoreEl) {
            const dashScoreCard = document.getElementById('dash-score').closest('.glass-card');
            dashScoreCard.outerHTML = `
                <div class="glass-card">
                    <div style="display:flex; justify-content: space-between; align-items:flex-end;">
                        <div>
                            <h4 class="text-muted mb-1" style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px;">Employability</h4>
                            <div style="display: flex; align-items: baseline; gap: 0.5rem;">
                                <h3 id="dash-score" style="font-size: 2.5rem; color: var(--neon-green);">${state.getMatchPercentage()}%</h3>
                            </div>
                        </div>
                        <div style="text-align:right;">
                            <h4 class="text-muted mb-1" style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px;">Aptitude</h4>
                            <div style="display: flex; align-items: baseline; gap: 0.5rem; justify-content:flex-end;">
                                <h3 id="dash-aptitude" style="font-size: 1.8rem; color: var(--neon-blue);">${state.aptitudeScore !== null ? Math.round(state.aptitudeScore) + '%' : 'N/A'}</h3>
                            </div>
                        </div>
                    </div>
                </div>`;
        } else {
            aptitudeScoreEl.textContent = state.aptitudeScore !== null ? Math.round(state.aptitudeScore) + '%' : 'N/A';
        }
        document.getElementById('dash-learned-skills').textContent = role.skills.length - state.missingSkills.length;
        document.getElementById('dash-total-skills').textContent = role.skills.length;
        const existingTagsContainer = document.getElementById('dash-existing-tags');
        const missingTagsContainer = document.getElementById('dash-missing-tags');
        document.getElementById('dash-existing-count').textContent = state.existingSkills.size;
        document.getElementById('dash-missing-count').textContent = state.missingSkills.length;
        existingTagsContainer.innerHTML = Array.from(state.existingSkills).map(s => `<span class="tag tag-success">${s}</span>`).join('');
        missingTagsContainer.innerHTML = state.missingSkills.map(s => `<span class="tag tag-danger">${s}</span>`).join('');
        const previewContainer = document.getElementById('dash-roadmap-preview');
        if (state.roadmap.length > 0) {
            const overallProgress = state.getOverallProgress();
            previewContainer.innerHTML = `
                <div style="margin-bottom: 0.5rem; display: flex; justify-content: space-between;">
                    <span class="text-muted font-bold">Overall Progress</span>
                    <span style="color: var(--neon-blue); font-weight: bold;">${overallProgress}%</span>
                </div>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${overallProgress}%;"></div>
                </div>
                <p class="text-muted mt-2" style="font-size:0.9rem;">You have ${state.roadmap.length} active learning paths for missing skills.</p>`;
        } else {
            previewContainer.innerHTML = `<p class="text-muted">You are fully prepared for this role!</p>`;
        }
    }

    // --- Educator Portal ---
    static renderEducatorDashboard(students) {
        UI._allStudents = students;

        const total = students.length;
        const withScore = students.filter(s => (s.profile_data?.matchPercentage || 0) > 0);
        const avgScore = withScore.length > 0
            ? Math.round(withScore.reduce((acc, s) => acc + (s.profile_data?.matchPercentage || 0), 0) / withScore.length)
            : 0;
        const testsCompleted = students.filter(s => s.profile_data?.aptitudeScore != null).length;

        const totalEl = document.getElementById('edu-stat-total');
        const avgEl = document.getElementById('edu-stat-avg-score');
        const testsEl = document.getElementById('edu-stat-tests');
        if (totalEl) totalEl.textContent = total;
        if (avgEl) avgEl.textContent = total > 0 ? `${avgScore}%` : '—';
        if (testsEl) testsEl.textContent = testsCompleted;

        UI._renderStudentTable(students);
    }

    static _renderStudentTable(students) {
        const container = document.getElementById('student-roster-container');
        if (!container) return;

        if (students.length === 0) {
            container.innerHTML = '<p class="text-muted text-center" style="padding:3rem;">No students have registered yet.</p>';
            return;
        }

        const roleLabels = {
            frontend: 'Frontend Dev', backend: 'Backend Dev',
            data_analyst: 'Data Analyst', ai_engineer: 'AI Engineer', mobile: 'Mobile Dev'
        };

        const rows = students.map((s, i) => {
            const pd = s.profile_data || {};
            const roleLabel = roleLabels[pd.goalRoleId] || '—';
            const match = pd.matchPercentage || 0;
            const apt = pd.aptitudeScore != null ? Math.round(pd.aptitudeScore) + '%' : '—';
            const totalSteps = (pd.roadmap || []).reduce((acc, r) => acc + (r.steps?.length || 0), 0);
            const doneSteps = (pd.completedSkills || []).length;
            const progress = totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : 0;
            const scoreColor = match >= 70 ? 'var(--neon-green)' : match >= 40 ? 'var(--accent-cyan)' : (match > 0 ? '#f85149' : 'var(--text-muted)');
            const joined = s.created_at ? new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

            return `
            <tr data-index="${i}" style="border-bottom:1px solid rgba(255,255,255,0.05); cursor:pointer; transition:background 0.2s;"
                onclick="UI.openStudentDetail(${i})"
                onmouseenter="this.style.background='rgba(255,255,255,0.04)'"
                onmouseleave="this.style.background='transparent'">
                <td style="padding:1rem 0.75rem;">
                    <div style="font-weight:600;">${s.name}</div>
                    <div style="font-size:0.78rem; color:var(--text-muted); margin-top:0.1rem;">${joined}</div>
                </td>
                <td style="padding:1rem 0.75rem; color:var(--text-muted); font-size:0.9rem;">${roleLabel}</td>
                <td style="padding:1rem 0.75rem; text-align:center; font-weight:700; color:${scoreColor}; font-size:1.1rem;">${match > 0 ? match + '%' : '—'}</td>
                <td style="padding:1rem 0.75rem; text-align:center; color:var(--accent-cyan); font-weight:600;">${apt}</td>
                <td style="padding:1rem 0.75rem; text-align:center;">
                    ${totalSteps > 0 ? `
                    <div style="display:flex; align-items:center; gap:0.5rem; justify-content:center;">
                        <div style="flex:1; max-width:70px; height:5px; background:rgba(255,255,255,0.1); border-radius:3px; overflow:hidden;">
                            <div style="height:100%; width:${progress}%; background:var(--accent-green); border-radius:3px; transition:width 0.5s;"></div>
                        </div>
                        <span style="font-size:0.8rem; color:var(--text-muted); min-width:30px;">${progress}%</span>
                    </div>` : `<span style="color:var(--text-muted); font-size:0.85rem;">—</span>`}
                </td>
                <td style="padding:1rem 0.75rem; text-align:center;">
                    <span style="font-size:0.8rem; color:var(--accent-cyan); border:1px solid rgba(0,243,255,0.3); border-radius:20px; padding:0.25rem 0.75rem;">View</span>
                </td>
            </tr>`;
        }).join('');

        container.innerHTML = `
            <div style="overflow-x:auto;">
                <table style="width:100%; border-collapse:collapse;">
                    <thead>
                        <tr style="border-bottom:1px solid var(--border-color);">
                            <th style="text-align:left; padding:0.75rem; color:var(--text-muted); font-size:0.8rem; font-weight:500; text-transform:uppercase; letter-spacing:1px;">Student</th>
                            <th style="text-align:left; padding:0.75rem; color:var(--text-muted); font-size:0.8rem; font-weight:500; text-transform:uppercase; letter-spacing:1px;">Target Role</th>
                            <th style="text-align:center; padding:0.75rem; color:var(--text-muted); font-size:0.8rem; font-weight:500; text-transform:uppercase; letter-spacing:1px;">Match</th>
                            <th style="text-align:center; padding:0.75rem; color:var(--text-muted); font-size:0.8rem; font-weight:500; text-transform:uppercase; letter-spacing:1px;">Aptitude</th>
                            <th style="text-align:center; padding:0.75rem; color:var(--text-muted); font-size:0.8rem; font-weight:500; text-transform:uppercase; letter-spacing:1px;">Progress</th>
                            <th style="text-align:center; padding:0.75rem; color:var(--text-muted); font-size:0.8rem; font-weight:500; text-transform:uppercase; letter-spacing:1px;">Details</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>`;
    }

    static filterStudentRoster(query) {
        if (!UI._allStudents) return;
        const q = query.toLowerCase().trim();
        if (!q) { UI._renderStudentTable(UI._allStudents); return; }
        const roleLabels = { frontend: 'frontend dev', backend: 'backend dev', data_analyst: 'data analyst', ai_engineer: 'ai engineer', mobile: 'mobile dev' };
        const filtered = UI._allStudents.filter(s => {
            const pd = s.profile_data || {};
            const roleStr = roleLabels[pd.goalRoleId] || '';
            const skills = (pd.existingSkills || []).join(' ').toLowerCase();
            return s.name.toLowerCase().includes(q) || roleStr.includes(q) || skills.includes(q);
        });
        UI._renderStudentTable(filtered);
    }

    static openStudentDetail(index) {
        const s = UI._allStudents[index];
        if (!s) return;
        const pd = s.profile_data || {};
        const roleLabels = { frontend: 'Frontend Developer', backend: 'Backend Developer', data_analyst: 'Data Analyst', ai_engineer: 'AI Engineer', mobile: 'Mobile App Developer' };
        const match = pd.matchPercentage || 0;
        const apt = pd.aptitudeScore != null ? Math.round(pd.aptitudeScore) + '%' : 'Not taken';
        const existing = (pd.existingSkills || []).map(sk => `<span class="tag tag-success" style="font-size:0.8rem;">${sk}</span>`).join('') || '<span class="text-muted">None recorded</span>';
        const missing = (pd.missingSkills || []).map(sk => `<span class="tag tag-danger" style="font-size:0.8rem;">${sk}</span>`).join('') || '<span class="text-muted text-success">None — fully prepared!</span>';
        const totalSteps = (pd.roadmap || []).reduce((acc, r) => acc + (r.steps?.length || 0), 0);
        const doneSteps = (pd.completedSkills || []).length;
        const progress = totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : 0;

        document.getElementById('student-detail-content').innerHTML = `
            <h3 style="margin-bottom:0.25rem;">${s.name}</h3>
            <p class="text-muted" style="font-size:0.9rem; margin-bottom:2rem;">Target: <strong style="color:#fff;">${roleLabels[pd.goalRoleId] || 'Not set'}</strong></p>
            <div class="grid-3 mb-4" style="gap:1rem;">
                <div style="text-align:center; background:rgba(255,255,255,0.04); border-radius:8px; padding:1rem;">
                    <div style="font-size:1.8rem; font-weight:700; color:var(--neon-green);">${match > 0 ? match + '%' : '—'}</div>
                    <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-top:0.25rem;">Match Score</div>
                </div>
                <div style="text-align:center; background:rgba(255,255,255,0.04); border-radius:8px; padding:1rem;">
                    <div style="font-size:1.8rem; font-weight:700; color:var(--accent-cyan);">${apt}</div>
                    <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-top:0.25rem;">Aptitude</div>
                </div>
                <div style="text-align:center; background:rgba(255,255,255,0.04); border-radius:8px; padding:1rem;">
                    <div style="font-size:1.8rem; font-weight:700; color:var(--accent-green);">${totalSteps > 0 ? progress + '%' : '—'}</div>
                    <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-top:0.25rem;">Roadmap Done</div>
                </div>
            </div>
            <div class="mb-3">
                <h4 style="font-size:0.85rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:0.75rem;">Skills They Have</h4>
                <div style="display:flex; flex-wrap:wrap; gap:0.5rem;">${existing}</div>
            </div>
            <div>
                <h4 style="font-size:0.85rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:0.75rem;">Skill Gaps</h4>
                <div style="display:flex; flex-wrap:wrap; gap:0.5rem;">${missing}</div>
            </div>`;

        const overlay = document.getElementById('student-detail-overlay');
        overlay.style.display = 'flex';
        overlay.onclick = (e) => { if (e.target === overlay) UI.closeStudentDetail(); };
    }

    static closeStudentDetail() {
        const overlay = document.getElementById('student-detail-overlay');
        if (overlay) overlay.style.display = 'none';
    }
}
