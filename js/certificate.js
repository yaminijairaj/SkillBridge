// certificate.js - HTML to PNG Certificate Generator
const certificateModule = {
    generate(submission) {
        const wrapper = document.getElementById('certificate-wrapper');
        const date = new Date(submission.timestamp).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });

        wrapper.innerHTML = `
            <div id="cert-node" style="background: linear-gradient(135deg, #0f172a 0%, #171038 100%); border: 2px solid #6366f1; border-radius: 16px; padding: 3rem; text-align: center; color: #f8fafc; font-family: 'Inter', sans-serif; position: relative; overflow: hidden; box-shadow: 0 0 40px rgba(99,102,241,0.2);">
                <!-- decorative blobs -->
                <div style="position:absolute; top:-50px; left:-50px; width:150px; height:150px; background:#6366f1; border-radius:50%; opacity:0.15; filter:blur(40px);"></div>
                <div style="position:absolute; bottom:-50px; right:-50px; width:200px; height:200px; background:#c084fc; border-radius:50%; opacity:0.15; filter:blur(40px);"></div>

                <div style="display:flex; justify-content:center; align-items:center; gap:0.5rem; margin-bottom:2rem;">
                    <span style="color:#6366f1; font-size:2rem; filter: drop-shadow(0 0 8px rgba(99,102,241,0.6));">▲</span>
                    <span style="font-weight:700; font-size:1.5rem; letter-spacing:-0.02em;">SkillVerify</span>
                </div>

                <h1 style="font-size:2.8rem; font-weight:800; margin-bottom:0.5rem; background:linear-gradient(135deg, #818cf8 0%, #c084fc 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">Certificate of Skill</h1>
                <p style="color:#94a3b8; font-size:1.1rem; margin-bottom:2rem;">This verifies that</p>
                <h2 style="font-size:3rem; font-weight:700; margin-bottom:2rem; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:1rem; display:inline-block; min-width:300px;">${this.escapeHtml(submission.studentName)}</h2>
                <p style="color:#94a3b8; font-size:1.1rem; margin-bottom:0.5rem;">has successfully completed the proctored challenge:</p>
                <h3 style="font-size:1.8rem; font-weight:600; margin-bottom:3rem; color:#e0e7ff;">${this.escapeHtml(submission.challengeTitle)}</h3>

                <div style="display:flex; justify-content:space-around; align-items:flex-end; border-top:1px solid rgba(255,255,255,0.1); padding-top:2rem;">
                    <div style="text-align:left;">
                        <p style="font-size:0.85rem; color:#818cf8; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.25rem;">Proctoring Integrity</p>
                        <p style="font-size:1.5rem; font-weight:700;">${submission.integrityScore}%</p>
                    </div>
                    <div>
                        <div style="width:80px; height:80px; border-radius:50%; background:rgba(99,102,241,0.1); border:1px solid rgba(99,102,241,0.4); display:flex; align-items:center; justify-content:center; margin:0 auto 0.5rem;">
                            <span style="font-size:2rem;">🏆</span>
                        </div>
                        <p style="font-size:0.75rem; color:#94a3b8;">ID: ${submission.id}</p>
                    </div>
                    <div style="text-align:right;">
                        <p style="font-size:0.85rem; color:#818cf8; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.25rem;">Date Issued</p>
                        <p style="font-size:1.2rem; font-weight:600;">${date}</p>
                    </div>
                </div>
            </div>
        `;
    },

    download() {
        if (typeof html2canvas === 'undefined') {
            if (window.ui) ui.toast('Certificate generator loading...', 'warning');
            return;
        }

        const node = document.getElementById('cert-node');
        const btn = document.getElementById('btn-download-cert');

        if (!node) return;

        btn.disabled = true;
        btn.textContent = "Generating PNG...";

        html2canvas(node, {
            scale: 2,
            backgroundColor: '#0f172a',
            useCORS: true,
            logging: false
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'SkillVerify-Certificate.png';
            link.href = canvas.toDataURL('image/png');
            link.click();

            btn.disabled = false;
            btn.textContent = "Download Certificate";
        }).catch(err => {
            console.error(err);
            if (window.ui) ui.toast('Failed to generate certificate', 'error');
            btn.disabled = false;
            btn.textContent = "Download Certificate";
        });
    },

    escapeHtml(unsafe) {
        return (unsafe || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
};
