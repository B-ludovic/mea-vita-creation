// COMPOSANT IMAGE OPTIMISÉE
// Affiche automatiquement la meilleure version d'une image selon le contexte

import Image from 'next/image';
import { getOptimizedImagePath, getImageSrcSet, getImageSizes } from '../utils/imageOptimizer';

export default function OptimizedImage({ 
  src,           // Chemin de l'image originale
  alt,           // Texte alternatif
  size = 'medium', // Taille par défaut à charger
  context = 'grid', // Contexte d'affichage (grid, detail, thumbnail)
  width,         // Largeur
  height,        // Hauteur
  className,     // Classes CSS
  style,         // Styles inline
  priority = false // Priorité de chargement
}) {
  
  // Obtenir le chemin optimisé
  const optimizedSrc = getOptimizedImagePath(src, size);
  
  return (
    <Image
      src={optimizedSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style || { objectFit: 'cover', width: '100%', height: '100%' }}
      priority={priority}
      quality={75}
    />
  );
}
