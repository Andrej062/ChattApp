// src/app.js
// Her setter vi opp Express, statiske filer og ruter.

const express = require('express');
const path = require('path');

const roomsRouter = require('./routes/rooms');
const messagesRouter = require('./routes/messages');

const app = express();

// Gjør at vi kan ta imot JSON i POST-forespørsler
app.use(express.json());

// Serverer filer fra "public"-mappen (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '..', 'public')));

// API-endepunkter
app.use('/api/rooms', roomsRouter);
app.use('/api/messages', messagesRouter);

module.exports = app;
