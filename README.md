## Status per nå

- flere chatterom lagret i SQLite
- mulighet til å opprette og slette rom fra forsiden
- sending og lagring av meldinger per rom
- visning av meldinger i hvert rom
- enkel sanntidsoppdatering med Socket.IO (meldinger dukker opp hos alle som er inne i samme rom)
- ryddig struktur i både backend (Express + SQLite) og frontend (HTML, CSS, JS)

## ⚠️ Avgrensninger i prosjektet

Prosjektet er fortsatt forenklet på flere områder:

- Det er ingen ekte innlogging ennå. `user_id` kan være hardkodet eller satt veldig enkelt.
- Ingen passordhåndtering eller sikkerhet er implementert (ingen hashing, ingen sesjoner).
- Socket.IO brukes kun til å sende nye meldinger ut i rommet – det er ingen avansert håndtering som «hvem er online», typing-status, osv.
- Det er enkel input-validering (f.eks. sjekk for tom melding), men ikke fullstendig validering overalt.

Disse avgrensningene er bevisste, fordi hovedmålet er å vise:

- hvordan API og database henger sammen
- hvordan frontend kan bruke både REST-API (fetch) og sanntid (Socket.IO)
- at strukturen på prosjektet er ryddig og lett å forstå

---

## 📝 Prosjektbeskrivelse

ChattApp er en enkel webapplikasjon der brukere kan gå inn i ulike chatterom og sende meldinger.  
Prosjektet er laget som en del av en skoleoppgave i webutvikling, med fokus på:

- hvordan backend (server) og frontend (klient) samarbeider
- hvordan man bruker en database i et ekte prosjekt
- hvordan man strukturerer kode og dokumentasjon på en ryddig måte

Målet er ikke å lage en «perfekt» profesjonell chat, men å vise at jeg forstår:
ruting i Express, bruk av SQLite, enkle API-endepunkter (GET/POST) og enkel interaksjon i nettleseren med JavaScript.


### Backend (Node.js + Express + SQLite)

- Prosjektet bruker **Node.js** med **Express**.
- Databasen er **SQLite**, lagret som fil: `src/chattApp.db`.
- Tilkobling til databasen ligger i `src/db.js`.
- Express-appen settes opp i `src/app.js`.
- Serveren startes fra `server.js` på port **3000**.

## 🔧 Tekniske valg

Jeg har valgt å bruke **SQLite** i stedet for f.eks. MySQL fordi:

- databasen ligger i én fil (`chattApp.db`), som gjør den enkel å flytte og ta backup av
- den krever ingen egen database-server
- den er mer enn nok for et lite skoleprosjekt

På backend bruker jeg **Express** fordi:

- det er et enkelt og populært rammeverk som er mye brukt i Node.js-prosjekter
- det gjør det lett å definere ruter som `/api/rooms` og `/api/messages/:roomId`
- det er lett å utvide senere (flere ruter, autentisering, osv.)

Frontend er laget med vanlig **HTML, CSS og JavaScript** uten rammeverk som React, fordi fokuset i oppgaven er på:

- grunnleggende forståelse
- hvordan frontend kommuniserer med backend via `fetch`
- struktur, ikke avanserte biblioteker

For sanntid bruker jeg **Socket.IO** fordi:

- det gjør det enkelt å holde åpne forbindelser mellom klient og server
- det støtter «rooms» (rom) som passer godt til chatterom
- det er mye brukt i chat-løsninger og passer bra til skoleprosjekt


#### API-endepunkter som fungerer

1. **Hente alle rom**
   - `GET /api/rooms`
   - Beskrivelse: returnerer alle rader fra tabellen `rooms`.
   - Brukes av forsiden (`index.html`) for å vise liste over chatterom.

2. **Hente meldinger i et bestemt rom**
   - `GET /api/messages/:roomId`
   - Eksempel: `/api/messages/1`
   - Beskrivelse: returnerer alle meldinger fra tabellen `messages` hvor `room_id = :roomId`, sortert etter tid.

