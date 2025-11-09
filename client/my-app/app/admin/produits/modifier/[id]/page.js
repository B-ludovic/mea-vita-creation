// Page Admin - Modifier un produit
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import '../../../../../styles/AdminForms.css';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    categoryId: '',
    stock: 0,
    isActive: true
  });

  // Charger les catégories et les données du produit
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        // Charger les catégories
        const categoriesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (categoriesResponse.status === 403) {
          alert('Accès refusé. Réservé aux administrateurs.');
          router.push('/');
          return;
        }

        const categoriesData = await categoriesResponse.json();
        if (categoriesData.success) {
          setCategories(categoriesData.categories);
        }

        // Charger les données du produit à modifier
        const productResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/id/${productId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (productResponse.status === 403) {
          alert('Accès refusé. Réservé aux administrateurs.');
          router.push('/');
          return;
        }

        if (productResponse.status === 404) {
          alert('Produit non trouvé');
          router.push('/admin/produits');
          return;
        }

        const productData = await productResponse.json();
        if (productData.success) {
          const product = productData.product;
          // Pré-remplir le formulaire avec les données existantes
          setFormData({
            name: product.name,
            slug: product.slug,
            description: product.description || '',
            price: product.price.toString(),
            categoryId: product.categoryId,
            stock: product.stock,
            isActive: product.isActive
          });
        }
      } catch (error) {
        console.error('Erreur:', error);
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, productId]);

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
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Vous devez être connecté');
        router.push('/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.status === 403) {
        alert('Accès refusé. Réservé aux administrateurs.');
        router.push('/');
        return;
      }

      const data = await response.json();

      if (data.success) {
        setSuccess('Produit modifié avec succès !');
        setTimeout(() => {
          router.push('/admin/produits');
        }, 1500);
      } else {
        setError(data.message || 'Erreur lors de la modification du produit');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setSubmitting(false);
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
        <h1>Modifier un produit</h1>
        <p>Modifier les informations du produit</p>
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
            <small style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
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
              <label htmlFor="isActive" style={{ fontWeight: 'normal' }}>
                Produit actif (visible sur le site)
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={submitting}
            >
              <Image src="/validation.png" alt="" width={20} height={20} style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />
              {submitting ? 'Modification en cours...' : 'Enregistrer les modifications'}
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => router.push('/admin/produits')}
            >
              <Image src="/trash.png" alt="" width={20} height={20} style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />
              Annuler
            </button>
          </div>
        </form>
      </div>
    </>
  );
}