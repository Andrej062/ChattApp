// src/routes/messages.js
// Ruter for meldinger. Henter meldinger fra databasen.

const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/messages -> test for nå
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM messages ORDER BY created_at DESC';

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Feil ved henting av meldinger:', err.message);
      res.status(500).json({ error: 'Serverfeil ved henting av meldinger' });
      return;
    }
    res.json(rows);
  });
});

module.exports = router;
