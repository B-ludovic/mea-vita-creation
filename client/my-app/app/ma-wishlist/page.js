// Page Ma Wishlist
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../contexts/CartContext';
import { useModal } from '../../hooks/useModal';
import Modal from '../../components/Modal';
import { getAccessToken } from '../../utils/auth';
import '../../styles/ma-wishlist.css';

export default function WishlistPage() {
  const router = useRouter();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();
  const { modalState, showAlert, closeModal } = useModal();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const token = getAccessToken();
      
      if (!token) {
        setError('Vous devez être connecté pour voir vos favoris');
        setLoading(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setError('Session expirée, veuillez vous reconnecter');
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (data.success) {
        setWishlist(data.wishlist);
      } else {
        setError('Impossible de charger les favoris');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (wishlistItemId) => {
    try {
      const token = getAccessToken();

      if (!token) {
        showAlert('Vous devez être connecté', 'Erreur', '/icones/error.png');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/${wishlistItemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Retirer de l'état local
        setWishlist(wishlist.filter(item => item.id !== wishlistItemId));
        showAlert('Produit retiré de vos favoris', 'Succès', '/icones/validation.png');
      } else {
        showAlert('Erreur lors de la suppression', 'Erreur', '/icones/error.png');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showAlert('Erreur de connexion au serveur', 'Erreur', '/icones/error.png');
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    showAlert(`${product.name} ajouté au panier !`, 'Succès', '/icones/shopping.png');
  };

  if (loading) {
    return (
      <div className="wishlist-container">
        <div className="container">
          <div className="wishlist-header">
            <h2>Chargement...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wishlist-container">
        <div className="container">
          <div className="wishlist-empty">
            <h2>{error}</h2>
            <Link href="/login" className="btn-primary">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-container">
        <div className="container">
          <div className="wishlist-empty">
            <Image src="/icones/favori-empty.png" alt="Favoris" width={80} height={80} />
            <h2>Votre liste de favoris est vide</h2>
            <p>Ajoutez des produits à votre wishlist pour les retrouver facilement !</p>
            <Link href="/categories" className="btn-primary">
              Découvrir nos produits
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <div className="container">
        <div className="wishlist-header">
          <h1>Mes Favoris</h1>
          <p>{wishlist.length} produit{wishlist.length > 1 ? 's' : ''}</p>
        </div>

        <div className="wishlist-grid">
          {wishlist.map((item) => (
            <div key={item.id} className="wishlist-card">
              <button 
                className="wishlist-remove-btn"
                onClick={() => handleRemove(item.id)}
                title="Retirer des favoris"
              >
                <Image src="/icones/remove.png" alt="Retirer" width={20} height={20} />
              </button>

              <Link href={`/produits/${item.Product.slug}`}>
                {item.Product.ProductImage && item.Product.ProductImage.length > 0 ? (
                  <Image 
                    src={item.Product.ProductImage[0].url} 
                    alt={item.Product.name}
                    width={280}
                    height={280}
                    className="wishlist-card-image"
                  />
                ) : (
                  <div className="wishlist-card-image wishlist-image-fallback">
                    <Image src="/icones/shopping.png" alt="Produit" width={80} height={80} />
                  </div>
                )}
              </Link>

              <div className="wishlist-card-content">
                <Link href={`/produits/${item.Product.slug}`}>
                  <h3 className="wishlist-card-title">
                    <Image 
                      src="/Logo_Francois_sansfond.PNG" 
                      alt="Logo" 
                      width={24} 
                      height={24} 
                      className="wishlist-title-logo"
                    />
                    {item.Product.name}
                  </h3>
                </Link>
                <p className="wishlist-card-category">{item.Product.Category.name}</p>
                <div className="wishlist-card-price">{item.Product.price.toFixed(2)}€</div>

                <div className="wishlist-card-actions">
                  <button 
                    className="wishlist-btn-cart"
                    onClick={() => handleAddToCart(item.Product)}
                  >
                    <Image src="/icones/shopping.png" alt="Panier" width={14} height={14} />
                    Panier
                  </button>
                  <Link 
                    href={`/produits/${item.Product.slug}`}
                    className="wishlist-btn-view"
                  >
                    <Image src="/icones/camera.png" alt="Voir" width={14} height={14} />
                    Détails
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal pour les messages */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
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