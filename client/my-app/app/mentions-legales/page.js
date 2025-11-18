// Page Mentions Légales
import Link from 'next/link';
import Image from 'next/image';
import '../../styles/Legal.css';

export const metadata = {
    title: 'Mentions Légales | François Maroquinerie',
    description: 'Mentions légales du site François Maroquinerie - Mea Vita Création'
};

export default function MentionsLegales() {
    return (
        <div className="legal-page">
            <Link href="/" className="legal-back-link">
                <Image src="/icones/arrow.png" alt="Retour" width={20} height={20} />
                Retour à l&apos;accueil
            </Link>

            <div className="legal-header">
                <h1>Mentions Légales</h1>
                <p className="legal-date">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
            </div>

            <div className="legal-content">

                {/* Section 1 : Éditeur du site */}
                <section className="legal-section">
                    <h2>1. Éditeur du site</h2>

                    <div className="legal-highlight">
                        <p><strong>Nom de l&apos;entreprise :</strong> <span className="to-fill">[NOM DE L&apos;ENTREPRISE]</span></p>
                        <p><strong>Forme juridique :</strong> <span className="to-fill">[Auto-entrepreneur / SARL / etc.]</span></p>
                        <p><strong>Capital social :</strong> <span className="to-fill">[MONTANT]</span> (si applicable)</p>
                        <p><strong>SIRET :</strong> <span className="to-fill">[NUMÉRO SIRET]</span></p>
                        <p><strong>SIREN :</strong> <span className="to-fill">[NUMÉRO SIREN]</span></p>
                        <p><strong>TVA intracommunautaire :</strong> <span className="to-fill">[NUMÉRO TVA]</span></p>
                        <p><strong>RCS :</strong> <span className="to-fill">[VILLE + NUMÉRO]</span></p>
                    </div>

                    <p><strong>Siège social :</strong></p>
                    <p className="to-fill">[ADRESSE COMPLÈTE]<br />[CODE POSTAL] [VILLE]<br />France</p>

                    <p><strong>Contact :</strong></p>
                    <ul>
                        <li>Email : <a href="mailto:[EMAIL]"><span className="to-fill">[EMAIL DE CONTACT]</span></a></li>
                        <li>Téléphone : <span className="to-fill">[NUMÉRO DE TÉLÉPHONE]</span></li>
                    </ul>

                    <p><strong>Directeur de la publication :</strong> <span className="to-fill">[NOM DU DIRECTEUR]</span></p>
                </section>

                {/* Section 2 : Hébergeur */}
                <section className="legal-section">
                    <h2>2. Hébergement du site</h2>

                    <h3>Frontend (Site web)</h3>
                    <p><strong>Hébergeur :</strong> Render Services Inc.</p>
                    <p><strong>Adresse :</strong> 525 Brannan Street, Suite 300, San Francisco, CA 94107, USA</p>
                    <p><strong>Site web :</strong> <a href="https://render.com" target="_blank" rel="noopener noreferrer">https://render.com</a></p>

                    <h3>Backend (API & Base de données)</h3>
                    <p><strong>Hébergeur :</strong> Render Services Inc.</p>
                    <p><strong>Adresse :</strong> 525 Brannan Street, Suite 300, San Francisco, CA 94107, USA</p>
                    <p><strong>Site web :</strong> <a href="https://render.com" target="_blank" rel="noopener noreferrer">https://render.com</a></p>
                </section>

                {/* Section 3 : Propriété intellectuelle */}
                <section className="legal-section">
                    <h2>3. Propriété intellectuelle</h2>

                    <p>L&apos;ensemble du contenu présent sur ce site (textes, images, graphismes, logo, icônes, photos, vidéos, etc.) est la propriété exclusive de <span className="to-fill">[NOM DE L&apos;ENTREPRISE]</span> ou de ses partenaires.</p>

                    <p>Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable.</p>

                    <div className="legal-alert legal-alert-warning">
                        <strong><Image src="/icones/error.png" alt="Attention" width={24} height={24} /> Attention</strong>
                        <p>Toute exploitation non autorisée du site ou de l&apos;un des éléments qu&apos;il contient sera considérée comme constitutive d&apos;une contrefaçon et poursuivie conformément aux dispositions des articles L.335-2 et suivants du Code de Propriété Intellectuelle.</p>
                    </div>
                </section>

                {/* Section 4 : Protection des données */}
                <section className="legal-section">
                    <h2>4. Protection des données personnelles</h2>

                    <p>Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez d&apos;un droit d&apos;accès, de rectification, de suppression et d&apos;opposition aux données personnelles vous concernant.</p>

                    <p>Pour exercer ces droits, vous pouvez nous contacter :</p>
                    <ul>
                        <li>Par email : <span className="to-fill">[EMAIL DE CONTACT]</span></li>
                        <li>Par courrier : <span className="to-fill">[ADRESSE COMPLÈTE]</span></li>
                    </ul>

                    <p>Pour plus d&apos;informations, consultez notre <Link href="/politique-confidentialite">Politique de Confidentialité</Link>.</p>
                </section>

                {/* Section 5 : Cookies */}
                <section className="legal-section">
                    <h2>5. Cookies</h2>

                    <p>Ce site utilise des cookies pour améliorer l&apos;expérience utilisateur et réaliser des statistiques de visite.</p>

                    <p>Vous pouvez à tout moment gérer vos préférences en matière de cookies via notre bannière de consentement.</p>

                    <p>Pour plus d&apos;informations, consultez notre politique de gestion des cookies.</p>
                </section>

                {/* Section 6 : Limitation de responsabilité */}
                <section className="legal-section">
                    <h2>6. Limitation de responsabilité</h2>

                    <p><span className="to-fill">[NOM DE L&apos;ENTREPRISE]</span> ne peut être tenue responsable :</p>

                    <ul>
                        <li>Des dysfonctionnements, bugs, erreurs ou interruptions du site</li>
                        <li>Des dommages directs ou indirects causés à l&apos;utilisateur</li>
                        <li>De l&apos;utilisation frauduleuse du site par un tiers</li>
                        <li>Des liens hypertextes vers d&apos;autres sites</li>
                    </ul>

                    <p>L&apos;utilisateur est seul responsable de l&apos;utilisation qu&apos;il fait du site et des informations qu&apos;il communique.</p>
                </section>

                {/* Section 7 : Droit applicable */}
                <section className="legal-section">
                    <h2>7. Droit applicable et juridiction compétente</h2>

                    <p>Les présentes mentions légales sont soumises au droit français.</p>

                    <p>En cas de litige, une solution amiable sera recherchée avant toute action judiciaire. À défaut, les tribunaux français seront seuls compétents.</p>
                </section>

                {/* Contact */}
                <div className="legal-contact-box">
                    <h3><Image src="/icones/mail.png" alt="Contact" width={24} height={24} /> Une question ?</h3>
                    <p>Contactez-nous à : <a href="mailto:[EMAIL]"><span className="to-fill">[EMAIL]</span></a></p>
                    <p>Ou via notre <Link href="/contact">formulaire de contact</Link></p>
                </div>
            </div>

            <div className="legal-last-update">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })}
            </div>
        </div>
    );
}