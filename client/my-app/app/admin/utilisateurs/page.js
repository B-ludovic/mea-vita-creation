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
              <th>Commandes</th>
              <th>Inscription</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <strong>{user.firstName} {user.lastName}</strong>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${user.role === 'ADMIN' ? 'admin-badge' : 'client-badge'}`}>
                    {user.role === 'ADMIN' ? 'Administrateur' : 'Client'}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  {user._count.Order}
                </td>
                <td style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                  {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      className="admin-btn admin-btn-user-toggle"
                      style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                      onClick={() => handleToggleRole(user.id, user.role, user.email)}
                    >
                      <Image 
                        src={user.role === 'ADMIN' ? "/utilisateurs.png" : "/satistic.png"} 
                        alt="" 
                        width={14} 
                        height={14} 
                        style={{ display: 'inline-block', marginRight: '4px', verticalAlign: 'middle' }} 
                      />
                      {user.role === 'ADMIN' ? 'Rétrograder' : 'Promouvoir'}
                    </button>
                    <button 
                      className="admin-btn admin-btn-danger"
                      style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                      onClick={() => handleDelete(user.id, user.email, user.role)}
                    >
                      <Image src="/trash.png" alt="" width={14} height={14} style={{ display: 'inline-block', marginRight: '4px', verticalAlign: 'middle' }} />
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