3. **Sende en ny melding**
   - `POST /api/messages/:roomId`
   - Body (JSON):
     ```json
     {
       "content": "Hei alle!",
       "user_id": 1
     }
     ```
   - Lagrer en ny rad i `messages` med `room_id`, `user_id`, `content` og `created_at`.

---

### Frontend (HTML, CSS, JS)

Frontend ligger i mappen `public/`.

#### `public/index.html`

- Viser tittel **ChattApp** og en liste med chatterom.
- Henter rom fra `GET /api/rooms` med `fetch(...)`.
- For hvert rom lages en lenke:
  - `href="/chat.html?room=<id>"`
  - navn
  - beskrivelse
  - knapp Slett for å fjerne rommet
  - Når bruker klikker på et rom, åpnes **chat-siden** for det rommet.

### Har en enkel «admin»-seksjon for å opprette nye rom:

- #roomNameInput – navn på rommet
- #roomDescInput – beskrivelse (valgfritt)
- #createRoomBtn – knapp for å opprette rom


#### Viktige funksjoner i <script>:

### Inneholder all logikk for chat-siden.

Hoveddeler:

- Henter roomId fra URL **(?room=1)**.
- Kobler til 
`Socket.IO: const socket = io(); socket.emit('joinRoom', roomId);`


- Laster meldinger med loadMessages() (bruker GET /api/messages/:roomId).
- Viser meldinger med addMessage(m).
- Sender nye meldinger med `sendMessage(): fetch → POST /api/messages/:roomId (lagring i DB) socket.emit('newMessage', savedMessage) (sanntid til alle i rommet)`

Lytter på nye meldinger fra serveren:
`socket.on('broadcastMessage', (msg) => { addMessage(msg); });`


## Bruker `formatTime()` for å vise pen, lokal tid uten sekunder.

`loadRooms()`
Henter alle rom fra /api/rooms og fyller listen i DOM.

`addRoomToList(room)`
Lager én <li> for hvert rom med lenke og slett-knapp.

`createRoomBtn.addEventListener('click', ...)`
Sender POST /api/rooms med navn og beskrivelse, og legger rommet inn i listen hvis alt går bra.

`roomsListEl.addEventListener('click', ...)`
Oppdager klikk på «Slett»-knapper, sender DELETE /api/rooms/:id og fjerner rommet fra DOM ved suksess.


#### `public/chat.html`

- Viser valgt rom i en "chat-kort"-layout.
- Elementer:
  - `#roomName` – overskrift for rommet
  - `#messages` – område der alle meldinger vises
  - `#msgInput` – tekstfelt for å skrive melding
  - `#sendBtn` – knapp for å sende melding
- JavaScript-koden (`public/script.js`) gjør:
  - Leser `roomId` fra URL-en (`?room=1`)
  - Henter meldinger fra `GET /api/messages/:roomId`
  - Viser meldinger i chat-vinduet
  - Sender nye meldinger med `POST /api/messages/:roomId`
  - Oppdaterer listen etter sending.

#### `public/style.css`

- Felles mørkt tema med gradientbakgrunn.
- Sentralisert layout (`.app` med maks bredde).
- Kort-design for:
  - forsiden (liste med rom),
  - chat-siden (meldingsområde + inputfelt nederst).
- Meldinger vises som små "bobler" (`.message`) med skygge.
- Tilpasset for mobil med `@media (max-width: 600px)`.

---

### Databasen (kort oversikt)

Bruker tre tabeller:

- **users** – brukere (id, username, password, created_at)
- **rooms** – chatterom (id, name, description, created_at)
- **messages** – meldinger (id, room_id, user_id, content, created_at)

Relasjoner:

- Ett rom (`rooms.id`) kan ha mange meldinger (`messages.room_id`)
- Én bruker (`users.id`) kan ha mange meldinger (`messages.user_id`)


---

### Hvordan kjøre prosjektet

```bash
# installere avhengigheter (første gang)
npm install

# starte serveren med nodemon (utvikling)
npm run dev

```

## Mulig videre utvikling

Hvis prosjektet skulle bygges videre, kunne man:

- legge til **brukersystem** med registrering, innlogging og ekte `user_id`
- legge til støtte for å se **hvem som er online**
