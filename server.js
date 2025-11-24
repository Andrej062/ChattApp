// server.js
// Starter Express + Socket.IO serveren

const expressApp = require('./src/app');
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(expressApp);
const io = new Server(server);

// Hendelser for WebSocket-tilkobling
io.on('connection', (socket) => {
    console.log('En bruker koblet til');

    // Når brukeren går inn i et rom
    socket.on('joinRoom', (roomId) => {
        if (!roomId) return;
        socket.join(String(roomId));
        console.log(`Bruker ble med i rom ${roomId}`);
    });

    // Når en melding sendes fra klienten
    socket.on('newMessage', (data) => {
        // Forventer et objekt med minst room_id, user_id, content, created_at
        const roomId = data.room_id || data.roomId;
        if (!roomId) return;

        // Sender meldingen videre til alle i dette rommet (inkl. avsender)
        io.to(String(roomId)).emit('broadcastMessage', data);
    });

    socket.on('disconnect', () => {
        console.log('En bruker koblet fra');
    });
});

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server kjører på http://localhost:${PORT}`);
});
