// Import du CSS global
import '../styles/globals.css';

// Import du composant Header
import Header from '../components/Header';

// Import du CartProvider
import { CartProvider } from '../contexts/CartContext';

// Import du wrapper pour le timer d'inactivité
import InactivityWrapper from '../components/InactivityWrapper';

// Métadonnées du site
export const metadata = {
  title: 'Mea Vita Création - Créations Artisanales',
  description: 'L\'art de la maroquinerie africaine',
};

// Layout principal de l'application
// Ce composant entoure toutes les pages
export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        {/* CartProvider entoure toute l'application */}
        <CartProvider>
          {/* InactivityWrapper gère la déconnexion automatique après 20 minutes */}
          <InactivityWrapper>
            {/* Header affiché sur toutes les pages */}
            <Header />
            
            {/* Contenu de la page (change selon la page) */}
            <main style={{ paddingTop: '100px' }}>
              {children}
            </main>
          </InactivityWrapper>
        </CartProvider>
      </body>
    </html>
  );
}