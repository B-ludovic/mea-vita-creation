// Layout pour toutes les pages admin
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import '../../styles/variables.css'; // 1. Variables d'abord
import '../../styles/globals.css';   // 2. Styles globaux
import '../../styles/Admin.css';     // 3. Styles admin EN DERNIER pour surcharger

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fonction pour vérifier l'authentification et les droits admin
    const checkAdminAccess = async () => {
      try {
        // Récupérer le token depuis localStorage
        const token = localStorage.getItem('token');
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

  // Ne rien afficher tant que la vérification n'est pas terminée
  if (loading || !user) return null;

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>
            <Image src="/satistic.png" alt="Admin" width={24} height={24} style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />
            Admin
          </h2>
          <p>François Maroquinerie</p>
        </div>

        <nav>
          <ul className="admin-nav">
            <li>
              <Link 
                href="/admin/dashboard" 
                className={pathname === '/admin/dashboard' ? 'active' : ''}
              >
                <span className="admin-nav-icon">
                  <Image src="/satistic.png" alt="Dashboard" width={20} height={20} />
                </span>
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/commandes"
                className={pathname === '/admin/commandes' ? 'active' : ''}
              >
                <span className="admin-nav-icon">
                  <Image src="/delivery-box.png" alt="Commandes" width={20} height={20} />
                </span>
                <span>Commandes</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/produits"
                className={pathname === '/admin/produits' ? 'active' : ''}
              >
                <span className="admin-nav-icon">
                  <Image src="/shopping.png" alt="Produits" width={20} height={20} />
                </span>
                <span>Produits</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/utilisateurs"
                className={pathname === '/admin/utilisateurs' ? 'active' : ''}
              >
                <span className="admin-nav-icon">
                  <Image src="/users.png" alt="Utilisateurs" width={20} height={20} />
                </span>
                <span>Utilisateurs</span>
              </Link>
            </li>
            <li style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
              <Link href="/">
                <span className="admin-nav-icon">
                  <Image src="/home.png" alt="Retour au site" width={20} height={20} />
                </span>
                <span>Retour au site</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Contenu principal */}
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}