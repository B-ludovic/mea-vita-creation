// Directive pour indiquer que c'est un composant client
'use client';

// Import de la fonction pour structured data (JSON-LD)
import { generateProductJsonLd } from '../../../utils/metadata';

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

// Import du composant OptimizedImage
import OptimizedImage from '../../../components/OptimizedImage';

// Import du Modal
import Modal from '../../../components/Modal';
import { useModal } from '../../../hooks/useModal';

// Import du composant StarRating et du CSS des avis
import StarRating from '../../../components/StarRating';
import { getAccessToken } from '../../../utils/auth';
import '../../../styles/Reviews.css';
import '../../../styles/StarRating.css';

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

    // États pour les avis
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewForm, setReviewForm] = useState({
        rating: 5,
        comment: ''
    });
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [reviewError, setReviewError] = useState('');

    // États pour la wishlist
    const [inWishlist, setInWishlist] = useState(false);
    const [wishlistItemId, setWishlistItemId] = useState(null);

    // États pour la navigation entre produits
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [currentProductIndex, setCurrentProductIndex] = useState(-1);
    const [previousProduct, setPreviousProduct] = useState(null);
    const [nextProduct, setNextProduct] = useState(null);

    // Charger le produit et les avis
    useEffect(() => {
        const fetchData = async () => {
            // Réinitialiser tous les états de navigation
            setPreviousProduct(null);
            setNextProduct(null);
            setCategoryProducts([]);
            setCurrentProductIndex(-1);
            
            try {
                // Récupérer le produit
                const productResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${slug}`);
                const productData = await productResponse.json();

                if (productData.success) {
                    setProduct(productData.product);

                    // Récupérer tous les produits de la même catégorie pour la navigation
                    const categoryResponse = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/products?categoryId=${productData.product.categoryId}`
                    );
                    const categoryData = await categoryResponse.json();

                    if (categoryData.success) {
                        // Utiliser tous les produits de la catégorie (pas de filtrage par collection)
                        const products = categoryData.products;
                        
                        setCategoryProducts(products);

                        // Trouver l'index du produit actuel
                        const currentIndex = products.findIndex(p => p.slug === slug);
                        setCurrentProductIndex(currentIndex);

                        // Déterminer le produit précédent et suivant
                        if (currentIndex > 0) {
                            setPreviousProduct(products[currentIndex - 1]);
                        } else {
                            setPreviousProduct(null);
                        }
                        if (currentIndex < products.length - 1) {
                            setNextProduct(products[currentIndex + 1]);
                        } else {
                            setNextProduct(null);
                        }
                    }

                    // Obtenir les images spécifiques du produit
                    const images = getProductImages(productData.product.slug);

                    // Si pas d'images spécifiques, utiliser les images de la catégorie
                    if (images.length === 0) {
                        const categoryImages = getCategoryImages(productData.product.Category.slug);
                        setProductImages(categoryImages);
                    } else {
                        setProductImages(images);
                    }

                    // Récupérer les avis du produit
                    const reviewsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/product/${productData.product.id}`);
                    const reviewsData = await reviewsResponse.json();

                    if (reviewsData.success) {
                        setReviews(reviewsData.reviews);
                        setAverageRating(reviewsData.averageRating);
                        setTotalReviews(reviewsData.totalReviews);
                    }

                    // Vérifier si le produit est dans la wishlist
                    const token = getAccessToken();
                    if (token) {
                        try {
                            const wishlistResponse = await fetch(
                                `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/check?productId=${productData.product.id}`,
                                {
                                    headers: {
                                        'Authorization': `Bearer ${token}`,
                                        'Content-Type': 'application/json'
                                    }
                                }
                            );

                            const wishlistData = await wishlistResponse.json();

                            if (wishlistData.success) {
                                setInWishlist(wishlistData.inWishlist);
                                setWishlistItemId(wishlistData.wishlistItemId);
                            }
                        } catch (err) {
                            console.error('Erreur lors de la vérification wishlist:', err);
                        }
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

        fetchData();
    }, [slug]);

    // Mettre à jour le titre de la page dynamiquement
    useEffect(() => {
        if (product) {
            document.title = `${product.name} - Mea Vita Création`;
        }
    }, [product]);

    // Fonction pour gérer l'ajout/retrait de la wishlist
    const handleWishlistToggle = async () => {
        const token = getAccessToken();

        if (!token) {
            showAlert(
                'Vous devez être connecté pour ajouter des favoris',
                'Connexion requise',
                '/icones/error.png'
            );
            return;
        }

        try {
            if (inWishlist) {
                // Retirer de la wishlist
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/${wishlistItemId}`,
                    {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (response.ok) {
                    setInWishlist(false);
                    setWishlistItemId(null);
                    showAlert(
                        'Produit retiré de vos favoris',
                        'Favoris mis à jour',
                        '/icones/validation.png'
                    );
                }
            } else {
                // Ajouter à la wishlist
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ productId: product.id })
                    }
                );

                const data = await response.json();

                if (data.success) {
                    setInWishlist(true);
                    setWishlistItemId(data.wishlistItem.id);
                    showAlert(
                        'Produit ajouté à vos favoris',
                        'Favoris mis à jour',
                        '/icones/favori.png'
                    );
                }
            }
        } catch (error) {
            console.error('Erreur:', error);
            showAlert(
                'Erreur lors de la mise à jour des favoris',
                'Erreur',
                '/icones/error.png'
            );
        }
    };

    // Fonction pour ajouter au panier
    const handleAddToCart = () => {
        // addToCart retourne true si réussi, false sinon
        const success = addToCart(product, quantity);

        // Afficher le modal de succès UNIQUEMENT si l'ajout a réussi
        if (success) {
            showAlert(
                `${quantity} x ${product.name} ajouté(s) au panier !`,
                'Produit ajouté',
                '/icones/validation.png'
            );

            // Remettre la quantité à 1
            setQuantity(1);
        }
        // Sinon, l'alerte d'erreur a déjà été affichée par addToCart()
    };

