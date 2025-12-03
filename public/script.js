// public/script.js

// Henter room-id fra URL (?room=1)
const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('room');

const messagesDiv = document.getElementById('messages');
const sendBtn = document.getElementById('sendBtn');
const msgInput = document.getElementById('msgInput');

// Oppdaterer rom-navnet i overskriften
const roomNameEl = document.getElementById('roomName');
if (roomNameEl && roomId) {
  roomNameEl.textContent = `Rom #${roomId}`;
}

// Kobler til Socket.IO
const socket = io();

// Bli med i riktig rom på serveren
if (roomId) {
  socket.emit('joinRoom', roomId);
}

// Legger til én melding i chatten
function addMessage(m) {
  const el = document.createElement('div');
  el.className = 'message';

  el.innerHTML = `
  <div class="message-header">
    <span class="message-user">Bruker ${m.user_id}</span>
    <span class="message-time">${formatTime(m.created_at)}</span>
    <button class="delete-btn" data-id="${m.id}">Delete</button>
  </div>
  <div class="message-text">${m.content}</div>
`;


  messagesDiv.appendChild(el);

  // Ruller ned til siste melding
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Lytter etter klikk på "Delete"-knapper
messagesDiv.addEventListener('click', async (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const id = e.target.getAttribute('data-id');

    const res = await fetch(`/api/messages/${id}`, {
      method: 'DELETE'
    });

    const result = await res.json();

    if (result.success) {
      // Fjerner HTML-elementet
      e.target.closest('.message').remove();
    }
  }
});


// Konverterer UTC-tid til lokal tid uten sekunder
function formatTime(utcString) {
    const date = new Date(utcString);

    return date.toLocaleString("no-NO", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}


// Laster alle meldinger for rommet (historikk)
async function loadMessages() {
  try {
    const res = await fetch(`/api/messages/${roomId}`);
    if (!res.ok) {
      console.error('Feilstatus fra server:', res.status);
      return;
    }

    const messages = await res.json();

    messagesDiv.innerHTML = '';

    messages.forEach((m) => {
      addMessage(m);
    });
  } catch (err) {
    console.error('Feil ved henting av meldinger:', err);
  }
}

// Sender en ny melding
async function sendMessage() {
  const content = msgInput.value;

  // Enkel sjekk for tom melding
  if (!content.trim()) {
    return;
  }

  try {
    // 1. Lagrer meldingen i databasen via API
    const res = await fetch(`/api/messages/${roomId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        user_id: 1 // midlertidig bruker
      })
    });

    if (!res.ok) {
      console.error('Feil ved sending av melding:', res.status);
      return;
    }

    const savedMessage = await res.json();

    // 2. Tømmer input-feltet
    msgInput.value = '';

    // 3. Sender meldingen videre til Socket.IO-serveren
    socket.emit('newMessage', savedMessage);

    // Ikke kaller loadMessages() her, fordi vi får meldingen tilbake via socket
  } catch (err) {
    console.error('Feil ved sending av melding:', err);
  }
}

// Når serveren sender en ny melding til klienten
socket.on('broadcastMessage', (msg) => {
  // Legger meldingen til i chatten
  addMessage(msg);
});

// Knytter knappen til funksjonen
if (sendBtn) {
  sendBtn.addEventListener('click', sendMessage);
}

// Lar brukeren trykke Enter for å sende
if (msgInput) {
  msgInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
}

// Laster meldinger når siden åpnes
if (roomId) {
  loadMessages();
}
