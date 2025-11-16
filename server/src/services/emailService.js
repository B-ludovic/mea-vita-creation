// Service d'envoi d'emails avec Resend
const { Resend } = require('resend');
const verificationEmailTemplate = require('../templates/verificationEmailTemplate');
const welcomeEmailTemplate = require('../templates/welcomeEmailTemplate');
const orderConfirmationTemplate = require('../templates/orderConfirmationTemplate');
const passwordResetTemplate = require('../templates/passwordResetTemplate');
const shippingEmailTemplate = require('../templates/shippingEmailTemplate');
const contactEmailTemplate = require('../templates/contactEmailTemplate');

const resend = new Resend(process.env.RESEND_API_KEY);

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
      html: verificationEmailTemplate(userName, verificationUrl)
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
      html: welcomeEmailTemplate(userName)
    });

    if (error) {
      console.error('Erreur envoi email:', error.message);
      return { success: false, error };
    }

    // Email de bienvenue envoyé (log retiré pour sécurité - pas d'exposition d'email)
    return { success: true, data };

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error.message);
    return { success: false, error };
  }
};

// FONCTION POUR ENVOYER UN EMAIL DE CONFIRMATION DE COMMANDE
const sendOrderConfirmationEmail = async (userEmail, userName, order) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Mea Vita Création <onboarding@resend.dev>',
      to: [userEmail],
      subject: `Confirmation de commande ${order.orderNumber}`,
      html: orderConfirmationTemplate(userName, order)
    });

    if (error) {
      console.error('Erreur envoi email:', error.message);
      return { success: false, error };
    }

    return { success: true, data };

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error.message);
    return { success: false, error };
  }
};

// FONCTION POUR ENVOYER UN EMAIL D'EXPÉDITION
const sendShippingEmail = async (userEmail, userName, order) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Mea Vita Création <onboarding@resend.dev>',
      to: [userEmail],
      subject: `📦 Votre commande ${order.orderNumber} a été expédiée !`,
      html: shippingEmailTemplate(userName, order)
    });

    if (error) {
      console.error('Erreur envoi email d\'expédition:', error.message);
      return { success: false, error };
    }

    // Email d'expédition envoyé (log retiré pour sécurité - pas d'exposition d'email)
    return { success: true, data };

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email d\'expédition:', error.message);
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
      html: passwordResetTemplate(userName, resetUrl)
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

// FONCTION POUR ENVOYER UN EMAIL DE CONTACT À L'ADMIN
const sendContactEmail = async (name, email, subject, message) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'François Maroquinerie <onboarding@resend.dev>',
      to: ['ton-email@exemple.com'], // REMPLACE par vrai email plus tard 
      replyTo: email, // Le client peut répondre directement
      subject: `📧 Nouveau message : ${subject}`,
      html: contactEmailTemplate(name, email, subject, message)
    });

    if (error) {
      console.error('Erreur envoi email de contact:', error.message);
      return { success: false, error };
    }

    // Email de contact envoyé (log retiré pour sécurité)
    return { success: true, data };

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de contact:', error.message);
    return { success: false, error };
  }
};

// Exporter les fonctions
module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendPasswordResetEmail,
  sendShippingEmail,
  sendContactEmail
};