// Directive pour indiquer que c'est un composant client
'use client';

//import de promo code
import PromoCodeInput from '../../components/PromoCodeInput';

// Import des hooks et contexte
import { useCart } from '../../contexts/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import { useModal } from '../../hooks/useModal';
import { getAccessToken } from '../../utils/auth';

// Import du CSS
import '../../styles/Cart.css';

export default function CartPage() {
  // Utiliser le contexte du panier
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount, setAlertCallback } = useCart();
  const { modalState, showAlert, showConfirm, closeModal } = useModal();

  // Enregistrer la fonction showAlert dans le CartContext pour les alertes de stock
  useEffect(() => {
    setAlertCallback(() => showAlert);
    // Nettoyer au démontage du composant
    return () => setAlertCallback(null);
  }, [setAlertCallback, showAlert]);

  // État pour gérer le chargement du paiement
  const [loading, setLoading] = useState(false);
  
  // État pour stocker les images des produits
  const [productImages, setProductImages] = useState({});

  // NOUVEAUX ÉTATS POUR LA GESTION DES ADRESSES
  // État pour stocker l'utilisateur connecté (initialisé depuis localStorage)
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  });
  
  // État pour stocker toutes les adresses de l'utilisateur
  const [addresses, setAddresses] = useState([]);
  
  // État pour stocker l'ID de l'adresse sélectionnée
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  
  // État pour afficher/masquer le formulaire de nouvelle adresse
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  // État pour le formulaire de nouvelle adresse
  const [newAddress, setNewAddress] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'France',
    phone: '',
    isDefault: false
  });

  // État pour stocker le code promo appliqué
  const [appliedPromo, setAppliedPromo] = useState(null);

  // Charger les images depuis la BDD
  useEffect(() => {
    const loadImages = async () => {
      // Pour chaque produit du panier
      for (const item of cart) {
        try {
          // Appeler l'API pour récupérer le produit complet
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${item.slug}`);
          const data = await response.json();
          
          // Si on a une image, la stocker
          if (data.success && data.product.ProductImage?.length > 0) {
            setProductImages(prev => ({
              ...prev,
              [item.id]: data.product.ProductImage[0].url
            }));
          }
        } catch (error) {
          console.error('Erreur chargement image:', error);
        }
      }
    };
    
    if (cart.length > 0) {
      loadImages();
    }
  }, [cart]);

  // FONCTION POUR CHARGER LES ADRESSES DE L'UTILISATEUR
  const loadUserAddresses = async (userId) => {
    try {
      // Appel API pour récupérer les adresses
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/addresses/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${getAccessToken()}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setAddresses(data.addresses);
        
        // Sélectionner automatiquement l'adresse par défaut (s'il y en a une)
        const defaultAddress = data.addresses.find(addr => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des adresses:', error);
    }
  };

  // CHARGER LES ADRESSES DE L'UTILISATEUR AU MONTAGE
  useEffect(() => {
    if (user) {
      // Pré-remplir le formulaire avec les infos de l'utilisateur
      setNewAddress(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || ''
      }));
      
      // Charger les adresses de cet utilisateur
      loadUserAddresses(user.id);
    }
  }, [user?.id]); // Dépendance sur l'ID de l'utilisateur

  // FONCTION POUR CRÉER UNE NOUVELLE ADRESSE
  const handleCreateAddress = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify({
          ...newAddress,
          userId: user.id
        })
      });

      const data = await response.json();

      if (data.success) {
        // Recharger les adresses
        loadUserAddresses(user.id);
        // Sélectionner la nouvelle adresse
        setSelectedAddressId(data.address.id);
        // Fermer le formulaire
        setShowAddressForm(false);
        // Réinitialiser le formulaire
        setNewAddress({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          street: '',
          city: '',
          postalCode: '',
          country: 'France',
          phone: '',
          isDefault: false
        });
      } else {
        showAlert(data.message || 'Erreur lors de la création de l\'adresse', 'Erreur', '/icones/annuler.png');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showAlert('Erreur lors de la création de l\'adresse', 'Erreur', '/icones/annuler.png');
    }
  };

  // Fonction pour rediriger vers Stripe
  const handleCheckout = async () => {
    // PROTECTION 1 : VÉRIFIER QUE L'UTILISATEUR EST CONNECTÉ
    if (!user) {
      showAlert('Vous devez être connecté pour passer commande', 'Connexion requise', '/icones/annuler.png');
      // Rediriger vers la page de connexion après 2 secondes
      setTimeout(() => {
        window.location.href = '/login?redirect=/panier';
      }, 2000);
      return;
    }

    // PROTECTION 2 : VÉRIFIER QU'UNE ADRESSE EST SÉLECTIONNÉE
    if (!selectedAddressId) {
      showAlert('Veuillez sélectionner une adresse de livraison', 'Adresse requise', '/icones/location.png');
      return;
    }

    setLoading(true);
    
    try {
      // Récupérer l'utilisateur connecté
      const userData = localStorage.getItem('user');
      const userObj = userData ? JSON.parse(userData) : null;
      
      // Appeler l'API pour créer la session Stripe
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart,
          userId: userObj?.id || null,
          addressId: selectedAddressId, // Envoyer l'adresse sélectionnée
          promoCodeId: appliedPromo?.id || null // Envoyer le code promo si appliqué
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Rediriger vers la page de paiement Stripe
        window.location.href = data.url;
      } else {
        showAlert('Erreur lors de la création de la session de paiement', 'Erreur', '/icones/paiment-refuse.png');
        setLoading(false);
      }
      
    } catch (error) {
      console.error('Erreur:', error);
      showAlert('Erreur de connexion au serveur', 'Erreur', '/icones/annuler.png');
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
          <p className="cart-header-count">
            {getCartCount()} article{getCartCount() > 1 ? 's' : ''} dans votre panier
          </p>
        </div>

        <div className="cart-content">
          {/* Liste des articles */}
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  {productImages[item.id] ? (
                    <Image 
                      src={productImages[item.id]} 
                      alt={item.name}
                      width={80}
                      height={80}
                      className="cart-item-img"
                    />
                  ) : (
                    <div className="cart-item-image-placeholder">
                      <Image 
                        src="/icones/shopping.png" 
                        alt="Produit" 
                        width={50} 
                        height={50}
                      />
                    </div>
                  )}
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
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Retirer
                  </button>
                </div>
              </div>
            ))}

            {/* SECTION ADRESSE DE LIVRAISON (seulement si l'utilisateur est connecté) */}
            {user && (
              <div className="delivery-address-section">
                <h2>
                  <Image 
                    src="/icones/location.png" 
                    alt="Adresse" 
                    width={24} 
                    height={24}
                    className="clear-cart-icon"
                  />
                  Adresse de livraison
                </h2>
                
                {/* Liste des adresses existantes */}
                {addresses.length > 0 && (
                  <div className="address-list">
                    {addresses.map((address) => (
                      <div 
                        key={address.id} 
                        className={`address-option ${selectedAddressId === address.id ? 'selected' : ''}`}
                        onClick={() => setSelectedAddressId(address.id)}
                      >
                        <div className="radio-container">
                          <input 
                            type="radio" 
                            name="deliveryAddress" 
                            checked={selectedAddressId === address.id}
                            onChange={() => setSelectedAddressId(address.id)}
                          />
                        </div>
                        <div className="address-details">
                          <p className="address-name">
                            {address.firstName} {address.lastName}
                            {address.isDefault && <span className="badge-default-small">Par défaut</span>}
                          </p>
                          <p>{address.street}</p>
                          <p>{address.postalCode} {address.city}</p>
                          <p>{address.country}</p>
                          <p>{address.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Bouton pour ajouter une nouvelle adresse */}
                {!showAddressForm && (
                  <button 
                    className="btn-add-address-inline"
                    onClick={() => setShowAddressForm(true)}
                  >
                    + Ajouter une nouvelle adresse
                  </button>
                )}

                {/* Formulaire pour ajouter une nouvelle adresse */}
                {showAddressForm && (
                  <form className="new-address-form" onSubmit={handleCreateAddress}>
                    <h3>Nouvelle adresse</h3>
                    
                    <div className="form-row">
                      <input
                        type="text"
                        placeholder="Prénom *"
                        value={newAddress.firstName}
                        onChange={(e) => setNewAddress({...newAddress, firstName: e.target.value})}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Nom *"
                        value={newAddress.lastName}
                        onChange={(e) => setNewAddress({...newAddress, lastName: e.target.value})}
                        required
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="Adresse complète *"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                      required
                    />

                    <div className="form-row">
                      <input
                        type="text"
                        placeholder="Ville *"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Code postal *"
                        value={newAddress.postalCode}
                        onChange={(e) => setNewAddress({...newAddress, postalCode: e.target.value})}
                        required
                      />
                    </div>

                    <div className="form-row">
                      <input
                        type="text"
                        placeholder="Pays"
                        value={newAddress.country}
                        onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                      />
                      <input
                        type="tel"
                        placeholder="Téléphone *"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                        required
                      />
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="btn-submit-address">
                        Enregistrer
                      </button>
                      <button 
                        type="button" 
                        className="btn-cancel-address"
                        onClick={() => setShowAddressForm(false)}
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Récapitulatif */}
          <div className="cart-summary">
            <h2>Récapitulatif</h2>

            {/* Avertissement si non connecté */}
            {!user && (
              <div className="login-warning">
                <Image 
                  src="/icones/annuler.png" 
                  alt="Attention" 
                  width={24} 
                  height={24}
                />
                <div>
                  <strong>Connexion requise</strong>
                  <p>Vous devez être connecté pour passer commande</p>
                  <Link href="/login?redirect=/panier" className="login-link">
                    Se connecter
                  </Link>
                </div>
              </div>
            )}

            {/* Code promo */}
            <PromoCodeInput 
              cartTotal={getCartTotal()}
              onPromoApplied={(promo) => setAppliedPromo(promo)}
            />

            <div className="summary-line">
              <span>Sous-total </span>
              <span>{getCartTotal().toFixed(2)}€</span>
            </div>

            <div className="summary-line">
              <span>Livraison Gratuite</span>
            </div>

            {appliedPromo && (
              <div className="summary-line discount">
                <span>Réduction ({appliedPromo.code}) </span>
                <span className="discount-amount">-{appliedPromo.discountAmount.toFixed(2)}€</span>
              </div>
            )}

            <div className="summary-line total">
              <span>Total </span>
              <span>
                {appliedPromo 
                  ? (getCartTotal() - appliedPromo.discountAmount).toFixed(2)
                  : getCartTotal().toFixed(2)
                }€
              </span>
            </div>

            <button
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={loading || !user || !selectedAddressId}
              title={!user ? 'Vous devez être connecté' : (!selectedAddressId ? 'Sélectionnez une adresse de livraison' : '')}
            >
              {loading ? 'Redirection vers Stripe...' : (
                !user ? 'Connexion requise' : 'Procéder au paiement'
              )}
            </button>

            <button
              className="clear-cart-btn"
              onClick={() => {
                showConfirm(
                  'Êtes-vous sûr de vouloir vider le panier ? Cette action est irréversible.',
                  () => {
                    clearCart();
                    showAlert('Le panier a été vidé', 'Panier vidé', '/icones/validation.png');
                  },
                  'Vider le panier',
                  '/icones/trash.png'
                );
              }}
            >
              Vider le panier
            </button>
          </div>
        </div>
      </div>

      {/* Modal pour les notifications */}
      <Modal
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        icon={modalState.icon}
        onConfirm={modalState.onConfirm}
        onCancel={modalState.onCancel}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        showCancelButton={modalState.showCancelButton}
      />
    </div>
  );
}