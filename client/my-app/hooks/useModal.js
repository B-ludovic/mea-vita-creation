// Hook personnalisé pour gérer facilement un modal
'use client';

import { useState } from 'react';

/**
 * Hook pour gérer l'état et les actions d'un modal
 * @returns {object} - Objet contenant l'état et les fonctions du modal
 */
export function useModal() {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    icon: null,
    confirmText: 'OK',
    cancelText: 'Annuler',
    showCancelButton: true,
    onConfirm: null,
    onCancel: null
  });

  /**
   * Ouvrir le modal avec les options spécifiées
   * @param {object} options - Configuration du modal
   * @param {string} options.title - Titre du modal (optionnel)
   * @param {string} options.message - Message principal
   * @param {string} options.icon - Chemin de l'icône (optionnel)
   * @param {function} options.onConfirm - Callback pour le bouton OK
   * @param {function} options.onCancel - Callback pour le bouton Annuler
   * @param {string} options.confirmText - Texte du bouton OK (défaut: 'OK')
   * @param {string} options.cancelText - Texte du bouton Annuler (défaut: 'Annuler')
   * @param {boolean} options.showCancelButton - Afficher le bouton Annuler (défaut: true)
   */
  const openModal = (options) => {
    setModalState({
      isOpen: true,
      title: options.title || '',
      message: options.message || '',
      icon: options.icon || null,
      confirmText: options.confirmText || 'OK',
      cancelText: options.cancelText || 'Annuler',
      showCancelButton: options.showCancelButton !== undefined ? options.showCancelButton : true,
      onConfirm: options.onConfirm || (() => closeModal()),
      onCancel: options.onCancel || (() => closeModal())
    });
  };

  /**
   * Fermer le modal
   */
  const closeModal = () => {
    setModalState(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  /**
   * Raccourci pour afficher un message simple (comme alert)
   * @param {string} message - Message à afficher
   * @param {string} title - Titre optionnel
   * @param {string} icon - Icône optionnelle (chemin)
   */
  const showAlert = (message, title = '', icon = null) => {
    openModal({
      title,
      message,
      icon,
      showCancelButton: false,
      confirmText: 'OK'
    });
  };

  /**
   * Raccourci pour afficher une confirmation (comme confirm)
   * @param {string} message - Message de confirmation
   * @param {function} onConfirm - Fonction appelée si l'utilisateur confirme
   * @param {string} title - Titre optionnel
   * @param {string} icon - Icône optionnelle (chemin)
   */
  const showConfirm = (message, onConfirm, title = 'Confirmation', icon = null) => {
    openModal({
      title,
      message,
      icon,
      showCancelButton: true,
      confirmText: 'Confirmer',
      cancelText: 'Annuler',
      onConfirm: () => {
        onConfirm();
        closeModal();
      },
      onCancel: closeModal
    });
  };

  return {
    modalState,
    openModal,
    closeModal,
    showAlert,
    showConfirm
  };
}
