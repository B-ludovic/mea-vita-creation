const fs = require('fs');
const path = require('path');

// Mapping des anciens noms vers les nouveaux noms descriptifs
const renameMap = {
  // ========================================
  // POCHETTES - COLLECTION L'ATLAS
  // ========================================
  'pochettes-unisexe/IMG_5723.JPG': 'pochettes-unisexe/atlas-fogo-1.jpg',
  'pochettes-unisexe/IMG_5729.JPG': 'pochettes-unisexe/atlas-fogo-2.jpg',
  'pochettes-unisexe/IMG_6126.JPG': 'pochettes-unisexe/atlas-solaire-1.jpg',
  'pochettes-unisexe/IMG_6016.JPG': 'pochettes-unisexe/atlas-solaire-2.jpg',
  'pochettes-unisexe/IMG_6114.JPG': 'pochettes-unisexe/atlas-urbain-1.jpg',
  'pochettes-unisexe/IMG_6061.JPG': 'pochettes-unisexe/atlas-terre-et-mer-1.jpg',

  // ========================================
  // POCHETTES - COLLECTION L'ARTISAN
  // ========================================
  'pochettes-unisexe/IMG_5739.JPG': 'pochettes-unisexe/artisan-ebene-1.jpg',
  'pochettes-unisexe/IMG_5747.JPG': 'pochettes-unisexe/artisan-ebene-2.jpg',
  'pochettes-unisexe/IMG_6094.JPG': 'pochettes-unisexe/artisan-azur-1.jpg',

  // ========================================
  // POCHETTES - COLLECTION LE CACHET
  // ========================================
  'pochettes-unisexe/IMG_6081.JPG': 'pochettes-unisexe/cachet-ardoise-1.jpg',

  // ========================================
  // SAC CYLINDRE
  // ========================================
  'sac-cylindre/IMG_5639.JPG': 'sac-cylindre/sac-cylindre-violet-1.jpg',
  'sac-cylindre/IMG_5646.JPG': 'sac-cylindre/sac-cylindre-violet-2.jpg',
  'sac-cylindre/IMG_5654.JPG': 'sac-cylindre/sac-cylindre-violet-3.jpg',
  'sac-cylindre/IMG_5615.JPG': 'sac-cylindre/sac-cylindre-wax-orange-1.jpg',
  'sac-cylindre/IMG_5625.JPG': 'sac-cylindre/sac-cylindre-wax-orange-2.jpg',
  'sac-cylindre/IMG_5631.JPG': 'sac-cylindre/sac-cylindre-wax-orange-3.jpg',
  'sac-cylindre/IMG_5660.JPG': 'sac-cylindre/sac-cylindre-wax-bleu-1.jpg',
  'sac-cylindre/IMG_5672.JPG': 'sac-cylindre/sac-cylindre-wax-bleu-2.jpg',
  'sac-cylindre/IMG_5676.JPG': 'sac-cylindre/sac-cylindre-wax-bleu-3.jpg',
  'sac-cylindre/IMG_5679.JPG': 'sac-cylindre/sac-cylindre-wax-bleu-4.jpg',

  // ========================================
  // SAC U
  // ========================================
  'sac-u/IMG_4975.JPG': 'sac-u/sac-u-classique-1.jpg',
  'sac-u/IMG_4993.JPG': 'sac-u/sac-u-classique-2.jpg',
  'sac-u/IMG_5021.JPG': 'sac-u/sac-u-classique-3.jpg',
  'sac-u/IMG_5000.JPG': 'sac-u/sac-u-wax-gold-1.jpg',
  'sac-u/IMG_5007.JPG': 'sac-u/sac-u-wax-bleu-1.jpg',
  'sac-u/IMG_5010.JPG': 'sac-u/sac-u-wax-bleu-2.jpg',
  'sac-u/IMG_5017.JPG': 'sac-u/sac-u-wax-bleu-3.jpg',
  'sac-u/IMG_5027.JPG': 'sac-u/sac-u-wax-vert-1.jpg',
  'sac-u/IMG_5034.JPG': 'sac-u/sac-u-wax-vert-2.jpg',
  'sac-u/IMG_5041.JPG': 'sac-u/sac-u-wax-vert-3.jpg',
  'sac-u/IMG_5059.JPG': 'sac-u/sac-u-wax-orange-1.jpg',
  'sac-u/IMG_5133.JPG': 'sac-u/sac-u-wax-orange-2.jpg',
  'sac-u/IMG_5144.JPG': 'sac-u/sac-u-wax-orange-3.jpg',
  'sac-u/IMG_5158.JPG': 'sac-u/sac-u-wax-violet-1.jpg',
  'sac-u/IMG_5178.JPG': 'sac-u/sac-u-wax-violet-2.jpg',
  'sac-u/IMG_5190 2.JPG': 'sac-u/sac-u-wax-multicolore-1.jpg',
  'sac-u/IMG_5195.JPG': 'sac-u/sac-u-wax-multicolore-2.jpg',
  'sac-u/IMG_5202.JPG': 'sac-u/sac-u-wax-multicolore-3.jpg',
  'sac-u/IMG_5207.JPG': 'sac-u/sac-u-wax-multicolore-4.jpg',

  // ========================================
  // PORTE-CARTE
  // ========================================
  'porte-carte/IMG_6139.JPG': 'porte-carte/porte-carte-wax-orange-1.jpg',
  'porte-carte/IMG_6142.JPG': 'porte-carte/porte-carte-wax-orange-2.jpg',
  'porte-carte/IMG_6145.JPG': 'porte-carte/porte-carte-wax-orange-3.jpg',
  'porte-carte/IMG_6168.JPG': 'porte-carte/porte-carte-wax-bleu-1.jpg',
  'porte-carte/IMG_6175.JPG': 'porte-carte/porte-carte-wax-bleu-2.jpg',
  'porte-carte/IMG_6183.JPG': 'porte-carte/porte-carte-wax-jaune-1.jpg',
  'porte-carte/IMG_6187.JPG': 'porte-carte/porte-carte-wax-jaune-2.jpg',
  'porte-carte/IMG_6188.JPG': 'porte-carte/porte-carte-wax-jaune-3.jpg',
  'porte-carte/IMG_6198.JPG': 'porte-carte/porte-carte-wax-violet-1.jpg',
  'porte-carte/IMG_6200.JPG': 'porte-carte/porte-carte-wax-violet-2.jpg',
};

