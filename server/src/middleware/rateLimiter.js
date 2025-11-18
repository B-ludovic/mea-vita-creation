// Middleware pour limiter les tentatives de connexion (anti brute-force)
const rateLimit = require('express-rate-limit');

// Désactiver le rate limiting en développement
const isDevelopment = process.env.NODE_ENV !== 'production';

// Limiteur pour les tentatives de CONNEXION
// Permet maximum 5 tentatives par 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes en millisecondes
  max: isDevelopment ? 10000 : 5, // Illimité en dev, 5 en prod
  message: {
    success: false,
    message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.'
  },
  // Bloquer uniquement par IP (adresse de l'utilisateur)
  standardHeaders: true, // Renvoie les infos de limite dans les headers
  legacyHeaders: false, // Désactive les anciens headers
  skip: () => isDevelopment, // Skip complètement en dev
});

// Limiteur pour les tentatives d'INSCRIPTION
// Plus permissif : 10 tentatives par heure
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure en millisecondes
  max: isDevelopment ? 10000 : 10, // Illimité en dev, 10 en prod
  message: {
    success: false,
    message: 'Trop de tentatives d\'inscription. Réessayez dans 1 heure.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDevelopment,
});

// Limiteur GÉNÉRAL pour toutes les routes API
// Empêche le spam : 100 requêtes par 15 minutes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 10000 : 100, // Illimité en dev, 100 en prod
  message: {
    success: false,
    message: 'Trop de requêtes. Veuillez ralentir.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDevelopment,
});

// Limiteur pour FORGOT PASSWORD (demande de réinitialisation)
// Protège contre le spam d'emails : 3 tentatives par 15 minutes
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 10000 : 3, // Illimité en dev, 3 en prod
  message: {
    success: false,
    message: 'Trop de demandes de réinitialisation. Réessayez dans 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDevelopment,
});

// Limiteur pour RESET PASSWORD (réinitialisation avec token)
// Protège contre le brute-force de tokens : 5 tentatives par 15 minutes
const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 10000 : 5, // Illimité en dev, 5 en prod
  message: {
    success: false,
    message: 'Trop de tentatives de réinitialisation. Réessayez dans 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDevelopment,
});

// Exporter les limiteurs
module.exports = {
  loginLimiter,
  registerLimiter,
  apiLimiter,
  forgotPasswordLimiter,
  resetPasswordLimiter
};
