// Importer Prisma
const prisma = require('../config/prisma');

// FONCTION POUR RÉCUPÉRER LES STATISTIQUES GLOBALES
const getStats = async (req, res) => {
  try {
    // Récupérer toutes les commandes
    const orders = await prisma.order.findMany({
      include: {
        OrderItem: {
          include: {
            Product: true
          }
        }
      }
    });

    // Nombre total de commandes
    const totalOrders = orders.length;

    // Chiffre d'affaires total (seulement les commandes payées ou livrées)
    const paidOrders = orders.filter(order => order.status === 'PAID' || order.status === 'DELIVERED');
    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Nombre de produits
    const totalProducts = await prisma.product.count();

    // Nombre d'utilisateurs
    const totalUsers = await prisma.user.count();

    // Panier moyen (basé uniquement sur les commandes payées)
    const averageOrderValue = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;

    // Commandes par statut
    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue: Math.round(totalRevenue * 100) / 100, // Arrondi à 2 décimales
        totalProducts,
        totalUsers,
        averageOrderValue: Math.round(averageOrderValue * 100) / 100, // Arrondi à 2 décimales
        ordersByStatus
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des stats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// FONCTION POUR RÉCUPÉRER LES VENTES PAR MOIS
const getSalesByMonth = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { status: 'PAID' },
          { status: 'DELIVERED' }
        ]
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Grouper par mois
    const salesByMonth = {};
    
    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!salesByMonth[monthKey]) {
        salesByMonth[monthKey] = {
          month: monthKey,
          revenue: 0,
          orders: 0
        };
      }
      
      salesByMonth[monthKey].revenue += order.totalAmount;
      salesByMonth[monthKey].orders += 1;
    });

    // Convertir en tableau et trier
    const salesArray = Object.values(salesByMonth).sort((a, b) => 
      a.month.localeCompare(b.month)
    );

    res.json({
      success: true,
      salesByMonth: salesArray
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des ventes par mois:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// FONCTION POUR RÉCUPÉRER LES PRODUITS LES PLUS VENDUS
const getTopProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
        totalPrice: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: limit
    });

    // Récupérer les infos des produits
    const productsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          include: {
            ProductImage: {
              take: 1
            }
          }
        });

        return {
          product,
          quantitySold: item._sum.quantity,
          revenue: item._sum.totalPrice
        };
      })
    );

    res.json({
      success: true,
      topProducts: productsWithDetails
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des top produits:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Exporter les fonctions
module.exports = {
  getStats,
  getSalesByMonth,
  getTopProducts
};