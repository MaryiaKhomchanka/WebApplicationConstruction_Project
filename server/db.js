const Database = require('better-sqlite3');

const db = new Database('streamer.db')

db.exec(`
    CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        passwordHash TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS product (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        imageUrl TEXT,
        description TEXT
    );

    CREATE TABLE IF NOT EXISTS schedule (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dayOfWeek TEXT NOT NULL,
        startTime TEXT NOT NULL,
        endTime TEXT NOT NULL,
        game TEXT
    );
`); 


const productCount = db.prepare('SELECT COUNT(*) AS count FROM product').get().count;
if (productCount === 0) {
  db.exec(`
    INSERT INTO product (name, price, imageUrl, description) VALUES
    ('Streamer T-Shirt', 24.99, '/images/shirt.jpg', 'Black t-shirt with streamer logo'),
    ('Streamer Mug', 14.99, '/images/mug.jpg', 'White mug with cute chibi art');
  `);
}

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