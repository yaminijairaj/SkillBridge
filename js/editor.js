// editor.js - Lightweight Syntax Highlighting Editor
const editorModule = {
    textarea: null,
    highlight: null,
    codeContent: null,
    _boundInput: null,
    _boundScroll: null,
    _boundKeydown: null,

    init(starterCode = '') {
        this.textarea = document.getElementById('code-textarea');
        this.highlight = document.getElementById('code-highlight');
        this.codeContent = document.getElementById('code-content');

        if (!this.textarea || !this.codeContent) return;

        // Cleanup old listeners if re-initialized
        if (this._boundInput) {
            this.textarea.removeEventListener('input', this._boundInput);
            this.textarea.removeEventListener('scroll', this._boundScroll);
            this.textarea.removeEventListener('keydown', this._boundKeydown);
        }

        this.textarea.value = starterCode;
        this.updateSyntax();

        this._boundInput = () => this.updateSyntax();
        this._boundScroll = () => this.syncScroll();
        this._boundKeydown = (e) => this.handleTabs(e);

        this.textarea.addEventListener('input', this._boundInput);
        this.textarea.addEventListener('scroll', this._boundScroll);
        this.textarea.addEventListener('keydown', this._boundKeydown);
    },

    getValue() {
        return this.textarea ? this.textarea.value : '';
    },

    updateSyntax() {
        let text = this.textarea.value;
        const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Simple highlighting for demo purposes
        let highlighted = escaped
            .replace(/\b(function|def|return|const|let|var|if|else|for|while|import|class|pass)\b/g, '<span class="token keyword">$1</span>')
            .replace(/\b(\d+)\b/g, '<span class="token number">$1</span>')
            .replace(/(['"\`].*?['"\`])/g, '<span class="token string">$1</span>')
            .replace(/(\/\/.*|\#.*)/g, '<span class="token comment">$1</span>');

        this.codeContent.innerHTML = highlighted;
    },

    syncScroll() {
        this.highlight.scrollTop = this.textarea.scrollTop;
        this.highlight.scrollLeft = this.textarea.scrollLeft;
    },

    handleTabs(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = this.textarea.selectionStart;
            const end = this.textarea.selectionEnd;

            this.textarea.value = this.textarea.value.substring(0, start) +
                "    " + this.textarea.value.substring(end);

            this.textarea.selectionStart = this.textarea.selectionEnd = start + 4;
            this.updateSyntax();
        }
    }
};
