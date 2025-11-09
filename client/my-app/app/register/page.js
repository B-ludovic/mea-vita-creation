// Directive pour indiquer que c'est un composant client (avec interactivité)
'use client';

// Import des hooks React
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Import du CSS
import '../../styles/Auth.css';

export default function RegisterPage() {
  // Router pour rediriger l'utilisateur après inscription
  const router = useRouter();
  
  // États (variables qui peuvent changer)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '' // Nouveau champ pour confirmer le mot de passe
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fonction qui s'exécute quand on tape dans un champ
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Fonction qui s'exécute quand on soumet le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setError('');
    setLoading(true);

    // Vérifier que les mots de passe correspondent
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    // Vérifier la longueur du mot de passe
    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      setLoading(false);
      return;
    }

    // Vérifier la complexité du mot de passe
    const hasUpperCase = /[A-Z]/.test(formData.password); // Au moins une majuscule
    const hasLowerCase = /[a-z]/.test(formData.password); // Au moins une minuscule
    const hasNumber = /[0-9]/.test(formData.password);     // Au moins un chiffre

    if (!hasUpperCase) {
      setError('Le mot de passe doit contenir au moins une majuscule');
      setLoading(false);
      return;
    }

    if (!hasLowerCase) {
      setError('Le mot de passe doit contenir au moins une minuscule');
      setLoading(false);
      return;
    }

    if (!hasNumber) {
      setError('Le mot de passe doit contenir au moins un chiffre');
      setLoading(false);
      return;
    }

    try {
      // Appel au back-end pour créer le compte
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
          // On n'envoie PAS confirmPassword au backend, c'est juste pour la vérification côté client
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Succès ! On sauvegarde le token et on redirige
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Déclencher un événement personnalisé pour notifier la connexion
        window.dispatchEvent(new Event('userLoggedIn'));
        
        router.push('/'); // Redirection vers la page d'accueil
      } else {
        // Erreur : on affiche le message
        setError(data.message || 'Une erreur est survenue');
      }
    } catch (err) {
      setError('Impossible de se connecter au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="title">Inscription</h1>
        <p className="subtitle">Rejoignez Mea Vita Création</p>

        {error && <div className="error-message">{error}</div>}        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">Prénom</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Nom</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="8"
            />
            <small style={{ color: '#666', fontSize: '0.85rem', display: 'block', marginTop: '5px' }}>
              • Minimum 8 caractères<br />
              • Au moins une majuscule<br />
              • Au moins une minuscule<br />
              • Au moins un chiffre
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength="8"
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Inscription...' : 'S\'inscrire'}
          </button>
        </form>

        <div className="auth-footer">
          Vous avez déjà un compte ?{' '}
          <Link href="/login">Se connecter</Link>
        </div>
      </div>
    </div>
  );
}