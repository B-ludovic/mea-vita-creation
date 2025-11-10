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
- 🔐 **Authentification sécurisée** : Inscription, connexion, vérification email
- 🔑 **Récupération mot de passe** : Système de reset par email
- 🛒 **Panier intelligent** : Gestion des articles avec Context API
- 💳 **Paiement Stripe** : Intégration complète avec webhooks
- 📦 **Gestion commandes** : Historique et suivi des commandes
- 📍 **Adresses multiples** : Gestion des adresses de livraison
- 👤 **Espace admin** : Dashboard pour gérer produits, commandes et utilisateurs
- 📧 **Emails automatiques** : Vérification compte, bienvenue, reset password, confirmation commande
- 🔒 **Sécurité renforcée** : Rate limiting, validation, sanitization, JWT

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

**Terminal 3 - Stripe Webhook (optionnel)** :
```bash
cd server
stripe listen --forward-to localhost:5002/api/payment/webhook
```

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
   - **Instance Type** : Free

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
│   │   ├── mes-commandes/  # Page mes commandes
│   │   ├── mes-adresses/   # Page gestion adresses
│   │   ├── apropos/        # Page à propos
│   │   ├── contact/        # Page contact
│   │   ├── success/        # Page succès paiement
│   │   └── admin/          # Panel admin
│   │       ├── dashboard/  # Tableau de bord
│   │       ├── produits/   # Gestion produits
│   │       ├── commandes/  # Gestion commandes
│   │       └── utilisateurs/ # Gestion utilisateurs
│   ├── components/         # Composants React
│   │   ├── Header.jsx      # En-tête navigation
│   │   ├── ConditionalLayout.jsx
│   │   ├── InactivityWrapper.jsx
│   │   └── ProductCarousel.jsx
│   ├── contexts/           # Context API
│   │   └── CartContext.js  # Gestion du panier
│   ├── hooks/              # Custom hooks
│   │   └── useInactivityTimer.js
│   ├── config/             # Configuration
│   │   └── productImages.js # Images produits
│   ├── styles/             # Fichiers CSS
│   │   ├── globals.css
│   │   ├── variables.css
│   │   ├── Header.css
│   │   ├── Home.css
│   │   ├── Auth.css
│   │   ├── Categories.css
│   │   ├── Product.css
│   │   ├── Cart.css
│   │   ├── Orders.css
│   │   ├── Addresses.css
│   │   ├── Admin.css
│   │   └── ...
│   └── public/             # Fichiers statiques
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
│   │   │   └── addressController.js
│   │   ├── routes/         # Routes API
│   │   │   ├── auth.js
│   │   │   ├── products.js
│   │   │   ├── categories.js
│   │   │   ├── orders.js
│   │   │   ├── payment.js
│   │   │   ├── addresses.js
│   │   │   └── users.js
│   │   ├── middleware/     # Middlewares
│   │   │   ├── authMiddleware.js
│   │   │   ├── rateLimiter.js
│   │   │   └── sanitizer.js
│   │   ├── services/       # Services
│   │   │   └── emailService.js
│   │   ├── config/         # Configuration
│   │   │   ├── database.js
│   │   │   └── prisma.js
│   │   └── server.js       # Point d'entrée
│   ├── prisma/
│   │   ├── schema.prisma   # Schéma base de données
│   │   └── migrations/     # Migrations
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
- Vérifier que le webhook Stripe est configuré
- Vérifier les logs Stripe : `stripe listen --forward-to localhost:5002/api/payment/webhook`

### Erreur de connexion à la BDD
- Vérifier que PostgreSQL est démarré
- Vérifier le `DATABASE_URL` dans `.env`
- Lancer `npx prisma db push`

### Images ne s'affichent pas
- Vérifier que les images sont dans `client/my-app/public/images/`
- Vérifier les chemins dans `config/productImages.js`

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
- ✅ Hooks personnalisés (useEffect, useState, custom hooks)
- ✅ Navigation côté client et protection de routes
- ✅ Intégration Stripe pour les paiements
- ✅ CSS moderne avec variables et layouts responsive

### Backend
- ✅ Architecture RESTful avec Express.js
- ✅ Prisma ORM pour PostgreSQL (migrations, relations)
- ✅ Authentification JWT (tokens, refresh, expiration)
- ✅ Middlewares (auth, rate limiting, sanitization)
- ✅ Webhooks Stripe pour les paiements asynchrones
- ✅ Envoi d'emails transactionnels avec Resend
- ✅ Gestion des erreurs et validation des données

### DevOps & Bonnes pratiques
- ✅ Git & GitHub (commits sémantiques, branches)
- ✅ Variables d'environnement (.env, sécurité)
- ✅ Gestion des secrets (API keys, tokens)
- ✅ Documentation technique (README, commentaires)
- ✅ Déploiement production sur Render
- ✅ Testing manuel et debugging

### Sécurité
- ✅ Hachage de mots de passe (bcrypt)
- ✅ Protection CSRF et XSS
- ✅ Rate limiting anti brute-force
- ✅ Validation et sanitization des inputs
- ✅ Tokens JWT avec expiration
- ✅ Protection des routes admin

---

## 🚧 Points d'amélioration futurs

- [ ] Tests automatisés (Jest, Cypress)
- [ ] CI/CD avec GitHub Actions
- [ ] Upload d'images optimisé
- [ ] Recherche avancée et filtres
- [ ] Notifications en temps réel (WebSocket)
- [ ] Analytics et monitoring
- [ ] Mode sombre / thème personnalisable
- [ ] Internationalisation 
- [ ] PWA (Progressive Web App)

---

## 📄 Licence

Projet privé - Tous droits réservés
