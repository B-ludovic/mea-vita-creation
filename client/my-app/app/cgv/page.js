// Page Conditions Générales de Vente (CGV)
import Link from 'next/link';
import Image from 'next/image';
import '../../styles/Legal.css';

export const metadata = {
  title: 'Conditions Générales de Vente | François Maroquinerie',
  description: 'Conditions générales de vente de François Maroquinerie - Mea Vita Création'
};

export default function CGV() {
  return (
    <div className="legal-page">
      <Link href="/" className="legal-back-link">
        <Image src="/icones/arrow.png" alt="Retour" width={20} height={20} />
        Retour à l&apos;accueil
      </Link>

      <div className="legal-header">
        <h1>Conditions Générales de Vente</h1>
        <p className="legal-date">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
      </div>

      <div className="legal-content">
        
        {/* Préambule */}
        <section className="legal-section">
          <div className="legal-alert legal-alert-info">
            <strong><Image src="/icones/instruction.png" alt="Important" width={24} height={24} /> Important</strong>
            <p>Les présentes Conditions Générales de Vente (CGV) régissent les ventes de produits de maroquinerie artisanale effectuées sur le site François Maroquinerie.</p>
            <p>Toute commande implique l&apos;acceptation sans réserve des présentes CGV.</p>
          </div>
        </section>

        {/* Article 1 : Objet */}
        <section className="legal-section">
          <h2>Article 1 - Objet</h2>
          
          <p>Les présentes conditions générales de vente s&apos;appliquent à toutes les ventes conclues sur le site internet <strong>François Maroquinerie</strong> exploité par <span className="to-fill">[NOM DE L&apos;ENTREPRISE]</span>.</p>

          <p>Le site propose à la vente des produits de maroquinerie artisanale fabriqués en cuir véritable.</p>
        </section>

        {/* Article 2 : Prix */}
        <section className="legal-section">
          <h2>Article 2 - Prix</h2>
          
          <h3>2.1 Prix des produits</h3>
          <p>Les prix de nos produits sont indiqués en euros <strong>toutes taxes comprises (TTC)</strong>, hors frais de livraison.</p>

          <p>Le vendeur se réserve le droit de modifier ses prix à tout moment, mais les produits seront facturés sur la base des tarifs en vigueur au moment de la validation de la commande.</p>

          <h3>2.2 Frais de livraison</h3>
          <p>Les frais de livraison sont calculés en fonction du mode de livraison choisi et de la destination.</p>

          <table className="legal-table">
            <thead>
              <tr>
                <th>Zone</th>
                <th>Délai</th>
                <th>Prix</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>France métropolitaine</td>
                <td><span className="to-fill">[X-X jours]</span></td>
                <td><span className="to-fill">[XX€]</span></td>
              </tr>
              <tr>
                <td>Europe</td>
                <td><span className="to-fill">[X-X jours]</span></td>
                <td><span className="to-fill">[XX€]</span></td>
              </tr>
              <tr>
                <td>International</td>
                <td><span className="to-fill">[X-X jours]</span></td>
                <td><span className="to-fill">[Sur devis]</span></td>
              </tr>
            </tbody>
          </table>

          <p>Les frais de livraison sont indiqués avant la validation finale de la commande.</p>

          <h3>2.3 Codes promotionnels</h3>
          <p>Des codes promotionnels peuvent être proposés ponctuellement. Ils sont cumulables selon les conditions indiquées lors de leur émission.</p>
        </section>

        {/* Article 3 : Commande */}
        <section className="legal-section">
          <h2>Article 3 - Commande</h2>
          
          <h3>3.1 Processus de commande</h3>
          <p>Pour passer commande, vous devez :</p>
          <ol>
            <li>Ajouter les produits souhaités au panier</li>
            <li>Valider le panier</li>
            <li>Créer un compte ou vous connecter</li>
            <li>Renseigner l'adresse de livraison</li>
            <li>Choisir le mode de livraison</li>
            <li>Procéder au paiement sécurisé</li>
          </ol>

          <h3>3.2 Confirmation de commande</h3>
          <p>Une fois le paiement validé, vous recevez immédiatement :</p>
          <ul>
            <li>Un email de confirmation de commande avec le numéro de commande</li>
            <li>Un récapitulatif détaillé de votre achat</li>
            <li>Une facture en format PDF</li>
          </ul>

          <h3>3.3 Disponibilité des produits</h3>
          <p>Nos offres de produits sont valables tant qu'elles sont visibles sur le site, dans la limite des stocks disponibles.</p>

          <div className="legal-alert legal-alert-warning">
            <strong><Image src="/icones/error.png" alt="Attention" width={24} height={24} /> Stock limité</strong>
            <p>En cas d&apos;indisponibilité d&apos;un produit après passation de la commande, vous serez informé par email dans les plus brefs délais. Vous pourrez alors choisir un remboursement intégral ou un produit de remplacement.</p>
          </div>
        </section>

        {/* Article 4 : Paiement */}
        <section className="legal-section">
          <h2>Article 4 - Modalités de paiement</h2>
          
          <h3>4.1 Moyens de paiement acceptés</h3>
          <p>Le règlement de vos achats s'effectue par carte bancaire via notre plateforme de paiement sécurisé <strong>Stripe</strong>.</p>

          <p>Cartes acceptées :</p>
          <ul>
            <li>Visa</li>
            <li>Mastercard</li>
            <li>American Express</li>
            <li>Cartes de débit</li>
          </ul>

          <h3>4.2 Sécurité des paiements</h3>
          <p>Les paiements sont sécurisés par <strong>Stripe</strong>, certifié PCI DSS niveau 1 (norme de sécurité la plus stricte de l'industrie bancaire).</p>

          <p>Vos informations bancaires ne sont jamais stockées sur nos serveurs.</p>

          <h3>4.3 Validation du paiement</h3>
          <p>La commande n'est définitivement enregistrée qu'après acceptation du paiement par notre prestataire.</p>

          <p>En cas de refus, la commande est automatiquement annulée et vous en êtes informé par email.</p>
        </section>

        {/* Article 5 : Livraison */}
        <section className="legal-section">
          <h2>Article 5 - Livraison</h2>
          
          <h3>5.1 Délais de livraison</h3>
          <p>Les produits sont expédiés dans un délai de <span className="to-fill">[X-X jours ouvrés]</span> après validation du paiement.</p>

          <p>Les délais de livraison sont :</p>
          <ul>
            <li><strong>France métropolitaine :</strong> <span className="to-fill">[X-X jours ouvrés]</span></li>
            <li><strong>Europe :</strong> <span className="to-fill">[X-X jours ouvrés]</span></li>
            <li><strong>International :</strong> <span className="to-fill">[X-X jours ouvrés]</span></li>
          </ul>

          <p>Ces délais sont donnés à titre indicatif et peuvent varier selon les périodes (soldes, fêtes, etc.).</p>

          <h3>5.2 Suivi de commande</h3>
          <p>Dès l'expédition de votre colis, vous recevez un email contenant :</p>
          <ul>
            <li>Le numéro de suivi</li>
            <li>Le lien de tracking pour suivre votre colis en temps réel</li>
            <li>Le nom du transporteur</li>
          </ul>

          <h3>5.3 Réception du colis</h3>
          <p>À la réception, nous vous recommandons de vérifier l'état du colis en présence du livreur.</p>

          <div className="legal-alert legal-alert-important">
            <strong><Image src="/icones/error.png" alt="Colis endommagé" width={24} height={24} /> Colis endommagé</strong>
            <p>En cas de colis endommagé, vous devez :</p>
            <ul>
              <li>Refuser le colis ou émettre des réserves écrites auprès du transporteur</li>
              <li>Nous contacter dans les 48h avec photos à l&apos;appui</li>
              <li>Nous retournerons ou remplacerons le produit sans frais</li>
            </ul>
          </div>

          <h3>5.4 Colis non livré</h3>
          <p>En cas de non-livraison dans les délais prévus, contactez-nous à <span className="to-fill">[EMAIL]</span>. Nous lancerons une enquête auprès du transporteur.</p>
        </section>

        {/* Article 6 : Droit de rétractation */}
        <section className="legal-section">
          <h2>Article 6 - Droit de rétractation (14 jours)</h2>
          
          <h3>6.1 Délai de rétractation</h3>
          <p>Conformément à la législation européenne, vous disposez d'un délai de <strong>14 jours calendaires</strong> à compter de la réception de votre commande pour exercer votre droit de rétractation, sans avoir à justifier de motifs ni à payer de pénalités.</p>

          <h3>6.2 Conditions de retour</h3>
          <p>Pour que le retour soit accepté, les produits doivent être :</p>
          <ul>
            <li>Dans leur état d'origine</li>
            <li>Non utilisés, non portés</li>
            <li>Complets (étiquettes, emballage d'origine)</li>
            <li>Accompagnés de la facture</li>
          </ul>

          <div className="legal-alert legal-alert-warning">
            <strong><Image src="/icones/error.png" alt="Attention" width={24} height={24} /> Exceptions</strong>
            <p>Le droit de rétractation ne s&apos;applique pas aux produits personnalisés ou fabriqués sur mesure selon les spécifications du client.</p>
          </div>

          <h3>6.3 Procédure de retour</h3>
          <p>Pour exercer votre droit de rétractation :</p>
          <ol>
            <li>Contactez-nous par email à <span className="to-fill">[EMAIL]</span> en indiquant votre numéro de commande</li>
            <li>Renvoyez le produit à l'adresse indiquée dans notre réponse</li>
            <li>Les frais de retour sont à votre charge</li>
          </ol>

          <h3>6.4 Remboursement</h3>
          <p>Dès réception et vérification du produit retourné, nous procédons au remboursement sous <strong>14 jours</strong> par le même moyen de paiement que celui utilisé lors de l'achat.</p>

          <p>Le remboursement inclut le prix du produit et les frais de livraison initiaux (hors frais de retour).</p>

          <p>Pour plus de détails, consultez notre <Link href="/politique-retour">Politique de Retour</Link>.</p>
        </section>

        {/* Article 7 : Garanties */}
        <section className="legal-section">
          <h2>Article 7 - Garanties légales</h2>
          
          <h3>7.1 Garantie de conformité</h3>
          <p>Tous nos produits bénéficient de la garantie légale de conformité (articles L217-4 et suivants du Code de la consommation) et de la garantie contre les vices cachés (articles 1641 et suivants du Code civil).</p>

          <h3>7.2 Durée des garanties</h3>
          <ul>
            <li><strong>Garantie de conformité :</strong> 2 ans à compter de la livraison</li>
            <li><strong>Garantie vice caché :</strong> 2 ans à compter de la découverte du vice</li>
          </ul>

          <h3>7.3 Application de la garantie</h3>
          <p>En cas de défaut de conformité ou de vice caché, vous pouvez :</p>
          <ul>
            <li>Demander la réparation du produit</li>
            <li>Demander le remplacement du produit</li>
            <li>Obtenir une réduction du prix</li>
            <li>Obtenir un remboursement intégral</li>
          </ul>

          <p>Les frais de retour sont à notre charge dans le cadre de la garantie légale.</p>
        </section>

        {/* Article 8 : Propriété intellectuelle */}
        <section className="legal-section">
          <h2>Article 8 - Propriété intellectuelle</h2>
          
          <p>Tous les éléments du site François Maroquinerie (textes, images, photos, logos, etc.) sont protégés par le droit d'auteur, le droit des marques et/ou tout autre droit de propriété intellectuelle.</p>

          <p>Toute reproduction, même partielle, est strictement interdite sans autorisation écrite préalable.</p>
        </section>

        {/* Article 9 : Données personnelles */}
        <section className="legal-section">
          <h2>Article 9 - Protection des données personnelles</h2>
          
          <p>Vos données personnelles sont collectées et traitées conformément au RGPD.</p>

          <p>Pour plus d'informations, consultez notre <Link href="/politique-confidentialite">Politique de Confidentialité</Link>.</p>
        </section>

        {/* Article 10 : Litiges */}
        <section className="legal-section">
          <h2>Article 10 - Règlement des litiges</h2>
          
          <h3>10.1 Médiation</h3>
          <p>En cas de litige, vous pouvez recourir gratuitement à un médiateur de la consommation dans un délai d'un an à compter de votre réclamation écrite auprès du vendeur.</p>

          <p>Coordonnées du médiateur :</p>
          <div className="legal-highlight">
            <p><span className="to-fill">[NOM DU MÉDIATEUR]</span></p>
            <p><span className="to-fill">[ADRESSE]</span></p>
            <p><span className="to-fill">[EMAIL]</span></p>
            <p><span className="to-fill">[SITE WEB]</span></p>
          </div>

          <h3>10.2 Plateforme de résolution des litiges en ligne</h3>
          <p>La Commission Européenne met à disposition une plateforme de résolution des litiges en ligne accessible à l'adresse : <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr</a></p>

          <h3>10.3 Droit applicable</h3>
          <p>Les présentes CGV sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.</p>
        </section>

        {/* Contact */}
        <div className="legal-contact-box">
          <h3><Image src="/icones/mail.png" alt="Contact" width={24} height={24} /> Des questions sur nos CGV ?</h3>
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