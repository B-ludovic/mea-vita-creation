// Importer Prisma
const prisma = require('../config/prisma');

// FONCTION POUR RÉCUPÉRER TOUS LES PRODUITS
const getAllProducts = async (req, res) => {
  try {
    // Récupérer tous les produits actifs avec leurs catégories
    const products = await prisma.product.findMany({
      where: {
        isActive: true
      },
      include: {
        Category: true  // Inclure les infos de la catégorie
      },
      orderBy: {
        createdAt: 'desc'  // Les plus récents en premier
      }
    });

    res.json({
      success: true,
      products
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur lors de la récupération des produits' 
    });
  }
};

// FONCTION POUR RÉCUPÉRER LES PRODUITS D'UNE CATÉGORIE
const getProductsByCategory = async (req, res) => {
  try {
    // Récupérer le slug de la catégorie depuis l'URL
    const { categorySlug } = req.params;

    // Chercher la catégorie
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }

    // Récupérer les produits de cette catégorie
    const products = await prisma.product.findMany({
      where: {
        categoryId: category.id,
        isActive: true
      },
      include: {
        Category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      products
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur' 
    });
  }
};

// FONCTION POUR RÉCUPÉRER UN PRODUIT PAR SON SLUG
const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // Chercher le produit
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        Category: true,
        ProductImage: true  // Inclure les images du produit
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    res.json({
      success: true,
      product
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur' 
    });
  }
};

// Exporter les fonctions
module.exports = {
  getAllProducts,
  getProductsByCategory,
  getProductBySlug
};