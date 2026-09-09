# SkillBridge AI 🚀

> **AI-Powered Career Readiness & Skill Verification Platform**  
> Bridge the gap between education and industry expectations with intelligent skill assessments, AI resume analysis, and dynamic learning roadmaps.

[![Live Demo](https://img.shields.io/badge/Live%20Website-Visit%20SkillBridge-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://skillbridge-iml8.onrender.com/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-SkillBridge-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/yaminijairaj/SkillBridge)
[![Groq AI](https://img.shields.io/badge/AI%20Engine-Groq%20(LLaMA%203.3)-f55036?style=for-the-badge)](https://groq.com)
[![Supabase](https://img.shields.io/badge/Database-Supabase%20Cloud-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)

🌐 **Live Application:** [https://skillbridge-iml8.onrender.com/](https://skillbridge-iml8.onrender.com/)

---

## 🌟 Overview

**SkillBridge AI** helps students and aspiring developers evaluate their current technical skill sets against real-world job roles. Using intelligent AI extraction and verification workflows, the platform identifies missing technical requirements, offers tailored roadmaps with vetted resources, tests knowledge through proctored assessments, and provides educators with actionable batch analytics.

---

## ✨ Key Features

- 📄 **Smart Resume Analysis**: Upload resumes (PDF, DOCX, or TXT) to automatically extract core technical skills and tools via Groq AI (LLaMA 3.3 70B).
- 🎯 **Skill Gap Analysis**: Compares a user's skills against real industry roles (Frontend, Backend, AI Engineer, Mobile App Developer, Data Analyst) and calculates a role match percentage.
- 🗺️ **Personalized Learning Roadmaps**: Generates modular, weekly roadmaps with direct links to official documentation, courses, and interactive practice.
- 📝 **Proctored AI Assessments**: Real-time adaptive technical and aptitude quizzes equipped with tab-switch warnings and integrity monitoring.
- 📊 **Educator Dashboard**: Comprehensive analytics portal allowing educators to inspect class-wide skill distributions, student readiness, and test performance.
- 📜 **Verifiable Certificates**: Auto-generates downloadable completion certificates upon passing skill evaluations.

---

## 🛠️ Architecture & Tech Stack

```mermaid
graph TD
    User([User / Browser]) <-->|Web Interface & API| Express[Express.js Server]
    Express <-->|Auth & Profiles| Supabase[(Supabase Cloud DB)]
    Express <-->|Resume & Gap Analysis| Groq[Groq AI LLaMA 3.3]
```

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3, Boxicons, Canvas API (Certificates)
- **Backend**: Node.js, Express.js, Multer
- **AI / LLM Engine**: Groq Cloud SDK (`llama-3.3-70b-versatile`)
- **Document Parsers**: `pdf-parse`, `mammoth` (Word .docx)
- **Database & Auth**: Supabase (PostgreSQL with real-time support)
- **Hosting & Deployment**: Render ([skillbridge-iml8.onrender.com](https://skillbridge-iml8.onrender.com/))

---

## 📁 Project Structure

```text
SkillBridge/
├── index.html              # Main application single-page interface
├── style.css               # Design system, glassmorphism, responsive styles
├── dummy_resume.txt        # Sample resume file for quick testing
├── js/
│   ├── app.js              # Application bootstrapping
│   ├── api.js              # Client-side API interactions
│   ├── main.js             # Event listeners, flow orchestration, navigation
│   ├── ui.js               # UI render functions & Educator view
│   ├── state.js            # Reactive application state
│   ├── supabase.js         # Supabase client setup
│   ├── certificate.js      # Canvas-based certificate rendering
│   ├── originality.js      # Integrity & proctoring logic
│   ├── challenges.js       # Interactive challenges
│   ├── editor.js           # Code playground & editor tools
│   ├── monitor.js          # Activity & test monitoring
│   └── timer.js            # Quiz timers & interval handlers
└── server/
    ├── server.js           # REST API & static file server
    ├── db.js               # DB configuration
    ├── package.json        # Server dependencies
    └── .env.example        # Environment variable template
```

---


## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to open an issue or submit a pull request to help improve the platform.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
