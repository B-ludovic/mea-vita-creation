// Page Admin - Gestion des avis
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import StarRating from '../../../components/StarRating';
import Modal from '../../../components/Modal';
import { useModal } from '../../../hooks/useModal';
import { getAccessToken } from '../../../utils/auth';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { modalState, showAlert, showConfirm, closeModal } = useModal();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      // Récupérer le token depuis localStorage
      const token = getAccessToken();
      
      if (!token) {
        console.error('Pas de token d\'authentification');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des avis');
      }

      const data = await response.json();

      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId) => {
    try {
      const token = getAccessToken();
      
      if (!token) {
        showAlert('Vous devez être connecté', 'Authentification requise', '/icones/annuler.png');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${reviewId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        showAlert('L\'avis a été approuvé avec succès !', 'Avis approuvé', '/icones/validation.png');
        fetchReviews();
      } else {
        showAlert('Une erreur est survenue lors de l\'approbation', 'Erreur', '/icones/annuler.png');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showAlert('Erreur de connexion au serveur', 'Erreur', '/icones/annuler.png');
    }
  };

  const handleDelete = async (reviewId) => {
    // Utiliser showConfirm pour la confirmation
    showConfirm(
      'Êtes-vous sûr de vouloir supprimer cet avis ? Cette action est irréversible.',
      async () => {
        try {
          const token = getAccessToken();
          
          if (!token) {
            showAlert('Vous devez être connecté', 'Authentification requise', '/icones/annuler.png');
            return;
          }

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${reviewId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            showAlert('L\'avis a été supprimé avec succès', 'Avis supprimé', '/icones/validation.png');
            fetchReviews();
          } else {
            showAlert('Une erreur est survenue lors de la suppression', 'Erreur', '/icones/annuler.png');
          }
        } catch (error) {
          console.error('Erreur:', error);
          showAlert('Erreur de connexion au serveur', 'Erreur', '/icones/annuler.png');
        }
      },
      'Confirmer la suppression',
      '/icones/trash.png'
    );
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

  if (loading) {
    return (
      <div className="admin-header">
        <h1>Chargement...</h1>
      </div>
    );
  }

  // Séparer les avis en attente et approuvés
  const pendingReviews = reviews.filter(r => !r.isApproved);
  const approvedReviews = reviews.filter(r => r.isApproved);

  return (
    <>
      <div className="admin-header">
        <h1>Gestion des avis</h1>
        <p>{reviews.length} avis au total</p>
      </div>

      {/* Avis en attente */}
      {pendingReviews.length > 0 && (
        <div className="admin-table-container reviews-section-pending">
          <h2 className="reviews-section-title">
            <Image src="/icones/sand-timer.png" alt="En attente" width={24} height={24} />
            Avis en attente de modération ({pendingReviews.length})
          </h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Produit</th>
                <th>Note</th>
                <th>Commentaire</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingReviews.map((review) => (
                <tr key={review.id} className="review-row-pending">
                  <td data-label="Client">
                    <div>
                      <div><strong>{review.User.firstName} {review.User.lastName}</strong></div>
                      <div className="review-client-email">
                        {review.User.email}
                      </div>
                    </div>
                  </td>
                  <td data-label="Produit">{review.Product.name}</td>
                  <td data-label="Note">
                    <StarRating rating={review.rating} readonly size="small" />
                  </td>
                  <td data-label="Commentaire" className="review-comment-cell">
                    {review.comment || <em className="review-no-comment">Pas de commentaire</em>}
                  </td>
                  <td data-label="Date">{formatDate(review.createdAt)}</td>
                  <td data-label="Actions">
                    <div className="review-actions">
                      <button
                        className="admin-btn admin-btn-primary admin-action-btn"
                        onClick={() => handleApprove(review.id)}
                      >
                        <Image src="/icones/ok.png" alt="Approuver" width={16} height={16} />
                        Approuver
                      </button>
                      <button
                        className="admin-btn admin-btn-danger admin-action-btn"
                        onClick={() => handleDelete(review.id)}
                      >
                        <Image src="/icones/trash.png" alt="Supprimer" width={16} height={16} />
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Avis approuvés */}
      <div className="admin-table-container">
        <h2 className="reviews-section-title">
          <Image src="/icones/validation.png" alt="Approuvés" width={24} height={24} />
          Avis approuvés ({approvedReviews.length})
        </h2>
        {approvedReviews.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Produit</th>
                <th>Note</th>
                <th>Commentaire</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {approvedReviews.map((review) => (
                <tr key={review.id}>
                  <td data-label="Client">
                    <div>
                      <div><strong>{review.User.firstName} {review.User.lastName}</strong></div>
                      <div className="review-client-email">
                        {review.User.email}
                      </div>
                    </div>
                  </td>
                  <td data-label="Produit">{review.Product.name}</td>
                  <td data-label="Note">
                    <StarRating rating={review.rating} readonly size="small" />
                  </td>
                  <td data-label="Commentaire" className="review-comment-cell">
                    {review.comment || <em className="review-no-comment">Pas de commentaire</em>}
                  </td>
                  <td data-label="Date">{formatDate(review.createdAt)}</td>
                  <td data-label="Actions">
                    <button
                      className="admin-btn admin-btn-danger admin-action-btn"
                      onClick={() => handleDelete(review.id)}
                    >
                      <Image src="/icones/trash.png" alt="Supprimer" width={16} height={16} />
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="review-empty-state">
            <p>Aucun avis approuvé</p>
          </div>
        )}
      </div>

      {reviews.length === 0 && (
        <div className="review-empty-state">
          <p>Aucun avis pour le moment</p>
        </div>
      )}

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
    </>
  );
}