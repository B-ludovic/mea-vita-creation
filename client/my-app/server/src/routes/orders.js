// Importer Express Router
const express = require('express');
const router = express.Router();

// Importer les fonctions du contrôleur
const { 
  createOrder, 
  getUserOrders, 
  getOrderById,
  updateOrderStatus 
} = require('../controllers/orderController');

// ROUTE POUR CRÉER UNE COMMANDE
// POST /api/orders
router.post('/', createOrder);

// ROUTE POUR RÉCUPÉRER LES COMMANDES D'UN UTILISATEUR
// GET /api/orders/user/:userId
router.get('/user/:userId', getUserOrders);

// ROUTE POUR RÉCUPÉRER UNE COMMANDE PAR SON ID
// GET /api/orders/:orderId
router.get('/:orderId', getOrderById);

// ROUTE POUR METTRE À JOUR LE STATUT D'UNE COMMANDE
// PUT /api/orders/:orderId/status
router.put('/:orderId/status', updateOrderStatus);

// Exporter le router
module.exports = router;