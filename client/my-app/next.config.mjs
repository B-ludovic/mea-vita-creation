/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Désactive l'optimisation d'images pour éviter les erreurs 400
  },
};

export default nextConfig;
