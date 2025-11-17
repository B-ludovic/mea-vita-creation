// Wrapper pour Google Analytics avec gestion du consentement
'use client';

import { useState, useEffect } from 'react';
import GoogleAnalytics from './analytics/GoogleAnalytics';
import CookieConsent from './CookieConsent';

export default function AnalyticsWrapper({ GA_MEASUREMENT_ID }) {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // Vérifier si le consentement a déjà été donné
    const consent = localStorage.getItem('cookie-consent');
    if (consent === 'true') {
      setHasConsent(true);
    }
  }, []);

  const handleConsentChange = (consent) => {
    setHasConsent(consent);
    // La clé est déjà sauvegardée dans CookieConsent
  };

  return (
    <>
      {/* Google Analytics - Se charge uniquement si consentement */}
      {hasConsent && <GoogleAnalytics GA_MEASUREMENT_ID={GA_MEASUREMENT_ID} />}
      
      {/* Bannière de consentement cookies */}
      <CookieConsent onConsentChange={handleConsentChange} />
    </>
  );
}
