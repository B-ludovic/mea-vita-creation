// Importer Express Router
const express = require('express');
const router = express.Router();

// Importer les fonctions du contrôleur
const { getAllCategories, getCategoryBySlug } = require('../controllers/categoryController');

// ROUTE POUR RÉCUPÉRER TOUTES LES CATÉGORIES
// GET /api/categories
router.get('/', getAllCategories);

// ROUTE POUR RÉCUPÉRER UNE CATÉGORIE PAR SON SLUG
// GET /api/categories/:slug
// Exemple: /api/categories/pochettes-unisexe
router.get('/:slug', getCategoryBySlug);

// Exporter le router
module.exports = router;