const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function migrateExistingInvoices() {
  console.log('🔄 Migration des factures existantes vers la BDD...\n');

  try {
    // Chemin du dossier invoices
    const invoicesDir = path.join(__dirname, '../invoices');
    
    // Vérifier si le dossier existe
    if (!fs.existsSync(invoicesDir)) {
      console.log('⚠️  Aucun dossier invoices trouvé');
      return;
    }

    // Lire tous les fichiers PDF
    const files = fs.readdirSync(invoicesDir);
    const pdfFiles = files.filter(file => file.endsWith('.pdf'));

    console.log(`📁 ${pdfFiles.length} fichier(s) PDF trouvé(s)\n`);

    let created = 0;
    let skipped = 0;
    let errors = 0;

    for (const filename of pdfFiles) {
      try {
        // Extraire le numéro de commande du nom du fichier
        // Format attendu: facture-CMD-xxxxx.pdf ou facture-xxxxxxxx.pdf
        const match = filename.match(/facture-(.+)\.pdf$/);
        
        if (!match) {
          console.log(`⚠️  Fichier ignoré (format non reconnu): ${filename}`);
          skipped++;
          continue;
        }

        const orderNumber = match[1];
        
        // Trouver la commande correspondante
        const order = await prisma.order.findUnique({
          where: { orderNumber }
        });

        if (!order) {
          console.log(`⚠️  Commande introuvable pour: ${orderNumber}`);
          skipped++;
          continue;
        }

        // Vérifier si une facture existe déjà pour cette commande
        const existingInvoice = await prisma.invoice.findFirst({
          where: { 
            invoiceNumber: orderNumber,
            type: 'INVOICE' // On ne crée que les factures de vente ici
          }
        });

        if (existingInvoice) {
          console.log(`⏭️  Facture déjà existante: ${orderNumber}`);
          skipped++;
          continue;
        }

        // Créer l'enregistrement Invoice
        const pdfPath = path.join(invoicesDir, filename);
        
        await prisma.invoice.create({
          data: {
            invoiceNumber: orderNumber,
            orderId: order.id,
            type: 'INVOICE',
            amount: order.totalAmount,
            pdfPath: pdfPath,
            createdAt: order.createdAt // Utiliser la date de la commande
          }
        });

        console.log(`✅ Facture créée: ${orderNumber} (${order.totalAmount.toFixed(2)}€)`);
        created++;

      } catch (error) {
        console.error(`❌ Erreur pour ${filename}:`, error.message);
        errors++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 RÉSUMÉ DE LA MIGRATION');
    console.log('='.repeat(50));
    console.log(`✅ Factures créées: ${created}`);
    console.log(`⏭️  Factures ignorées: ${skipped}`);
    console.log(`❌ Erreurs: ${errors}`);
    console.log('='.repeat(50) + '\n');

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter la migration
migrateExistingInvoices();
