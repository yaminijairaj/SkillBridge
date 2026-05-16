const fs = require('fs');

async function testUpload() {
    const formData = new FormData();

    // Note: in Node.js 18+ we can use Blob.
    const fileBuffer = fs.readFileSync('C:\\Users\\jaira\\.gemini\\antigravity\\scratch\\skill-verify\\dummy_resume.txt');
    const blob = new Blob([fileBuffer], { type: 'text/plain' });

    formData.append('resume', blob, 'dummy_resume.txt');

    try {
        const response = await fetch('http://localhost:3000/api/analyze-resume', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error:', err);
    }
}

testUpload();
