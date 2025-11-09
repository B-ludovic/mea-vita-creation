// Page Admin - Gestion des produits
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProducts = async () => {
    try {
      // Récupérer le token depuis localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Vous devez être connecté');
        router.push('/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
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
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  const handleStockUpdate = async (productId, newStock) => {
    try {
      // Cette route n'existe pas encore, on pourrait la créer si besoin
      console.log('Mettre à jour le stock:', productId, newStock);
      alert('Fonctionnalité à implémenter : mise à jour du stock');
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async (productId, productName) => {
    // Demander confirmation avant suppression
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${productName}" ?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Vous devez être connecté');
        router.push('/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`, {
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
        alert('Produit supprimé avec succès !');
        // Recharger la liste des produits
        fetchProducts();
      } else {
        alert(data.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression du produit');
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
        <h1>Gestion des produits</h1>
        <p>{products.length} produit{products.length > 1 ? 's' : ''} au catalogue</p>
      </div>

      <div className="admin-table-container">
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, color: 'var(--text-dark)' }}>Liste des produits</h2>
          <button 
            className="admin-btn admin-btn-primary"
            onClick={() => router.push('/admin/produits/ajouter')}
          >
            <Image src="/validation.png" alt="" width={16} height={16} style={{ display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }} />
            Ajouter un produit
          </button>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Prix</th>
              <th>Stock</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  {product.ProductImage && product.ProductImage.length > 0 ? (
                    <Image 
                      src={product.ProductImage[0].url} 
                      alt={product.name}
                      width={60}
                      height={60}
                      style={{
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: 'var(--light-beige)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Image src="/shopping.png" alt="Produit" width={30} height={30} />
                    </div>
                  )}
                </td>
                <td>
                  <div>
                    <strong>{product.name}</strong>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '4px' }}>
                      {product.slug}
                    </div>
                  </div>
                </td>
                <td>{product.Category.name}</td>
                <td>
                  <strong style={{ color: 'var(--primary-orange)' }}>
                    {product.price.toFixed(2)}€
                  </strong>
                </td>
                <td>
                  <span className={`badge ${product.stock === 0 ? 'danger' : product.stock < 3 ? 'warning' : 'success'}`}>
                    {product.stock} en stock
                  </span>
                </td>
                <td>
                  <span className={`badge ${product.isActive ? 'success' : 'danger'}`}>
                    {product.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      className="admin-btn admin-btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                      onClick={() => router.push(`/admin/produits/modifier/${product.id}`)}
                    >
                      <Image src="/modify.png" alt="" width={14} height={14} style={{ display: 'inline-block', marginRight: '4px', verticalAlign: 'middle' }} />
                      Modifier
                    </button>
                    <button 
                      className="admin-btn admin-btn-danger"
                      style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                      onClick={() => handleDelete(product.id, product.name)}
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