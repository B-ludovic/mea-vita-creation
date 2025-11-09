// Routes pour la gestion des utilisateurs
const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');

// Importer les middlewares d'authentification
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

// ROUTE POUR RÉCUPÉRER TOUS LES UTILISATEURS (ADMIN UNIQUEMENT)
// GET /api/users
router.get('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            Order: true
          }
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      users: users
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la récupération des utilisateurs' 
    });
  }
});

// ROUTE POUR CHANGER LE RÔLE D'UN UTILISATEUR (ADMIN UNIQUEMENT)
// PUT /api/users/:id/role
router.put('/:id/role', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validation du rôle
    if (!role || !['ADMIN', 'CLIENT'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Rôle invalide. Doit être ADMIN ou CLIENT'
      });
    }

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Si on retire le rôle ADMIN, vérifier qu'il reste au moins un autre admin
    if (user.role === 'ADMIN' && role === 'CLIENT') {
      const adminCount = await prisma.user.count({
        where: { role: 'ADMIN' }
      });

      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Impossible de retirer le rôle admin. Il doit toujours y avoir au moins un administrateur.'
        });
      }
    }

    // Mettre à jour le rôle
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true
      }
    });

    res.json({
      success: true,
      message: `Rôle modifié avec succès`,
      user: updatedUser
    });

  } catch (error) {
    console.error('Erreur lors de la modification du rôle:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// ROUTE POUR ACTIVER/DÉSACTIVER UN UTILISATEUR (ADMIN UNIQUEMENT)
// PUT /api/users/:id/toggle-active
router.put('/:id/toggle-active', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        isActive: !user.isActive,
        emailVerificationToken: null,
        emailVerificationExpires: null
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true
      }
    });

    res.json({
      success: true,
      message: `Utilisateur ${updatedUser.isActive ? 'activé' : 'désactivé'} avec succès`,
      user: updatedUser
    });

  } catch (error) {
    console.error('Erreur lors de la modification du statut:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// ROUTE POUR SUPPRIMER UN UTILISATEUR (ADMIN UNIQUEMENT)
// DELETE /api/users/:id
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // PROTECTION : Vérifier que ce n'est pas le dernier admin
    if (user.role === 'ADMIN') {
      const adminCount = await prisma.user.count({
        where: { role: 'ADMIN' }
      });

      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Impossible de supprimer le dernier administrateur. Il doit toujours y avoir au moins un admin.'
        });
      }
    }

    // Supprimer l'utilisateur
    await prisma.user.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Utilisateur supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

module.exports = router;
