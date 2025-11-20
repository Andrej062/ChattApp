## Status per nå

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
- Når bruker klikker på et rom, åpnes **chat-siden** for det rommet.

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

## ⚠️ Avgrensninger i prosjektet

Prosjektet er forenklet på flere områder:

- Det er **ingen ekte innlogging** ennå. `user_id` settes statisk (f.eks. `1`) i koden når en melding sendes.
- Ingen passordhåndtering eller sikkerhet er implementert (ingen hashing, ingen sesjoner).
- Chatten er **ikke i sanntid** – siden må oppdatere meldinger ved å hente data fra serveren (ingen WebSocket / Socket.IO enda).
- Det er ingen validering av input på klientsiden utover en enkel sjekk for tomme meldinger.

Disse avgrensningene er bevisste, fordi hovedmålet er å vise:

- hvordan API og database henger sammen
- hvordan frontend kan bruke API
- at strukturen på prosjektet er ryddig og lett å forstå


---

### Hvordan kjøre prosjektet

```bash
# installere avhengigheter (første gang)
npm install

# starte serveren med nodemon (utvikling)
npm run dev


## Mulig videre utvikling

Hvis prosjektet skulle bygges videre, kunne man:

- legge til **brukersystem** med registrering, innlogging og ekte `user_id`
- bruke **Socket.IO** for å gjøre chatten «live» uten å måtte laste siden på nytt
- legge til støtte for å se **hvem som er online**
- forbedre UI ytterligere (vise avatar, vise egne meldinger på høyre side osv.)
- skrive flere tester og legge inn bedre feilhåndtering i API-et
