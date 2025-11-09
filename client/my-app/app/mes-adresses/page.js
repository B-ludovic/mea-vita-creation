'use client';

// Importer React et ses hooks
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import '../../styles/Addresses.css';

// COMPOSANT PRINCIPAL - Page de gestion des adresses
export default function MesAdresses() {
  // États (variables qui peuvent changer)
  const [user, setUser] = useState(null); // Utilisateur connecté
  const [addresses, setAddresses] = useState([]); // Liste des adresses
  const [loading, setLoading] = useState(true); // Chargement en cours
  const [showForm, setShowForm] = useState(false); // Afficher/masquer le formulaire
  const [editingAddress, setEditingAddress] = useState(null); // Adresse en cours de modification

  // Hook pour la navigation
  const router = useRouter();

  // FORMULAIRE - États pour chaque champ
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'France',
    phone: '',
    isDefault: false
  });

  // VÉRIFIER SI L'UTILISATEUR EST CONNECTÉ
  useEffect(() => {
    // Récupérer les infos utilisateur depuis localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      // Charger les adresses de cet utilisateur
      loadAddresses(userData.id);
    } else {
      // Si pas connecté, rediriger vers la page de connexion
      router.push('/login');
    }
  }, [router]);

  // FONCTION POUR CHARGER LES ADRESSES DEPUIS L'API
  const loadAddresses = async (userId) => {
    try {
      // Appel API pour récupérer les adresses
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/addresses/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setAddresses(data.addresses); // Stocker les adresses
      }
    } catch (error) {
      console.error('Erreur lors du chargement des adresses:', error);
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  // FONCTION POUR GÉRER LES CHANGEMENTS DANS LE FORMULAIRE
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      // Si c'est une checkbox, prendre 'checked', sinon 'value'
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // FONCTION POUR SOUMETTRE LE FORMULAIRE (Créer ou Modifier)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêcher le rechargement de la page

    try {
      const url = editingAddress
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/addresses/${editingAddress.id}` // Modifier
        : `${process.env.NEXT_PUBLIC_API_URL}/api/addresses`; // Créer

      const method = editingAddress ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          userId: user.id
        })
      });

      const data = await response.json();

      if (data.success) {
        // Recharger les adresses
        loadAddresses(user.id);
        // Fermer le formulaire
        setShowForm(false);
        // Réinitialiser le formulaire
        resetForm();
      } else {
        alert(data.message || 'Erreur lors de l\'enregistrement');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'enregistrement de l\'adresse');
    }
  };

  // FONCTION POUR SUPPRIMER UNE ADRESSE
  const handleDelete = async (addressId) => {
    // Demander confirmation
    if (!confirm('Voulez-vous vraiment supprimer cette adresse ?')) {
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/addresses/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        // Recharger les adresses
        loadAddresses(user.id);
      } else {
        alert(data.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression de l\'adresse');
    }
  };

  // FONCTION POUR DÉFINIR UNE ADRESSE PAR DÉFAUT
  const handleSetDefault = async (addressId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/addresses/${addressId}/default`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        // Recharger les adresses
        loadAddresses(user.id);
      } else {
        alert(data.message || 'Erreur');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la définition de l\'adresse par défaut');
    }
  };

  // FONCTION POUR OUVRIR LE FORMULAIRE EN MODE MODIFICATION
  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      firstName: address.firstName,
      lastName: address.lastName,
      street: address.street,
      city: address.city,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone,
      isDefault: address.isDefault
    });
    setShowForm(true);
  };

  // FONCTION POUR RÉINITIALISER LE FORMULAIRE
  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      street: '',
      city: '',
      postalCode: '',
      country: 'France',
      phone: '',
      isDefault: false
    });
    setEditingAddress(null);
  };

  // AFFICHAGE EN COURS DE CHARGEMENT
  if (loading) {
    return (
      <div className="addresses-container">
        <p>Chargement...</p>
      </div>
    );
  }

  // AFFICHAGE PRINCIPAL
  return (
    <div className="addresses-container">
      {/* En-tête avec titre et bouton ajouter */}
      <div className="addresses-header">
        <h1>Mes Adresses</h1>
        <button 
          className="btn-add-address"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + Ajouter une adresse
        </button>
      </div>

      {/* FORMULAIRE D'AJOUT/MODIFICATION (affiché si showForm = true) */}
      {showForm && (
        <div className="address-form-modal">
          <div className="address-form-content">
            <h2>{editingAddress ? 'Modifier l\'adresse' : 'Nouvelle adresse'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Prénom *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Nom *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Adresse *</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  placeholder="Numéro et nom de rue"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Ville *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Code postal *</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Pays</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Téléphone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="06 12 34 56 78"
                    required
                  />
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleInputChange}
                  />
                  Définir comme adresse par défaut
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-submit">
                  {editingAddress ? 'Modifier' : 'Ajouter'}
                </button>
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LISTE DES ADRESSES */}
      <div className="addresses-list">
        {addresses.length === 0 ? (
          <p className="no-addresses">Vous n&apos;avez pas encore d&apos;adresse enregistrée.</p>
        ) : (
          addresses.map((address) => (
            <div key={address.id} className="address-card">
              {/* Badge PAR DÉFAUT si c'est l'adresse par défaut */}
              {address.isDefault && (
                <span className="badge-default">PAR DÉFAUT</span>
              )}

              <div className="address-info">
                <p className="address-name">
                  <Image 
                    src="/location.png" 
                    alt="Adresse" 
                    width={20} 
                    height={20}
                    className="address-icon"
                  />
                  {address.firstName} {address.lastName}
                </p>
                <p>{address.street}</p>
                <p>{address.postalCode} {address.city}</p>
                <p>{address.country}</p>
                <p>{address.phone}</p>
              </div>

              <div className="address-actions">
                {/* Bouton "Définir par défaut" (seulement si ce n'est pas déjà le cas) */}
                {!address.isDefault && (
                  <button 
                    className="btn-action btn-default"
                    onClick={() => handleSetDefault(address.id)}
                  >
                    <Image 
                      src="/default.png" 
                      alt="Définir par défaut" 
                      width={18} 
                      height={18}
                      className="btn-icon"
                    />
                    Définir par défaut
                  </button>
                )}

                <button 
                  className="btn-action btn-edit"
                  onClick={() => handleEdit(address)}
                >
                  <Image 
                    src="/modify.png" 
                    alt="Modifier" 
                    width={18} 
                    height={18}
                    className="btn-icon"
                  />
                  Modifier
                </button>

                <button 
                  className="btn-action btn-delete"
                  onClick={() => handleDelete(address.id)}
                >
                  <Image 
                    src="/trash.png" 
                    alt="Supprimer" 
                    width={18} 
                    height={18}
                    className="btn-icon"
                  />
                  Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
