// Metadata réutilisable pour le SEO

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const siteName = 'Mea Vita Création';
const siteDescription = 'Découvrez nos créations artisanales uniques en maroquinerie africaine. Pochettes, porte-cartes, sacs en cuir de qualité supérieure, fabriqués à la main avec passion.';

// Metadata par défaut pour le site
export const defaultMetadata = {
  title: `${siteName} - Maroquinerie Artisanale Africaine`,
  description: siteDescription,
  keywords: ['maroquinerie', 'artisanal', 'cuir', 'africain', 'pochette', 'porte-cartes', 'sac', 'accessoires', 'fait main', 'luxe'],
  authors: [{ name: 'Mea Vita Création' }],
  creator: 'Mea Vita Création',
  publisher: 'Mea Vita Création',
  
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: baseUrl,
    siteName: siteName,
    title: `${siteName} - Maroquinerie Artisanale Africaine`,
    description: siteDescription,
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} - Maroquinerie Artisanale Africaine`,
    description: siteDescription,
    images: [`${baseUrl}/og-image.jpg`],
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  verification: {
    // Google Search Console (à ajouter plus tard)
    // google: 'ton-code-verification-google',
  },
};

// Fonction pour générer metadata pour une page produit
export const generateProductMetadata = (product) => {
  const imageUrl = product.ProductImage && product.ProductImage.length > 0 
    ? product.ProductImage[0].url 
    : `${baseUrl}/og-image.jpg`;

  return {
    title: `${product.name} - ${siteName}`,
    description: product.description || `Découvrez ${product.name}, une création artisanale unique en cuir. ${product.price}€`,
    keywords: [product.name, product.Category?.name, 'maroquinerie', 'cuir', 'artisanal', 'africain'],
    
    openGraph: {
      type: 'product',
      locale: 'fr_FR',
      url: `${baseUrl}/produits/${product.slug}`,
      siteName: siteName,
      title: `${product.name} - ${siteName}`,
      description: product.description || `Découvrez ${product.name}, une création artisanale unique.`,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
    
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} - ${siteName}`,
      description: product.description || `Découvrez ${product.name}`,
      images: [imageUrl],
    },
  };
};

// Fonction pour générer metadata pour une catégorie
export const generateCategoryMetadata = (category) => {
  return {
    title: `${category.name} - ${siteName}`,
    description: category.description || `Découvrez notre collection ${category.name} en maroquinerie artisanale africaine.`,
    keywords: [category.name, 'maroquinerie', 'cuir', 'artisanal', 'africain', 'collection'],
    
    openGraph: {
      type: 'website',
      locale: 'fr_FR',
      url: `${baseUrl}/categories/${category.slug}`,
      siteName: siteName,
      title: `${category.name} - ${siteName}`,
      description: category.description || `Découvrez notre collection ${category.name}`,
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: category.name,
        },
      ],
    },
  };
};

// JSON-LD pour structured data (Schema.org)
export const generateProductJsonLd = (product) => {
  const imageUrl = product.ProductImage && product.ProductImage.length > 0 
    ? product.ProductImage[0].url 
    : `${baseUrl}/og-image.jpg`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || `${product.name} - Maroquinerie artisanale`,
    image: imageUrl,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: siteName,
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/produits/${product.slug}`,
      priceCurrency: 'EUR',
      price: product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: siteName,
      },
    },
  };
};

// JSON-LD pour l'organisation
export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteName,
  url: baseUrl,
  logo: `${baseUrl}/Logo_Francois_sansfond.PNG`,
  description: siteDescription,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'À compléter',
    addressLocality: 'À compléter',
    postalCode: '00000',
    addressCountry: 'FR',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: 'À compléter',
    contactType: 'Customer Service',
    email: 'contact@meavitacreation.fr',
  },
  sameAs: [
    // 'https://www.facebook.com/meavitacreation',
    // 'https://www.instagram.com/meavitacreation',
  ],
};