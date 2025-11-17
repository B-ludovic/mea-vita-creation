// Controller pour les factures
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Récupérer toutes les factures (admin uniquement)
const getAllInvoices = async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        Order: {
          include: {
            User: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true
              }
            },
            Address: true,
            OrderItem: {
              include: {
                Product: true
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
      invoices
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des factures:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des factures'
    });
  }
};

module.exports = {
  getAllInvoices
};
