// Page Admin - Gestion des commandes
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrders = async () => {
    try {
      // Récupérer le token depuis localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Vous devez être connecté');
        router.push('/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/user/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Vérifier si l'utilisateur est autorisé
      if (response.status === 403) {
        alert('Accès refusé. Réservé aux administrateurs.');
        router.push('/');
        return;
      }

      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Récupérer le token depuis localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Vous devez être connecté');
        router.push('/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      // Vérifier si l'utilisateur est autorisé
      if (response.status === 403) {
        alert('Accès refusé. Réservé aux administrateurs.');
        router.push('/');
        return;
      }

      if (response.ok) {
        // Recharger les commandes
        fetchOrders();
        alert('Statut mis à jour !');
      } else {
        alert('Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour');
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
      REFUNDED: 'danger'
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
      REFUNDED: 'Remboursé'
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
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                        {order.User.email}
                      </div>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-light)' }}>Invité</span>
                  )}
                </td>
                <td data-label="Date">{formatDate(order.createdAt)}</td>
                <td data-label="Produits">
                  {order.OrderItem.length} article{order.OrderItem.length > 1 ? 's' : ''}
                </td>
                <td data-label="Montant">
                  <strong style={{ color: 'var(--primary-orange)' }}>
                    {order.totalAmount.toFixed(2)}€
                  </strong>
                </td>
                <td data-label="Statut">
                  <span className={`badge ${getStatusBadge(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </td>
                <td data-label="Actions">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      border: '2px solid var(--light-beige)',
                      fontSize: '0.9rem'
                    }}
                  >
                    <option value="PENDING">En attente</option>
                    <option value="PAID">Payé</option>
                    <option value="PROCESSING">En préparation</option>
                    <option value="SHIPPED">Expédié</option>
                    <option value="DELIVERED">Livré</option>
                    <option value="CANCELLED">Annulé</option>
                    <option value="REFUNDED">Remboursé</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
            <p>Aucune commande pour le moment</p>
          </div>
        )}
      </div>
    </>
  );
}