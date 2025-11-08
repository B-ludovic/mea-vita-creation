// Importer Stripe avec la clé secrète
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const prisma = require('../config/prisma');

// FONCTION POUR CRÉER UNE SESSION DE PAIEMENT STRIPE
// Cette fonction crée une session Stripe et renvoie l'URL pour payer
const createCheckoutSession = async (req, res) => {
  try {
    // Récupérer les données envoyées par le front-end
    const { items, userId } = req.body;

    // Vérifier que les données sont présentes
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Le panier est vide'
      });
    }

    // Transformer les items du panier au format Stripe
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          description: item.description || 'Création artisanale François Maroquinerie',
        },
        unit_amount: Math.round(item.price * 100), // Stripe utilise les centimes
      },
      quantity: item.quantity,
    }));

    // Créer la session de paiement Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/panier`,
      metadata: {
        userId: userId || 'guest',
      },
    });

    // Renvoyer l'URL de paiement au front-end
    res.json({
      success: true,
      url: session.url
    });

  } catch (error) {
    console.error('Erreur lors de la création de la session Stripe:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la session de paiement'
    });
  }
};

// FONCTION POUR VÉRIFIER LE STATUT D'UN PAIEMENT
const verifyPayment = async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Récupérer la session depuis Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      // Le paiement est réussi
      res.json({
        success: true,
        paymentStatus: 'paid',
        session
      });
    } else {
      res.json({
        success: false,
        paymentStatus: session.payment_status
      });
    }

  } catch (error) {
    console.error('Erreur lors de la vérification du paiement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification du paiement'
    });
  }
};

// Exporter les fonctions
module.exports = {
  createCheckoutSession,
  verifyPayment
};