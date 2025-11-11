// components/Modal.jsx
'use client'; // Ce composant est un client component

import { useEffect } from 'react';
import Image from 'next/image';
import '../styles/Modal.css'; // Importer le CSS spécifique au modal

/**
 * Composant Modal réutilisable
 * @param {boolean} isOpen - Contrôle la visibilité du modal
 * @param {string} title - Titre du modal (optionnel)
 * @param {string} message - Message principal à afficher
 * @param {string} icon - Chemin de l'icône à afficher (optionnel)
 * @param {function} onConfirm - Fonction appelée lors du clic sur "OK"
 * @param {function} onCancel - Fonction appelée lors du clic sur "Annuler"
 * @param {string} confirmText - Texte du bouton de confirmation (défaut: 'OK')
 * @param {string} cancelText - Texte du bouton d'annulation (défaut: 'Annuler')
 * @param {boolean} showCancelButton - Afficher ou non le bouton "Annuler" (défaut: true)
 */
const Modal = ({
  isOpen,
  title,
  message,
  icon,
  onConfirm,
  onCancel,
  confirmText = 'OK',
  cancelText = 'Annuler',
  showCancelButton = true
}) => {
  // Empêche le scroll du body quand le modal est ouvert
  // DOIT être avant le early return pour respecter les règles des hooks
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // N'affiche rien si le modal n'est pas ouvert
  if (!isOpen) {
    return null;
  }

  return (
    // Backdrop semi-transparent qui couvre tout l'écran
    <div className="modal-backdrop">
      {/* Conteneur principal du modal */}
      <div className="modal-container">
        {/* Icône (optionnelle) */}
        {icon && (
          <div className="modal-icon">
            <Image 
              src={icon} 
              alt="Icon" 
              width={60} 
              height={60}
            />
          </div>
        )}
        
        {/* En-tête du modal (optionnel) */}
        {title && <h3 className="modal-title">{title}</h3>}
        
        {/* Message principal */}
        <p className="modal-message">{message}</p>
        
        {/* Conteneur des boutons */}
        <div className="modal-button-container">
          {showCancelButton && (
            <button
              onClick={onCancel}
              className="modal-button modal-cancel"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={onConfirm}
            className="modal-button modal-confirm"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
