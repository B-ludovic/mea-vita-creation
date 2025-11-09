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

        // Ne stocker que les données essentielles pour le webhook (limite 500 caractères)
        const itemsForMetadata = items.map(item => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price
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
                items: JSON.stringify(itemsForMetadata) // Seulement id, quantity, price
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

// FONCTION WEBHOOK STRIPE
// Cette fonction est appelée automatiquement par Stripe quand un événement se produit
const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        // Vérifier que la requête vient bien de Stripe
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error('Erreur webhook Stripe:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Gérer l'événement
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;

            console.log('✅ Paiement réussi pour la session:', session.id);

            try {
                // Récupérer les items depuis les metadata
                const items = JSON.parse(session.metadata.items);
                const userId = session.metadata.userId !== 'guest' ? session.metadata.userId : null;

                // Créer la commande
                const order = await prisma.order.create({
                    data: {
                        orderNumber: `CMD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                        userId,
                        addressId: null, // À gérer plus tard avec les adresses
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
                    }
                });

                console.log('✅ Commande créée:', order.orderNumber);

                // Décrémenter le stock des produits
                for (const item of items) {
                    await prisma.product.update({
                        where: { id: item.id },
                        data: {
                            stock: {
                                decrement: item.quantity
                            }
                        }
                    });
                }

                console.log('✅ Stock mis à jour');

            } catch (error) {
                console.error('Erreur lors de la création de la commande:', error);
            }

            break;

        case 'payment_intent.payment_failed':
            console.log('❌ Échec du paiement');
            break;

        default:
            console.log(`Event non géré: ${event.type}`);
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