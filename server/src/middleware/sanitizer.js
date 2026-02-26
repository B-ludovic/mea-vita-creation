// Middleware de sanitization (nettoyage des données)
// Protège contre les injections XSS et NoSQL

// Champs sensibles à ne jamais modifier (mots de passe, tokens...)
// L'encodage HTML corromprait ces valeurs avant le hachage ou la comparaison
const SENSITIVE_KEYS = new Set([
  'password',
  'currentPassword',
  'newPassword',
  'token',
  'refreshToken',
  'resetPasswordToken',
  'emailVerificationToken'
]);

// Fonction pour nettoyer une chaîne de caractères
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;

  // Encoder les caractères HTML dangereux
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
};

// Fonction pour nettoyer un objet récursivement
const sanitizeObject = (obj) => {
  if (obj === null || obj === undefined) return obj;

  // Si c'est une chaîne, la nettoyer
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }

  // Si c'est un tableau, nettoyer chaque élément
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  // Si c'est un objet, nettoyer chaque propriété
  if (typeof obj === 'object') {
    const sanitized = {};
    for (const key in obj) {
      // Ne jamais modifier les champs sensibles (mot de passe, tokens)
      if (SENSITIVE_KEYS.has(key)) {
        sanitized[key] = obj[key];
      } else {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }

  // Sinon retourner tel quel (nombres, booleans, etc.)
  return obj;
};

// Middleware Express pour sanitizer automatiquement toutes les requêtes
const sanitizeInputs = (req, res, next) => {
  // Nettoyer le body (données POST)
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  // Nettoyer les paramètres d'URL (ex: /api/users/:id)
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }
  
  // Nettoyer les query strings (ex: ?search=test)
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  
  next(); // Passer à la suite
};

module.exports = {
  sanitizeInputs,
  sanitizeString,
  sanitizeObject
};
