// Importer Express Router
const express = require('express');
const router = express.Router();

// Importer les middlewares d'authentification
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

// Importer les fonctions du contrôleur
const { 
  getAllProducts, 
  getProductsByCategory, 
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// ROUTES PUBLIQUES (accessibles à tous)

// ROUTE POUR RÉCUPÉRER TOUS LES PRODUITS
// GET /api/products
// Paramètres optionnels: ?page=1&limit=50
router.get('/', getAllProducts);

// ROUTE POUR RÉCUPÉRER LES PRODUITS D'UNE CATÉGORIE
// GET /api/products/category/:categorySlug
// Exemple: /api/products/category/pochettes-unisexe
router.get('/category/:categorySlug', getProductsByCategory);

// ROUTE POUR RÉCUPÉRER UN PRODUIT PAR SON SLUG
// GET /api/products/:slug
// Exemple: /api/products/pochette-wax-orange
router.get('/:slug', getProductBySlug);

// ROUTES PROTÉGÉES (réservées aux administrateurs)

// ROUTE POUR CRÉER UN NOUVEAU PRODUIT
// POST /api/products
// Nécessite: authentification + rôle ADMIN
// Body: { name, slug, description, price, categoryId, stock, isActive }
router.post('/', authenticateToken, isAdmin, createProduct);

// ROUTE POUR METTRE À JOUR UN PRODUIT
// PUT /api/products/:id
// Nécessite: authentification + rôle ADMIN
// Body: { name, slug, description, price, categoryId, stock, isActive }
router.put('/:id', authenticateToken, isAdmin, updateProduct);

// ROUTE POUR SUPPRIMER UN PRODUIT
// DELETE /api/products/:id
// Nécessite: authentification + rôle ADMIN
router.delete('/:id', authenticateToken, isAdmin, deleteProduct);

// Exporter le router
module.exports = router;