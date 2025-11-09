// Importer Prisma
const prisma = require('../config/prisma');

// FONCTION POUR RÉCUPÉRER TOUS LES PRODUITS
// Cette fonction est accessible à tous les utilisateurs (publique)
const getAllProducts = async (req, res) => {
  try {
    // Pagination: récupérer les paramètres de pagination depuis la query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

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
      },
      take: limit,  // Limiter le nombre de résultats
      skip: skip    // Ignorer les X premiers résultats selon la page
    });

    // Compter le nombre total de produits pour la pagination
    const totalProducts = await prisma.product.count({
      where: {
        isActive: true
      }
    });

    res.json({
      success: true,
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts: totalProducts,
        productsPerPage: limit
      }
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

// FONCTION POUR CRÉER UN PRODUIT
// Cette fonction est réservée aux administrateurs uniquement
const createProduct = async (req, res) => {
  try {
    const { 
      name, 
      slug, 
      description, 
      price, 
      categoryId, 
      stock, 
      isActive 
    } = req.body;

    // Validation 1: Vérifier que les champs obligatoires sont présents
    if (!name || !slug || !price || !categoryId) {
      return res.status(400).json({
        success: false,
        message: 'Champs obligatoires manquants (name, slug, price, categoryId)'
      });
    }

    // Validation 2: Vérifier que le prix est valide
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({
        success: false,
        message: 'Le prix doit être un nombre positif'
      });
    }

    // Validation 3: Vérifier que le stock est valide
    const parsedStock = parseInt(stock) || 0;
    if (parsedStock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Le stock ne peut pas être négatif'
      });
    }

    // Validation 4: Vérifier que le slug n'existe pas déjà
    const existingProduct = await prisma.product.findUnique({
      where: { slug }
    });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'Ce slug existe déjà. Veuillez en choisir un autre.'
      });
    }

    // Validation 5: Vérifier que la catégorie existe
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'La catégorie spécifiée n\'existe pas'
      });
    }

    // Créer le produit avec les données validées
    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        description: description ? description.trim() : null,
        price: parsedPrice,
        categoryId,
        stock: parsedStock,
        isActive: isActive !== false,
      },
      include: {
        Category: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Produit créé avec succès',
      product
    });

  } catch (error) {
    // Ne pas exposer les détails de l'erreur en production
    console.error('Erreur lors de la création du produit:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création du produit'
    });
  }
};

// FONCTION POUR METTRE À JOUR UN PRODUIT
// Cette fonction est réservée aux administrateurs uniquement
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      slug, 
      description, 
      price, 
      categoryId, 
      stock, 
      isActive 
    } = req.body;

    // Validation 1: Vérifier que le produit existe
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    // Validation 2: Vérifier que le prix est valide si fourni
    if (price !== undefined) {
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        return res.status(400).json({
          success: false,
          message: 'Le prix doit être un nombre positif'
        });
      }
    }

    // Validation 3: Vérifier que le stock est valide si fourni
    if (stock !== undefined) {
      const parsedStock = parseInt(stock);
      if (isNaN(parsedStock) || parsedStock < 0) {
        return res.status(400).json({
          success: false,
          message: 'Le stock ne peut pas être négatif'
        });
      }
    }

    // Validation 4: Vérifier que le slug n'est pas déjà utilisé par un autre produit
    if (slug && slug !== existingProduct.slug) {
      const slugExists = await prisma.product.findUnique({
        where: { slug }
      });

      if (slugExists) {
        return res.status(400).json({
          success: false,
          message: 'Ce slug est déjà utilisé par un autre produit'
        });
      }
    }

    // Validation 5: Vérifier que la catégorie existe si fournie
    if (categoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: categoryId }
      });

      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'La catégorie spécifiée n\'existe pas'
        });
      }
    }

    // Préparer les données à mettre à jour
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (slug !== undefined) updateData.slug = slug.trim().toLowerCase();
    if (description !== undefined) updateData.description = description.trim();
    if (price !== undefined) updateData.price = parseFloat(price);
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (isActive !== undefined) updateData.isActive = isActive;

    // Mettre à jour le produit
    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        Category: true,
        ProductImage: true
      }
    });

    res.json({
      success: true,
      message: 'Produit mis à jour avec succès',
      product
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour du produit'
    });
  }
};

// FONCTION POUR SUPPRIMER UN PRODUIT
// Cette fonction est réservée aux administrateurs uniquement
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Validation: Vérifier que le produit existe avant de le supprimer
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    // Supprimer d'abord les images associées au produit
    // Cela évite les erreurs de contrainte de clé étrangère
    await prisma.productImage.deleteMany({
      where: { productId: id }
    });

    // Ensuite supprimer le produit lui-même
    await prisma.product.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Produit et ses images supprimés avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression du produit'
    });
  }
};

// Exporter les fonctions
module.exports = {
  getAllProducts,
  getProductsByCategory,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct
};