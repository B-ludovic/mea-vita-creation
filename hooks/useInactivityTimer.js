// Hook personnalisé pour gérer la déconnexion automatique après inactivité
// Durée d'inactivité : 20 minutes

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export function useInactivityTimer() {
  const router = useRouter();
  
  // Utiliser useRef pour garder une référence au timer
  // useRef persiste entre les rendus sans déclencher de re-render
  const timerRef = useRef(null);

  // Durée d'inactivité en millisecondes (20 minutes = 20 * 60 * 1000)
  const INACTIVITY_TIME = 20 * 60 * 1000; // 20 minutes

  // Fonction pour déconnecter l'utilisateur
  const handleLogout = () => {
    // Supprimer le token et les infos utilisateur
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Déclencher un événement pour notifier les autres composants
    window.dispatchEvent(new Event('userLoggedOut'));
    
    // Afficher un message à l'utilisateur
    alert('Vous avez été déconnecté pour cause d\'inactivité (20 minutes)');
    
    // Rediriger vers la page de connexion
    router.push('/login');
  };

  // Fonction pour réinitialiser le timer
  const resetTimer = () => {
    // Si un timer existe déjà, on l'annule
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Créer un nouveau timer de 20 minutes
    timerRef.current = setTimeout(() => {
      handleLogout();
    }, INACTIVITY_TIME);
  };

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('token');
    
    // Si pas de token, pas besoin du timer
    if (!token) {
      return;
    }

    // Liste des événements qui réinitialisent le timer
    // (= actions de l'utilisateur qui montrent qu'il est actif)
    const events = [
      'mousedown',    // Clic de souris
      'mousemove',    // Mouvement de souris
      'keypress',     // Touche clavier pressée
      'scroll',       // Scroll de la page
      'touchstart',   // Touch sur mobile
      'click'         // Clic
    ];

    // Démarrer le timer initial
    resetTimer();

    // Ajouter les écouteurs d'événements
    // À chaque action, on réinitialise le timer
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Fonction de nettoyage (s'exécute quand le composant se démonte)
    return () => {
      // Supprimer tous les écouteurs d'événements
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
      
      // Annuler le timer s'il existe
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []); // Le tableau vide [] signifie : s'exécute une seule fois au montage

  // Ce hook ne retourne rien, il travaille en arrière-plan
}
