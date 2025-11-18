// Page Politique de Livraison
import Link from 'next/link';
import Image from 'next/image';
import '../../styles/Legal.css';

export const metadata = {
  title: 'Politique de Livraison | François Maroquinerie',
  description: 'Informations sur la livraison - François Maroquinerie'
};

export default function PolitiqueLivraison() {
  return (
    <div className="legal-page">
      <Link href="/" className="legal-back-link">
        <Image src="/icones/arrow.png" alt="Retour" width={20} height={20} />
        Retour à l'accueil
      </Link>

      <div className="legal-header">
        <h1>Politique de Livraison</h1>
        <p className="legal-date">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
      </div>

      <div className="legal-content">
        
        {/* Préambule */}
        <section className="legal-section">
          <div className="legal-alert legal-alert-info">
            <strong><Image src="/icones/delivery-box.png" alt="Livraison" width={24} height={24} /> Livraison rapide et sécurisée</strong>
            <p>Nous expédions vos commandes avec soin pour garantir une livraison rapide et sécurisée de vos produits en cuir artisanal.</p>
          </div>
        </section>

        {/* Article 1 : Zones de livraison */}
        <section className="legal-section">
          <h2>Article 1 - Zones de livraison</h2>
          
          <h3>1.1 France métropolitaine</h3>
          <p>Nous livrons dans toute la France métropolitaine (Corse incluse).</p>

          <h3>1.2 Europe</h3>
          <p>Nous livrons dans les pays suivants :</p>
          <div className="legal-highlight">
            <p>Allemagne, Autriche, Belgique, Bulgarie, Croatie, Danemark, Espagne, Estonie, Finlande, Grèce, Hongrie, Irlande, Italie, Lettonie, Lituanie, Luxembourg, Pays-Bas, Pologne, Portugal, République Tchèque, Roumanie, Slovaquie, Slovénie, Suède.</p>
          </div>

          <h3>1.3 DOM-TOM et International</h3>
          <p>Pour les livraisons vers les DOM-TOM et autres destinations internationales, contactez-nous pour un devis personnalisé à <span className="to-fill">[EMAIL]</span>.</p>

          <div className="legal-alert legal-alert-warning">
            <strong><Image src="/icones/error.png" alt="Attention" width={24} height={24} /> Douanes</strong>
            <p>Pour les livraisons hors Union Européenne, des frais de douane peuvent s'appliquer à la réception. Ces frais sont à la charge du destinataire.</p>
          </div>
        </section>

        {/* Article 2 : Délais de préparation */}
        <section className="legal-section">
          <h2>Article 2 - Délais de préparation</h2>
          
          <h3>2.1 Préparation de commande</h3>
          <p>Vos commandes sont préparées avec soin dans un délai de <span className="to-fill">[1-3 jours ouvrés]</span> après validation du paiement.</p>

          <h3>2.2 Commandes passées le week-end</h3>
          <p>Les commandes passées le samedi et le dimanche sont traitées à partir du lundi suivant.</p>

          <h3>2.3 Périodes de forte activité</h3>
          <p>Pendant les périodes de soldes, fêtes de fin d'année ou promotions spéciales, les délais de préparation peuvent être légèrement prolongés. Nous vous en informerons par email.</p>
        </section>

        {/* Article 3 : Modes de livraison et tarifs */}
        <section className="legal-section">
          <h2>Article 3 - Modes de livraison et tarifs</h2>
          
          <h3>3.1 France métropolitaine</h3>
          <table className="legal-table">
            <thead>
              <tr>
                <th>Mode de livraison</th>
                <th>Délai estimé</th>
                <th>Prix</th>
                <th>Suivi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Colissimo</strong></td>
                <td><span className="to-fill">[2-3 jours ouvrés]</span></td>
                <td><span className="to-fill">[6,90€]</span></td>
                <td><Image src="/icones/ok.png" alt="Check" width={16} height={16} /> Oui</td>
              </tr>
              <tr>
                <td><strong>Colissimo Recommandé</strong></td>
                <td><span className="to-fill">[2-3 jours ouvrés]</span></td>
                <td><span className="to-fill">[8,90€]</span></td>
                <td><Image src="/icones/ok.png" alt="Check" width={16} height={16} /> Oui + Signature</td>
              </tr>
              <tr>
                <td><strong>Chronopost</strong></td>
                <td><span className="to-fill">[24h]</span></td>
                <td><span className="to-fill">[14,90€]</span></td>
                <td><Image src="/icones/ok.png" alt="Check" width={16} height={16} /> Oui</td>
              </tr>
            </tbody>
          </table>

          <div className="legal-highlight">
            <p><strong><Image src="/icones/promouvoir.png" alt="Cadeau" width={20} height={20} /> Livraison offerte</strong></p>
            <p>À partir de <span className="to-fill">[XX€]</span> d'achat en France métropolitaine (hors Chronopost)</p>
          </div>

          <h3>3.2 Europe</h3>
          <table className="legal-table">
            <thead>
              <tr>
                <th>Zone</th>
                <th>Délai estimé</th>
                <th>Prix</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Zone 1</strong> (Belgique, Luxembourg, Allemagne)</td>
                <td><span className="to-fill">[4-6 jours ouvrés]</span></td>
                <td><span className="to-fill">[12,90€]</span></td>
              </tr>
              <tr>
                <td><strong>Zone 2</strong> (Autres pays UE)</td>
                <td><span className="to-fill">[5-8 jours ouvrés]</span></td>
                <td><span className="to-fill">[15,90€]</span></td>
              </tr>
            </tbody>
          </table>

          <h3>3.3 Précisions</h3>
          <p>Les délais indiqués sont des estimations à partir de la date d'expédition et ne tiennent pas compte des délais de préparation.</p>

          <p>Les frais de livraison sont calculés automatiquement dans le panier en fonction de votre adresse de livraison.</p>
        </section>

        {/* Article 4 : Suivi de commande */}
        <section className="legal-section">
          <h2>Article 4 - Suivi de commande</h2>
          
          <h3>4.1 Email de confirmation d'expédition</h3>
          <p>Dès l'expédition de votre colis, vous recevez un email contenant :</p>
          <ul>
            <li><Image src="/icones/ok.png" alt="Check" width={16} height={16} /> Le numéro de suivi</li>
            <li><Image src="/icones/ok.png" alt="Check" width={16} height={16} /> Le nom du transporteur</li>
            <li><Image src="/icones/ok.png" alt="Check" width={16} height={16} /> Le lien de tracking pour suivre votre colis en temps réel</li>
          </ul>

          <h3>4.2 Suivre votre colis</h3>
          <p>Vous pouvez suivre votre colis de plusieurs manières :</p>
          <ul>
            <li>Via le lien dans l'email d'expédition</li>
            <li>Dans votre <Link href="/espace-client/commandes">espace client</Link></li>
            <li>Sur le site du transporteur</li>
          </ul>

          <h3>4.3 Notification de livraison</h3>
          <p>Vous recevez une notification lorsque :</p>
          <ul>
            <li>Votre colis est en cours de livraison</li>
            <li>Votre colis est livré</li>
            <li>Un problème de livraison survient</li>
          </ul>
        </section>

        {/* Article 5 : Réception du colis */}
        <section className="legal-section">
          <h2>Article 5 - Réception du colis</h2>
          
          <h3>5.1 Vérification à la réception</h3>
          <p>À la réception de votre colis, nous vous recommandons de :</p>
          <ol>
            <li>Vérifier l'état du colis en présence du livreur</li>
            <li>Refuser le colis ou émettre des réserves écrites si l'emballage est endommagé</li>
            <li>Prendre des photos en cas de dommage</li>
            <li>Nous contacter sous 48h si problème</li>
          </ol>

          <div className="legal-alert legal-alert-important">
            <strong><Image src="/icones/error.png" alt="Important" width={24} height={24} /> Colis endommagé</strong>
            <p>Si le colis est visiblement endommagé à la livraison :</p>
            <ul>
              <li><strong>Refusez le colis</strong> ou émettez des <strong>réserves écrites</strong> auprès du livreur</li>
              <li>Prenez des <strong>photos</strong> du colis endommagé</li>
              <li>Contactez-nous sous <strong>48h</strong> à <span className="to-fill">[EMAIL]</span></li>
            </ul>
            <p>Nous vous renverrons un nouveau produit sans frais.</p>
          </div>

          <h3>5.2 Livraison en point relais</h3>
          <p>Si vous choisissez la livraison en point relais :</p>
          <ul>
            <li>Vous recevez un email/SMS dès l'arrivée du colis</li>
            <li>Vous avez <strong>14 jours</strong> pour retirer votre colis</li>
            <li>Munissez-vous d'une pièce d'identité</li>
          </ul>

          <p>Passé ce délai, le colis nous sera retourné et les frais de réexpédition seront à votre charge.</p>

          <h3>5.3 Absence lors de la livraison</h3>
          <p>Si vous êtes absent lors du passage du livreur :</p>
          <ul>
            <li>Un avis de passage sera déposé dans votre boîte aux lettres</li>
            <li>Vous aurez 15 jours pour retirer votre colis en bureau de poste</li>
            <li>Ou organiser une nouvelle livraison via le transporteur</li>
          </ul>

          <p>Après ce délai, le colis nous sera retourné. Vous serez remboursé du montant de la commande, déduction faite des frais de livraison aller-retour.</p>
        </section>

        {/* Article 6 : Problèmes de livraison */}
        <section className="legal-section">
          <h2>Article 6 - Problèmes de livraison</h2>
          
          <h3>6.1 Retard de livraison</h3>
          <p>Si votre colis n'arrive pas dans les délais estimés :</p>
          <ol>
            <li>Vérifiez le suivi de votre colis (lien dans l'email)</li>
            <li>Contactez-nous si le retard dépasse 3 jours ouvrés</li>
            <li>Nous lancerons une enquête auprès du transporteur</li>
          </ol>

          <h3>6.2 Colis perdu</h3>
          <p>En cas de perte du colis par le transporteur :</p>
          <ul>
            <li>Nous ouvrons une enquête auprès du transporteur</li>
            <li>Si la perte est confirmée, nous vous proposons :
              <ul>
                <li>Un remboursement intégral</li>
                <li>Ou le renvoi gratuit d'un nouveau produit</li>
              </ul>
            </li>
          </ul>

          <h3>6.3 Adresse de livraison incorrecte</h3>
          <p>Si vous avez saisi une adresse incorrecte :</p>
          <ul>
            <li>Contactez-nous immédiatement</li>
            <li>Si le colis n'a pas encore été expédié, nous modifierons l'adresse gratuitement</li>
            <li>Si le colis est déjà en cours de livraison, des frais supplémentaires peuvent s'appliquer</li>
          </ul>

          <p>Si le colis nous est retourné pour adresse erronée, les frais de réexpédition seront à votre charge.</p>
        </section>

        {/* Article 7 : Emballage */}
        <section className="legal-section">
          <h2>Article 7 - Emballage</h2>
          
          <h3>7.1 Emballage soigné</h3>
          <p>Tous nos produits sont emballés avec soin dans des colis robustes pour garantir leur protection pendant le transport.</p>

          <h3>7.2 Emballage écologique</h3>
          <p>Nous utilisons des matériaux d'emballage recyclables et éco-responsables dans la mesure du possible :</p>
          <ul>
            <li>Cartons recyclés</li>
            <li>Papier kraft</li>
            <li>Calage en papier</li>
          </ul>

          <h3>7.3 Emballage cadeau</h3>
          <p>Un service d'emballage cadeau est disponible lors de la commande pour <span className="to-fill">[X€]</span>.</p>
        </section>

        {/* Article 8 : Livraisons spéciales */}
        <section className="legal-section">
          <h2>Article 8 - Livraisons spéciales</h2>
          
          <h3>8.1 Livraison express</h3>
          <p>Pour les commandes urgentes, nous proposons une livraison express sous 24h en France métropolitaine via Chronopost.</p>

          <p><Image src="/icones/error.png" alt="Attention" width={16} height={16} /> Les commandes doivent être passées avant <span className="to-fill">[12h]</span> pour une expédition le jour même.</p>

          <h3>8.2 Livraison pour entreprises</h3>
          <p>Pour les commandes professionnelles ou en grande quantité, contactez-nous pour des conditions de livraison spécifiques.</p>

          <h3>8.3 Livraison à une autre adresse</h3>
          <p>Vous pouvez faire livrer votre commande à une adresse différente de votre adresse de facturation (cadeau, bureau, etc.).</p>

          <p>Indiquez simplement l'adresse de livraison souhaitée lors de votre commande.</p>
        </section>

        {/* Contact */}
        <div className="legal-contact-box">
          <h3><Image src="/icones/mail.png" alt="Contact" width={24} height={24} /> Questions sur la livraison ?</h3>
          <p>Notre équipe vous répond rapidement :</p>
          <p>Email : <a href="mailto:[EMAIL]"><span className="to-fill">[EMAIL]</span></a></p>
          <p>Ou via notre <Link href="/contact">formulaire de contact</Link></p>
        </div>

        {/* Récapitulatif */}
        <section className="legal-section">
          <h2><Image src="/icones/instruction.png" alt="Récapitulatif" width={24} height={24} /> Récapitulatif rapide</h2>
          
          <table className="legal-table">
            <thead>
              <tr>
                <th>Information</th>
                <th>Détail</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Préparation</td>
                <td><span className="to-fill">[1-3 jours ouvrés]</span></td>
              </tr>
              <tr>
                <td>Livraison France</td>
                <td><span className="to-fill">[2-3 jours ouvrés]</span></td>
              </tr>
              <tr>
                <td>Livraison Europe</td>
                <td><span className="to-fill">[4-8 jours ouvrés]</span></td>
              </tr>
              <tr>
                <td>Frais de livraison</td>
                <td>À partir de <span className="to-fill">[6,90€]</span></td>
              </tr>
              <tr>
                <td>Livraison offerte</td>
                <td>Dès <span className="to-fill">[XX€]</span> d'achat</td>
              </tr>
              <tr>
                <td>Suivi</td>
                <td><Image src="/icones/ok.png" alt="Check" width={16} height={16} /> Oui, sur tous les envois</td>
              </tr>
              <tr>
                <td>Transporteurs</td>
                <td>Colissimo, Chronopost, <span className="to-fill">[Autres]</span></td>
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