const imagesDir = path.join(__dirname, '..', 'public', 'images');

console.log('🔄 Début du renommage des images...\n');

let successCount = 0;
let errorCount = 0;
let skippedCount = 0;

Object.entries(renameMap).forEach(([oldPath, newPath]) => {
  const oldFullPath = path.join(imagesDir, oldPath);
  const newFullPath = path.join(imagesDir, newPath);

  // Vérifier si le fichier source existe
  if (!fs.existsSync(oldFullPath)) {
    console.log(`⚠️  SKIP: ${oldPath} (fichier introuvable)`);
    skippedCount++;
    return;
  }

  // Vérifier si le nouveau nom existe déjà
  if (fs.existsSync(newFullPath)) {
    console.log(`⚠️  SKIP: ${newPath} (fichier existe déjà)`);
    skippedCount++;
    return;
  }

  try {
    fs.renameSync(oldFullPath, newFullPath);
    console.log(`✅ ${oldPath} → ${newPath}`);
    successCount++;
  } catch (error) {
    console.error(`❌ ERREUR: ${oldPath}`);
    console.error(`   ${error.message}`);
    errorCount++;
  }
});

console.log('\n' + '='.repeat(50));
console.log(`✅ Succès: ${successCount}`);
console.log(`⚠️  Ignorés: ${skippedCount}`);
console.log(`❌ Erreurs: ${errorCount}`);
console.log('='.repeat(50));

if (successCount > 0) {
  console.log('\n⚠️  N\'oubliez pas de mettre à jour productImages.js !');
}
