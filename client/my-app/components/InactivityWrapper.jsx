// Composant client pour gérer le timer d'inactivité
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInactivityTimer } from '../hooks/useInactivityTimer';

export default function InactivityWrapper({ children }) {
  const router = useRouter();
  
  // Initialisation lazy pour éviter le warning React
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  });

  // Écouter les changements de connexion/déconnexion
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem('user');
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener('userLoggedIn', handleStorageChange);
    window.addEventListener('userLoggedOut', handleStorageChange);

    return () => {
      window.removeEventListener('userLoggedIn', handleStorageChange);
      window.removeEventListener('userLoggedOut', handleStorageChange);
    };
  }, []);

  // Fonction de déconnexion automatique
  const handleTimeout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('userLoggedOut'));
    router.push('/login');
  };

  // Activer le timer d'inactivité seulement si l'utilisateur est connecté
  useInactivityTimer({
    isActive: !!user,           // Actif uniquement si user connecté
    onTimeout: handleTimeout,   // Callback de déconnexion
    timeout: 20 * 60 * 1000,   // 20 minutes
    debounceMs: 500            // 500ms de debounce
  });

  // Retourner simplement les enfants (contenu de la page)
  return <>{children}</>;
}
