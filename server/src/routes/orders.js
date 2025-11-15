// Importer Express Router
const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');

// Importer les middlewares d'authentification
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

// Importer les utilitaires pour les transporteurs
const { getCarriersList } = require('../utils/carriers');

// Importer les fonctions du contrôleur
const { 
  createOrder, 
  getUserOrders, 
  getOrderById,
  updateOrderStatus, 
  updateTracking
} = require('../controllers/orderController');

// ROUTE POUR CRÉER UNE COMMANDE
// POST /api/orders
router.post('/', authenticateToken, createOrder);

// ROUTE POUR RÉCUPÉRER TOUTES LES COMMANDES (ADMIN UNIQUEMENT)
// GET /api/orders/user/all
// Cette route est protégée : seuls les administrateurs peuvent y accéder
// ATTENTION: Cette route doit être AVANT /user/:userId sinon "all" sera traité comme un userId
router.get('/user/all', authenticateToken, isAdmin, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        OrderItem: {
          include: {
            Product: {
              include: {
                ProductImage: true
              }
            }
          }
        },
        User: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        Address: true // Ajouter l'adresse de livraison
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      orders
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// ROUTE POUR RÉCUPÉRER LES COMMANDES DE L'UTILISATEUR CONNECTÉ
// GET /api/orders/user/me
router.get('/user/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        OrderItem: {
          include: {
            Product: {
              include: {
                ProductImage: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      orders
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// ROUTE POUR RÉCUPÉRER LES COMMANDES D'UN UTILISATEUR
// GET /api/orders/user/:userId
router.get('/user/:userId', getUserOrders);

// ROUTE POUR OBTENIR LA LISTE DES TRANSPORTEURS
// GET /api/orders/carriers/list
router.get('/carriers/list', (req, res) => {
  try {
    const carriersList = getCarriersList();
    res.json({
      success: true,
      carriers: carriersList
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des transporteurs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// ROUTE POUR RÉCUPÉRER UNE COMMANDE PAR SON ID
// GET /api/orders/:orderId
router.get('/:orderId', authenticateToken, getOrderById);

// ROUTE POUR METTRE À JOUR LE STATUT D'UNE COMMANDE (ADMIN UNIQUEMENT)
// PUT /api/orders/:orderId/status
router.put('/:orderId/status', authenticateToken, isAdmin, updateOrderStatus);

// ROUTE POUR METTRE À JOUR LES INFORMATIONS DE SUIVI D'UNE COMMANDE (ADMIN UNIQUEMENT)
// PUT /api/orders/:orderId/tracking
router.put('/:orderId/tracking', authenticateToken, isAdmin, updateTracking);

// Exporter le router
module.exports = router;