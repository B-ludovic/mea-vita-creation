const emailStyles = require('./emailStyles');

const getLogoUrl = () => {
  const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  return `${baseUrl}/Logo_Francois_sansfond.PNG`;
};

const getSecureUrl = (path) => {
  const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  return `${baseUrl}${path}`;
};

const refundEmailTemplate = (firstName, order) => {
  return `
    <div style="${emailStyles.container}">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="display: inline-flex; align-items: center; gap: 12px;">
          <img src="${getLogoUrl()}" alt="Logo" width="40" height="40" style="vertical-align: middle;" />
          <span style="font-size: 28px; font-weight: 700; color: #2C2C2C; font-family: 'Playfair Display', serif;">Mea Vita Création</span>
        </div>
      </div>
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${getSecureUrl('/icones/money-back.png')}" alt="Remboursement" width="80" height="80" />
      </div>
      <h1 style="${emailStyles.mainTitle}">Remboursement confirmé</h1>
      
      <p style="${emailStyles.paragraph}">
        Bonjour ${firstName},
      </p>
      
      <p style="${emailStyles.paragraph}">
        Nous vous confirmons que votre commande <strong>${order.orderNumber}</strong> a été remboursée.
      </p>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <h3 style="${emailStyles.secondaryTitle}; margin-top: 0;">Détails du remboursement</h3>
        <p style="${emailStyles.paragraph}; margin: 10px 0;"><strong>Montant remboursé :</strong> ${order.totalAmount.toFixed(2)} €</p>
        <p style="${emailStyles.paragraph}; margin: 10px 0;"><strong>Numéro de commande :</strong> ${order.orderNumber}</p>
        <p style="${emailStyles.paragraph}; margin: 10px 0;"><strong>Date :</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
      </div>
      
      <div style="background: linear-gradient(135deg, #FFDA44, #FFAB00); padding: 20px; border-radius: 10px; margin: 20px 0; color: #2C2C2C;">
        <p style="margin: 0; font-weight: bold; font-size: 16px;">
          <img src="${getSecureUrl('/icones/sand-timer.png')}" alt="Délai" width="20" height="20" style="vertical-align: middle; margin-right: 8px;" />
          Délai de traitement
        </p>
        <p style="margin: 10px 0 0 0; font-size: 15px;">
          Le remboursement sera visible sur votre compte bancaire sous 5 à 10 jours ouvrés.
        </p>
      </div>
      
      <p style="${emailStyles.paragraph}">
        Si vous avez des questions, n'hésitez pas à nous contacter.
      </p>
      
      <p style="${emailStyles.footer}">
        Cordialement,<br>
        L'équipe Mea Vita Création
      </p>
      
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
      
      <p style="color: #999; font-size: 12px; text-align: center;">
        Mea Vita Création<br>
        © ${new Date().getFullYear()} Tous droits réservés
      </p>
    </div>
  `;
};

module.exports = refundEmailTemplate;
