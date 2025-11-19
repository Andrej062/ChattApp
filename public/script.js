//Henter room-id fra URL

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('room');

const roomNameEl = document.getElementById('roomName');
if (roomNameEl && roomId) {
  roomNameEl.textContent = `Rom #${roomId}`;
}

const messagesDiv = document.getElementById('messages');
const sendBtn = document.getElementById('sendBtn');
const msgInput = document.getElementById('msgInput');

//Laster meldinger for rommet

async function loadMessages() {
    const res = await fetch(`/api/messages/${roomId}`);
    const messages = await res.json();

    messagesDiv.innerHTML = '';
    messages.forEach(m=> {
        const el = document.createElement('div');
        el.className = "message";
        el.innerHTML = `
            <div class="message-header">
                <span class="message-user">Bruker ${m.user_id}</span>
                <span class="message-time">${m.created_at}</span>
            </div>
            <div class="message-text">${m.content}</div>
        `;
        messagesDiv.appendChild(el);
    });
}

//Sender en ny melding

async function sendMessage() {
    const content = msgInput.value;
    if(!content.trim()) return;

    await fetch(`/api/messages/${roomId}`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
            content,
            user_id: 1 //midlertidlig bruker
        })
    });
    msgInput.value = '';
    loadMessages(); //Oppdater meldinger
}

sendBtn.addEventListener('click', sendMessage);

//Last inn meldinger med en gang
loadMessages();
