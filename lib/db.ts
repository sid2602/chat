// If you see type errors for 'process' or 'path', run: npm i --save-dev @types/node
import Database from 'better-sqlite3';
import path from 'path';

// Path to the SQLite database file (in project root)
const dbPath = path.join(process.cwd(), 'chatbot.db');
const db = new Database(dbPath);

// Create rooms table if it doesn't exist
// id: INTEGER PRIMARY KEY AUTOINCREMENT
// name: TEXT
// chatbot_endpoint_url: TEXT
db.prepare(`
  CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    chatbot_endpoint_url TEXT
  )
`).run();

// Create messages table if it doesn't exist
// id: INTEGER PRIMARY KEY AUTOINCREMENT
// room_id: INTEGER (foreign key)
// sender_type: TEXT ('user' or 'bot')
// content: TEXT
// timestamp: DATETIME
db.prepare(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id INTEGER NOT NULL,
    sender_type TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(room_id) REFERENCES rooms(id)
  )
`).run();

export default db; 