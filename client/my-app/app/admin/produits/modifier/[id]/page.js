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
  
  // États pour la gestion des images
  const [productImages, setProductImages] = useState([]); // Images existantes
  const [selectedFile, setSelectedFile] = useState(null); // Fichier sélectionné
  const [uploading, setUploading] = useState(false); // État d'upload en cours
  const [previewUrl, setPreviewUrl] = useState(''); // Preview de l'image avant upload

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
          
          // Charger les images du produit
          setProductImages(product.ProductImage || []);
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

  // FONCTION POUR GÉRER LA SÉLECTION D'UNE IMAGE
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    
    // Vérifier qu'un fichier a été sélectionné
    if (!file) return;
    
    // Vérifier le type de fichier (seulement images)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Type de fichier non autorisé. Veuillez sélectionner une image (JPG, PNG, WEBP, GIF)');
      return;
    }
    
    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Fichier trop volumineux. Taille maximum: 5 MB');
      return;
    }
    
    // Stocker le fichier sélectionné
    setSelectedFile(file);
    
    // Créer une preview de l'image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
    
    setError(''); // Effacer les erreurs précédentes
  };

  // FONCTION POUR UPLOADER L'IMAGE
  const handleImageUpload = async () => {
    // Vérifier qu'un fichier a été sélectionné
    if (!selectedFile) {
      setError('Veuillez sélectionner une image');
      return;
    }
    
    setUploading(true);
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Vous devez être connecté');
        router.push('/login');
        return;
      }
      
      // Créer un FormData pour envoyer le fichier
      const formDataImage = new FormData();
      formDataImage.append('image', selectedFile);
      
      // Envoyer le fichier au serveur
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}/images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // NE PAS mettre 'Content-Type': 'application/json' avec FormData
          // Le navigateur le fait automatiquement avec le bon boundary
        },
        body: formDataImage
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Image ajoutée avec succès !');
        // Ajouter la nouvelle image à la liste
        setProductImages([...productImages, data.image]);
        // Réinitialiser la sélection
        setSelectedFile(null);
        setPreviewUrl('');
        // Effacer le message de succès après 3 secondes
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Erreur lors de l\'ajout de l\'image');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur de connexion au serveur');
    } finally {
      setUploading(false);
    }
  };

  // FONCTION POUR SUPPRIMER UNE IMAGE
  const handleImageDelete = async (imageId) => {
    // Confirmer la suppression
    if (!confirm('Voulez-vous vraiment supprimer cette image ?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Vous devez être connecté');
        router.push('/login');
        return;
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}/images/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Image supprimée avec succès !');
        // Retirer l'image de la liste
        setProductImages(productImages.filter(img => img.id !== imageId));
        // Effacer le message de succès après 3 secondes
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Erreur lors de la suppression de l\'image');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur de connexion au serveur');
    }
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

          {/* SECTION GESTION DES IMAGES */}
          <div className="form-group" style={{ marginTop: '2rem', padding: '1.5rem', background: '#f9f9f9', borderRadius: '10px' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-dark)', textAlign: 'center' }}>
              <Image src="/camera.png" alt="" width={24} height={24} style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />
              Gestion des images du produit
            </h3>

            {/* IMAGES EXISTANTES */}
            {productImages.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--text-light)' }}>
                  Images actuelles ({productImages.length})
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                  {productImages.map((image) => (
                    <div key={image.id} style={{ 
                      position: 'relative', 
                      border: '2px solid var(--light-beige)', 
                      borderRadius: '10px',
                      overflow: 'hidden',
                      background: 'white'
                    }}>
                      <Image
                        src={image.url}
                        alt={image.altText || 'Image produit'}
                        width={150}
                        height={150}
                        style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                      />
                      {image.isPrimary && (
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          left: '8px',
                          background: 'var(--primary-orange)',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '5px',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          Principale
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleImageDelete(image.id)}
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          background: '#c62828',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '30px',
                          height: '30px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.2rem',
                          fontWeight: 'bold',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#b71c1c'}
                        onMouseLeave={(e) => e.target.style.background = '#c62828'}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AJOUTER UNE NOUVELLE IMAGE */}
            <div style={{ 
              border: '2px dashed var(--light-beige)', 
              borderRadius: '10px', 
              padding: '1.5rem',
              background: 'white'
            }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--text-dark)' }}>
                Ajouter une nouvelle image
              </h4>

              {/* INPUT FILE */}
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  style={{
                    padding: '10px',
                    border: '2px solid var(--light-beige)',
                    borderRadius: '8px',
                    width: '100%',
                    cursor: 'pointer'
                  }}
                />
                <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--text-light)', fontSize: '0.85rem' }}>
                  Formats acceptés: JPG, PNG, WEBP, GIF • Taille max: 5 MB
                </small>
              </div>

              {/* PREVIEW DE L'IMAGE SÉLECTIONNÉE */}
              {previewUrl && (
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '600' }}>Aperçu :</p>
                  <Image
                    src={previewUrl}
                    alt="Aperçu"
                    width={200}
                    height={200}
                    style={{ 
                      borderRadius: '8px', 
                      border: '2px solid var(--light-beige)',
                      objectFit: 'cover',
                      width: '200px',
                      height: '200px'
                    }}
                  />
                </div>
              )}

              {/* BOUTON D'UPLOAD */}
              <button
                type="button"
                onClick={handleImageUpload}
                disabled={!selectedFile || uploading}
                className="admin-btn admin-btn-primary"
                style={{ width: '100%' }}
              >
                <Image 
                  src="/validation.png" 
                  alt="" 
                  width={20} 
                  height={20} 
                  style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} 
                />
                {uploading ? 'Upload en cours...' : 'Ajouter cette image'}
              </button>
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