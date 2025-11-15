// Service d'envoi d'emails avec Resend
const { Resend } = require('resend');
const emailStyles = require('../templates/emailStyles');

const resend = new Resend(process.env.RESEND_API_KEY);

// Fonction pour obtenir l'URL du logo
const getLogoUrl = () => {
  const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  return `${baseUrl}/Logo_Francois_sansfond.PNG`;
};

// Fonction pour sécuriser les URLs
const getSecureUrl = (path) => {
  const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  return `${baseUrl}${path}`;
};

const sendVerificationEmail = async (userEmail, userName, verificationToken) => {
  try {
    const verificationUrl = getSecureUrl(`/verify-email?token=${verificationToken}`);

    const { data, error } = await resend.emails.send({
      from: 'Mea Vita Création <onboarding@resend.dev>',
      to: [userEmail],
      subject: 'Vérifiez votre adresse email',
      html: `
        <div style="${emailStyles.container}">
          <div style="${emailStyles.logoContainer}">
            <img src="${getLogoUrl()}" alt="Mea Vita Création" width="120" />
          </div>
          <h1 style="${emailStyles.mainTitle}">Bienvenue sur Mea Vita Création</h1>
          <p style="${emailStyles.paragraph}">Bonjour ${userName},</p>
          <p style="${emailStyles.paragraph}">Merci de vous être inscrit. Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous :</p>
          <div style="${emailStyles.buttonContainer}">
            <a href="${verificationUrl}" style="${emailStyles.buttonPrimary}">
              Vérifier mon email
            </a>
          </div>
          <p style="${emailStyles.smallText}">
            Ce lien est valable pendant 24 heures.<br>
            Si vous n'avez pas créé de compte, ignorez cet email.
          </p>
        </div>
      `
    });

    if (error) {
      console.error('Erreur envoi email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return { success: false, error };
  }
};

const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Mea Vita Création <onboarding@resend.dev>',
      to: [userEmail],
      subject: 'Bienvenue chez Mea Vita Création !',
      html: `
        <div style="${emailStyles.container}">
          <div style="${emailStyles.logoContainer}">
            <img src="${getLogoUrl()}" alt="Mea Vita Création" width="120" />
          </div>
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${getSecureUrl('/congratulation.png')}" alt="Bienvenue" width="80" height="80" />
          </div>
          <h1 style="${emailStyles.mainTitle}">Bienvenue ${userName} !</h1>
          <p style="${emailStyles.paragraph}">
            Merci de nous avoir rejoint ! Nous sommes ravis de vous compter parmi nos clients.
          </p>
          <p style="${emailStyles.paragraph}">
            Découvrez nos créations artisanales uniques et laissez-vous séduire par l'art de la maroquinerie.
          </p>
          <div style="${emailStyles.buttonContainer}">
            <a href="${getSecureUrl('/categories')}" style="${emailStyles.buttonPrimary}">
              Découvrir nos créations
            </a>
          </div>
          <p style="${emailStyles.footer}">
            À très bientôt,<br>
            L'équipe Mea Vita Création
          </p>
        </div>
      `
    });

    if (error) {
      console.error('Erreur envoi email:', error);
      return { success: false, error };
    }

    console.log('✅ Email de bienvenue envoyé à:', userEmail);
    return { success: true, data };

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return { success: false, error };
  }
};

// FONCTION POUR ENVOYER UN EMAIL DE CONFIRMATION DE COMMANDE
const sendOrderConfirmationEmail = async (userEmail, userName, order) => {
  try {
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

    const { data, error } = await resend.emails.send({
      from: 'Mea Vita Création <onboarding@resend.dev>',
      to: [userEmail],
      subject: `Confirmation de commande ${order.orderNumber}`,
      html: `
        <div style="${emailStyles.container}">
          <div style="${emailStyles.logoContainer}">
            <img src="${getLogoUrl()}" alt="Mea Vita Création" width="120" />
          </div>
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${getSecureUrl('/payment.png')}" alt="Confirmation" width="80" height="80" />
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
              <img src="${getSecureUrl('/delivery-box.png')}" alt="Livraison" width="24" height="24" style="margin-right: 10px;" />
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
              <img src="${getSecureUrl('/payment.png')}" alt="Facture" width="16" height="16" style="vertical-align: middle; margin-right: 5px;" />
              Télécharger la facture
            </a>
          </div>
          
          <p style="${emailStyles.footer}">
            Si vous avez des questions, n'hésitez pas à nous contacter.<br><br>
            Merci de votre confiance,<br>
            L'équipe Mea Vita Création
          </p>
        </div>
      `
    });

    if (error) {
      console.error('Erreur envoi email:', error);
      return { success: false, error };
    }

    return { success: true, data };

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return { success: false, error };
  }
};

// FONCTION POUR ENVOYER UN EMAIL DE RÉINITIALISATION DE MOT DE PASSE
const sendPasswordResetEmail = async (userEmail, userName, resetToken) => {
  try {
    const resetUrl = getSecureUrl(`/reset-password?token=${resetToken}`);

    const { data, error } = await resend.emails.send({
      from: 'Mea Vita Création <onboarding@resend.dev>',
      to: [userEmail],
      subject: 'Réinitialisation de votre mot de passe',
      html: `
        <div style="${emailStyles.container}">
          <div style="${emailStyles.logoContainer}">
            <img src="${getLogoUrl()}" alt="Mea Vita Création" width="120" />
          </div>
          <h1 style="${emailStyles.mainTitle}">Réinitialisation de mot de passe</h1>
          <p style="${emailStyles.paragraph}">Bonjour ${userName},</p>
          <p style="${emailStyles.paragraph}">Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :</p>
          <div style="${emailStyles.buttonContainer}">
            <a href="${resetUrl}" style="${emailStyles.buttonPrimary}">
              Réinitialiser mon mot de passe
            </a>
          </div>
          <p style="${emailStyles.smallText}">
            Ce lien est valable pendant 1 heure.<br>
            Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
          </p>
        </div>
      `
    });

    if (error) {
      console.error('Erreur envoi email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return { success: false, error };
  }
};

// Exporter les fonctions
module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendPasswordResetEmail
};