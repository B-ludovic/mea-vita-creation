// Contrôleur pour la gestion des codes promo
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// FONCTION POUR VALIDER UN CODE PROMO (CLIENT)
const validatePromoCode = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Code promo requis'
      });
    }

    // Rechercher le code promo
    const promoCode = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!promoCode) {
      return res.status(404).json({
        success: false,
        message: 'Code promo invalide'
      });
    }

    // Vérifier si le code est actif
    if (!promoCode.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Ce code promo n\'est plus actif'
      });
    }

    // Vérifier les dates
    const now = new Date();
    if (new Date(promoCode.startDate) > now) {
      return res.status(400).json({
        success: false,
        message: 'Ce code promo n\'est pas encore valide'
      });
    }

    if (new Date(promoCode.endDate) < now) {
      return res.status(400).json({
        success: false,
        message: 'Ce code promo a expiré'
      });
    }

    // Vérifier le nombre d'utilisations
    if (promoCode.maxUses && promoCode.currentUses >= promoCode.maxUses) {
      return res.status(400).json({
        success: false,
        message: 'Ce code promo a atteint sa limite d\'utilisation'
      });
    }

    // Vérifier le montant minimum de commande
    if (promoCode.minOrderAmount && orderAmount < promoCode.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Montant minimum de ${promoCode.minOrderAmount}€ requis pour ce code promo`
      });
    }

    // Calculer la réduction
    let discountAmount = 0;
    if (promoCode.discountType === 'PERCENTAGE') {
      discountAmount = (orderAmount * promoCode.discountValue) / 100;
    } else if (promoCode.discountType === 'FIXED_AMOUNT') {
      discountAmount = promoCode.discountValue;
    }

    // Ne pas dépasser le montant de la commande
    if (discountAmount > orderAmount) {
      discountAmount = orderAmount;
    }

    // Code valide !
    res.json({
      success: true,
      promoCode: {
        id: promoCode.id,
        code: promoCode.code,
        description: promoCode.description,
        discountType: promoCode.discountType,
        discountValue: promoCode.discountValue,
        discountAmount: parseFloat(discountAmount.toFixed(2))
      },
      message: `Code promo appliqué : -${discountAmount.toFixed(2)}€ !`
    });

  } catch (error) {
    console.error('Erreur lors de la validation du code promo:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// FONCTION POUR CRÉER UN CODE PROMO (ADMIN)
const createPromoCode = async (req, res) => {
  try {
    const { 
      code, 
      description, 
      discountType, 
      discountValue, 
      minOrderAmount,
      maxUses,
      startDate,
      endDate
    } = req.body;

    // Validation
    if (!code || !discountType || !discountValue || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs obligatoires doivent être remplis'
      });
    }

    if (!['PERCENTAGE', 'FIXED_AMOUNT'].includes(discountType)) {
      return res.status(400).json({
        success: false,
        message: 'Type invalide (PERCENTAGE ou FIXED_AMOUNT)'
      });
    }

    if (discountType === 'PERCENTAGE' && (discountValue < 0 || discountValue > 100)) {
      return res.status(400).json({
        success: false,
        message: 'Le pourcentage doit être entre 0 et 100'
      });
    }

    // Créer le code promo
    const promoCode = await prisma.promoCode.create({
      data: {
        code: code.toUpperCase(),
        description,
        discountType,
        discountValue: parseFloat(discountValue),
        minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : null,
        maxUses: maxUses ? parseInt(maxUses) : null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive: true
      }
    });

    res.json({
      success: true,
      promoCode,
      message: 'Code promo créé avec succès'
    });

  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: 'Ce code promo existe déjà'
      });
    }

    console.error('Erreur lors de la création du code promo:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// FONCTION POUR RÉCUPÉRER TOUS LES CODES PROMO (ADMIN)
const getAllPromoCodes = async (req, res) => {
  try {
    const promoCodes = await prisma.promoCode.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      promoCodes
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des codes promo:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// FONCTION POUR METTRE À JOUR UN CODE PROMO (ADMIN)
const updatePromoCode = async (req, res) => {
  try {
    const { promoCodeId } = req.params;
    const { isActive, maxUses, endDate, description } = req.body;

    const updateData = {};
    if (isActive !== undefined) updateData.isActive = isActive;
    if (maxUses !== undefined) updateData.maxUses = parseInt(maxUses);
    if (endDate) updateData.endDate = new Date(endDate);
    if (description !== undefined) updateData.description = description;

    const promoCode = await prisma.promoCode.update({
      where: { id: promoCodeId },
      data: updateData
    });

    res.json({
      success: true,
      promoCode,
      message: 'Code promo mis à jour'
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du code promo:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// FONCTION POUR SUPPRIMER UN CODE PROMO (ADMIN)
const deletePromoCode = async (req, res) => {
  try {
    const { promoCodeId } = req.params;

    await prisma.promoCode.delete({
      where: { id: promoCodeId }
    });

    res.json({
      success: true,
      message: 'Code promo supprimé'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression du code promo:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// FONCTION POUR INCRÉMENTER L'UTILISATION D'UN CODE PROMO
const incrementPromoCodeUsage = async (promoCodeId) => {
  try {
    await prisma.promoCode.update({
      where: { id: promoCodeId },
      data: {
        currentUses: { increment: 1 }
      }
    });
    console.log(`✅ Utilisation du code promo ${promoCodeId} incrémentée`);
  } catch (error) {
    console.error('Erreur lors de l\'incrémentation du code promo:', error);
  }
};

module.exports = {
  validatePromoCode,
  createPromoCode,
  getAllPromoCodes,
  updatePromoCode,
  deletePromoCode,
  incrementPromoCodeUsage
};