// Importer Express Router
const express = require('express');
const router = express.Router();

// Importer les fonctions du contrôleur
const { 
  getAllCategories, 
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

// Importer les middlewares d'authentification
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');


// ROUTES PUBLIQUES (accessible à tous)


// ROUTE POUR RÉCUPÉRER TOUTES LES CATÉGORIES
// GET /api/categories
router.get('/', getAllCategories);

// ROUTE POUR RÉCUPÉRER UNE CATÉGORIE PAR SON SLUG
// GET /api/categories/:slug
// Exemple: /api/categories/pochettes-unisexe
router.get('/:slug', getCategoryBySlug);

// ROUTES ADMIN (protégées, admin seulement)


// ROUTE POUR CRÉER UNE NOUVELLE CATÉGORIE (ADMIN)
// POST /api/categories
// Corps de la requête: { name, slug, description, order }
router.post('/', authenticateToken, isAdmin, createCategory);

// ROUTE POUR MODIFIER UNE CATÉGORIE (ADMIN)
// PUT /api/categories/:id
// Corps de la requête: { name, slug, description, order, isActive }
router.put('/:id', authenticateToken, isAdmin, updateCategory);

// ROUTE POUR SUPPRIMER UNE CATÉGORIE (ADMIN)
// DELETE /api/categories/:id
// (En réalité, on désactive juste la catégorie)
router.delete('/:id', authenticateToken, isAdmin, deleteCategory);

// Exporter le router
module.exports = router;