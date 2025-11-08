// Directive pour indiquer que c'est un composant client
'use client';

// Import des hooks React
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
// Import du contexte panier
import { useCart } from '../../../contexts/CartContext';
// Import du carrousel
import ProductCarousel from '../../../components/ProductCarousel';
// Import de la configuration des images
import { getProductImages, getCategoryImages } from '../../../config/productImages';

// Import du CSS
import '../../../styles/Product.css';

export default function ProductPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug;
    // Utiliser le contexte du panier
    const { addToCart } = useCart();

    // États
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [productImages, setProductImages] = useState([]);

    // Charger le produit
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:5002/api/products/${slug}`);
                const data = await response.json();

                if (data.success) {
                    setProduct(data.product);
                    
                    // Obtenir les images spécifiques du produit
                    const images = getProductImages(data.product.slug);
                    
                    // Si pas d'images spécifiques, utiliser les images de la catégorie
                    if (images.length === 0) {
                        const categoryImages = getCategoryImages(data.product.Category.slug);
                        setProductImages(categoryImages);
                    } else {
                        setProductImages(images);
                    }
                } else {
                    setError('Produit non trouvé');
                }
            } catch (err) {
                setError('Erreur de connexion au serveur');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    // Fonction pour ajouter au panier
    const handleAddToCart = () => {
        addToCart(product, quantity);
        alert(`✅ ${quantity} x ${product.name} ajouté(s) au panier !`);
    };

    // Si en cours de chargement
    if (loading) {
        return (
            <div className="container" style={{ paddingTop: '2rem', textAlign: 'center' }}>
                <h2>Chargement...</h2>
            </div>
        );
    }

    // Si erreur
    if (error || !product) {
        return (
            <div className="container" style={{ paddingTop: '2rem', textAlign: 'center' }}>
                <h2 style={{ color: 'var(--primary-orange)' }}>{error || 'Produit non trouvé'}</h2>
                <Link href="/categories" className="btn-secondary" style={{ marginTop: '2rem' }}>
                    Retour aux catégories
                </Link>
            </div>
        );
    }

    return (
        <div className="product-detail-container">
            <div className="container">
                <Link href={`/categories/${product.Category.slug}`} className="back-link">
                    ← Retour à {product.Category.name}
                </Link>

                <div className="product-detail">
                    {/* Section Image avec Carrousel */}
                    <div className="product-image-section">
                        <ProductCarousel 
                            images={productImages}
                            productName={product.name}
                            categorySlug={product.Category.slug}
                        />
                    </div>

                    {/* Section Détails */}
                    <div className="product-details-section">
                        <span className="product-category-badge">
                            {product.Category.name}
                        </span>

                        <h1 className="product-title">{product.name}</h1>

                        <div className="product-price-display">
                            {product.price.toFixed(2)}€
                        </div>

                        <p className="product-description">
                            {product.description}
                        </p>

                        {/* Stock */}
                        <div className={`product-stock ${product.stock < 5 ? 'low' : ''} ${product.stock === 0 ? 'out' : ''}`}>
                            {product.stock === 0 ? 'Rupture de stock' :
                                product.stock < 5 ? `Plus que ${product.stock} en stock !` :
                                    `En stock (${product.stock} disponibles)`}
                        </div>

                        {/* Actions */}
                        {product.stock > 0 && (
                            <div className="product-actions">
                                <div className="quantity-selector">
                                    <label htmlFor="quantity">Quantité :</label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        min="1"
                                        max={product.stock}
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                                    />
                                </div>

                                <button
                                    className="add-to-cart-btn"
                                    onClick={handleAddToCart}
                                >
                                    Ajouter au panier
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}