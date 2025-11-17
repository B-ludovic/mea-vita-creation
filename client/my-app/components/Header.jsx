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
// Import du contexte notifications
import { useNotifications } from '../contexts/NotificationContext';

// Composant Header (Navigation)
export default function Header() {
    const router = useRouter();

    // État pour stocker l'utilisateur connecté
    const [user, setUser] = useState(null);
    // État pour le menu burger mobile (ouvert/fermé)
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // État pour le dropdown user desktop
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    // État pour savoir si le composant est monté (évite l'erreur d'hydratation)
    const [isMounted, setIsMounted] = useState(false);
    // Utiliser le contexte du panier
    const { getCartCount } = useCart();
    // Utiliser le contexte des notifications (seulement si admin)
    const { getTotalNotifications } = useNotifications();

    // useEffect s'exécute quand le composant s'affiche
    // On vérifie si un utilisateur est connecté
    useEffect(() => {
        setIsMounted(true);
        
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

    // useEffect pour fermer le menu quand on clique en dehors
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Fermer le menu burger
            if (isMenuOpen && 
                !event.target.closest('.nav-menu') && 
                !event.target.closest('.burger-button')) {
                setIsMenuOpen(false);
            }
            // Fermer le dropdown user
            if (isUserDropdownOpen && 
                !event.target.closest('.user-dropdown-container')) {
                setIsUserDropdownOpen(false);
            }
        };

        // Ajouter l'écouteur d'événement
        if (isMenuOpen || isUserDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Nettoyer l'écouteur
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen, isUserDropdownOpen]);

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
            {/* Overlay pour fermer le menu en cliquant en dehors */}
            {isMenuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}
            
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
                        <Link href="/panier" className="cart-link mobile-only-link" onClick={closeMenu}>
                            Panier ({isMounted ? getCartCount() : 0})
                        </Link>
                    </li>
                    {user && (
                        <>
                            <li className="mobile-only-link">
                                <Link href="/mes-commandes" className="orders-link" onClick={closeMenu}>
                                    Mes commandes
                                </Link>
                            </li>
                            <li className="mobile-only-link">
                                <Link href="/ma-wishlist" className="wishlist-link" onClick={closeMenu}>
                                    Mes Favoris
                                </Link>
                            </li>
                            <li className="mobile-only-link">
                                <Link href="/mes-adresses" className="addresses-link" onClick={closeMenu}>
                                    Mes adresses
                                </Link>
                            </li>
                            {user.role === 'ADMIN' && (
                                <>
                                    <li className="mobile-only-link">
                                        <Link href="/admin/avis" className="admin-link" onClick={closeMenu}>
                                            Avis clients
                                        </Link>
                                    </li>
                                    <li className="mobile-only-link">
                                        <Link href="/admin/dashboard" className="admin-link" onClick={closeMenu}>
                                            Admin
                                        </Link>
                                    </li>
                                </>
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
                <div className="desktop-right-section">
                    {/* Icône panier desktop */}
                    <Link href="/panier" className="desktop-cart-icon">
                        <Image 
                            src="/icones/shopping.png" 
                            alt="Panier" 
                            width={28}
                            height={28}
                        />
                        {isMounted && getCartCount() > 0 && (
                            <span className="cart-badge">{getCartCount()}</span>
                        )}
                    </Link>

                    {user ? (
                        // Si connecté : afficher le dropdown user
                        <div className="user-dropdown-container">
                            <button 
                                className="user-greeting-button"
                                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                            >
                                Bonjour {user.firstName} !
                                <Image 
                                    src="/icones/down.png" 
                                    alt="" 
                                    width={12} 
                                    height={12}
                                    className={`dropdown-arrow ${isUserDropdownOpen ? 'open' : ''}`}
                                />
                            </button>
                            
                            {isUserDropdownOpen && (
                                <div className="user-dropdown">
                                    <Link href="/mes-commandes" onClick={() => setIsUserDropdownOpen(false)}>
                                        <Image src="/icones/shopping.png" alt="" width={18} height={18} />
                                        Mes commandes
                                    </Link>
                                    <Link href="/ma-wishlist" onClick={() => setIsUserDropdownOpen(false)}>
                                        <Image src="/icones/favori.png" alt="" width={18} height={18} />
                                        Mes Favoris
                                    </Link>
                                    <Link href="/mes-adresses" onClick={() => setIsUserDropdownOpen(false)}>
                                        <Image src="/icones/home.png" alt="" width={18} height={18} />
                                        Mes adresses
                                    </Link>
                                    {user.role === 'ADMIN' && (
                                        <>
                                            <Link href="/admin/avis" onClick={() => setIsUserDropdownOpen(false)}>
                                                <Image src="/icones/review.png" alt="" width={18} height={18} />
                                                Avis clients
                                            </Link>
                                            <Link href="/admin/dashboard" onClick={() => setIsUserDropdownOpen(false)} className="admin-link-with-badge">
                                                <div className="link-content">
                                                    <Image src="/icones/satistic.png" alt="" width={18} height={18} />
                                                    Admin
                                                </div>
                                                {isMounted && getTotalNotifications() > 0 && (
                                                    <span className="admin-badge">{getTotalNotifications()}</span>
                                                )}
                                            </Link>
                                        </>
                                    )}
                                    <hr />
                                    <button className="dropdown-logout" onClick={() => {
                                        setIsUserDropdownOpen(false);
                                        handleLogout();
                                    }}>
                                        Déconnexion
                                    </button>
                                </div>
                            )}
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
                </div>
            </nav>
        </header>
    );
}