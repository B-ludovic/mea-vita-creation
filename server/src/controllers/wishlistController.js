// Importer Prisma
const prisma = require('../config/prisma');

// FONCTION POUR AJOUTER UN PRODUIT À LA WISHLIST
const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.userId; // Récupérer depuis le JWT (toujours présent grâce à authenticateToken)
    const { productId } = req.body;

    // Vérifier que le productId est présent
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'ID du produit manquant'
      });
    }

    // Vérifier si le produit existe
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    // Vérifier si le produit est déjà dans la wishlist
    const existingItem = await prisma.wishlistItem.findFirst({
      where: {
        userId,
        productId
      }
    });

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: 'Produit déjà dans la wishlist'
      });
    }

    // Ajouter à la wishlist
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        userId,
        productId
      },
      include: {
        Product: {
          include: {
            ProductImage: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      wishlistItem
    });

  } catch (error) {
    console.error('Erreur lors de l\'ajout à la wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// FONCTION POUR RETIRER UN PRODUIT DE LA WISHLIST
const removeFromWishlist = async (req, res) => {
  try {
    const { wishlistItemId } = req.params;
    const userId = req.user.userId; // Sécurité : récupérer depuis JWT

    // Vérifier que l'item existe et appartient à l'utilisateur
    const item = await prisma.wishlistItem.findFirst({
      where: { 
        id: wishlistItemId,
        userId // Empêche de supprimer la wishlist d'un autre utilisateur
      }
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé dans votre wishlist'
      });
    }

    await prisma.wishlistItem.delete({
      where: { id: wishlistItemId }
    });

    res.json({
      success: true,
      message: 'Produit retiré de la wishlist'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// FONCTION POUR RETIRER PAR userId ET productId
const removeByUserAndProduct = async (req, res) => {
  try {
    const userId = req.user.userId; // Récupérer depuis JWT
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'ID du produit manquant'
      });
    }

    const wishlistItem = await prisma.wishlistItem.findFirst({
      where: {
        userId,
        productId
      }
    });

    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé dans la wishlist'
      });
    }

    await prisma.wishlistItem.delete({
      where: { id: wishlistItem.id }
    });

    res.json({
      success: true,
      message: 'Produit retiré de la wishlist'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// FONCTION POUR RÉCUPÉRER LA WISHLIST D'UN UTILISATEUR
const getUserWishlist = async (req, res) => {
  try {
    const userId = req.user.userId; // Récupérer depuis JWT au lieu des params

    const wishlist = await prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        Product: {
          include: {
            ProductImage: true,
            Category: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      wishlist
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de la wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// FONCTION POUR VÉRIFIER SI UN PRODUIT EST DANS LA WISHLIST
const checkInWishlist = async (req, res) => {
  try {
    const userId = req.user.userId; // Récupérer depuis JWT
    const { productId } = req.query;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'ID du produit manquant'
      });
    }

    const item = await prisma.wishlistItem.findFirst({
      where: {
        userId,
        productId
      }
    });

    res.json({
      success: true,
      inWishlist: !!item,
      wishlistItemId: item?.id
    });

  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Exporter les fonctions
module.exports = {
  addToWishlist,
  removeFromWishlist,
  removeByUserAndProduct,
  getUserWishlist,
  checkInWishlist
};