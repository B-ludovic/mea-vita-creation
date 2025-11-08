// Configuration des images pour chaque produit
// Chaque produit a son propre ensemble de photos cohérentes

export const PRODUCT_IMAGES = {
  // SAC CYLINDRE
  'sac-cylindre-violet': [
    '/images/sac-cylindre/IMG_5639.JPG',
    '/images/sac-cylindre/IMG_5646.JPG',
    '/images/sac-cylindre/IMG_5654.JPG',
  ],
  'sac-cylindre-marron': [
    '/images/sac-cylindre/IMG_5615.JPG',
    '/images/sac-cylindre/IMG_5625.JPG',
    '/images/sac-cylindre/IMG_5631.JPG',
  ],
  'sac-cylindre-wax': [
    '/images/sac-cylindre/IMG_5660.JPG',
    '/images/sac-cylindre/IMG_5672.JPG',
    '/images/sac-cylindre/IMG_5676.JPG',
    '/images/sac-cylindre/IMG_5679.JPG',
  ],

  // POCHETTES UNISEXE
  
  // Modèle "L'Atlas" (Design Asymétrique)
  'latlas-fogo': [
    '/images/pochettes-unisexe/atlas-fogo-1.jpg',
    '/images/pochettes-unisexe/atlas-fogo-2.jpg',
  ],
  'latlas-solaire': [
    '/images/pochettes-unisexe/atlas-solaire-1.jpg',
    '/images/pochettes-unisexe/atlas-solaire-2.jpg',
  ],
  'latlas-urbain': [
    '/images/pochettes-unisexe/atlas-urbain-1.jpg',
  ],
  'latlas-terre-et-mer': [
    '/images/pochettes-unisexe/atlas-terre-et-mer-1.jpg',
  ],

  // Modèle "L'Artisan" (Design avec Dragonne)
  'lartisan-ebene': [
    '/images/pochettes-unisexe/artisan-ebene-1.jpg',
    '/images/pochettes-unisexe/artisan-ebene-2.jpg',
  ],
  'lartisan-azur': [
    '/images/pochettes-unisexe/artisan-azur-1.jpg',
  ],

  // Modèle "Le Cachet" (Design avec Bouton)
  'le-cachet-ardoise': [
    '/images/pochettes-unisexe/cachet-ardoise-1.jpg',
  ],

  // PORTE-CARTE
  'porte-carte-wax-orange': [
    '/images/porte-carte/IMG_6139.JPG',
    '/images/porte-carte/IMG_6142.JPG',
    '/images/porte-carte/IMG_6145.JPG',
  ],
  'porte-carte-wax-bleu': [
    '/images/porte-carte/IMG_6168.JPG',
    '/images/porte-carte/IMG_6175.JPG',
  ],
  'porte-carte-wax-jaune': [
    '/images/porte-carte/IMG_6183.JPG',
    '/images/porte-carte/IMG_6187.JPG',
    '/images/porte-carte/IMG_6188.JPG',
  ],
  'porte-carte-wax-violet': [
    '/images/porte-carte/IMG_6198.JPG',
    '/images/porte-carte/IMG_6200.JPG',
  ],

  // SAC U
  'sac-u-classique': [
    '/images/sac-u/IMG_4975.JPG',
    '/images/sac-u/IMG_4993.JPG',
    '/images/sac-u/IMG_5021.JPG',
  ],
  'sac-u-wax-multicolore': [
    '/images/sac-u/IMG_5000.JPG',
  ],
  'sac-u-wax-orange': [
    '/images/sac-u/IMG_5007.JPG',
    '/images/sac-u/IMG_5010.JPG',
    '/images/sac-u/IMG_5017.JPG',
  ],
  'sac-u-wax-bleu': [
    '/images/sac-u/IMG_5021.JPG',
    '/images/sac-u/IMG_5027.JPG',
  ],
  'sac-u-wax-gold': [
    '/images/sac-u/IMG_5034.JPG',
    '/images/sac-u/IMG_5041.JPG',
  ],
  'sac-u-wax-rouge': [
    '/images/sac-u/IMG_5059.JPG',
    '/images/sac-u/IMG_5133.JPG',
    '/images/sac-u/IMG_5144.JPG',
  ],
  'sac-u-wax-vert': [
    '/images/sac-u/IMG_5158.JPG',
    '/images/sac-u/IMG_5178.JPG',
  ],
  'sac-u-wax-jaune': [
    '/images/sac-u/IMG_5190 2.JPG',
    '/images/sac-u/IMG_5195.JPG',
    '/images/sac-u/IMG_5202.JPG',
    '/images/sac-u/IMG_5207.JPG',
  ],
};

