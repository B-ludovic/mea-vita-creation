// Importer Express Router
const express = require('express');
const router = express.Router();

// Importer les fonctions du contrôleur
const { 
  getAllProducts, 
  getProductsByCategory, 
  getProductBySlug 
} = require('../controllers/productController');

// ROUTE POUR RÉCUPÉRER TOUS LES PRODUITS
// GET /api/products
router.get('/', getAllProducts);

// ROUTE POUR RÉCUPÉRER LES PRODUITS D'UNE CATÉGORIE
// GET /api/products/category/:categorySlug
// Exemple: /api/products/category/pochettes-unisexe
router.get('/category/:categorySlug', getProductsByCategory);

// ROUTE POUR RÉCUPÉRER UN PRODUIT PAR SON SLUG
// GET /api/products/:slug
// Exemple: /api/products/pochette-wax-orange
router.get('/:slug', getProductBySlug);

// Exporter le router
module.exports = router;
