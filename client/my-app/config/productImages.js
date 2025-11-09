// Configuration des images pour chaque produit
// Chaque produit a son propre ensemble de photos cohérentes

export const PRODUCT_IMAGES = {
  // SAC CYLINDRE - Collection "Le Tambour"
  'le-tambour-amethyste': [
    '/images/sac-cylindre/tambour-amethyste-1.jpg',
    '/images/sac-cylindre/tambour-amethyste-2.jpg',
    '/images/sac-cylindre/tambour-amethyste-3.jpg',
  ],
  'le-tambour-dune': [
    '/images/sac-cylindre/tambour-dune-1.jpg',
    '/images/sac-cylindre/tambour-dune-2.jpg',
  ],
  'le-tambour-ocean': [
    '/images/sac-cylindre/tambour-ocean-1.jpg',
    '/images/sac-cylindre/tambour-ocean-2.jpg',
  ],
  'le-tambour-solaire': [
    '/images/sac-cylindre/tambour-solaire-1.jpg',
  ],
  'le-tambour-festival': [
    '/images/sac-cylindre/tambour-festival-1.jpg',
  ],
  'le-tambour-mosaique': [
    '/images/sac-cylindre/tambour-mosaique-1.jpg',
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

  // SAC U - Collection "L'Arche"
  
  // Modèle "Besace"
  'larche-besace-fogo': [
    '/images/sac-u/arche-besace-fogo-1.jpg',
    '/images/sac-u/arche-besace-fogo-2.jpg',
    '/images/sac-u/arche-besace-fogo-3.jpg',
  ],
  'larche-besace-mosaique': [
    '/images/sac-u/arche-besace-mosaique-1.jpg',
    '/images/sac-u/arche-besace-mosaique-2.jpg',
  ],
  'larche-besace-cendre': [
    '/images/sac-u/arche-besace-cendre-1.jpg',
  ],
  'larche-besace-festival': [
    '/images/sac-u/arche-besace-festival-1.jpg',
    '/images/sac-u/arche-besace-festival-2.jpg',
  ],
  
  // Modèle "Pochette"
  'larche-pochette-royale': [
    '/images/sac-u/arche-pochette-royale-1.jpg',
  ],
  'larche-pochette-dashiki': [
    '/images/sac-u/arche-pochette-dashiki-1.jpg',
  ],
  'larche-pochette-mosaique': [
    '/images/sac-u/arche-pochette-mosaique-1.jpg',
    '/images/sac-u/arche-pochette-mosaique-2.jpg',
  ],
  'larche-pochette-festival': [
    '/images/sac-u/arche-pochette-festival-1.jpg',
  ],
  'larche-pochette-fogo': [
    '/images/sac-u/arche-pochette-fogo-1.jpg',
    '/images/sac-u/arche-pochette-fogo-2.jpg',
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
      '/images/sac-cylindre/tambour-amethyste-1.jpg',
      '/images/sac-cylindre/tambour-amethyste-2.jpg',
      '/images/sac-cylindre/tambour-amethyste-3.jpg',
      '/images/sac-cylindre/tambour-dune-1.jpg',
      '/images/sac-cylindre/tambour-dune-2.jpg',
      '/images/sac-cylindre/tambour-ocean-1.jpg',
      '/images/sac-cylindre/tambour-ocean-2.jpg',
      '/images/sac-cylindre/tambour-solaire-1.jpg',
      '/images/sac-cylindre/tambour-festival-1.jpg',
      '/images/sac-cylindre/tambour-mosaique-1.jpg',
    ],
    'sac-u': [
      '/images/sac-u/arche-besace-fogo-1.jpg',
      '/images/sac-u/arche-besace-fogo-2.jpg',
      '/images/sac-u/arche-besace-fogo-3.jpg',
      '/images/sac-u/arche-besace-mosaique-1.jpg',
      '/images/sac-u/arche-besace-mosaique-2.jpg',
      '/images/sac-u/arche-besace-cendre-1.jpg',
      '/images/sac-u/arche-besace-festival-1.jpg',
      '/images/sac-u/arche-besace-festival-2.jpg',
      '/images/sac-u/arche-pochette-royale-1.jpg',
      '/images/sac-u/arche-pochette-dashiki-1.jpg',
      '/images/sac-u/arche-pochette-mosaique-1.jpg',
      '/images/sac-u/arche-pochette-mosaique-2.jpg',
      '/images/sac-u/arche-pochette-festival-1.jpg',
      '/images/sac-u/arche-pochette-fogo-1.jpg',
      '/images/sac-u/arche-pochette-fogo-2.jpg',
    ],
  };

  return categoryImagesMap[categorySlug] || [];
};
