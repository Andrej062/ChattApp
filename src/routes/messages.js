// src/routes/messages.js
// Ruter som handler om meldinger (hente og legge til meldinger).

const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/messages/:roomId -> hent alle meldinger for ett rom
router.get('/:roomId', (req, res) => {
  const roomId = req.params.roomId;

  const sql = `
    SELECT m.id,
           m.room_id,
           m.user_id,
           m.content,
           m.created_at
    FROM messages m
    WHERE m.room_id = ?
    ORDER BY m.created_at ASC
  `;

  db.all(sql, [roomId], (err, rows) => {
    if (err) {
      console.error('Feil ved henting av meldinger:', err.message);
      return res
        .status(500)
        .json({ error: 'Serverfeil ved henting av meldinger' });
    }
    return res.json(rows);
  });
});

// POST /api/messages/:roomId -> legg til en ny melding i et rom
router.post('/:roomId', (req, res) => {
  const roomId = req.params.roomId;
  const { content, user_id } = req.body;

  if (!content || content.trim() === '') {
    return res.status(400).json({ error: 'Melding kan ikke være tom' });
  }

  const finalUserId = user_id || 1;

  const sql = `
    INSERT INTO messages (room_id, user_id, content, created_at)
    VALUES (?, ?, ?, datetime('now'))
  `;

  db.run(sql, [roomId, finalUserId, content], function (err) {
    if (err) {
      console.error('Feil ved lagring av melding:', err.message);
      return res
        .status(500)
        .json({ error: 'Serverfeil ved lagring av melding' });
    }

    // this.lastID er id-en til raden vi nettopp lagde
    return res.status(201).json({
      id: this.lastID,
      room_id: Number(roomId),
      user_id: finalUserId,
      content,
      created_at: new Date().toISOString()
    });
  });
});

module.exports = router;
