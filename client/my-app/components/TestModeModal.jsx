'use client';

import { useState } from 'react';
import Image from 'next/image';
import '../styles/TestModeModal.css';

export default function TestModeModal() {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="test-modal-overlay" onClick={handleClose}>
      <div className="test-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="test-modal-header">
          <Image 
            src="/icones/error.png" 
            alt="Attention" 
            width={48} 
            height={48}
            className="test-modal-icon"
          />
          <h2>Site en mode test</h2>
        </div>
        
        <div className="test-modal-body">
          <p className="test-modal-warning">
            Ce site est actuellement en phase de test.
          </p>
          
          <div className="test-modal-info">
            <div className="test-info-header">
              <Image 
                src="/icones/payment.png" 
                alt="Sécurité" 
                width={24} 
                height={24}
              />
              <h3>Paiements fictifs uniquement</h3>
            </div>
            <p>Les vraies cartes bancaires ne fonctionneront pas.</p>
            <p>Pour effectuer un test de paiement, contactez le développeur.</p>
          </div>

          <div className="test-modal-note">
            <Image 
              src="/icones/help.png" 
              alt="Information" 
              width={20} 
              height={20}
            />
            <span>Aucun argent réel ne sera débité</span>
          </div>
        </div>

        <div className="test-modal-footer">
          <button className="test-modal-btn" onClick={handleClose}>
            J&apos;ai compris
          </button>
        </div>
      </div>
    </div>
  );
}
