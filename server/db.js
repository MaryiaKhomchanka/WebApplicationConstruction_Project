const Database = require('better-sqlite3');

const db = new Database('streamer.db')

db.exec(`
    CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        passwordHash TEXT NOT NULL,
        avatarUrl TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS schedule (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dayOfWeek TEXT NOT NULL,
        startTime TEXT NOT NULL,
        endTime TEXT NOT NULL,
        game TEXT
    );


    CREATE TABLE IF NOT EXISTS stream_watch(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        streamId TEXT NOT NULL,
        watchedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(userId, streamId)
    );
`); 


const scheduleCount = db.prepare('SELECT COUNT(*) AS count FROM schedule').get().count;
if (scheduleCount === 0) {
  db.exec(`
    INSERT INTO schedule (dayOfWeek, startTime, endTime, game) VALUES
    ('Monday', '18:00', '21:00', 'Valorant'),
    ('Wednesday', '19:00', '22:00', 'Just Chatting'),
    ('Friday', '20:00', '00:00', 'League of Legends');
  `);
}


module.exports = db;