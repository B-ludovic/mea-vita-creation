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
        
        // Déclencher un événement personnalisé pour notifier la déconnexion
        window.dispatchEvent(new Event('userLoggedOut'));
        
        router.push('/');
    };

    return (
        <header className="header">
            <nav className="nav">
                {/* Logo et nom du site */}
                <Link href="/" className="logo">
                    <Image 
                        src="/Logo_François_sansfond.PNG" 
                        alt="Mea Vita Création Logo" 
                        width={50}
                        height={50}
                        className="logo-img"
                        priority
                    />
                    <h1>MEA VITA CRÉATION</h1>
                </Link>

                {/* Menu de navigation */}
                <ul className="nav-menu">
                    <li>
                        <Link href="/">Accueil</Link>
                    </li>
                    <li>
                        <Link href="/categories">Catégories</Link>
                    </li>
                    <li>
                        <Link href="/apropos">À Propos</Link>
                    </li>
                    <li>
                        <Link href="/contact">Contact</Link>
                    </li>
                    <li>
                        <Link href="/panier" className="cart-link">
                            <Image 
                                src="/e-commerce.png" 
                                alt="Panier" 
                                width={24}
                                height={24}
                                className="cart-icon"
                            />
                            <span>Panier ({getCartCount()})</span>
                        </Link>
                    </li>
                </ul>

                {/* Affichage conditionnel selon si l'utilisateur est connecté */}
                {user ? (
                    // Si connecté : afficher le nom + bouton déconnexion
                    <div className="auth-buttons">
                        <span className="user-greeting">
                            Bonjour {user.firstName} !
                        </span>
                        <button className="btn-logout" onClick={handleLogout}>
                            Déconnexion
                        </button>
                    </div>
                ) : (
                    // Si non connecté : afficher les boutons connexion/inscription
                    <div className="auth-buttons">
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