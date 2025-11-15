// Page Mes Commandes
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useModal } from '../../hooks/useModal';
import Modal from '../../components/Modal';
import '../../styles/Orders.css';
import '../../styles/Tracking.css';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { modalState, showAlert, closeModal } = useModal();

  // Fonction pour télécharger la facture
  const downloadInvoice = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        showAlert('Vous devez être connecté pour télécharger une facture', 'Connexion requise', '/icones/error.png');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/invoices/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Créer un blob à partir de la réponse
        const blob = await response.blob();
        // Créer un lien de téléchargement
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `facture-${orderId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        showAlert('Votre facture a été téléchargée avec succès !', 'Téléchargement réussi', '/icones/validation.png');
      } else {
        showAlert('Impossible de télécharger la facture. Veuillez réessayer.', 'Erreur', '/icones/error.png');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showAlert('Erreur de connexion au serveur', 'Erreur', '/icones/error.png');
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Récupérer le token JWT
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Vous devez être connecté pour voir vos commandes');
          setLoading(false);
          return;
        }

        // Headers avec authentification
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        // Appeler l'API pour récupérer les commandes de l'utilisateur connecté
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/user/me`, { headers });
        
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setError('Session expirée, veuillez vous reconnecter');
          setLoading(false);
          return;
        }

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
            <p>Vous n&apos;avez pas encore passé de commande.</p>
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
                          src="/icones/shopping.png"
                          alt="Produit"
                          width={80}
                          height={80}
                          style={{ objectFit: 'contain' }}
                        />
                      )}
                    </div>
                    <div className="order-item-details">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Image 
                          src="/Logo_Francois_sansfond.PNG" 
                          alt="François Maroquinerie" 
                          width={24} 
                          height={24}
                          style={{ objectFit: 'contain' }}
                        />
                        <h4 style={{ margin: 0 }}>{item.Product.name}</h4>
                      </div>
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
                <button
                  onClick={() => downloadInvoice(order.id)}
                  className="btn-invoice"
                >
                  <Image src="/icones/invoice.png" alt="Facture" width={20} height={20} />
                  Télécharger la facture
                </button>
              </div>

              {/* Section tracking si disponible */}
              {(order.trackingNumber || order.status === 'SHIPPED' || order.status === 'DELIVERED') && (
                <div className="tracking-section">
                  <div className="tracking-header">
                    <Image src="/icones/delivery-box.png" alt="Suivi" width={32} height={32} />
                    <h3>Suivi de livraison</h3>
                  </div>

                  {order.trackingNumber && (
                    <div className="tracking-info">
                      <div className="tracking-item">
                        <div className="tracking-item-label">Numéro de suivi</div>
                        <div className="tracking-item-value">{order.trackingNumber}</div>
                      </div>
                      
                      {order.carrier && (
                        <div className="tracking-item">
                          <div className="tracking-item-label">Transporteur</div>
                          <div className="tracking-item-value">{order.carrier}</div>
                        </div>
                      )}

                      {order.shippedAt && (
                        <div className="tracking-item">
                          <div className="tracking-item-label">Expédié le</div>
                          <div className="tracking-item-value">
                            {new Date(order.shippedAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      )}

                      {order.deliveredAt && (
                        <div className="tracking-item">
                          <div className="tracking-item-label">Livré le</div>
                          <div className="tracking-item-value">
                            {new Date(order.deliveredAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {order.trackingUrl && (
                    <a 
                      href={order.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tracking-link"
                    >
                      <Image src="/icones/location.png" alt="Suivre" width={20} height={20} />
                      Suivre ma commande
                    </a>
                  )}

                  {/* Timeline des statuts */}
                  <div className="tracking-timeline" style={{ marginTop: '2rem' }}>
                    <div className={`timeline-item ${['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status) ? 'active' : ''}`}>
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <div className="timeline-title">
                          <Image src="/icones/validation.png" alt="Confirmé" width={16} height={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                          Commande confirmée
                        </div>
                        <div className="timeline-date">
                          {formatDate(order.createdAt)}
                        </div>
                      </div>
                    </div>

                    <div className={`timeline-item ${['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status) ? 'active' : ''}`}>
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <div className="timeline-title">
                          <Image src="/icones/confection.png" alt="Préparation" width={16} height={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                          En préparation
                        </div>
                        {order.status === 'PROCESSING' && (
                          <div className="timeline-date">En cours</div>
                        )}
                      </div>
                    </div>

                    <div className={`timeline-item ${['SHIPPED', 'DELIVERED'].includes(order.status) ? 'active' : ''}`}>
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <div className="timeline-title">
                          <Image src="/icones/delivery.png" alt="Expédié" width={16} height={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                          Expédié
                        </div>
                        {order.shippedAt && (
                          <div className="timeline-date">
                            {new Date(order.shippedAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={`timeline-item ${order.status === 'DELIVERED' ? 'active' : ''}`}>
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <div className="timeline-title">
                          <Image src="/icones/congratulation.png" alt="Livré" width={16} height={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                          Livré
                        </div>
                        {order.deliveredAt && (
                          <div className="timeline-date">
                            {new Date(order.deliveredAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
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