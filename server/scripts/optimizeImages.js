// Script pour optimiser toutes les images existantes
const path = require('path');
const { optimizeAllImagesRecursive, getImageMetadata } = require('../src/utils/imageOptimizer');

async function main() {
  console.log('🚀 Démarrage de l\'optimisation des images...\n');

  // Dossiers
  const inputDir = path.join(__dirname, '../../client/my-app/public/images');
  const outputDir = path.join(__dirname, '../../client/my-app/public/images/optimized');

  try {
    // Optimiser toutes les images (récursif pour gérer les sous-dossiers)
    const results = await optimizeAllImagesRecursive(inputDir, outputDir);

    console.log('\n✅ Optimisation terminée !');
    console.log(`📊 ${results.length} images optimisées`);

    // Calculer les gains
    let totalOriginalSize = 0;
    let totalOptimizedSize = 0;

    for (const result of results) {
      const originalPath = path.join(inputDir, result.original);
      const optimizedPath = path.join(outputDir, result.optimized.medium);

      try {
        const originalMeta = await getImageMetadata(originalPath);
        const optimizedMeta = await getImageMetadata(optimizedPath);

        totalOriginalSize += originalMeta.size;
        totalOptimizedSize += optimizedMeta.size;

        console.log(`\n📸 ${result.original}:`);
        console.log(`   Avant: ${originalMeta.sizeMB} MB`);
        console.log(`   Après: ${optimizedMeta.sizeKB} KB`);
        console.log(`   Gain: ${((1 - optimizedMeta.size / originalMeta.size) * 100).toFixed(1)}%`);
      } catch (error) {
        // Ignorer les erreurs sur les images individuelles
      }
    }

    const totalOriginalMB = (totalOriginalSize / 1024 / 1024).toFixed(2);
    const totalOptimizedMB = (totalOptimizedSize / 1024 / 1024).toFixed(2);
    const totalGain = ((1 - totalOptimizedSize / totalOriginalSize) * 100).toFixed(1);

    console.log('\n📊 RÉSUMÉ TOTAL:');
    console.log(`   Taille originale: ${totalOriginalMB} MB`);
    console.log(`   Taille optimisée: ${totalOptimizedMB} MB`);
    console.log(`   Gain total: ${totalGain}% 🎉`);

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

main();