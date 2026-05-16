const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
// Initialize the database, logging queries if needed (uncomment for debugging)
const db = new Database(dbPath/*, { verbose: console.log }*/);

// Create the users table if it doesn't exist
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        passwordHash TEXT NOT NULL,
        salt TEXT NOT NULL,
        createdAt TEXT NOT NULL
    )
`);

try {
    db.exec("ALTER TABLE users ADD COLUMN profileData TEXT DEFAULT '{}'");
    console.log("Added profileData column to users table.");
} catch (e) {
    // Column already exists, safe to ignore
}

module.exports = db;
