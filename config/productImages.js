// Configuration des images pour chaque produit
// Chaque produit a son propre ensemble de photos cohérentes

export const PRODUCT_IMAGES = {
  // SAC CYLINDRE
  'sac-cylindre-violet': [
    '/images/sac-cylindre/sac-cylindre-violet-1.jpg',
    '/images/sac-cylindre/sac-cylindre-violet-2.jpg',
    '/images/sac-cylindre/sac-cylindre-violet-3.jpg',
  ],
  'sac-cylindre-marron': [
    '/images/sac-cylindre/sac-cylindre-wax-orange-1.jpg',
    '/images/sac-cylindre/sac-cylindre-wax-orange-2.jpg',
    '/images/sac-cylindre/sac-cylindre-wax-orange-3.jpg',
  ],
  'sac-cylindre-wax': [
    '/images/sac-cylindre/sac-cylindre-wax-bleu-1.jpg',
    '/images/sac-cylindre/sac-cylindre-wax-bleu-2.jpg',
    '/images/sac-cylindre/sac-cylindre-wax-bleu-3.jpg',
    '/images/sac-cylindre/sac-cylindre-wax-bleu-4.jpg',
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

  // PORTE-CARTE - Collection "L'Éclat"
  'leclat-amethyste': [
    '/images/porte-carte/eclat-amethyste-1.jpg',
    '/images/porte-carte/eclat-amethyste-2.jpg',
  ],
  'leclat-kente': [
    '/images/porte-carte/eclat-kente-1.jpg',
    '/images/porte-carte/eclat-kente-2.jpg',
  ],
  'leclat-olive': [
    '/images/porte-carte/eclat-olive-1.jpg',
    '/images/porte-carte/eclat-olive-2.jpg',
    '/images/porte-carte/eclat-olive-3.jpg',
  ],
  'leclat-fogo': [
    '/images/porte-carte/eclat-fogo-1.jpg',
  ],
  'leclat-solaire': [
    '/images/porte-carte/eclat-solaire-1.jpg',
  ],
  'leclat-mosaique': [
    '/images/porte-carte/eclat-mosaique-1.jpg',
  ],

  // SAC U
  'sac-u-classique': [
    '/images/sac-u/sac-u-classique-1.jpg',
    '/images/sac-u/sac-u-classique-2.jpg',
    '/images/sac-u/sac-u-classique-3.jpg',
  ],
  'sac-u-wax-multicolore': [
    '/images/sac-u/sac-u-wax-gold-1.jpg',
  ],
  'sac-u-wax-orange': [
    '/images/sac-u/sac-u-wax-orange-1.jpg',
    '/images/sac-u/sac-u-wax-orange-2.jpg',
    '/images/sac-u/sac-u-wax-orange-3.jpg',
  ],
  'sac-u-wax-bleu': [
    '/images/sac-u/sac-u-wax-bleu-1.jpg',
    '/images/sac-u/sac-u-wax-bleu-2.jpg',
    '/images/sac-u/sac-u-wax-bleu-3.jpg',
  ],
  'sac-u-wax-gold': [
    '/images/sac-u/sac-u-wax-vert-2.jpg',
    '/images/sac-u/sac-u-wax-vert-3.jpg',
  ],
  'sac-u-wax-rouge': [
    '/images/sac-u/sac-u-wax-vert-1.jpg',
    '/images/sac-u/sac-u-wax-violet-1.jpg',
    '/images/sac-u/sac-u-wax-violet-2.jpg',
  ],
  'sac-u-wax-vert': [
    '/images/sac-u/sac-u-wax-violet-1.jpg',
    '/images/sac-u/sac-u-wax-violet-2.jpg',
  ],
  'sac-u-wax-jaune': [
    '/images/sac-u/sac-u-wax-multicolore-1.jpg',
    '/images/sac-u/sac-u-wax-multicolore-2.jpg',
    '/images/sac-u/sac-u-wax-multicolore-3.jpg',
    '/images/sac-u/sac-u-wax-multicolore-4.jpg',
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
      '/images/porte-carte/eclat-amethyste-1.jpg',
      '/images/porte-carte/eclat-amethyste-2.jpg',
      '/images/porte-carte/eclat-kente-1.jpg',
      '/images/porte-carte/eclat-kente-2.jpg',
      '/images/porte-carte/eclat-olive-1.jpg',
      '/images/porte-carte/eclat-olive-2.jpg',
      '/images/porte-carte/eclat-olive-3.jpg',
      '/images/porte-carte/eclat-fogo-1.jpg',
      '/images/porte-carte/eclat-solaire-1.jpg',
      '/images/porte-carte/eclat-mosaique-1.jpg',
    ],
    'sac-cylindre': [
      '/images/sac-cylindre/sac-cylindre-wax-orange-1.jpg',
      '/images/sac-cylindre/sac-cylindre-wax-orange-2.jpg',
      '/images/sac-cylindre/sac-cylindre-wax-orange-3.jpg',
      '/images/sac-cylindre/sac-cylindre-violet-1.jpg',
      '/images/sac-cylindre/sac-cylindre-violet-2.jpg',
      '/images/sac-cylindre/sac-cylindre-violet-3.jpg',
      '/images/sac-cylindre/sac-cylindre-wax-bleu-1.jpg',
      '/images/sac-cylindre/sac-cylindre-wax-bleu-2.jpg',
      '/images/sac-cylindre/sac-cylindre-wax-bleu-3.jpg',
      '/images/sac-cylindre/sac-cylindre-wax-bleu-4.jpg',
    ],
    'sac-u': [
      '/images/sac-u/sac-u-classique-1.jpg',
      '/images/sac-u/sac-u-classique-2.jpg',
      '/images/sac-u/sac-u-classique-3.jpg',
      '/images/sac-u/sac-u-wax-gold-1.jpg',
      '/images/sac-u/sac-u-wax-bleu-1.jpg',
      '/images/sac-u/sac-u-wax-bleu-2.jpg',
      '/images/sac-u/sac-u-wax-bleu-3.jpg',
      '/images/sac-u/sac-u-wax-vert-1.jpg',
      '/images/sac-u/sac-u-wax-vert-2.jpg',
      '/images/sac-u/sac-u-wax-vert-3.jpg',
      '/images/sac-u/sac-u-wax-orange-1.jpg',
      '/images/sac-u/sac-u-wax-orange-2.jpg',
      '/images/sac-u/sac-u-wax-orange-3.jpg',
      '/images/sac-u/sac-u-wax-violet-1.jpg',
      '/images/sac-u/sac-u-wax-violet-2.jpg',
      '/images/sac-u/sac-u-wax-multicolore-1.jpg',
      '/images/sac-u/sac-u-wax-multicolore-2.jpg',
      '/images/sac-u/sac-u-wax-multicolore-3.jpg',
      '/images/sac-u/sac-u-wax-multicolore-4.jpg',
    ],
  };

  return categoryImagesMap[categorySlug] || [];
};
