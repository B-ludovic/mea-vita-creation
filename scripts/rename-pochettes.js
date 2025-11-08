const fs = require('fs');
const path = require('path');

// Configuration des renommages pour les pochettes unisexe
const renameMapping = {
  // Modèle "L'Atlas" (Design Asymétrique)
  'IMG_5723.JPG': 'latlas-fogo-1.JPG',
  'IMG_5729.JPG': 'latlas-fogo-2.JPG',
  'IMG_6126.JPG': 'latlas-solaire-1.JPG',
  'IMG_6016.JPG': 'latlas-solaire-2.JPG',
  'IMG_6114.JPG': 'latlas-urbain-1.JPG',
  'IMG_6061.JPG': 'latlas-terre-et-mer-1.JPG',
  
  // Modèle "L'Artisan" (Design avec Dragonne)
  'IMG_5739.JPG': 'lartisan-ebene-1.JPG',
  'IMG_5747.JPG': 'lartisan-ebene-2.JPG',
  'IMG_6094.JPG': 'lartisan-azur-1.JPG',
  
  // Modèle "Le Cachet" (Design avec Bouton)
  'IMG_6081.JPG': 'le-cachet-ardoise-1.JPG',
};

const imagesDir = path.join(__dirname, '../public/images/pochettes-unisexe');

console.log('🔄 Début du renommage des fichiers...\n');

Object.entries(renameMapping).forEach(([oldName, newName]) => {
  const oldPath = path.join(imagesDir, oldName);
  const newPath = path.join(imagesDir, newName);
  
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`✅ ${oldName} → ${newName}`);
  } else {
    console.log(`⚠️  ${oldName} introuvable`);
  }
});

console.log('\n✨ Renommage terminé !\n');
console.log('📝 Mettez à jour productImages.js avec les nouveaux noms de fichiers.');