// Fonction pour soumettre un avis
const handleReviewSubmit = async (e) => {
    e.preventDefault();

    // Vérifier si l'utilisateur est connecté
    const userData = localStorage.getItem('user');
    if (!userData) {
        showAlert(
            'Vous devez être connecté pour laisser un avis',
            'Connexion requise',
            '/icones/error.png'
        );
        return;
    }

    const user = JSON.parse(userData);
    setReviewSubmitting(true);
    setReviewError('');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAccessToken()}`
            },
            body: JSON.stringify({
                productId: product.id,
                userId: user.id,
                rating: reviewForm.rating,
                comment: reviewForm.comment
            })
        });

        const data = await response.json();

        if (data.success) {
            showAlert(
                'Votre avis a été soumis ! Il sera visible après modération.',
                'Avis envoyé',
                '/icones/validation.png'
            );
            setShowReviewForm(false);
            setReviewForm({ rating: 5, comment: '' });
        } else {
            setReviewError(data.message || 'Erreur lors de l\'envoi de l\'avis');
        }
    } catch (error) {
        setReviewError('Erreur de connexion au serveur');
    } finally {
        setReviewSubmitting(false);
    }
};

// Fonction pour formater la date
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
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
        <div className="container product-loading">
            <h2>Chargement...</h2>
        </div>
    );
}

// Si erreur
if (error || !product) {
    return (
        <div className="container product-error">
            <h2 className="product-error-title">{error || 'Produit non trouvé'}</h2>
            <Link href="/categories" className="btn-secondary product-error-link">
                Retour aux catégories
            </Link>
        </div>
    );
}

return (
    <div className="product-detail-container">
        {/* JSON-LD pour structured data */}
        {product && (
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(generateProductJsonLd(product))
                }}
            />
        )}
        
        {/* Boutons de navigation latérale */}
        {categoryProducts.length > 0 && previousProduct && (
            <Link 
                href={`/produits/${previousProduct.slug}`}
                className="product-nav-button product-nav-prev"
                title={`Voir ${previousProduct.name}`}
            >
                <Image 
                    src="/icones/next.png" 
                    alt="Précédent" 
                    width={20} 
                    height={20} 
                    className="nav-arrow"
                />
                <span className="nav-label">Produit précédent</span>
            </Link>
        )}

        {categoryProducts.length > 0 && nextProduct && (
            <Link 
                href={`/produits/${nextProduct.slug}`}
                className="product-nav-button product-nav-next"
                title={`Voir ${nextProduct.name}`}
            >
                <span className="nav-label">Produit suivant</span>
                <Image 
                    src="/icones/next.png" 
                    alt="Suivant" 
                    width={20} 
                    height={20} 
                    className="nav-arrow"
                />
            </Link>
        )}
        
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
                            className="product-title-logo"
                        />
                        {product.name}
                        <button
                            className="wishlist-btn"
                            onClick={handleWishlistToggle}
                            title={inWishlist ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                        >
                            <Image
                                src={inWishlist ? '/icones/favori.png' : '/icones/favori-empty.png'}
                                alt={inWishlist ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                                width={30}
                                height={30}
                            />
                        </button>
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

        {/* SECTION AVIS */}
        <div className="reviews-section">
            <div className="reviews-header">
                <h2>Avis clients</h2>

                <button
                    className="admin-btn admin-btn-primary"
                    onClick={() => setShowReviewForm(!showReviewForm)}
                >
                    <Image
                        src="/icones/user-rating.png"
                        alt="Laisser un avis"
                        width={20}
                        height={20}
                        className="review-icon"
                    />
                    Laisser un avis
                </button>

                {totalReviews > 0 && (
                    <div className="reviews-summary">
                        <div className="average-rating">{averageRating}</div>
                        <div className="rating-details">
                            <StarRating rating={Math.round(averageRating)} readonly size="medium" />
                            <div className="total-reviews">
                                Basé sur {totalReviews} avis
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Formulaire d'avis */}
            {showReviewForm && (
                <div className="review-form">
                    <h3>Votre avis</h3>
                    <form onSubmit={handleReviewSubmit}>
                        <div className="form-group-review">
                            <label>Votre note</label>
                            <StarRating
                                rating={reviewForm.rating}
                                onRatingChange={(rating) => setReviewForm({ ...reviewForm, rating })}
                                size="large"
                            />
                        </div>

                        <div className="form-group-review">
                            <label htmlFor="comment">Votre commentaire</label>
                            <textarea
                                id="comment"
                                value={reviewForm.comment}
                                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                placeholder="Partagez votre expérience avec ce produit..."
                                required
                            />
                        </div>

                        {reviewError && (
                            <p className="error-message">{reviewError}</p>
                        )}

                        <div className="review-form-actions">
                            <button
                                type="submit"
                                className="admin-btn admin-btn-primary"
                                disabled={reviewSubmitting}
                            >
                                {reviewSubmitting ? (
                                    'Envoi...'
                                ) : (
                                    <>
                                        <Image
                                            src="/icones/validation.png"
                                            alt="Publier"
                                            width={18}
                                            height={18}
                                            className="review-icon"
                                        />
                                        Publier mon avis
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                className="admin-btn admin-btn-secondary"
                                onClick={() => setShowReviewForm(false)}
                            >
                                Annuler
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Liste des avis */}
            <div className="reviews-list">
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review.id} className="review-card">
                            <div className="review-card-header">
                                <div className="review-author">
                                    <div className="review-author-name">
                                        {review.User.firstName} {review.User.lastName}
                                        <span className="verified-badge">
                                            <Image
                                                src="/icones/ok.png"
                                                alt="Vérifié"
                                                width={16}
                                                height={16}
                                                className="verified-icon"
                                            />
                                            Achat vérifié
                                        </span>
                                    </div>
                                    <div className="review-date">{formatDate(review.createdAt)}</div>
                                </div>
                                <StarRating rating={review.rating} readonly size="small" />
                            </div>
                            {review.comment && (
                                <p className="review-comment">{review.comment}</p>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="no-reviews">
                        <h3>Aucun avis pour le moment</h3>
                        <p>Soyez le premier à donner votre avis sur ce produit !</p>
                    </div>
                )}
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