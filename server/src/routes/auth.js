// Importer Express Router (pour créer des routes)
const express = require('express');
const router = express.Router();

// Importer les fonctions du contrôleur
const { 
  register, 
  login, 
  verifyEmail, 
  refreshAccessToken, 
  logout, 
  forgotPassword, 
  resetPassword 
} = require('../controllers/authController');

// Importer les limiteurs de tentatives (protection anti brute-force)
const { loginLimiter, registerLimiter, forgotPasswordLimiter, resetPasswordLimiter } = require('../middleware/rateLimiter');

// ROUTE D'INSCRIPTION
// POST /api/auth/register
// Le front-end envoie : { email, password, firstName, lastName }
// Limiteur : Maximum 10 tentatives par heure
router.post('/register', registerLimiter, register);

// ROUTE DE CONNEXION
// POST /api/auth/login
// Le front-end envoie : { email, password }
// Limiteur : Maximum 5 tentatives par 15 minutes (protection anti brute-force)
router.post('/login', loginLimiter, login);

// ROUTE DE VÉRIFICATION EMAIL
// GET /api/auth/verify-email/:token
router.get('/verify-email/:token', verifyEmail);

// ROUTE POUR RAFRAÎCHIR L'ACCESS TOKEN
// POST /api/auth/refresh
// Le front-end envoie : { refreshToken }
// Renvoie : { accessToken }
router.post('/refresh', refreshAccessToken);

// ROUTE DE DÉCONNEXION
// POST /api/auth/logout
// Le front-end envoie : { refreshToken }
// Supprime le refresh token de la BDD
router.post('/logout', logout);

// ROUTE POUR DEMANDER LA RÉINITIALISATION DU MOT DE PASSE
// POST /api/auth/forgot-password
// Limiteur : Maximum 3 tentatives par 15 minutes (protection spam emails)
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);

// ROUTE POUR RÉINITIALISER LE MOT DE PASSE
// POST /api/auth/reset-password
// Limiteur : Maximum 5 tentatives par 15 minutes (protection brute-force tokens)
router.post('/reset-password', resetPasswordLimiter, resetPassword);

// Exporter le router pour l'utiliser dans server.js
module.exports = router;