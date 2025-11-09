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

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté et est admin
    const userData = localStorage.getItem('user');
    
    if (!userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    
    // Vérifier si c'est un admin
    if (parsedUser.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    setUser(parsedUser);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh' 
      }}>
        <h2>Chargement...</h2>
      </div>
    );
  }

  if (!user) {
    return null;
  }

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