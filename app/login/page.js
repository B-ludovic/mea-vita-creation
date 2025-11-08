// Directive pour indiquer que c'est un composant client (avec interactivité)
'use client';

// Import des hooks React
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Import du CSS
import '../../styles/Auth.css';

export default function LoginPage() {
  // Router pour rediriger l'utilisateur après connexion
  const router = useRouter();
  
  // États (variables qui peuvent changer)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    try {
      // Appel au back-end pour se connecter
      const response = await fetch('http://localhost:5002/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
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
        setError(data.message || 'Email ou mot de passe incorrect');
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
        <h1>Connexion</h1>
        <p className="subtitle">Accédez à votre compte</p>

        {error && <div className="error-message">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
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
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="auth-footer">
          Vous n'avez pas de compte ?{' '}
          <Link href="/register">S'inscrire</Link>
        </div>
      </div>
    </div>
  );
}