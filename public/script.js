//Henter room-id fra URL

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('room');

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
        <strong>Bruker ${m.user_id}:</strong> ${m.content}
        <div class="timestamp">${m.created_at}</div>
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
        headers: { "content-type": "application/json" },
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
