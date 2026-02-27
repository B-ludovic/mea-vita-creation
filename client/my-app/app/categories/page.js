// Directive pour indiquer que c'est un composant client
'use client';

// Import des hooks React
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Import du CSS dédié à la page liste des catégories
import '../../styles/Categories.css';

export default function CategoriesPage() {
  // État pour stocker les catégories
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // useEffect s'exécute quand la page se charge
  useEffect(() => {
    // Fonction pour récupérer les catégories depuis l'API
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
        const data = await response.json();

        if (data.success) {
          setCategories(data.categories);
        } else {
          setError('Impossible de charger les catégories');
        }
      } catch (err) {
        setError('Erreur de connexion au serveur');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const CATEGORY_CONFIG = {
    'pochettes-unisexe': { image: '/images/pochettes-unisexe/atlas-fogo-1.jpg',     className: 'pochettes' },
    'porte-cartes':      { image: '/images/porte-cartes/eclat-amethyste-1.jpg',      className: 'porte-cartes' },
    'sacs-cylindre':     { image: '/images/sacs-cylindre/tambour-amethyste-1.jpg',   className: 'sacs-cylindre' },
    'sacs-u':            { image: '/images/sacs-u/arche-besace-fogo-1.jpg',           className: 'sacs-u' },
  };

  const getCategoryConfig = (slug) =>
    CATEGORY_CONFIG[slug] ?? { image: '/images/pochettes-unisexe/atlas-fogo-1.jpg', className: 'pochettes' };

  // Si en cours de chargement
  if (loading) {
    return (
      <>
        <section className="categories-hero">
          <div className="container">
            <div className="categories-hero-content">
              <h1>Nos Catégories</h1>
              <p>Découvrez nos quatre collections uniques</p>
            </div>
          </div>
        </section>
        <section className="categories-section">
          <div className="container">
            <div className="categories-grid">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-image" />
                  <div className="skeleton-info">
                    <div className="skeleton-line short" />
                    <div className="skeleton-line long" />
                    <div className="skeleton-line long" />
                    <div className="skeleton-line short" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }

  // Si erreur
  if (error) {
    return (
      <div className="container categories-error">
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <>
      {/* Section Hero - Bannière du haut */}
      <section className="categories-hero">
        <div className="container">
          <div className="categories-hero-content">
            <h1>Nos Catégories</h1>
            <p>Découvrez nos quatre collections uniques</p>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="container">
          <div className="categories-grid">
            {categories.map((category) => {
              const { image } = getCategoryConfig(category.slug);
              return (
              <Link href={`/categories/${category.slug}`} key={category.id} className="category-card">
                <div className="category-image">
                  <Image
                    src={image}
                    alt={category.name}
                    width={300}
                    height={300}
                    className="category-img"
                    priority
                  />
                </div>
                <div className="category-info">
                  <h3>
                    <Image
                      src="/Logo_Francois_sansfond.PNG"
                      alt="Logo"
                      width={30}
                      height={30}
                      className="category-logo-icon"
                    />
                    {category.name}
                  </h3>
                  <p>{category.description}</p>
                  <span className="category-link-text">
                    Découvrir
                    <Image
                      src="/icones/arrow.png"
                      alt=""
                      width={16}
                      height={16}
                      className="category-arrow-icon"
                    />
                  </span>
                </div>
              </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}