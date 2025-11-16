// Page Admin - Liste des utilisateurs
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Modal from '../../../components/Modal';
import { useModal } from '../../../hooks/useModal';
import { getAccessToken } from '../../../utils/auth';

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { modalState, showAlert, showConfirm, closeModal } = useModal();

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    try {
      const token = getAccessToken();
      if (!token) {
        showAlert('Vous devez être connecté', 'Authentification requise', '/icones/annuler.png');
        router.push('/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
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
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Erreur:', error);
      showAlert('Erreur lors du chargement des utilisateurs', 'Erreur', '/icones/annuler.png');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (userId, currentStatus, userEmail) => {
    const action = currentStatus ? 'désactiver' : 'activer';
    
    showConfirm(
      `Voulez-vous vraiment ${action} le compte de "${userEmail}" ?`,
      async () => {
        try {
          const token = getAccessToken();
          if (!token) {
            showAlert('Vous devez être connecté', 'Authentification requise', '/icones/annuler.png');
            router.push('/login');
            return;
          }

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/toggle-active`, {
            method: 'PUT',
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
            showAlert(data.message || 'Statut modifié avec succès', 'Succès', '/icones/validation.png');
            fetchUsers();
          } else {
            showAlert(data.message || 'Erreur lors de la modification du statut', 'Erreur', '/icones/annuler.png');
          }
        } catch (error) {
          console.error('Erreur:', error);
          showAlert('Erreur lors de la modification du statut', 'Erreur', '/icones/annuler.png');
        }
      },
      `${action.charAt(0).toUpperCase() + action.slice(1)} le compte`,
      '/icones/help.png'
    );
  };

  const handleToggleRole = async (userId, currentRole, userEmail) => {
    const newRole = currentRole === 'ADMIN' ? 'CLIENT' : 'ADMIN';
    const action = newRole === 'ADMIN' ? 'promouvoir en administrateur' : 'rétrograder en client';
    
    showConfirm(
      `Voulez-vous vraiment ${action} l'utilisateur "${userEmail}" ?`,
      async () => {
        try {
          const token = getAccessToken();
          if (!token) {
            showAlert('Vous devez être connecté', 'Authentification requise', '/icones/annuler.png');
            router.push('/login');
            return;
          }

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/role`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ role: newRole })
          });

          if (response.status === 403) {
            showAlert('Accès refusé. Réservé aux administrateurs.', 'Accès refusé', '/icones/annuler.png');
            router.push('/');
            return;
          }

          const data = await response.json();

          if (data.success) {
            showAlert(data.message || 'Rôle modifié avec succès', 'Succès', '/icones/validation.png');
            fetchUsers(); // Recharger la liste
          } else {
            showAlert(data.message || 'Erreur lors de la modification du rôle', 'Erreur', '/icones/annuler.png');
          }
        } catch (error) {
          console.error('Erreur:', error);
          showAlert('Erreur lors de la modification du rôle', 'Erreur', '/icones/annuler.png');
        }
      },
      'Modifier le rôle',
      '/icones/help.png'
    );
  };

  const handleDelete = async (userId, userEmail, userRole) => {
    showConfirm(
      `Êtes-vous sûr de vouloir supprimer l'utilisateur "${userEmail}" ?\n\nCette action est irréversible.`,
      async () => {
        try {
          const token = getAccessToken();
          if (!token) {
            showAlert('Vous devez être connecté', 'Authentification requise', '/icones/annuler.png');
            router.push('/login');
            return;
          }

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`, {
            method: 'DELETE',
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
            showAlert('Utilisateur supprimé avec succès !', 'Succès', '/icones/validation.png');
            fetchUsers(); // Recharger la liste
          } else {
            showAlert(data.message || 'Erreur lors de la suppression', 'Erreur', '/icones/annuler.png');
          }
        } catch (error) {
          console.error('Erreur:', error);
          showAlert('Erreur lors de la suppression de l\'utilisateur', 'Erreur', '/icones/annuler.png');
        }
      },
      'Supprimer l\'utilisateur',
      '/icones/trash.png'
    );
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
      <div className="admin-header">
        <h1>Gestion des utilisateurs</h1>
        <p>{users.length} utilisateur{users.length > 1 ? 's' : ''} inscrit{users.length > 1 ? 's' : ''}</p>
      </div>

      <div className="admin-table-container">
        <h2 className="users-section-title">Liste des utilisateurs</h2>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Commandes</th>
              <th>Inscription</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td data-label="Nom">
                  <strong>{user.firstName} {user.lastName}</strong>
                </td>
                <td data-label="Email">{user.email}</td>
                <td data-label="Rôle">
                  <span className={`badge ${user.role === 'ADMIN' ? 'admin-badge' : 'client-badge'}`}>
                    {user.role === 'ADMIN' ? 'Administrateur' : 'Client'}
                  </span>
                </td>
                <td data-label="Statut">
                  <span className={`badge ${user.isActive ? 'success' : 'danger'}`}>
                    {user.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td data-label="Commandes" className="user-orders-count">
                  {user._count.Order}
                </td>
                <td data-label="Inscription" className="user-inscription-date">
                  {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                </td>
                <td data-label="Actions">
                  <div className="user-actions">
                    <button 
                      className="admin-btn admin-btn-user-toggle user-action-btn"
                      onClick={() => handleToggleActive(user.id, user.isActive, user.email)}
                    >
                      <Image 
                        src={user.isActive ? "/icones/desactiver.png" : "/icones/validation.png"} 
                        alt="" 
                        width={12} 
                        height={12} 
                        className="user-action-icon"
                      />
                      {user.isActive ? 'Désactiver' : 'Activer'}
                    </button>
                    <button 
                      className="admin-btn admin-btn-promote user-action-btn"
                      onClick={() => handleToggleRole(user.id, user.role, user.email)}
                    >
                      <Image 
                        src={user.role === 'ADMIN' ? "/icones/retrograder.png" : "/icones/promouvoir.png"} 
                        alt="" 
                        width={12} 
                        height={12} 
                        className="user-action-icon"
                      />
                      {user.role === 'ADMIN' ? 'Rétrograder' : 'Promouvoir'}
                    </button>
                    <button 
                      className="admin-btn admin-btn-danger user-action-btn"
                      onClick={() => handleDelete(user.id, user.email, user.role)}
                    >
                      <Image src="/icones/trash.png" alt="" width={12} height={12} className="user-action-icon" />
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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