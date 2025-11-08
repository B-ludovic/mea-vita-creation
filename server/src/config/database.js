// Importer le module PostgreSQL
const { Pool } = require('pg');

// Charger les variables d'environnement depuis le fichier .env
require('dotenv').config();

// Créer une "pool" de connexions à la base de données
// Une pool = un groupe de connexions réutilisables (plus performant)
const pool = new Pool({
  user: process.env.DB_USER,           // Nom d'utilisateur PostgreSQL
  host: process.env.DB_HOST,           // Adresse du serveur (localhost = ton ordinateur)
  database: process.env.DB_NAME,       // Nom de la base de données
  password: process.env.DB_PASSWORD,   // Mot de passe
  port: process.env.DB_PORT,           // Port PostgreSQL (5432 par défaut)
});

// Tester la connexion
pool.connect((err, client, release) => {
  if (err) {
    // Si erreur, afficher le message
    console.error('❌ Erreur de connexion à PostgreSQL:', err.stack);
  } else {
    // Si succès, afficher un message de confirmation
    console.log('✅ Connecté à PostgreSQL');
    release(); // Libérer la connexion
  }
});

// Exporter la pool pour l'utiliser dans d'autres fichiers
module.exports = pool;