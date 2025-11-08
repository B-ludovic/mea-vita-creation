// Page de confirmation après paiement réussi
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../contexts/CartContext';
import '../../styles/Success.css';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();

  useEffect(() => {
    // Vider le panier après un paiement réussi
    if (sessionId) {
      clearCart();
    }
  }, [sessionId, clearCart]);

  return (
    <div className="success-container">
      <div className="container">
        <div className="success-card">
          <div className="success-icon">
            <Image 
              src="/payment.png" 
              alt="Paiement réussi" 
              width={120} 
              height={120}
            />
          </div>
          <h1 className="success-title">Paiement réussi !</h1>
          <p className="success-message">
            Merci pour votre commande ! Vous recevrez bientôt un email de confirmation.
          </p>

          <div className="success-actions">
            <button className="btn-primary" onClick={() => router.push('/')}>
              Retour à l&apos;accueil
            </button>
            <button className="btn-secondary" onClick={() => router.push('/categories')}>
              Continuer mes achats
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}