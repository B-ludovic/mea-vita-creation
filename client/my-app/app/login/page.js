// Directive pour indiquer que c'est un composant client (avec interactivité)
'use client';

// Import des hooks React
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { setTokens } from '../../utils/auth';

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
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Stocker les 2 tokens (Access + Refresh)
        setTokens(data.accessToken, data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirection avec rechargement complet pour mettre à jour le header
        window.location.href = '/';
      } else {
        setError(data.message || 'Erreur de connexion');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur de connexion au serveur');
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
          <div className="auth-forgot-password">
            <Link href="/forgot-password">
              Mot de passe oublié ?
            </Link>
          </div>
          Vous n&apos;avez pas de compte ?{' '}
          <Link href="/register">S&apos;inscrire</Link>
        </div>
      </div>
    </div>
  );
}