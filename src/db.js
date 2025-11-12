// src/db.js
// Denne filen kobler til SQLite-databasen (filbasert).

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Finner absolutt sti til databasefilen
const dbPath = path.join(__dirname, 'chattApp.db');

// Åpner databasen
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Feil ved åpning av SQLite-database:', err.message);
  } else {
    console.log('Tilkoblet SQLite-database:', dbPath);
  }
});

module.exports = db;
