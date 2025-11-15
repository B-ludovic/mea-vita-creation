// Service de génération de factures PDF
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Fonction pour générer une facture PDF
const generateInvoice = async (order, user) => {
  return new Promise((resolve, reject) => {
    try {
      // Validation des données
      if (!order || !user) {
        return reject(new Error('Commande ou utilisateur manquant'));
      }

      // Créer le dossier invoices s'il n'existe pas
      const invoicesDir = path.join(__dirname, '../../invoices');
      if (!fs.existsSync(invoicesDir)) {
        fs.mkdirSync(invoicesDir, { recursive: true });
      }

      // Nom du fichier PDF
      const orderNumber = order.orderNumber || `CMD-${order.id}`;
      const filename = `facture-${orderNumber}.pdf`;
      const filepath = path.join(invoicesDir, filename);

      // Créer un nouveau document PDF
      const doc = new PDFDocument({ margin: 50 });

      // Pipe vers un fichier
      const writeStream = fs.createWriteStream(filepath);
      doc.pipe(writeStream);

      // Chemin du logo
      const logoPath = path.join(__dirname, '../../../client/my-app/public/Logo_Francois_sansfond.PNG');

      // Ajouter le logo si le fichier existe
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 50, 45, { width: 80 });
      }

      // En-tête avec infos entreprise (décalé à droite du logo)
      doc
        .fontSize(20)
        .fillColor('#FFAB00')
        .text('MEA VITA CRÉATION', 145, 50);

      doc
        .fontSize(10)
        .fillColor('#333333')
        .text('Artisan maroquinier', 145, 80)
        .text('Maroquinerie artisanale de luxe', 145, 95)
        .text('Paris, France', 145, 110)
        .text('contact@meavitacreation.fr', 145, 125)
        .text('SIRET: 123 456 789 00012', 145, 140);

      // Titre FACTURE
      doc
        .fontSize(28)
        .fillColor('#FFAB00')
        .text('FACTURE', 400, 50);

      // Numéro de facture et date
      const invoiceDate = new Date(order.createdAt);
      const formattedDate = invoiceDate.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      doc
        .fontSize(10)
        .fillColor('#333333')
        .text(`N° ${orderNumber}`, 400, 90)
        .text(`Date: ${formattedDate}`, 400, 115);

      // Ligne de séparation
      doc
        .moveTo(50, 170)
        .lineTo(550, 170)
        .stroke('#E0E0E0');

      // Informations client
      doc
        .fontSize(12)
        .fillColor('#FFAB00')
        .text('FACTURÉ À :', 50, 190);

      doc
        .fontSize(10)
        .fillColor('#333333')
        .text(`${user.firstName} ${user.lastName}`, 50, 210)
        .text(user.email, 50, 225);

      // Si l'adresse existe
      const address = order.Address;
      if (address) {
        doc
          .text(address.street, 50, 240)
          .text(`${address.postalCode} ${address.city}`, 50, 255)
          .text(address.country || 'France', 50, 270);
      }

      // Tableau des produits
      const tableTop = 320;
      
      // En-tête du tableau
      doc
        .fontSize(10)
        .fillColor('#FFFFFF')
        .rect(50, tableTop, 500, 25)
        .fill('#FFAB00');

      doc
        .fillColor('#FFFFFF')
        .text('Produit', 110, tableTop + 8)
        .text('Qté', 340, tableTop + 8)
        .text('Prix Unit.', 400, tableTop + 8)
        .text('Total', 490, tableTop + 8);

      // Lignes des produits
      let y = tableTop + 35;
      
      order.OrderItem.forEach((item) => {
        // Chemin de l'image du produit
        const productImagePath = item.Product.ProductImage && item.Product.ProductImage.length > 0
          ? path.join(__dirname, '../../../client/my-app/public', item.Product.ProductImage[0].url)
          : path.join(__dirname, '../../../client/my-app/public/icones/default.png');

        // Ajouter l'image du produit si elle existe
        if (fs.existsSync(productImagePath)) {
          try {
            doc.image(productImagePath, 60, y - 5, { width: 40, height: 40, fit: [40, 40] });
          } catch (error) {
            console.error('Erreur lors du chargement de l\'image produit:', error);
          }
        }

        // Informations du produit (décalées pour laisser la place à l'image)
        doc
          .fontSize(9)
          .fillColor('#333333')
          .text(item.Product.name, 110, y + 5, { width: 220 })
          .text(item.quantity.toString(), 340, y + 15)
          .text(`${item.unitPrice.toFixed(2)}€`, 400, y + 15)
          .text(`${item.totalPrice.toFixed(2)}€`, 490, y + 15);

        y += 50; // Plus d'espace pour les images

        // Ligne de séparation
        doc
          .moveTo(50, y - 5)
          .lineTo(550, y - 5)
          .stroke('#E0E0E0');
      });

      // Total
      y += 20;
      
      doc
        .fontSize(12)
        .fillColor('#333333')
        .text('TOTAL HT:', 380, y)
        .text(`${order.totalAmount.toFixed(2)}€`, 480, y);

      y += 20;
      
      const tva = order.totalAmount * 0.2; // TVA 20%
      doc
        .fontSize(10)
        .text('TVA (20%):', 380, y)
        .text(`${tva.toFixed(2)}€`, 480, y);

      y += 20;
      
      const totalTTC = order.totalAmount + tva;
      doc
        .fontSize(14)
        .fillColor('#FFAB00')
        .text('TOTAL TTC:', 380, y)
        .text(`${totalTTC.toFixed(2)}€`, 480, y);

      // Pied de page - Réduit pour tenir sur une page
      doc
        .fontSize(8)
        .fillColor('#666666')
        .text(
          'Merci pour votre confiance ! • Mea Vita Création',
          50,
          y + 40,
          { align: 'center' }
        );

      // Finaliser le PDF
      doc.end();

      // Attendre que le fichier soit écrit
      writeStream.on('finish', () => {
        resolve(filepath);
      });

      writeStream.on('error', (error) => {
        reject(error);
      });

    } catch (error) {
      reject(error);
    }
  });
};

// Exporter la fonction
module.exports = {
  generateInvoice
};