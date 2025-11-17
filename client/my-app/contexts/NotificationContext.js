// Contexte pour gérer les notifications admin en temps réel avec Pusher
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Pusher from 'pusher-js';

// Créer le contexte
const NotificationContext = createContext();

// Provider du contexte
export function NotificationProvider({ children }) {
  // États pour compter les notifications non lues
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadReviews, setUnreadReviews] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Vérifier si on est côté client
    if (typeof window === 'undefined') return;

    // Vérifier si l'utilisateur est admin avant de charger les notifications
    const userData = localStorage.getItem('user');
    if (!userData) return;

    const user = JSON.parse(userData);
    if (user.role !== 'ADMIN') return;

    // Charger les notifications initiales depuis l'API
    const loadInitialCounts = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        // Charger le nombre de messages non lus
        const messagesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json();
          const unread = messagesData.messages?.filter(m => !m.isRead).length || 0;
          setUnreadMessages(unread);
        }

        // Charger le nombre d'avis non approuvés
        const reviewsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json();
          const pending = reviewsData.reviews?.filter(r => !r.isApproved).length || 0;
          setUnreadReviews(pending);
        }

        // Charger le nombre de produits en stock faible (≤ 3)
        const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?limit=1000`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          const lowStock = productsData.products?.filter(p => p.stock <= 3 && p.stock > 0).length || 0;
          setLowStockCount(lowStock);
        }
      } catch (error) {
        console.error('Erreur chargement notifications:', error);
      }
    };

    loadInitialCounts();

    // Initialiser Pusher pour les notifications en temps réel (seulement pour admin)
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    // S'abonner au canal admin
    const adminChannel = pusher.subscribe('admin-channel');

    // Écouter les nouveaux messages de contact
    adminChannel.bind('new-contact-message', (data) => {
      setUnreadMessages(prev => prev + 1);
      setNotifications(prev => [{
        id: Date.now(),
        type: 'message',
        ...data
      }, ...prev]);
    });

    // Écouter les nouveaux avis
    adminChannel.bind('new-review', (data) => {
      setUnreadReviews(prev => prev + 1);
      setNotifications(prev => [{
        id: Date.now(),
        type: 'review',
        ...data
      }, ...prev]);
    });

    // Écouter les nouvelles commandes
    adminChannel.bind('new-order', (data) => {
      setNotifications(prev => [{
        id: Date.now(),
        type: 'order',
        ...data
      }, ...prev]);
    });

    // Écouter les alertes de stock faible
    adminChannel.bind('low-stock', (data) => {
      setLowStockCount(prev => prev + 1);
      setNotifications(prev => [{
        id: Date.now(),
        type: 'stock',
        ...data
      }, ...prev]);
    });

    // Nettoyer à la destruction du composant
    return () => {
      adminChannel.unbind_all();
      pusher.unsubscribe('admin-channel');
      pusher.disconnect();
    };
  }, []);

  // Fonction pour marquer un message comme lu
  const markMessageAsRead = () => {
    setUnreadMessages(prev => Math.max(0, prev - 1));
  };

  // Fonction pour marquer un avis comme approuvé
  const markReviewAsApproved = () => {
    setUnreadReviews(prev => Math.max(0, prev - 1));
  };

  // Calculer le total de notifications admin
  const getTotalNotifications = () => {
    return unreadMessages + unreadReviews + lowStockCount;
  };

  return (
    <NotificationContext.Provider value={{
      unreadMessages,
      unreadReviews,
      lowStockCount,
      notifications,
      getTotalNotifications,
      markMessageAsRead,
      markReviewAsApproved
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications doit être utilisé dans un NotificationProvider');
  }
  return context;
}
