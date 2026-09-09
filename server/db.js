const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'skillbridge.db');
const db = new Database(dbPath);

// Create users table if it doesn't exist
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        passwordHash TEXT NOT NULL,
        salt TEXT NOT NULL,
        profileData TEXT DEFAULT '{}',
        createdAt TEXT NOT NULL
    )
`);

console.log('[DB] SQLite database initialized at:', dbPath);

module.exports = db;
