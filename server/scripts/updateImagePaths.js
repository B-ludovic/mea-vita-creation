const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateStaticImagePaths() {
  console.log('🔄 Mise à jour des chemins d\'images statiques...\n');

  try {
    // Mapping des anciens vers nouveaux chemins
    const pathMappings = [
      { old: '/images/porte-carte/', new: '/images/porte-cartes/' },
      { old: '/images/sac-cylindre/', new: '/images/sacs-cylindre/' },
      { old: '/images/sac-u/', new: '/images/sacs-u/' }
    ];

    let totalUpdated = 0;

    for (const mapping of pathMappings) {
      // Trouver toutes les images avec l'ancien chemin
      const images = await prisma.productImage.findMany({
        where: {
          url: {
            startsWith: mapping.old
          }
        }
      });

      console.log(`📁 ${images.length} image(s) trouvée(s) pour ${mapping.old}`);

      // Mettre à jour chaque image
      for (const image of images) {
        const newUrl = image.url.replace(mapping.old, mapping.new);
        
        await prisma.productImage.update({
          where: { id: image.id },
          data: { url: newUrl }
        });

        console.log(`  ✅ ${image.url} → ${newUrl}`);
        totalUpdated++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`✅ Total mis à jour: ${totalUpdated} image(s)`);
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updateStaticImagePaths();
