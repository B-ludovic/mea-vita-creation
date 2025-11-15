// Context pour gérer le panier (cart) dans toute l'application
'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

// Créer le contexte
const CartContext = createContext();

// Hook personnalisé pour utiliser le panier facilement
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart doit être utilisé dans un CartProvider');
  }
  return context;
};

// Provider du panier (entoure toute l'application)
export function CartProvider({ children }) {
  // État du panier (tableau d'articles)
  // Initialiser directement avec localStorage pour éviter les cascading renders
  const [cart, setCart] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });
  
  // Callback pour afficher les alertes (sera fourni par les composants qui utilisent le hook useModal)
  // Utilisation de useRef pour éviter les re-renders en boucle
  const alertCallbackRef = useRef(null);

  // Sauvegarder le panier dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // FONCTION : Ajouter un produit au panier
  // Retourne true si l'ajout a réussi, false sinon
  const addToCart = useCallback((product, quantity = 1) => {
    // Vérifier si le produit existe déjà dans le panier
    const existingItem = cart.find((item) => item.id === product.id);
    
    if (existingItem) {
      // Calculer la nouvelle quantité totale
      const newQuantity = existingItem.quantity + quantity;
      
      // SÉCURITÉ : Vérifier qu'on ne dépasse pas le stock disponible
      if (newQuantity > product.stock) {
        // Utiliser le callback si disponible, sinon fallback sur alert natif
        if (alertCallbackRef.current) {
          alertCallbackRef.current(`Stock insuffisant ! Seulement ${product.stock} disponible(s).`, 'Stock limité', '/icones/help.png');
        } else {
          alert(`⚠️ Stock insuffisant ! Seulement ${product.stock} disponible(s).`);
        }
        return false; // Échec
      }
      
      // Si OK, augmenter la quantité
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
      return true; // Succès
    } else {
      // SÉCURITÉ : Vérifier le stock avant d'ajouter un nouveau produit
      if (quantity > product.stock) {
        // Utiliser le callback si disponible, sinon fallback sur alert natif
        if (alertCallbackRef.current) {
          alertCallbackRef.current(`Stock insuffisant ! Seulement ${product.stock} disponible(s).`, 'Stock limité', '/icones/help.png');
        } else {
          alert(`⚠️ Stock insuffisant ! Seulement ${product.stock} disponible(s).`);
        }
        return false; // Échec
      }
      
      // Si OK, ajouter le produit
      setCart((prevCart) => [...prevCart, { ...product, quantity }]);
      return true; // Succès
    }
  }, [cart]);

  // FONCTION : Retirer un produit du panier
  const removeFromCart = useCallback((productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  }, []);

  // FONCTION : Modifier la quantité d'un produit
  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === productId) {
          // SÉCURITÉ : Vérifier qu'on ne dépasse pas le stock disponible
          if (quantity > item.stock) {
            // Utiliser le callback si disponible, sinon fallback sur alert natif
            if (alertCallbackRef.current) {
              alertCallbackRef.current(`Stock insuffisant ! Seulement ${item.stock} disponible(s).`, 'Stock limité', '/icones/help.png');
            } else {
              alert(`⚠️ Stock insuffisant ! Seulement ${item.stock} disponible(s).`);
            }
            return item; // Garder la quantité actuelle
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  }, [removeFromCart]);

  // FONCTION : Vider le panier
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // FONCTION : Calculer le total du panier
  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  // FONCTION : Compter le nombre total d'articles
  const getCartCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  // Fonction pour enregistrer le callback d'alerte
  const setAlertCallback = useCallback((callback) => {
    alertCallbackRef.current = callback;
  }, []);

  // Valeurs et fonctions disponibles dans toute l'application
  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    setAlertCallback, // Permet aux composants d'enregistrer leur fonction showAlert
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}