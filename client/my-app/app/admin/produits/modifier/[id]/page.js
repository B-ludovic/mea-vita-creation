// Page Admin - Modifier un produit
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Modal from '../../../../../components/Modal';
import { useModal } from '../../../../../hooks/useModal';
import { getAccessToken } from '../../../../../utils/auth';
import '../../../../../styles/AdminForms.css';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;
  const { modalState, showAlert, showConfirm, closeModal } = useModal();

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
    stock: '', // Utiliser une string vide au lieu de 0
    isActive: true
  });

  // Charger les catégories et les données du produit
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getAccessToken();
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
          showAlert('Accès refusé. Réservé aux administrateurs.', 'Accès refusé', '/icones/annuler.png');
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
          showAlert('Accès refusé. Réservé aux administrateurs.', 'Accès refusé', '/icones/annuler.png');
          router.push('/');
          return;
        }

        if (productResponse.status === 404) {
          showAlert('Produit non trouvé', 'Erreur', '/icones/annuler.png');
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
            stock: product.stock.toString(), // Convertir en string pour l'input
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, productId]); // Retirer showAlert pour éviter les re-renders

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
      const token = getAccessToken();
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
        showAlert('Image ajoutée avec succès !', 'Succès', '/icones/validation.png');
        // Ajouter la nouvelle image à la liste
        setProductImages([...productImages, data.image]);
        // Réinitialiser la sélection
        setSelectedFile(null);
        setPreviewUrl('');
        setSuccess('');
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
    // Confirmer la suppression avec Modal
    showConfirm(
      'Voulez-vous vraiment supprimer cette image ?',
      async () => {
        try {
          const token = getAccessToken();
          if (!token) {
            showAlert('Vous devez être connecté', 'Authentification requise', '/icones/annuler.png');
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
            showAlert('Image supprimée avec succès !', 'Succès', '/icones/validation.png');
            // Retirer l'image de la liste
            setProductImages(productImages.filter(img => img.id !== imageId));
            setSuccess('');
          } else {
            setError(data.message || 'Erreur lors de la suppression de l\'image');
          }
        } catch (err) {
          console.error('Erreur:', err);
          setError('Erreur de connexion au serveur');
        }
      },
      'Supprimer l\'image',
      '/icones/trash.png'
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const token = getAccessToken();
      if (!token) {
        showAlert('Vous devez être connecté', 'Authentification requise', '/icones/annuler.png');
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
        showAlert('Accès refusé. Réservé aux administrateurs.', 'Accès refusé', '/icones/annuler.png');
        router.push('/');
        return;
      }

      const data = await response.json();

      if (data.success) {
        showAlert('Produit modifié avec succès !', 'Succès', '/icones/validation.png');
        setTimeout(() => {
          router.push('/admin/produits');
        }, 2000);
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

          {/* SECTION GESTION DES IMAGES */}
          <div className="form-group image-management-section">
            <h3 className="image-section-title">
              <Image src="/icones/camera.png" alt="" width={24} height={24} className="image-section-icon" />
              Gestion des images du produit
            </h3>

            {/* IMAGES EXISTANTES */}
            {productImages.length > 0 && (
              <div className="images-current-section">
                <h4 className="images-current-title">
                  Images actuelles ({productImages.length})
                </h4>
                <div className="images-grid">
                  {productImages.map((image) => (
                    <div key={image.id} className="image-card">
                      <Image
                        src={image.url}
                        alt={image.altText || 'Image produit'}
                        width={150}
                        height={150}
                        className="image-card-img"
                      />
                      {image.isPrimary && (
                        <div className="image-primary-badge">
                          Principale
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleImageDelete(image.id)}
                        className="image-delete-btn"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AJOUTER UNE NOUVELLE IMAGE */}
            <div className="image-upload-section">
              <h4 className="image-upload-title">
                Ajouter une nouvelle image
              </h4>

              {/* INPUT FILE */}
              <div className="image-upload-input-wrapper">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="image-upload-input"
                />
                <small className="image-upload-hint">
                  Formats acceptés: JPG, PNG, WEBP, GIF • Taille max: 5 MB
                </small>
              </div>

              {/* PREVIEW DE L'IMAGE SÉLECTIONNÉE */}
              {previewUrl && (
                <div className="image-preview-section">
                  <p className="image-preview-label">Aperçu :</p>
                  <Image
                    src={previewUrl}
                    alt="Aperçu"
                    width={200}
                    height={200}
                    className="image-preview-img"
                  />
                </div>
              )}

              {/* BOUTON D'UPLOAD */}
              <button
                type="button"
                onClick={handleImageUpload}
                disabled={!selectedFile || uploading}
                className="admin-btn admin-btn-primary image-upload-btn-full"
              >
                <Image 
                  src="/icones/validation.png" 
                  alt="" 
                  width={20} 
                  height={20} 
                  className="btn-icon-inline"
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
              <Image src="/icones/validation.png" alt="" width={20} height={20} className="btn-icon-inline" />
              {submitting ? 'Modification en cours...' : 'Enregistrer les modifications'}
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => router.push('/admin/produits')}
            >
              <Image src="/icones/trash.png" alt="" width={20} height={20} className="btn-icon-inline" />
              Annuler
            </button>
          </div>
        </form>
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