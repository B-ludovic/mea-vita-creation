// Génération du sitemap XML pour le SEO

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';
  
  try {
    // Récupérer tous les produits
    const productsRes = await fetch(`${apiUrl}/api/products`);
    const productsData = await productsRes.json();
    
    // Récupérer toutes les catégories
    const categoriesRes = await fetch(`${apiUrl}/api/categories`);
    const categoriesData = await categoriesRes.json();
    
    // Pages statiques
    const staticPages = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/categories`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/apropos`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
    ];
    
    // Pages catégories
    const categoryPages = categoriesData.success ? categoriesData.categories.map((category) => ({
      url: `${baseUrl}/categories/${category.slug}`,
      lastModified: new Date(category.updatedAt || new Date()),
      changeFrequency: 'weekly',
      priority: 0.8,
    })) : [];
    
    // Pages produits
    const productPages = productsData.success ? productsData.products.map((product) => ({
      url: `${baseUrl}/produits/${product.slug}`,
      lastModified: new Date(product.updatedAt || new Date()),
      changeFrequency: 'weekly',
      priority: 0.7,
    })) : [];
    
    return [...staticPages, ...categoryPages, ...productPages];
    
  } catch (error) {
    console.error('Erreur lors de la génération du sitemap:', error);
    
    // Retourner au moins les pages statiques en cas d'erreur
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];
  }
}