'use client';

// Import du CSS pour la page d'accueil
import '../styles/Home.css';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
        const data = await response.json();
        if (data.success) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error('Erreur chargement catégories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  return (
    <>
      {/* Section Hero */}
      <section className="hero">
        <div className="hero-content">
          <h2>Créations Artisanales d'Exception</h2>
          <h3>L'Art de la Maroquinerie Africaine</h3>
          <p>
            Découvrez notre univers unique où le cuir noble rencontre les tissus wax authentiques. 
            Chaque création raconte une histoire, chaque sac est une œuvre d'art portée.
          </p>
          <div className="hero-buttons">
            <a href="#categories" className="btn-primary">
              Découvrir nos créations
            </a>
            <Link href="/apropos" className="btn-secondary">
              Notre histoire
            </Link>
          </div>
        </div>
      </section>

      {/* Section Catégories avec Bannière */}
      <section className="categories-hero" id="categories">
        <div className="container">
          <div className="categories-hero-content">
            <h2>Nos Catégories</h2>
            <p>Quatre univers, une même passion pour l'excellence</p>
          </div>
        </div>
      </section>

      {/* Grille des Catégories */}
      <section className="categories-section">
        <div className="container">
          {loading ? (
            <p>Chargement des catégories...</p>
          ) : (
            <div className="categories-grid">
              {categories.map((category) => (
                <Link href={`/categories/${category.slug}`} key={category.id} className="category-card">
                  <div className="category-image">
                    <Image 
                      src={category.image || '/images/pochettes-unisexe/atlas-solaire-1.jpg'}
                      alt={category.name}
                      width={400} 
                      height={300}
                      className="category-img"
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                  </div>
                  <div className="category-info">
                    <h3>
                      <Image 
                        src="/Logo_Francois_sansfond.PNG" 
                        alt="Logo" 
                        width={30} 
                        height={30} 
                        className="category-icon"
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
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section Savoir-Faire */}
      <section className="craftsmanship-section">
        <div className="container">
          <h2>Savoir-Faire Artisanal</h2>
          <p>
            Chaque création Mea Vita Création naît de la rencontre entre tradition et innovation. 
            Nos artisans perpétuent des techniques ancestrales tout en intégrant des éléments de design contemporain.
          </p>
          <ul className="craft-features">
            <li>
              <Image src="/icones/qualite.png" alt="Qualité" width={24} height={24} className="craftsmanship-list-icon" />
              Cuirs sélectionnés pour leur qualité exceptionnelle
            </li>
            <li>
              <Image src="/icones/tissus_wax.png" alt="Tissus Wax" width={24} height={24} className="craftsmanship-list-icon" />
              Tissus wax authentiques aux motifs uniques
            </li>
            <li>
              <Image src="/icones/confection.png" alt="Confection" width={24} height={24} className="craftsmanship-list-icon" />
              Confection entièrement manuelle
            </li>
            <li>
              <Image src="/icones/finition_luxe.png" alt="Finitions" width={24} height={24} className="craftsmanship-list-icon" />
              Finitions de luxe et attention aux détails
            </li>
          </ul>
          <Link href="/apropos" className="btn-secondary">
            En savoir plus
          </Link>
        </div>
      </section>
    </>
  );
}