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

// ROUTE POUR VÉRIFIER SI UN PRODUIT EST DANS LA WISHLIST (doit être AVANT '/')
// GET /api/wishlist/check?productId=xxx
router.get('/check', authenticateToken, checkInWishlist);

// ROUTE POUR RÉCUPÉRER LA WISHLIST DE L'UTILISATEUR CONNECTÉ
// GET /api/wishlist
router.get('/', authenticateToken, getUserWishlist);

// ROUTE POUR AJOUTER UN PRODUIT À LA WISHLIST
// POST /api/wishlist
router.post('/', authenticateToken, addToWishlist);

// ROUTE POUR RETIRER UN PRODUIT PAR ID
// DELETE /api/wishlist/:wishlistItemId
router.delete('/:wishlistItemId', authenticateToken, removeFromWishlist);

// Exporter le router
module.exports = router;