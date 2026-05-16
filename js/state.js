class StateManager {
    constructor() {
        this.quizBanStorageKey = 'skillbridge_quiz_bans';
        this.user = null;
        this.goalRoleId = null;
        this.existingSkills = new Set();
        this.missingSkills = [];
        this.completedSkills = new Set();
        this.roadmap = [];
        this.skillProficiency = {};
        this.aptitudeScore = null;
        this.matchPercentage = 0;
        this.roles = [];
        this.quizTests = [];
        this.quizBan = { isBanned: false, reason: '', bannedAt: null };
    }

    _restoreProfileData(profileData) {
        if (!profileData) return;
        this.goalRoleId = profileData.goalRoleId || null;
        this.existingSkills = new Set(profileData.existingSkills || []);
        this.missingSkills = profileData.missingSkills || [];
        this.completedSkills = new Set(profileData.completedSkills || []);
        this.roadmap = profileData.roadmap || [];
        this.skillProficiency = profileData.skillProficiency || {};
        this.aptitudeScore = profileData.aptitudeScore ?? null;
        this.matchPercentage = profileData.matchPercentage || 0;
    }

    login(user) {
        this.user = user;
        this._restoreProfileData(user.profileData);
        this.loadQuizBan();
    }

    async loadSession() {
        try {
            const user = await api.getSession();
            if (!user) { this.user = null; return; }
            this.user = user;
            this._restoreProfileData(user.profileData);
            this.loadQuizBan();
        } catch (error) {
            this.user = null;
        }
    }

    async logout() {
        await api.logout();
        this.user = null;
        this.goalRoleId = null;
        this.existingSkills.clear();
        this.missingSkills = [];
        this.completedSkills.clear();
        this.roadmap = [];
        this.skillProficiency = {};
        this.aptitudeScore = null;
        this.matchPercentage = 0;
        this.quizBan = { isBanned: false, reason: '', bannedAt: null };
    }

    async saveProgress() {
        if (!this.user || !this.user.id) return;

        const profileData = {
            goalRoleId: this.goalRoleId,
            existingSkills: Array.from(this.existingSkills),
            missingSkills: this.missingSkills,
            completedSkills: Array.from(this.completedSkills),
            roadmap: this.roadmap,
            skillProficiency: this.skillProficiency,
            aptitudeScore: this.aptitudeScore,
            matchPercentage: this.matchPercentage
        };

        this.user.profileData = profileData;
        await api.saveProfile(this.user.id, profileData);
    }

    setGoal(roleId) { this.goalRoleId = roleId; this.saveProgress(); }
    addSkill(skillName) { this.existingSkills.add(skillName.trim()); this.saveProgress(); }
    removeSkill(skillName) { this.existingSkills.delete(skillName); this.saveProgress(); }

    async fetchRoles() { this.roles = await api.getRoles(); }
    async fetchQuizTests() { this.quizTests = await api.getQuizTests(); }

    getGoalRole() {
        if (!this.goalRoleId || this.roles.length === 0) return null;
        return this.roles.find(r => r.id === this.goalRoleId);
    }

    async analyzeGap() {
        const role = this.getGoalRole();
        if (!role) return;
        const currentSkills = Array.from(this.existingSkills);
        const data = await api.analyzeGap(this.goalRoleId, currentSkills);
        if (data && !data.error) {
            this.missingSkills = data.missingSkills;
            this.skillProficiency = data.skillProficiency;
            this.matchPercentage = data.matchPercentage;
            this.roadmap = await api.generateRoadmap(this.missingSkills);
            this.saveProgress();
        }
    }

    setAptitudeScore(score) { this.aptitudeScore = score; this.saveProgress(); }

    loadQuizBan() {
        if (!this.user || !this.user.email) return;
        try {
            const bans = JSON.parse(localStorage.getItem(this.quizBanStorageKey) || '{}');
            this.quizBan = bans[this.user.email] || { isBanned: false, reason: '', bannedAt: null };
        } catch { this.quizBan = { isBanned: false, reason: '', bannedAt: null }; }
    }

    banFromQuiz(reason) {
        if (!this.user || !this.user.email) return;
        this.quizBan = { isBanned: true, reason, bannedAt: new Date().toISOString() };
        try {
            const bans = JSON.parse(localStorage.getItem(this.quizBanStorageKey) || '{}');
            bans[this.user.email] = this.quizBan;
            localStorage.setItem(this.quizBanStorageKey, JSON.stringify(bans));
        } catch { console.error('Failed to persist quiz ban.'); }
    }

    isQuizBanned() { return Boolean(this.quizBan && this.quizBan.isBanned); }

    unbanUser(email) {
        try {
            const bans = JSON.parse(localStorage.getItem(this.quizBanStorageKey) || '{}');
            if (bans[email]) {
                delete bans[email];
                localStorage.setItem(this.quizBanStorageKey, JSON.stringify(bans));
                if (this.user && this.user.email === email) {
                    this.quizBan = { isBanned: false, reason: '', bannedAt: null };
                }
            }
        } catch { console.error('Failed to lift quiz ban.'); }
    }

    toggleRoadmapStep(stepId, isCompleted) {
        if (isCompleted) { this.completedSkills.add(stepId); }
        else { this.completedSkills.delete(stepId); }
        this.saveProgress();
    }

    getMatchPercentage() { return this.matchPercentage; }

    getOverallProgress() {
        if (this.roadmap.length === 0) return 0;
        let totalSteps = 0;
        this.roadmap.forEach(r => totalSteps += r.steps.length);
        if (totalSteps === 0) return 0;
        return Math.round((this.completedSkills.size / totalSteps) * 100);
    }
}

const state = new StateManager();
