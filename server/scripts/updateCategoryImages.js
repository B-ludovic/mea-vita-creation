const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateCategoryImages() {
  console.log('🔄 Mise à jour des images des catégories...');

  try {
    // Pochettes Unisexe
    await prisma.category.update({
      where: { slug: 'pochettes-unisexe' },
      data: { image: '/images/pochettes-unisexe/atlas-solaire-1.jpg' }
    });
    console.log('✅ Pochettes Unisexe mis à jour');

    // Porte-Cartes
    await prisma.category.update({
      where: { slug: 'porte-cartes' },
      data: { image: '/images/porte-cartes/eclat-solaire-1.jpg' }
    });
    console.log('✅ Porte-Cartes mis à jour');

    // Sacs Cylindre
    await prisma.category.update({
      where: { slug: 'sacs-cylindre' },
      data: { image: '/images/sacs-cylindre/tambour-solaire-1.jpg' }
    });
    console.log('✅ Sacs Cylindre mis à jour');

    // Sacs U
    await prisma.category.update({
      where: { slug: 'sacs-u' },
      data: { image: '/images/sacs-u/arche-besace-fogo-1.jpg' }
    });
    console.log('✅ Sacs U mis à jour');

    console.log('\n✨ Toutes les images des catégories ont été mises à jour avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updateCategoryImages();
