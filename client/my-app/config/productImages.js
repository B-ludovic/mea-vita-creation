// Configuration des images pour chaque produit
// Chaque produit a son propre ensemble de photos cohérentes

// Fonction pour normaliser les slugs (pluriel → singulier)
const normalizeSlug = (slug) => {
  const mappings = {
    'pochettes-unisexes': 'pochettes-unisexe',
    'sacs-cylindres': 'sacs-cylindre',
    'sacs-us': 'sacs-u',
    // porte-cartes reste identique (déjà au pluriel)
  };
  return mappings[slug] || slug;
};

export const PRODUCT_IMAGES = {
  // SAC CYLINDRE - Collection "Le Tambour"
  'le-tambour-amethyste': [
    '/images/sacs-cylindre/tambour-amethyste-1.jpg',
    '/images/sacs-cylindre/tambour-amethyste-2.jpg',
    '/images/sacs-cylindre/tambour-amethyste-3.jpg',
  ],
  'le-tambour-dune': [
    '/images/sacs-cylindre/tambour-dune-1.jpg',
    '/images/sacs-cylindre/tambour-dune-2.jpg',
  ],
  'le-tambour-ocean': [
    '/images/sacs-cylindre/tambour-ocean-1.jpg',
    '/images/sacs-cylindre/tambour-ocean-2.jpg',
  ],
  'le-tambour-solaire': [
    '/images/sacs-cylindre/tambour-solaire-1.jpg',
  ],
  'le-tambour-festival': [
    '/images/sacs-cylindre/tambour-festival-1.jpg',
  ],
  'le-tambour-mosaique': [
    '/images/sacs-cylindre/tambour-mosaique-1.jpg',
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
    '/images/porte-cartes/eclat-amethyste-1.jpg',
    '/images/porte-cartes/eclat-amethyste-2.jpg',
  ],
  'leclat-kente': [
    '/images/porte-cartes/eclat-kente-1.jpg',
    '/images/porte-cartes/eclat-kente-2.jpg',
  ],
  'leclat-olive': [
    '/images/porte-cartes/eclat-olive-1.jpg',
    '/images/porte-cartes/eclat-olive-2.jpg',
    '/images/porte-cartes/eclat-olive-3.jpg',
  ],
  'leclat-fogo': [
    '/images/porte-cartes/eclat-fogo-1.jpg',
  ],
  'leclat-solaire': [
    '/images/porte-cartes/eclat-solaire-1.jpg',
  ],
  'leclat-mosaique': [
    '/images/porte-cartes/eclat-mosaique-1.jpg',
  ],

  // SAC U - Collection "L'Arche"
  
  // Modèle "Besace"
  'larche-besace-fogo': [
    '/images/sacs-u/arche-besace-fogo-1.jpg',
    '/images/sacs-u/arche-besace-fogo-2.jpg',
    '/images/sacs-u/arche-besace-fogo-3.jpg',
  ],
  'larche-besace-mosaique': [
    '/images/sacs-u/arche-besace-mosaique-1.jpg',
    '/images/sacs-u/arche-besace-mosaique-2.jpg',
  ],
  'larche-besace-cendre': [
    '/images/sacs-u/arche-besace-cendre-1.jpg',
  ],
  'larche-besace-festival': [
    '/images/sacs-u/arche-besace-festival-1.jpg',
    '/images/sacs-u/arche-besace-festival-2.jpg',
  ],
  
  // Modèle "Pochette"
  'larche-pochette-royale': [
    '/images/sacs-u/arche-pochette-royale-1.jpg',
  ],
  'larche-pochette-dashiki': [
    '/images/sacs-u/arche-pochette-dashiki-1.jpg',
  ],
  'larche-pochette-mosaique': [
    '/images/sacs-u/arche-pochette-mosaique-1.jpg',
    '/images/sacs-u/arche-pochette-mosaique-2.jpg',
  ],
  'larche-pochette-festival': [
    '/images/sacs-u/arche-pochette-festival-1.jpg',
  ],
  'larche-pochette-fogo': [
    '/images/sacs-u/arche-pochette-fogo-1.jpg',
    '/images/sacs-u/arche-pochette-fogo-2.jpg',
  ],
};

// Fonction pour obtenir les images d'un produit par son slug
export const getProductImages = (productSlug) => {
  const normalizedSlug = normalizeSlug(productSlug);
  return PRODUCT_IMAGES[normalizedSlug] || [];
};

// Fonction pour obtenir l'image principale (première image)
export const getProductMainImage = (productSlug) => {
  const normalizedSlug = normalizeSlug(productSlug);
  const images = PRODUCT_IMAGES[normalizedSlug];
  return images && images.length > 0 ? images[0] : null;
};

// Fonction pour obtenir toutes les images d'une catégorie (pour fallback)
export const getCategoryImages = (categorySlug) => {
  const normalizedSlug = normalizeSlug(categorySlug);
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
    'porte-cartes': [
      '/images/porte-cartes/eclat-amethyste-1.jpg',
      '/images/porte-cartes/eclat-amethyste-2.jpg',
      '/images/porte-cartes/eclat-kente-1.jpg',
      '/images/porte-cartes/eclat-kente-2.jpg',
      '/images/porte-cartes/eclat-olive-1.jpg',
      '/images/porte-cartes/eclat-olive-2.jpg',
      '/images/porte-cartes/eclat-olive-3.jpg',
      '/images/porte-cartes/eclat-fogo-1.jpg',
      '/images/porte-cartes/eclat-solaire-1.jpg',
      '/images/porte-cartes/eclat-mosaique-1.jpg',
    ],
    'sacs-cylindre': [
      '/images/sacs-cylindre/tambour-amethyste-1.jpg',
      '/images/sacs-cylindre/tambour-amethyste-2.jpg',
      '/images/sacs-cylindre/tambour-amethyste-3.jpg',
      '/images/sacs-cylindre/tambour-dune-1.jpg',
      '/images/sacs-cylindre/tambour-dune-2.jpg',
      '/images/sacs-cylindre/tambour-ocean-1.jpg',
      '/images/sacs-cylindre/tambour-ocean-2.jpg',
      '/images/sacs-cylindre/tambour-solaire-1.jpg',
      '/images/sacs-cylindre/tambour-festival-1.jpg',
      '/images/sacs-cylindre/tambour-mosaique-1.jpg',
    ],
    'sacs-u': [
      '/images/sacs-u/arche-besace-fogo-1.jpg',
      '/images/sacs-u/arche-besace-fogo-2.jpg',
      '/images/sacs-u/arche-besace-fogo-3.jpg',
      '/images/sacs-u/arche-besace-mosaique-1.jpg',
      '/images/sacs-u/arche-besace-mosaique-2.jpg',
      '/images/sacs-u/arche-besace-cendre-1.jpg',
      '/images/sacs-u/arche-besace-festival-1.jpg',
      '/images/sacs-u/arche-besace-festival-2.jpg',
      '/images/sacs-u/arche-pochette-royale-1.jpg',
      '/images/sacs-u/arche-pochette-dashiki-1.jpg',
      '/images/sacs-u/arche-pochette-mosaique-1.jpg',
      '/images/sacs-u/arche-pochette-mosaique-2.jpg',
      '/images/sacs-u/arche-pochette-festival-1.jpg',
      '/images/sacs-u/arche-pochette-fogo-1.jpg',
      '/images/sacs-u/arche-pochette-fogo-2.jpg',
    ],
  };

  return categoryImagesMap[normalizedSlug] || [];
};
