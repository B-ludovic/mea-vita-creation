// Page Mes Commandes
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import '../../styles/Orders.css';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Récupérer l'utilisateur connecté
        const userData = localStorage.getItem('user');

        if (!userData) {
          setError('Vous devez être connecté pour voir vos commandes');
          setLoading(false);
          return;
        }

        const user = JSON.parse(userData);

        // Appeler l'API pour récupérer les commandes
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/user/${user.id}`);
        const data = await response.json();

        if (data.success) {
          setOrders(data.orders);
        } else {
          setError('Impossible de charger les commandes');
        }
      } catch (err) {
        setError('Erreur de connexion au serveur');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fonction pour traduire le statut
  const getStatusLabel = (status) => {
    const labels = {
      PENDING: 'En attente',
      PAID: 'Payé',
      PROCESSING: 'En préparation',
      SHIPPED: 'Expédié',
      DELIVERED: 'Livré',
      CANCELLED: 'Annulé',
      REFUNDED: 'Remboursé'
    };
    return labels[status] || status;
  };

  // Si en cours de chargement
  if (loading) {
    return (
      <div className="orders-container">
        <div className="container">
          <div className="orders-header">
            <h2>Chargement...</h2>
          </div>
        </div>
      </div>
    );
  }

  // Si erreur (non connecté ou autre)
  if (error) {
    return (
      <div className="orders-container">
        <div className="container">
          <div className="orders-empty">
            <h2>{error}</h2>
            <Link href="/login" className="btn-primary">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Si aucune commande
  if (orders.length === 0) {
    return (
      <div className="orders-container">
        <div className="container">
          <div className="orders-empty">
            <h2>Aucune commande</h2>
            <p>Vous n'avez pas encore passé de commande.</p>
            <Link href="/categories" className="btn-primary">
              Découvrir nos produits
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Afficher les commandes
  return (
    <div className="orders-container">
      <div className="container">
        <div className="orders-header">
          <h1>Mes Commandes</h1>
          <p>{orders.length} commande{orders.length > 1 ? 's' : ''}</p>
        </div>

        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              {/* En-tête de la commande */}
              <div className="order-header">
                <div>
                  <div className="order-number">
                    Commande {order.orderNumber}
                  </div>
                  <div className="order-date">
                    {formatDate(order.createdAt)}
                  </div>
                </div>
                <div className={`order-status ${order.status.toLowerCase()}`}>
                  {getStatusLabel(order.status)}
                </div>
              </div>

              {/* Liste des produits */}
              <div className="order-items">
                {order.OrderItem.map((item) => (
                  <div key={item.id} className="order-item">
                    <div className="order-item-image">
                      {item.Product.ProductImage && item.Product.ProductImage.length > 0 ? (
                        <Image
                          src={item.Product.ProductImage[0].url}
                          alt={item.Product.name}
                          width={80}
                          height={80}
                          style={{ objectFit: 'cover', borderRadius: '10px' }}
                        />
                      ) : (
                        <Image
                          src="/shopping.png"
                          alt="Produit"
                          width={80}
                          height={80}
                          style={{ objectFit: 'contain' }}
                        />
                      )}
                    </div>
                    <div className="order-item-details">
                      <h4>{item.Product.name}</h4>
                      <p>Quantité : {item.quantity} × {item.unitPrice.toFixed(2)}€</p>
                    </div>
                    <div className="order-item-price">
                      {item.totalPrice.toFixed(2)}€
                    </div>
                  </div>
                ))}
              </div>

              {/* Total de la commande */}
              <div className="order-footer">
                <div className="order-total">
                  Total : <span>{order.totalAmount.toFixed(2)}€</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}