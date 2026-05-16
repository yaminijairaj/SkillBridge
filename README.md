# SkillBridge AI 🚀

> AI-powered career readiness platform that analyzes your skills, detects gaps, and generates personalized learning roadmaps.

![SkillBridge AI](https://img.shields.io/badge/Powered%20by-Gemini%20AI-blue?style=for-the-badge)
![Supabase](https://img.shields.io/badge/Database-Supabase-green?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Backend-Node.js-brightgreen?style=for-the-badge)

---

## ✨ Features

- **AI Resume Analysis** — Upload a PDF and Gemini AI extracts your skills automatically
- **Skill Gap Detection** — Compare your profile against industry role requirements
- **Personalized Roadmap** — Step-by-step learning plan with real documentation links
- **Aptitude Testing** — AI-generated quizzes with anti-cheating proctoring
- **Educator Portal** — Educators can monitor all student skill profiles and scores
- **Certificate Generation** — Download a completion certificate as PNG

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML, CSS, JavaScript |
| Backend | Node.js + Express |
| Database & Auth | Supabase (PostgreSQL) |
| AI | Google Gemini 2.5 Flash |
| PDF Parsing | pdf-parse |

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) account (free)
- A [Google AI Studio](https://aistudio.google.com) Gemini API key (free)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/skill-verify.git
cd skill-verify
```

### 2. Set up Supabase
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of [`supabase_setup.sql`](supabase_setup.sql)
3. Go to **Authentication → Providers → Email** and turn OFF "Confirm email" (for local testing)
4. Copy your **Project URL** and **Publishable Key** from **Settings → API**

### 3. Configure frontend
Edit `js/supabase.js` and replace the placeholders:
```js
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_KEY = 'sb_publishable_YOUR_KEY';
```

### 4. Configure backend
```bash
cd server
cp .env.example .env
```
Edit `server/.env`:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

### 5. Install and run
```bash
cd server
npm install
node server.js
```

Open `http://localhost:3000` in your browser.

---

## 📁 Project Structure

```
skill-verify/
├── index.html          # Main frontend app
├── style.css           # All styles
├── js/
│   ├── supabase.js     # Supabase client initialization
│   ├── api.js          # API calls (Supabase + Node backend)
│   ├── state.js        # Global state management
│   ├── ui.js           # UI rendering and educator portal
│   ├── main.js         # App logic, routing, quiz proctoring
│   └── certificate.js  # Certificate download
└── server/
    ├── server.js        # Express server + Gemini AI endpoints
    ├── .env.example     # Environment variable template
    └── package.json
```

---

## 👤 Demo Accounts

After setting up, sign up as:
- **Student** — Click "I am a Student" on the landing page
- **Educator** — Click "I am an Educator" to access the educator dashboard

---

## 📸 Screenshots

> Add screenshots here after running the app

---

## 📄 License

MIT License — free to use for educational purposes.
