// Importer Express Router
const express = require('express');
const router = express.Router();

// Importer les fonctions du contrôleur
const { createCheckoutSession, verifyPayment } = require('../controllers/paymentController');

// ROUTE POUR CRÉER UNE SESSION DE PAIEMENT STRIPE
// POST /api/payment/create-checkout-session
router.post('/create-checkout-session', createCheckoutSession);

// ROUTE POUR VÉRIFIER LE STATUT D'UN PAIEMENT
// GET /api/payment/verify/:sessionId
router.get('/verify/:sessionId', verifyPayment);

// Exporter le router
module.exports = router;