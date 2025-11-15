const emailStyles = require('./emailStyles');

const getLogoUrl = () => {
  const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  return `${baseUrl}/Logo_Francois_sansfond.PNG`;
};

const getSecureUrl = (path) => {
  const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  return `${baseUrl}${path}`;
};

const orderConfirmationTemplate = (userName, order) => {
  // Créer le HTML des produits
  const productsHtml = order.OrderItem.map(item => `
    <tr>
      <td style="${emailStyles.tableCell}">
        ${item.Product?.name || 'Produit'}
      </td>
      <td style="${emailStyles.tableCellCenter}">
        ${item.quantity}
      </td>
      <td style="${emailStyles.tableCellRight}">
        ${item.unitPrice.toFixed(2)}€
      </td>
      <td style="${emailStyles.tableCellBold}">
        ${item.totalPrice.toFixed(2)}€
      </td>
    </tr>
  `).join('');

  return `
    <div style="${emailStyles.container}">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="display: inline-flex; align-items: center; gap: 12px;">
          <img src="${getLogoUrl()}" alt="Logo" width="40" height="40" style="vertical-align: middle;" />
          <span style="font-size: 28px; font-weight: 700; color: #2C2C2C; font-family: 'Playfair Display', serif;">Mea Vita Création</span>
        </div>
      </div>
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${getSecureUrl('/icones/payment.png')}" alt="Confirmation" width="80" height="80" />
      </div>
      <h1 style="${emailStyles.mainTitle}">Merci pour votre commande !</h1>
      <p style="${emailStyles.paragraph}">
        Bonjour ${userName},
      </p>
      <p style="${emailStyles.paragraph}">
        Votre commande <strong>${order.orderNumber}</strong> a bien été confirmée et est en cours de préparation.
      </p>
      
      <h2 style="${emailStyles.secondaryTitle}">Récapitulatif de votre commande</h2>
      
      <table style="${emailStyles.table}">
        <thead>
          <tr style="background: #f5f5f5;">
            <th style="${emailStyles.tableHeader}">Produit</th>
            <th style="${emailStyles.tableHeader}; text-align: center;">Qté</th>
            <th style="${emailStyles.tableHeader}; text-align: right;">Prix unitaire</th>
            <th style="${emailStyles.tableHeader}; text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${productsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="${emailStyles.tableFooter}">
              Total :
            </td>
            <td style="${emailStyles.tableTotal}">
              ${order.totalAmount.toFixed(2)}€
            </td>
          </tr>
        </tfoot>
      </table>
      
      <div style="${emailStyles.successBox}">
        <div style="${emailStyles.successBoxTitle}">
          <img src="${getSecureUrl('/icones/delivery-box.png')}" alt="Livraison" width="24" height="24" style="margin-right: 10px;" />
          <span>Paiement confirmé</span>
        </div>
        <p style="margin: 10px 0 0 0; color: #666;">
          Votre commande sera expédiée sous 2-3 jours ouvrés.
        </p>
      </div>
      
      <div style="${emailStyles.buttonContainer}">
        <a href="${getSecureUrl('/mes-commandes')}" style="${emailStyles.buttonPrimary}">
          Voir ma commande
        </a>
        <a href="${getSecureUrl(`/mes-commandes#invoice-${order.id}`)}" style="${emailStyles.buttonSecondary}">
          <img src="${getSecureUrl('/icones/payment.png')}" alt="Facture" width="16" height="16" style="vertical-align: middle; margin-right: 5px;" />
          Télécharger la facture
        </a>
      </div>
      
      <p style="${emailStyles.footer}">
        Si vous avez des questions, n'hésitez pas à nous contacter.<br><br>
        Merci de votre confiance,<br>
        L'équipe Mea Vita Création
      </p>
    </div>
  `;
};

module.exports = orderConfirmationTemplate;
