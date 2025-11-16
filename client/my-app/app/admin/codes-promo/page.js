// Page Admin - Gestion des codes promo
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useModal } from '../../../hooks/useModal';
import Modal from '../../../components/Modal';

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
      const token = localStorage.getItem('token');
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
      const token = localStorage.getItem('token');
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
      const token = localStorage.getItem('token');
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
          const token = localStorage.getItem('token');
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
              <Image src="/icones/annuler.png" alt="" width={20} height={20} style={{ marginRight: '0.5rem' }} />
              Annuler
            </>
          ) : (
            <>
              <Image src="/icones/promotion.png" alt="" width={20} height={20} style={{ marginRight: '0.5rem' }} />
              Nouveau code promo
            </>
          )}
        </button>
      </div>

      {/* Formulaire de création */}
      {showForm && (
        <div className="admin-table-container" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Créer un code promo</h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              
              {/* Code */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Code promo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="ex: NOEL2024"
                  style={{
                    width: '100%',
                    padding: '10px 15px',
                    border: '2px solid var(--light-beige)',
                    borderRadius: '10px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              {/* Type de réduction */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Type de réduction *
                </label>
                <select
                  required
                  value={formData.discountType}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 15px',
                    border: '2px solid var(--light-beige)',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    height: '44px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="PERCENTAGE">Pourcentage (%)</option>
                  <option value="FIXED_AMOUNT">Montant fixe (€)</option>
                </select>
              </div>

              {/* Valeur */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
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
                  style={{
                    width: '100%',
                    padding: '10px 15px',
                    border: '2px solid var(--light-beige)',
                    borderRadius: '10px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              {/* Montant minimum */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Montant minimum (€)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.minOrderAmount}
                  onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                  placeholder="Optionnel"
                  style={{
                    width: '100%',
                    padding: '10px 15px',
                    border: '2px solid var(--light-beige)',
                    borderRadius: '10px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              {/* Nombre max d'utilisations */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Utilisations max
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.maxUses}
                  onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                  placeholder="Optionnel"
                  style={{
                    width: '100%',
                    padding: '10px 15px',
                    border: '2px solid var(--light-beige)',
                    borderRadius: '10px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              {/* Date de début */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Date de début *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 15px',
                    border: '2px solid var(--light-beige)',
                    borderRadius: '10px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              {/* Date de fin */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Date de fin *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 15px',
                    border: '2px solid var(--light-beige)',
                    borderRadius: '10px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              {/* Description */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description du code promo (optionnel)"
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '10px 15px',
                    border: '2px solid var(--light-beige)',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>

            <button 
              type="submit"
              className="admin-btn admin-btn-primary"
              style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
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
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                        {promo.description}
                      </div>
                    )}
                  </td>
                  <td data-label="Type">
                    {promo.discountType === 'PERCENTAGE' ? 'Pourcentage' : 'Montant fixe'}
                  </td>
                  <td data-label="Réduction">
                    <strong style={{ color: 'var(--primary-orange)' }}>
                      {promo.discountType === 'PERCENTAGE' 
                        ? `${promo.discountValue}%`
                        : `${promo.discountValue}€`
                      }
                    </strong>
                    {promo.minOrderAmount && (
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                        Min: {promo.minOrderAmount}€
                      </div>
                    )}
                  </td>
                  <td data-label="Période">
                    <div style={{ fontSize: '0.9rem' }}>
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
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className={`admin-btn ${promo.isActive ? 'admin-btn-secondary' : 'admin-btn-primary'}`}
                        style={{ padding: '6px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
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
                        className="admin-btn admin-btn-danger"
                        style={{ padding: '6px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
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
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
            <p>Aucun code promo pour le moment</p>
          </div>
        )}
      </div>
    </>
  );
}