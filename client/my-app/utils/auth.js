// Utilitaire d'authentification pour gérer les Refresh Tokens
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';

// Variable pour éviter les rafraîchissements multiples simultanés
let isRefreshing = false;
let refreshPromise = null;

export const setTokens = (accessToken, refreshToken) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
};

export const getAccessToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
};

export const getRefreshToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken');
};

export const clearTokens = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
};

// Fonction pour rafraîchir le token d'accès
export const refreshAccessToken = async () => {
    // Si un rafraîchissement est déjà en cours, attendre sa résolution
    if (isRefreshing && refreshPromise) {
        return refreshPromise;
    }

    isRefreshing = true;

    refreshPromise = (async () => {
        try {
            const refreshToken = getRefreshToken();

            if (!refreshToken) {
                throw new Error('No refresh token');
            }

            const response = await fetch(`${API_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken })
            });

            const data = await response.json();

            if (data.success) {
                // Mettre à jour uniquement l'Access Token
                localStorage.setItem('accessToken', data.accessToken);
                return data.accessToken;
            } else {
                // Refresh token invalide ou expiré
                clearTokens();
                window.location.href = '/login';
                throw new Error('Refresh token expired');
            }
        } catch (error) {
            console.error('Erreur refresh token:', error.message);
            clearTokens();
            window.location.href = '/login';
            throw error;
        } finally {
            isRefreshing = false;
            refreshPromise = null;
        }
    })();

    return refreshPromise;
};

// Fonction FETCH avec gestion automatique du rafraîchissement du token

export const fetchWithAuth = async (url, options = {}) => {
    let accessToken = getAccessToken();

    // Ajouter l'Access Token dans les headers
    const authOptions = {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${accessToken}`
        }
    };

    // Première tentative
    let response = await fetch(url, authOptions);

    // Si erreur 401 (token expiré)
    if (response.status === 401) {
        console.log('Access Token expiré, rafraîchissement...');

        try {
            // Rafraîchir le token
            const newAccessToken = await refreshAccessToken();

            // Réessayer la requête avec le nouveau token
            authOptions.headers['Authorization'] = `Bearer ${newAccessToken}`;
            response = await fetch(url, authOptions);

            console.log('Token rafraîchi avec succès');
        } catch (error) {
            // Si le refresh échoue, rediriger vers login
            console.error('Impossible de rafraîchir le token');
            clearTokens();
            window.location.href = '/login';
            throw error;
        }
    }

    return response;
};

// Fonction de deconnexion

export const logout = async () => {
    try {
        const refreshToken = getRefreshToken();

        if (refreshToken) {
            // Appeler l'API pour supprimer le refresh token côté serveur
            await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken })
            });
        }
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error.message);
    } finally {
        // Toujours supprimer les tokens localement
        clearTokens();
        window.location.href = '/login';
    }
};

// Fonction pour vérifier si l'utilisateur est authentifié

export const isAuthenticated = () => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();
    return !!(accessToken && refreshToken);
};