// Page Admin - Gestion des codes promo
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useModal } from '../../../hooks/useModal';
import Modal from '../../../components/Modal';
import { getAccessToken } from '../../../utils/auth';

export default function AdminPromoCodesPage() {
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { modalState, showAlert, showConfirm, closeModal } = useModal();
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    minOrderAmount: '',
    maxUses: '',
    startDate: '',
    endDate: ''
  });

  const fetchPromoCodes = async () => {
    try {
      const token = getAccessToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/promo-codes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (data.success) {
        setPromoCodes(data.promoCodes);
      } else {
        showAlert(data.message || 'Erreur lors du chargement', 'Erreur', '/icones/error.png');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showAlert('Erreur de connexion au serveur', 'Erreur', '/icones/error.png');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromoCodes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = getAccessToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/promo-codes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        showAlert('Code promo créé avec succès !', 'Succès', '/icones/validation.png');
        setShowForm(false);
        setFormData({
          code: '',
          description: '',
          discountType: 'PERCENTAGE',
          discountValue: '',
          minOrderAmount: '',
          maxUses: '',
          startDate: '',
          endDate: ''
        });
        fetchPromoCodes();
      } else {
        showAlert(data.message, 'Erreur', '/icones/error.png');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showAlert('Erreur lors de la création du code promo', 'Erreur', '/icones/error.png');
    }
  };

  const handleToggleActive = async (promoCodeId, currentStatus) => {
    try {
      const token = getAccessToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/promo-codes/${promoCodeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      const data = await response.json();
      
      if (data.success) {
        showAlert(
          currentStatus ? 'Code promo désactivé' : 'Code promo activé', 
          'Succès', 
          '/icones/validation.png'
        );
        fetchPromoCodes();
      } else {
        showAlert(data.message, 'Erreur', '/icones/error.png');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showAlert('Erreur lors de la modification', 'Erreur', '/icones/error.png');
    }
  };

  const handleDelete = async (promoCodeId) => {
    showConfirm(
      'Êtes-vous sûr de vouloir supprimer ce code promo ?',
      async () => {
        try {
          const token = getAccessToken();
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/promo-codes/${promoCodeId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          const data = await response.json();
          
          if (data.success) {
            showAlert('Code promo supprimé', 'Succès', '/icones/validation.png');
            fetchPromoCodes();
          } else {
            showAlert(data.message, 'Erreur', '/icones/error.png');
          }
        } catch (error) {
          console.error('Erreur:', error);
          showAlert('Erreur lors de la suppression', 'Erreur', '/icones/error.png');
        }
      },
      'Supprimer le code promo',
      '/icones/trash.png'
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const isExpired = (endDate) => {
    return new Date(endDate) < new Date();
  };

  const getStatusBadge = (promoCode) => {
    if (!promoCode.isActive) return { text: 'Inactif', class: 'inactive' };
    if (isExpired(promoCode.endDate)) return { text: 'Expiré', class: 'expired' };
    if (promoCode.maxUses && promoCode.currentUses >= promoCode.maxUses) {
      return { text: 'Épuisé', class: 'expired' };
    }
    return { text: 'Actif', class: 'success' };
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
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        message={modalState.message}
        title={modalState.title}
        icon={modalState.icon}
        onConfirm={modalState.onConfirm}
        confirmText={modalState.confirmText}
      />
      
      <div className="admin-header">
        <h1>Codes promo</h1>
        <button 
          className="admin-btn admin-btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? (
            <>
              <Image src="/icones/annuler.png" alt="" width={20} height={20} className="promo-header-icon" />
              Annuler
            </>
          ) : (
            <>
              <Image src="/icones/promotion.png" alt="" width={20} height={20} className="promo-header-icon" />
              Nouveau code promo
            </>
          )}
        </button>
      </div>

      {/* Formulaire de création */}
      {showForm && (
        <div className="admin-table-container promo-form-container">
          <h2 className="promo-form-title">Créer un code promo</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="promo-form-grid">
              
              {/* Code */}
              <div>
                <label className="promo-form-label">
                  Code promo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="ex: NOEL2024"
                  className="promo-form-input"
                />
              </div>

              {/* Type de réduction */}
              <div>
                <label className="promo-form-label">
                  Type de réduction *
                </label>
                <select
                  required
                  value={formData.discountType}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                  className="promo-form-select"
                >
                  <option value="PERCENTAGE">Pourcentage (%)</option>
                  <option value="FIXED_AMOUNT">Montant fixe (€)</option>
                </select>
              </div>

              {/* Valeur */}
              <div>
                <label className="promo-form-label">
                  Valeur *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                  placeholder={formData.discountType === 'PERCENTAGE' ? 'ex: 20' : 'ex: 10.00'}
                  className="promo-form-input"
                />
              </div>

              {/* Montant minimum */}
              <div>
                <label className="promo-form-label">
                  Montant minimum (€)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.minOrderAmount}
                  onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                  placeholder="Optionnel"
                  className="promo-form-input"
                />
              </div>

              {/* Nombre max d'utilisations */}
              <div>
                <label className="promo-form-label">
                  Utilisations max
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.maxUses}
                  onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                  placeholder="Optionnel"
                  className="promo-form-input"
                />
              </div>

              {/* Date de début */}
              <div>
                <label className="promo-form-label">
                  Date de début *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="promo-form-input"
                />
              </div>

              {/* Date de fin */}
              <div>
                <label className="promo-form-label">
                  Date de fin *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="promo-form-input"
                />
              </div>

              {/* Description */}
              <div className="promo-form-description">
                <label className="promo-form-label">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description du code promo (optionnel)"
                  rows="3"
                  className="promo-form-textarea"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="admin-btn admin-btn-primary promo-submit-btn"
            >
              <Image src="/icones/validation.png" alt="" width={20} height={20} />
              Créer le code promo
            </button>
          </form>
        </div>
      )}

      {/* Tableau des codes promo */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Type</th>
              <th>Réduction</th>
              <th>Période</th>
              <th>Utilisation</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {promoCodes.map((promo) => {
              const status = getStatusBadge(promo);
              return (
                <tr key={promo.id}>
                  <td data-label="Code">
                    <strong>{promo.code}</strong>
                    {promo.description && (
                      <div className="promo-code-description">
                        {promo.description}
                      </div>
                    )}
                  </td>
                  <td data-label="Type">
                    {promo.discountType === 'PERCENTAGE' ? 'Pourcentage' : 'Montant fixe'}
                  </td>
                  <td data-label="Réduction">
                    <strong className="promo-discount-value">
                      {promo.discountType === 'PERCENTAGE' 
                        ? `${promo.discountValue}%`
                        : `${promo.discountValue}€`
                      }
                    </strong>
                    {promo.minOrderAmount && (
                      <div className="promo-min-amount">
                        Min: {promo.minOrderAmount}€
                      </div>
                    )}
                  </td>
                  <td data-label="Période">
                    <div className="promo-period">
                      Du {formatDate(promo.startDate)}<br/>
                      au {formatDate(promo.endDate)}
                    </div>
                  </td>
                  <td data-label="Utilisation">
                    {promo.currentUses}
                    {promo.maxUses && ` / ${promo.maxUses}`}
                  </td>
                  <td data-label="Statut">
                    <span className={`badge ${status.class}`}>
                      {status.text}
                    </span>
                  </td>
                  <td data-label="Actions">
                    <div className="promo-actions">
                      <button
                        className={`admin-btn ${promo.isActive ? 'admin-btn-secondary' : 'admin-btn-primary'} admin-action-btn`}
                        onClick={() => handleToggleActive(promo.id, promo.isActive)}
                      >
                        <Image 
                          src={promo.isActive ? '/icones/desactiver.png' : '/icones/ok.png'} 
                          alt="" 
                          width={16} 
                          height={16} 
                        />
                        {promo.isActive ? 'Désactiver' : 'Activer'}
                      </button>
                      <button
                        className="admin-btn admin-btn-danger admin-action-btn"
                        onClick={() => handleDelete(promo.id)}
                      >
                        <Image src="/icones/trash.png" alt="" width={16} height={16} />
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {promoCodes.length === 0 && (
          <div className="promo-empty-state">
            <p>Aucun code promo pour le moment</p>
          </div>
        )}
      </div>
    </>
  );
}