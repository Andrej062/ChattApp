// src/routes/rooms.js
// Ruter som handler om chatterom.

const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/rooms -> hent alle rom
router.get('/', (req, res) => {
  const sql = 'SELECT id, name, description FROM rooms ORDER BY id';

  // Henter alle rom fra databasen
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Feil ved henting av rom:', err.message);
      return res.status(500).json({ error: 'Serverfeil ved henting av rom' });
    }

    // Sender listen med rom tilbake som JSON
    return res.json(rows);
  });
});

// POST /api/rooms -> opprett et nytt rom
// Body: { name, description }
router.post('/', (req, res) => {
  const { name, description } = req.body;

  // Sjekker at navn er fylt ut
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Navn på rom må fylles ut' });
  }

  const cleanName = name.trim();
  const cleanDesc = (description || '').trim();

  const sql = `
    INSERT INTO rooms (name, description, created_at)
    VALUES (?, ?, datetime('now'))
  `;

  // Lagrer nytt rom i databasen
  db.run(sql, [cleanName, cleanDesc], function (err) {
    if (err) {
      console.error('Feil ved oppretting av rom:', err.message);
      return res.status(500).json({ error: 'Kunne ikke opprette rom' });
    }

    // this.lastID er id-en til rommet vi nettopp lagde
    return res.status(201).json({
      id: this.lastID,
      name: cleanName,
      description: cleanDesc
    });
  });
});

// DELETE /api/rooms/:id -> slett et rom og tilhørende meldinger
router.delete('/:id', (req, res) => {
  const roomId = req.params.id;

  // Først sletter vi alle meldinger i dette rommet
  const deleteMessagesSql = 'DELETE FROM messages WHERE room_id = ?';
  db.run(deleteMessagesSql, [roomId], function (err) {
    if (err) {
      console.error('Feil ved sletting av meldinger:', err.message);
      return res.status(500).json({
        error: 'Kunne ikke slette meldinger for rommet'
      });
    }

    // Deretter sletter vi selve rommet
    const deleteRoomSql = 'DELETE FROM rooms WHERE id = ?';
    db.run(deleteRoomSql, [roomId], function (err2) {
      if (err2) {
        console.error('Feil ved sletting av rom:', err2.message);
        return res.status(500).json({ error: 'Kunne ikke slette rom' });
      }

      // this.changes forteller hvor mange rader som ble slettet
      if (this.changes === 0) {
        // Ingen rom ble slettet (fantes ikke)
        return res.status(404).json({ error: 'Rommet finnes ikke' });
      }

      return res.json({ success: true });
    });
  });
});

module.exports = router;
