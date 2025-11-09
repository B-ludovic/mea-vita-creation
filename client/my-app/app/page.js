// Import du CSS pour la page d'accueil
import '../styles/Home.css';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
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

          <div className="categories-grid">
            {/* Catégorie 1 : Pochettes Unisexe */}
            <div className="category-card">
              <div className="category-image">
                <Image 
                  src="/images/pochettes-unisexe/IMG_6081.JPG" 
                  alt="Pochettes Unisexe" 
                  width={400} 
                  height={300}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              </div>
              <div className="category-info">
                <h3>Pochettes Unisexe</h3>
                <p>
                  Élégantes et pratiques, nos pochettes s'adaptent à tous les styles. 
                  Parfaites pour vos essentiels du quotidien.
                </p>
                <Link href="/categories/pochettes-unisexe" className="category-link">
                  Découvrir →
                </Link>
              </div>
            </div>

            {/* Catégorie 2 : Porte-Carte */}
            <div className="category-card">
              <div className="category-image">
                <Image 
                  src="/images/porte-carte/IMG_6175.JPG" 
                  alt="Porte-Carte" 
                  width={400} 
                  height={300}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              </div>
              <div className="category-info">
                <h3>Porte-Carte</h3>
                <p>
                  Compacts et raffinés, nos porte-cartes allient minimalisme et élégance. 
                  L'accessoire essentiel pour vos cartes.
                </p>
                <Link href="/categories/porte-carte" className="category-link">
                  Découvrir →
                </Link>
              </div>
            </div>

            {/* Catégorie 3 : Sac Cylindre */}
            <div className="category-card">
              <div className="category-image">
                <Image 
                  src="/images/sac-cylindre/IMG_5654.JPG" 
                  alt="Sac Cylindre" 
                  width={400} 
                  height={300}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              </div>
              <div className="category-info">
                <h3>Sac Cylindre</h3>
                <p>
                  Design unique et original, nos sacs cylindres se démarquent par leur forme distinctive. 
                  L'audace faite accessoire.
                </p>
                <Link href="/categories/sac-cylindre" className="category-link">
                  Découvrir →
                </Link>
              </div>
            </div>

            {/* Catégorie 4 : Sac U */}
            <div className="category-card">
              <div className="category-image">
                <Image 
                  src="/images/sac-u/IMG_5133.JPG" 
                  alt="Sac U" 
                  width={400} 
                  height={300}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              </div>
              <div className="category-info">
                <h3>Sac U</h3>
                <p>
                  Spacieux et élégant, le sac U est parfait pour toutes les occasions. 
                  Votre compagnon idéal au quotidien.
                </p>
                <Link href="/categories/sac-u" className="category-link">
                  Découvrir →
                </Link>
              </div>
            </div>
          </div>
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
              <Image src="/qualite.png" alt="Qualité" width={24} height={24} style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />
              Cuirs sélectionnés pour leur qualité exceptionnelle
            </li>
            <li>
              <Image src="/tissus_wax.png" alt="Tissus Wax" width={24} height={24} style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />
              Tissus wax authentiques aux motifs uniques
            </li>
            <li>
              <Image src="/confection.png" alt="Confection" width={24} height={24} style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />
              Confection entièrement manuelle
            </li>
            <li>
              <Image src="/finition_luxe.png" alt="Finitions" width={24} height={24} style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />
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