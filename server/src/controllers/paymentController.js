// Importer Stripe avec la clé secrète
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const prisma = require('../config/prisma');

// importer Pusher pour les notifications en temps réel
const { notifyNewOrder, notifyLowStock, notifyNewInvoice } = require('../services/pusherService');

// Importer le service d'email
const { sendOrderConfirmationEmail, sendRefundEmail } = require('../services/emailService');

// Importer le service de génération de factures
const { generateInvoice } = require('../services/invoiceService');

// Importer la fonction pour incrémenter l'usage du code promo
const { incrementPromoCodeUsage } = require('./promoCodeController');

// FONCTION POUR CRÉER UNE SESSION DE PAIEMENT STRIPE
// Cette fonction crée une session Stripe et renvoie l'URL pour payer
const createCheckoutSession = async (req, res) => {
    try {
        // Récupérer les données envoyées par le front-end (y compris addressId)
        const { items, addressId, promoCodeId } = req.body;

        // SÉCURITÉ 1 : userId provient du token JWT vérifié, jamais du body client
        const userId = req.user.userId;

        // SÉCURITÉ 2 : VÉRIFIER QU'UNE ADRESSE DE LIVRAISON EST FOURNIE
        if (!addressId) {
            return res.status(400).json({
                success: false,
                message: 'Une adresse de livraison est requise'
            });
        }

        // SÉCURITÉ 3 : VÉRIFIER QUE L'ADRESSE APPARTIENT BIEN À L'UTILISATEUR
        const address = await prisma.address.findFirst({
            where: {
                id: addressId,
                userId: userId
            }
        });

        if (!address) {
            return res.status(403).json({
                success: false,
                message: 'Adresse de livraison invalide ou non autorisée'
            });
        }

        // Vérifier que les données sont présentes
        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Le panier est vide'
            });
        }

        // VALIDATION DU STOCK DES PRODUITS
        // On vérifie que chaque produit du panier est encore disponible
        const stockErrors = []; // Tableau pour stocker les erreurs

        // On parcourt chaque produit du panier un par un
        for (const item of items) {
            // 1. Récupérer le produit depuis la base de données
            const product = await prisma.product.findUnique({
                where: { id: item.id } // Chercher par ID
            });

            // Vérifier si le produit existe toujours
            if (!product) {
                stockErrors.push(`Le produit "${item.name}" n'existe plus`);
                continue; // Passer au produit suivant
            }

            // Vérifier le stock disponible
            if (product.stock < item.quantity) {
                // Si stock = 0 → rupture totale
                if (product.stock === 0) {
                    stockErrors.push(`"${item.name}" est en rupture de stock`);
                }
                // Si stock > 0 mais insuffisant
                else {
                    stockErrors.push(`"${item.name}" : seulement ${product.stock} disponible(s) (vous en demandez ${item.quantity})`);
                }
            }
        }

        // Si on a trouvé des erreurs, on arrête ici
        if (stockErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Stock insuffisant',
                errors: stockErrors // On renvoie la liste des problèmes
            });
        }

        // VALIDATION ET APPLICATION DU CODE PROMO
        let promoCode = null;
        let discountAmountCalculated = 0;

        if (promoCodeId) {
            // Récupérer le code promo
            promoCode = await prisma.promoCode.findUnique({
                where: { id: promoCodeId }
            });

            if (!promoCode) {
                return res.status(404).json({
                    success: false,
                    message: 'Code promo invalide'
                });
            }

            // Vérifier si le code est actif
            if (!promoCode.isActive) {
                return res.status(400).json({
                    success: false,
                    message: 'Ce code promo n\'est plus actif'
                });
            }

            // Vérifier les dates
            const now = new Date();
            if (new Date(promoCode.startDate) > now || new Date(promoCode.endDate) < now) {
                return res.status(400).json({
                    success: false,
                    message: 'Ce code promo n\'est pas valide actuellement'
                });
            }

            // Vérifier le nombre d'utilisations
            if (promoCode.maxUses && promoCode.currentUses >= promoCode.maxUses) {
                return res.status(400).json({
                    success: false,
                    message: 'Ce code promo a atteint sa limite d\'utilisation'
                });
            }
        }

        // Transformer les items du panier au format Stripe
        const lineItems = items.map((item) => ({
            price_data: {
                currency: 'eur',
                product_data: {
                    name: item.name,
                    description: item.description || 'Création Mea Vita Création',
                },
                unit_amount: Math.round(item.price * 100), // Stripe utilise les centimes
            },
            quantity: item.quantity,
        }));

        // Calculer le total des items
        const totalAmount = lineItems.reduce((sum, item) =>
            sum + (item.price_data.unit_amount * item.quantity), 0
        ) / 100; // Convertir de centimes en euros

        // Variable pour le coupon Stripe (si promo code)
        let stripeCoupon = null;

        // Calculer la réduction si code promo
        if (promoCode) {
            if (promoCode.discountType === 'PERCENTAGE') {
                discountAmountCalculated = (totalAmount * promoCode.discountValue) / 100;
            } else if (promoCode.discountType === 'FIXED_AMOUNT') {
                discountAmountCalculated = promoCode.discountValue;
            }

            // Ne pas dépasser le montant total
            if (discountAmountCalculated > totalAmount) {
                discountAmountCalculated = totalAmount;
            }

            // Créer un coupon Stripe dynamique pour cette réduction
            stripeCoupon = await stripe.coupons.create({
                amount_off: Math.round(discountAmountCalculated * 100), // En centimes
                currency: 'eur',
                duration: 'once',
                name: `Code promo: ${promoCode.code}`
            });
        }

        // Ne stocker que les données essentielles pour le webhook (limite 500 caractères)
        const itemsForMetadata = items.map(item => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price
        }));

        // Vérifier la taille des métadonnées (limite Stripe : 500 caractères par champ)
        const itemsMetadata = JSON.stringify(itemsForMetadata);
        if (itemsMetadata.length > 450) {
            console.warn('Métadonnées items trop volumineuses:', itemsMetadata.length, 'caractères');
            // Fallback : stocker uniquement les IDs et quantités
            const minimalItems = items.map(item => ({ i: item.id, q: item.quantity }));
            itemsMetadata = JSON.stringify(minimalItems);
        }

        // Créer la session de paiement Stripe
        const sessionConfig = {
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/panier`,
            metadata: {
                userId: userId || 'guest',
                addressId: addressId || null,
                promoCodeId: promoCodeId || null,
                items: itemsMetadata
            }
        };

        // Ajouter le coupon s'il existe
        if (stripeCoupon) {
            sessionConfig.discounts = [{
                coupon: stripeCoupon.id
            }];
        }

        const session = await stripe.checkout.sessions.create(sessionConfig);

        // Renvoyer l'URL de paiement au front-end
        res.json({
            success: true,
            url: session.url
        });

    } catch (error) {
        // SÉCURITÉ : Ne pas logger les détails de paiement
        console.error('Erreur lors de la création de la session Stripe:', error.message);
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

        // SÉCURITÉ : Vérifier que la session appartient à l'utilisateur connecté
        const sessionUserId = session.metadata?.userId;
        if (sessionUserId !== req.user.userId && req.user.role !== 'ADMIN') {
            return res.status(403).json({
                success: false,
                message: 'Accès refusé'
            });
        }

        if (session.payment_status === 'paid') {
            res.json({
                success: true,
                paymentStatus: 'paid'
            });
        } else {
            res.json({
                success: false,
                paymentStatus: session.payment_status
            });
        }

    } catch (error) {
        // SÉCURITÉ : Logger uniquement le message
        console.error('Erreur lors de la vérification du paiement:', error.message);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur'
        });
    }
};

// FONCTION WEBHOOK STRIPE (AVEC GESTION DES REMBOURSEMENTS)
// Cette fonction est appelée automatiquement par Stripe quand un événement se produit
const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        // Vérifier que la requête vient bien de Stripe
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error('❌ Erreur de vérification de signature webhook:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log('✅ Webhook vérifié:', event.type);


    // GÉRER LES DIFFÉRENTS TYPES D'ÉVÉNEMENTS

    // ÉVÉNEMENT 1 : PAIEMENT RÉUSSI
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        console.log('💳 Paiement réussi pour la session:', session.id);

        try {
            // Récupérer les items ET l'addressId depuis les metadata
            const items = JSON.parse(session.metadata.items);
            const userId = session.metadata.userId !== 'guest' ? session.metadata.userId : null;
            const addressId = session.metadata.addressId || null;
            const promoCodeId = session.metadata.promoCodeId || null;

            // Incrémenter l'usage du code promo si utilisé
            if (promoCodeId) {
                await incrementPromoCodeUsage(promoCodeId);
                console.log('Code promo incrémenté');
            }

            // Créer la commande
            const order = await prisma.order.create({
                data: {
                    orderNumber: `CMD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                    userId,
                    addressId, // Enregistrer l'adresse de livraison
                    status: 'PAID', // Le paiement est déjà confirmé
                    subtotal: session.amount_total / 100, // Stripe envoie en centimes
                    shippingCost: 0,
                    taxAmount: 0,
                    discountAmount: 0,
                    totalAmount: session.amount_total / 100,
                    stripePaymentIntentId: session.payment_intent,
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
                    OrderItem: { include: { Product: true } },
                    User: true
                }
            });

            // Notifier l'admin via Pusher
            await notifyNewOrder(order);

            console.log('✅ Commande créée:', order.orderNumber, '(Stripe PI:', session.payment_intent, ')');

            // Décrémenter le stock des produits ET vérifier le stock faible
            for (const item of items) {
                const updatedProduct = await prisma.product.update({
                    where: { id: item.id },
                    data: {
                        stock: {
                            decrement: item.quantity
                        }
                    }
                });

                // 🔔 Notification si stock faible (≤ 3 unités)
                if (updatedProduct.stock <= 3 && updatedProduct.stock > 0) {
                    await notifyLowStock(updatedProduct);
                    console.log(`⚠️ Stock faible pour "${updatedProduct.name}": ${updatedProduct.stock} unité(s)`);
                }
            }

            console.log('✅ Stock mis à jour');

            // Envoyer l'email de confirmation (si l'utilisateur est connecté)
            if (userId) {
                const user = await prisma.user.findUnique({
                    where: { id: userId }
                });

                if (user) {
                    // Recharger la commande avec les relations pour l'email
                    const orderWithDetails = await prisma.order.findUnique({
                        where: { id: order.id },
                        include: {
                            OrderItem: {
                                include: {
                                    Product: true
                                }
                            },
                            Address: true
                        }
                    });

                    sendOrderConfirmationEmail(user.email, user.firstName, orderWithDetails)
                        .then(() => {
                            console.log('✅ Email de confirmation envoyé à:', user.email.substring(0, 3) + '***');
                        })
                        .catch(err => {
                            console.error('❌ Erreur envoi email confirmation:', err.message);
                            console.error('   Commande:', order.orderNumber, '- Email non envoyé mais commande créée');
                            // TODO: Implémenter système de retry ou notification admin
                        });
                    
                    // Générer la facture PDF automatiquement
                    try {
                        await generateInvoice(orderWithDetails, user, 'INVOICE');
                        console.log('✅ Facture générée automatiquement pour:', order.orderNumber);
                        
                        // 🔔 Notifier l'admin qu'une nouvelle facture a été générée
                        await notifyNewInvoice(order.orderNumber);
                    } catch (invoiceError) {
                        console.error('❌ Erreur génération facture:', invoiceError.message);
                        // La commande est créée même si la facture échoue
                    }
                }
            }

        } catch (error) {
            console.error('❌ Erreur lors de la création de la commande:', error.message);
        }
    }


    // ÉVÉNEMENT 2 : REMBOURSEMENT

    else if (event.type === 'charge.refunded') {
        const charge = event.data.object;

        try {
            const refundedAmount = charge.amount_refunded / 100;
            const totalAmount = charge.amount / 100;
            const isPartialRefund = refundedAmount < totalAmount;

            console.log(`🔄 Remboursement détecté: ${refundedAmount}€ / ${totalAmount}€ (${isPartialRefund ? 'PARTIEL' : 'TOTAL'})`);
            console.log('   Charge ID:', charge.id);

            // Trouver la commande correspondante via le payment_intent
            const paymentIntent = charge.payment_intent;

            // Chercher la commande avec ce payment_intent
            const order = await prisma.order.findFirst({
                where: {
                    stripePaymentIntentId: paymentIntent
                },
                include: {
                    OrderItem: {
                        include: {
                            Product: true
                        }
                    },
                    User: true
                }
            });

            if (!order) {
                console.log('⚠️ Commande non trouvée pour ce remboursement');
                return res.json({ received: true });
            }

            console.log('📦 Commande trouvée:', order.orderNumber);

            // Gérer différemment selon type de remboursement
            if (isPartialRefund) {
                console.log('⚠️ Remboursement partiel détecté - Stock non modifié');
                console.log(`   Montant remboursé: ${refundedAmount}€ sur ${totalAmount}€`);

                // Mettre à jour le statut → PARTIALLY_REFUNDED
                await prisma.order.update({
                    where: { id: order.id },
                    data: {
                        status: 'PARTIALLY_REFUNDED',
                        refundedAmount: refundedAmount
                    }
                });

                console.log('✅ Statut mis à jour → PARTIALLY_REFUNDED');
                console.log('⚠️ Action manuelle requise pour gestion du stock');

                // Créer une facture de remboursement partiel
                try {
                    await generateInvoice(order, order.User, 'REFUND_PARTIAL');
                    console.log('✅ Facture de remboursement partiel générée');
                    
                    // Notifier l'admin via Pusher
                    await notifyNewInvoice(order.orderNumber);
                } catch (invoiceError) {
                    console.error('❌ Erreur génération facture remboursement partiel:', invoiceError.message);
                }
            } else {
                // Remboursement total : traitement automatique

                // Mettre à jour le statut de la commande
                await prisma.order.update({
                    where: { id: order.id },
                    data: {
                        status: 'REFUNDED',
                        refundedAmount: refundedAmount
                    }
                });

                console.log('✅ Statut mis à jour → REFUNDED');
                console.log(`   Montant total remboursé: ${refundedAmount}€`);

                // Réaugmenter le stock des produits
                for (const item of order.OrderItem) {
                    await prisma.product.update({
                        where: { id: item.productId },
                        data: {
                            stock: {
                                increment: item.quantity
                            }
                        }
                    });
                    console.log(`✅ Stock réaugmenté pour ${item.Product.name}: +${item.quantity}`);
                }

                // Créer une facture de remboursement total
                try {
                    await generateInvoice(order, order.User, 'REFUND_FULL');
                    console.log('✅ Facture de remboursement total générée');
                    
                    // Notifier l'admin via Pusher
                    await notifyNewInvoice(order.orderNumber);
                } catch (invoiceError) {
                    console.error('❌ Erreur génération facture remboursement total:', invoiceError.message);
                }

                // Envoyer un email au client
                if (order.User) {
                    await sendRefundEmail(order.User.email, order.User.firstName, order)
                        .then(() => {
                            console.log('✅ Email de remboursement envoyé');
                        })
                        .catch(err => {
                            console.error('❌ Erreur envoi email remboursement:', err.message);
                        });
                }
            }

        } catch (error) {
            console.error('❌ Erreur lors du traitement du remboursement:', error.message);
            return res.status(500).json({ error: 'Erreur traitement remboursement' });
        }
    }


    // ÉVÉNEMENT 3 : ÉCHEC DE PAIEMENT

    else if (event.type === 'payment_intent.payment_failed') {
        console.log('❌ Échec du paiement');
    }


    // ÉVÉNEMENTS NON GÉRÉS

    else {
        console.log(`ℹ️ Événement non géré: ${event.type}`);
    }

    // Répondre à Stripe pour confirmer la réception
    res.json({ received: true });
};

// Exporter les fonctions
module.exports = {
    createCheckoutSession,
    verifyPayment,
    handleStripeWebhook
};