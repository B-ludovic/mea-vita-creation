// Page Conditions Générales d'Utilisation (CGU)
import Link from 'next/link';
import Image from 'next/image';
import '../../styles/Legal.css';

export const metadata = {
    title: 'Conditions Générales d\'Utilisation | François Maroquinerie',
    description: 'Conditions générales d\'utilisation du site François Maroquinerie'
};

export default function CGU() {
    return (
        <div className="legal-page">
            <Link href="/" className="legal-back-link">
                <Image src="/icones/arrow.png" alt="Retour" width={20} height={20} />
                Retour à l'accueil
            </Link>

            <div className="legal-header">
                <h1>Conditions Générales d'Utilisation</h1>
                <p className="legal-date">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
            </div>

            <div className="legal-content">

                {/* Préambule */}
                <section className="legal-section">
                    <div className="legal-alert legal-alert-info">
                        <strong><Image src="/icones/instruction.png" alt="Important" width={24} height={24} /> Important</strong>
                        <p>Les présentes Conditions Générales d'Utilisation (CGU) définissent les règles d'accès et d'utilisation du site François Maroquinerie.</p>
                        <p>En accédant au site, vous acceptez sans réserve les présentes CGU.</p>
                    </div>
                </section>

                {/* Article 1 : Objet */}
                <section className="legal-section">
                    <h2>Article 1 - Objet</h2>

                    <p>Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les modalités et conditions d'utilisation du site internet <strong>François Maroquinerie</strong> accessible à l'adresse <span className="to-fill">[URL DU SITE]</span>.</p>

                    <p>Le site est édité par <span className="to-fill">[NOM DE L'ENTREPRISE]</span>, dont le siège social est situé à <span className="to-fill">[ADRESSE]</span>.</p>
                </section>

                {/* Article 2 : Accès au site */}
                <section className="legal-section">
                    <h2>Article 2 - Accès au site</h2>

                    <h3>2.1 Accès libre</h3>
                    <p>Le site est accessible gratuitement à tout utilisateur disposant d'un accès à internet.</p>

                    <p>Tous les coûts afférents à l'accès au site (matériel informatique, connexion internet, etc.) sont à la charge de l'utilisateur.</p>

                    <h3>2.2 Disponibilité</h3>
                    <p>Le site est accessible 24h/24 et 7j/7, sauf en cas de :</p>
                    <ul>
                        <li>Maintenance programmée ou d'urgence</li>
                        <li>Force majeure</li>
                        <li>Panne des équipements</li>
                        <li>Interruption du réseau internet</li>
                    </ul>

                    <p><span className="to-fill">[NOM DE L'ENTREPRISE]</span> ne peut être tenue responsable des interruptions temporaires d'accès au site.</p>

                    <h3>2.3 Modification du site</h3>
                    <p>L'éditeur se réserve le droit de modifier, suspendre ou interrompre le site à tout moment sans préavis ni indemnité.</p>
                </section>

                {/* Article 3 : Création de compte */}
                <section className="legal-section">
                    <h2>Article 3 - Création de compte utilisateur</h2>

                    <h3>3.1 Inscription</h3>
                    <p>Pour passer commande, vous devez créer un compte en fournissant :</p>
                    <ul>
                        <li>Votre nom et prénom</li>
                        <li>Votre adresse email valide</li>
                        <li>Un mot de passe sécurisé</li>
                        <li>Votre adresse de livraison</li>
                    </ul>

                    <h3>3.2 Exactitude des informations</h3>
                    <p>Vous vous engagez à fournir des informations exactes, complètes et à jour.</p>

                    <p>Toute information erronée engage votre responsabilité.</p>

                    <h3>3.3 Confidentialité des identifiants</h3>
                    <p>Vous êtes responsable de la confidentialité de vos identifiants de connexion.</p>

                    <div className="legal-alert legal-alert-warning">
                        <strong><Image src="/icones/error.png" alt="Attention" width={24} height={24} /> Sécurité du compte</strong>
                        <p>En cas d'utilisation frauduleuse de votre compte, vous devez nous en informer immédiatement à <span className="to-fill">[EMAIL]</span>.</p>
                    </div>

                    <h3>3.4 Suppression de compte</h3>
                    <p>Vous pouvez demander la suppression de votre compte à tout moment en nous contactant. Vos données personnelles seront supprimées conformément au RGPD.</p>
                </section>

                {/* Article 4 : Utilisation du site */}
                <section className="legal-section">
                    <h2>Article 4 - Utilisation du site</h2>

                    <h3>4.1 Usage autorisé</h3>
                    <p>Le site est destiné à un usage personnel et non commercial.</p>

                    <p>Vous vous engagez à utiliser le site conformément aux lois en vigueur et aux présentes CGU.</p>

                    <h3>4.2 Usages interdits</h3>
                    <p>Il est strictement interdit de :</p>
                    <ul>
                        <li>Utiliser le site à des fins illégales ou frauduleuses</li>
                        <li>Tenter d'accéder aux systèmes informatiques du site de manière non autorisée</li>
                        <li>Diffuser des virus, malwares ou tout code malveillant</li>
                        <li>Collecter des données personnelles d'autres utilisateurs</li>
                        <li>Copier, reproduire ou distribuer le contenu du site sans autorisation</li>
                        <li>Usurper l'identité d'une autre personne</li>
                        <li>Harceler, menacer ou diffamer d'autres utilisateurs</li>
                        <li>Utiliser des robots, scrapers ou autres outils automatisés</li>
                    </ul>

                    <div className="legal-alert legal-alert-important">
                        <strong><Image src="/icones/error.png" alt="Sanctions" width={24} height={24} /> Sanctions</strong>
                        <p>Tout manquement à ces règles peut entraîner la suspension ou la suppression immédiate de votre compte, sans préavis ni remboursement.</p>
                    </div>
                </section>

                {/* Article 5 : Contenu utilisateur */}
                <section className="legal-section">
                    <h2>Article 5 - Contenu utilisateur (Avis clients)</h2>

                    <h3>5.1 Avis et commentaires</h3>
                    <p>Vous pouvez laisser des avis sur les produits que vous avez achetés.</p>

                    <h3>5.2 Modération</h3>
                    <p>Les avis sont soumis à modération avant publication. Nous nous réservons le droit de refuser ou supprimer tout avis qui :</p>
                    <ul>
                        <li>Contient des propos injurieux, diffamatoires ou obscènes</li>
                        <li>Est contraire aux lois en vigueur</li>
                        <li>Porte atteinte à la vie privée ou aux droits d'autrui</li>
                        <li>Contient de la publicité ou du spam</li>
                        <li>N'est pas en rapport avec le produit concerné</li>
                    </ul>

                    <h3>5.3 Propriété du contenu</h3>
                    <p>En publiant un avis, vous accordez à <span className="to-fill">[NOM DE L'ENTREPRISE]</span> une licence non exclusive, gratuite et mondiale pour utiliser, reproduire et diffuser votre contenu sur le site et les réseaux sociaux.</p>
                </section>

                {/* Article 6 : Propriété intellectuelle */}
                <section className="legal-section">
                    <h2>Article 6 - Propriété intellectuelle</h2>

                    <h3>6.1 Droits d'auteur</h3>
                    <p>Tous les contenus présents sur le site (textes, images, logos, vidéos, etc.) sont protégés par le droit d'auteur et appartiennent à <span className="to-fill">[NOM DE L'ENTREPRISE]</span> ou à ses partenaires.</p>

                    <h3>6.2 Interdiction de reproduction</h3>
                    <p>Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie du site, quel que soit le moyen ou le procédé utilisé, est interdite sans autorisation écrite préalable.</p>

                    <h3>6.3 Marques</h3>
                    <p>Les marques, logos et signes distinctifs reproduits sur le site sont la propriété de <span className="to-fill">[NOM DE L'ENTREPRISE]</span>.</p>

                    <p>Toute utilisation non autorisée constitue une contrefaçon passible de sanctions civiles et pénales.</p>
                </section>

                {/* Article 7 : Protection des données */}
                <section className="legal-section">
                    <h2>Article 7 - Protection des données personnelles</h2>

                    <p>Vos données personnelles sont traitées conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.</p>

                    <p>Pour plus d'informations sur la collecte et le traitement de vos données, consultez notre <Link href="/politique-confidentialite">Politique de Confidentialité</Link>.</p>

                    <h3>7.1 Vos droits</h3>
                    <p>Vous disposez d'un droit :</p>
                    <ul>
                        <li>D'accès à vos données personnelles</li>
                        <li>De rectification de vos données</li>
                        <li>De suppression de vos données</li>
                        <li>D'opposition au traitement de vos données</li>
                        <li>De portabilité de vos données</li>
                    </ul>

                    <p>Pour exercer ces droits, contactez-nous à <span className="to-fill">[EMAIL]</span>.</p>
                </section>

                {/* Article 8 : Cookies */}
                <section className="legal-section">
                    <h2>Article 8 - Cookies</h2>

                    <p>Le site utilise des cookies pour améliorer votre expérience de navigation et réaliser des statistiques de visite.</p>

                    <p>Vous pouvez à tout moment gérer vos préférences en matière de cookies via la bannière de consentement.</p>

                    <p>Pour plus d'informations, consultez notre politique de cookies.</p>
                </section>

                {/* Article 9 : Responsabilité */}
                <section className="legal-section">
                    <h2>Article 9 - Limitation de responsabilité</h2>

                    <h3>9.1 Contenu du site</h3>
                    <p><span className="to-fill">[NOM DE L'ENTREPRISE]</span> s'efforce de maintenir des informations exactes et à jour sur le site, mais ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations.</p>

                    <h3>9.2 Liens externes</h3>
                    <p>Le site peut contenir des liens vers des sites tiers. <span className="to-fill">[NOM DE L'ENTREPRISE]</span> n'a aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.</p>

                    <h3>9.3 Interruption de service</h3>
                    <p><span className="to-fill">[NOM DE L'ENTREPRISE]</span> ne peut être tenue responsable des dommages résultant de :</p>
                    <ul>
                        <li>L'interruption temporaire du site</li>
                        <li>La perte de données</li>
                        <li>L'utilisation frauduleuse du site par un tiers</li>
                        <li>Tout autre dommage indirect</li>
                    </ul>
                </section>

                {/* Article 10 : Loi applicable */}
                <section className="legal-section">
                    <h2>Article 10 - Loi applicable et juridiction</h2>

                    <h3>10.1 Droit applicable</h3>
                    <p>Les présentes CGU sont régies par le droit français.</p>

                    <h3>10.2 Litiges</h3>
                    <p>En cas de litige, une solution amiable sera recherchée en priorité.</p>

                    <p>À défaut d'accord amiable, les tribunaux français seront seuls compétents.</p>

                    <h3>10.3 Médiation</h3>
                    <p>Conformément à la réglementation européenne, vous pouvez recourir à un médiateur de la consommation en cas de litige.</p>
                </section>

                {/* Article 11 : Modification des CGU */}
                <section className="legal-section">
                    <h2>Article 11 - Modification des CGU</h2>

                    <p><span className="to-fill">[NOM DE L'ENTREPRISE]</span> se réserve le droit de modifier les présentes CGU à tout moment.</p>

                    <p>Les CGU applicables sont celles en vigueur au moment de votre utilisation du site.</p>

                    <p>Nous vous recommandons de consulter régulièrement cette page pour prendre connaissance des éventuelles modifications.</p>
                </section>

                {/* Contact */}
                <div className="legal-contact-box">
                    <h3><Image src="/icones/mail.png" alt="Contact" width={24} height={24} /> Des questions sur nos CGU ?</h3>
                    <p>Contactez-nous : <a href="mailto:[EMAIL]"><span className="to-fill">[EMAIL]</span></a></p>
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