// originality.js - Code Similarity & Quality Checker
const originalityModule = {
    check(code, challenge) {
        if (!code || code.trim() === '') {
            return { score: 0, verdict: 'FLAGGED' };
        }

        const tokens = this.tokenize(code);
        const refTokens = challenge.referenceTokens || [];

        // 1. Token overlap with reference solution (lower = more original)
        let matchCount = 0;
        refTokens.forEach(rt => {
            if (tokens.includes(rt.toLowerCase())) matchCount++;
        });
        const overlapRatio = refTokens.length > 0 ? (matchCount / refTokens.length) : 0;

        // 2. Code length penalty — suspiciously short code is flagged
        const lineCount = code.trim().split('\n').length;
        const lengthBonus = Math.min(20, lineCount * 2); // Up to 20 pts for length

        // 3. Structural complexity — unique keywords used
        const codeKeywords = ['if', 'else', 'for', 'while', 'return', 'function',
            'const', 'let', 'var', 'class', 'try', 'catch', 'map', 'filter',
            'reduce', 'async', 'await', 'forEach', 'switch', 'break'];
        const usedKeywords = codeKeywords.filter(kw => tokens.includes(kw));
        const complexityBonus = Math.min(20, usedKeywords.length * 3);

        // 4. Variable naming diversity — unique identifiers (not keywords)
        const identifiers = tokens.filter(t => !codeKeywords.includes(t) && t.length > 2);
        const uniqueIdentifiers = new Set(identifiers).size;
        const namingBonus = Math.min(20, uniqueIdentifiers * 2);

        // 5. Base score: starts high, penalized for high overlap with reference
        let score = 100 - Math.round(overlapRatio * 60);

        // Add real quality bonuses
        score = Math.min(100, score + Math.round((lengthBonus + complexityBonus + namingBonus) / 6));
        score = Math.max(0, score);

        // Verdict threshold
        let verdict = 'ORIGINAL';
        if (score < 50) verdict = 'FLAGGED';
        else if (score < 75) verdict = 'SUSPICIOUS';

        return { score, verdict };
    },

    tokenize(code) {
        const clean = code
            .replace(/\/\/.*|#.*/g, '')        // Remove single-line comments
            .replace(/\/\*[\s\S]*?\*\//g, '')   // Remove block comments
            .replace(/(['"`].*?['"`])/g, '')    // Remove string literals
            .toLowerCase();

        return clean.match(/\b\w+\b/g) || [];
    }
};
