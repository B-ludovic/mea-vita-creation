// Utilitaire pour optimiser les images avec Sharp
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

/**
 * Optimise une image en créant plusieurs versions
 * @param {string} inputPath - Chemin de l'image source
 * @param {string} outputDir - Dossier de sortie
 * @param {string} filename - Nom du fichier (sans extension)
 * @returns {Promise<Object>} - Chemins des images générées
 */
const optimizeImage = async (inputPath, outputDir, filename) => {
  try {
    // Créer le dossier de sortie s'il n'existe pas
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Configurations pour chaque taille
    const sizes = {
      thumbnail: { width: 150, height: 150, quality: 80 },
      medium: { width: 600, height: 600, quality: 85 },
      large: { width: 1200, height: 1200, quality: 90 }
    };

    const results = {};

    // Générer chaque version
    for (const [sizeName, config] of Object.entries(sizes)) {
      const outputFilename = `${filename}-${sizeName}.webp`;
      const outputPath = path.join(outputDir, outputFilename);

      await sharp(inputPath)
        .resize(config.width, config.height, {
          fit: 'inside', // Garde le ratio, l'image tient dans les dimensions
          withoutEnlargement: true // Ne pas agrandir si l'image est plus petite
        })
        .webp({ quality: config.quality }) // Convertir en WebP
        .toFile(outputPath);

      results[sizeName] = outputFilename;
      console.log(`✅ Image ${sizeName} générée: ${outputFilename}`);
    }

    // Optionnel : Garder l'original optimisé
    const originalOptimized = `${filename}-original.webp`;
    const originalPath = path.join(outputDir, originalOptimized);
    
    await sharp(inputPath)
      .webp({ quality: 92 })
      .toFile(originalPath);
    
    results.original = originalOptimized;
    console.log(`✅ Image originale optimisée: ${originalOptimized}`);

    return results;

  } catch (error) {
    console.error('❌ Erreur lors de l\'optimisation de l\'image:', error);
    throw error;
  }
};

/**
 * Obtenir les métadonnées d'une image
 * @param {string} imagePath - Chemin de l'image
 * @returns {Promise<Object>} - Métadonnées (largeur, hauteur, format, taille)
 */
const getImageMetadata = async (imagePath) => {
  try {
    const metadata = await sharp(imagePath).metadata();
    const stats = fs.statSync(imagePath);

    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: stats.size, // Taille en octets
      sizeKB: (stats.size / 1024).toFixed(2), // Taille en KB
      sizeMB: (stats.size / 1024 / 1024).toFixed(2) // Taille en MB
    };
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des métadonnées:', error);
    throw error;
  }
};

/**
 * Optimiser une image existante (pour migration)
 * @param {string} imagePath - Chemin de l'image à optimiser
 * @param {string} outputDir - Dossier de sortie
 * @returns {Promise<Object>} - Chemins des images générées
 */
const optimizeExistingImage = async (imagePath, outputDir) => {
  const filename = path.basename(imagePath, path.extname(imagePath));
  return await optimizeImage(imagePath, outputDir, filename);
};

/**
 * Optimiser toutes les images d'un dossier
 * @param {string} inputDir - Dossier source
 * @param {string} outputDir - Dossier de sortie
 * @returns {Promise<Array>} - Liste des résultats
 */
const optimizeAllImagesInFolder = async (inputDir, outputDir) => {
  try {
    const files = fs.readdirSync(inputDir);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const results = [];

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      
      if (imageExtensions.includes(ext)) {
        const inputPath = path.join(inputDir, file);
        const filename = path.basename(file, ext);
        
        console.log(`\n📸 Optimisation de: ${file}`);
        const result = await optimizeImage(inputPath, outputDir, filename);
        results.push({ original: file, optimized: result });
      }
    }

    return results;
  } catch (error) {
    console.error('❌ Erreur lors de l\'optimisation du dossier:', error);
    throw error;
  }
};

/**
 * Optimiser toutes les images de manière récursive (avec sous-dossiers)
 * @param {string} inputDir - Dossier source
 * @param {string} outputDir - Dossier de sortie
 * @returns {Promise<Array>} - Liste des résultats
 */
const optimizeAllImagesRecursive = async (inputDir, outputDir) => {
  try {
    const items = fs.readdirSync(inputDir);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const results = [];

    for (const item of items) {
      const inputPath = path.join(inputDir, item);
      const stats = fs.statSync(inputPath);

      // Si c'est un dossier, on le traite récursivement
      if (stats.isDirectory()) {
        console.log(`\n📁 Exploration du dossier: ${item}`);
        
        // Créer le même dossier dans le dossier de sortie
        const subOutputDir = path.join(outputDir, item);
        const subResults = await optimizeAllImagesRecursive(inputPath, subOutputDir);
        results.push(...subResults);
      } 
      // Si c'est une image, on l'optimise
      else {
        const ext = path.extname(item).toLowerCase();
        
        if (imageExtensions.includes(ext)) {
          const filename = path.basename(item, ext);
          
          console.log(`\n📸 Optimisation de: ${item}`);
          const result = await optimizeImage(inputPath, outputDir, filename);
          results.push({ original: item, optimized: result });
        }
      }
    }

    return results;
  } catch (error) {
    console.error('❌ Erreur lors de l\'optimisation récursive:', error);
    throw error;
  }
};

module.exports = {
  optimizeImage,
  getImageMetadata,
  optimizeExistingImage,
  optimizeAllImagesInFolder,
  optimizeAllImagesRecursive
};