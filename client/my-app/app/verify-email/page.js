'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { setTokens } from '../../utils/auth';
import '../../styles/Auth.css';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Vérification en cours...');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Token de vérification manquant');
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-email/${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message);
          
          // Stocker les 2 tokens (Access + Refresh)
          setTokens(data.accessToken, data.refreshToken);
          localStorage.setItem('user', JSON.stringify(data.user));

          setTimeout(() => {
            window.location.href = '/';
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.message);
        }
      } catch (error) {
        console.error('Erreur:', error);
        setStatus('error');
        setMessage('Erreur lors de la vérification');
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="auth-container">
      <div className="auth-card verify-card">
        {status === 'loading' && (
          <>
            <div className="verify-icon-wrapper">
              <Image src="/icones/sand-timer.png" alt="Chargement" width={80} height={80} />
            </div>
            <h2>Vérification en cours...</h2>
            <p className="verify-text-light">Veuillez patienter</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="verify-icon-wrapper">
              <Image src="/icones/validation.png" alt="Succès" width={80} height={80} />
            </div>
            <h2 className="verify-text-success">Email vérifié avec succès !</h2>
            <p className="verify-message">
              {message}
            </p>
            <p className="verify-message">
              Redirection automatique vers l&apos;accueil...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="verify-icon-wrapper">
              <Image src="/icones/error.png" alt="Erreur" width={80} height={80} />
            </div>
            <h2 className="verify-text-danger">Erreur de vérification</h2>
            <p className="verify-message">
              {message}
            </p>
            <div className="verify-actions">
              <button 
                onClick={() => router.push('/login')}
                className="auth-button"
              >
                Retour à la connexion
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="auth-container">
        <div className="auth-card verify-card">
          <div className="verify-icon-wrapper">
            <Image src="/icones/sand-timer.png" alt="Chargement" width={80} height={80} />
          </div>
          <h2>Chargement...</h2>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
