// Importer Express Router
const express = require('express');
const router = express.Router();

// Importer les middlewares d'authentification
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

// Importer les fonctions du contrôleur
const { 
  createReview,
  getProductReviews,
  getAllReviews,
  approveReview,
  deleteReview
} = require('../controllers/reviewController');

// ROUTE POUR CRÉER UN AVIS
// POST /api/reviews
router.post('/', authenticateToken, createReview);

// ROUTE POUR RÉCUPÉRER LES AVIS D'UN PRODUIT
// GET /api/reviews/product/:productId
router.get('/product/:productId', getProductReviews);

// ROUTE POUR RÉCUPÉRER TOUS LES AVIS (ADMIN)
// GET /api/reviews
router.get('/', authenticateToken, isAdmin, getAllReviews);

// ROUTE POUR APPROUVER UN AVIS (ADMIN)
// PUT /api/reviews/:reviewId/approve
router.put('/:reviewId/approve', authenticateToken, isAdmin, approveReview);

// ROUTE POUR SUPPRIMER UN AVIS (ADMIN)
// DELETE /api/reviews/:reviewId
router.delete('/:reviewId', authenticateToken, isAdmin, deleteReview);

// Exporter le router
module.exports = router;