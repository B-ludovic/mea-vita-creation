import Link from 'next/link';
import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Informations légales</h4>
          <ul>
            <li>
              <Link href="/mentions-legales">Mentions légales</Link>
            </li>
            <li>
              <Link href="/cgv">Conditions Générales de Vente</Link>
            </li>
            <li>
              <Link href="/cgu">Conditions Générales d&apos;Utilisation</Link>
            </li>
            <li>
              <Link href="/politique-confidentialite">Politique de Confidentialité</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Aide & Services</h4>
          <ul>
            <li>
              <Link href="/politique-retour">Politique de Retour</Link>
            </li>
            <li>
              <Link href="/politique-livraison">Politique de Livraison</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Mea Vita Création. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
