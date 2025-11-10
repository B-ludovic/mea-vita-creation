// Directive pour indiquer que c'est un composant client
'use client';

// Import des hooks React
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Import du CSS spécifique au Header
import '../styles/Header.css';
// Import du contexte panier
import { useCart } from '../contexts/CartContext';

// Composant Header (Navigation)
export default function Header() {
    const router = useRouter();

    // État pour stocker l'utilisateur connecté
    const [user, setUser] = useState(null);
    // État pour le menu burger mobile (ouvert/fermé)
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // Utiliser le contexte du panier
    const { getCartCount } = useCart();

    // useEffect s'exécute quand le composant s'affiche
    // On vérifie si un utilisateur est connecté
    useEffect(() => {
        // Fonction pour charger les données utilisateur
        const loadUser = () => {
            const userData = localStorage.getItem('user');
            if (userData) {
                setUser(JSON.parse(userData));
            } else {
                setUser(null);
            }
        };

        // Charger l'utilisateur au montage du composant
        loadUser();

        // Écouter les changements de localStorage (connexion/déconnexion)
        const handleStorageChange = () => {
            loadUser();
        };

        // Écouter les événements personnalisés pour la connexion
        window.addEventListener('userLoggedIn', handleStorageChange);
        window.addEventListener('userLoggedOut', handleStorageChange);
        
        // Nettoyer les écouteurs à la destruction du composant
        return () => {
            window.removeEventListener('userLoggedIn', handleStorageChange);
            window.removeEventListener('userLoggedOut', handleStorageChange);
        };
    }, []);

    // Fonction pour se déconnecter
    const handleLogout = () => {
        // Supprimer le token et les infos utilisateur
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        
        // Fermer le menu mobile si ouvert
        setIsMenuOpen(false);
        
        // Déclencher un événement personnalisé pour notifier la déconnexion
        window.dispatchEvent(new Event('userLoggedOut'));
        
        router.push('/');
    };

    // Fonction pour basculer le menu burger (ouvrir/fermer)
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Fonction pour fermer le menu quand on clique sur un lien
    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className="header">
            <nav className="nav">
                {/* Logo et nom du site */}
                <Link href="/" className="logo" onClick={closeMenu}>
                    <Image 
                        src="/Logo_Francois_sansfond.PNG" 
                        alt="Mea Vita Création Logo" 
                        width={50}
                        height={50}
                        className="logo-img"
                        priority
                    />
                    <h1>MEA VITA CRÉATION</h1>
                </Link>

                {/* Bouton burger pour mobile (visible uniquement sur petit écran) */}
                <button 
                    className={`burger-button ${isMenuOpen ? 'active' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Menu"
                >
                    <span className="burger-line"></span>
                    <span className="burger-line"></span>
                    <span className="burger-line"></span>
                </button>

                {/* Menu de navigation - s'ouvre/ferme en mode mobile */}
                <ul className={`nav-menu ${isMenuOpen ? 'mobile-open' : ''}`}>
                    <li>
                        <Link href="/" onClick={closeMenu}>Accueil</Link>
                    </li>
                    <li>
                        <Link href="/categories" onClick={closeMenu}>Catégories</Link>
                    </li>
                    <li>
                        <Link href="/apropos" onClick={closeMenu}>À Propos</Link>
                    </li>
                    <li>
                        <Link href="/contact" onClick={closeMenu}>Contact</Link>
                    </li>
                    <li>
                        <Link href="/panier" className="cart-link" onClick={closeMenu}>
                            Panier ({getCartCount()})
                        </Link>
                    </li>
                    {user && (
                        <>
                            <li>
                                <Link href="/mes-commandes" className="orders-link" onClick={closeMenu}>
                                    Mes commandes
                                </Link>
                            </li>
                            <li>
                                <Link href="/mes-adresses" className="addresses-link" onClick={closeMenu}>
                                    Mes adresses
                                </Link>
                            </li>
                            {user.role === 'ADMIN' && (
                                <li>
                                    <Link href="/admin/dashboard" className="admin-link" onClick={closeMenu}>
                                        Admin
                                    </Link>
                                </li>
                            )}
                        </>
                    )}

                    {/* Affichage conditionnel selon si l'utilisateur est connecté - VERSION MOBILE */}
                    <li className="mobile-auth">
                        {user ? (
                            // Si connecté : afficher le nom + bouton déconnexion
                            <div className="mobile-auth-content">
                                <span className="user-greeting">
                                    Bonjour {user.firstName} !
                                </span>
                                <button className="btn-logout" onClick={handleLogout}>
                                    Déconnexion
                                </button>
                            </div>
                        ) : (
                            // Si non connecté : afficher les boutons connexion/inscription
                            <div className="mobile-auth-content">
                                <Link href="/login" onClick={closeMenu}>
                                    <button className="btn-login">Connexion</button>
                                </Link>
                                <Link href="/register" onClick={closeMenu}>
                                    <button className="btn-signup">Inscription</button>
                                </Link>
                            </div>
                        )}
                    </li>
                </ul>

                {/* Affichage conditionnel selon si l'utilisateur est connecté - VERSION DESKTOP */}
                {user ? (
                    // Si connecté : afficher le nom + bouton déconnexion
                    <div className="auth-buttons desktop-only">
                        <span className="user-greeting">
                            Bonjour {user.firstName} !
                        </span>
                        <button className="btn-logout" onClick={handleLogout}>
                            Déconnexion
                        </button>
                    </div>
                ) : (
                    // Si non connecté : afficher les boutons connexion/inscription
                    <div className="auth-buttons desktop-only">
                        <Link href="/login">
                            <button className="btn-login">Connexion</button>
                        </Link>
                        <Link href="/register">
                            <button className="btn-signup">Inscription</button>
                        </Link>
                    </div>
                )}
            </nav>
        </header>
    );
}