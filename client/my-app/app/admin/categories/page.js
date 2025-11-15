// PAGE ADMIN - GESTION DES CATÉGORIES

// Cette page permet à l'admin de gérer toutes les catégories du site
// Fonctionnalités : Voir, Ajouter, Modifier, Supprimer des catégories

'use client';

// Import des hooks React
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Modal from '../../../components/Modal';
import { useModal } from '../../../hooks/useModal';

// Import des styles
import '../../../styles/Admin.css';
import '../../../styles/AdminForms.css';

export default function AdminCategoriesPage() {

  // ÉTAT (STATE) - Variables qui changent
  
  
  const router = useRouter();
  const { modalState, showAlert, showConfirm, closeModal } = useModal();
  
  // Liste de toutes les catégories
  const [categories, setCategories] = useState([]);
  
  // État de chargement (true = en train de charger)
  const [loading, setLoading] = useState(true);
  
  // Messages d'erreur ou de succès
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Formulaire pour ajouter/modifier une catégorie
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    order: 0
  });
  
  // Mode édition : null = mode ajout, id = mode modification
  const [editingId, setEditingId] = useState(null);
  
  // Afficher ou cacher le formulaire
  const [showForm, setShowForm] = useState(false);

 
  // FONCTION 1 : CHARGER TOUTES LES CATÉGORIES
 
  // Cette fonction récupère toutes les catégories depuis le backend
  const fetchCategories = async () => {
    try {
      // Récupérer le token JWT depuis localStorage (pour l'authentification)
      const token = localStorage.getItem('token');
      
      // Si pas de token, rediriger vers login
      if (!token) {
        router.push('/login');
        return;
      }

      // APPEL API : Demander toutes les catégories au backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
        headers: {
          'Authorization': `Bearer ${token}` // Envoyer le token pour s'authentifier
        }
      });

      // Si erreur d'autorisation (403 Forbidden)
      if (response.status === 403) {
        setMessage({ type: 'error', text: 'Accès refusé. Vous devez être administrateur.' });
        setTimeout(() => router.push('/'), 2000);
        return;
      }

      // Convertir la réponse en JSON
      const data = await response.json();

      // Si succès, mettre à jour la liste des catégories
      if (data.success) {
        setCategories(data.categories);
      } else {
        setMessage({ type: 'error', text: data.message });
      }

    } catch (error) {
      console.error('Erreur:', error);
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
    } finally {
      setLoading(false); // Arrêter le chargement
    }
  };

  // Charger les catégories au démarrage
 
  // Ce code s'exécute une seule fois quand la page charge
  useEffect(() => {
    fetchCategories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  
  // FONCTION 2 : GÉRER LES CHANGEMENTS DANS LE FORMULAIRE
  
  // Quand l'utilisateur tape dans un champ, on met à jour formData
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // AUTO-GÉNÉRATION DU SLUG : Si on tape le nom, créer le slug automatiquement
    // Exemple : "Ceintures en Cuir" → "ceintures-en-cuir"
    if (name === 'name' && !editingId) {
      const slug = value
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Enlever les accents
        .replace(/[^a-z0-9\s-]/g, '') // Garder seulement lettres, chiffres, espaces, tirets
        .trim()
        .replace(/\s+/g, '-'); // Remplacer espaces par tirets
      
      setFormData(prev => ({
        ...prev,
        slug: slug
      }));
    }
  };

  
  // FONCTION 3 : SOUMETTRE LE FORMULAIRE (Ajouter ou Modifier)

  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêcher le rechargement de la page

    try {
      const token = localStorage.getItem('token');
      
      // Déterminer si on AJOUTE ou MODIFIE
      const url = editingId 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${editingId}` // PUT pour modifier
        : `${process.env.NEXT_PUBLIC_API_URL}/api/categories`; // POST pour ajouter
      
      const method = editingId ? 'PUT' : 'POST';

      // APPEL API : Envoyer les données au backend
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData) // Convertir formData en JSON
      });

      const data = await response.json();

      // Si succès
      if (data.success) {
        const successMessage = editingId ? 'Catégorie modifiée avec succès' : 'Catégorie ajoutée avec succès';
        showAlert(successMessage, 'Succès', '/icones/validation.png');
        
        // Réinitialiser le formulaire
        setFormData({ name: '', slug: '', description: '', order: 0 });
        setEditingId(null);
        setShowForm(false);
        
        // Recharger la liste des catégories
        fetchCategories();
      } else {
        setMessage({ type: 'error', text: data.message });
      }

    } catch (error) {
      console.error('Erreur:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' });
    }
  };

  
  // FONCTION 4 : MODIFIER UNE CATÉGORIE

  // Quand on clique sur "Modifier", remplir le formulaire avec les données existantes
  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      order: category.order
    });
    setEditingId(category.id);
    setShowForm(true); // Afficher le formulaire
    
    // Scroll vers le haut pour voir le formulaire
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  
  // FONCTION 5 : SUPPRIMER UNE CATÉGORIE
 
  const handleDelete = async (id, categoryName) => {
    // CONFIRMATION : Demander à l'admin s'il est sûr avec Modal
    showConfirm(
      `Êtes-vous sûr de vouloir supprimer la catégorie "${categoryName}" ?`,
      async () => {
        try {
          const token = localStorage.getItem('token');

          // APPEL API : Demander au backend de supprimer la catégorie
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          const data = await response.json();

          // Si succès
          if (data.success) {
            showAlert('Catégorie supprimée avec succès', 'Succès', '/icones/validation.png');
            fetchCategories(); // Recharger la liste
          } else {
            setMessage({ type: 'error', text: data.message });
          }

        } catch (error) {
          console.error('Erreur:', error);
          setMessage({ type: 'error', text: 'Erreur lors de la suppression' });
        }
      },
      'Supprimer la catégorie',
      '/icones/trash.png'
    );
  };

  // FONCTION 6 : ANNULER L'ÉDITION
  const handleCancel = () => {
    setFormData({ name: '', slug: '', description: '', order: 0 });
    setEditingId(null);
    setShowForm(false);
  };

  // AFFICHAGE - CHARGEMENT
  if (loading) {
    return (
      <div className="admin-container">
        <h1>Chargement...</h1>
      </div>
    );
  }

  // AFFICHAGE PRINCIPAL
  
  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Gestion des Catégories</h1>
        <p className="admin-subtitle">
          Gérez toutes les catégories de produits de votre site
        </p>
      </div>

      {/* MESSAGE DE SUCCÈS OU D'ERREUR */}
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* BOUTON POUR AFFICHER LE FORMULAIRE D'AJOUT */}
      {!showForm && (
        <button 
          className="btn-primary" 
          onClick={() => setShowForm(true)}
          style={{ marginBottom: '2rem' }}
        >
          + Ajouter une catégorie
        </button>
      )}

      {/* FORMULAIRE D'AJOUT/MODIFICATION */}
      {showForm && (
        <div className="admin-form-container" style={{ marginBottom: '3rem' }}>
          <h2>{editingId ? 'Modifier la catégorie' : 'Ajouter une catégorie'}</h2>
          
          <form onSubmit={handleSubmit} className="admin-form">
            
            {/* CHAMP NOM */}
            <div className="form-group">
              <label htmlFor="name">
                Nom de la catégorie <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ex: Ceintures en Cuir"
                required
              />
              <small>Le nom qui sera affiché sur le site</small>
            </div>

            {/* CHAMP SLUG */}
            <div className="form-group">
              <label htmlFor="slug">
                Slug (URL) <span className="required">*</span>
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="Ex: ceintures-en-cuir"
                required
              />
              <small>
                L&apos;URL de la catégorie (sans espaces, minuscules, avec tirets)
                <br />
                Exemple : /categories/<strong>{formData.slug || 'ceintures-en-cuir'}</strong>
              </small>
            </div>

            {/* CHAMP DESCRIPTION */}
            <div className="form-group">
              <label htmlFor="description">
                Description <span className="required">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Décrivez cette catégorie..."
                rows="4"
                required
              />
              <small>Description affichée sur la page de la catégorie</small>
            </div>

            {/* CHAMP ORDRE */}
            <div className="form-group">
              <label htmlFor="order">
                Ordre d&apos;affichage
              </label>
              <input
                type="number"
                id="order"
                name="order"
                value={formData.order}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
              />
              <small>
                Numéro pour trier les catégories (0 = en premier, 1 = en deuxième, etc.)
              </small>
            </div>

            {/* BOUTONS DU FORMULAIRE */}
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingId ? 'Mettre à jour' : 'Ajouter'}
              </button>
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={handleCancel}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TABLEAU DES CATÉGORIES */}
      <div className="admin-table-container">
        <h2>Liste des catégories ({categories.length})</h2>
        
        {categories.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>
            Aucune catégorie pour le moment. Cliquez sur &quot;Ajouter une catégorie&quot; pour commencer.
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Ordre</th>
                <th>Nb Produits</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td data-label="Nom">
                    <strong>{category.name}</strong>
                  </td>
                  <td data-label="Slug">
                    <code>{category.slug}</code>
                  </td>
                  <td data-label="Description">
                    {category.description.substring(0, 50)}
                    {category.description.length > 50 ? '...' : ''}
                  </td>
                  <td data-label="Ordre">
                    {category.order}
                  </td>
                  <td data-label="Nb Produits">
                    {category._count?.Product || 0}
                  </td>
                  <td data-label="Actions">
                    <div className="action-buttons" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <button 
                        className="admin-btn admin-btn-secondary"
                        onClick={() => handleEdit(category)}
                      >
                        <Image src="/icones/modify.png" alt="Modifier" width={16} height={16} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                        Modifier
                      </button>
                      <button 
                        className="admin-btn admin-btn-danger"
                        onClick={() => handleDelete(category.id, category.name)}
                      >
                        <Image src="/icones/trash.png" alt="Supprimer" width={16} height={16} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* AIDE */}
      <div className="admin-help" style={{ marginTop: '3rem', padding: '1.5rem', background: 'var(--cream)', borderRadius: '10px' }}>
        <h3>
          <Image src="/icones/help.png" alt="Aide" width={20} height={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Aide
        </h3>
        <ul>
          <li><strong>Ajouter</strong> : Cliquez sur &quot;Ajouter une catégorie&quot; et remplissez le formulaire</li>
          <li><strong>Modifier</strong> : Cliquez sur &quot;Modifier&quot; à côté de la catégorie à changer</li>
          <li><strong>Supprimer</strong> : Attention ! Vous ne pouvez supprimer que les catégories vides (sans produits)</li>
          <li><strong>Slug</strong> : C&apos;est l&apos;URL de la catégorie. Il doit être unique et sans espaces</li>
          <li><strong>Ordre</strong> : Les catégories sont triées par ce numéro (0 en premier)</li>
        </ul>
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
    </div>
  );
}
