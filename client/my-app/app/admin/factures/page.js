// Page Admin - Historique des factures
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useModal } from '../../../hooks/useModal';
import Modal from '../../../components/Modal';
import { getAccessToken } from '../../../utils/auth';
import '../../../styles/Admin.css';

export default function AdminInvoicesPage() {
    const router = useRouter();
    const { modalState, openModal, closeModal, showAlert } = useModal();
    const [invoices, setInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ALL'); // Changé de filterStatus à filterType

  useEffect(() => {
    fetchInvoices(); // Changé de fetchOrders à fetchInvoices
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterInvoices(); // Changé de filterOrders à filterInvoices
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoices, searchTerm, filterType]); // Changé orders et filterStatus
  
    const fetchInvoices = async () => {
        try {
            const token = getAccessToken();
            if (!token) {
                router.push('/login');
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/invoices`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (data.success) {
                setInvoices(data.invoices);
                setFilteredInvoices(data.invoices);
            }
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterInvoices = () => {
        let filtered = [...invoices];

        // Filtrer par recherche (numéro de facture, client)
        if (searchTerm) {
            filtered = filtered.filter(invoice =>
                invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (invoice.Order?.User && (
                    invoice.Order.User.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    invoice.Order.User.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    invoice.Order.User.email?.toLowerCase().includes(searchTerm.toLowerCase())
                ))
            );
        }

        // Filtrer par type de facture
        if (filterType !== 'ALL') {
            filtered = filtered.filter(invoice => invoice.type === filterType);
        }

        setFilteredInvoices(filtered);
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
            const token = getAccessToken();
            if (!token) {
                showAlert(
                    'Vous devez être connecté pour télécharger une facture',
                    'Erreur',
                    '/icones/error.png'
                );
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/invoices/${orderId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
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

    // Fonction pour obtenir le label et la couleur du badge selon le type de facture
    const getInvoiceTypeBadge = (type) => {
        const badges = {
            'INVOICE': { label: 'Facture', color: '#2196F3' }, // Bleu
            'REFUND_FULL': { label: 'Remboursement total', color: '#F44336' }, // Rouge
            'REFUND_PARTIAL': { label: 'Remboursement partiel', color: '#FF9800' } // Orange
        };
        return badges[type] || { label: type, color: '#999' };
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
    const totalRevenue = filteredInvoices
        .filter(inv => inv.type === 'INVOICE')
        .reduce((sum, inv) => sum + inv.amount, 0);
    const totalRefunds = filteredInvoices
        .filter(inv => inv.type === 'REFUND_FULL' || inv.type === 'REFUND_PARTIAL')
        .reduce((sum, inv) => sum + inv.amount, 0);
    const totalInvoices = filteredInvoices.length;

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
            <div className="stats-grid invoices-stats">
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
                        <span className="stat-card-title">Montant facturé</span>
                        <Image src="/icones/payment.png" alt="Paiement" width={40} height={40} className="stat-card-icon" />
                    </div>
                    <div className="stat-card-value">{totalRevenue.toFixed(2)}€</div>
                    <div className="stat-card-change">Chiffre d&apos;affaires</div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-header">
                        <span className="stat-card-title">Remboursements</span>
                        <Image src="/icones/error.png" alt="Remboursements" width={40} height={40} className="stat-card-icon" />
                    </div>
                    <div className="stat-card-value" style={{color: '#F44336'}}>-{totalRefunds.toFixed(2)}€</div>
                    <div className="stat-card-change">Total remboursé</div>
                </div>
            </div>

            {/* Filtres */}
            <div className="admin-table-container invoices-filters-container">
                <div className="invoices-filters-grid">
                    <div>
                        <label className="invoices-filter-label">
                            Rechercher
                        </label>
                        <input
                            type="text"
                            placeholder="N° commande, client, email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="invoices-filter-input"
                        />
                    </div>

                    <div>
                        <label className="invoices-filter-label">
                            Filtrer par type
                        </label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="invoices-filter-input"
                        >
                            <option value="ALL">Tous les types</option>
                            <option value="INVOICE">Factures de vente</option>
                            <option value="REFUND_FULL">Remboursements totaux</option>
                            <option value="REFUND_PARTIAL">Remboursements partiels</option>
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
                            <th>Type</th>
                            <th>Montant</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInvoices.map((invoice) => {
                            const typeBadge = getInvoiceTypeBadge(invoice.type);
                            return (
                            <tr key={invoice.id}>
                                <td data-label="N° Facture">
                                    <strong>{invoice.invoiceNumber}</strong>
                                </td>
                                <td data-label="Client">
                                    {invoice.Order?.User ? (
                                        <div>
                                            <div><strong>{invoice.Order.User.firstName} {invoice.Order.User.lastName}</strong></div>
                                            <div className="invoice-client-email">
                                                {invoice.Order.User.email}
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="invoice-client-guest">Invité</span>
                                    )}
                                </td>
                                <td data-label="Date">{formatDate(invoice.createdAt)}</td>
                                <td data-label="Type">
                                    <span className="badge" style={{ backgroundColor: typeBadge.color, color: '#fff' }}>
                                        {typeBadge.label}
                                    </span>
                                </td>
                                <td data-label="Montant">
                                    <strong className="invoice-amount" style={{ color: invoice.type === 'INVOICE' ? '#000' : '#F44336' }}>
                                        {invoice.type === 'INVOICE' ? '' : '-'}{invoice.amount.toFixed(2)}€
                                    </strong>
                                </td>
                                <td data-label="Actions">
                                    <div className="invoice-actions">
                                        <button
                                            onClick={() => handleDownloadInvoice(invoice.orderId)}
                                            className="admin-btn admin-btn-primary admin-action-btn"
                                        >
                                            <Image src="/icones/invoice.png" alt="Télécharger" width={16} height={16} />
                                            Télécharger
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )})}
                    </tbody>
                </table>

                {filteredInvoices.length === 0 && (
                    <div className="invoice-empty-state">
                        <p>
                            {searchTerm || filterType !== 'ALL'
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