// Script pour récupérer les commandes perdues des sessions Stripe payées
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function recoverOrders() {
    try {
        console.log('🔍 Récupération des sessions Stripe payées...\n');
        
        // Récupérer les sessions payées des dernières 24h
        const sessions = await stripe.checkout.sessions.list({
            limit: 100,
            created: {
                gte: Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60) // 7 derniers jours
            }
        });

        const paidSessions = sessions.data.filter(s => s.payment_status === 'paid');
        console.log(`✅ ${paidSessions.length} sessions payées trouvées\n`);

        for (const session of paidSessions) {
            // Vérifier si la commande existe déjà
            const existingOrder = await prisma.order.findFirst({
                where: {
                    stripePaymentIntentId: session.payment_intent
                }
            });

            if (existingOrder) {
                console.log(`⏭️  Session ${session.id} déjà enregistrée (${existingOrder.orderNumber})`);
                continue;
            }

            // Récupérer les metadata
            if (!session.metadata || !session.metadata.items) {
                console.log(`⚠️  Session ${session.id} sans metadata items - ignorée`);
                continue;
            }

            try {
                const items = JSON.parse(session.metadata.items);
                const userId = session.metadata.userId !== 'guest' ? session.metadata.userId : null;

                // Créer la commande
                const order = await prisma.order.create({
                    data: {
                        orderNumber: `CMD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                        userId,
                        addressId: null,
                        status: 'PAID',
                        subtotal: session.amount_total / 100,
                        shippingCost: 0,
                        taxAmount: 0,
                        discountAmount: 0,
                        totalAmount: session.amount_total / 100,
                        stripePaymentIntentId: session.payment_intent,
                        createdAt: new Date(session.created * 1000),
                        updatedAt: new Date(session.created * 1000),
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

                console.log(`✅ Commande créée: ${order.orderNumber} - ${order.totalAmount}€ (${new Date(session.created * 1000).toLocaleString()})`);

                // Décrémenter le stock
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

            } catch (error) {
                console.error(`❌ Erreur session ${session.id}:`, error.message);
            }
        }

        console.log('\n✅ Récupération terminée !');

    } catch (error) {
        console.error('❌ Erreur:', error);
    } finally {
        await prisma.$disconnect();
    }
}

recoverOrders();
