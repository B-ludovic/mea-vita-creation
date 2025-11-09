// Page Admin - Liste des utilisateurs
'use client';

export default function AdminUsersPage() {
  return (
    <>
      <div className="admin-header">
        <h1>Gestion des utilisateurs</h1>
        <p>Liste de tous les clients inscrits</p>
      </div>

      <div className="admin-table-container">
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
          <h3 style={{ marginBottom: '1rem' }}>Fonctionnalité à venir</h3>
          <p>
            La gestion des utilisateurs sera disponible prochainement.<br/>
            Vous pourrez voir la liste des clients, leurs commandes, et gérer leurs comptes.
          </p>
        </div>
      </div>
    </>
  );
}