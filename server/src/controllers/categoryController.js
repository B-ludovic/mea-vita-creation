// Importer Prisma
const prisma = require('../config/prisma');

// FONCTION POUR RÉCUPÉRER TOUTES LES CATÉGORIES
// Cette fonction renvoie la liste de toutes les catégories actives avec le nombre de produits
const getAllCategories = async (req, res) => {
  try {
    // Récupérer toutes les catégories actives de la base de données
    // On trie par ordre (order) pour avoir un affichage cohérent
    // On utilise _count pour récupérer le nombre de produits par catégorie
    const categories = await prisma.category.findMany({
      where: {
        isActive: true  // Seulement les catégories actives
      },
      orderBy: {
        order: 'asc'  // Tri par ordre croissant
      },
      include: {
        _count: {
          select: { Product: true }  // Compte le nombre de produits (Product avec P majuscule comme dans le schéma Prisma)
        }
      }
    });

    // Renvoyer les catégories au front-end
    res.json({
      success: true,
      categories
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur lors de la récupération des catégories' 
    });
  }
};

// FONCTION POUR RÉCUPÉRER UNE CATÉGORIE PAR SON SLUG
// Le slug c'est le nom dans l'URL (ex: "pochettes-unisexe")
const getCategoryBySlug = async (req, res) => {
  try {
    // Récupérer le slug depuis l'URL
    const { slug } = req.params;

    // Chercher la catégorie dans la base
    const category = await prisma.category.findUnique({
      where: { slug }
    });

    // Si la catégorie n'existe pas
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }

    // Renvoyer la catégorie
    res.json({
      success: true,
      category
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de la catégorie:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur' 
    });
  }
};

// Exporter les fonctions
module.exports = {
  getAllCategories,
  getCategoryBySlug
};


// FONCTIONS ADMIN - GESTION DES CATÉGORIES


// FONCTION POUR CRÉER UNE NOUVELLE CATÉGORIE (ADMIN)
// Cette fonction permet à l'admin d'ajouter une nouvelle catégorie
const createCategory = async (req, res) => {
  try {
    // Récupérer les données du formulaire
    const { name, slug, description, order } = req.body;

    // VALIDATION : Vérifier que tous les champs obligatoires sont remplis
    if (!name || !slug || !description) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont obligatoires (name, slug, description)'
      });
    }

    // VÉRIFICATION : Est-ce que le slug existe déjà ?
    // Le slug doit être unique (comme l'URL)
    const existingCategory = await prisma.category.findUnique({
      where: { slug }
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Ce slug existe déjà. Choisissez un slug différent.'
      });
    }

    // CRÉATION : Ajouter la nouvelle catégorie dans la base de données
    const newCategory = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        order: order ? parseInt(order) : 0, // Si pas d'ordre, mettre 0
        isActive: true // Par défaut, la catégorie est active
      }
    });

    // SUCCÈS : Renvoyer la catégorie créée
    res.status(201).json({
      success: true,
      message: 'Catégorie créée avec succès',
      category: newCategory
    });

  } catch (error) {
    console.error('Erreur lors de la création de la catégorie:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création de la catégorie'
    });
  }
};

// FONCTION POUR MODIFIER UNE CATÉGORIE EXISTANTE (ADMIN)
// Cette fonction permet de mettre à jour les infos d'une catégorie
const updateCategory = async (req, res) => {
  try {
    // Récupérer l'ID de la catégorie à modifier
    const { id } = req.params;
    
    // Récupérer les nouvelles données
    const { name, slug, description, order, isActive } = req.body;

    // VÉRIFICATION : Est-ce que la catégorie existe ?
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }

    // Si on change le slug, vérifier qu'il n'existe pas déjà
    if (slug && slug !== existingCategory.slug) {
      const slugExists = await prisma.category.findUnique({
        where: { slug }
      });

      if (slugExists) {
        return res.status(400).json({
          success: false,
          message: 'Ce slug existe déjà. Choisissez un slug différent.'
        });
      }
    }

    // MISE À JOUR : Modifier la catégorie dans la base
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: name || existingCategory.name,
        slug: slug || existingCategory.slug,
        description: description || existingCategory.description,
        order: order !== undefined ? parseInt(order) : existingCategory.order,
        isActive: isActive !== undefined ? isActive : existingCategory.isActive
      }
    });

    // SUCCÈS : Renvoyer la catégorie mise à jour
    res.json({
      success: true,
      message: 'Catégorie mise à jour avec succès',
      category: updatedCategory
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la catégorie:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour'
    });
  }
};

// FONCTION POUR SUPPRIMER UNE CATÉGORIE (ADMIN)
// ATTENTION : On ne supprime pas vraiment, on désactive juste (isActive = false)
// C'est plus sûr pour éviter de perdre des données
const deleteCategory = async (req, res) => {
  try {
    // Récupérer l'ID de la catégorie à supprimer
    const { id } = req.params;

    // VÉRIFICATION : Est-ce que la catégorie existe ?
    const category = await prisma.category.findUnique({
      where: { id },
      // Compter combien de produits sont liés à cette catégorie
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }

    // PROTECTION : Si la catégorie a des produits, ne pas la supprimer
    if (category._count.products > 0) {
      return res.status(400).json({
        success: false,
        message: `Impossible de supprimer cette catégorie. Elle contient ${category._count.products} produit(s). Veuillez d'abord déplacer ou supprimer ces produits.`
      });
    }

    // SUPPRESSION : On désactive la catégorie au lieu de la supprimer
    // (Soft delete = suppression douce)
    const deletedCategory = await prisma.category.update({
      where: { id },
      data: {
        isActive: false // On la désactive seulement
      }
    });

    // SUCCÈS
    res.json({
      success: true,
      message: 'Catégorie supprimée avec succès',
      category: deletedCategory
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression'
    });
  }
};

// Exporter les fonctions à la fin du fichier
module.exports = {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
};