// Fonction pour obtenir les images d'un produit par son slug
export const getProductImages = (productSlug) => {
  return PRODUCT_IMAGES[productSlug] || [];
};

// Fonction pour obtenir l'image principale (première image)
export const getProductMainImage = (productSlug) => {
  const images = PRODUCT_IMAGES[productSlug];
  return images && images.length > 0 ? images[0] : null;
};

// Fonction pour obtenir toutes les images d'une catégorie (pour fallback)
export const getCategoryImages = (categorySlug) => {
  const categoryImagesMap = {
    'pochettes-unisexe': [
      '/images/pochettes-unisexe/atlas-fogo-1.jpg',
      '/images/pochettes-unisexe/atlas-fogo-2.jpg',
      '/images/pochettes-unisexe/atlas-solaire-1.jpg',
      '/images/pochettes-unisexe/atlas-solaire-2.jpg',
      '/images/pochettes-unisexe/atlas-urbain-1.jpg',
      '/images/pochettes-unisexe/atlas-terre-et-mer-1.jpg',
      '/images/pochettes-unisexe/artisan-ebene-1.jpg',
      '/images/pochettes-unisexe/artisan-ebene-2.jpg',
      '/images/pochettes-unisexe/artisan-azur-1.jpg',
      '/images/pochettes-unisexe/cachet-ardoise-1.jpg',
    ],
    'porte-carte': [
      '/images/porte-carte/IMG_6139.JPG',
      '/images/porte-carte/IMG_6142.JPG',
      '/images/porte-carte/IMG_6145.JPG',
      '/images/porte-carte/IMG_6168.JPG',
      '/images/porte-carte/IMG_6175.JPG',
      '/images/porte-carte/IMG_6183.JPG',
      '/images/porte-carte/IMG_6187.JPG',
      '/images/porte-carte/IMG_6188.JPG',
      '/images/porte-carte/IMG_6198.JPG',
      '/images/porte-carte/IMG_6200.JPG',
    ],
    'sac-cylindre': [
      '/images/sac-cylindre/IMG_5615.JPG',
      '/images/sac-cylindre/IMG_5625.JPG',
      '/images/sac-cylindre/IMG_5631.JPG',
      '/images/sac-cylindre/IMG_5639.JPG',
      '/images/sac-cylindre/IMG_5646.JPG',
      '/images/sac-cylindre/IMG_5654.JPG',
      '/images/sac-cylindre/IMG_5660.JPG',
      '/images/sac-cylindre/IMG_5672.JPG',
      '/images/sac-cylindre/IMG_5676.JPG',
      '/images/sac-cylindre/IMG_5679.JPG',
    ],
    'sac-u': [
      '/images/sac-u/IMG_4975.JPG',
      '/images/sac-u/IMG_4993.JPG',
      '/images/sac-u/IMG_5000.JPG',
      '/images/sac-u/IMG_5007.JPG',
      '/images/sac-u/IMG_5010.JPG',
      '/images/sac-u/IMG_5017.JPG',
      '/images/sac-u/IMG_5021.JPG',
      '/images/sac-u/IMG_5027.JPG',
      '/images/sac-u/IMG_5034.JPG',
      '/images/sac-u/IMG_5041.JPG',
      '/images/sac-u/IMG_5059.JPG',
      '/images/sac-u/IMG_5133.JPG',
      '/images/sac-u/IMG_5144.JPG',
      '/images/sac-u/IMG_5158.JPG',
      '/images/sac-u/IMG_5178.JPG',
      '/images/sac-u/IMG_5190 2.JPG',
      '/images/sac-u/IMG_5195.JPG',
      '/images/sac-u/IMG_5202.JPG',
      '/images/sac-u/IMG_5207.JPG',
    ],
  };

  return categoryImagesMap[categorySlug] || [];
};
