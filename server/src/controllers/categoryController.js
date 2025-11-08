// Importer Prisma
const prisma = require('../config/prisma');

// FONCTION POUR RÉCUPÉRER TOUTES LES CATÉGORIES
// Cette fonction renvoie la liste de toutes les catégories actives
const getAllCategories = async (req, res) => {
  try {
    // Récupérer toutes les catégories actives de la base de données
    // On trie par ordre (order) pour avoir un affichage cohérent
    const categories = await prisma.category.findMany({
      where: {
        isActive: true  // Seulement les catégories actives
      },
      orderBy: {
        order: 'asc'  // Tri par ordre croissant
      }
    });

    // Renvoyer les catégories au front-end
    res.json({
      success: true,
      categories
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
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
    console.error('Erreur lors de la récupération de la catégorie:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur lors de la récupération de la catégorie' 
    });
  }
};

// Exporter les fonctions
module.exports = {
  getAllCategories,
  getCategoryBySlug
};