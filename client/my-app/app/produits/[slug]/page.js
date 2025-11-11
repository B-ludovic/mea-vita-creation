// Directive pour indiquer que c'est un composant client
'use client';

// Import des hooks React
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
// Import du contexte panier
import { useCart } from '../../../contexts/CartContext';
// Import du carrousel
import ProductCarousel from '../../../components/ProductCarousel';
// Import de la configuration des images
import { getProductImages, getCategoryImages } from '../../../config/productImages';
// Import du Modal
import Modal from '../../../components/Modal';
import { useModal } from '../../../hooks/useModal';

// Import du CSS
import '../../../styles/Product.css';

export default function ProductPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug;
    // Utiliser le contexte du panier
    const { addToCart, setAlertCallback, cart } = useCart();
    // Utiliser le hook modal
    const { modalState, showAlert, closeModal } = useModal();

    // Enregistrer la fonction showAlert dans le CartContext pour les alertes de stock
    useEffect(() => {
        setAlertCallback(() => showAlert);
        // Nettoyer au démontage du composant
        return () => setAlertCallback(null);
    }, [setAlertCallback, showAlert]);

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
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${slug}`);
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
        // addToCart retourne true si réussi, false sinon
        const success = addToCart(product, quantity);
        
        // Afficher le modal de succès UNIQUEMENT si l'ajout a réussi
        if (success) {
            showAlert(
                `${quantity} x ${product.name} ajouté(s) au panier !`,
                'Produit ajouté',
                '/validation.png'
            );
            
            // Remettre la quantité à 1
            setQuantity(1);
        }
        // Sinon, l'alerte d'erreur a déjà été affichée par addToCart()
    };

    // CALCUL DU STOCK DISPONIBLE RÉEL
    // Prendre en compte la quantité déjà dans le panier
    const getAvailableStock = () => {
        if (!product) return 0;
        
        // Trouver le produit dans le panier
        const cartItem = cart.find(item => item.id === product.id);
        
        // Stock disponible = stock total - quantité déjà dans le panier
        const availableStock = product.stock - (cartItem ? cartItem.quantity : 0);
        
        return Math.max(0, availableStock); // Ne jamais retourner un nombre négatif
    };

    // Stock disponible pour l'affichage et les actions
    const availableStock = getAvailableStock();

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
                        {product.ProductImage && product.ProductImage.length > 0 ? (
                            <ProductCarousel 
                                images={product.ProductImage.map(img => img.url)}
                                productName={product.name}
                                categorySlug={product.Category.slug}
                            />
                        ) : (
                            <ProductCarousel 
                                images={productImages}
                                productName={product.name}
                                categorySlug={product.Category.slug}
                            />
                        )}
                    </div>

                    {/* Section Détails */}
                    <div className="product-details-section">
                        <span className="product-category-badge">
                            {product.Category.name}
                        </span>

                        <h1 className="product-title">
                            <Image 
                                src="/Logo_Francois_sansfond.PNG" 
                                alt="Logo" 
                                width={35} 
                                height={35} 
                                style={{ display: 'inline-block', marginRight: '12px', verticalAlign: 'middle' }} 
                            />
                            {product.name}
                        </h1>

                        <div className="product-price-display">
                            {product.price.toFixed(2)}€
                        </div>

                        <p className="product-description">
                            {product.description}
                        </p>

                        {/* Stock - affichage basé sur le stock disponible réel */}
                        <div className={`product-stock ${availableStock < 5 ? 'low' : ''} ${availableStock === 0 ? 'out' : ''}`}>
                            {availableStock === 0 ? 'Rupture de stock' :
                                availableStock < 5 ? `Plus que ${availableStock} en stock !` :
                                    `En stock (${availableStock} disponibles)`}
                        </div>

                        {/* Actions - affichage basé sur le stock disponible réel */}
                        {availableStock > 0 && (
                            <div className="product-actions">
                                <div className="quantity-selector">
                                    <label htmlFor="quantity">Quantité :</label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        min="1"
                                        max={availableStock}
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, Math.min(availableStock, parseInt(e.target.value) || 1)))}
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

            {/* Modal pour les notifications */}
            <Modal
                isOpen={modalState.isOpen}
                title={modalState.title}
                message={modalState.message}
                icon={modalState.icon}
                onConfirm={modalState.onConfirm}
                onCancel={modalState.onCancel}
                confirmText={modalState.confirmText}
                cancelText={modalState.cancelText}
                showCancelButton={modalState.showCancelButton}
            />
        </div>
    );
}