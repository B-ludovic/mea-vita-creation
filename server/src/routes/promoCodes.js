// Routes pour les codes promo
const express = require('express');
// Importer les middlewares d'authentification
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();
const {
  validatePromoCode,
  createPromoCode,
  getAllPromoCodes,
  updatePromoCode,
  deletePromoCode
} = require('../controllers/promoCodeController');

// ROUTES PUBLIQUES
// POST /api/promo-codes/validate - Valider un code promo
router.post('/validate', validatePromoCode);

// ROUTES ADMIN (à sécuriser avec un middleware d'authentification admin)
// POST /api/promo-codes - Créer un code promo
router.post('/', authenticateToken, isAdmin, createPromoCode);

// GET /api/promo-codes - Récupérer tous les codes promo
router.get('/', authenticateToken, isAdmin, getAllPromoCodes);

// PUT /api/promo-codes/:promoCodeId - Mettre à jour un code promo
router.put('/:promoCodeId', authenticateToken, isAdmin, updatePromoCode);

// DELETE /api/promo-codes/:promoCodeId - Supprimer un code promo
router.delete('/:promoCodeId', authenticateToken, isAdmin, deletePromoCode);

module.exports = router;