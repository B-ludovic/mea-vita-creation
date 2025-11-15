// Page Dashboard Admin avec graphiques
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import '../../../styles/Dashboard.css';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [salesByMonth, setSalesByMonth] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllStats = async () => {
    try {
      // Récupérer le token depuis localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Pas de token - accès non autorisé');
        router.push('/login');
        return;
      }

      // Headers avec authentification
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Récupérer les statistiques globales
      const statsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stats`, { headers });
      
      if (statsRes.status === 401 || statsRes.status === 403) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }
      
      const statsData = await statsRes.json();

      // Récupérer les ventes par mois
      const salesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stats/sales-by-month`, { headers });
      const salesData = await salesRes.json();

      // Récupérer les top produits
      const topRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stats/top-products?limit=5`, { headers });
      const topData = await topRes.json();

      if (statsData.success) {
        setStats(statsData.stats);
      } else {
        setError(statsData.message || 'Erreur lors du chargement des stats');
      }

      if (salesData.success) {
        // Formater les données pour les graphiques
        const formattedSales = salesData.salesByMonth.map(item => ({
          mois: new Date(item.month + '-01').toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
          CA: item.revenue,
          commandes: item.orders
        }));
        setSalesByMonth(formattedSales);
      }

      if (topData.success) {
        const formattedTop = topData.topProducts.map(item => ({
          nom: item.product.name,
          ventes: item.quantitySold,
          CA: item.revenue
        }));
        setTopProducts(formattedTop);
      }

    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="admin-header">
        <h1>Chargement des statistiques...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-header">
        <h1>Erreur</h1>
        <p style={{ color: 'var(--primary-orange)' }}>{error}</p>
      </div>
    );
  }

  // Couleurs pour les graphiques
  const COLORS = ['#FF6B35', '#008B8B', '#FFD700', '#4B0082', '#FF8C42'];

  // Traduction des statuts de commande
  const statusTranslation = {
    'PENDING': 'En attente',
    'PAID': 'Payé',
    'DELIVERED': 'Livré',
    'CANCELLED': 'Annulé',
    'REFUNDED': 'Remboursé'
  };

  // Données pour le graphique camembert des statuts
  const statusData = stats?.ordersByStatus?.map(item => ({
    name: statusTranslation[item.status] || item.status,
    value: item._count.status
  })) || [];

  return (
    <>
      <div className="admin-header">
        <h1>Dashboard Analytics</h1>
        <p>Vue d&apos;ensemble de votre boutique</p>
      </div>

      {/* Cartes de statistiques */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Commandes</span>
            <span className="stat-card-icon">
              <Image src="/delivery-box.png" alt="Commandes" width={40} height={40} />
            </span>
          </div>
          <div className="stat-card-value">{stats?.totalOrders || 0}</div>
          <div className="stat-card-change">Total des commandes</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Chiffre d&apos;affaires</span>
            <span className="stat-card-icon">
              <Image src="/chiffre-affaire.png" alt="Revenus" width={40} height={40} />
            </span>
          </div>
          <div className="stat-card-value">{stats?.totalRevenue?.toFixed(2) || '0.00'}€</div>
          <div className="stat-card-change">Revenus totaux</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Panier moyen</span>
            <span className="stat-card-icon">
              <Image src="/shopping.png" alt="Panier" width={40} height={40} />
            </span>
          </div>
          <div className="stat-card-value">{stats?.averageOrderValue?.toFixed(2) || '0.00'}€</div>
          <div className="stat-card-change">Valeur moyenne par commande</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Produits</span>
            <span className="stat-card-icon">
              <Image src="/shopping.png" alt="Produits" width={40} height={40} />
            </span>
          </div>
          <div className="stat-card-value">{stats?.totalProducts || 0}</div>
          <div className="stat-card-change">Produits actifs</div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="charts-grid">
        
        {/* Graphique des ventes par mois */}
        {salesByMonth.length > 0 && (
          <div className="admin-table-container">
            <div className="chart-header">
              <Image src="/evolution.png" alt="Graphique" width={24} height={24} />
              <h2>Évolution des ventes</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="CA" 
                  stroke="#FF6B35" 
                  strokeWidth={3}
                  name="Chiffre d'affaires (€)"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="commandes" 
                  stroke="#008B8B" 
                  strokeWidth={3}
                  name="Nombre de commandes"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Graphique des produits les plus vendus */}
        {topProducts.length > 0 && (
          <div className="admin-table-container">
            <div className="chart-header">
              <Image src="/trophy.png" alt="Trophée" width={24} height={24} />
              <h2>Top 5 produits</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nom" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="ventes" fill="#FF6B35" name="Quantité vendue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Graphique camembert des statuts */}
        {statusData.length > 0 && (
          <div className="admin-table-container">
            <div className="chart-header">
              <Image src="/satistic.png" alt="Statistiques" width={24} height={24} />
              <h2>Commandes par statut</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Tableau des top produits */}
        {topProducts.length > 0 && (
          <div className="admin-table-container">
            <div className="chart-header">
              <Image src="/excellence.png" alt="Excellence" width={24} height={24} />
              <h2>Détails des meilleures ventes</h2>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Quantité</th>
                  <th>CA généré</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={index}>
                    <td data-label="Produit"><strong>{product.nom}</strong></td>
                    <td data-label="Quantité">{product.ventes} unités</td>
                    <td data-label="CA généré" className="revenue-cell">
                      {product.CA.toFixed(2)}€
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section informations */}
      <div className="admin-table-container info-section">
        <h2>
          <Image 
            src="/congratulation.png" 
            alt="Bienvenue" 
            width={32} 
            height={32}
          />
          Bienvenue dans votre Dashboard Admin !
        </h2>
        <p>
          Utilisez le menu de gauche pour naviguer entre les différentes sections :
        </p>
        <ul>
          <li>
            <Image src="/delivery-box.png" alt="" width={20} height={20} />
            <strong>Commandes</strong> : Gérer et suivre toutes les commandes
          </li>
          <li>
            <Image src="/shopping.png" alt="" width={20} height={20} />
            <strong>Produits</strong> : Ajouter, modifier ou supprimer des produits
          </li>
          <li>
            <Image src="/users.png" alt="" width={20} height={20} />
            <strong>Utilisateurs</strong> : Voir la liste des clients
          </li>
        </ul>
      </div>
    </>
  );
}