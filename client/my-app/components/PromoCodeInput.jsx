// Composant pour appliquer un code promo
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Modal from './Modal';
import { useModal } from '../hooks/useModal';
import '../styles/PromoCode.css';

export default function PromoCodeInput({ cartTotal, onPromoApplied }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const { isModalOpen, modalMessage, modalIcon, openModal, closeModal } = useModal();

  const handleApplyPromo = async () => {
    if (!code.trim()) {
      openModal('Veuillez entrer un code promo', 'error.png');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/promo-codes/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code.toUpperCase(),
          orderAmount: cartTotal
        })
      });

      const data = await response.json();

      if (data.success) {
        setAppliedPromo(data.promoCode);
        openModal(data.message, 'validation.png');
        setCode('');
        
        // Notifier le parent (page checkout)
        onPromoApplied(data.promoCode);
      } else {
        openModal(data.message, 'error.png');
      }
    } catch (error) {
      console.error('Erreur:', error);
      openModal('Erreur lors de la validation du code promo', 'error.png');
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setCode('');
    onPromoApplied(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleApplyPromo();
    }
  };

  return (
    <>
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        message={modalMessage} 
        icon={modalIcon}
      />
      
      <div className="promo-code-section">
        <h3>
          <Image 
            src="/icones/promotion.png" 
            alt="Code promo" 
            width={24} 
            height={24} 
            className="promo-icon"
          />
          Code promo
        </h3>

        {!appliedPromo ? (
          <>
            <div className="promo-code-input-group">
              <input
                type="text"
                className="promo-code-input"
                placeholder="Entrez votre code promo"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
              <button
                className="promo-code-btn"
                onClick={handleApplyPromo}
                disabled={loading || !code.trim()}
              >
                {loading ? 'Vérification...' : 'Appliquer'}
              </button>
            </div>
          </>
        ) : (
          <div className="promo-code-applied">
            <div className="promo-code-applied-top">
              <Image 
                src="/icones/validation.png" 
                alt="Validé" 
                width={24} 
                height={24} 
                className="promo-check-icon"
              />
              <div className="promo-code-applied-info">
                <div className="promo-code-label">Code promo appliqué :</div>
                <div className="promo-code-name">{appliedPromo.code}</div>
              </div>
            </div>
            <div className="promo-code-discount-amount">
              Réduction : <span>-{appliedPromo.discountAmount.toFixed(2)}€</span>
            </div>
            <button
              className="promo-code-btn-remove"
              onClick={handleRemovePromo}
            >
              Retirer
            </button>
          </div>
        )}
      </div>
    </>
  );
}