// Importer Express Router
const express = require('express');
const router = express.Router();

// Importer les middlewares d'authentification
const { authenticateToken } = require('../middleware/authMiddleware');

// Importer les fonctions du contrôleur
const { 
  addToWishlist,
  removeFromWishlist,
  removeByUserAndProduct,
  getUserWishlist,
  checkInWishlist
} = require('../controllers/wishlistController');

// ROUTE POUR AJOUTER UN PRODUIT À LA WISHLIST
// POST /api/wishlist
router.post('/', authenticateToken, addToWishlist);

// ROUTE POUR RETIRER UN PRODUIT PAR ID
// DELETE /api/wishlist/:wishlistItemId
router.delete('/:wishlistItemId', authenticateToken, removeFromWishlist);
// ROUTE POUR RETIRER UN PRODUIT PAR userId ET productId
// POST /api/wishlist/remove
router.post('/remove', authenticateToken, removeByUserAndProduct);

// ROUTE POUR RÉCUPÉRER LA WISHLIST D'UN UTILISATEUR
// GET /api/wishlist/user/:userId
router.get('/user/:userId', authenticateToken, getUserWishlist);
// ROUTE POUR VÉRIFIER SI UN PRODUIT EST DANS LA WISHLIST
// GET /api/wishlist/check?userId=xxx&productId=xxx
router.get('/check', authenticateToken, checkInWishlist);

// Exporter le router
module.exports = router;