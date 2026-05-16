# SkillBridge AI 🚀

> AI-powered career readiness platform that analyzes your skills, detects gaps, and generates personalized learning roadmaps.

![SkillBridge AI](https://img.shields.io/badge/Powered%20by-Groq%20AI-orange?style=for-the-badge)
![Supabase](https://img.shields.io/badge/Database-Supabase-green?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Backend-Node.js-brightgreen?style=for-the-badge)

---

## ✨ Features

- **AI Resume Analysis** — Upload a PDF or DOCX and Groq AI extracts your skills automatically
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
| AI | Groq (LLaMA 3.3 70B) |
| PDF Parsing | pdf-parse |
| DOCX Parsing | mammoth |

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) account (free)
- A [Groq](https://console.groq.com) API key (free)

### 1. Clone the repo
```bash
git clone https://github.com/yaminijairaj/SkillBridge.git
cd SkillBridge
```

### 2. Set up Supabase
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of [`supabase_setup.sql`](supabase_setup.sql)
3. Go to **Authentication → Providers → Email** → turn ON **"Enable email provider"** and turn OFF **"Confirm email"**
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
GROQ_API_KEY=your_groq_api_key_here
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
SkillBridge/
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
    ├── server.js        # Express server + Groq AI endpoints
    ├── .env.example     # Environment variable template
    └── package.json
```

---

## 👤 Demo Accounts

After setting up, sign up as:
- **Student** — Click "I am a Student" on the landing page
- **Educator** — Click "I am an Educator" to access the educator dashboard

---

## 📄 License

MIT License — free to use for educational purposes.
