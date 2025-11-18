// Composant pour afficher conditionnellement le Header et Footer selon la route
'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  
  // Ne pas afficher le Header et Footer sur les pages admin
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    // Pages admin : pas de Header, pas de Footer, pas de padding
    return <>{children}</>;
  }

  // Pages normales : avec Header, Footer et padding
  return (
    <>
      <Header />
      <main style={{ paddingTop: '100px' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
