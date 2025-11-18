// Page Politique de Retour & Rétractation
import Link from 'next/link';
import Image from 'next/image';
import '../../styles/Legal.css';

export const metadata = {
  title: 'Politique de Retour | François Maroquinerie',
  description: 'Politique de retour et droit de rétractation - François Maroquinerie'
};

export default function PolitiqueRetour() {
  return (
    <div className="legal-page">
      <Link href="/" className="legal-back-link">
        <Image src="/icones/arrow.png" alt="Retour" width={20} height={20} />
        Retour à l'accueil
      </Link>

      <div className="legal-header">
        <h1>Politique de Retour & Rétractation</h1>
        <p className="legal-date">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
      </div>

      <div className="legal-content">
        
        {/* Préambule */}
        <section className="legal-section">
          <div className="legal-alert legal-alert-info">
            <strong><Image src="/icones/ok.png" alt="Satisfaction" width={24} height={24} /> Votre satisfaction est notre priorité</strong>
            <p>Conformément à la législation européenne, vous disposez d'un délai de <strong>14 jours</strong> pour retourner vos achats sans avoir à justifier de motifs.</p>
          </div>
        </section>

        {/* Article 1 : Droit de rétractation */}
        <section className="legal-section">
          <h2>Article 1 - Droit de rétractation (14 jours)</h2>
          
          <h3>1.1 Délai légal</h3>
          <p>Vous disposez d'un délai de <strong>14 jours calendaires</strong> à compter de la date de réception de votre commande pour exercer votre droit de rétractation, sans avoir à justifier de motifs ni à payer de pénalités.</p>

          <div className="legal-highlight">
            <p><strong><Image src="/icones/sand-timer.png" alt="Exemple" width={20} height={20} /> Exemple :</strong></p>
            <p>Vous recevez votre commande le <strong>1er janvier</strong>.</p>
            <p>Vous avez jusqu'au <strong>14 janvier</strong> minuit pour nous notifier votre rétractation.</p>
            <p>Vous avez ensuite <strong>14 jours supplémentaires</strong> pour nous retourner le produit.</p>
          </div>

          <h3>1.2 Comment exercer votre droit de rétractation</h3>
          <p>Pour exercer votre droit de rétractation, vous devez nous notifier votre décision par une déclaration dénuée d'ambiguïté.</p>

          <p><strong>Plusieurs moyens possibles :</strong></p>
          <ul>
            <li><strong>Par email :</strong> <span className="to-fill">[EMAIL]</span></li>
            <li><strong>Par courrier :</strong> <span className="to-fill">[ADRESSE COMPLÈTE]</span></li>
            <li><strong>Via le formulaire de contact :</strong> <Link href="/contact">Nous contacter</Link></li>
          </ul>

          <p><strong>Informations à fournir :</strong></p>
          <ul>
            <li>Votre nom et prénom</li>
            <li>Votre numéro de commande</li>
            <li>Le(s) produit(s) concerné(s)</li>
            <li>La date de réception de la commande</li>
          </ul>
        </section>

        {/* Article 2 : Conditions de retour */}
        <section className="legal-section">
          <h2>Article 2 - Conditions de retour</h2>
          
          <h3>2.1 État du produit</h3>
          <p>Pour que le retour soit accepté, les produits doivent être :</p>
          
          <div className="legal-highlight">
            <ul>
              <li><Image src="/icones/ok.png" alt="Check" width={16} height={16} /> Dans leur <strong>état d'origine</strong></li>
              <li><Image src="/icones/ok.png" alt="Check" width={16} height={16} /> <strong>Non utilisés</strong> et non portés</li>
              <li><Image src="/icones/ok.png" alt="Check" width={16} height={16} /> <strong>Complets</strong> avec tous les accessoires</li>
              <li><Image src="/icones/ok.png" alt="Check" width={16} height={16} /> Dans leur <strong>emballage d'origine</strong></li>
              <li><Image src="/icones/ok.png" alt="Check" width={16} height={16} /> Avec les <strong>étiquettes</strong> encore attachées</li>
              <li><Image src="/icones/ok.png" alt="Check" width={16} height={16} /> Accompagnés de la <strong>facture</strong></li>
            </ul>
          </div>

          <div className="legal-alert legal-alert-warning">
            <strong><Image src="/icones/error.png" alt="Attention" width={24} height={24} /> Attention</strong>
            <p>Tout produit retourné incomplet, endommagé, sali ou utilisé ne sera pas remboursé. Le produit vous sera renvoyé à vos frais.</p>
          </div>

          <h3>2.2 Exceptions au droit de rétractation</h3>
          <p>Le droit de rétractation ne s'applique pas aux :</p>
          <ul>
            <li>Produits personnalisés ou fabriqués sur mesure selon vos spécifications</li>
            <li>Produits confectionnés selon vos demandes particulières</li>
            <li>Produits avec gravure personnalisée</li>
          </ul>

          <h3>2.3 Emballage du retour</h3>
          <p>Veuillez emballer soigneusement le produit pour éviter tout dommage pendant le transport.</p>

          <p><strong>Conseils :</strong></p>
          <ul>
            <li>Utilisez l'emballage d'origine si possible</li>
            <li>Protégez le produit avec du papier bulle ou du papier kraft</li>
            <li>Incluez la facture dans le colis</li>
            <li>Conservez le numéro de suivi du transporteur</li>
          </ul>
        </section>

        {/* Article 3 : Procédure de retour */}
        <section className="legal-section">
          <h2>Article 3 - Procédure de retour</h2>
          
          <h3>Étape 1 : Nous notifier votre retour</h3>
          <p>Contactez-nous par email à <span className="to-fill">[EMAIL]</span> en indiquant :</p>
          <ul>
            <li>Votre numéro de commande</li>
            <li>Le(s) produit(s) à retourner</li>
            <li>Le motif du retour (optionnel mais apprécié)</li>
          </ul>

          <h3>Étape 2 : Nous vous confirmons l'adresse de retour</h3>
          <p>Nous vous répondons sous <strong>48h ouvrées</strong> avec :</p>
          <ul>
            <li>L'adresse de retour exacte</li>
            <li>Les instructions d'emballage</li>
            <li>Le numéro de retour (RMA) si applicable</li>
          </ul>

          <div className="legal-highlight">
            <p><strong><Image src="/icones/location.png" alt="Adresse" width={20} height={20} /> Adresse de retour :</strong></p>
            <p><span className="to-fill">[NOM DE L'ENTREPRISE]</span></p>
            <p><span className="to-fill">[ADRESSE RETOURS]</span></p>
            <p><span className="to-fill">[CODE POSTAL] [VILLE]</span></p>
            <p>France</p>
          </div>

          <h3>Étape 3 : Renvoyez le produit</h3>
          <p>Vous disposez de <strong>14 jours</strong> après notification pour nous renvoyer le produit.</p>

          <p><strong><Image src="/icones/error.png" alt="Attention" width={16} height={16} /> Les frais de retour sont à votre charge.</strong></p>

          <p><strong>Transporteurs conseillés :</strong></p>
          <ul>
            <li>Colissimo avec suivi (recommandé)</li>
            <li>Chronopost</li>
            <li>Mondial Relay</li>
          </ul>

          <div className="legal-alert legal-alert-important">
            <strong><Image src="/icones/error.png" alt="Important" width={24} height={24} /> Important</strong>
            <p>Nous vous recommandons vivement d'envoyer votre colis avec un numéro de suivi. Nous ne sommes pas responsables des colis perdus pendant le transport retour.</p>
          </div>

          <h3>Étape 4 : Réception et vérification</h3>
          <p>Dès réception de votre colis, nous vérifions que le produit est conforme aux conditions de retour (état d'origine, complet, etc.).</p>

          <p>Vous recevez un email de confirmation de réception sous <strong>2 jours ouvrés</strong>.</p>

          <h3>Étape 5 : Remboursement</h3>
          <p>Si le produit est conforme, nous procédons au remboursement sous <strong>14 jours maximum</strong> à compter de la réception du retour.</p>
        </section>

        {/* Article 4 : Modalités de remboursement */}
        <section className="legal-section">
          <h2>Article 4 - Modalités de remboursement</h2>
          
          <h3>4.1 Montant remboursé</h3>
          <p>Le remboursement inclut :</p>
          <ul>
            <li><Image src="/icones/ok.png" alt="Check" width={16} height={16} /> Le prix du produit (TTC)</li>
            <li><Image src="/icones/ok.png" alt="Check" width={16} height={16} /> Les frais de livraison initiaux au tarif standard</li>
          </ul>

          <p>Le remboursement n'inclut PAS :</p>
          <ul>
            <li><Image src="/icones/remove.png" alt="Cross" width={16} height={16} /> Les frais de retour (à votre charge)</li>
            <li><Image src="/icones/remove.png" alt="Cross" width={16} height={16} /> Les frais de livraison express si vous les avez choisis</li>
          </ul>

          <h3>4.2 Moyen de remboursement</h3>
          <p>Le remboursement est effectué par le <strong>même moyen de paiement</strong> que celui utilisé lors de l'achat.</p>

          <p>Si cela n'est pas possible, nous vous proposerons un autre mode de remboursement.</p>

          <h3>4.3 Délai de remboursement</h3>
          <p>Le remboursement intervient sous <strong>14 jours maximum</strong> à compter de la réception du produit retourné.</p>

          <div className="legal-highlight">
            <p><strong><Image src="/icones/payment.png" alt="Carte bancaire" width={20} height={20} /> Délai d'apparition sur votre compte bancaire :</strong></p>
            <p>Selon votre banque, le remboursement peut apparaître sur votre compte sous 3 à 10 jours ouvrés supplémentaires.</p>
          </div>

          <h3>4.4 Notification de remboursement</h3>
          <p>Vous recevez un email de confirmation dès que le remboursement a été traité.</p>
        </section>

        {/* Article 5 : Échange */}
        <section className="legal-section">
          <h2>Article 5 - Échange de produit</h2>
          
          <h3>5.1 Procédure</h3>
          <p>Nous ne proposons pas d'échange direct. Pour échanger un produit :</p>
          <ol>
            <li>Retournez le produit initial (procédure de rétractation)</li>
            <li>Attendez le remboursement</li>
            <li>Passez une nouvelle commande pour le produit souhaité</li>
          </ol>

          <p>Cette procédure garantit votre droit de rétractation de 14 jours sur le nouveau produit.</p>

          <h3>5.2 Exception : Produit défectueux</h3>
          <p>Si vous recevez un produit défectueux ou endommagé, contactez-nous immédiatement. Nous vous proposerons un échange rapide sans frais.</p>
        </section>

        {/* Article 6 : Produit défectueux ou erreur */}
        <section className="legal-section">
          <h2>Article 6 - Produit défectueux ou erreur de commande</h2>
          
          <h3>6.1 Produit défectueux</h3>
          <p>Si vous constatez un défaut de fabrication :</p>
          <ul>
            <li>Contactez-nous sous <strong>48h</strong> après réception</li>
            <li>Envoyez-nous des photos du défaut</li>
            <li>Conservez le produit et l'emballage</li>
          </ul>

          <p>Nous vous proposerons, selon votre choix :</p>
          <ul>
            <li>Un échange gratuit du produit</li>
            <li>Un remboursement intégral (produit + frais de livraison)</li>
          </ul>

          <p><strong>Les frais de retour sont à notre charge dans ce cas.</strong></p>

          <h3>6.2 Erreur de commande (de notre part)</h3>
          <p>Si vous recevez un produit différent de celui commandé :</p>
          <ul>
            <li>Contactez-nous immédiatement</li>
            <li>Ne renvoyez PAS le produit sans notre accord</li>
          </ul>

          <p>Nous organiserons la récupération du produit erroné et l'envoi du bon produit, tous frais à notre charge.</p>

          <h3>6.3 Colis endommagé</h3>
          <p>Si le colis est endommagé à la livraison :</p>
          <ol>
            <li>Refusez le colis ou émettez des réserves écrites auprès du livreur</li>
            <li>Prenez des photos du colis endommagé</li>
            <li>Contactez-nous sous 48h avec les photos</li>
          </ol>

          <p>Nous vous renverrons un nouveau produit sans frais.</p>
        </section>

        {/* Article 7 : Garantie légale */}
        <section className="legal-section">
          <h2>Article 7 - Garantie légale de conformité</h2>
          
          <p>Au-delà du délai de rétractation de 14 jours, vous bénéficiez de la garantie légale de conformité pendant <strong>2 ans</strong> à compter de la livraison.</p>

          <p>Pour plus d'informations, consultez nos <Link href="/cgv">Conditions Générales de Vente</Link>.</p>
        </section>

        {/* Contact */}
        <div className="legal-contact-box">
          <h3><Image src="/icones/mail.png" alt="Contact" width={24} height={24} /> Questions sur un retour ?</h3>
          <p>Notre équipe vous répond sous 48h :</p>
          <p>Email : <a href="mailto:[EMAIL]"><span className="to-fill">[EMAIL]</span></a></p>
          <p>Ou via notre <Link href="/contact">formulaire de contact</Link></p>
        </div>

        {/* Récapitulatif */}
        <section className="legal-section">
          <h2><Image src="/icones/instruction.png" alt="Récapitulatif" width={24} height={24} /> Récapitulatif</h2>
          
          <table className="legal-table">
            <thead>
              <tr>
                <th>Point</th>
                <th>Détail</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Délai de rétractation</td>
                <td><strong>14 jours</strong> à compter de la réception</td>
              </tr>
              <tr>
                <td>Délai de renvoi</td>
                <td><strong>14 jours</strong> après notification</td>
              </tr>
              <tr>
                <td>Frais de retour</td>
                <td><strong>À votre charge</strong> (sauf produit défectueux)</td>
              </tr>
              <tr>
                <td>État du produit</td>
                <td>Neuf, complet, emballage d'origine</td>
              </tr>
              <tr>
                <td>Délai de remboursement</td>
                <td><strong>14 jours maximum</strong> après réception</td>
              </tr>
              <tr>
                <td>Mode de remboursement</td>
                <td>Même moyen de paiement que l'achat</td>
              </tr>
              <tr>
                <td>Exceptions</td>
                <td>Produits personnalisés</td>
              </tr>
            </tbody>
          </table>
        </section>
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