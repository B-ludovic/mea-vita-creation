// Directive pour indiquer que c'est un composant client
'use client';

// Import des hooks React
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Import du CSS (on réutilise le CSS de la page d'accueil)
import '../../styles/Home.css';

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

  // Fonction pour déterminer la classe CSS selon le slug
  const getCategoryClass = (slug) => {
    if (slug === 'pochettes-unisexe') return 'pochettes';
    if (slug === 'porte-carte') return 'portes-carte';
    if (slug === 'sac-cylindre') return 'sac-cylindre';
    if (slug === 'sac-u') return 'sac-u';
    return 'pochettes'; // Par défaut
  };

  // Fonction pour déterminer l'image selon le slug
  const getCategoryImage = (slug) => {
    if (slug === 'pochettes-unisexe') return '/images/pochettes-unisexe/atlas-fogo-1.jpg';
    if (slug === 'porte-carte') return '/images/porte-carte/eclat-amethyste-1.jpg';
    if (slug === 'sac-cylindre') return '/images/sac-cylindre/tambour-amethyste-1.jpg';
    if (slug === 'sac-u') return '/images/sac-u/arche-besace-fogo-1.jpg';
    return '/images/pochettes-unisexe/atlas-fogo-1.jpg'; // Par défaut
  };

  // Si en cours de chargement
  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '2rem', textAlign: 'center' }}>
        <h2>Chargement des catégories...</h2>
      </div>
    );
  }

  // Si erreur
  if (error) {
    return (
      <div className="container" style={{ paddingTop: '2rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--primary-orange)' }}>{error}</h2>
      </div>
    );
  }

  return (
    <section className="categories-section" style={{ paddingTop: '2rem' }}>
      <div className="container">
        <h1>Nos Catégories</h1>
        <p className="section-subtitle">
          Découvrez nos quatre collections uniques
        </p>

        <div className="categories-grid">
          {categories.map((category) => (
            <div key={category.id} className="category-card">
              <div className="category-image">
                <Image
                  src={getCategoryImage(category.slug)}
                  alt={category.name}
                  width={300}
                  height={300}
                  className="category-img"
                  priority
                />
              </div>
              <div className="category-info">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <Link href={`/categories/${category.slug}`} className="category-link">
                  Découvrir →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}