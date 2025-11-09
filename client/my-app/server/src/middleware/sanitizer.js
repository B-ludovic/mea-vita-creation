// Middleware de sanitization (nettoyage des données) - Version dev junior
// Protège contre les injections XSS et NoSQL

// Fonction pour nettoyer une chaîne de caractères
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  
  // Supprimer les balises HTML dangereuses
  return str
    .replace(/</g, '&lt;')   // Remplacer < par &lt;
    .replace(/>/g, '&gt;')   // Remplacer > par &gt;
    .replace(/"/g, '&quot;') // Remplacer " par &quot;
    .replace(/'/g, '&#x27;') // Remplacer ' par &#x27;
    .replace(/\//g, '&#x2F;') // Remplacer / par &#x2F;
    .trim(); // Enlever les espaces au début et à la fin
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
      // Nettoyer aussi les clés (protection contre NoSQL injection)
      const cleanKey = sanitizeString(key);
      sanitized[cleanKey] = sanitizeObject(obj[key]);
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
