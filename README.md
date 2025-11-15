````markdown
# 🎨 Mea Vita Création - François Maroquinerie

Site e-commerce de maroquinerie artisanale avec paiement Stripe.

> ⚠️ **SÉCURITÉ** : Ne jamais commiter de fichiers `.env` ou `.env.local`. Toutes les clés ci-dessous sont des exemples génériques à remplacer par vos vraies clés.

## 📋 Description du projet

Application full-stack pour la vente de créations en maroquinerie :
- **Frontend** : Next.js 14 (App Router)
- **Backend** : Node.js + Express
- **Base de données** : PostgreSQL + Prisma ORM
- **Paiement** : Stripe (avec webhooks)

### Collections disponibles
- 🎒 Pochettes Unisexe (L'Atlas, L'Artisan, Le Cachet)
- 💳 Porte-Carte (L'Éclat)
- 🥁 Sac Cylindre (Le Tambour)
- 👜 Sac U (L'Arche)

### Fonctionnalités principales
- 🔐 **Authentification sécurisée** : Inscription, connexion, vérification email, JWT côté client et serveur
- 🔑 **Récupération mot de passe** : Système de reset par email avec token sécurisé
- 🛒 **Panier intelligent** : Gestion des articles avec validation de stock en temps réel
- 💳 **Paiement Stripe** : Intégration complète avec webhooks et validation de stock
- 📦 **Gestion commandes** : Historique et suivi des commandes avec déduction automatique du stock
- � **Suivi de livraison** : Tracking complet avec numéro de suivi, transporteur, timeline visuelle animée
- �📄 **Factures PDF** : Génération automatique de factures avec logo, images produits et TVA
- 📧 **Emails automatiques** : Système d'emailing avec templates externalisés (vérification, bienvenue, confirmation, reset password, expédition)
- 📍 **Adresses multiples** : Gestion des adresses de livraison
- ❤️ **Liste de souhaits** : Système de wishlist complet avec authentification JWT
- ⭐ **Avis produits** : Système de reviews avec notation étoiles et modération admin
- 👤 **Espace admin protégé** : Dashboard avec statistiques, graphiques, gestion complète
- 📦 **Admin tracking** : Interface admin pour ajouter/modifier les informations de suivi (numéro, transporteur, URL)
- 🖼️ **Upload images produits** : Système complet d'ajout/suppression d'images avec preview en temps réel (Multer)
- 🔒 **Sécurité renforcée** : Rate limiting, validation, sanitization, JWT frontend + backend
- 📊 **Stock en temps réel** : Mise à jour instantanée du stock après ajout au panier
- 🚫 **Protection stock** : Impossible d'acheter plus que le stock disponible, affichage "Rupture de stock"
- 📱 **Design responsive** : Interface optimisée mobile/tablette/desktop avec breakpoints adaptatifs
- 🎨 **Branding cohérent** : Logo marque affiché sur toutes les pages et dans les emails/factures
- ✨ **UX moderne** : Système de modals élégants avec animations pour toutes les notifications
- 🔍 **SEO optimisé** : Métadonnées dynamiques, JSON-LD, robots.txt, sitemap.xml automatique
- 🗂️ **Organisation icônes** : 48 icônes centralisées dans /public/icones/ pour une meilleure structure

---

## 🚀 Installation en local

### 1. Cloner le projet
```bash
git clone https://github.com/B-ludovic/mea-vita-creation.git
cd mea-vita-creation
```

### 2. Installer le FRONTEND
```bash
cd client/my-app
npm install
```

Créer le fichier `.env.local` dans `client/my-app/` :
```env
NEXT_PUBLIC_API_URL=http://localhost:5002
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXXXXX
```

### 3. Installer le BACKEND
```bash
cd server
npm install
```

Créer le fichier `.env` dans `server/` :
```env
PORT=5002
DATABASE_URL=postgresql://username:password@localhost:5432/nom_de_votre_bdd
STRIPE_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXXXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXXXXXXXXXXXXX
CLIENT_URL=http://localhost:3000
JWT_SECRET=votre_cle_secrete_jwt_minimum_32_caracteres
RESEND_API_KEY=re_XXXXXXXXXXXXXXXXXXXXXXXX
```

### 4. Configurer la base de données
```bash
# Dans le dossier server/
npx prisma generate
npx prisma db push
```

### 5. Lancer le projet

**Option 1 - Lancement automatique (recommandé)** :
```bash
# À la racine du projet
npm run dev
# Lance automatiquement : Frontend + Backend + Stripe CLI
```

**Option 2 - Lancement manuel (3 terminaux)** :

**Terminal 1 - Backend** :
```bash
cd server
npm run dev
# Serveur sur http://localhost:5002
```

**Terminal 2 - Frontend** :
```bash
cd client/my-app
npm run dev
# Site sur http://localhost:3000
```

**Terminal 3 - Stripe Webhook** :
```bash
stripe listen --forward-to localhost:5002/api/payment/webhook
# ⚠️ OBLIGATOIRE pour que les commandes soient créées
```

> **💡 Important** : Sans Stripe CLI en écoute, les paiements réussiront mais aucune commande ne sera créée dans la BDD !

---

## 📦 Déploiement sur Render

### Backend (Web Service)

1. **Créer un nouveau Web Service** sur Render
2. **Connecter votre repo GitHub** : `B-ludovic/mea-vita-creation`
3. **Configuration** :
   - **Name** : `francois-maroquinerie-api`
   - **Root Directory** : `server`
   - **Build Command** : `npm install && npx prisma generate`
   - **Start Command** : `npm start`

4. **Variables d'environnement** (Environment) :
   ```
   PORT=5002
   DATABASE_URL=postgresql://...  (URL depuis Render PostgreSQL - Internal Database URL)
   STRIPE_SECRET_KEY=sk_live_XXXXXXXXXXXXXXXXXXXXXXXX
   STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXXXXXXXXXXXXX
   CLIENT_URL=https://votre-site-frontend.onrender.com
   JWT_SECRET=votre_cle_jwt_production_securisee
   RESEND_API_KEY=re_XXXXXXXXXXXXXXXXXXXXXXXX
   NODE_ENV=production
   ```

5. **Ajouter une base de données PostgreSQL** :
   - Dans Render, créer une nouvelle **PostgreSQL Database**
   - Copier l'**Internal Database URL** dans `DATABASE_URL`

### Frontend (Static Site ou Web Service)

1. **Créer un nouveau Web Service** sur Render
2. **Configuration** :
   - **Name** : `francois-maroquinerie-front`
   - **Root Directory** : `client/my-app`
   - **Build Command** : `npm install && npm run build`
   - **Start Command** : `npm start`

3. **Variables d'environnement** :
   ```
   NEXT_PUBLIC_API_URL=https://votre-api-backend.onrender.com
   NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_XXXXXXXXXXXXXXXXXXXXXXXX
   NODE_ENV=production
   ```

### Webhook Stripe (production)

1. Dans le **Dashboard Stripe** → Developers → Webhooks
2. **Add endpoint** : `https://votre-api-backend.onrender.com/api/payment/webhook`
3. **Events** : Sélectionner `checkout.session.completed`
4. Copier le **Signing secret** dans `STRIPE_WEBHOOK_SECRET`

---

## 🛠️ Technologies utilisées

### Frontend
- Next.js 14 (App Router)
- React 19
- Stripe.js
- CSS Modules

### Backend
- Node.js + Express
- Prisma ORM
- PostgreSQL
- Stripe API
- Cors

### Déploiement
- Render (Backend + Frontend + PostgreSQL)
- Stripe (Paiements)

---

## 📂 Structure du projet

```
francois-maroquinerie/
├── client/my-app/          # Frontend Next.js
│   ├── app/                # Pages et routes
│   │   ├── layout.js       # Layout principal
│   │   ├── page.js         # Page d'accueil
│   │   ├── login/          # Page de connexion
│   │   ├── register/       # Page d'inscription
│   │   ├── forgot-password/# Page mot de passe oublié
│   │   ├── reset-password/ # Page réinitialisation mot de passe
│   │   ├── verify-email/   # Page vérification email
│   │   ├── categories/     # Pages catégories
│   │   ├── produits/       # Pages produits
│   │   ├── panier/         # Page panier
│   │   ├── mes-commandes/  # Page mes commandes + suivi livraison avec timeline
│   │   ├── mes-adresses/   # Page gestion adresses
│   │   ├── ma-wishlist/    # Page liste de souhaits
│   │   ├── apropos/        # Page à propos
│   │   ├── contact/        # Page contact
│   │   ├── success/        # Page succès paiement
│   │   └── admin/          # Panel admin
│   │       ├── dashboard/  # Tableau de bord avec statistiques et graphiques
│   │       ├── produits/   # Gestion produits
│   │       ├── commandes/  # Gestion commandes + modal tracking
│   │       ├── categories/ # Gestion catégories
│   │       └── utilisateurs/ # Gestion utilisateurs
│   ├── components/         # Composants React
│   │   ├── Header.jsx      # En-tête navigation
│   │   ├── Modal.jsx       # Composant modal réutilisable
│   │   ├── StarRating.jsx  # Composant notation étoiles
│   │   ├── ConditionalLayout.jsx
│   │   ├── InactivityWrapper.jsx
│   │   └── ProductCarousel.jsx
│   ├── contexts/           # Context API
│   │   └── CartContext.js  # Gestion du panier
│   ├── hooks/              # Custom hooks
│   │   ├── useModal.js     # Hook pour gérer les modals
│   │   └── useInactivityTimer.js
│   ├── utils/              # Utilitaires
│   │   └── metadata.js     # Métadonnées SEO (JSON-LD, OG tags)
│   ├── config/             # Configuration
│   │   └── productImages.js # Images produits
│   ├── styles/             # Fichiers CSS
│   │   ├── globals.css
│   │   ├── variables.css   # Variables couleurs du projet
│   │   ├── Modal.css       # Styles modal avec animations
│   │   ├── Header.css
│   │   ├── Home.css
│   │   ├── Auth.css
│   │   ├── Categories.css
│   │   ├── Product.css
│   │   ├── Cart.css
│   │   ├── Orders.css
│   │   ├── Addresses.css
│   │   ├── Admin.css       # Styles admin + modal tracking
│   │   ├── Dashboard.css   # Styles dashboard admin
│   │   ├── Tracking.css    # Styles suivi commandes + timeline animée
│   │   ├── Contact.css
│   │   ├── Success.css
│   │   ├── ProductCarousel.css
│   │   └── ma-wishlist.css # Styles liste de souhaits
│   ├── app/
│   │   └── sitemap.js      # Génération automatique du sitemap
│   └── public/             # Fichiers statiques
│       ├── icones/         # 48 icônes UI du projet
│       ├── robots.txt      # Configuration SEO robots
│       ├── Logo_Francois_sansfond.PNG # Logo marque
│       └── images/         # Images produits
│           ├── pochettes-unisexe/
│           ├── porte-carte/
│           ├── sac-cylindre/
│           └── sac-u/
│
├── server/                 # Backend Express
│   ├── src/
│   │   ├── controllers/    # Logique métier
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   ├── categoryController.js
│   │   │   ├── orderController.js
│   │   │   ├── paymentController.js
│   │   │   ├── addressController.js
│   │   │   ├── wishlistController.js # Gestion wishlist
│   │   │   └── reviewController.js # Gestion avis produits
│   │   ├── routes/         # Routes API
│   │   │   ├── auth.js
│   │   │   ├── products.js
│   │   │   ├── categories.js
│   │   │   ├── orders.js
│   │   │   ├── payment.js
│   │   │   ├── addresses.js
│   │   │   ├── invoices.js # Routes factures PDF
│   │   │   ├── wishlist.js # Routes wishlist
│   │   │   ├── reviews.js  # Routes reviews
│   │   │   └── users.js
│   │   ├── middleware/     # Middlewares
│   │   │   ├── authMiddleware.js
│   │   │   ├── rateLimiter.js
│   │   │   ├── sanitizer.js
│   │   │   └── upload.js   # Multer config (upload images)
│   │   ├── services/       # Services
│   │   │   ├── emailService.js # Service emails (Resend)
│   │   │   └── invoiceService.js # Génération factures PDF
│   │   ├── utils/          # Utilitaires
│   │   │   └── carriers.js # Validation et URLs tracking transporteurs
│   │   ├── templates/      # Templates
│   │   │   ├── emailStyles.js # Styles CSS pour emails
│   │   │   ├── verificationEmailTemplate.js
│   │   │   ├── welcomeEmailTemplate.js
│   │   │   ├── orderConfirmationTemplate.js
│   │   │   ├── passwordResetTemplate.js
│   │   │   └── shippingEmailTemplate.js # Template email expédition
│   │   ├── config/         # Configuration
│   │   │   ├── database.js
│   │   │   └── prisma.js
│   │   └── server.js       # Point d'entrée
│   ├── prisma/
│   │   ├── schema.prisma   # Schéma base de données
│   │   └── migrations/     # Migrations
│   ├── invoices/           # Dossier des factures PDF générées
│   └── scripts/
│       └── recover-orders.js
│
├── .gitignore
└── README.md
```

---

## 🔑 Variables d'environnement

### Frontend (`.env.local`)
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | URL de l'API backend |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | Clé publique Stripe |

### Backend (`.env`)
| Variable | Description |
|----------|-------------|
| `PORT` | Port du serveur (5002) |
| `DATABASE_URL` | URL PostgreSQL |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe |
| `STRIPE_WEBHOOK_SECRET` | Secret webhook Stripe |
| `CLIENT_URL` | URL du frontend |
| `JWT_SECRET` | Clé secrète JWT (min. 32 car.) |
| `RESEND_API_KEY` | Clé API Resend (envoi emails) |

---

## 📝 Scripts disponibles

### Racine du projet
```bash
npm run dev          # Lance Frontend + Backend + Stripe CLI (avec concurrently)
npm run dev:client   # Lance uniquement le frontend
npm run dev:server   # Lance uniquement le backend
npm run dev:stripe   # Lance uniquement Stripe CLI
```

### Frontend
```bash
npm run dev      # Lancer en développement
npm run build    # Build pour production
npm start        # Lancer en production
```

### Backend
```bash
npm run dev      # Lancer avec nodemon
npm start        # Lancer en production
```

---

## 🐛 Debug

### Le panier ne se vide pas après paiement
- ✅ Vérifier que le webhook Stripe est configuré
- ✅ **IMPORTANT** : Vérifier que Stripe CLI écoute : `stripe listen --forward-to localhost:5002/api/payment/webhook`
- ✅ Vérifier les logs dans le terminal Stripe pour voir les événements reçus
- ✅ En production, vérifier le webhook dans le dashboard Stripe

### "Stock insuffisant" alors qu'il y a du stock
- ✅ Vérifier que le produit dans le panier a le bon `stock` (peut être obsolète)
- ✅ Recharger la page produit pour avoir le stock à jour depuis la BDD
- ✅ Vider le panier et rajouter le produit

### La commande n'apparaît pas dans l'admin
- ✅ **CAUSE PRINCIPALE** : Stripe CLI n'est pas en écoute
- ✅ Lancer `npm run dev` à la racine (lance tout automatiquement)
- ✅ Ou lancer manuellement : `stripe listen --forward-to localhost:5002/api/payment/webhook`
- ✅ Sans Stripe CLI, le paiement réussit mais aucune commande n'est créée

### Erreur de connexion à la BDD
- ✅ Vérifier que PostgreSQL est démarré
- ✅ Vérifier le `DATABASE_URL` dans `.env`
- ✅ Lancer `npx prisma db push`

### Images ne s'affichent pas
- ✅ Vérifier que les images sont dans `client/my-app/public/images/`
- ✅ Vérifier les chemins dans `config/productImages.js`
- ✅ Vérifier que le backend renvoie bien `ProductImage` dans la réponse API

---

## 👨‍💻 Auteur

**Ludovic** - [B-ludovic](https://github.com/B-ludovic)

Projet : François Maroquinerie - Créations artisanales  
Réalisé avec 💻 et ☕ pendant mon parcours de dev junior

---

## 🎨 Crédits

- **Icônes** : [Flaticon](https://www.flaticon.com)
- **Inspiration & apprentissage** : Communauté dev, Stack Overflow, documentation officielle

---

## 📚 Ce que j'ai appris sur ce projet

### Frontend
- ✅ Next.js 14 avec App Router (nouvelle architecture)
- ✅ React Context API pour la gestion d'état
- ✅ Hooks personnalisés (useEffect, useState, useModal)
- ✅ Navigation côté client et protection de routes
- ✅ Intégration Stripe pour les paiements
- ✅ CSS moderne avec variables et layouts responsive
- ✅ Media queries et breakpoints adaptatifs (1500px, 1400px, 968px, 768px, 480px)
- ✅ Animations CSS (transitions, staggered menu burger, fadeIn/slideIn modals)
- ✅ Système de modals réutilisables avec icônes PNG
- ✅ Gestion du stock disponible en temps réel (panier + BDD)
- ✅ Téléchargement de factures PDF avec gestion de blobs
- ✅ Dashboard admin avec graphiques interactifs (recharts)
- ✅ SEO avec métadonnées dynamiques, JSON-LD, sitemap automatique
- ✅ Prévention des erreurs d'hydration React (isMounted pattern)
- ✅ Système de wishlist avec optimistic UI
- ✅ Timeline CSS avec animations pulse (transform scale + box-shadow)
- ✅ Alignement précis avec CSS positioning (dots centrés sur ligne verticale)

### Backend
- ✅ Architecture RESTful avec Express.js
- ✅ Prisma ORM pour PostgreSQL (migrations, relations)
- ✅ Authentification JWT (tokens, refresh, expiration)
- ✅ Middlewares (auth, rate limiting, sanitization)
- ✅ Webhooks Stripe pour les paiements asynchrones
- ✅ Envoi d'emails transactionnels avec Resend (templates HTML avec styles externalisés)
- ✅ Génération de factures PDF avec PDFKit (logo, images produits, TVA)
- ✅ Gestion des erreurs et validation des données
- ✅ Gestion automatique du stock (décrémentation après paiement)
- ✅ Validation du stock avant création de commande
- ✅ Upload de fichiers avec Multer (images produits, 5MB max, validation MIME)
- ✅ Système de factures avec authentification et vérification de propriété
- ✅ API wishlist avec relations many-to-many (User ↔ Product)
- ✅ Système de reviews avec modération (1 avis/user/produit)
- ✅ Templates emails externalisés pour meilleure maintenance
- ✅ API tracking avec update conditionnel et auto-dates (shippedAt, deliveredAt)
- ✅ Validation des numéros de tracking par transporteur (regex patterns)
- ✅ Génération automatique d'URLs de suivi (8 transporteurs supportés)
- ✅ Email automatique d'expédition avec sanitization HTML et validation

### DevOps & Bonnes pratiques
- ✅ Git & GitHub (commits sémantiques, branches)
- ✅ Variables d'environnement (.env, sécurité)
- ✅ Gestion des secrets (API keys, tokens)
- ✅ Documentation technique (README, commentaires)
- ✅ Déploiement production sur Render
- ✅ Testing manuel et debugging
- ✅ Concurrently pour lancer plusieurs services en parallèle
- ✅ Scripts npm pour automatiser le développement

### Sécurité
- ✅ Hachage de mots de passe (bcrypt)
- ✅ Protection CSRF et XSS
- ✅ Rate limiting anti brute-force
- ✅ Validation et sanitization des inputs
- ✅ Tokens JWT avec expiration (frontend + backend)
- ✅ Protection des routes admin (vérification JWT côté client)
- ✅ Validation de stock côté client et serveur (double sécurité)
- ✅ Système de callback sécurisé pour alertes (useRef, pas de boucle infinie)
- ✅ Vérification de propriété pour factures et wishlist (req.user.userId)
- ✅ Contrainte unique BDD pour éviter doublons (wishlist, reviews)
- ✅ Sanitization HTML dans templates emails (protection XSS)
- ✅ Validation données avant envoi emails (tracking complet requis)

---

## 🚧 Points d'amélioration futurs

- [ ] Tests automatisés (Jest, Cypress)
- [ ] CI/CD avec GitHub Actions
- [ ] Compression et optimisation d'images (Sharp)
- [ ] Recherche avancée et filtres
- [ ] Notifications en temps réel (WebSocket)
- [ ] Analytics et monitoring
- [ ] Mode sombre / thème personnalisable
- [ ] Internationalisation
- [ ] PWA (Progressive Web App)
- [ ] Gestion des stocks avec alertes admin
- [x] ~~Export PDF des commandes~~ ✅ Fait (factures PDF)
- [x] ~~Statistiques avancées (dashboard admin)~~ ✅ Fait (graphiques recharts)
- [x] ~~Wishlist / Favoris~~ ✅ Fait (ma-wishlist avec JWT)
- [x] ~~Avis clients~~ ✅ Fait (système reviews avec modération)
- [x] ~~SEO optimization~~ ✅ Fait (metadata.js, robots.txt, sitemap.xml)
- [x] ~~Organisation icônes~~ ✅ Fait (48 icônes dans /icones/)
- [x] ~~Templates emails externalisés~~ ✅ Fait (dossier templates/ avec 5 templates)
- [ ] Envoi automatique des factures par email
- [ ] Historique des factures dans l'admin
- [ ] Système de relances clients (emails automatiques)
- [ ] Bon de réduction / codes promo
- [x] ~~Suivi de livraison (tracking)~~ ✅ Fait (tracking avec timeline animée)
- [x] ~~Email automatique lors de l'expédition~~ ✅ Fait (shippingEmailTemplate avec sanitization)
- [ ] Export Excel des commandes

---

## 📄 Licence

Projet privé - Tous droits réservés
