// Composant pour afficher conditionnellement le Header selon la route
'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  
  // Ne pas afficher le Header sur les pages admin
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    // Pages admin : pas de Header, pas de padding
    return <>{children}</>;
  }

  // Pages normales : avec Header et padding
  return (
    <>
      <Header />
      <main style={{ paddingTop: '100px' }}>
        {children}
      </main>
    </>
  );
}
