// server.js
// Dette er starten.

const app = require('./src/app');

const PORT = 3000; // Porten vi vil bruke

app.listen(PORT, () => {
  console.log(`Server kjører på http://localhost:${PORT}`);
});
