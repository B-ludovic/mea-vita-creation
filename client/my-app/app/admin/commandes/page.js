// Page Admin - Gestion des commandes
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Modal from '../../../components/Modal';
import ModalRefund from '../../../components/ModalRefund';
import { useModal } from '../../../hooks/useModal';
import { fetchWithAuth } from '../../../utils/auth';
import '../../../styles/Admin.css';

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundType, setRefundType] = useState('REFUNDED');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [carriers, setCarriers] = useState([]);
  const [trackingData, setTrackingData] = useState({
    trackingNumber: '',
    carrier: '',
    trackingUrl: '',
    status: 'SHIPPED'
  });
  const { modalState, showAlert, closeModal } = useModal();

  useEffect(() => {
    fetchOrders();
    fetchCarriers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCarriers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/carriers/list`);
      const data = await response.json();
      if (data.success) {
        setCarriers(data.carriers);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des transporteurs:', error);
      // Liste par défaut si l'API ne répond pas
      setCarriers(['Colissimo', 'Chronopost', 'DHL', 'UPS', 'FedEx', 'Mondial Relay', 'GLS', 'TNT']);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/user/all`);

      // Vérifier si l'utilisateur est autorisé
      if (response.status === 403) {
        showAlert('Accès refusé. Réservé aux administrateurs.', 'Accès refusé', '/icones/annuler.png');
        router.push('/');
        return;
      }

      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Erreur:', error);
      showAlert('Erreur lors du chargement des commandes', 'Erreur', '/icones/annuler.png');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    // Si c'est un remboursement, ouvrir le modal au lieu de changer direct
    if (newStatus === 'REFUNDED' || newStatus === 'PARTIALLY_REFUNDED') {
      const order = orders.find(o => o.id === orderId);
      setSelectedOrder(order);
      setRefundType(newStatus);
      setShowRefundModal(true);
      return; // On ne change pas le statut tout de suite
    }

    // Pour les autres statuts, on change normalement
    try {
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      // Vérifier si l'utilisateur est autorisé
      if (response.status === 403) {
        showAlert('Accès refusé. Réservé aux administrateurs.', 'Accès refusé', '/icones/annuler.png');
        router.push('/');
        return;
      }

      if (response.ok) {
        // Recharger les commandes
        fetchOrders();
        showAlert('Statut mis à jour avec succès !', 'Succès', '/icones/validation.png');
      } else {
        showAlert('Erreur lors de la mise à jour du statut', 'Erreur', '/icones/annuler.png');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showAlert('Erreur lors de la mise à jour du statut', 'Erreur', '/icones/annuler.png');
    }
  };

  const handleRefundConfirm = async (refundAmount) => {
    try {
      // Mettre à jour le statut ET le montant remboursé
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${selectedOrder.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          status: refundType,
          refundedAmount: refundAmount
        })
      });

      if (response.status === 403) {
        showAlert('Accès refusé. Réservé aux administrateurs.', 'Accès refusé', '/icones/annuler.png');
        router.push('/');
        return;
      }

      if (response.ok) {
        setShowRefundModal(false);
        fetchOrders();
        showAlert(
          `Remboursement de ${refundAmount.toFixed(2)}€ enregistré avec succès !`,
          'Succès',
          '/icones/validation.png'
        );
      } else {
        showAlert('Erreur lors de l\'enregistrement du remboursement', 'Erreur', '/icones/annuler.png');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showAlert('Erreur lors de l\'enregistrement du remboursement', 'Erreur', '/icones/annuler.png');
    }
  };

  const openTrackingModal = (order) => {
    setSelectedOrder(order);
    setTrackingData({
      trackingNumber: order.trackingNumber || '',
      carrier: order.carrier || '',
      trackingUrl: order.trackingUrl || '',
      status: order.status === 'DELIVERED' ? 'DELIVERED' : 'SHIPPED'
    });
    setShowTrackingModal(true);
  };

  const handleUpdateTracking = async () => {
    if (!trackingData.trackingNumber.trim()) {
      showAlert('Le numéro de suivi est obligatoire', 'Erreur', '/icones/error.png');
      return;
    }

    if (!trackingData.carrier.trim()) {
      showAlert('Le transporteur est obligatoire', 'Erreur', '/icones/error.png');
      return;
    }

    try {
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${selectedOrder.id}/tracking`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(trackingData)
      });

      if (response.status === 403) {
        showAlert('Accès refusé. Réservé aux administrateurs.', 'Accès refusé', '/icones/annuler.png');
        router.push('/');
        return;
      }

      const data = await response.json();

      if (data.success) {
        setShowTrackingModal(false);
        fetchOrders();
        showAlert('Informations de suivi mises à jour avec succès !', 'Succès', '/icones/validation.png');
      } else {
        showAlert(data.message || 'Erreur lors de la mise à jour', 'Erreur', '/icones/error.png');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showAlert('Erreur lors de la mise à jour du tracking', 'Erreur', '/icones/error.png');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: 'warning',
      PAID: 'success',
      PROCESSING: 'info',
      SHIPPED: 'info',
      DELIVERED: 'success',
      CANCELLED: 'danger',
      REFUNDED: 'danger',
      PARTIALLY_REFUNDED: 'warning' // Orange au lieu de rouge
    };
    return badges[status] || 'info';
  };

  const getStatusLabel = (status) => {
    const labels = {
      PENDING: 'En attente',
      PAID: 'Payé',
      PROCESSING: 'En préparation',
      SHIPPED: 'Expédié',
      DELIVERED: 'Livré',
      CANCELLED: 'Annulé',
      REFUNDED: 'Remboursé',
      PARTIALLY_REFUNDED: 'Part. remb.' // Encore plus court
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="admin-header">
        <h1>Chargement...</h1>
      </div>
    );
  }

  return (
    <>
      <div className="admin-header">
        <h1>Gestion des commandes</h1>
        <p>{orders.length} commande{orders.length > 1 ? 's' : ''} au total</p>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>N° Commande</th>
              <th>Client</th>
              <th>Date</th>
              <th>Produits</th>
              <th>Montant</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td data-label="N° Commande">
                  <strong>{order.orderNumber}</strong>
                </td>
                <td data-label="Client">
                  {order.User ? (
                    <div>
                      <div>{order.User.firstName} {order.User.lastName}</div>
                      <div className="order-client-email">
                        {order.User.email}
                      </div>
                    </div>
                  ) : (
                    <span className="order-client-guest">Invité</span>
                  )}
                </td>
                <td data-label="Date">{formatDate(order.createdAt)}</td>
                <td data-label="Produits">
                  {order.OrderItem.length} article{order.OrderItem.length > 1 ? 's' : ''}
                </td>
                <td data-label="Montant">
                  <strong className="order-amount">
                    {order.totalAmount.toFixed(2)}€
                  </strong>
                  {order.refundedAmount > 0 && (
                    <div className="order-refunded">
                      Remboursé: -{order.refundedAmount.toFixed(2)}€
                    </div>
                  )}
                </td>
                <td data-label="Statut">
                  <span className={`badge ${getStatusBadge(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </td>
                <td data-label="Actions">
                  <div className="order-actions">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="order-status-select"
                    >
                      <option value="PENDING">En attente</option>
                      <option value="PAID">Payé</option>
                      <option value="PROCESSING">En préparation</option>
                      <option value="SHIPPED">Expédié</option>
                      <option value="DELIVERED">Livré</option>
                      <option value="CANCELLED">Annulé</option>
                      <option value="REFUNDED">Remboursé</option>
                      <option value="PARTIALLY_REFUNDED">Partiellement remboursé</option>  
                    </select>

                    <button
                      className="admin-btn admin-btn-secondary admin-action-btn"
                      onClick={() => openTrackingModal(order)}
                    >
                      <Image src="/icones/delivery-box.png" alt="Tracking" width={16} height={16} />
                      Tracking
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="order-empty-state">
            <p>Aucune commande pour le moment</p>
          </div>
        )}
      </div>

      {/* Modal pour les notifications */}
      <Modal
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        icon={modalState.icon}
        onConfirm={modalState.onConfirm}
        onCancel={closeModal}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        showCancelButton={modalState.showCancelButton}
      />

      {/* Modal de tracking */}
      {showTrackingModal && (
        <div className="modal-overlay" onClick={() => setShowTrackingModal(false)}>
          <div className="modal-content tracking-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <Image src="/icones/delivery-box.png" alt="Tracking" width={40} height={40} />
              <h2>Informations de suivi</h2>
            </div>

            <div className="modal-body">
              <p className="tracking-order-info">
                Commande : <strong>{selectedOrder?.orderNumber}</strong>
              </p>

              <div className="tracking-form-fields">
                <div>
                  <label className="tracking-form-label">
                    Numéro de suivi *
                  </label>
                  <input
                    type="text"
                    value={trackingData.trackingNumber}
                    onChange={(e) => setTrackingData({ ...trackingData, trackingNumber: e.target.value })}
                    placeholder="Ex: 6A12345678901"
                    className="tracking-form-input"
                  />
                </div>

                <div>
                  <label className="tracking-form-label">
                    Transporteur *
                  </label>
                  <select
                    value={trackingData.carrier}
                    onChange={(e) => setTrackingData({ ...trackingData, carrier: e.target.value })}
                    className="tracking-form-input"
                  >
                    <option value="">Sélectionner un transporteur</option>
                    {carriers.map(carrier => (
                      <option key={carrier} value={carrier}>{carrier}</option>
                    ))}
                    <option value="Autre">Autre</option>
                  </select>
                  <p className="tracking-form-hint">
                    💡 L&apos;URL sera générée automatiquement si vous laissez le champ URL vide
                  </p>
                </div>

                <div>
                  <label className="tracking-form-label">
                    URL de suivi (optionnel)
                  </label>
                  <input
                    type="url"
                    value={trackingData.trackingUrl}
                    onChange={(e) => setTrackingData({ ...trackingData, trackingUrl: e.target.value })}
                    placeholder="Laissez vide pour génération automatique"
                    className="tracking-form-input"
                  />
                </div>

                <div>
                  <label className="tracking-form-label">
                    Statut de la commande
                  </label>
                  <select
                    value={trackingData.status}
                    onChange={(e) => setTrackingData({ ...trackingData, status: e.target.value })}
                    className="tracking-form-input"
                  >
                    <option value="SHIPPED">Expédié</option>
                    <option value="DELIVERED">Livré</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="modal-footer tracking-modal-footer">
              <button
                onClick={() => setShowTrackingModal(false)}
                className="admin-btn tracking-cancel-btn"
              >
                Annuler
              </button>
              <button
                onClick={handleUpdateTracking}
                className="admin-btn admin-btn-primary tracking-submit-btn"
              >
                <Image src="/icones/validation.png" alt="Valider" width={20} height={20} />
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de remboursement */}
      <ModalRefund
        isOpen={showRefundModal}
        onClose={() => setShowRefundModal(false)}
        onConfirm={handleRefundConfirm}
        orderNumber={selectedOrder?.orderNumber}
        totalAmount={selectedOrder?.totalAmount || 0}
        type={refundType}
      />
    </>
  );
}