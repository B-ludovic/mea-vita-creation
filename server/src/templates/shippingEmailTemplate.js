const emailStyles = require('./emailStyles');

// Fonction pour nettoyer le HTML et éviter les failles XSS
const sanitizeHtml = (text) => {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

const getLogoUrl = () => {
  const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  return `${baseUrl}/Logo_Francois_sansfond.PNG`;
};

const getSecureUrl = (path) => {
  const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  return `${baseUrl}${path}`;
};

const shippingEmailTemplate = (userName, order) => {
  // Nettoyer les données pour éviter les failles XSS
  const safeUserName = sanitizeHtml(userName);
  const safeOrderNumber = sanitizeHtml(order.orderNumber);
  const safeTrackingNumber = sanitizeHtml(order.trackingNumber);
  const safeCarrier = sanitizeHtml(order.carrier);
  
  // Limiter la longueur du numéro de tracking pour le design
  const displayTrackingNumber = safeTrackingNumber && safeTrackingNumber.length > 50 
    ? safeTrackingNumber.substring(0, 50) + '...' 
    : safeTrackingNumber;

  // Créer le HTML des produits
  const productsHtml = order.OrderItem.map(item => `
    <tr>
      <td style="${emailStyles.tableCell}">
        ${sanitizeHtml(item.Product?.name || 'Produit')}
      </td>
      <td style="${emailStyles.tableCellCenter}">
        ${sanitizeHtml(String(item.quantity))}
      </td>
      <td style="${emailStyles.tableCellRight}">
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
        <img src="${getSecureUrl('/icones/delivery.png')}" alt="Expédition" width="80" height="80" />
      </div>
      <h1 style="${emailStyles.mainTitle}">
        Bonne nouvelle ! 
        <img src="${getSecureUrl('/icones/congratulation.png')}" alt="Félicitations" width="28" height="28" style="vertical-align: middle; margin-left: 5px;" />
      </h1>
      <p style="${emailStyles.paragraph}">
        Bonjour ${safeUserName},
      </p>
      <p style="${emailStyles.paragraph}">
        Votre commande <strong>${safeOrderNumber}</strong> a été expédiée et est en route vers vous !
      </p>
      
      <div style="${emailStyles.successBox}">
        <div style="${emailStyles.successBoxTitle}">
          <img src="${getSecureUrl('/icones/delivery-box.png')}" alt="Tracking" width="24" height="24" style="margin-right: 10px;" />
          <span>Informations de suivi</span>
        </div>
        
        ${safeTrackingNumber ? `
          <p style="margin: 10px 0; color: #333;">
            <strong>Numéro de suivi :</strong><br/>
            <span style="font-size: 18px; color: #FFAB00; font-weight: bold;">${displayTrackingNumber}</span>
          </p>
        ` : ''}
        
        ${safeCarrier ? `
          <p style="margin: 10px 0; color: #333;">
            <strong>Transporteur :</strong> ${safeCarrier}
          </p>
        ` : ''}
        
        ${order.shippedAt ? `
          <p style="margin: 10px 0; color: #333;">
            <strong>Date d'expédition :</strong> ${new Date(order.shippedAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        ` : ''}
      </div>
      
      ${order.trackingUrl ? `
        <div style="${emailStyles.buttonContainer}">
          <a href="${order.trackingUrl}" style="${emailStyles.buttonPrimary}">
            <img src="${getSecureUrl('/icones/location.png')}" alt="Suivre" width="16" height="16" style="vertical-align: middle; margin-right: 5px;" />
            Suivre ma commande
          </a>
        </div>
      ` : ''}
      
      <h2 style="${emailStyles.secondaryTitle}">Récapitulatif de votre commande</h2>
      
      <table style="${emailStyles.table}">
        <thead>
          <tr style="background: #f5f5f5;">
            <th style="${emailStyles.tableHeader}">Produit</th>
            <th style="${emailStyles.tableHeader}; text-align: center;">Qté</th>
            <th style="${emailStyles.tableHeader}; text-align: right;">Prix</th>
          </tr>
        </thead>
        <tbody>
          ${productsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="${emailStyles.tableFooter}">
              Total :
            </td>
            <td style="${emailStyles.tableTotal}">
              ${order.totalAmount.toFixed(2)}€
            </td>
          </tr>
        </tfoot>
      </table>
      
      <div style="${emailStyles.infoBox}">
        <p style="margin: 0; color: #e65100;">
          <img src="${getSecureUrl('/icones/delivery.png')}" alt="Info" width="16" height="16" style="vertical-align: middle; margin-right: 5px;" />
          <strong>Astuce :</strong> Vous pouvez suivre votre colis en temps réel avec le numéro de suivi ci-dessus.
        </p>
      </div>
      
      <div style="${emailStyles.buttonContainer}">
        <a href="${getSecureUrl('/mes-commandes')}" style="${emailStyles.buttonSecondary}">
          Voir mes commandes
        </a>
      </div>
      
      <p style="${emailStyles.footer}">
        Merci pour votre confiance !<br><br>
        L'équipe Mea Vita Création<br>
        <a href="mailto:contact@mea-vita-creation.fr" style="color: #FFAB00; text-decoration: none;">contact@mea-vita-creation.fr</a>
      </p>
    </div>
  `;
};

module.exports = shippingEmailTemplate;
