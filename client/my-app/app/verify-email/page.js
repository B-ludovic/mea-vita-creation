'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import '../../styles/Auth.css';

export default function VerifyEmailPage() {
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
          
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));

          setTimeout(() => {
            router.push('/');
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
      <div className="auth-card" style={{ maxWidth: '500px', textAlign: 'center' }}>
        {status === 'loading' && (
          <>
            <div style={{ marginBottom: '20px' }}>
              <Image src="/sand-timer.png" alt="Chargement" width={80} height={80} />
            </div>
            <h2>Vérification en cours...</h2>
            <p style={{ color: 'var(--text-light)' }}>Veuillez patienter</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{ marginBottom: '20px' }}>
              <Image src="/validation.png" alt="Succès" width={80} height={80} />
            </div>
            <h2 style={{ color: 'var(--success)' }}>Email vérifié avec succès !</h2>
            <p style={{ color: 'var(--text-light)', marginTop: '10px' }}>
              {message}
            </p>
            <p style={{ color: 'var(--text-light)', marginTop: '10px' }}>
              Redirection automatique vers l&apos;accueil...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{ marginBottom: '20px' }}>
              <Image src="/error.png" alt="Erreur" width={80} height={80} />
            </div>
            <h2 style={{ color: 'var(--danger)' }}>Erreur de vérification</h2>
            <p style={{ color: 'var(--text-light)', marginTop: '10px' }}>
              {message}
            </p>
            <div style={{ marginTop: '30px' }}>
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
