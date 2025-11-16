// Page Admin - Historique des factures
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useModal } from '../../../hooks/useModal';
import Modal from '../../../components/Modal';
import '../../../styles/Admin.css';

export default function AdminInvoicesPage() {
    const router = useRouter();
    const { modalState, openModal, closeModal, showAlert } = useModal();
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders, searchTerm, filterStatus]);    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/user/all`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (data.success) {
                // Ne garder que les commandes payées (qui ont une facture)
                const paidOrders = data.orders.filter(order =>
                    order.status === 'PAID' ||
                    order.status === 'PROCESSING' ||
                    order.status === 'SHIPPED' ||
                    order.status === 'DELIVERED'
                );
                setOrders(paidOrders);
                setFilteredOrders(paidOrders);
            }
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterOrders = () => {
        let filtered = [...orders];

        // Filtrer par recherche (numéro de commande, client)
        if (searchTerm) {
            filtered = filtered.filter(order =>
                order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (order.User && (
                    order.User.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    order.User.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    order.User.email.toLowerCase().includes(searchTerm.toLowerCase())
                ))
            );
        }

        // Filtrer par statut
        if (filterStatus !== 'ALL') {
            filtered = filtered.filter(order => order.status === filterStatus);
        }

        setFilteredOrders(filtered);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const handleDownloadInvoice = async (orderId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                showAlert(
                    'Vous devez être connecté pour télécharger une facture',
                    'Erreur',
                    '/icones/error.png'
                );
                return;
            }

            console.log('Token:', token);
            console.log('URL:', `${process.env.NEXT_PUBLIC_API_URL}/api/invoices/${orderId}`);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/invoices/${orderId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Erreur serveur:', errorData);
                showAlert(
                    errorData.message || 'Erreur lors du téléchargement',
                    'Erreur',
                    '/icones/error.png'
                );
                return;
            }

            // Récupérer le blob (fichier PDF)
            const blob = await response.blob();
            
            // Créer un lien de téléchargement temporaire
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `facture-${orderId}.pdf`;
            document.body.appendChild(a);
            a.click();
            
            // Nettoyer
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Erreur téléchargement:', error);
            showAlert(
                'Erreur lors du téléchargement de la facture',
                'Erreur',
                '/icones/error.png'
            );
        }
    };

    const getStatusLabel = (status) => {
        const labels = {
            PAID: 'Payé',
            PROCESSING: 'En préparation',
            SHIPPED: 'Expédié',
            DELIVERED: 'Livré'
        };
        return labels[status] || status;
    };

    const getStatusBadge = (status) => {
        const badges = {
            PAID: 'success',
            PROCESSING: 'info',
            SHIPPED: 'info',
            DELIVERED: 'success'
        };
        return badges[status] || 'info';
    };

    // Calculer les statistiques
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalInvoices = filteredOrders.length;

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
                <h1>Historique des factures</h1>
                <p>{totalInvoices} facture{totalInvoices > 1 ? 's' : ''} générée{totalInvoices > 1 ? 's' : ''}</p>
            </div>

            {/* Statistiques */}
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                <div className="stat-card">
                    <div className="stat-card-header">
                        <span className="stat-card-title">Factures générées</span>
                        <Image src="/icones/invoice.png" alt="Factures" width={40} height={40} className="stat-card-icon" />
                    </div>
                    <div className="stat-card-value">{totalInvoices}</div>
                    <div className="stat-card-change">Total des factures</div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-header">
                        <span className="stat-card-title">Montant total</span>
                        <Image src="/icones/payment.png" alt="Paiement" width={40} height={40} className="stat-card-icon" />
                    </div>
                    <div className="stat-card-value">{totalRevenue.toFixed(2)}€</div>
                    <div className="stat-card-change">Chiffre d&apos;affaires facturé</div>
                </div>
            </div>

            {/* Filtres */}
            <div className="admin-table-container" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                            Rechercher
                        </label>
                        <input
                            type="text"
                            placeholder="N° commande, client, email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 15px',
                                border: '2px solid var(--light-beige)',
                                borderRadius: '10px',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                            Filtrer par statut
                        </label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 15px',
                                border: '2px solid var(--light-beige)',
                                borderRadius: '10px',
                                fontSize: '1rem'
                            }}
                        >
                            <option value="ALL">Tous les statuts</option>
                            <option value="PAID">Payé</option>
                            <option value="PROCESSING">En préparation</option>
                            <option value="SHIPPED">Expédié</option>
                            <option value="DELIVERED">Livré</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Tableau des factures */}
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>N° Facture</th>
                            <th>Client</th>
                            <th>Date</th>
                            <th>Montant</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order) => (
                            <tr key={order.id}>
                                <td data-label="N° Facture">
                                    <strong>{order.orderNumber}</strong>
                                </td>
                                <td data-label="Client">
                                    {order.User ? (
                                        <div>
                                            <div><strong>{order.User.firstName} {order.User.lastName}</strong></div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                                                {order.User.email}
                                            </div>
                                        </div>
                                    ) : (
                                        <span style={{ color: 'var(--text-light)' }}>Invité</span>
                                    )}
                                </td>
                                <td data-label="Date">{formatDate(order.createdAt)}</td>
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
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => handleDownloadInvoice(order.id)}
                                            className="admin-btn admin-btn-primary"
                                            style={{
                                                padding: '6px 12px',
                                                fontSize: '0.85rem',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <Image src="/icones/invoice.png" alt="Télécharger" width={16} height={16} />
                                            Télécharger
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredOrders.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                        <p>
                            {searchTerm || filterStatus !== 'ALL'
                                ? 'Aucune facture ne correspond aux critères de recherche'
                                : 'Aucune facture pour le moment'}
                        </p>
                    </div>
                )}
            </div>

            {/* Modal de notification */}
            <Modal
                isOpen={modalState.isOpen}
                onClose={closeModal}
                title={modalState.title}
                message={modalState.message}
                icon={modalState.icon}
                confirmText={modalState.confirmText}
                cancelText={modalState.cancelText}
                showCancelButton={modalState.showCancelButton}
                onConfirm={modalState.onConfirm}
                onCancel={modalState.onCancel}
            />
        </>
    );
}