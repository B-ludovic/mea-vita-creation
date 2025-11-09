// Composant client pour gérer le timer d'inactivité
'use client';

import { useInactivityTimer } from '../hooks/useInactivityTimer';

export default function InactivityWrapper({ children }) {
  // Activer le timer d'inactivité pour toute l'application
  useInactivityTimer();

  // Retourner simplement les enfants (contenu de la page)
  return <>{children}</>;
}
