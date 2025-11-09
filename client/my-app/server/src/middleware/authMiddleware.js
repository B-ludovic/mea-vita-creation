// Importer jsonwebtoken pour vérifier les tokens
const jwt = require('jsonwebtoken');

// MIDDLEWARE DE VÉRIFICATION D'AUTHENTIFICATION
// Cette fonction vérifie si l'utilisateur est connecté (a un token valide)
const authenticateToken = (req, res, next) => {
  try {
    // 1. Récupérer le token depuis l'en-tête Authorization
    // Format attendu : "Bearer ton_token_ici"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extraire le token après "Bearer "

    // 2. Si pas de token, l'utilisateur n'est pas connecté
    if (!token) {
      return res.status(401).json({ 
        message: 'Accès refusé. Vous devez être connecté.' 
      });
    }

    // 3. Vérifier que le token est valide
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ 
          message: 'Token invalide ou expiré' 
        });
      }

      // 4. Si le token est valide, ajouter les infos de l'utilisateur à la requête
      // Maintenant on peut accéder à req.user dans les routes protégées
      req.user = user;
      
      // 5. Passer à la fonction suivante (la route demandée)
      next();
    });

  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de l\'authentification' 
    });
  }
};

// Exporter le middleware
module.exports = { authenticateToken };