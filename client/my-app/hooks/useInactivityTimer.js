// Hook personnalisé pour gérer la déconnexion automatique après inactivité
// Durée d'inactivité : 20 minutes

import { useEffect, useRef, useMemo } from 'react';

// Fonction utilitaire (optionnelle) pour "debouncer"
// Vous pouvez aussi utiliser une lib comme lodash.debounce
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}


/**
 * Hook pour déclencher une action après une période d'inactivité.
 * @param {object} options
 * @param {boolean} options.isActive - Le timer doit-il être actif ? (ex: utilisateur connecté)
 * @param {function} options.onTimeout - La fonction à appeler lorsque le timer expire.
 * @param {number} [options.timeout=1200000] - Le temps d'inactivité en ms (défaut: 20 min).
 * @param {number} [options.debounceMs=500] - Délai de debounce pour les événements.
 */
export function useInactivityTimer({
  isActive,
  onTimeout,
  timeout = 20 * 60 * 1000,
  debounceMs = 500
}) {

  const timerRef = useRef(null);
  
  // On utilise une ref pour la callback pour éviter de la mettre en dépendance du useEffect
  // Cela évite de ré-attacher tous les listeners si la fonction onTimeout change
  const onTimeoutRef = useRef(onTimeout);
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  // Créer une version "debounced" de la fonction de reset
  // On utilise useMemo pour ne la créer qu'une seule fois
  const resetTimer = useMemo(() => {
    const internalReset = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        // Appeler la dernière version de la callback
        if (onTimeoutRef.current) {
          onTimeoutRef.current();
        }
      }, timeout);
    };
    
    // "Debouncer" la fonction de réinitialisation
    return debounce(internalReset, debounceMs);
  }, [timeout, debounceMs]);


  useEffect(() => {
    // Si le hook n'est pas censé être actif (user déconnecté),
    // on nettoie tout et on n'attache pas les listeners.
    if (!isActive) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return; // Stop
    }

    // Liste des événements qui réinitialisent le timer
    const events = [
      'mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'
    ];

    // Démarrer le timer initial
    resetTimer();

    // Ajouter les écouteurs d'événements
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Fonction de nettoyage
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
    
    // Ce useEffect dépend de 'isActive', 'timeout', et 'resetTimer' (qui est mémorisé)
    // Si 'isActive' passe à false, le cleanup s'exécute et les timers/listeners sont coupés.
    // Si 'isActive' passe à true, tout est (ré)initialisé.
  }, [isActive, timeout, resetTimer]);
}
