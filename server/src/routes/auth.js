// Importer Express Router (pour créer des routes)
const express = require('express');
const router = express.Router();

// Importer les fonctions du contrôleur
const { register, login } = require('../controllers/authController');

// ROUTE D'INSCRIPTION
// POST /api/auth/register
// Le front-end envoie : { email, password, firstName, lastName }
router.post('/register', register);

// ROUTE DE CONNEXION
// POST /api/auth/login
// Le front-end envoie : { email, password }
router.post('/login', login);

// Exporter le router pour l'utiliser dans server.js
module.exports = router;