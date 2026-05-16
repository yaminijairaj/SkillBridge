const app = {
    async init() {
        // Await Supabase session restore
        await state.loadSession();

        // Fetch roles and quiz tests
        await state.fetchRoles();
        await state.fetchQuizTests();

        // Render initial UI state
        UI.updateAuthNav();
        UI.renderRoles();
        UI.renderManualSkills();

        // If educator is already logged in, go straight to portal
        if (state.user && state.user.role === 'educator') {
            await app.loadEducatorPortal();
            UI.showView('educator-portal');
            return;
        }

        // If student already logged in, go to dashboard
        if (state.user && state.user.role === 'student') {
            app.navigate('dashboard');
        }

        // Initialize animations
        this.initParticles();
        this.initScrollSequence();
        this.initStorytelling();
        this.initGeneralObservers();
    },

    initParticles() {
        const container = document.getElementById('particles-container');
        if (!container) return;

        const particleCount = 20;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            // Random properties
            const size = Math.random() * 5 + 2; // 2px to 7px
            const left = Math.random() * 100; // 0% to 100vw
            const top = Math.random() * 100 + 100; // Start below fold
            const delay = Math.random() * 10; // 0s to 10s
            const duration = Math.random() * 10 + 10; // 10s to 20s

            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${left}vw`;
            particle.style.top = `${top}vh`;
            particle.style.animation = `particle-float ${duration}s ${delay}s linear infinite`;

            container.appendChild(particle);
        }
    },

    initScrollSequence() {
        const hero = document.getElementById('landing-hero');
        const roles = document.getElementById('landing-roles');
        const features = document.getElementById('landing-features');
        const staggerItems = document.querySelectorAll('.stagger-item');

        // Initial state
        if (roles) roles.classList.remove('active', 'exit');
        if (features) features.classList.remove('active', 'exit');

        window.addEventListener('scroll', () => {
            // Only run on landing page
            const landingView = document.getElementById('view-landing');
            if (!landingView || !landingView.classList.contains('active')) return;

            const scrollPos = window.scrollY;
            const windowHeight = window.innerHeight;

            // 1. Hero Shrink & Exit
            if (scrollPos > 100) {
                hero.classList.add('shrunk');
                // Hide header completely when roles start exiting
                if (scrollPos >= windowHeight * 1.2) {
                    hero.classList.add('exit');
                } else {
                    hero.classList.remove('exit');
                }
            } else {
                hero.classList.remove('shrunk', 'exit');
            }

            // 2. Roles Visibility (Center of the sequence)
            // Appears between 15% and 50%
            if (scrollPos > windowHeight * 0.3 && scrollPos < windowHeight * 1.2) {
                roles.classList.add('active');
                roles.classList.remove('exit');
            } else if (scrollPos >= windowHeight * 1.2) {
                roles.classList.add('exit');
                roles.classList.remove('active');
            } else {
                roles.classList.remove('active', 'exit');
            }

            // 3. Features Visibility (End of the sequence)
            // Appears after Roles start exiting
            if (scrollPos > windowHeight * 1.3) {
                if (!features.classList.contains('active')) {
                    features.classList.add('active');
                    // Stagger items one by one within 0.01s (very fast!)
                    staggerItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('show');
                        }, index * 10); // 0.01s = 10ms
                    });
                }
            } else {
                features.classList.remove('active');
                staggerItems.forEach(item => item.classList.remove('show'));
            }
        });
    },

    initStorytelling() {
        const storyBlocks = document.querySelectorAll('.story-block');
        const mockups = document.querySelectorAll('.mockup-step');

        if (!storyBlocks.length) return;

        const observerOptions = {
            root: null,
            rootMargin: '-40% 0px -40% 0px', // Trigger near center of viewport
            threshold: 0
        };

        const storyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stepNumber = entry.target.getAttribute('data-step');

                    // Update text opacity
                    storyBlocks.forEach(block => {
                        block.style.opacity = '0.3';
                        block.classList.remove('active');
                    });
                    entry.target.style.opacity = '1';
                    entry.target.classList.add('active');

                    // Switch Mockups
                    mockups.forEach(mockup => {
                        if (mockup.id === `mockup-${stepNumber}`) {
                            mockup.style.opacity = '1';
                            mockup.style.transform = 'translateY(0)';
                            mockup.style.pointerEvents = 'auto';

                            // Add active class for internal CSS animations with a slight delay
                            setTimeout(() => mockup.classList.add('active-ui'), 50);

                            // Trigger specific JS animations
                            if (stepNumber === '2') {
                                const bars = mockup.querySelectorAll('.bar-fill');
                                bars.forEach(bar => bar.style.width = bar.getAttribute('data-width'));
                            }

                            if (stepNumber === '4' && !mockup.classList.contains('animated-score')) {
                                mockup.classList.add('animated-score');
                                const scoreEl = mockup.querySelector('.readiness-score');
                                const skillsEl = mockup.querySelector('.skills-count');

                                // Animate Score to 85%
                                let currentScore = 0;
                                const scoreTimer = setInterval(() => {
                                    currentScore += 2;
                                    if (currentScore >= 85) { currentScore = 85; clearInterval(scoreTimer); }
                                    if (scoreEl) scoreEl.textContent = `${currentScore}%`;
                                }, 20);

                                // Animate Skills to 12
                                let currentSkills = 0;
                                const skillsTimer = setInterval(() => {
                                    currentSkills += 1;
                                    if (currentSkills >= 12) { currentSkills = 12; clearInterval(skillsTimer); }
                                    if (skillsEl) skillsEl.textContent = currentSkills;
                                }, 80);
                            }
                        } else {
                            mockup.style.opacity = '0';
                            mockup.style.transform = 'translateY(10px)'; // gentle fade down
                            mockup.style.pointerEvents = 'none';
                            mockup.classList.remove('active-ui');

                            // Reset bar widths when inactive so they re-animate
                            if (mockup.id === 'mockup-2') {
                                mockup.querySelectorAll('.bar-fill').forEach(bar => bar.style.width = '0');
                            }
                        }
                    });
                }
            });
        }, observerOptions);

        storyBlocks.forEach(block => storyObserver.observe(block));
    },

    initGeneralObservers() {
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.2 };

        const generalObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {

                    // Flow line specifically
                    if (entry.target.classList.contains('animated-flow-line')) {
                        entry.target.classList.add('active');
                        observer.unobserve(entry.target);
                    }

                    // Sections with stagger items
                    if (entry.target.id === 'how-it-works' || entry.target.id === 'stats-section') {
                        const items = entry.target.querySelectorAll('.stagger-item');
                        items.forEach((item, index) => {
                            setTimeout(() => {
                                item.classList.add('show');
                            }, index * 200);
                        });

                        // Counter animation for stats
                        if (entry.target.id === 'stats-section') {
                            const numbers = entry.target.querySelectorAll('.stat-number');
                            numbers.forEach(num => {
                                const target = parseInt(num.getAttribute('data-target'));
                                const duration = 2000;
                                const stepTime = 16;
                                const steps = duration / stepTime;
                                const step = target / steps;
                                let current = 0;
                                const timer = setInterval(() => {
                                    current += step;
                                    if (current >= target) {
                                        current = target;
                                        clearInterval(timer);
                                    }
                                    num.textContent = Math.floor(current).toLocaleString();
                                }, stepTime);
                            });
                        }

                        observer.unobserve(entry.target);
                    }
                }
            });
        }, observerOptions);

        const flowLine = document.querySelector('.animated-flow-line');
        if (flowLine) generalObserver.observe(flowLine);

        const howItWorks = document.getElementById('how-it-works');
        if (howItWorks) generalObserver.observe(howItWorks);

        const statsSection = document.getElementById('stats-section');
        if (statsSection) generalObserver.observe(statsSection);
    },

    // Current role context for modal (student | educator)
    _modalRole: 'student',

    openAuthModal(role, defaultTab = 'signin') {
        this.switchAuthRole(role || 'student');
        this.switchAuthTab(defaultTab);
        document.getElementById('auth-modal-overlay').classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    switchAuthRole(role) {
        this._modalRole = role;

        // Update Buttons
        const studentBtn = document.getElementById('role-btn-student');
        const educatorBtn = document.getElementById('role-btn-educator');

        if (studentBtn && educatorBtn) {
            studentBtn.classList.toggle('active', role === 'student');
            educatorBtn.classList.toggle('active', role === 'educator');
        }

        // Clear feedback when switching role
        ['modal-login-feedback', 'modal-signup-feedback'].forEach(id => {
            const el = document.getElementById(id);
            if (el) { el.style.display = 'none'; el.textContent = ''; }
        });
    },

    closeAuthModal(event) {
        if (event && event.target !== document.getElementById('auth-modal-overlay')) return;
        document.getElementById('auth-modal-overlay').classList.remove('active');
        document.body.style.overflow = '';
        // Clear feedback
        ['modal-login-feedback', 'modal-signup-feedback'].forEach(id => {
            const el = document.getElementById(id);
            if (el) { el.style.display = 'none'; el.textContent = ''; }
        });
    },

    switchAuthTab(tab) {
        document.getElementById('tab-signin').classList.toggle('active', tab === 'signin');
        document.getElementById('tab-signup').classList.toggle('active', tab === 'signup');
        document.getElementById('modal-signin-form').classList.toggle('active', tab === 'signin');
        document.getElementById('modal-signup-form').classList.toggle('active', tab === 'signup');
    },

    navigate(viewId, role = null) {
        if (viewId !== 'aptitude-quiz') {
            this.stopQuizMonitoring();
            this.clearQuizCloseTimer();
        }

        // Educator routing
        if (role === 'educator' || viewId === 'educator-portal') {
            app.loadEducatorPortal();
            return;
        }

        // Auth guard
        const protectedViews = ['input', 'skill-profile', 'aptitude-quiz', 'analysis', 'roadmap'];
        if (protectedViews.includes(viewId) && !state.user) {
            UI.showView('login');
            return;
        }

        // View specific logic before showing
        if (viewId === 'dashboard') {
            UI.updateDashboard();
        } else if (viewId === 'skill-profile') {
            if (!state.goalRoleId) { app.navigate('input'); return; }
            UI.renderSkillProfile();
        } else if (viewId === 'analysis') {
            if (!state.goalRoleId) { app.navigate('input'); return; }
            UI.renderAnalysisResults();
        } else if (viewId === 'roadmap') {
            if (state.roadmap.length === 0) { app.navigate('dashboard'); return; }
            UI.renderRoadmap();
        }

        UI.showView(viewId);
    },

    async loadEducatorPortal() {
        UI.showView('educator-portal');
        const container = document.getElementById('student-roster-container');
        if (container) container.innerHTML = '<p class="text-muted text-center" style="padding:3rem;"><i class="bx bx-loader-alt bx-spin" style="font-size:2rem;"></i><br>Loading students...</p>';
        const students = await api.getStudentRoster();
        UI.renderEducatorDashboard(students);
    },

    setAuthFeedback(formType, message, tone = 'error') {
        const feedbackEl = document.getElementById(`${formType}-feedback`);
        if (!feedbackEl) return;

        if (!message) {
            feedbackEl.style.display = 'none';
            feedbackEl.textContent = '';
            feedbackEl.className = 'auth-feedback';
            return;
        }

        feedbackEl.style.display = 'block';
        feedbackEl.textContent = message;
        feedbackEl.className = `auth-feedback ${tone}`;
    },

    async handleLogin(e) {
        e.preventDefault();

        // Read from modal inputs
        const emailEl = document.getElementById('modal-login-email');
        const passwordEl = document.getElementById('modal-login-password');
        const feedbackEl = document.getElementById('modal-login-feedback');
        const submitBtn = document.getElementById('modal-login-submit');

        if (!emailEl || !passwordEl) return;

        const email = emailEl.value;
        const password = passwordEl.value;
        const originalText = submitBtn.textContent;

        feedbackEl.style.display = 'none';
        submitBtn.disabled = true;
        submitBtn.textContent = 'Signing In...';

        const result = await api.login(email, password);

        submitBtn.disabled = false;
        submitBtn.textContent = originalText;

        if (!result.success) {
            feedbackEl.textContent = result.error || 'Invalid email or password.';
            feedbackEl.className = 'auth-feedback error';
            feedbackEl.style.display = 'block';
            return;
        }

        state.login(result.user);
        UI.updateAuthNav();
        document.getElementById('auth-modal-overlay').classList.remove('active');
        document.body.style.overflow = '';

        if (this._modalRole === 'educator' || result.user.role === 'educator') {
            this.navigate('educator-portal');
        } else {
            this.navigate('dashboard');
        }
    },

    async handleSignup(e) {
        e.preventDefault();

        const nameEl = document.getElementById('modal-signup-name');
        const emailEl = document.getElementById('modal-signup-email');
        const passwordEl = document.getElementById('modal-signup-password');
        const feedbackEl = document.getElementById('modal-signup-feedback');
        const submitBtn = document.getElementById('modal-signup-submit');

        if (!nameEl || !emailEl || !passwordEl) return;

        const name = nameEl.value;
        const email = emailEl.value;
        const password = passwordEl.value;
        const role = this._modalRole || 'student';
        const originalText = submitBtn.textContent;

        feedbackEl.style.display = 'none';
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating Account...';

        const result = await api.signup(name, email, password, role);

        submitBtn.disabled = false;
        submitBtn.textContent = originalText;

        if (!result.success) {
            feedbackEl.textContent = result.error || 'Unable to create account.';
            feedbackEl.className = 'auth-feedback error';
            feedbackEl.style.display = 'block';
            return;
        }

        // Email confirmation required
        if (result.needsConfirmation) {
            feedbackEl.textContent = result.message;
            feedbackEl.className = 'auth-feedback success';
            feedbackEl.style.display = 'block';
            submitBtn.textContent = 'Check Your Email ✓';
            return;
        }

        state.login(result.user);
        UI.updateAuthNav();
        document.getElementById('auth-modal-overlay').classList.remove('active');
        document.body.style.overflow = '';

        if (this._modalRole === 'educator' || result.user.role === 'educator') {
            this.navigate('educator-portal');
        } else {
            this.navigate('dashboard');
        }
    },

    async logout() {
        await state.logout();
        UI.updateAuthNav();
        this.setAuthFeedback('login', '');
        this.setAuthFeedback('signup', '');
        UI.showView('landing');
    },

    addManualSkill() {
        const input = document.getElementById('manual-skill-input');
        const skill = input.value.trim();
        if (skill) {
            state.addSkill(skill);
            input.value = '';
            UI.renderManualSkills();
        }
    },

    removeSkill(skill) {
        state.removeSkill(skill);
        UI.renderManualSkills();
    },

    async handleFileUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const btn = e.target.parentElement;
            const originalHtml = btn.innerHTML;

            btn.innerHTML = `<i class='bx bx-loader-alt bx-spin text-gradient' style="font-size: 3rem; margin-bottom: 1rem;"></i><h4>Analyzing File...</h4><p class="text-muted" style="font-size:0.9rem;">Extracting skills with AI</p>`;
            btn.style.pointerEvents = 'none';

            // Call Backend API
            const result = await api.analyzeResume(file);

            if (result && result.success) {
                result.extractedSkills.forEach(s => state.addSkill(s));
                UI.renderManualSkills();
                UI.showToast(`✓ Extracted ${result.extractedSkills.length} skills from your resume!`, 'success', 5000);
            } else {
                UI.showToast('Failed to analyze resume. Please try entering skills manually.', 'error');
            }

            btn.innerHTML = originalHtml;
            btn.style.pointerEvents = 'auto';
        }
    },

    async runAnalysis() {
        const btn = document.getElementById('btn-analyze');
        const originalText = btn.innerHTML;

        btn.innerHTML = `<i class='bx bx-loader-alt bx-spin' style="margin-right:0.5rem;"></i> Analyzing...`;
        btn.disabled = true;

        await state.analyzeGap();

        btn.innerHTML = originalText;
        btn.disabled = false;
        this.navigate('skill-profile');
    },

    // --- Quiz Logic ---
    quizState: {
        testId: null,
        testTitle: '',
        questions: [],
        currentQuestionIndex: 0,
        answers: {}, // map of questionId -> selectedOptionId
        selectedOptionId: null,
        isMonitoring: false,
        isClosedForCopying: false,
        lastIncidentAt: 0,
        cheatWarnings: 0 // Track number of warnings
    },

    async startQuiz(testId) {
        if (state.isQuizBanned()) {
            UI.renderSkillProfile();
            UI.showToast('You are banned from taking another aptitude test because copied behavior was detected.', 'error', 6000);
            return;
        }

        const selectedTestId = testId || state.quizTests[0]?.id;
        const quizPayload = await api.getQuiz(selectedTestId);

        if (!quizPayload || quizPayload.error) {
            UI.showToast(quizPayload?.error || 'Unable to load the aptitude test right now. Please try again.', 'error');
            return;
        }

        // Fetch questions from backend
        this.quizState.testId = quizPayload.testId;
        this.quizState.testTitle = quizPayload.title;
        this.quizState.questions = quizPayload.questions;
        this.quizState.currentQuestionIndex = 0;
        this.quizState.answers = {};
        this.quizState.selectedOptionId = null;
        this.quizState.isClosedForCopying = false;
        this.quizState.lastIncidentAt = 0;
        this.quizState.cheatWarnings = 0;

        if (this.quizState.questions.length === 0) {
            UI.showToast('Unable to load the aptitude test right now. Please try again.', 'error');
            return;
        }

        this.resetQuizUI();
        this.renderQuizQuestion();
        this.navigate('aptitude-quiz');
        this.startQuizMonitoring();
    },

    renderQuizQuestion() {
        const qIndex = this.quizState.currentQuestionIndex;
        const total = this.quizState.questions.length;

        if (total === 0) return; // safeguard

        document.getElementById('quiz-test-title').textContent = this.quizState.testTitle || 'Aptitude Test';
        document.getElementById('quiz-current-q').textContent = qIndex + 1;
        document.getElementById('quiz-total-q').textContent = total;
        document.getElementById('quiz-progress').style.width = `${((qIndex) / total) * 100}%`;

        const q = this.quizState.questions[qIndex];
        document.getElementById('quiz-question-text').textContent = q.question;

        const optionsList = document.getElementById('quiz-options-list');
        optionsList.innerHTML = '';

        q.options.forEach(opt => {
            const el = document.createElement('div');
            el.className = 'quiz-option';
            el.innerHTML = `
                <div class="option-letter">${opt.id.toUpperCase()}</div>
                <div style="font-size: 1.05rem;">${opt.text}</div>
            `;
            el.onclick = () => this.selectQuizOption(opt.id, el);
            optionsList.appendChild(el);
        });

        this.quizState.selectedOptionId = null;
        document.getElementById('btn-quiz-next').disabled = true;
        document.getElementById('btn-quiz-next').textContent = (qIndex === total - 1) ? 'Finish & See Results' : 'Next Question';
    },

    selectQuizOption(optId, el) {
        if (this.quizState.isClosedForCopying) return;

        document.querySelectorAll('.quiz-option').forEach(node => node.classList.remove('active'));
        el.classList.add('active');
        this.quizState.selectedOptionId = optId;
        document.getElementById('btn-quiz-next').disabled = false;
    },

    nextQuizQuestion() {
        if (this.quizState.isClosedForCopying) return;
        if (!this.quizState.selectedOptionId) return;

        // Record answer
        const q = this.quizState.questions[this.quizState.currentQuestionIndex];
        this.quizState.answers[q.id] = this.quizState.selectedOptionId;

        this.quizState.currentQuestionIndex++;

        if (this.quizState.currentQuestionIndex < this.quizState.questions.length) {
            this.renderQuizQuestion();
        } else {
            this.finishQuiz();
        }
    },

    async finishQuiz() {
        if (this.quizState.isClosedForCopying) return;

        this.stopQuizMonitoring();
        this.clearQuizCloseTimer();
        document.getElementById('quiz-progress').style.width = '100%';

        const btn = document.getElementById('btn-quiz-next');
        btn.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i> Submitting...`;
        btn.disabled = true;

        // Submit to backend
        const result = await api.submitQuiz(this.quizState.testId, this.quizState.answers);

        if (result && result.success) {
            state.setAptitudeScore(result.score);
        }

        this.navigate('analysis');
    },

    startQuizMonitoring() {
        this.stopQuizMonitoring();

        this.quizState.isMonitoring = true;
        this.quizState.lastIncidentAt = 0;

        this._quizVisibilityHandler = () => {
            if (document.hidden) {
                this.recordQuizIncident('Another tab was opened during the quiz.');
            }
        };

        this._quizBlurHandler = () => {
            this.recordQuizIncident('The quiz window lost focus during the test.');
        };

        this._quizClipboardHandler = (event) => {
            event.preventDefault();

            const actionMap = {
                copy: 'Copying quiz content was attempted.',
                cut: 'Cutting quiz content was attempted.',
                paste: 'Pasting into the quiz was attempted.'
            };

            this.recordQuizIncident(actionMap[event.type] || 'A clipboard action was attempted during the quiz.');
        };

        this._quizKeydownHandler = (event) => {
            const key = event.key.toLowerCase();
            if (!(event.ctrlKey || event.metaKey) || !['c', 'x', 'v'].includes(key)) {
                return;
            }

            event.preventDefault();

            const shortcutMap = {
                c: 'The copy shortcut was used during the quiz.',
                x: 'The cut shortcut was used during the quiz.',
                v: 'The paste shortcut was used during the quiz.'
            };

            this.recordQuizIncident(shortcutMap[key]);
        };

        this._quizContextMenuHandler = (event) => {
            event.preventDefault();
            this.recordQuizIncident('Right-click was used during the quiz.');
        };

        document.addEventListener('visibilitychange', this._quizVisibilityHandler);
        window.addEventListener('blur', this._quizBlurHandler);
        document.addEventListener('copy', this._quizClipboardHandler);
        document.addEventListener('cut', this._quizClipboardHandler);
        document.addEventListener('paste', this._quizClipboardHandler);
        document.addEventListener('keydown', this._quizKeydownHandler);
        document.addEventListener('contextmenu', this._quizContextMenuHandler);
    },

    stopQuizMonitoring() {
        this.quizState.isMonitoring = false;

        if (this._quizVisibilityHandler) {
            document.removeEventListener('visibilitychange', this._quizVisibilityHandler);
            window.removeEventListener('blur', this._quizBlurHandler);
            document.removeEventListener('copy', this._quizClipboardHandler);
            document.removeEventListener('cut', this._quizClipboardHandler);
            document.removeEventListener('paste', this._quizClipboardHandler);
            document.removeEventListener('keydown', this._quizKeydownHandler);
            document.removeEventListener('contextmenu', this._quizContextMenuHandler);

            this._quizVisibilityHandler = null;
            this._quizBlurHandler = null;
            this._quizClipboardHandler = null;
            this._quizKeydownHandler = null;
            this._quizContextMenuHandler = null;
        }
    },

    recordQuizIncident(message) {
        if (!this.quizState.isMonitoring || this.quizState.isClosedForCopying) return;

        const now = Date.now();
        if (now - this.quizState.lastIncidentAt < 1000) return;

        this.quizState.lastIncidentAt = now;

        if (this.quizState.cheatWarnings === 0) {
            this.quizState.cheatWarnings++;
            this.showQuizWarningOnly(message);
        } else {
            this.showQuizCopyingWarning(message);
            this.clearQuizCloseTimer();
            this._quizCloseTimer = setTimeout(() => {
                this.closeQuizForCopying(message);
            }, 1200);
        }
    },

    clearQuizCloseTimer() {
        if (!this._quizCloseTimer) return;

        clearTimeout(this._quizCloseTimer);
        this._quizCloseTimer = null;
    },

    showQuizWarningOnly(message) {
        const warningBanner = document.getElementById('quiz-warning-banner');
        const warningText = document.getElementById('quiz-warning-text');

        if (warningBanner) {
            warningBanner.classList.add('detected');
        }

        if (warningText) {
            warningText.textContent = `Warning: ${message}. Next time the test will close.`;
        }

        // Auto-hide the warning after 5 seconds
        setTimeout(() => {
            if (this.quizState.cheatWarnings === 1 && !this.quizState.isClosedForCopying) {
                if (warningBanner) warningBanner.classList.remove('detected');
                if (warningText) warningText.textContent = 'Answer-copying behavior during the quiz is prohibited. Opening another tab, switching windows, or using copy/paste will close the test immediately and mark it as copied.';
            }
        }, 5000);
    },

    showQuizCopyingWarning(message) {
        const warningBanner = document.getElementById('quiz-warning-banner');
        const warningText = document.getElementById('quiz-warning-text');
        const nextBtn = document.getElementById('btn-quiz-next');
        const options = document.querySelectorAll('.quiz-option');

        if (warningBanner) {
            warningBanner.classList.add('detected');
        }

        if (warningText) {
            warningText.textContent = `Warning: copying behavior was detected. ${message} The test will close now.`;
        }

        options.forEach(option => {
            option.classList.add('disabled');
            option.style.pointerEvents = 'none';
        });

        if (nextBtn) {
            nextBtn.disabled = true;
        }
    },

    resetQuizUI() {
        this.clearQuizCloseTimer();

        const warningBanner = document.getElementById('quiz-warning-banner');
        const warningText = document.getElementById('quiz-warning-text');
        const container = document.getElementById('quiz-container');
        const controls = document.getElementById('quiz-controls');
        const closedMessage = document.getElementById('quiz-closed-message');
        const closedTitle = document.getElementById('quiz-closed-title');
        const closedText = document.getElementById('quiz-closed-text');
        const nextBtn = document.getElementById('btn-quiz-next');

        if (warningBanner) {
            warningBanner.classList.remove('detected');
        }

        if (warningText) {
            warningText.textContent = 'Answer-copying behavior during the quiz is prohibited. Opening another tab, switching windows, or using copy/paste will close the test immediately and mark it as copied.';
        }

        if (container) {
            container.style.display = 'block';
        }

        if (controls) {
            controls.style.display = 'flex';
        }

        if (closedMessage) {
            closedMessage.style.display = 'none';
        }

        if (closedTitle) {
            closedTitle.textContent = 'Test Closed';
        }

        if (closedText) {
            closedText.textContent = 'Copied behavior detected. This attempt has been marked as copied.';
        }

        if (nextBtn) {
            nextBtn.disabled = true;
        }
    },

    closeQuizForCopying(reason) {
        this.clearQuizCloseTimer();
        this.quizState.isClosedForCopying = true;
        this.stopQuizMonitoring();

        // Clear warning UI just in case
        const warningBanner = document.getElementById('quiz-warning-banner');
        if (warningBanner) warningBanner.classList.remove('detected');

        UI.showToast(`⚠️ Copied behavior detected: ${reason}. Your test has been closed.`, 'error', 7000);
        this.navigate('skill-profile');
    },

    toggleStep(stepId, isChecked) {
        state.toggleRoadmapStep(stepId, isChecked);
        // We re-render roadmap to update completion states if we had cross dependencies, 
        // but here we just leave the checkbox state naturally and update dashboard later.
    }
};

// Initialize App on DOM load
document.addEventListener('DOMContentLoaded', () => {
    app.init();

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const overlay = document.getElementById('auth-modal-overlay');
            if (overlay && overlay.classList.contains('active')) {
                app.closeAuthModal(null);
            }
        }
    });
});

