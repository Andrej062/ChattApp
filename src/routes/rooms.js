// src/routes/rooms.js
// Ruter som handler om chatterom.

const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/rooms -> hent alle rom
router.get('/', (req, res) => {
  const sql = 'SELECT id, name, description FROM rooms ORDER BY id';

  // db.all henter alle rader fra spørringen
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Feil ved henting av rom:', err.message);
      return res.status(500).json({ error: 'Serverfeil ved henting av rom' });
    }
    return res.json(rows);
  });
});

module.exports = router;
