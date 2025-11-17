// Importer Prisma
const prisma = require('../config/prisma');
// Importer Pusher pour les notifications en temps réel
const { notifyNewReview } = require('../services/pusherService');

// FONCTION POUR CRÉER UN AVIS
const createReview = async (req, res) => {
  try {
    const { productId, userId, rating, comment } = req.body;

    // Vérifier que les champs obligatoires sont présents
    if (!productId || !userId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Champs obligatoires manquants'
      });
    }

    // Vérifier que la note est entre 1 et 5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'La note doit être entre 1 et 5'
      });
    }

    // Vérifier que l'utilisateur a bien acheté ce produit
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        Order: {
          userId,
          status: 'PAID' 
        }
      }
    });

    if (!hasPurchased) {
      return res.status(403).json({
        success: false,
        message: 'Vous devez avoir acheté ce produit pour laisser un avis'
      });
    }

    // Créer l'avis
    const review = await prisma.review.create({
  data: {
    productId,
    userId,
    rating: parseInt(rating),
    comment,
    isApproved: false // En attente de modération
  },
  include: {
    Product: true,  // Ajoute Product
    User: {
      select: {
        firstName: true,
        lastName: true
      }
    }
  }
});

    // Notifier l'admin via Pusher
    await notifyNewReview(review);

    res.status(201).json({
      success: true,
      review
    });

  } catch (error) {
    // Erreur si l'utilisateur a déjà laissé un avis
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: 'Vous avez déjà laissé un avis pour ce produit'
      });
    }

    console.error('Erreur lors de la création de l\'avis:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// FONCTION POUR RÉCUPÉRER LES AVIS D'UN PRODUIT
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    // Récupérer uniquement les avis approuvés
    const reviews = await prisma.review.findMany({
      where: {
        productId,
        isApproved: true
      },
      include: {
        User: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculer la note moyenne
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    res.json({
      success: true,
      reviews,
      averageRating: Math.round(averageRating * 10) / 10, // Arrondi à 1 décimale
      totalReviews: reviews.length
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des avis:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// FONCTION POUR RÉCUPÉRER TOUS LES AVIS (ADMIN)
const getAllReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        User: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        Product: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      reviews
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des avis:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// FONCTION POUR APPROUVER UN AVIS (ADMIN)
const approveReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await prisma.review.update({
      where: { id: reviewId },
      data: { isApproved: true }
    });

    res.json({
      success: true,
      review
    });

  } catch (error) {
    console.error('Erreur lors de l\'approbation de l\'avis:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// FONCTION POUR REJETER/SUPPRIMER UN AVIS (ADMIN)
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    await prisma.review.delete({
      where: { id: reviewId }
    });

    res.json({
      success: true,
      message: 'Avis supprimé'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'avis:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Exporter les fonctions
module.exports = {
  createReview,
  getProductReviews,
  getAllReviews,
  approveReview,
  deleteReview
};