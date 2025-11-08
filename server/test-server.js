const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Test serveur minimal' });
});

const server = app.listen(5001, () => {
  console.log('✅ Serveur test sur http://localhost:5001');
});

// Empêcher la fermeture
process.on('SIGINT', () => {
  console.log('\nArrêt du serveur...');
  server.close(() => {
    process.exit(0);
  });
});
