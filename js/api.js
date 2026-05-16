// =============================================
// LOCAL DATA (roles, roadmaps, quiz tests)
// =============================================
const db = {
    roles: [
        { id: 'frontend', title: 'Frontend Developer', icon: 'bx-layout', skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'Responsive Design', 'Web Performance'] },
        { id: 'backend', title: 'Backend Developer', icon: 'bx-server', skills: ['Node.js', 'Express', 'SQL', 'MongoDB', 'REST APIs', 'Authentication', 'Docker'] },
        { id: 'data_analyst', title: 'Data Analyst', icon: 'bx-bar-chart-alt-2', skills: ['Python', 'Pandas', 'SQL', 'Tableau', 'Statistics', 'Excel', 'Data Cleaning'] },
        { id: 'ai_engineer', title: 'AI Engineer', icon: 'bx-brain', skills: ['Python', 'TensorFlow', 'PyTorch', 'Linear Algebra', 'Machine Learning', 'NLP', 'Git'] },
        { id: 'mobile', title: 'Mobile App Developer', icon: 'bx-mobile', skills: ['Dart', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'Mobile UI/UX', 'App Store Deployment'] }
    ],
    roadmaps: {
        'React': [
            { id: 'r1', title: 'Understand Components and Props', estimatedTime: 'Week 1', resources: [{ title: 'React Docs: Your First Component', url: 'https://react.dev/learn/your-first-component' }, { title: 'React Docs: Passing Props', url: 'https://react.dev/learn/passing-props-to-a-component' }] },
            { id: 'r2', title: 'Master useState and useEffect', estimatedTime: 'Week 2', resources: [{ title: 'React Docs: useState', url: 'https://react.dev/reference/react/useState' }, { title: 'React Docs: useEffect', url: 'https://react.dev/reference/react/useEffect' }] },
            { id: 'r3', title: 'Build a Todo App Project', estimatedTime: 'Week 3', resources: [{ title: 'React Tutorial: Tic-Tac-Toe', url: 'https://react.dev/learn/tutorial-tic-tac-toe' }, { title: 'Scrimba React Course (Free)', url: 'https://scrimba.com/learn/learnreact' }] }
        ],
        'JavaScript': [
            { id: 'js1', title: 'Variables, Data Types, and Functions', estimatedTime: 'Week 1', resources: [{ title: 'MDN: JavaScript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide' }, { title: 'javascript.info — The Modern JS Tutorial', url: 'https://javascript.info' }] },
            { id: 'js2', title: 'DOM Manipulation', estimatedTime: 'Week 2', resources: [{ title: 'MDN: DOM Introduction', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction' }, { title: 'JavaScript30 — 30 Day Challenge', url: 'https://javascript30.com' }] },
            { id: 'js3', title: 'Async JS, Promises, and Fetch', estimatedTime: 'Week 3', resources: [{ title: 'MDN: Asynchronous JavaScript', url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous' }, { title: 'Video: Event Loop Explained', url: 'https://www.youtube.com/watch?v=8aGhZQkoFbQ' }] }
        ],
        'Node.js': [
            { id: 'n1', title: 'Node Basics and Module System', estimatedTime: 'Week 1', resources: [{ title: 'Node.js Official Docs', url: 'https://nodejs.org/docs/latest/api/' }, { title: 'Node.js Beginner Guide', url: 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs' }] },
            { id: 'n2', title: 'Building an HTTP Server', estimatedTime: 'Week 2', resources: [{ title: 'Node.js HTTP Transaction Guide', url: 'https://nodejs.org/en/learn/modules/anatomy-of-an-http-transaction' }, { title: 'The Odin Project: Node.js', url: 'https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs' }] },
            { id: 'n3', title: 'Introduction to Express.js', estimatedTime: 'Week 3', resources: [{ title: 'Express.js Getting Started', url: 'https://expressjs.com/en/starter/installing.html' }, { title: 'freeCodeCamp: Node & Express', url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/' }] }
        ],
        'Python': [
            { id: 'py1', title: 'Syntax, Loops, and Conditionals', estimatedTime: 'Week 1', resources: [{ title: 'Python Official Tutorial', url: 'https://docs.python.org/3/tutorial/' }, { title: 'freeCodeCamp: Python for Beginners', url: 'https://www.youtube.com/watch?v=rfscVS0vtbw' }] },
            { id: 'py2', title: 'Lists, Dictionaries, and Sets', estimatedTime: 'Week 2', resources: [{ title: 'Python Docs: Data Structures', url: 'https://docs.python.org/3/tutorial/datastructures.html' }, { title: 'Real Python: Data Structures', url: 'https://realpython.com/python-data-structures/' }] },
            { id: 'py3', title: 'Functions and OOP Basics', estimatedTime: 'Week 3', resources: [{ title: 'Real Python: OOP in Python', url: 'https://realpython.com/python3-object-oriented-programming/' }, { title: 'Python Docs: Classes', url: 'https://docs.python.org/3/tutorial/classes.html' }] }
        ],
        'HTML': [
            { id: 'h1', title: 'HTML Document Structure & Semantics', estimatedTime: 'Week 1', resources: [{ title: 'MDN: HTML Basics', url: 'https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics' }, { title: 'HTML Reference', url: 'https://htmlreference.io' }] },
            { id: 'h2', title: 'Forms, Tables, and Media', estimatedTime: 'Week 2', resources: [{ title: 'MDN: HTML Forms', url: 'https://developer.mozilla.org/en-US/docs/Learn/Forms' }, { title: 'freeCodeCamp: Responsive Web Design', url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/' }] },
            { id: 'h3', title: 'Accessibility and SEO Basics', estimatedTime: 'Week 3', resources: [{ title: 'MDN: Accessibility', url: 'https://developer.mozilla.org/en-US/docs/Learn/Accessibility' }, { title: 'web.dev: Learn HTML', url: 'https://web.dev/learn/html' }] }
        ],
        'CSS': [
            { id: 'c1', title: 'Selectors, Box Model, and Flexbox', estimatedTime: 'Week 1', resources: [{ title: 'MDN: CSS Basics', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps' }, { title: 'Flexbox Froggy (Game)', url: 'https://flexboxfroggy.com' }] },
            { id: 'c2', title: 'CSS Grid Layout', estimatedTime: 'Week 2', resources: [{ title: 'CSS Tricks: Complete Guide to Grid', url: 'https://css-tricks.com/snippets/css/complete-guide-grid/' }, { title: 'Grid Garden (Game)', url: 'https://cssgridgarden.com' }] },
            { id: 'c3', title: 'Animations, Variables, and Responsive Design', estimatedTime: 'Week 3', resources: [{ title: 'MDN: CSS Animations', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations' }, { title: 'web.dev: Learn CSS', url: 'https://web.dev/learn/css' }] }
        ],
        'Git': [
            { id: 'g1', title: 'Git Basics: init, add, commit', estimatedTime: 'Week 1', resources: [{ title: 'Git Official Docs', url: 'https://git-scm.com/doc' }, { title: 'GitHub Skills (Interactive)', url: 'https://skills.github.com' }] },
            { id: 'g2', title: 'Branching, Merging, and Pull Requests', estimatedTime: 'Week 2', resources: [{ title: 'Atlassian: Git Branching', url: 'https://www.atlassian.com/git/tutorials/using-branches' }, { title: 'Learn Git Branching (Visual)', url: 'https://learngitbranching.js.org' }] },
            { id: 'g3', title: 'Collaboration: Forks, Remotes, and Conflicts', estimatedTime: 'Week 3', resources: [{ title: 'The Odin Project: Git', url: 'https://www.theodinproject.com/lessons/foundations-git-basics' }, { title: 'Pro Git Book (Free)', url: 'https://git-scm.com/book/en/v2' }] }
        ],
        'SQL': [
            { id: 'sq1', title: 'SELECT, WHERE, and Basic Queries', estimatedTime: 'Week 1', resources: [{ title: 'SQLBolt (Interactive Lessons)', url: 'https://sqlbolt.com' }, { title: 'Mode: SQL Tutorial', url: 'https://mode.com/sql-tutorial/' }] },
            { id: 'sq2', title: 'JOINs, GROUP BY, and Aggregations', estimatedTime: 'Week 2', resources: [{ title: 'SQLZoo (Interactive)', url: 'https://sqlzoo.net' }, { title: 'freeCodeCamp: SQL Tutorial', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY' }] },
            { id: 'sq3', title: 'Indexes, Transactions, and Schema Design', estimatedTime: 'Week 3', resources: [{ title: 'PostgreSQL Docs: Tutorial', url: 'https://www.postgresql.org/docs/current/tutorial.html' }, { title: 'Use The Index, Luke!', url: 'https://use-the-index-luke.com' }] }
        ],
        'MongoDB': [
            { id: 'mo1', title: 'Documents, Collections, and CRUD', estimatedTime: 'Week 1', resources: [{ title: 'MongoDB Official Tutorial', url: 'https://www.mongodb.com/docs/manual/tutorial/getting-started/' }, { title: 'MongoDB University (Free)', url: 'https://learn.mongodb.com' }] },
            { id: 'mo2', title: 'Queries, Indexes, and Aggregation', estimatedTime: 'Week 2', resources: [{ title: 'MongoDB Aggregation Docs', url: 'https://www.mongodb.com/docs/manual/aggregation/' }, { title: 'freeCodeCamp: MongoDB Course', url: 'https://www.youtube.com/watch?v=ofme2o29ngU' }] },
            { id: 'mo3', title: 'Mongoose ODM with Node.js', estimatedTime: 'Week 3', resources: [{ title: 'Mongoose Docs', url: 'https://mongoosejs.com/docs/guide.html' }, { title: 'The Odin Project: MongoDB', url: 'https://www.theodinproject.com/lessons/nodejs-mongodb-and-mongoose' }] }
        ],
        'Docker': [
            { id: 'd1', title: 'Containers, Images, and Docker CLI', estimatedTime: 'Week 1', resources: [{ title: 'Docker Official Get Started', url: 'https://docs.docker.com/get-started/' }, { title: 'Play with Docker (Browser Lab)', url: 'https://labs.play-with-docker.com' }] },
            { id: 'd2', title: 'Dockerfile and Building Images', estimatedTime: 'Week 2', resources: [{ title: 'Docker Docs: Dockerfile Reference', url: 'https://docs.docker.com/reference/dockerfile/' }, { title: 'freeCodeCamp: Docker for Beginners', url: 'https://www.youtube.com/watch?v=fqMOX6JJhGo' }] },
            { id: 'd3', title: 'Docker Compose and Multi-Container Apps', estimatedTime: 'Week 3', resources: [{ title: 'Docker Compose Docs', url: 'https://docs.docker.com/compose/' }, { title: 'TechWorld: Docker Crash Course', url: 'https://www.youtube.com/watch?v=3c-iBn73dDE' }] }
        ],
        'Pandas': [
            { id: 'pd1', title: 'DataFrames, Series, and Basic Operations', estimatedTime: 'Week 1', resources: [{ title: 'Pandas Official Getting Started', url: 'https://pandas.pydata.org/docs/getting_started/intro_tutorials/' }, { title: 'Kaggle: Pandas Course (Free)', url: 'https://www.kaggle.com/learn/pandas' }] },
            { id: 'pd2', title: 'Filtering, Grouping, and Merging', estimatedTime: 'Week 2', resources: [{ title: 'Pandas Docs: GroupBy', url: 'https://pandas.pydata.org/docs/user_guide/groupby.html' }, { title: 'Real Python: Pandas GroupBy', url: 'https://realpython.com/pandas-groupby/' }] },
            { id: 'pd3', title: 'Data Cleaning and Handling Missing Values', estimatedTime: 'Week 3', resources: [{ title: 'Pandas Docs: Working with missing data', url: 'https://pandas.pydata.org/docs/user_guide/missing_data.html' }, { title: 'Kaggle: Data Cleaning Course', url: 'https://www.kaggle.com/learn/data-cleaning' }] }
        ],
        'TensorFlow': [
            { id: 'tf1', title: 'Tensors, Variables, and Eager Execution', estimatedTime: 'Week 1', resources: [{ title: 'TensorFlow Quickstart for Beginners', url: 'https://www.tensorflow.org/tutorials/quickstart/beginner' }, { title: 'freeCodeCamp: TensorFlow 2.0 Course', url: 'https://www.youtube.com/watch?v=tPYj3fFJGjk' }] },
            { id: 'tf2', title: 'Building and Training Neural Networks', estimatedTime: 'Week 2', resources: [{ title: 'TensorFlow Keras Guide', url: 'https://www.tensorflow.org/guide/keras' }, { title: 'Deep Learning with TensorFlow (Coursera)', url: 'https://www.coursera.org/professional-certificates/tensorflow-in-practice' }] },
            { id: 'tf3', title: 'CNN, RNN, and Model Deployment', estimatedTime: 'Week 3', resources: [{ title: 'TensorFlow Tutorials', url: 'https://www.tensorflow.org/tutorials' }, { title: 'MIT: Deep Learning Intro', url: 'http://introtodeeplearning.com' }] }
        ],
        'Flutter': [
            { id: 'fl1', title: 'Widgets, Layouts, and Dart Basics', estimatedTime: 'Week 1', resources: [{ title: 'Flutter Official Docs: Get Started', url: 'https://docs.flutter.dev/get-started/install' }, { title: 'Flutter Codelabs', url: 'https://docs.flutter.dev/codelabs' }] },
            { id: 'fl2', title: 'State Management and Navigation', estimatedTime: 'Week 2', resources: [{ title: 'Flutter Docs: State Management', url: 'https://docs.flutter.dev/data-and-backend/state-mgmt/intro' }, { title: 'Flutter: Navigation & Routing', url: 'https://docs.flutter.dev/ui/navigation' }] },
            { id: 'fl3', title: 'API Integration and Firebase', estimatedTime: 'Week 3', resources: [{ title: 'FlutterFire (Firebase + Flutter)', url: 'https://firebase.flutter.dev/docs/overview/' }, { title: 'freeCodeCamp: Flutter Course', url: 'https://www.youtube.com/watch?v=VPvVD8t02U8' }] }
        ],
        'Firebase': [
            { id: 'fb1', title: 'Firestore Database and Auth', estimatedTime: 'Week 1', resources: [{ title: 'Firebase Docs: Get Started', url: 'https://firebase.google.com/docs/guides' }, { title: 'Firebase Codelab: Web', url: 'https://firebase.google.com/codelabs/firebase-web' }] },
            { id: 'fb2', title: 'Cloud Functions and Storage', estimatedTime: 'Week 2', resources: [{ title: 'Firebase Cloud Functions', url: 'https://firebase.google.com/docs/functions/get-started' }, { title: 'freeCodeCamp: Firebase Course', url: 'https://www.youtube.com/watch?v=9kRgVxULbag' }] },
            { id: 'fb3', title: 'Firebase Hosting and Deployment', estimatedTime: 'Week 3', resources: [{ title: 'Firebase Hosting Docs', url: 'https://firebase.google.com/docs/hosting/quickstart' }, { title: 'Firebase YouTube Channel', url: 'https://www.youtube.com/@Firebase' }] }
        ]
    },

    getGenericRoadmap: (skillName) => [
        { id: `g1-${skillName}`, title: `Introduction to ${skillName}`, estimatedTime: 'Week 1', resources: [{ title: `Official Documentation`, url: `https://www.google.com/search?q=${encodeURIComponent(skillName + ' official documentation')}` }, { title: `YouTube: ${skillName} Crash Course`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skillName + ' crash course')}` }] },
        { id: `g2-${skillName}`, title: `Core Concepts & Best Practices`, estimatedTime: 'Week 2', resources: [{ title: `freeCodeCamp: Learn ${skillName}`, url: `https://www.freecodecamp.org/news/search/?query=${encodeURIComponent(skillName)}` }] },
        { id: `g3-${skillName}`, title: `Build a Mini-Project`, estimatedTime: 'Week 3', resources: [{ title: `Project Ideas on GitHub`, url: `https://github.com/search?q=${encodeURIComponent(skillName + ' beginner project')}&type=repositories` }] }
    ],

    quizTests: [
        { id: 'technical', title: 'Technical Skills Assessment', description: 'A tailored technical test based on your skills.', totalQuestions: 5 },
        { id: 'aptitude', title: 'General Aptitude Test', description: 'Logical reasoning, problem solving, and numeric judgment.', totalQuestions: 5 }
    ]
};

// =============================================
// API — All backend communication
// =============================================
const api = {

    // --- AUTH (Supabase) ---
    async signup(name, email, password, role = 'student') {
        try {
            const { data, error } = await window.sbClient.auth.signUp({
                email,
                password,
                options: { data: { name, role } }
            });
            if (error) throw error;

            const user = data.user;
            // data.session is non-null when email confirmation is OFF (user logged in immediately)
            // data.session is null when email confirmation is ON (user must verify email)
            const isAutoConfirmed = data.session !== null;

            if (isAutoConfirmed) {
                // Insert profile row
                const { error: profileError } = await window.sbClient.from('profiles').insert({
                    id: user.id,
                    name: name.trim(),
                    role
                });
                if (profileError && profileError.code !== '23505') throw profileError;

                return {
                    success: true,
                    user: { id: user.id, name: name.trim(), email, role, profileData: {} }
                };
            } else {
                // Email confirmation is ON — user must click link in email first
                return {
                    success: true,
                    needsConfirmation: true,
                    message: 'Account created! Please check your email to confirm your account, then log in.'
                };
            }
        } catch (error) {
            console.error('Signup error:', error);
            return { success: false, error: error.message || 'Unable to create account.' };
        }
    },

    async login(email, password) {
        try {
            const { data, error } = await window.sbClient.auth.signInWithPassword({ email, password });
            if (error) throw error;

            // Fetch profile
            let { data: profile } = await window.sbClient
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();

            // Create profile if it doesn't exist (first login after email confirmation)
            if (!profile) {
                const meta = data.user.user_metadata || {};
                const { data: newProfile } = await window.sbClient.from('profiles').insert({
                    id: data.user.id,
                    name: meta.name || 'User',
                    role: meta.role || 'student'
                }).select().single();
                profile = newProfile;
            }

            return {
                success: true,
                user: {
                    id: data.user.id,
                    name: profile?.name || data.user.user_metadata?.name || 'User',
                    email: data.user.email,
                    role: profile?.role || 'student',
                    profileData: profile?.profile_data || {}
                }
            };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message || 'Invalid email or password.' };
        }
    },

    async logout() {
        await window.sbClient.auth.signOut();
    },

    async getSession() {
        const { data: { session } } = await window.sbClient.auth.getSession();
        if (!session) return null;

        const { data: profile } = await window.sbClient
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

        return {
            id: session.user.id,
            name: profile?.name || session.user.user_metadata?.name || 'User',
            email: session.user.email,
            role: profile?.role || 'student',
            profileData: profile?.profile_data || {}
        };
    },

    // --- PROFILE ---
    async saveProfile(userId, profileData) {
        try {
            const { error } = await window.sbClient
                .from('profiles')
                .update({ profile_data: profileData })
                .eq('id', userId);
            return !error;
        } catch (error) {
            console.error('Error saving profile:', error);
            return false;
        }
    },

    // --- EDUCATOR ---
    async getStudentRoster() {
        try {
            const { data, error } = await window.sbClient
                .from('profiles')
                .select('*')
                .eq('role', 'student')
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching student roster:', error);
            return [];
        }
    },

    // --- ROLES ---
    async getRoles() {
        return db.roles;
    },

    async getQuizTests() {
        return db.quizTests;
    },

    // --- AI ENDPOINTS (Node.js server) ---
    async analyzeResume(file) {
        try {
            const formData = new FormData();
            formData.append('resume', file);
            const response = await fetch('http://localhost:3000/api/analyze-resume', { method: 'POST', body: formData });
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Error analyzing resume:', error);
            return { success: false, error: 'Failed to analyze resume.' };
        }
    },

    async analyzeGap(roleId, currentSkills) {
        try {
            const response = await fetch('http://localhost:3000/api/analyze-gap', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ roleId, currentSkills })
            });
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Error analyzing gap:', error);
            return null;
        }
    },

    async getQuiz(testId) {
        try {
            const role = state ? state.getGoalRole() : null;
            const currentSkills = state ? Array.from(state.existingSkills) : [];
            const roleId = role ? role.id : 'general';
            const response = await fetch('http://localhost:3000/api/generate-quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ testId, roleId, currentSkills })
            });
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Error generating quiz:', error);
            return { error: 'Failed to generate a custom quiz using AI.' };
        }
    },

    async submitQuiz(sessionId, answers) {
        try {
            const response = await fetch('http://localhost:3000/api/submit-quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId, answers })
            });
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Error submitting quiz:', error);
            return { success: false, error: 'Could not submit answers' };
        }
    },

    async generateRoadmap(missingSkills) {
        try {
            const response = await fetch('http://localhost:3000/api/generate-roadmap', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ missingSkills })
            });
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            // Fallback to local DB with real links
            return missingSkills.map(skill => {
                const steps = db.roadmaps[skill] || db.getGenericRoadmap(skill);
                return { skillName: skill, steps };
            });
        }
    }
};
