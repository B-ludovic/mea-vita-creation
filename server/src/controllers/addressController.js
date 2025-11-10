// Importer Prisma
const prisma = require('../config/prisma');

// FONCTION POUR RÉCUPÉRER TOUTES LES ADRESSES D'UN UTILISATEUR
const getUserAddresses = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.userId !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé'
      });
    }

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' }
    });

    res.json({
      success: true,
      addresses
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des adresses:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des adresses'
    });
  }
};

// FONCTION POUR CRÉER UNE ADRESSE
const createAddress = async (req, res) => {
  try {
    const { userId, firstName, lastName, street, city, postalCode, country, phone, isDefault } = req.body;

    if (req.user.userId !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé'
      });
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false }
      });
    }

    const address = await prisma.address.create({
      data: {
        userId,
        firstName,
        lastName,
        street,
        city,
        postalCode,
        country: country || 'France',
        phone,
        isDefault: isDefault || false
      }
    });

    res.status(201).json({
      success: true,
      address
    });

  } catch (error) {
    console.error('Erreur lors de la création de l\'adresse:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'adresse'
    });
  }
};

// FONCTION POUR METTRE À JOUR UNE ADRESSE
const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { firstName, lastName, street, city, postalCode, country, phone, isDefault } = req.body;

    const existingAddress = await prisma.address.findUnique({
      where: { id: addressId }
    });

    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        message: 'Adresse non trouvée'
      });
    }

    if (req.user.userId !== existingAddress.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé'
      });
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { 
          userId: existingAddress.userId,
          id: { not: addressId }
        },
        data: { isDefault: false }
      });
    }

    // Mettre à jour l'adresse
    const address = await prisma.address.update({
      where: { id: addressId },
      data: {
        firstName,
        lastName,
        street,
        city,
        postalCode,
        country,
        phone,
        isDefault
      }
    });

    res.json({
      success: true,
      address
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'adresse:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'adresse'
    });
  }
};

// FONCTION POUR SUPPRIMER UNE ADRESSE
const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const existingAddress = await prisma.address.findUnique({
      where: { id: addressId }
    });

    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        message: 'Adresse non trouvée'
      });
    }

    if (req.user.userId !== existingAddress.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé'
      });
    }

    await prisma.address.delete({
      where: { id: addressId }
    });

    res.json({
      success: true,
      message: 'Adresse supprimée'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'adresse:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'adresse'
    });
  }
};

// FONCTION POUR DÉFINIR UNE ADRESSE PAR DÉFAUT
const setDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const address = await prisma.address.findUnique({
      where: { id: addressId }
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Adresse non trouvée'
      });
    }

    if (req.user.userId !== address.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé'
      });
    }

    await prisma.address.updateMany({
      where: { userId: address.userId },
      data: { isDefault: false }
    });

    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true }
    });

    res.json({
      success: true,
      address: updatedAddress
    });

  } catch (error) {
    console.error('Erreur lors de la définition de l\'adresse par défaut:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la définition de l\'adresse par défaut'
    });
  }
};

// Exporter les fonctions
module.exports = {
  getUserAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
};