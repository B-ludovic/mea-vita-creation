// Importer Prisma
const prisma = require('../config/prisma');

// Importer les utilitaires pour les transporteurs
const {
  generateTrackingUrl,
  validateTrackingNumber,
  getCarriersList,
  carriers
} = require('../utils/carriers');

// FONCTION POUR CRÉER UNE COMMANDE
// Cette fonction est appelée après un paiement Stripe réussi
const createOrder = async (req, res) => {
  try {
    const { userId, items, totalAmount, stripeSessionId, addressId } = req.body;

    // Vérifier que les données sont présentes
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucun article dans la commande'
      });
    }

    // Générer un numéro de commande unique
    const orderNumber = `CMD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Créer la commande dans la base de données
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: userId || null,
        addressId: addressId || null,
        status: 'PENDING',
        subtotal: totalAmount,
        shippingCost: 0,
        taxAmount: 0,
        discountAmount: 0,
        totalAmount,
        stripePaymentIntentId: stripeSessionId,
        // Créer les items de la commande
        OrderItem: {
          create: items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: item.price * item.quantity
          }))
        }
      },
      include: {
        OrderItem: {
          include: {
            Product: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la commande'
    });
  }
};

// FONCTION POUR RÉCUPÉRER LES COMMANDES D'UN UTILISATEUR
const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    // Récupérer toutes les commandes de l'utilisateur
    const orders = await prisma.order.findMany({
      where: {
        userId
      },
      include: {
        OrderItem: {
          include: {
            Product: {
              include: {
                ProductImage: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      orders
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur' 
    });
  }
};

// FONCTION POUR RÉCUPÉRER UNE COMMANDE PAR SON ID
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        OrderItem: {
          include: {
            Product: {
              include: {
                ProductImage: true
              }
            }
          }
        },
        Address: true
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }

    res.json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la commande'
    });
  }
};

// FONCTION POUR METTRE À JOUR LE STATUT D'UNE COMMANDE
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });

    res.json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la commande:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la commande'
    });
  }
};

// FONCTION POUR METTRE À JOUR LE TRACKING D'UNE COMMANDE (ADMIN)
const updateTracking = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { trackingNumber, trackingUrl, carrier, status } = req.body;

    // Validation : au moins un champ doit être fourni
    if (!trackingNumber && !trackingUrl && !carrier && !status) {
      return res.status(400).json({
        success: false,
        message: 'Aucune donnée à mettre à jour'
      });
    }

    // Valider le numéro de tracking si fourni
    if (trackingNumber && carrier && !validateTrackingNumber(carrier, trackingNumber)) {
      return res.status(400).json({
        success: false,
        message: `Format du numéro de tracking invalide pour ${carrier}`
      });
    }

    // Générer automatiquement l'URL si non fournie
    let finalTrackingUrl = trackingUrl;
    if (!finalTrackingUrl && trackingNumber && carrier) {
      finalTrackingUrl = generateTrackingUrl(carrier, trackingNumber);
      if (finalTrackingUrl) {
        console.log(`✅ URL de tracking générée automatiquement: ${finalTrackingUrl}`);
      }
    }

    const updateData = {};

    // Ajouter les champs uniquement s'ils sont fournis
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (finalTrackingUrl) updateData.trackingUrl = finalTrackingUrl;
    if (carrier) updateData.carrier = carrier;

    // Gestion du statut avec validation
    const validStatuses = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];
    
    if (status) {
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Statut invalide. Statuts autorisés: ${validStatuses.join(', ')}`
        });
      }

      updateData.status = status;

      // Ajouter les dates automatiquement selon le statut
      if (status === 'SHIPPED') {
        updateData.shippedAt = new Date();
      }
      
      if (status === 'DELIVERED') {
        updateData.deliveredAt = new Date();
      }
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        User: true,
        OrderItem: {
          include: {
            Product: true
          }
        }
      }
    });

    // TODO: Envoyer un email au client si expédié
    if (status === 'SHIPPED' && order.User) {
      console.log(`📧 Email d'expédition à envoyer à ${order.User.email}`);
      // On ajoutera l'envoi d'email après
    }

    res.json({
      success: true,
      order,
      message: 'Informations de suivi mises à jour avec succès',
      trackingUrlGenerated: !trackingUrl && !!finalTrackingUrl
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du tracking:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du tracking'
    });
  }
};

// Exporter les fonctions
module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  updateTracking
};