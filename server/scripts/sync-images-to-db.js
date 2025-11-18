// Script pour synchroniser les images de productImages.js vers la base de données
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Configuration des images (copié depuis productImages.js)
const PRODUCT_IMAGES = {
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
  'lartisan-ebene': [
    '/images/pochettes-unisexe/artisan-ebene-1.jpg',
    '/images/pochettes-unisexe/artisan-ebene-2.jpg',
  ],
  'lartisan-azur': [
    '/images/pochettes-unisexe/artisan-azur-1.jpg',
  ],
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

async function syncImagesToDatabase() {
  console.log('🚀 Démarrage de la synchronisation des images...\n');

  let totalAdded = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  for (const [productSlug, imageUrls] of Object.entries(PRODUCT_IMAGES)) {
    try {
      // Trouver le produit par son slug
      const product = await prisma.product.findUnique({
        where: { slug: productSlug },
        include: { ProductImage: true }
      });

      if (!product) {
        console.log(`⚠️  Produit non trouvé: ${productSlug}`);
        totalSkipped++;
        continue;
      }

      console.log(`📦 Traitement: ${product.name} (${imageUrls.length} images)`);

      // Supprimer toutes les images existantes
      await prisma.productImage.deleteMany({
        where: { productId: product.id }
      });

      // Ajouter toutes les images
      for (let i = 0; i < imageUrls.length; i++) {
        const imageUrl = imageUrls[i];
        
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: imageUrl,
            alt: product.name,
            order: i
          }
        });

        console.log(`   ✅ Ajoutée: ${imageUrl}`);
        totalAdded++;
      }

      console.log('');

    } catch (error) {
      console.error(`❌ Erreur pour ${productSlug}:`, error.message);
      totalErrors++;
    }
  }

  console.log('\n📊 RÉSUMÉ:');
  console.log(`   ✅ Images ajoutées: ${totalAdded}`);
  console.log(`   ⚠️  Produits ignorés: ${totalSkipped}`);
  console.log(`   ❌ Erreurs: ${totalErrors}`);
  console.log('\n✨ Synchronisation terminée!');
}

syncImagesToDatabase()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('💥 Erreur fatale:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
