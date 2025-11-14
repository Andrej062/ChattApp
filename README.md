#ChattApp

Opprettet grunnlaget for prosjektet

Jeg har satt opp et Node.js-prosjekt med følgende teknologi:
Node.js – backend
Express – håndtering av server og ruter
SQLite – database (filbasert)

Nodemon – automatisk restart under utvikling


Koble prosjektet til SQLite
Har laget en fil src/db.js som åpner SQLite-databasen:

src/chattApp.db
Denne brukes av Express til å hente og lagre data.


Ruten GET /api/rooms henter alle rom fra databasen.
Eksempel på respons:

[
  { "id": 1, "name": "Generelt", "description": "Generell prat" }
]


Lagd API-ruter for meldinger
1. Hente alle meldinger i et rom

GET /api/messages/:roomId

Henter alle meldinger sortert etter tidspunkt.
2. Sende en ny melding

POST /api/messages/:roomId

Kropp (JSON):

{
  "content": "Hei alle!",
  "user_id": 1
}

Denne ruten lagrer en ny melding i databasen.

Testet og bekreftet at alt fungerer
Serveren kjører på http://localhost:3000

/api/rooms fungerer
/api/messages/:roomId fungerer

meldinger kan sendes med POST
HTML-siden lastes riktig og viser rom