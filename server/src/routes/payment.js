// Importer Express Router
const express = require('express');
const router = express.Router();

// Importer les fonctions du contrôleur
const { createCheckoutSession, verifyPayment, handleStripeWebhook } = require('../controllers/paymentController');

// ROUTE POUR CRÉER UNE SESSION DE PAIEMENT STRIPE
// POST /api/payment/create-checkout-session
router.post('/create-checkout-session', createCheckoutSession);

// ROUTE POUR VÉRIFIER LE STATUT D'UN PAIEMENT
// GET /api/payment/verify/:sessionId
router.get('/verify/:sessionId', verifyPayment);

// ROUTE WEBHOOK STRIPE
// POST /api/payment/webhook
// Cette route reçoit les notifications de Stripe
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Exporter le router
module.exports = router;