// Context pour gérer le panier (cart) dans toute l'application
'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

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
  const [cart, setCart] = useState([]);

  // Charger le panier depuis localStorage au démarrage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Sauvegarder le panier dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // FONCTION : Ajouter un produit au panier
  const addToCart = useCallback((product, quantity = 1) => {
    setCart((prevCart) => {
      // Vérifier si le produit existe déjà dans le panier
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        // Si oui, augmenter la quantité
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Si non, ajouter le produit
        return [...prevCart, { ...product, quantity }];
      }
    });
  }, []);

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
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
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

  // Valeurs et fonctions disponibles dans toute l'application
  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}