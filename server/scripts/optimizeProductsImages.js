// SCRIPT POUR OPTIMISER LES IMAGES DU DOSSIER PRODUCTS
// Ces images viennent des uploads admin et doivent être optimisées

const path = require('path');
const { optimizeAllImagesRecursive } = require('../src/utils/imageOptimizer');

async function main() {
  console.log('🚀 Optimisation des images du dossier products...\n');

  // Dossier contenant les images uploadées par l'admin
  const inputDir = path.join(__dirname, '../../client/my-app/public/images/products');
  
  // Dossier de destination pour les images optimisées
  const outputDir = path.join(__dirname, '../../client/my-app/public/images/optimized/products');

  try {
    // Lancer l'optimisation
    await optimizeAllImagesRecursive(inputDir, outputDir);
    
    console.log('\n✅ Optimisation des images products terminée !');
    
  } catch (error) {
    console.error('\n❌ Erreur lors de l\'optimisation:', error.message);
    process.exit(1);
  }
}

// Exécuter le script
main();
