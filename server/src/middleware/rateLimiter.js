// Middleware pour limiter les tentatives de connexion (anti brute-force)
const rateLimit = require('express-rate-limit');

// Limiteur pour les tentatives de CONNEXION
// Permet maximum 5 tentatives par 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes en millisecondes
  max: 5, // Maximum 5 tentatives
  message: {
    success: false,
    message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.'
  },
  // Bloquer uniquement par IP (adresse de l'utilisateur)
  standardHeaders: true, // Renvoie les infos de limite dans les headers
  legacyHeaders: false, // Désactive les anciens headers
});

// Limiteur pour les tentatives d'INSCRIPTION
// Plus permissif : 10 tentatives par heure
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure en millisecondes
  max: 10, // Maximum 10 tentatives
  message: {
    success: false,
    message: 'Trop de tentatives d\'inscription. Réessayez dans 1 heure.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiteur GÉNÉRAL pour toutes les routes API
// Empêche le spam : 100 requêtes par 15 minutes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Maximum 100 requêtes
  message: {
    success: false,
    message: 'Trop de requêtes. Veuillez ralentir.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Exporter les limiteurs
module.exports = {
  loginLimiter,
  registerLimiter,
  apiLimiter
};
