// Directive pour indiquer que c'est un composant client
'use client';

// Import des hooks React
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Image from 'next/image';
// Import de la configuration des images
import { getProductMainImage, getCategoryImages } from '../../../config/productImages';

// Import du CSS
import '../../../styles/Category.css';

export default function CategoryPage() {
  // Récupérer le slug depuis l'URL (ex: "pochettes-unisexe")
  const params = useParams();
  const slug = params.slug;

  // États
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fonction pour obtenir l'image d'un produit
  const getProductImageForDisplay = (product, index) => {
    // Essayer d'obtenir l'image principale du produit
    const mainImage = getProductMainImage(product.slug);
    
    if (mainImage) {
      return mainImage;
    }
    
    // Sinon, utiliser les images de la catégorie avec rotation
    const categoryImages = getCategoryImages(slug);
    return categoryImages[index % categoryImages.length] || categoryImages[0];
  };

  // Charger la catégorie et ses produits
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les informations de la catégorie
        const categoryResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/${slug}`);
        const categoryData = await categoryResponse.json();

        if (!categoryData.success) {
          setError('Catégorie non trouvée');
          setLoading(false);
          return;
        }

        setCategory(categoryData.category);

        // 2. Récupérer les produits de cette catégorie
        const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/category/${slug}`);
        const productsData = await productsResponse.json();

        if (productsData.success) {
          setProducts(productsData.products);
        }

      } catch (err) {
        setError('Erreur de connexion au serveur');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // Si en cours de chargement
  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '2rem', textAlign: 'center' }}>
        <h2>Chargement...</h2>
      </div>
    );
  }

  // Si erreur
  if (error) {
    return (
      <div className="container" style={{ paddingTop: '2rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--primary-orange)' }}>{error}</h2>
        <Link href="/categories" className="btn-secondary" style={{ marginTop: '2rem' }}>
          Retour aux catégories
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Hero de la catégorie */}
      <section className="category-hero">
        <div className="container">
          <h1>{category.name}</h1>
          <p>{category.description}</p>
        </div>
      </section>

      {/* Liste des produits */}
      <section className="products-section">
        <div className="container">
          <h2>Nos {category.name}</h2>

          {products.length === 0 ? (
            // Si pas de produits
            <div className="empty-category">
              <h3>Produits à venir</h3>
              <p>
                Nous travaillons actuellement sur de nouvelles créations pour cette catégorie. 
                Revenez bientôt !
              </p>
              <Link href="/categories" className="btn-secondary">
                Découvrir nos autres catégories
              </Link>
            </div>
          ) : (
            // Afficher les produits
            <div className="products-grid">
              {products.map((product, index) => (
                <div key={product.id} className="product-card">
                  {/* Image du produit */}
                  <div className="product-image">
                    {product.ProductImage && product.ProductImage.length > 0 ? (
                      <Image 
                        src={product.ProductImage[0].url} 
                        alt={product.ProductImage[0].alt}
                        width={300}
                        height={300}
                        className="product-img"
                      />
                    ) : (
                      <Image
                        src={getProductImageForDisplay(product, index)}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="product-img"
                      />
                    )}
                  </div>
                  
                  <div className="product-info">
                    <h3>
                      <Image 
                        src="/Logo_Francois_sansfond.PNG" 
                        alt="Logo" 
                        width={24} 
                        height={24} 
                        style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} 
                      />
                      {product.name}
                    </h3>
                    <p>{product.description}</p>
                    <p className="product-price">{product.price.toFixed(2)}€</p>
                    <Link href={`/produits/${product.slug}`}>
                      <button className="product-btn">
                        Voir les détails
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}