// Layout pour toutes les pages admin
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getAccessToken } from '../../utils/auth';
import { useNotifications } from '../../contexts/NotificationContext';
import '../../styles/variables.css'; // 1. Variables d'abord
import '../../styles/globals.css';   // 2. Styles globaux
import '../../styles/Admin.css';     // 3. Styles admin EN DERNIER pour surcharger

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Utiliser le contexte des notifications
  const { unreadMessages, unreadReviews, lowStockCount } = useNotifications();

  useEffect(() => {
    // Fonction pour vérifier l'authentification et les droits admin
    const checkAdminAccess = async () => {
      try {
        // Récupérer le token depuis localStorage
        const token = getAccessToken();
        const userData = localStorage.getItem('user');

        // Si pas de token ou pas de user, rediriger vers login
        if (!token || !userData) {
          console.log('Pas de token ou de données utilisateur');
          router.push('/login');
          return;
        }

        const parsedUser = JSON.parse(userData);

        // Vérifier le rôle dans localStorage (première vérification)
        if (parsedUser.role !== 'ADMIN') {
          console.log('Utilisateur non-admin détecté');
          router.push('/');
          return;
        }

        // NOUVELLE SÉCURITÉ : Vérifier le token JWT auprès du backend
        // Cela empêche quelqu'un de modifier localStorage pour se faire passer pour admin
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // Si le token est invalide ou expiré, le backend renverra 401 ou 403
        if (!response.ok) {
          console.error('Token invalide ou expiré:', response.status);

          // Nettoyer le localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('user');

          // Rediriger vers login avec un message
          setError('Session expirée. Veuillez vous reconnecter.');
          setTimeout(() => router.push('/login'), 2000);
          return;
        }

        // Si tout est OK, afficher l'interface admin
        console.log('Accès admin autorisé');
        setUser(parsedUser);
        setLoading(false);

      } catch (error) {
        console.error('Erreur lors de la vérification:', error);

        // En cas d'erreur, nettoyer et rediriger
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setError('Erreur de connexion. Redirection...');
        setTimeout(() => router.push('/login'), 2000);
      }
    };

    checkAdminAccess();
  }, [router]);

  // Gestion du menu burger
  useEffect(() => {
    const handleOverlayClick = (e) => {
      // Fermer le menu si on clique sur l'overlay (admin-content::before)
      if (sidebarOpen && e.target.classList.contains('admin-content')) {
        setSidebarOpen(false);
      }
    };

    return () => {
      // Cleanup
    };
  }, [sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Ne rien afficher tant que la vérification n'est pas terminée
  if (loading || !user) return null;

  return (
    <div className={`admin-layout ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className={`admin-sidebar-header ${sidebarOpen ? 'open' : ''}`} onClick={toggleSidebar}>
          <div className="sidebar-header-content">
            <Image src="/icones/satistic.png" alt="Administratif" width={24} height={24} />
            <div className="sidebar-header-text">
              <h2>Administratif</h2>
              <p>Mea Vita Créations</p>
            </div>
          </div>

          {/* Burger (visible uniquement sur mobile) */}
          <button
            className={`admin-burger-icon ${sidebarOpen ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleSidebar();
            }}
            aria-label="Toggle menu"
          >
            <span className="admin-burger-line"></span>
            <span className="admin-burger-line"></span>
            <span className="admin-burger-line"></span>
          </button>
        </div>

        <nav>
          <ul className="admin-nav">
            <li>
              <Link
                href="/admin/dashboard"
                className={pathname === '/admin/dashboard' ? 'active' : ''}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="admin-nav-icon">
                  <Image src="/icones/satistic.png" alt="Dashboard" width={20} height={20} />
                </span>
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/commandes"
                className={pathname === '/admin/commandes' ? 'active' : ''}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="admin-nav-icon">
                  <Image src="/icones/delivery-box.png" alt="Commandes" width={20} height={20} />
                </span>
                <span>Commandes</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/produits"
                className={pathname === '/admin/produits' ? 'active' : ''}
                onClick={() => setSidebarOpen(false)}
              >
                <span className={`admin-nav-icon ${lowStockCount > 0 ? 'has-notification' : ''}`}>
                  <Image src="/icones/shopping.png" alt="Produits" width={20} height={20} />
                  {lowStockCount > 0 && (
                    <span className="sidebar-notification-dot"></span>
                  )}
                </span>
                <span>Produits</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/categories"
                className={pathname === '/admin/categories' ? 'active' : ''}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="admin-nav-icon">
                  <Image src="/icones/category.png" alt="Catégories" width={20} height={20} />
                </span>
                <span>Catégories</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/avis"
                className={pathname === '/admin/avis' ? 'active' : ''}
                onClick={() => setSidebarOpen(false)}
              >
                <span className={`admin-nav-icon ${unreadReviews > 0 ? 'has-notification' : ''}`}>
                  <Image src="/icones/review.png" alt="Avis clients" width={20} height={20} />
                  {unreadReviews > 0 && (
                    <span className="sidebar-notification-dot"></span>
                  )}
                </span>
                <span>Avis clients</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/factures"
                className={pathname.startsWith('/admin/factures') ? 'active' : ''}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="admin-nav-icon">
                  <Image src="/icones/invoice.png" alt="Factures" width={20} height={20} />
                </span>
                <span>Factures</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/codes-promo"
                className={pathname === '/admin/codes-promo' ? 'active' : ''}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="admin-nav-icon">
                  <Image src="/icones/promotion.png" alt="Codes promo" width={20} height={20} />
                </span>
                <span>Codes promo</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/messages"
                className={pathname === '/admin/messages' ? 'active' : ''}
                onClick={() => setSidebarOpen(false)}
              >
                <span className={`admin-nav-icon ${unreadMessages > 0 ? 'has-notification' : ''}`}>
                  <Image src="/icones/mail.png" alt="Messages" width={20} height={20} />
                  {unreadMessages > 0 && (
                    <span className="sidebar-notification-dot"></span>
                  )}
                </span>
                <span>Messages</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/utilisateurs"
                className={pathname === '/admin/utilisateurs' ? 'active' : ''}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="admin-nav-icon">
                  <Image src="/icones/users.png" alt="Utilisateurs" width={20} height={20} />
                </span>
                <span>Utilisateurs</span>
              </Link>
            </li>
            <li style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
              <Link href="/" onClick={() => setSidebarOpen(false)}>
                <span className="admin-nav-icon">
                  <Image src="/icones/home.png" alt="Retour au site" width={20} height={20} />
                </span>
                <span>Retour au site</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Contenu principal */}
      <main className="admin-content" onClick={(e) => {
        if (sidebarOpen && e.target === e.currentTarget) {
          setSidebarOpen(false);
        }
      }}>
        {children}
      </main>
    </div>
  );
}