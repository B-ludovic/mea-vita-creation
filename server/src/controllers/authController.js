// Importer les modules nécessaires
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

// FONCTION D'INSCRIPTION
// Cette fonction crée un nouveau compte utilisateur
const register = async (req, res) => {
    try {
        // 1. Récupérer les données envoyées par le front-end
        const { email, password, firstName, lastName } = req.body;

        // 2. Vérifier que tous les champs sont remplis
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({
                message: 'Tous les champs sont obligatoires'
            });
        }

        // 2.5. Vérifier la complexité du mot de passe
        if (password.length < 8) {
            return res.status(400).json({
                message: 'Le mot de passe doit contenir au moins 8 caractères'
            });
        }

        // Vérifier qu'il y a au moins une majuscule
        if (!/[A-Z]/.test(password)) {
            return res.status(400).json({
                message: 'Le mot de passe doit contenir au moins une majuscule'
            });
        }

        // Vérifier qu'il y a au moins une minuscule
        if (!/[a-z]/.test(password)) {
            return res.status(400).json({
                message: 'Le mot de passe doit contenir au moins une minuscule'
            });
        }

        // Vérifier qu'il y a au moins un chiffre
        if (!/[0-9]/.test(password)) {
            return res.status(400).json({
                message: 'Le mot de passe doit contenir au moins un chiffre'
            });
        }

        // 3. Vérifier si l'email existe déjà dans la base
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'Cet email est déjà utilisé'
            });
        }

        // 4. Crypter le mot de passe (on ne stocke JAMAIS le mot de passe en clair)
        // Le "10" = nombre de tours de cryptage (plus c'est élevé, plus c'est sécurisé mais lent)
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Créer l'utilisateur dans la base de données
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                role: 'CLIENT' // Par défaut, c'est un utilisateur normal (pas admin)
            }
        });

        // 6. Créer un token JWT (jeton de connexion)
        // Ce token prouve que l'utilisateur est connecté
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET, // Clé secrète (dans le fichier .env)
            { expiresIn: '7d' } // Le token expire après 7 jours
        );

        // 7. Renvoyer la réponse au front-end (SANS le mot de passe !)
        res.status(201).json({
            message: 'Compte créé avec succès',
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error.message);
        console.error('Stack:', error.stack);
        res.status(500).json({
            message: 'Erreur serveur lors de l\'inscription'
        });
    }
};

// FONCTION DE CONNEXION
// Cette fonction connecte un utilisateur existant
const login = async (req, res) => {
    try {
        // 1. Récupérer les données envoyées par le front-end
        const { email, password } = req.body;

        // 2. Vérifier que tous les champs sont remplis
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email et mot de passe obligatoires'
            });
        }

        // 3. Chercher l'utilisateur dans la base
        const user = await prisma.user.findUnique({
            where: { email }
        });

        // 4. Si l'utilisateur n'existe pas
        if (!user) {
            return res.status(401).json({
                message: 'Email ou mot de passe incorrect'
            });
        }

        // 5. Vérifier le mot de passe
        // bcrypt.compare compare le mot de passe en clair avec le mot de passe crypté
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Email ou mot de passe incorrect'
            });
        }

        // 6. Créer un token JWT
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // 7. Renvoyer la réponse au front-end (SANS le mot de passe !)
        res.json({
            message: 'Connexion réussie',
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({
            message: 'Erreur serveur lors de la connexion'
        });
    }
};

// Exporter les fonctions pour les utiliser dans les routes
module.exports = {
    register,
    login
};