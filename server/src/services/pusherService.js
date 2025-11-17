// Service de notifications en temps réel avec Pusher
const Pusher = require('pusher');

// Initialiser Pusher
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true
});

// NOTIFICATIONS ADMIN

// Envoyer une notification de nouvelle commande à l'admin
const notifyNewOrder = async (order) => {
  try {
    await pusher.trigger('admin-channel', 'new-order', {
      type: 'new-order',
      title: 'Nouvelle commande !',
      message: `Commande ${order.orderNumber} - ${order.totalAmount.toFixed(2)}€`,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        customerName: order.User ? `${order.User.firstName} ${order.User.lastName}` : 'Client invité'
      },
      timestamp: new Date().toISOString()
    });
    console.log('✅ Notification Pusher envoyée : Nouvelle commande');
  } catch (error) {
    console.error('❌ Erreur Pusher:', error.message);
  }
};

// Notification nouveau message de contact
const notifyNewContactMessage = async (message) => {
  try {
    await pusher.trigger('admin-channel', 'new-contact-message', {
      type: 'new-contact-message',
      title: 'Nouveau message de contact',
      message: `${message.name} - ${message.subject}`,
      data: {
        messageId: message.id,
        name: message.name,
        email: message.email,
        subject: message.subject
      },
      timestamp: new Date().toISOString()
    });
    console.log('✅ Notification Pusher envoyée : Nouveau message');
  } catch (error) {
    console.error('❌ Erreur Pusher:', error.message);
  }
};

// Notification nouvel avis en attente
const notifyNewReview = async (review) => {
  try {
    await pusher.trigger('admin-channel', 'new-review', {
      type: 'new-review',
      title: 'Nouvel avis en attente de modération',
      message: `⭐${review.rating}/5 - ${review.Product.name}`,
      data: {
        reviewId: review.id,
        rating: review.rating,
        productName: review.Product.name,
        userName: review.User ? `${review.User.firstName} ${review.User.lastName}` : 'Anonyme'
      },
      timestamp: new Date().toISOString()
    });
    console.log('✅ Notification Pusher envoyée : Nouvel avis');
  } catch (error) {
    console.error('❌ Erreur Pusher:', error.message);
  }
};

// Notification stock faible
const notifyLowStock = async (product) => {
  try {
    await pusher.trigger('admin-channel', 'low-stock', {
      type: 'low-stock',
      title: 'Stock faible !',
      message: `${product.name} - Plus que ${product.stock} en stock`,
      data: {
        productId: product.id,
        productName: product.name,
        stock: product.stock
      },
      timestamp: new Date().toISOString()
    });
    console.log('✅ Notification Pusher envoyée : Stock faible');
  } catch (error) {
    console.error('❌ Erreur Pusher:', error.message);
  }
};

// NOTIFICATIONS UTILISATEUR

// Notification mise à jour commande (expédition, livraison)
const notifyOrderUpdate = async (userId, order, updateType) => {
  try {
    let title, message;
    
    switch (updateType) {
      case 'SHIPPED':
        title = 'Votre commande a été expédiée !';
        message = `Commande ${order.orderNumber} - Suivez votre colis`;
        break;
      case 'DELIVERED':
        title = 'Votre commande est livrée !';
        message = `Commande ${order.orderNumber} - N'hésitez pas à laisser un avis`;
        break;
      default:
        title = 'Mise à jour de votre commande';
        message = `Commande ${order.orderNumber}`;
    }

    await pusher.trigger(`user-${userId}`, 'order-update', {
      type: 'order-update',
      title,
      message,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        trackingNumber: order.trackingNumber,
        carrier: order.carrier
      },
      timestamp: new Date().toISOString()
    });
    console.log(`✅ Notification Pusher envoyée : Mise à jour commande (user ${userId})`);
  } catch (error) {
    console.error('❌ Erreur Pusher:', error.message);
  }
};

// Notification nouveau code promo disponible
const notifyNewPromoCode = async (promoCode) => {
  try {
    await pusher.trigger('public-channel', 'new-promo-code', {
      type: 'new-promo-code',
      title: 'Nouveau code promo disponible !',
      message: `${promoCode.code} : -${promoCode.discountType === 'PERCENTAGE' ? promoCode.discountValue + '%' : promoCode.discountValue + '€'}`,
      data: {
        code: promoCode.code,
        discountType: promoCode.discountType,
        discountValue: promoCode.discountValue,
        endDate: promoCode.endDate
      },
      timestamp: new Date().toISOString()
    });
    console.log('✅ Notification Pusher envoyée : Nouveau code promo (broadcast)');
  } catch (error) {
    console.error('❌ Erreur Pusher:', error.message);
  }
};

// Exporter les fonctions
module.exports = {
  pusher,
  notifyNewOrder,
  notifyNewContactMessage,
  notifyNewReview,
  notifyLowStock,
  notifyOrderUpdate,
  notifyNewPromoCode
};