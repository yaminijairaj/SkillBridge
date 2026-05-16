require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const Groq = require('groq-sdk');

const app = express();
const port = 3000;
const dbSqlite = require('./db'); // SQLite database

// Initialize Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'MISSING_KEY' });
const GROQ_MODEL = 'llama-3.3-70b-versatile';

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
app.use(express.static(path.join(__dirname, '..')));

// Setup Multer for file uploads (in-memory for this simple implementation)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

function normalizeEmail(email) {
    return String(email || '').trim().toLowerCase();
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
    const passwordHash = crypto.scryptSync(password, salt, 64).toString('hex');
    return { salt, passwordHash };
}

function verifyPassword(password, user) {
    const derivedKey = crypto.scryptSync(password, user.salt, 64);
    const storedKey = Buffer.from(user.passwordHash, 'hex');

    return storedKey.length === derivedKey.length && crypto.timingSafeEqual(storedKey, derivedKey);
}

function sanitizeUser(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email
    };
}

function buildUserRecord({ name, email, password }) {
    const { salt, passwordHash } = hashPassword(password);

    return {
        id: crypto.randomUUID(),
        name: String(name || '').trim(),
        email: normalizeEmail(email),
        passwordHash,
        salt,
        createdAt: new Date().toISOString()
    };
}

// SQLite handles storage now; readUsers and writeUsers removed.

