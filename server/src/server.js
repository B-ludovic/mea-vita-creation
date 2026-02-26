// Importer les modules nécessaires
const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); // Protection des headers HTTP
require('dotenv').config();


// VALIDATION DES VARIABLES D'ENVIRONNEMENT AU DÉMARRAGE

// Vérifier que toutes les variables importantes sont définies
// Si une variable manque, le serveur s'arrête AVANT de démarrer (évite les bugs en prod)
const requiredEnvVars = [
  'JWT_SECRET',            // Pour signer les tokens
  'JWT_REFRESH_SECRET',    // Pour signer les refresh tokens
  'DATABASE_URL',          // Pour se connecter à PostgreSQL
  'STRIPE_SECRET_KEY',     // Pour les paiements
  'CLIENT_URL',            // Pour configurer CORS
  'ADMIN_EMAIL'            // Pour recevoir les emails de contact
];

// Parcourir chaque variable requise
const missingVars = [];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    missingVars.push(varName); // Ajouter à la liste des variables manquantes
  }
});

// Si des variables manquent, afficher un message clair et arrêter
if (missingVars.length > 0) {
  console.error('❌ ERREUR : Variables d\'environnement manquantes !');
  console.error('   Les variables suivantes doivent être définies dans le fichier .env :');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\n💡 Astuce : Copie le fichier .env.example en .env et remplis les valeurs');
  process.exit(1); // Arrêter le serveur avec code d'erreur
}

console.log('✅ Toutes les variables d\'environnement sont présentes');

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
// Importer les routes des codes promo
const promoCodeRoutes = require('./routes/promoCodes');
// Importer les routes des contacts
const contactRoutes = require('./routes/contact');
// Importer les routes des adresses
const addressRoutes = require('./routes/addresses');
// Importer les routes des avis
const reviewRoutes = require('./routes/reviews');
// Importer les routes des statistiques
const statsRoutes = require('./routes/stats');
// Importer les routes des utilisateurs
const userRoutes = require('./routes/users');
// Importer les routes des factures
const invoiceRoutes = require('./routes/invoices');
// Importer les routes de la wishlist
const wishlistRoutes = require('./routes/wishlist');

// Importer le limiteur de requêtes (protection anti brute-force)
const { apiLimiter } = require('./middleware/rateLimiter');

// Importer le sanitizer (nettoyage des données contre XSS)
const { sanitizeInputs } = require('./middleware/sanitizer');

// Créer l'application Express
const app = express();

// CONFIGURATION POUR RENDER : Activer trust proxy pour express-rate-limit
// Nécessaire derrière un reverse proxy (Render, Heroku, etc.)
app.set('trust proxy', 1);

// Définir le port (5000 par défaut, ou celui défini dans .env)
const PORT = process.env.PORT || 5000;

// SÉCURITÉ : Forcer HTTPS en production
// En production, TOUJOURS utiliser HTTPS (cadenas dans le navigateur)

if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    // Vérifier si la requête arrive en HTTP au lieu de HTTPS
    // x-forwarded-proto : header ajouté par les hébergeurs (Heroku, Railway, etc.)
    if (req.header('x-forwarded-proto') !== 'https') {
      // Rediriger vers la version HTTPS
      return res.redirect(`https://${req.header('host')}${req.url}`);
    }
    next(); // Si déjà en HTTPS, continuer normalement
  });
}

// MIDDLEWARE (fonctions qui s'exécutent avant les routes)

// 1. Helmet - Sécurise les headers HTTP
// Content Security Policy (CSP)

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      // defaultSrc: D'où peuvent venir les ressources par défaut
      defaultSrc: ["'self'"], // Seulement depuis ton propre serveur
      
      // scriptSrc: Quels scripts JavaScript peuvent s'exécuter
      scriptSrc: [
        "'self'",                    // Tes propres scripts
        "https://js.stripe.com"      // Scripts Stripe pour les paiements
      ],
      
      // frameSrc: Quelles iframes peuvent être chargées (pour Stripe checkout)
      frameSrc: [
        "'self'", 
        "https://js.stripe.com",
        "https://hooks.stripe.com"
      ],
      
      // connectSrc: À quelles API ton site peut se connecter
      connectSrc: [
        "'self'",                    // Ton API
        "https://api.stripe.com"     // API Stripe
      ],
      
      // imgSrc: D'où peuvent venir les images
      imgSrc: [
        "'self'",                    // Tes images
        "data:",                     // Images en base64 (petites icônes)
        "https:"                     // N'importe quelle image HTTPS (CDN, etc.)
      ],
      
      // styleSrc: D'où peuvent venir les CSS
      // SÉCURITÉ : pas de 'unsafe-inline' — l'API ne sert que du JSON, pas de HTML avec styles
      styleSrc: ["'self'"]
    }
  }
}));

// 2. Sanitizer personnalisé - Nettoie toutes les entrées utilisateur (XSS)
// Note: express-mongo-sanitize supprimé car incompatible avec PostgreSQL
// La sanitization contre les injections SQL est assurée par Prisma ORM
app.use(sanitizeInputs);

// 3. CORS : permet au front-end de communiquer avec le back-end

app.use(cors({

  // En prod: ton vrai domaine (exemple: https://francois-maroquinerie.com)
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  
  // credentials: Autoriser l'envoi de cookies et tokens
  credentials: true,
  
  // methods: Quelles méthodes HTTP sont autorisées
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  
  // allowedHeaders: Quels headers peuvent être envoyés
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 4. Parser le JSON SAUF pour le webhook Stripe (qui a besoin du raw body)
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payment/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// 5. Parser les données URL-encoded (formulaires)
app.use(express.urlencoded({ extended: true }));

// 6. Limiteur de requêtes global (protection anti spam et brute-force)
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
// ROUTES DES CODES PROMO
app.use('/api/promo-codes', promoCodeRoutes);
// ROUTES DES CONTACTS
app.use('/api/contact', contactRoutes);
// ROUTES DES ADRESSES
app.use('/api/addresses', addressRoutes);
// ROUTES DES AVIS
app.use('/api/reviews', reviewRoutes);
// ROUTES DES STATISTIQUES
app.use('/api/stats', statsRoutes);
// ROUTES DES UTILISATEURS
app.use('/api/users', userRoutes);
// ROUTES DES FACTURES
app.use('/api/invoices', invoiceRoutes);
// ROUTES DE LA WISHLIST
app.use('/api/wishlist', wishlistRoutes);


// ROUTE D'ACCUEIL (page principale)
app.get('/', (req, res) => {
  res.json({
    message: '🎉 Bienvenue sur l\'API Mea Vita Création',
    version: '1.0.0',
    endpoints: {
      test: '/api/test',
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