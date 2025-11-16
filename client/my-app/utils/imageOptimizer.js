// UTILITAIRE POUR OBTENIR LES IMAGES OPTIMISÉES

// Cette fonction prend le chemin d'une image et retourne le chemin optimisé
// Paramètres:
//   - imagePath: le chemin original de l'image (ex: "/images/pochettes-unisexe/atlas-fogo-1.jpg")
//   - size: la taille souhaitée ("thumbnail", "medium", "large", "original")
// Retourne: le chemin de l'image optimisée

export function getOptimizedImagePath(imagePath, size = 'medium') {
  // Si pas d'image, retourner une image par défaut
  if (!imagePath) {
    return '/images/placeholder.jpg';
  }

  // Vérifier si l'image est déjà optimisée
  if (imagePath.includes('/optimized/')) {
    return imagePath;
  }

  // Extraire les informations du chemin
  // Ex: "/images/pochettes-unisexe/atlas-fogo-1.jpg"
  // ou: "/images/products/1762800104331-542930498-img-5672.JPG"
  
  const lastSlashIndex = imagePath.lastIndexOf('/');
  const directory = imagePath.substring(0, lastSlashIndex); // "/images/pochettes-unisexe"
  const filename = imagePath.substring(lastSlashIndex + 1); // "atlas-fogo-1.jpg"
  
  // Pour les fichiers products, garder l'extension dans le nom
  // Sinon, la retirer (pour les images des catégories)
  let baseName;
  if (directory.includes('/products')) {
    // Garder le nom complet avec extension
    baseName = filename; // "1762800104331-542930498-img-5672.JPG"
  } else {
    // Retirer l'extension
    const lastDotIndex = filename.lastIndexOf('.');
    baseName = filename.substring(0, lastDotIndex); // "atlas-fogo-1"
  }
  
  // Construire le nouveau chemin
  // Ex: "/images/optimized/pochettes-unisexe/atlas-fogo-1-medium.webp"
  // ou: "/images/optimized/products/1762800104331-542930498-img-5672.JPG-medium.webp"
  const optimizedPath = `${directory.replace('/images/', '/images/optimized/')}/${baseName}-${size}.webp`;
  
  return optimizedPath;
}


// Fonction pour obtenir toutes les tailles d'une image
// Retourne un objet avec toutes les versions disponibles
export function getAllImageSizes(imagePath) {
  return {
    thumbnail: getOptimizedImagePath(imagePath, 'thumbnail'),
    medium: getOptimizedImagePath(imagePath, 'medium'),
    large: getOptimizedImagePath(imagePath, 'large'),
    original: getOptimizedImagePath(imagePath, 'original')
  };
}


// Fonction pour obtenir le srcSet pour le responsive
// Permet au navigateur de choisir automatiquement la bonne image selon la taille d'écran
export function getImageSrcSet(imagePath) {
  const sizes = getAllImageSizes(imagePath);
  
  return `
    ${sizes.thumbnail} 150w,
    ${sizes.medium} 600w,
    ${sizes.large} 1200w,
    ${sizes.original} 2400w
  `.trim();
}


// Fonction pour obtenir l'attribut sizes selon le contexte d'affichage
// Aide le navigateur à choisir la bonne image
export function getImageSizes(context = 'grid') {
  // Contexte "grid" = liste de produits (petites images)
  if (context === 'grid') {
    return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
  }
  
  // Contexte "detail" = page produit (grande image)
  if (context === 'detail') {
    return '(max-width: 768px) 100vw, 50vw';
  }
  
  // Contexte "thumbnail" = miniature (très petite)
  if (context === 'thumbnail') {
    return '150px';
  }
  
  // Par défaut
  return '100vw';
}
