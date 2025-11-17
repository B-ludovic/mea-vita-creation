// Modal pour gérer les remboursements avec Stripe
'use client';

import { useState } from 'react';
import '../styles/ModalRefund.css';

export default function ModalRefund({ 
  isOpen, 
  onClose, 
  onConfirm, 
  orderNumber,
  totalAmount,
  type // 'REFUNDED' ou 'PARTIALLY_REFUNDED'
}) {
  const [refundAmount, setRefundAmount] = useState(type === 'REFUNDED' ? totalAmount : '');
  const [stripeCompleted, setStripeCompleted] = useState(false);

  if (!isOpen) return null;

  const handleOpenStripe = () => {
    // Ouvrir Stripe Dashboard dans un nouvel onglet
    window.open('https://dashboard.stripe.com/payments', '_blank');
    setStripeCompleted(true);
  };

  const handleConfirm = () => {
    // Valider le montant
    const amount = parseFloat(refundAmount);

    if (isNaN(amount) || amount <= 0) {
      alert('Veuillez entrer un montant valide');
      return;
    }

    if (amount > totalAmount) {
      alert(`Le montant remboursé ne peut pas dépasser ${totalAmount}€`);
      return;
    }

    // Confirmer le remboursement
    onConfirm(amount);
    // Ne pas resetModal ici ! Ça sera fait à la fermeture
    onClose();
  };

  const handleCancel = () => {
    resetModal();
    onClose();
  };

  const resetModal = () => {
    setRefundAmount(type === 'REFUNDED' ? totalAmount : '');
    setStripeCompleted(false);
  };

  return (
    <div className="modal-refund-overlay" onClick={handleCancel}>
      <div className="modal-refund-container" onClick={(e) => e.stopPropagation()}>
        
        {/* ÉTAPE 1 : Avant d'aller sur Stripe */}
        {!stripeCompleted && (
          <>
            <div className="modal-refund-header">
              <img src="/icones/activer.png" alt="Attention" width="24" height="24" className="modal-refund-icon" />
              <h2>Remboursement {type === 'REFUNDED' ? 'complet' : 'partiel'}</h2>
            </div>

            <div className="modal-refund-body">
              <div className="refund-alert refund-alert-warning">
                <p>
                  <img src="/icones/category.png" alt="Instructions" width="20" height="20" className="refund-alert-icon" />
                  <strong>Instructions importantes :</strong>
                </p>
                <ol className="refund-instructions">
                  <li>Cliquez sur "Ouvrir Stripe Dashboard" ci-dessous</li>
                  <li>Trouvez le paiement de la commande <strong>{orderNumber}</strong></li>
                  <li>Effectuez le remboursement {type === 'REFUNDED' ? 'complet' : 'partiel'} sur Stripe</li>
                  <li>Notez le montant remboursé</li>
                  <li>Revenez sur cette page et confirmez</li>
                </ol>
              </div>

              <div className="refund-order-info">
                <p><strong>Commande :</strong> {orderNumber}</p>
                <p><strong>Montant total :</strong> {totalAmount.toFixed(2)}€</p>
              </div>

              <button
                onClick={handleOpenStripe}
                className="refund-btn refund-btn-primary refund-btn-full"
              >
                <img src="/icones/heritage.png" alt="Lien" width="16" height="16" className="refund-btn-icon" />
                Ouvrir Stripe Dashboard
              </button>
            </div>

            <div className="modal-refund-footer">
              <button onClick={handleCancel} className="refund-btn refund-btn-secondary">
                Annuler
              </button>
            </div>
          </>
        )}

        {/* ÉTAPE 2 : Après être allé sur Stripe */}
        {stripeCompleted && (
          <>
            <div className="modal-refund-header">
              <img src="/icones/ok.png" alt="Confirmation" width="24" height="24" className="modal-refund-icon" />
              <h2>Confirmer le remboursement</h2>
            </div>

            <div className="modal-refund-body">
              <div className="refund-alert refund-alert-info">
                <p>
                  <img src="/icones/evolution.png" alt="Info" width="18" height="18" className="refund-alert-icon" />
                  Assurez-vous d'avoir bien effectué le remboursement sur Stripe avant de confirmer.
                </p>
              </div>

              <div className="refund-form-group">
                <label htmlFor="refundAmount" className="refund-form-label">
                  Montant remboursé {type === 'REFUNDED' ? '(complet)' : '(partiel)'} :
                </label>
                <input
                  type="number"
                  id="refundAmount"
                  step="0.01"
                  min="0.01"
                  max={totalAmount}
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  disabled={type === 'REFUNDED'}
                  className="refund-input"
                  placeholder="0.00"
                />
                {type === 'PARTIALLY_REFUNDED' && (
                  <p className="refund-input-hint">
                    Maximum : {totalAmount.toFixed(2)}€
                  </p>
                )}
              </div>

              <div className="refund-alert refund-alert-danger">
                <p>
                  <img src="/icones/activer.png" alt="Important" width="18" height="18" className="refund-alert-icon" />
                  <strong>Important :</strong> Vérifiez que le montant saisi correspond exactement au montant remboursé sur Stripe.
                </p>
              </div>
            </div>

            <div className="modal-refund-footer">
              <button onClick={handleCancel} className="refund-btn refund-btn-secondary">
                Annuler
              </button>
              <button 
                onClick={handleConfirm} 
                className="refund-btn refund-btn-primary"
              >
                <img src="/icones/ok.png" alt="Confirmer" width="16" height="16" className="refund-btn-icon" />
                Confirmer le remboursement
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}