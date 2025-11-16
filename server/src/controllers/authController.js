// Importer les modules nécessaires
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const prisma = require('../config/prisma');
const { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail } = require('../services/emailService');

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

        // SÉCURITÉ : Message générique pour éviter l'énumération d'emails
        if (existingUser) {
            return res.status(400).json({
                message: 'Une erreur est survenue lors de l\'inscription. Veuillez vérifier vos informations.'
            });
        }

        // 4. Crypter le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Générer un token de vérification
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        // 6. Créer l'utilisateur dans la base de données
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                role: 'CLIENT',
                isActive: false,
                emailVerificationToken: verificationToken,
                emailVerificationExpires: verificationExpires
            }
        });

        // 7. Envoyer l'email de vérification
        const emailResult = await sendVerificationEmail(user.email, user.firstName, verificationToken);
        
        if (!emailResult.success) {
            console.error('Erreur envoi email:', emailResult.error);
        }

        // 8. Renvoyer la réponse
        res.status(201).json({
            message: 'Compte créé avec succès. Veuillez vérifier votre email pour activer votre compte.',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });

    } catch (error) {
        // SÉCURITÉ : Ne jamais logger l'objet error complet (peut contenir des mots de passe)
        // On log uniquement le message d'erreur (safe)
        console.error('Erreur lors de l\'inscription:', error.message);
        // En développement uniquement, on peut logger la stack pour débugger
        if (process.env.NODE_ENV === 'development') {
            console.error('Stack:', error.stack);
        }
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

        // 4.5. Vérifier si le compte est activé
        // SÉCURITÉ : Même message que si l'email n'existe pas (évite énumération)
        if (!user.isActive) {
            return res.status(401).json({
                message: 'Email ou mot de passe incorrect'
            });
        }

        // 5. Vérifier le mot de passe
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
        // SÉCURITÉ : Logger uniquement le message, pas l'objet complet
        console.error('Erreur lors de la connexion:', error.message);
        res.status(500).json({
            message: 'Erreur serveur lors de la connexion'
        });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(400).json({
                message: 'Token manquant'
            });
        }

        const user = await prisma.user.findUnique({
            where: { emailVerificationToken: token }
        });

        if (!user) {
            return res.status(400).json({
                message: 'Token invalide'
            });
        }

        if (new Date() > user.emailVerificationExpires) {
            return res.status(400).json({
                message: 'Le lien de vérification a expiré'
            });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                isActive: true,
                emailVerificationToken: null,
                emailVerificationExpires: null
            }
        });

        sendWelcomeEmail(user.email, user.firstName).catch(err => {
            console.error('Erreur envoi email de bienvenue:', err);
        });

        const jwtToken = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Email vérifié avec succès',
            token: jwtToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        });

    } catch (error) {
        // SÉCURITÉ : Logger uniquement le message
        console.error('Erreur lors de la vérification:', error.message);
        res.status(500).json({
            message: 'Erreur serveur lors de la vérification'
        });
    }
};

// FONCTION POUR DEMANDER LA RÉINITIALISATION DU MOT DE PASSE
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: 'Email requis'
            });
        }

        // Chercher l'utilisateur
        const user = await prisma.user.findUnique({
            where: { email }
        });

        // Pour des raisons de sécurité, on renvoie toujours le même message
        // même si l'email n'existe pas (pour éviter l'énumération d'emails)
        if (!user) {
            return res.json({
                message: 'Si cet email existe, un lien de réinitialisation a été envoyé.'
            });
        }

        // Générer un token de réinitialisation
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

        // Sauvegarder le token dans la base
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: resetToken,
                resetPasswordExpires: resetExpires
            }
        });

        // Envoyer l'email
        const emailResult = await sendPasswordResetEmail(user.email, user.firstName, resetToken);
        
        if (!emailResult.success) {
            console.error('Erreur envoi email:', emailResult.error);
        }

        res.json({
            message: 'Si cet email existe, un lien de réinitialisation a été envoyé.'
        });

    } catch (error) {
        // SÉCURITÉ : Logger uniquement le message
        console.error('Erreur lors de la demande de réinitialisation:', error.message);
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
};

// FONCTION POUR RÉINITIALISER LE MOT DE PASSE
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                message: 'Token et nouveau mot de passe requis'
            });
        }

        // Vérifier la complexité du mot de passe
        if (newPassword.length < 8) {
            return res.status(400).json({
                message: 'Le mot de passe doit contenir au moins 8 caractères'
            });
        }

        if (!/[A-Z]/.test(newPassword)) {
            return res.status(400).json({
                message: 'Le mot de passe doit contenir au moins une majuscule'
            });
        }

        if (!/[a-z]/.test(newPassword)) {
            return res.status(400).json({
                message: 'Le mot de passe doit contenir au moins une minuscule'
            });
        }

        if (!/[0-9]/.test(newPassword)) {
            return res.status(400).json({
                message: 'Le mot de passe doit contenir au moins un chiffre'
            });
        }

        // Chercher l'utilisateur avec ce token
        const user = await prisma.user.findUnique({
            where: { resetPasswordToken: token }
        });

        if (!user) {
            return res.status(400).json({
                message: 'Token invalide ou expiré'
            });
        }

        // Vérifier si le token n'a pas expiré
        if (new Date() > user.resetPasswordExpires) {
            return res.status(400).json({
                message: 'Le lien de réinitialisation a expiré'
            });
        }

        // Hasher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Mettre à jour le mot de passe et supprimer le token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null
            }
        });

        res.json({
            message: 'Mot de passe réinitialisé avec succès'
        });

    } catch (error) {
        // SÉCURITÉ : Logger uniquement le message
        console.error('Erreur lors de la réinitialisation:', error.message);
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
};

// Exporter les fonctions pour les utiliser dans les routes
module.exports = {
    register,
    login,
    verifyEmail,
    forgotPassword,
    resetPassword
};