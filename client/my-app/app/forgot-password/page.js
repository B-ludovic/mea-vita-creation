'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import '../../styles/Auth.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.message || 'Une erreur est survenue');
      }
    } catch (err) {
      setError('Impossible de se connecter au serveur');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Image 
              src="/email.png" 
              alt="Email envoyé" 
              width={80} 
              height={80}
            />
          </div>
          <h1 style={{ textAlign: 'center' }}>Email envoyé !</h1>
          <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '2rem' }}>
            Si un compte existe avec cette adresse email, vous recevrez un lien de réinitialisation.
          </p>
          <p style={{ textAlign: 'center', color: 'var(--text-light)', fontSize: '0.9rem' }}>
            Pensez à vérifier vos spams si vous ne le trouvez pas.
          </p>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/login" className="btn-secondary">
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Mot de passe oublié ?</h1>
        <p className="subtitle">
          Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>

        {error && <div className="error-message">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="votre@email.com"
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
          </button>
        </form>

        <div className="auth-footer">
          Vous vous souvenez de votre mot de passe ?{' '}
          <Link href="/login">Se connecter</Link>
        </div>
      </div>
    </div>
  );
}
