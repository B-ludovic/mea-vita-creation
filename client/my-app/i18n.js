// Configuration de l'internationalisation
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Langues supportées
export const locales = ['fr', 'en'];

// Langue par défaut
export const defaultLocale = 'fr';

export default getRequestConfig(async ({ locale }) => {
  // Valider que la locale entrante est supportée
  if (!locales.includes(locale)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});