// Service d'envoi d'emails avec Resend
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationEmail = async (userEmail, userName, verificationToken) => {
  try {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

    const { data, error } = await resend.emails.send({
      from: 'François Maroquinerie <onboarding@resend.dev>',
      to: [userEmail],
      subject: 'Vérifiez votre adresse email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #FF6B35;">Bienvenue sur Méa Vita Création</h1>
          <p>Bonjour ${userName},</p>
          <p>Merci de vous être inscrit. Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous :</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background: linear-gradient(135deg, #FF6B35, #FF8C42); 
                      color: white; 
                      padding: 15px 35px; 
                      text-decoration: none; 
                      border-radius: 50px;
                      display: inline-block;">
              Vérifier mon email
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${process.env.CLIENT_URL || 'http://localhost:3000'}/congratulation.png" alt="Bienvenue" width="80" height="80" />
          </div>
          <h1 style="color: #FF6B35;">Bienvenue ${userName} !</h1>
          <p style="font-size: 16px; line-height: 1.6;">
            Merci de nous avoir rejoint ! Nous sommes ravis de vous compter parmi nos clients.
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            Découvrez nos créations artisanales uniques et laissez-vous séduire par l'art de la maroquinerie africaine.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:3000/categories" 
               style="background: linear-gradient(135deg, #FF6B35, #FF8C42); 
                      color: white; 
                      padding: 15px 35px; 
                      text-decoration: none; 
                      border-radius: 50px;
                      display: inline-block;">
              Découvrir nos créations
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
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
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          ${item.Product?.name || 'Produit'}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          ${item.unitPrice.toFixed(2)}€
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">
          ${item.totalPrice.toFixed(2)}€
        </td>
      </tr>
    `).join('');

    const { data, error } = await resend.emails.send({
      from: 'François Maroquinerie <onboarding@resend.dev>',
      to: [userEmail],
      subject: `Confirmation de commande ${order.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${process.env.CLIENT_URL || 'http://localhost:3000'}/payment.png" alt="Confirmation" width="80" height="80" />
          </div>
          <h1 style="color: #FF6B35;">Merci pour votre commande !</h1>
          <p style="font-size: 16px; line-height: 1.6;">
            Bonjour ${userName},
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            Votre commande <strong>${order.orderNumber}</strong> a bien été confirmée et est en cours de préparation.
          </p>
          
          <h2 style="color: #333; margin-top: 30px;">Récapitulatif de votre commande</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background: #f5f5f5;">
                <th style="padding: 10px; text-align: left;">Produit</th>
                <th style="padding: 10px; text-align: center;">Qté</th>
                <th style="padding: 10px; text-align: right;">Prix unitaire</th>
                <th style="padding: 10px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${productsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 15px 10px; text-align: right; font-size: 18px; font-weight: bold;">
                  Total :
                </td>
                <td style="padding: 15px 10px; text-align: right; font-size: 18px; font-weight: bold; color: #FF6B35;">
                  ${order.totalAmount.toFixed(2)}€
                </td>
              </tr>
            </tfoot>
          </table>
          
          <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <img src="${process.env.CLIENT_URL || 'http://localhost:3000'}/delivery-box.png" alt="Livraison" width="24" height="24" style="margin-right: 10px;" />
              <p style="margin: 0; color: #2e7d32; font-weight: bold;">
                Paiement confirmé
              </p>
            </div>
            <p style="margin: 10px 0 0 0; color: #666;">
              Votre commande sera expédiée sous 2-3 jours ouvrés.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:3000/mes-commandes" 
               style="background: linear-gradient(135deg, #FF6B35, #FF8C42); 
                      color: white; 
                      padding: 15px 35px; 
                      text-decoration: none; 
                      border-radius: 50px;
                      display: inline-block;">
              Voir ma commande
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Si vous avez des questions, n'hésitez pas à nous contacter.<br><br>
            Merci de votre confiance,<br>
            L'équipe 
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
  sendOrderConfirmationEmail
};