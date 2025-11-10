// MIDDLEWARE POUR GÉRER L'UPLOAD DE FICHIERS

// Ce fichier configure Multer pour permettre l'upload d'images de produits
// Multer est une bibliothèque qui facilite la gestion des fichiers uploadés

const multer = require('multer');
const path = require('path');
const fs = require('fs');


// ÉTAPE 1 : DÉFINIR OÙ ET COMMENT SAUVEGARDER LES FICHIERS


const storage = multer.diskStorage({
  
  // Fonction 1 : Choisir le DOSSIER de destination 
  destination: function (req, file, cb) {
    // On veut sauvegarder les images dans le dossier public du frontend
    // pour qu'elles soient accessibles directement sur le site
    const uploadDir = path.join(__dirname, '../../../client/my-app/public/images/products');
    
    // Si le dossier n'existe pas encore, on le crée automatiquement
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // cb = callback (fonction de retour)
    // null = pas d'erreur
    // uploadDir = le chemin du dossier
    cb(null, uploadDir);
  },
  
  // Fonction 2 : Choisir le NOM du fichier 
  filename: function (req, file, cb) {
    // On génère un nom unique pour éviter que 2 fichiers aient le même nom
    // Exemple: 1699612345678-987654321-mon-produit.jpg
    
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Date.now() = timestamp actuel (ex: 1699612345678)
    // Math.round(Math.random() * 1E9) = nombre aléatoire (ex: 987654321)
    
    const ext = path.extname(file.originalname); // Extension: .jpg, .png, etc.
    const baseName = path.basename(file.originalname, ext); // Nom sans extension
    
    // Nettoyer le nom du fichier (enlever accents et caractères spéciaux)
    const cleanBaseName = baseName
      .toLowerCase()                               // tout en minuscules
      .normalize('NFD')                            // séparer les accents
      .replace(/[\u0300-\u036f]/g, '')            // enlever les accents
      .replace(/[^a-z0-9]+/g, '-')                // remplacer espaces et symboles par -
      .replace(/^-+|-+$/g, '');                   // enlever les - au début/fin
    
    // Nom final: timestamp-random-nom-propre.extension
    const finalName = uniqueSuffix + '-' + cleanBaseName + ext;
    
    cb(null, finalName);
  }
});


// ÉTAPE 2 : DÉFINIR LES RÈGLES DE VALIDATION


// Fonction pour vérifier que c'est bien une image
const fileFilter = (req, file, cb) => {
  // Liste des types de fichiers autorisés (types MIME)
  const allowedTypes = [
    'image/jpeg',  // .jpg ou .jpeg
    'image/jpg',   // .jpg
    'image/png',   // .png
    'image/webp',  // .webp (format moderne)
    'image/gif'    // .gif
  ];
  
  // Vérifier si le type du fichier uploadé est dans la liste
  if (allowedTypes.includes(file.mimetype)) {
    // Fichier accepté
    cb(null, true);
  } else {
    // Fichier refusé
    const error = new Error('Type de fichier non autorisé. Seules les images sont acceptées (jpg, png, webp, gif)');
    cb(error, false);
  }
};

// ÉTAPE 3 : CRÉER LE MIDDLEWARE MULTER

const upload = multer({
  storage: storage,        // Où et comment sauvegarder (défini plus haut)
  fileFilter: fileFilter,  // Quels fichiers accepter (défini plus haut)
  limits: {
    fileSize: 5 * 1024 * 1024  // Taille maximum: 5 MB
    // Calcul: 5 * 1024 KB * 1024 octets = 5 242 880 octets = 5 MB
  }
});

// EXPORTER LE MIDDLEWARE POUR L'UTILISER DANS LES ROUTES

// On pourra l'utiliser comme ceci dans les routes:
// router.post('/upload', upload.single('image'), controller)

module.exports = upload;
