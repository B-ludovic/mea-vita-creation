import Image from 'next/image';
import OptimizedImage from '../../components/OptimizedImage';
import '../../styles/Apropos.css';

export const metadata = {
  title: 'À Propos - Mea Vita Création',
  description: 'L\'art de la maroquinerie africaine - Notre histoire, nos valeurs et notre processus de création',
};

export default function AProposPage() {
  return (
    <>
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-content">
            <h1>Notre Histoire</h1>
            <p>L&apos;art de la maroquinerie africaine</p>
          </div>
        </div>
      </section>

      <section className="brand-story">
        <div className="container">
          <div className="story-content">
            <div className="story-text">
              <h2>L&apos;Art de Mea Vita Création</h2>
              <p>
                Mea Vita Création est le mariage entre le cuir, le Wax et le bois. 
                Des produits fait main, réalisés par un artisan indépendant marocain avec matières recyclées.
              </p>
              <p>
                Du Hêtre pour créer la structure du sac, du Cuir provenant d&apos;une collecte de matières premières recyclées, 
                du Wax pour son dynamisme et ses explosions de couleur. Pour Elle et pour Lui, 
                chacun peut s&apos;y retrouver à travers des sacs uniques en leur genre.
              </p>
            </div>
            <div className="story-bio">
              <div className="bio-card">
                <h3>
                  <Image 
                    src="/icones/philosophie.png" 
                    alt="Notre Philosophie" 
                    width={40} 
                    height={40}
                    className="bio-icon"
                  />
                  Notre Philosophie
                </h3>
                <p>
                  Mea Vita Création est le mariage entre le cuir, le Wax et le bois. 
                  Des produits fait main, réalisés par un artisan indépendant marocain avec matières recyclées. 
                  Du Hêtre pour créer la structure du sac Du Cuir provenant d&apos;une collecte de matières premières recyclées. 
                  Du Wax pour son dynamisme et ses explosions de couleur. Pour Elle et pour Lui, 
                  chacun peut s&apos;y retrouver à travers des sacs uniques en leur genre.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="values-section">
        <div className="container">
          <h2>Nos Valeurs</h2>
          <div className="values-grid">
            <div className="value-item">
              <div className="value-icon">
                <Image 
                  src="/icones/authenticite.png" 
                  alt="Authenticité" 
                  width={80} 
                  height={80}
                />
              </div>
              <h3>Authenticité</h3>
              <p>
                Nous privilégions les matériaux authentiques et les techniques traditionnelles 
                pour créer des pièces uniques et durables.
              </p>
            </div>
            <div className="value-item">
              <div className="value-icon">
                <Image 
                  src="/icones/artisanat.png" 
                  alt="Artisanat" 
                  width={80} 
                  height={80}
                />
              </div>
              <h3>Artisanat</h3>
              <p>
                Chaque sac est confectionné à la main par nos artisans passionnés, 
                garantissant une qualité et un soin incomparables.
              </p>
            </div>
            <div className="value-item">
              <div className="value-icon">
                <Image 
                  src="/icones/heritage.png" 
                  alt="Héritage" 
                  width={80} 
                  height={80}
                />
              </div>
              <h3>Héritage</h3>
              <p>
                Nous célébrons et perpétuons la richesse culturelle africaine 
                à travers nos créations contemporaines.
              </p>
            </div>
            <div className="value-item">
              <div className="value-icon">
                <Image 
                  src="/icones/excellence.png" 
                  alt="Excellence" 
                  width={80} 
                  height={80}
                />
              </div>
              <h3>Excellence</h3>
              <p>
                Notre engagement vers l&apos;excellence nous pousse à perfectionner 
                chaque détail de nos créations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="process-section">
        <div className="container">
          <h2>Notre Processus de Création</h2>
          <div className="process-steps">
            
            <div className="process-step">
              <div className="materials-info">
                <div className="material-card">
                  <h4>
                    <Image 
                      src="/icones/recycle.png" 
                      alt="Cuir Recyclé" 
                      width={30} 
                      height={30}
                      className="material-icon"
                    />
                    Cuir Recyclé
                  </h4>
                  <p>
                    Provenant d&apos;une collecte de matière première. 
                    Mea Vita leur offre une seconde vie avec leurs vécu et leurs défauts.
                  </p>
                </div>
                <div className="material-card">
                  <h4>
                    <Image 
                      src="/icones/tree.png" 
                      alt="Bois de Hêtre" 
                      width={30} 
                      height={30}
                      className="material-icon"
                    />
                    Bois de Hêtre
                  </h4>
                  <p>
                    Du hêtre de bonne qualité totalement recyclé provenant de chute destinée à la destruction.
                  </p>
                </div>
                <div className="material-card">
                  <h4>
                    <Image 
                      src="/icones/tissus_wax.png" 
                      alt="Tissus Wax" 
                      width={30} 
                      height={30}
                      className="material-icon"
                    />
                    Tissus Wax
                  </h4>
                  <p>
                    Chiné dans les petits marchés du Benin par une collaboratrice sur place 
                    afin de trouver les petites pépites du moment.
                  </p>
                </div>
              </div>
              <div className="step-content">
                <div className="step-number">01</div>
                <h3>Sélection des Matériaux</h3>
                <p>
                  Nous choisissons avec soin les matériaux recyclés et récupérés, 
                  en privilégiant la qualité et l&apos;histoire de chaque élément.
                </p>
              </div>
            </div>
            
            <div className="process-step reverse">
              <div className="step-content">
                <div className="step-number">02</div>
                <h3>Design et Conception</h3>
                <p>
                  Nos designers créent des modèles uniques en s&apos;inspirant des motifs traditionnels 
                  et des tendances contemporaines, en intégrant harmonieusement le bois, le cuir et le wax.
                </p>
              </div>
              <div className="step-image">
                <OptimizedImage 
                  src="/images/sac-u/arche-besace-fogo-2.jpg" 
                  alt="Design et conception" 
                  size="medium"
                  context="detail"
                  width={500} 
                  height={300}
                  className="process-img"
                />
              </div>
            </div>
            
            <div className="process-step">
              <div className="step-image">
                <OptimizedImage 
                  src="/images/sac-u/arche-besace-fogo-1.jpg" 
                  alt="Confection artisanale" 
                  size="medium"
                  context="detail"
                  width={500} 
                  height={300}
                  className="process-img"
                />
              </div>
              <div className="step-content">
                <div className="step-number">03</div>
                <h3>Confection Artisanale</h3>
                <p>
                  Nos maîtres artisans donnent vie à chaque création avec un savoir-faire transmis de génération en génération, 
                  alliant tradition marocaine et innovation.
                </p>
              </div>
            </div>
            
            <div className="process-step reverse">
              <div className="step-content">
                <div className="step-number">04</div>
                <h3>Finitions d&apos;Exception</h3>
                <p>
                  Chaque détail est soigneusement vérifié et perfectionné pour garantir 
                  une qualité irréprochable et une durabilité exceptionnelle.
                </p>
              </div>
              <div className="step-image">
                <OptimizedImage 
                  src="/images/sac-cylindre/tambour-amethyste-2.jpg" 
                  alt="Finitions d'exception" 
                  size="medium"
                  context="detail"
                  width={500} 
                  height={300}
                  className="process-img"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <h2>Notre Mission</h2>
            <div className="mission-text">
              <p>
                Chez Mea Vita Création, nous nous engageons à préserver et célébrer l&apos;art traditionnel africain 
                tout en créant des pièces modernes et fonctionnelles. Notre mission est de faire découvrir au monde 
                la beauté et la richesse de l&apos;artisanat africain à travers des créations d&apos;exception.
              </p>
              <p>
                Nous croyons que chaque sac raconte une histoire, porte une culture et transmet des valeurs. 
                C&apos;est pourquoi nous mettons un point d&apos;honneur à collaborer avec des artisans locaux 
                et à respecter les traditions ancestrales.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
