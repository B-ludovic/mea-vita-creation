// Routes pour les messages de contact
const express = require('express');
const router = express.Router();

const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

const {
  sendContactMessage,
  getAllContactMessages,
  markAsRead,
  deleteContactMessage
} = require('../controllers/contactController');

// ROUTE PUBLIQUE
// POST /api/contact - Envoyer un message de contact
router.post('/', sendContactMessage);

// ROUTES ADMIN (protégées)
// GET /api/contact - Récupérer tous les messages
router.get('/', authenticateToken, isAdmin, getAllContactMessages);

// PUT /api/contact/:messageId/read - Marquer comme lu
router.put('/:messageId/read', authenticateToken, isAdmin, markAsRead);

// DELETE /api/contact/:messageId - Supprimer un message
router.delete('/:messageId', authenticateToken, isAdmin, deleteContactMessage);

module.exports = router;