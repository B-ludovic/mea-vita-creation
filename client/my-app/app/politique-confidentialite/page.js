// Page Politique de confidentialité
'use client';

import Image from 'next/image';
import Link from 'next/link';
import '../../styles/politique-confidentialite.css';

export default function PolitiqueConfidentialite() {
  return (
    <div className="politique-container">
      <div className="politique-content">
        <h1 className="politique-title">
          Politique de confidentialité
        </h1>
        <p className="politique-date">
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          })}
        </p>

        {/* Introduction */}
        <section className="politique-section">
          <h2>Introduction</h2>
          <p>
            Mea Vita Création s&apos;engage à protéger la vie privée de ses utilisateurs. 
            Cette politique de confidentialité explique comment nous collectons, utilisons 
            et protégeons vos données personnelles conformément au Règlement Général sur 
            la Protection des Données (RGPD).
          </p>
        </section>

        {/* Données collectées */}
        <section className="politique-section">
          <h2>1. Données collectées</h2>
          
          <h3>1.1 Données que vous nous fournissez</h3>
          <p>Lorsque vous créez un compte ou passez une commande, nous collectons :</p>
          <ul>
            <li>Nom et prénom</li>
            <li>Adresse email</li>
            <li>Adresse de livraison</li>
            <li>Numéro de téléphone (optionnel)</li>
            <li>Historique de commandes</li>
          </ul>

          <h3>1.2 Données collectées automatiquement</h3>
          <p>Nous utilisons Google Analytics pour améliorer notre site. Les données collectées incluent :</p>
          <ul>
            <li>Pages visitées</li>
            <li>Durée de visite</li>
            <li>Type d&apos;appareil et navigateur</li>
            <li>Adresse IP (anonymisée)</li>
            <li>Données de localisation approximative (ville, pays)</li>
          </ul>
        </section>

        {/* Cookies */}
        <section className="politique-section">
          <h2>2. Cookies et technologies similaires</h2>
          
          <h3>2.1 Cookies essentiels</h3>
          <p>Ces cookies sont nécessaires au fonctionnement du site :</p>
          <ul>
            <li><strong>Panier :</strong> Mémorisation de vos articles</li>
            <li><strong>Session :</strong> Maintien de votre connexion</li>
            <li><strong>Consentement :</strong> Mémorisation de vos préférences cookies</li>
          </ul>

          <h3>2.2 Cookies analytiques (Google Analytics)</h3>
          <p>Avec votre consentement, nous utilisons Google Analytics pour :</p>
          <ul>
            <li>Comprendre comment vous utilisez notre site</li>
            <li>Améliorer l&apos;expérience utilisateur</li>
            <li>Analyser le trafic et les tendances</li>
          </ul>
          <p>
            Vous pouvez refuser ces cookies à tout moment via le bouton
            <Image src="/icones/cookie.png" alt="cookies" width={20} height={20} className="cookie-icon-inline" />
            en bas à gauche de votre écran.
          </p>
        </section>

        {/* Utilisation des données */}
        <section className="politique-section">
          <h2>3. Utilisation de vos données</h2>
          <p>Nous utilisons vos données pour :</p>
          <ul>
            <li>Traiter et livrer vos commandes</li>
            <li>Vous envoyer des confirmations de commande et mises à jour de livraison</li>
            <li>Gérer votre compte client</li>
            <li>Améliorer nos produits et services</li>
            <li>Répondre à vos questions via le formulaire de contact</li>
            <li>Respecter nos obligations légales</li>
          </ul>
        </section>

        {/* Partage des données */}
        <section className="politique-section">
          <h2>4. Partage de vos données</h2>
          <p>Nous ne vendons jamais vos données personnelles. Nous les partageons uniquement avec :</p>
          <ul>
            <li><strong>Stripe :</strong> Pour le traitement sécurisé des paiements</li>
            <li><strong>Transporteurs :</strong> Pour la livraison de vos commandes</li>
            <li><strong>Google Analytics :</strong> Pour les statistiques anonymisées (avec votre consentement)</li>
          </ul>
        </section>

        {/* Conservation des données */}
        <section className="politique-section">
          <h2>5. Conservation des données</h2>
          <p>Nous conservons vos données personnelles :</p>
          <ul>
            <li><strong>Compte client :</strong> Jusqu&apos;à la suppression de votre compte</li>
            <li><strong>Commandes :</strong> 10 ans (obligation légale comptable)</li>
            <li><strong>Cookies Analytics :</strong> 14 mois maximum</li>
          </ul>
        </section>

        {/* Vos droits RGPD */}
        <section className="politique-section">
          <h2>6. Vos droits (RGPD)</h2>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul>
            <li><strong>Droit d&apos;accès :</strong> Obtenir une copie de vos données</li>
            <li><strong>Droit de rectification :</strong> Corriger vos données inexactes</li>
            <li><strong>Droit à l&apos;effacement :</strong> Supprimer vos données</li>
            <li><strong>Droit à la limitation :</strong> Limiter le traitement de vos données</li>
            <li><strong>Droit à la portabilité :</strong> Recevoir vos données dans un format structuré</li>
            <li><strong>Droit d&apos;opposition :</strong> Vous opposer au traitement de vos données</li>
            <li><strong>Droit de retrait du consentement :</strong> Retirer votre consentement aux cookies</li>
          </ul>
          <p>
            Pour exercer vos droits, contactez-nous à :{' '}
            <a href="mailto:contact@francois-maroquinerie.fr">
              contact@francois-maroquinerie.fr
            </a>
          </p>
        </section>

        {/* Sécurité */}
        <section className="politique-section">
          <h2>7. Sécurité</h2>
          <p>
            Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données :
          </p>
          <ul>
            <li>Chiffrement SSL/TLS pour toutes les communications</li>
            <li>Cryptage des mots de passe (bcrypt)</li>
            <li>Accès sécurisé à la base de données</li>
            <li>Paiements sécurisés via Stripe (certifié PCI DSS)</li>
          </ul>
        </section>

        {/* Modifications */}
        <section className="politique-section">
          <h2>8. Modifications de cette politique</h2>
          <p>
            Nous pouvons mettre à jour cette politique de confidentialité. 
            La date de dernière mise à jour est indiquée en haut de cette page. 
            Nous vous encourageons à consulter régulièrement cette page.
          </p>
        </section>

        {/* Contact */}
        <section className="politique-section">
          <h2>9. Contact</h2>
          <p>
            Pour toute question concernant cette politique de confidentialité ou vos données personnelles :
          </p>
          <div className="politique-contact-box">
            <p>
              <strong>François Maroquinerie</strong><br/>
              Email :{' '}
              <a href="mailto:contact@mea-vita-creation.fr">
                contact@mea-vita-creation.fr
              </a><br/>
              Téléphone : +33 (0)1 23 45 67 89<br/>
              Adresse : 123 Rue de l&apos;Artisanat, 75000 Paris, France
            </p>
          </div>
        </section>

        {/* Bouton retour */}
        <div className="politique-back-btn">
          <Link href="/" className="btn-primary">
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}