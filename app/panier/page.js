// Directive pour indiquer que c'est un composant client
'use client';

// Import des hooks et contexte
import { useCart } from '../../contexts/CartContext';
import Link from 'next/link';

// Import du CSS
import '../../styles/Cart.css';
// Import de useState pour gérer le loading
import { useState } from 'react';

export default function CartPage() {
  // Utiliser le contexte du panier
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount } = useCart();

  // État pour gérer le chargement du paiement
  const [loading, setLoading] = useState(false);

  // Fonction pour rediriger vers Stripe
  const handleCheckout = async () => {
    setLoading(true);
    
    try {
      // Récupérer l'utilisateur connecté
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;
      
      // Appeler l'API pour créer la session Stripe
      const response = await fetch('http://localhost:5002/api/payment/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart,
          userId: user?.id || null
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Rediriger vers la page de paiement Stripe
        window.location.href = data.url;
      } else {
        alert('Erreur lors de la création de la session de paiement');
        setLoading(false);
      }
      
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur de connexion au serveur');
      setLoading(false);
    }
  };

  // Si le panier est vide
  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <div className="container">
          <div className="cart-empty">
            <h2>Votre panier est vide</h2>
            <p>Découvrez nos magnifiques créations artisanales !</p>
            <Link href="/categories" className="btn-primary">
              Découvrir nos produits
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Si le panier contient des articles
  return (
    <div className="cart-container">
      <div className="container">
        <div className="cart-header">
          <h1>Mon Panier</h1>
          <p style={{ color: 'var(--text-light)' }}>
            {getCartCount()} article{getCartCount() > 1 ? 's' : ''} dans votre panier
          </p>
        </div>

        <div className="cart-content">
          {/* Liste des articles */}
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-emoji">
                  👜
                </div>

                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p className="cart-item-price">{item.price.toFixed(2)}€</p>

                  <div className="cart-item-quantity">
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-item-actions">
                  <div className="cart-item-total">
                    {(item.price * item.quantity).toFixed(2)}€
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Retirer
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Récapitulatif */}
          <div className="cart-summary">
            <h2>Récapitulatif</h2>

            <div className="summary-line">
              <span>Sous-total</span>
              <span>{getCartTotal().toFixed(2)}€</span>
            </div>

            <div className="summary-line">
              <span>Livraison</span>
              <span>Gratuite</span>
            </div>

            <div className="summary-line total">
              <span>Total</span>
              <span>{getCartTotal().toFixed(2)}€</span>
            </div>

            <button
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? 'Redirection vers Stripe...' : 'Procéder au paiement'}
            </button>

            <button
              className="clear-cart-btn"
              onClick={() => {
                if (confirm('Êtes-vous sûr de vouloir vider le panier ?')) {
                  clearCart();
                }
              }}
            >
              Vider le panier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}