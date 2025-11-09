// Importer Prisma
const prisma = require('../config/prisma');

// FONCTION POUR RÉCUPÉRER TOUTES LES ADRESSES D'UN UTILISATEUR
const getUserAddresses = async (req, res) => {
  try {
    const { userId } = req.params;

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' } // Adresse par défaut en premier
    });

    res.json({
      success: true,
      addresses
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des adresses:', error);
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

    // Si c'est une adresse par défaut, retirer le défaut des autres
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false }
      });
    }

    // Créer la nouvelle adresse
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
    console.error('Erreur lors de la création de l\'adresse:', error);
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

    // Récupérer l'adresse pour avoir le userId
    const existingAddress = await prisma.address.findUnique({
      where: { id: addressId }
    });

    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        message: 'Adresse non trouvée'
      });
    }

    // Si c'est une adresse par défaut, retirer le défaut des autres
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
    console.error('Erreur lors de la mise à jour de l\'adresse:', error);
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

    await prisma.address.delete({
      where: { id: addressId }
    });

    res.json({
      success: true,
      message: 'Adresse supprimée'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'adresse:', error);
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

    // Récupérer l'adresse pour avoir le userId
    const address = await prisma.address.findUnique({
      where: { id: addressId }
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Adresse non trouvée'
      });
    }

    // Retirer le défaut de toutes les adresses de l'utilisateur
    await prisma.address.updateMany({
      where: { userId: address.userId },
      data: { isDefault: false }
    });

    // Définir cette adresse comme défaut
    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true }
    });

    res.json({
      success: true,
      address: updatedAddress
    });

  } catch (error) {
    console.error('Erreur lors de la définition de l\'adresse par défaut:', error);
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