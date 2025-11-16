// Page Admin - Gestion des messages de contact
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Modal from '../../../components/Modal';
import { useModal } from '../../../hooks/useModal';
import '../../../styles/Admin.css';
import '../../../styles/AdminMessages.css';

export default function AdminMessagesPage() {
  const router = useRouter();
  const { modalState, showAlert, showConfirm, closeModal } = useModal();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, UNREAD, READ

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showAlert('Vous devez être connecté', 'Authentification requise', '/icones/annuler.png');
        router.push('/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 403) {
        showAlert('Accès refusé. Réservé aux administrateurs.', 'Accès refusé', '/icones/annuler.png');
        router.push('/');
        return;
      }

      const data = await response.json();

      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Erreur:', error);
      showAlert('Erreur lors du chargement des messages', 'Erreur', '/icones/annuler.png');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showAlert('Vous devez être connecté', 'Authentification requise', '/icones/annuler.png');
        router.push('/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact/${messageId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        showAlert('Message marqué comme lu', 'Succès', '/icones/validation.png');
        fetchMessages();
      }
    } catch (error) {
      console.error('Erreur:', error);
      showAlert('Erreur lors de la mise à jour', 'Erreur', '/icones/annuler.png');
    }
  };

  const handleDelete = async (messageId) => {
    showConfirm(
      'Êtes-vous sûr de vouloir supprimer ce message ? Cette action est irréversible.',
      async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            showAlert('Vous devez être connecté', 'Authentification requise', '/icones/annuler.png');
            router.push('/login');
            return;
          }

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact/${messageId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            showAlert('Message supprimé avec succès', 'Succès', '/icones/validation.png');
            fetchMessages();
          } else {
            showAlert('Erreur lors de la suppression', 'Erreur', '/icones/annuler.png');
          }
        } catch (error) {
          console.error('Erreur:', error);
          showAlert('Erreur lors de la suppression', 'Erreur', '/icones/annuler.png');
        }
      },
      'Supprimer le message',
      '/icones/trash.png'
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Il y a quelques minutes';
    } else if (diffInHours < 24) {
      return `Il y a ${Math.floor(diffInHours)} heure${Math.floor(diffInHours) > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === 'UNREAD') return !msg.isRead;
    if (filter === 'READ') return msg.isRead;
    return true;
  });

  const unreadCount = messages.filter(msg => !msg.isRead).length;

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
        <div>
          <h1>Messages de contact</h1>
          <p>{messages.length} message{messages.length > 1 ? 's' : ''} 
            {unreadCount > 0 && ` · ${unreadCount} non lu${unreadCount > 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="messages-filters">
        <div className="messages-filters-buttons">
          <button
            className={`filter-btn ${filter === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilter('ALL')}
          >
            Tous ({messages.length})
          </button>
          <button
            className={`filter-btn ${filter === 'UNREAD' ? 'active' : ''}`}
            onClick={() => setFilter('UNREAD')}
          >
            Non lus ({unreadCount})
          </button>
          <button
            className={`filter-btn ${filter === 'READ' ? 'active' : ''}`}
            onClick={() => setFilter('READ')}
          >
            Lus ({messages.length - unreadCount})
          </button>
        </div>
      </div>

      {/* Liste des messages */}
      <div className="messages-container">
        {filteredMessages.map((message) => (
          <div 
            key={message.id}
            className={`message-card ${!message.isRead ? 'unread' : ''}`}
          >
            {/* Badge "Nouveau" */}
            {!message.isRead && (
              <div className="message-badge">
                Nouveau
              </div>
            )}

            {/* En-tête du message */}
            <div className="message-header">
              <div className="message-info">
                <div className="message-sender">
                  <h3>{message.name}</h3>
                  <span className={`badge ${message.isRead ? 'info' : 'success'}`}>
                    {message.isRead ? 'Lu' : 'Non lu'}
                  </span>
                </div>
                <div className="message-meta">
                  <a href={`mailto:${message.email}`}>
                    {message.email}
                  </a>
                  {' · '}
                  {formatDate(message.createdAt)}
                </div>
              </div>

              <div className="message-actions">
                {!message.isRead && (
                  <button
                    className="admin-btn admin-btn-primary"
                    onClick={() => handleMarkAsRead(message.id)}
                  >
                    <Image src="/icones/validation.png" alt="Marquer comme lu" width={16} height={16} />
                    Marquer comme lu
                  </button>
                )}
                <button
                  className="admin-btn admin-btn-danger"
                  onClick={() => handleDelete(message.id)}
                >
                  <Image src="/icones/trash.png" alt="Supprimer" width={16} height={16} />
                  Supprimer
                </button>
              </div>
            </div>

            {/* Sujet */}
            <div className="message-subject">
              <div className="message-subject-label">
                Sujet
              </div>
              <div className="message-subject-text">
                {message.subject}
              </div>
            </div>

            {/* Message */}
            <div className="message-content">
              <div className="message-content-label">
                Message
              </div>
              <div className="message-content-text">
                {message.message}
              </div>
            </div>

            {/* Bouton de réponse */}
            <div className="message-reply">
              <a
                href={`mailto:${message.email}?subject=Re: ${message.subject}`}
                className="message-reply-btn"
              >
                <Image src="/icones/mail.png" alt="Répondre" width={18} height={18} />
                Répondre par email
              </a>
            </div>
          </div>
        ))}

        {filteredMessages.length === 0 && (
          <div className="messages-empty">
            <p>
              {filter === 'UNREAD' 
                ? 'Aucun message non lu' 
                : filter === 'READ'
                ? 'Aucun message lu'
                : 'Aucun message pour le moment'}
            </p>
          </div>
        )}
      </div>

      {/* Modal pour les notifications */}
      <Modal
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        icon={modalState.icon}
        onConfirm={modalState.onConfirm}
        onCancel={closeModal}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        showCancelButton={modalState.showCancelButton}
      />
    </>
  );
}