// --- Mock Database (Moved from frontend js/data.js) ---
const db = {
    roles: [
        {
            id: 'frontend',
            title: 'Frontend Developer',
            icon: 'bx-layout',
            skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'Responsive Design', 'Web Performance']
        },
        {
            id: 'backend',
            title: 'Backend Developer',
            icon: 'bx-server',
            skills: ['Node.js', 'Express', 'SQL', 'MongoDB', 'REST APIs', 'Authentication', 'Docker']
        },
        {
            id: 'data_analyst',
            title: 'Data Analyst',
            icon: 'bx-bar-chart-alt-2',
            skills: ['Python', 'Pandas', 'SQL', 'Tableau', 'Statistics', 'Excel', 'Data Cleaning']
        },
        {
            id: 'ai_engineer',
            title: 'AI Engineer',
            icon: 'bx-brain',
            skills: ['Python', 'TensorFlow', 'PyTorch', 'Linear Algebra', 'Machine Learning', 'NLP', 'Git']
        },
        {
            id: 'mobile',
            title: 'Mobile App Developer',
            icon: 'bx-mobile',
            skills: ['Dart', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'Mobile UI/UX', 'App Store Deployment']
        }
    ],

    roadmaps: {
        'React': [
            { id: 'r1', title: 'Understand Components and Props', estimatedTime: 'Week 1', resources: [{ title: 'React Docs: Your First Component', url: 'https://react.dev/learn/your-first-component' }, { title: 'React Docs: Passing Props', url: 'https://react.dev/learn/passing-props-to-a-component' }] },
            { id: 'r2', title: 'Master useState and useEffect', estimatedTime: 'Week 2', resources: [{ title: 'React Docs: useState', url: 'https://react.dev/reference/react/useState' }, { title: 'React Docs: useEffect', url: 'https://react.dev/reference/react/useEffect' }] },
            { id: 'r3', title: 'Build a Todo App Project', estimatedTime: 'Week 3', resources: [{ title: 'React Tutorial: Tic-Tac-Toe', url: 'https://react.dev/learn/tutorial-tic-tac-toe' }, { title: 'Scrimba React Course (Free)', url: 'https://scrimba.com/learn/learnreact' }] }
        ],
        'JavaScript': [
            { id: 'js1', title: 'Variables, Data Types, and Functions', estimatedTime: 'Week 1', resources: [{ title: 'MDN: JavaScript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide' }, { title: 'javascript.info', url: 'https://javascript.info' }] },
            { id: 'js2', title: 'DOM Manipulation', estimatedTime: 'Week 2', resources: [{ title: 'MDN: DOM Introduction', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction' }, { title: 'JavaScript30 Challenge', url: 'https://javascript30.com' }] },
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
            { id: 'py3', title: 'Functions and OOP Basics', estimatedTime: 'Week 3', resources: [{ title: 'Real Python: OOP in Python 3', url: 'https://realpython.com/python3-object-oriented-programming/' }, { title: 'Python Docs: Classes', url: 'https://docs.python.org/3/tutorial/classes.html' }] }
        ],
        'HTML': [
            { id: 'h1', title: 'HTML Structure and Semantic Elements', estimatedTime: 'Week 1', resources: [{ title: 'MDN: HTML Basics', url: 'https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics' }, { title: 'web.dev: Learn HTML', url: 'https://web.dev/learn/html' }] },
            { id: 'h2', title: 'Forms, Tables, and Media', estimatedTime: 'Week 2', resources: [{ title: 'MDN: HTML Forms Guide', url: 'https://developer.mozilla.org/en-US/docs/Learn/Forms' }, { title: 'freeCodeCamp: Responsive Web Design', url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/' }] },
            { id: 'h3', title: 'Accessibility and SEO Basics', estimatedTime: 'Week 3', resources: [{ title: 'MDN: Accessibility', url: 'https://developer.mozilla.org/en-US/docs/Learn/Accessibility' }, { title: 'HTMLReference.io', url: 'https://htmlreference.io' }] }
        ],
        'CSS': [
            { id: 'c1', title: 'Selectors, Box Model, and Flexbox', estimatedTime: 'Week 1', resources: [{ title: 'MDN: CSS First Steps', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps' }, { title: 'Flexbox Froggy (Game)', url: 'https://flexboxfroggy.com' }] },
            { id: 'c2', title: 'CSS Grid Layout', estimatedTime: 'Week 2', resources: [{ title: 'CSS-Tricks: Complete Guide to Grid', url: 'https://css-tricks.com/snippets/css/complete-guide-grid/' }, { title: 'Grid Garden (Game)', url: 'https://cssgridgarden.com' }] },
            { id: 'c3', title: 'Animations, Variables, and Responsive Design', estimatedTime: 'Week 3', resources: [{ title: 'MDN: CSS Animations', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations' }, { title: 'web.dev: Learn CSS', url: 'https://web.dev/learn/css' }] }
        ],
        'Git': [
            { id: 'g1', title: 'Git Basics: init, add, commit', estimatedTime: 'Week 1', resources: [{ title: 'Git Official Docs', url: 'https://git-scm.com/doc' }, { title: 'GitHub Skills (Interactive)', url: 'https://skills.github.com' }] },
            { id: 'g2', title: 'Branching, Merging, and Pull Requests', estimatedTime: 'Week 2', resources: [{ title: 'Learn Git Branching (Visual)', url: 'https://learngitbranching.js.org' }, { title: 'Atlassian: Git Branching', url: 'https://www.atlassian.com/git/tutorials/using-branches' }] },
            { id: 'g3', title: 'Collaboration: Forks, Remotes, and Conflicts', estimatedTime: 'Week 3', resources: [{ title: 'Pro Git Book (Free)', url: 'https://git-scm.com/book/en/v2' }, { title: 'The Odin Project: Git', url: 'https://www.theodinproject.com/lessons/foundations-git-basics' }] }
        ],
        'SQL': [
            { id: 'sq1', title: 'SELECT, WHERE, and Basic Queries', estimatedTime: 'Week 1', resources: [{ title: 'SQLBolt (Interactive)', url: 'https://sqlbolt.com' }, { title: 'Mode: SQL Tutorial', url: 'https://mode.com/sql-tutorial/' }] },
            { id: 'sq2', title: 'JOINs, GROUP BY, and Aggregations', estimatedTime: 'Week 2', resources: [{ title: 'SQLZoo (Interactive)', url: 'https://sqlzoo.net' }, { title: 'freeCodeCamp: SQL Full Course', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY' }] },
            { id: 'sq3', title: 'Indexes, Transactions, and Schema Design', estimatedTime: 'Week 3', resources: [{ title: 'PostgreSQL Docs: Tutorial', url: 'https://www.postgresql.org/docs/current/tutorial.html' }, { title: 'Use The Index, Luke!', url: 'https://use-the-index-luke.com' }] }
        ],
        'MongoDB': [
            { id: 'mo1', title: 'Documents, Collections, and CRUD', estimatedTime: 'Week 1', resources: [{ title: 'MongoDB Official Tutorial', url: 'https://www.mongodb.com/docs/manual/tutorial/getting-started/' }, { title: 'MongoDB University (Free)', url: 'https://learn.mongodb.com' }] },
            { id: 'mo2', title: 'Queries, Indexes, and Aggregation', estimatedTime: 'Week 2', resources: [{ title: 'MongoDB Aggregation Docs', url: 'https://www.mongodb.com/docs/manual/aggregation/' }, { title: 'freeCodeCamp: MongoDB Course', url: 'https://www.youtube.com/watch?v=ofme2o29ngU' }] },
            { id: 'mo3', title: 'Mongoose ODM with Node.js', estimatedTime: 'Week 3', resources: [{ title: 'Mongoose Getting Started', url: 'https://mongoosejs.com/docs/guide.html' }, { title: 'The Odin Project: MongoDB & Mongoose', url: 'https://www.theodinproject.com/lessons/nodejs-mongodb-and-mongoose' }] }
        ],
        'Docker': [
            { id: 'd1', title: 'Containers, Images, and the Docker CLI', estimatedTime: 'Week 1', resources: [{ title: 'Docker Official Get Started', url: 'https://docs.docker.com/get-started/' }, { title: 'Play with Docker (Free Browser Lab)', url: 'https://labs.play-with-docker.com' }] },
            { id: 'd2', title: 'Writing Dockerfiles and Building Images', estimatedTime: 'Week 2', resources: [{ title: 'Docker Docs: Dockerfile Reference', url: 'https://docs.docker.com/reference/dockerfile/' }, { title: 'freeCodeCamp: Docker for Beginners', url: 'https://www.youtube.com/watch?v=fqMOX6JJhGo' }] },
            { id: 'd3', title: 'Docker Compose and Multi-Container Apps', estimatedTime: 'Week 3', resources: [{ title: 'Docker Compose Docs', url: 'https://docs.docker.com/compose/' }, { title: 'TechWorld: Docker Crash Course', url: 'https://www.youtube.com/watch?v=3c-iBn73dDE' }] }
        ],
        'Pandas': [
            { id: 'pd1', title: 'DataFrames, Series, and Basic Operations', estimatedTime: 'Week 1', resources: [{ title: 'Pandas: Getting Started Tutorials', url: 'https://pandas.pydata.org/docs/getting_started/intro_tutorials/' }, { title: 'Kaggle: Pandas Course (Free)', url: 'https://www.kaggle.com/learn/pandas' }] },
            { id: 'pd2', title: 'Filtering, GroupBy, and Merging', estimatedTime: 'Week 2', resources: [{ title: 'Pandas Docs: GroupBy', url: 'https://pandas.pydata.org/docs/user_guide/groupby.html' }, { title: 'Real Python: Pandas GroupBy', url: 'https://realpython.com/pandas-groupby/' }] },
            { id: 'pd3', title: 'Data Cleaning and Missing Values', estimatedTime: 'Week 3', resources: [{ title: 'Pandas Docs: Missing Data', url: 'https://pandas.pydata.org/docs/user_guide/missing_data.html' }, { title: 'Kaggle: Data Cleaning Course', url: 'https://www.kaggle.com/learn/data-cleaning' }] }
        ],
        'TensorFlow': [
            { id: 'tf1', title: 'Tensors, Variables, and Eager Execution', estimatedTime: 'Week 1', resources: [{ title: 'TensorFlow: Quickstart for Beginners', url: 'https://www.tensorflow.org/tutorials/quickstart/beginner' }, { title: 'freeCodeCamp: TensorFlow 2.0 Full Course', url: 'https://www.youtube.com/watch?v=tPYj3fFJGjk' }] },
            { id: 'tf2', title: 'Building and Training Neural Networks', estimatedTime: 'Week 2', resources: [{ title: 'TensorFlow Keras Guide', url: 'https://www.tensorflow.org/guide/keras' }, { title: 'MIT: Introduction to Deep Learning', url: 'http://introtodeeplearning.com' }] },
            { id: 'tf3', title: 'CNNs, RNNs, and Model Saving', estimatedTime: 'Week 3', resources: [{ title: 'TensorFlow Tutorials', url: 'https://www.tensorflow.org/tutorials' }, { title: 'Coursera: DeepLearning.AI TensorFlow', url: 'https://www.coursera.org/professional-certificates/tensorflow-in-practice' }] }
        ],
        'Flutter': [
            { id: 'fl1', title: 'Widgets, Layouts, and Dart Basics', estimatedTime: 'Week 1', resources: [{ title: 'Flutter Docs: Get Started', url: 'https://docs.flutter.dev/get-started/install' }, { title: 'Flutter Codelabs', url: 'https://docs.flutter.dev/codelabs' }] },
            { id: 'fl2', title: 'State Management and Navigation', estimatedTime: 'Week 2', resources: [{ title: 'Flutter Docs: State Management', url: 'https://docs.flutter.dev/data-and-backend/state-mgmt/intro' }, { title: 'Flutter Docs: Navigation & Routing', url: 'https://docs.flutter.dev/ui/navigation' }] },
            { id: 'fl3', title: 'API Integration and Firebase', estimatedTime: 'Week 3', resources: [{ title: 'FlutterFire: Firebase + Flutter', url: 'https://firebase.flutter.dev/docs/overview/' }, { title: 'freeCodeCamp: Flutter Course', url: 'https://www.youtube.com/watch?v=VPvVD8t02U8' }] }
        ],
        'Firebase': [
            { id: 'fb1', title: 'Firestore Database and Auth', estimatedTime: 'Week 1', resources: [{ title: 'Firebase Docs: Get Started', url: 'https://firebase.google.com/docs/guides' }, { title: 'Firebase Codelab: Web App', url: 'https://firebase.google.com/codelabs/firebase-web' }] },
            { id: 'fb2', title: 'Cloud Functions and Storage', estimatedTime: 'Week 2', resources: [{ title: 'Firebase Cloud Functions Docs', url: 'https://firebase.google.com/docs/functions/get-started' }, { title: 'freeCodeCamp: Firebase Tutorial', url: 'https://www.youtube.com/watch?v=9kRgVxULbag' }] },
            { id: 'fb3', title: 'Firebase Hosting and Deployment', estimatedTime: 'Week 3', resources: [{ title: 'Firebase Hosting Quickstart', url: 'https://firebase.google.com/docs/hosting/quickstart' }, { title: 'Firebase YouTube Channel', url: 'https://www.youtube.com/@Firebase' }] }
        ]
    },

    getGenericRoadmap: (skillName) => [
        { id: `g1-${skillName}`, title: `Introduction to ${skillName}`, estimatedTime: 'Week 1', resources: [{ title: `Official ${skillName} Documentation`, url: `https://www.google.com/search?q=${encodeURIComponent(skillName + ' official documentation')}` }, { title: `YouTube: ${skillName} Crash Course`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skillName + ' crash course for beginners')}` }] },
        { id: `g2-${skillName}`, title: `Core Concepts & Best Practices`, estimatedTime: 'Week 2', resources: [{ title: `freeCodeCamp: Learn ${skillName}`, url: `https://www.freecodecamp.org/news/search/?query=${encodeURIComponent(skillName)}` }] },
        { id: `g3-${skillName}`, title: `Build a Mini-Project`, estimatedTime: 'Week 3', resources: [{ title: `GitHub: ${skillName} Beginner Projects`, url: `https://github.com/search?q=${encodeURIComponent(skillName + ' beginner project')}&type=repositories&s=stars` }] }
    ],

    quizTests: [
        {
            id: 'aptitude-core',
            title: 'Aptitude Test A',
            description: 'Logic, reasoning, and software fundamentals.',
            questions: [
                { id: 'q1', question: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?", options: [{ id: 'a', text: "120 metres" }, { id: 'b', text: "150 metres" }, { id: 'c', text: "180 metres" }, { id: 'd', text: "324 metres" }], correctId: 'b' },
                { id: 'q2', question: "In the context of programming, what does 'DRY' stand for?", options: [{ id: 'a', text: "Don't Repeat Yourself" }, { id: 'b', text: "Data Rendering Yield" }, { id: 'c', text: "Direct Routing Yet" }, { id: 'd', text: "Document Ready Yearly" }], correctId: 'a' },
                { id: 'q3', question: "If all Bloops are Razzies and all Razzies are Lazzies, then are all Bloops definitely Lazzies?", options: [{ id: 'a', text: "Yes" }, { id: 'b', text: "No" }, { id: 'c', text: "Maybe" }, { id: 'd', text: "Cannot be determined" }], correctId: 'a' },
                { id: 'q4', question: "Which of the following is typically a backend programming language?", options: [{ id: 'a', text: "HTML" }, { id: 'b', text: "CSS" }, { id: 'c', text: "Java" }, { id: 'd', text: "React" }], correctId: 'c' }
            ]
        },
        {
            id: 'aptitude-advanced',
            title: 'Aptitude Test B',
            description: 'Numerical reasoning, debugging judgment, and problem solving.',
            questions: [
                { id: 'q5', question: "A developer solves 18 bugs in 3 days at a constant rate. How many bugs will be solved in 5 days?", options: [{ id: 'a', text: "24" }, { id: 'b', text: "27" }, { id: 'c', text: "30" }, { id: 'd', text: "36" }], correctId: 'c' },
                { id: 'q6', question: "What is the main purpose of version control in software development?", options: [{ id: 'a', text: "To speed up internet access" }, { id: 'b', text: "To track code changes over time" }, { id: 'c', text: "To automatically design UI screens" }, { id: 'd', text: "To replace testing" }], correctId: 'b' },
                { id: 'q7', question: "If a function returns incorrect results only for negative numbers, which input should you test first?", options: [{ id: 'a', text: "0" }, { id: 'b', text: "A random positive number" }, { id: 'c', text: "-1" }, { id: 'd', text: "A string" }], correctId: 'c' },
                { id: 'q8', question: "A queue follows which order of processing?", options: [{ id: 'a', text: "Last in, first out" }, { id: 'b', text: "First in, first out" }, { id: 'c', text: "Highest value first" }, { id: 'd', text: "Random order" }], correctId: 'b' }
            ]
        }
    ]
};

// --- API Endpoints ---

// POST Auth Signup
app.post('/api/auth/signup', (req, res) => {
    try {
        const { name, email, password } = req.body || {};
        const normalizedEmail = normalizeEmail(email);
        const trimmedName = String(name || '').trim();
        const plainPassword = String(password || '');

        if (!trimmedName || !normalizedEmail || !plainPassword) {
            return res.status(400).json({ success: false, error: 'Name, email, and password are required.' });
        }

        if (!validateEmail(normalizedEmail)) {
            return res.status(400).json({ success: false, error: 'Enter a valid email address.' });
        }

        if (plainPassword.length < 6) {
            return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
        }

        const stmtCheck = dbSqlite.prepare('SELECT * FROM users WHERE email = ?');
        const existingUser = stmtCheck.get(normalizedEmail);

        if (existingUser) {
            return res.status(409).json({ success: false, error: 'This login is already created. Please log in instead.' });
        }

        const newUser = buildUserRecord({
            name: trimmedName,
            email: normalizedEmail,
            password: plainPassword
        });

        const stmtInsert = dbSqlite.prepare('INSERT INTO users (id, name, email, passwordHash, salt, createdAt) VALUES (?, ?, ?, ?, ?, ?)');
        stmtInsert.run(newUser.id, newUser.name, newUser.email, newUser.passwordHash, newUser.salt, newUser.createdAt);

        res.status(201).json({
            success: true,
            user: { ...sanitizeUser(newUser), profileData: {} }
        });
    } catch (error) {
        console.error('Signup failed:', error);
        res.status(500).json({ success: false, error: 'Unable to create account right now.' });
    }
});

// POST Auth Login
app.post('/api/auth/login', (req, res) => {
    try {
        const { email, password } = req.body || {};
        const normalizedEmail = normalizeEmail(email);
        const plainPassword = String(password || '');

        if (!normalizedEmail || !plainPassword) {
            return res.status(400).json({ success: false, error: 'Email and password are required.' });
        }

        console.log(req.body);
        const stmt = dbSqlite.prepare('SELECT * FROM users WHERE email = ?');
        const user = stmt.get(normalizedEmail);
        console.log(user);

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        const isValidPassword = verifyPassword(plainPassword, user);
        console.log("Password match:", isValidPassword);

        if (!isValidPassword) {
            return res.status(401).json({ success: false, error: "Wrong password" });
        }

        let parsedProfile = {};
        try {
            if (user.profileData) {
                parsedProfile = JSON.parse(user.profileData);
            }
        } catch(e) { console.error("Could not parse profileData:", e); }

        return res.json({ 
            success: true, 
            message: "Login success", 
            user: { ...sanitizeUser(user), profileData: parsedProfile }
        });
    } catch (error) {
        console.error('Login failed:', error);
        res.status(500).json({ success: false, error: 'Unable to log in right now.' });
    }
});

// POST /api/user/profile (Save profile data)
app.post('/api/user/profile', (req, res) => {
    try {
        const { userId, profileData } = req.body;
        if (!userId) {
            return res.status(400).json({ success: false, error: 'User ID is required' });
        }
        
        const dataStr = JSON.stringify(profileData || {});
        const stmt = dbSqlite.prepare('UPDATE users SET profileData = ? WHERE id = ?');
        const info = stmt.run(dataStr, userId);
        
        if (info.changes === 0) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving profile:', error);
        res.status(500).json({ success: false, error: 'Failed to save profile' });
    }
});

// GET Roles
app.get('/api/roles', (req, res) => {
    res.json(db.roles);
});

// POST Analyze Resume (Gemini API)
app.post('/api/analyze-resume', upload.single('resume'), async (req, res) => {
    try {
        console.log("Incoming file:", req.file);

        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No resume file uploaded' });
        }

        let resumeText = '';

        if (req.file.mimetype === 'application/pdf') {
            const pdfData = await pdf(req.file.buffer);
            resumeText = pdfData.text;
        } else if (
            req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            req.file.originalname.toLowerCase().endsWith('.docx')
        ) {
            const result = await mammoth.extractRawText({ buffer: req.file.buffer });
            resumeText = result.value;
        } else {
            // Plain text fallback
            resumeText = req.file.buffer.toString('utf8');
        }

        console.log("Extracted Resume Text preview:", resumeText.substring(0, 50));

        if (!resumeText || resumeText.trim().length === 0) {
            return res.status(400).json({ success: false, error: 'Could not extract text from file' });
        }

        const prompt = `You are an expert technical recruiter. Extract a comprehensive list of all professional technical skills, tools, languages, and frameworks from the following resume text.
Only return a strict JSON object with a "skills" key containing an array of strings. Do not include soft skills like "leadership" or "communication".

Resume text:
${resumeText}`;

        const response = await groq.chat.completions.create({
            model: GROQ_MODEL,
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
            temperature: 0.2
        });

        const parsed = JSON.parse(response.choices[0].message.content);
        const extractedSkills = parsed.skills || parsed.extractedSkills || Object.values(parsed)[0] || [];

        res.json({ success: true, extractedSkills });

    } catch (error) {
        console.error('Error analyzing resume with Groq:', error);
        res.status(500).json({ success: false, error: 'Failed to analyze resume' });
    }
});


// POST Analyze Gap (Calculate proficiency and gaps using Gemini)
app.post('/api/analyze-gap', async (req, res) => {
    try {
        const { roleId, currentSkills } = req.body;

        if (!roleId || !currentSkills || !Array.isArray(currentSkills)) {
            return res.status(400).json({ error: 'Missing roleId or currentSkills array' });
        }

        const role = db.roles.find(r => r.id === roleId);
        if (!role) {
            return res.status(404).json({ error: 'Role not found' });
        }

        const prompt = `You are an expert technical career advisor. A user wants to become a "${role.title}".
The core skills required for this role are: ${role.skills.join(', ')}.
The user's currently possessed skills are: ${currentSkills.join(', ')}.

Your task:
1. Identify which of the core required skills the user is missing.
2. Estimate the user's proficiency (beginner, intermediate, advanced) for the skills they DO possess.

Return EXACTLY a JSON object:
{
  "missingSkills": ["Skill A", "Skill B"],
  "skillProficiency": { "CurrentSkill1": "intermediate" }
}`;

        const response = await groq.chat.completions.create({
            model: GROQ_MODEL,
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
            temperature: 0.2
        });

        const analysisData = JSON.parse(response.choices[0].message.content);

        // Calculate match percentage
        const missingCount = analysisData.missingSkills ? analysisData.missingSkills.length : 0;
        const matchedCount = Math.max(0, role.skills.length - missingCount);
        const matchPercentage = Math.min(100, Math.round((matchedCount / role.skills.length) * 100));

        // Replace AI roadmap steps with curated real-URL versions
        const realRoadmap = (analysisData.missingSkills || []).map(skillName => {
            const steps = db.roadmaps[skillName] || db.getGenericRoadmap(skillName);
            return { skillName, steps };
        });

        res.json({
            missingSkills: analysisData.missingSkills || [],
            skillProficiency: analysisData.skillProficiency || {},
            roadmap: realRoadmap,
            matchPercentage,
            roleTitle: role.title,
            totalRequiredSkills: role.skills.length
        });

    } catch (error) {
        console.error('Error analyzing gap with Groq:', error);
        res.status(500).json({ error: 'Failed to analyze skill gap.' });
    }
});


const quizSessions = {}; // Store generated quizzes to score them later.

// POST /api/generate-quiz
app.post('/api/generate-quiz', async (req, res) => {
    try {
        const { testId, roleId, currentSkills } = req.body;
        const sessionId = crypto.randomUUID();

        let promptContext = '';
        if (testId === 'technical') {
            promptContext = `Generate a 5-question technical multiple-choice test for a candidate aiming for a "${roleId}" role with current skills: ${currentSkills.join(', ')}. Focus heavily on assessing those specific skills.`;
        } else {
            promptContext = `Generate a 5-question general aptitude and logic reasoning test. Focus on problem solving, pattern matching, and numeric sequences.`;
        }

        const prompt = `${promptContext}
Return the output EXACTLY as a JSON object with this strict format:
{
  "title": "Name of the Test",
  "description": "Short description",
  "questions": [
    {
      "id": "q1",
      "question": "Question text here",
      "options": [
        { "id": "a", "text": "Option A" },
        { "id": "b", "text": "Option B" },
        { "id": "c", "text": "Option C" },
        { "id": "d", "text": "Option D" }
      ],
      "correctId": "a"
    }
  ]
}
Use unique IDs for questions (q1, q2...) and options (a, b, c, d). Do not include any explanation or extra text.`;

        const response = await groq.chat.completions.create({
            model: GROQ_MODEL,
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
            temperature: 0.5
        });

        const quizData = JSON.parse(response.choices[0].message.content);

        // Store internally for grading
        quizSessions[sessionId] = {
            testId,
            title: quizData.title,
            questions: quizData.questions
        };

        // Strip correct answers before sending to client
        const clientQuestions = quizData.questions.map(q => ({
            id: q.id,
            question: q.question,
            options: q.options
        }));

        res.json({
            testId: sessionId,
            title: quizData.title,
            description: quizData.description,
            questions: clientQuestions
        });

    } catch (error) {
        console.error('Error generating quiz with Groq:', error);
        res.status(500).json({ error: 'Failed to generate quiz.' });
    }
});

// POST /api/submit-quiz (Calculate Score)
app.post('/api/submit-quiz', (req, res) => {
    const { answers, sessionId } = req.body; // Expect format: { [questionId]: selectedOptionId }

    if (!answers || typeof answers !== 'object' || !sessionId) {
        return res.status(400).json({ error: 'Invalid answers payload or missing testId/sessionId' });
    }

    const session = quizSessions[sessionId];
    if (!session) {
        return res.status(404).json({ error: 'Quiz session not found or expired.' });
    }

    let correctAnswers = 0;

    // Evaluate answers
    session.questions.forEach(q => {
        if (answers[q.id] === q.correctId) {
            correctAnswers++;
        }
    });

    const scorePercentage = (correctAnswers / session.questions.length) * 100;

    res.json({
        success: true,
        score: scorePercentage,
        correctCount: correctAnswers,
        totalCount: session.questions.length,
        testTitle: session.title
    });
});


// POST Generate Roadmap
app.post('/api/generate-roadmap', (req, res) => {
    const { missingSkills } = req.body;

    if (!missingSkills || !Array.isArray(missingSkills)) {
        return res.status(400).json({ error: 'Missing missingSkills array' });
    }

    const roadmap = [];
    missingSkills.forEach(skill => {
        const steps = db.roadmaps[skill] || db.getGenericRoadmap(skill);
        roadmap.push({
            skillName: skill,
            steps: steps
        });
    });

    res.json(roadmap);
});

// Start Server

app.listen(port, () => {
    console.log(`SkillBridge AI Backend running at http://localhost:${port}`);
});
