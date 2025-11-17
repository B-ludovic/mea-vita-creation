// Import Analytics Wrapper
import AnalyticsWrapper from '../components/AnalyticsWrapper';

// Import du modal mode test
import TestModeModal from '../components/TestModeModal';

// Import du CSS global
import '../styles/globals.css';

// Import du composant Header
import Header from '../components/Header';

// Import du CartProvider
import { CartProvider } from '../contexts/CartContext';

// Import du NotificationProvider pour les notifications admin
import { NotificationProvider } from '../contexts/NotificationContext';

// Import du wrapper pour le timer d'inactivité
import InactivityWrapper from '../components/InactivityWrapper';

// Import pour détecter le pathname
import ConditionalLayout from '../components/ConditionalLayout';

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
        {/* Modal mode test - S'affiche au chargement */}
        <TestModeModal />
        
        {/* Analytics avec gestion du consentement cookies */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <AnalyticsWrapper GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
        
        {/* CartProvider entoure toute l'application */}
        <CartProvider>
          {/* NotificationProvider pour les notifications admin en temps réel */}
          <NotificationProvider>
            {/* InactivityWrapper gère la déconnexion automatique après 20 minutes */}
            <InactivityWrapper>
              {/* ConditionalLayout gère l'affichage du Header selon la route */}
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
            </InactivityWrapper>
          </NotificationProvider>
        </CartProvider>
      </body>
    </html>
  );
}