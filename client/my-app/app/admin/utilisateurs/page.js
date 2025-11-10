// Page Admin - Liste des utilisateurs
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Vous devez être connecté');
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
        alert('Accès refusé. Réservé aux administrateurs.');
        router.push('/');
        return;
      }

      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (userId, currentStatus, userEmail) => {
    const action = currentStatus ? 'désactiver' : 'activer';
    
    if (!confirm(`Voulez-vous vraiment ${action} le compte de "${userEmail}" ?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Vous devez être connecté');
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
        alert('Accès refusé. Réservé aux administrateurs.');
        router.push('/');
        return;
      }

      const data = await response.json();

      if (data.success) {
        alert(data.message || 'Statut modifié avec succès');
        fetchUsers();
      } else {
        alert(data.message || 'Erreur lors de la modification du statut');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la modification du statut');
    }
  };

  const handleToggleRole = async (userId, currentRole, userEmail) => {
    const newRole = currentRole === 'ADMIN' ? 'CLIENT' : 'ADMIN';
    const action = newRole === 'ADMIN' ? 'promouvoir en administrateur' : 'rétrograder en client';
    
    if (!confirm(`Voulez-vous vraiment ${action} l'utilisateur "${userEmail}" ?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Vous devez être connecté');
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
        alert('Accès refusé. Réservé aux administrateurs.');
        router.push('/');
        return;
      }

      const data = await response.json();

      if (data.success) {
        alert(data.message || 'Rôle modifié avec succès');
        fetchUsers(); // Recharger la liste
      } else {
        alert(data.message || 'Erreur lors de la modification du rôle');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la modification du rôle');
    }
  };

  const handleDelete = async (userId, userEmail, userRole) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${userEmail}" ?\n\nCette action est irréversible.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Vous devez être connecté');
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
        alert('Accès refusé. Réservé aux administrateurs.');
        router.push('/');
        return;
      }

      const data = await response.json();

      if (data.success) {
        alert('Utilisateur supprimé avec succès !');
        fetchUsers(); // Recharger la liste
      } else {
        alert(data.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression de l\'utilisateur');
    }
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
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-dark)' }}>Liste des utilisateurs</h2>

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
                <td data-label="Commandes" style={{ textAlign: 'center' }}>
                  {user._count.Order}
                </td>
                <td data-label="Inscription" style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                  {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                </td>
                <td data-label="Actions">
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button 
                      className="admin-btn admin-btn-user-toggle"
                      style={{ padding: '4px 8px', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
                      onClick={() => handleToggleActive(user.id, user.isActive, user.email)}
                    >
                      <Image 
                        src={user.isActive ? "/desactiver.png" : "/validation.png"} 
                        alt="" 
                        width={12} 
                        height={12} 
                        style={{ display: 'inline-block', marginRight: '4px', verticalAlign: 'middle' }} 
                      />
                      {user.isActive ? 'Désactiver' : 'Activer'}
                    </button>
                    <button 
                      className="admin-btn admin-btn-promote"
                      style={{ padding: '4px 8px', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
                      onClick={() => handleToggleRole(user.id, user.role, user.email)}
                    >
                      <Image 
                        src={user.role === 'ADMIN' ? "/retrograder.png" : "/promouvoir.png"} 
                        alt="" 
                        width={12} 
                        height={12} 
                        style={{ display: 'inline-block', marginRight: '4px', verticalAlign: 'middle' }} 
                      />
                      {user.role === 'ADMIN' ? 'Rétrograder' : 'Promouvoir'}
                    </button>
                    <button 
                      className="admin-btn admin-btn-danger"
                      style={{ padding: '4px 8px', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
                      onClick={() => handleDelete(user.id, user.email, user.role)}
                    >
                      <Image src="/trash.png" alt="" width={12} height={12} style={{ display: 'inline-block', marginRight: '4px', verticalAlign: 'middle' }} />
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}