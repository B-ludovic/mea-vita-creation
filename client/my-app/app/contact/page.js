// Page Contact - Mea Vita Création
// Cette page permet aux clients de nous contacter
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Modal from '../../components/Modal';
import { useModal } from '../../hooks/useModal';
import '../../styles/Contact.css';

export default function ContactPage() {
  const { modalState, showAlert, closeModal } = useModal();

  // STATE pour gérer le formulaire
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: '',
    message: '',
    website: '' // ← Champ honeypot (invisible)
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // FONCTION pour gérer les changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // FONCTION pour gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        showAlert(
          data.message || 'Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.',
          'Message envoyé',
          '/icones/sent-mail.png'
        );
        // Réinitialiser le formulaire (SANS réinitialiser website pour ne pas alerter les bots)
        setFormData({
          name: '',
          email: '',
          phone: '',
          interest: '',
          message: '',
          website: '' // ← Toujours réinitialiser le honeypot
        });
      } else {
        showAlert(
          data.message || 'Erreur lors de l\'envoi du message',
          'Erreur',
          '/icones/annuler.png'
        );
      }
    } catch (error) {
      console.error('Erreur:', error);
      showAlert(
        'Erreur lors de l\'envoi du message. Veuillez réessayer.',
        'Erreur',
        '/icones/annuler.png'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Section Hero - Bannière du haut */}
      <section className="contact-hero">
        <div className="container">
          <div className="contact-hero-content">
            <h1>Contactez-Nous</h1>
            <p>Créons ensemble votre pièce d&apos;exception</p>
          </div>
        </div>
      </section>

      {/* Section Contenu Principal */}
      <section className="contact-content">
        <div className="container">
          <div className="contact-grid">
            
            {/* COLONNE GAUCHE - Formulaire de contact */}
            <div className="contact-form-section">
              <h2>Parlons de Votre Projet</h2>
              <p>
                Vous avez une idée, un projet personnalisé ou des questions sur nos créations ? 
                Nous serions ravis d&apos;échanger avec vous.
              </p>
              
              <form className="contact-form" onSubmit={handleSubmit}>
                
                {/* HONEYPOT - Champ invisible anti-bot */}
                
                <div 
                  style={{ 
                    position: 'absolute', 
                    left: '-5000px',
                    width: '1px',
                    height: '1px',
                    overflow: 'hidden'
                  }} 
                  aria-hidden="true"
                >
                  <label htmlFor="website">Site web (ne pas remplir)</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    tabIndex="-1"
                    autoComplete="off"
                  />
                </div>
                
                {/* Champ Nom */}
                <div className="form-group">
                  <label htmlFor="name">Nom complet *</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleChange}
                    required 
                  />
                </div>
                
                {/* Champ Email */}
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleChange}
                    required 
                  />
                </div>
                
                {/* Champ Téléphone */}
                <div className="form-group">
                  <label htmlFor="phone">Téléphone</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                
                {/* Champ Intérêt - Liste déroulante avec les catégories */}
                <div className="form-group">
                  <label htmlFor="interest">Votre intérêt</label>
                  <select 
                    id="interest" 
                    name="interest"
                    value={formData.interest}
                    onChange={handleChange}
                  >
                    <option value="">Sélectionnez...</option>
                    <option value="pochettes-unisexe">Pochettes Unisexe</option>
                    <option value="porte-carte">Porte-Carte</option>
                    <option value="sac-cylindre">Sac Cylindre</option>
                    <option value="sac-u">Sac U</option>
                    <option value="creation-personnalisee">Création personnalisée</option>
                    <option value="information-generale">Information générale</option>
                  </select>
                </div>
                
                {/* Champ Message */}
                <div className="form-group">
                  <label htmlFor="message">Votre message *</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows="5" 
                    value={formData.message}
                    onChange={handleChange}
                    required 
                    placeholder="Décrivez-nous votre projet ou posez-nous vos questions..."
                  />
                </div>
                
                {/* Bouton Envoyer */}
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
              </form>
            </div>

            {/* COLONNE DROITE - Informations de contact */}
            <div className="contact-info-section">
              <h2>Informations de Contact</h2>
              
              {/* Méthodes de contact */}
              <div className="contact-methods">
                
                {/* Email */}
                <div className="contact-method">
                  <div className="contact-icon">
                    <Image src="/icones/mail.png" alt="Email" width={40} height={40} />
                  </div>
                  <div className="contact-details">
                    <h3>Email</h3>
                    <p>contact@meavita-creation.com</p>
                    <span>Réponse sous 24h</span>
                  </div>
                </div>
                
                {/* WhatsApp */}
                <div className="contact-method">
                  <div className="contact-icon">
                    <Image src="/icones/iphone.png" alt="WhatsApp" width={40} height={40} />
                  </div>
                  <div className="contact-details">
                    <h3>WhatsApp</h3>
                    <p>+33 X XX XX XX XX</p>
                    <span>Messages et appels</span>
                  </div>
                </div>
                
                {/* Atelier */}
                <div className="contact-method">
                  <div className="contact-icon">
                    <Image src="/icones/location.png" alt="Localisation" width={40} height={40} />
                  </div>
                  <div className="contact-details">
                    <h3>Atelier</h3>
                    <p>Sur rendez-vous uniquement</p>
                    <span>Consultations personnalisées</span>
                  </div>
                </div>
              </div>

              {/* GRILLE pour Social et FAQ côte à côte -- CETTE PARTIE EST MAINTENANT VIDE */}
              {/* <div className="info-grid">
                ... 
              </div> */}
            </div>
            

            {/* COLONNE RANGÉE 2 - Réseaux Sociaux */}
            <div className="social-section">
              <h3>Suivez Notre Actualité</h3>
              <div className="social-links-contact">
                
                {/* Instagram */}
                <a href="https://www.instagram.com/mv.meavita/?igsh=MTc4YjdscjA5NnQ4MA%3D%3D" target="_blank" rel="noopener noreferrer" className="social-link-item">
                  <div className="social-icon">
                    <Image src="/icones/instagram.png" alt="Instagram" width={30} height={30} />
                  </div>
                  <div className="social-info">
                    <h4>Instagram</h4>
                    <p>@mv.meavita</p>
                  </div>
                </a>
                
                {/* WhatsApp Business */}
                <a href="#" className="social-link-item">
                  <div className="social-icon">
                    <Image src="/icones/chat.png" alt="WhatsApp" width={30} height={30} />
                  </div>
                  <div className="social-info">
                    <h4>WhatsApp Business</h4>
                    <p>Chat direct</p>
                  </div>
                </a>
              </div>
            </div>

            {/* COLONNE RANGÉE 2 - Questions Fréquentes */}
            <div className="faq-preview">
              <h3>Questions Fréquentes</h3>
              
              <div className="faq-item">
                <h4>Délais de création</h4>
                <p>Comptez 2 à 4 semaines selon la complexité de la pièce.</p>
              </div>
              
              <div className="faq-item">
                <h4>Personnalisation</h4>
                <p>Toutes nos créations peuvent être personnalisées.</p>
              </div>
              
              <div className="faq-item">
                <h4>Entretien</h4>
                <p>Conseils d&apos;entretien fournis avec chaque création.</p>
              </div>
            </div>

          </div> {/* Fin de .contact-grid */}
        </div> {/* Fin de .container */}
      </section>

      {/* Section Processus de Collaboration */}
      <section className="contact-process">
        <div className="container">
          <h2>Notre Processus de Collaboration</h2>
          <div className="process-timeline">
            
            {/* Étape 1 */}
            <div className="timeline-item">
              <div className="timeline-number">1</div>
              <div className="timeline-content">
                <h3>Premier Contact</h3>
                <p>Vous nous contactez via le formulaire ou nos réseaux sociaux</p>
              </div>
            </div>
            
            {/* Étape 2 */}
            <div className="timeline-item">
              <div className="timeline-number">2</div>
              <div className="timeline-content">
                <h3>Consultation</h3>
                <p>Nous échangeons sur vos goûts, besoins et budget</p>
              </div>
            </div>
            
            {/* Étape 3 */}
            <div className="timeline-item">
              <div className="timeline-number">3</div>
              <div className="timeline-content">
                <h3>Proposition</h3>
                <p>Nous vous proposons des designs et matériaux adaptés</p>
              </div>
            </div>
            
            {/* Étape 4 */}
            <div className="timeline-item">
              <div className="timeline-number">4</div>
              <div className="timeline-content">
                <h3>Création</h3>
                <p>Nos artisans donnent vie à votre pièce unique</p>
              </div>
            </div>
            
            {/* Étape 5 */}
            <div className="timeline-item">
              <div className="timeline-number">5</div>
              <div className="timeline-content">
                <h3>Livraison</h3>
                <p>Votre création vous est livrée avec ses conseils d&apos;entretien</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal pour les notifications */}
      <Modal
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        icon={modalState.icon}
        onConfirm={modalState.onConfirm}
        onCancel={modalState.onCancel}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        showCancelButton={modalState.showCancelButton}
      />
    </>
  );
}