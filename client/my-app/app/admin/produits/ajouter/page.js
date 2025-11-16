// Page Admin - Ajouter un produit
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getAccessToken } from '../../../../utils/auth';
import '../../../../styles/AdminForms.css';

export default function AddProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    categoryId: '',
    stock: 1,
    isActive: true
  });

  // Charger les catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Récupérer le token depuis localStorage
        const token = getAccessToken();
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Vérifier si l'utilisateur est autorisé
        if (response.status === 403) {
          alert('Accès refusé. Réservé aux administrateurs.');
          router.push('/');
          return;
        }

        const data = await response.json();
        if (data.success) {
          setCategories(data.categories);
          // Sélectionner la première catégorie par défaut
          if (data.categories.length > 0) {
            setFormData(prev => ({ ...prev, categoryId: data.categories[0].id }));
          }
        }
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    fetchCategories();
  }, [router]);

  // Générer automatiquement le slug à partir du nom
  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Enlever les accents
      .replace(/[^a-z0-9]+/g, '-') // Remplacer les caractères spéciaux par des tirets
      .replace(/^-+|-+$/g, ''); // Enlever les tirets au début et à la fin

    setFormData({
      ...formData,
      name,
      slug
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Récupérer le token depuis localStorage
      const token = getAccessToken();
      if (!token) {
        alert('Vous devez être connecté');
        router.push('/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      // Vérifier si l'utilisateur est autorisé
      if (response.status === 403) {
        alert('Accès refusé. Réservé aux administrateurs.');
        router.push('/');
        return;
      }

      const data = await response.json();

      if (data.success) {
        setSuccess('Produit créé avec succès !');
        setTimeout(() => {
          router.push('/admin/produits');
        }, 1500);
      } else {
        setError(data.message || 'Erreur lors de la création du produit');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="admin-header">
        <h1>Ajouter un produit</h1>
        <p>Créer un nouveau produit dans le catalogue</p>
      </div>

      <div className="admin-form-container">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">
              Nom du produit <span>*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              required
              placeholder="Ex: L'Atlas Fogo"
            />
          </div>

          <div className="form-group">
            <label htmlFor="slug">
              Slug (URL) <span>*</span>
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              placeholder="Ex: atlas-fogo"
            />
            <small className="product-form-hint">
              Généré automatiquement à partir du nom
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Décrivez le produit..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">
                Prix (€) <span>*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                placeholder="49.00"
              />
            </div>

            <div className="form-group">
              <label htmlFor="stock">
                Stock <span>*</span>
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                placeholder="1"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="categoryId">
              Catégorie <span>*</span>
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <div className="form-checkbox">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              <label htmlFor="isActive" className="form-checkbox-label-normal">
                Produit actif (visible sur le site)
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={loading}
            >
              <Image src="/icones/validation.png" alt="" width={20} height={20} className="btn-icon-inline" />
              {loading ? 'Création en cours...' : 'Créer le produit'}
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => router.push('/admin/produits')}
            >
              <Image src="/icones/annuler.png" alt="" width={20} height={20} className="btn-icon-inline" />
              Annuler
            </button>
          </div>
        </form>
      </div>
    </>
  );
}