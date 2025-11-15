// Routes pour les factures
const express = require('express');
const router = express.Router();
const path = require('path');
const prisma = require('../config/prisma');
const { generateInvoice } = require('../services/invoiceService');
const { authenticateToken } = require('../middleware/authMiddleware');

// ROUTE POUR GÉNÉRER ET TÉLÉCHARGER UNE FACTURE
// GET /api/invoices/:orderId
router.get('/:orderId', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.userId;
    const isAdmin = req.user.role === 'ADMIN';

    // Récupérer la commande avec tous les détails
    const order = await prisma.order.findUnique({
      where: { id: orderId },
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
        User: true,
        Address: true
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }

    // Vérifier que l'utilisateur est le propriétaire de la commande ou admin
    if (order.userId !== userId && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé'
      });
    }

    // Générer la facture PDF
    const invoicePath = await generateInvoice(order, order.User);

    // Envoyer le fichier en téléchargement
    res.download(invoicePath, `facture-${order.orderNumber || `CMD-${order.id}`}.pdf`, (err) => {
      if (err) {
        console.error('Erreur lors du téléchargement:', err);
        res.status(500).json({
          success: false,
          message: 'Erreur lors du téléchargement de la facture'
        });
      }
    });

  } catch (error) {
    console.error('Erreur lors de la génération de la facture:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// ROUTE POUR VÉRIFIER SI UNE FACTURE EXISTE
// GET /api/invoices/:orderId/exists
router.get('/:orderId/exists', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.userId;
    const isAdmin = req.user.role === 'ADMIN';

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        exists: false
      });
    }

    // Vérifier que l'utilisateur est le propriétaire ou admin
    if (order.userId !== userId && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé'
      });
    }

    const invoiceFilename = `facture-${order.orderNumber || `CMD-${order.id}`}.pdf`;
    const invoicePath = path.join(__dirname, '../../invoices', invoiceFilename);
    const fs = require('fs');
    const exists = fs.existsSync(invoicePath);

    res.json({
      success: true,
      exists
    });

  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

module.exports = router;