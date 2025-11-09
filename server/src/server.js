// Importer les modules nécessaires
const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); // Protection des headers HTTP
const mongoSanitize = require('express-mongo-sanitize'); // Protection contre NoSQL injection
require('dotenv').config();

// Importer Prisma au lieu de pool
const prisma = require('./config/prisma');

// Importer les routes d'authentification
const authRoutes = require('./routes/auth');
// Importer les routes des catégories
const categoryRoutes = require('./routes/categories');
// Importer les routes des produits
const productRoutes = require('./routes/products');
// Importer les routes de paiement
const paymentRoutes = require('./routes/payment');
// Importer les routes des commandes
const orderRoutes = require('./routes/orders');

// Importer le limiteur de requêtes (protection anti brute-force)
const { apiLimiter } = require('./middleware/rateLimiter');

// Importer le sanitizer (nettoyage des données contre XSS)
const { sanitizeInputs } = require('./middleware/sanitizer');

// Créer l'application Express
const app = express();

// Définir le port (5000 par défaut, ou celui défini dans .env)
const PORT = process.env.PORT || 5000;

// MIDDLEWARE (fonctions qui s'exécutent avant les routes)

// 1. Helmet - Sécurise les headers HTTP
app.use(helmet({
  contentSecurityPolicy: false, // Désactivé pour Stripe (peut être réactivé après config)
}));

// 2. Protection contre les injections NoSQL (ex: { $ne: null })
app.use(mongoSanitize());

// 3. Sanitizer personnalisé - Nettoie toutes les entrées utilisateur (XSS)
app.use(sanitizeInputs);

// 4. CORS : permet au front-end (localhost:3000) de communiquer avec le back-end (localhost:5000)
app.use(cors({
  origin: 'http://localhost:3000', // Adresse du front-end Next.js
  credentials: true
}));

// 5. Parser le JSON SAUF pour le webhook Stripe (qui a besoin du raw body)
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payment/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// 6. Parser les données URL-encoded (formulaires)
app.use(express.urlencoded({ extended: true }));

// 7. Limiteur de requêtes global (protection anti spam et brute-force)
// Maximum 100 requêtes par 15 minutes par IP
app.use('/api', apiLimiter);

// ROUTES D'AUTHENTIFICATION
// Toutes les routes dans authRoutes commenceront par /api/auth
app.use('/api/auth', authRoutes);
// ROUTES DES CATÉGORIES
app.use('/api/categories', categoryRoutes);
// ROUTES DES PRODUITS
app.use('/api/products', productRoutes);
// ROUTES DE PAIEMENT
app.use('/api/payment', paymentRoutes);
// ROUTES DES COMMANDES
app.use('/api/orders', orderRoutes);


// ROUTE D'ACCUEIL (page principale)
app.get('/', (req, res) => {
  res.json({
    message: '🎉 Bienvenue sur l\'API Mea Vita Création',
    version: '1.0.0',
    endpoints: {
      test: '/api/test',
      testDatabase: '/api/test-db',
      auth: {
        register: '/api/auth/register',
        login: '/api/auth/login'
      }
    },
    status: 'running'
  });
});

// ROUTE DE TEST (pour vérifier que le serveur fonctionne)
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '✅ Le serveur fonctionne !',
    timestamp: new Date()
  });
});

// ROUTE DE TEST DE PRISMA
app.get('/api/test-db', async (req, res) => {
  try {
    // Compter le nombre d'utilisateurs dans la base
    const userCount = await prisma.user.count();
    
    res.json({ 
      message: '✅ Connexion à PostgreSQL avec Prisma réussie !',
      userCount: userCount
    });
  } catch (error) {
    res.status(500).json({ 
      message: '❌ Erreur de connexion à PostgreSQL',
      error: error.message
    });
  }
});

// DÉMARRER LE SERVEUR
const server = app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});

// Gérer la fermeture propre
process.on('SIGINT', async () => {
  console.log('\nArrêt du serveur...');
  await prisma.$disconnect();
  server.close(() => {
    process.exit(0);
  });
});