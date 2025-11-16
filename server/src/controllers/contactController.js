// Contrôleur pour les messages de contact avec protection Honeypot
const { PrismaClient } = require('@prisma/client');
const { sendContactEmail } = require('../services/emailService');
const prisma = new PrismaClient();

// FONCTION POUR ENVOYER UN MESSAGE DE CONTACT (AVEC HONEYPOT)
const sendContactMessage = async (req, res) => {
  try {
    const { name, email, phone, interest, message, website } = req.body;

    
    // HONEYPOT : Protection anti-bot
    // Si le champ "website" est rempli, c'est un bot !
    if (website) {
      console.log('🤖 Bot détecté sur formulaire de contact !');
      console.log('   Champ honeypot rempli:', website);
      console.log('   IP:', req.ip);
      console.log('   User-Agent:', req.headers['user-agent']);
      
      // On fait semblant que tout est OK pour ne pas alerter le bot
      return res.json({
        success: true,
        message: 'Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.'
      });
      // En réalité, on n'envoie rien et on ne sauvegarde rien
    }

   
    // Validation des champs obligatoires
    
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Nom, email et message requis'
      });
    }

    // Utiliser interest comme subject, sinon mettre un message par défaut
    const subject = interest || 'Nouveau message de contact';

    // Construire le message complet avec les infos supplémentaires
    let fullMessage = message;
    if (phone) {
      fullMessage = `Téléphone: ${phone}\n\n${message}`;
    }

    
    // Sauvegarder dans la base de données
    
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message: fullMessage
      }
    });

    console.log('✅ Message de contact sauvegardé:', contactMessage.id);

    
    // Envoyer un email à l'admin
    
    await sendContactEmail(name, email, subject, fullMessage);

    console.log('✅ Email de contact envoyé à l\'admin');

   
    // Réponse au client
   
    res.json({
      success: true,
      message: 'Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.'
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi du message:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi du message'
    });
  }
};

// FONCTION POUR RÉCUPÉRER TOUS LES MESSAGES (ADMIN)
const getAllContactMessages = async (req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      messages
    });

  } catch (error) {
    console.error('Erreur:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// FONCTION POUR MARQUER UN MESSAGE COMME LU (ADMIN)
const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    await prisma.contactMessage.update({
      where: { id: messageId },
      data: { isRead: true }
    });

    res.json({
      success: true,
      message: 'Message marqué comme lu'
    });

  } catch (error) {
    console.error('Erreur:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// FONCTION POUR SUPPRIMER UN MESSAGE (ADMIN)
const deleteContactMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    await prisma.contactMessage.delete({
      where: { id: messageId }
    });

    res.json({
      success: true,
      message: 'Message supprimé'
    });

  } catch (error) {
    console.error('Erreur:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

module.exports = {
  sendContactMessage,
  getAllContactMessages,
  markAsRead,
  deleteContactMessage
};