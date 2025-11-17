// Composant Bannière de consentement cookies (RGPD)
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import '../styles/CookieConsent.css';

export default function CookieConsent({ onConsentChange }) {
  const [showBanner, setShowBanner] = useState(false);
  const [hasConsent, setHasConsent] = useState(null);

  useEffect(() => {
    // Vérifier le consentement uniquement côté client
    const consent = localStorage.getItem('cookie-consent');
    
    if (consent === null) {
      // Aucun consentement enregistré, afficher la bannière
      setShowBanner(true);
    } else {
      // Consentement déjà enregistré
      const consentValue = consent === 'true';
      setHasConsent(consentValue);
      onConsentChange(consentValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAccept = () => {
    // Sauvegarder le consentement
    localStorage.setItem('cookie-consent', 'true');
    setHasConsent(true);
    setShowBanner(false);
    
    // Activer Google Analytics
    onConsentChange(true);
  };

  const handleDecline = () => {
    // Sauvegarder le refus
    localStorage.setItem('cookie-consent', 'false');
    setHasConsent(false);
    setShowBanner(false);
    
    // Ne pas activer Google Analytics
    onConsentChange(false);
  };

  const handleReopenBanner = () => {
    setShowBanner(true);
  };

  if (!showBanner) {
    // Si la bannière n'est pas affichée, montrer le bouton pour rouvrir
    return (
      <button
        onClick={handleReopenBanner}
        className="cookie-settings-trigger"
        title="Paramètres des cookies"
        aria-label="Paramètres des cookies"
      >
        <Image src="/icones/cookie.png" alt="Cookies" width={24} height={24} />
      </button>
    );
  }

  return (
    <>
      {/* Overlay semi-transparent */}
      <div 
        className="cookie-consent-overlay" 
        onClick={handleDecline}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleDecline()}
        aria-label="Fermer la bannière de cookies"
      />
      
      {/* Bannière */}
      <div className="cookie-consent-banner">
        <div className="cookie-consent-content">
          <div className="cookie-consent-text">
            <h3>
              <Image src="/icones/cookie.png" alt="Cookies" width={24} height={24} style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />
              Respect de votre vie privée
            </h3>
            <p>
              Nous utilisons des cookies pour analyser notre trafic et améliorer votre expérience. 
              Les données sont anonymisées et nous ne partageons aucune information personnelle.{' '}
              <a href="/politique-confidentialite" target="_blank" rel="noopener noreferrer">
                En savoir plus
              </a>
            </p>
          </div>

          <div className="cookie-consent-actions">
            <button 
              className="cookie-consent-btn cookie-consent-btn-decline"
              onClick={handleDecline}
            >
              Refuser
            </button>
            <button 
              className="cookie-consent-btn cookie-consent-btn-accept"
              onClick={handleAccept}
            >
              Accepter
            </button>
          </div>
        </div>
      </div>
    </>
  );
}