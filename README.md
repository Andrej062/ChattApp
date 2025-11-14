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
