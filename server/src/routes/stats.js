// Importer Express Router
const express = require('express');
const router = express.Router();

// Importer les middlewares d'authentification
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

// Importer les fonctions du contrôleur
const { 
  getStats,
  getSalesByMonth,
  getTopProducts
} = require('../controllers/statsController');

// ROUTE POUR RÉCUPÉRER LES STATISTIQUES GLOBALES
// GET /api/stats
router.get('/', authenticateToken, isAdmin, getStats);

// ROUTE POUR RÉCUPÉRER LES VENTES PAR MOIS
// GET /api/stats/sales-by-month
router.get('/sales-by-month', authenticateToken, isAdmin, getSalesByMonth);
// ROUTE POUR RÉCUPÉRER LES PRODUITS LES PLUS VENDUS
// GET /api/stats/top-products
router.get('/top-products', authenticateToken, isAdmin, getTopProducts);

// Exporter le router
module.exports = router;