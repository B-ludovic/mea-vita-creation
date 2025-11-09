// Page Dashboard Admin
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Récupérer le token depuis localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Pas de token - accès non autorisé');
          return;
        }

        // Headers avec authentification
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        // Récupérer les commandes
        const ordersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/user/all`, {
          headers
        });
        const ordersData = await ordersRes.json();
        
        // Récupérer les produits
        const productsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
          headers
        });
        const productsData = await productsRes.json();

        // Calculer les statistiques
        const orders = ordersData.orders || [];
        const products = productsData.products || [];

        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

        setStats({
          totalOrders: orders.length,
          totalRevenue: totalRevenue,
          totalProducts: products.length,
          totalUsers: 0 // À implémenter si besoin
        });

      } catch (error) {
        console.error('Erreur lors du chargement des stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="admin-header">
        <h1>Chargement...</h1>
      </div>
    );
  }

  return (
    <>
      <div className="admin-header">
        <h1>Dashboard</h1>
        <p>Vue d'ensemble de votre boutique</p>
      </div>

      {/* Cartes de statistiques */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Commandes</span>
            <span className="stat-card-icon">
              <Image src="/delivery-box.png" alt="Commandes" width={24} height={24} />
            </span>
          </div>
          <div className="stat-card-value">{stats.totalOrders}</div>
          <div className="stat-card-change">Total des commandes</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Chiffre d&apos;affaires</span>
            <span className="stat-card-icon">
              <Image src="/chiffre-affaire.png" alt="Revenus" width={24} height={24} />
            </span>
          </div>
          <div className="stat-card-value">{stats.totalRevenue.toFixed(2)}€</div>
          <div className="stat-card-change">Revenus totaux</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Produits</span>
            <span className="stat-card-icon">
              <Image src="/shopping.png" alt="Produits" width={24} height={24} />
            </span>
          </div>
          <div className="stat-card-value">{stats.totalProducts}</div>
          <div className="stat-card-change">Produits actifs</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Clients</span>
            <span className="stat-card-icon">
              <Image src="/users.png" alt="Clients" width={24} height={24} />
            </span>
          </div>
          <div className="stat-card-value">{stats.totalUsers}</div>
          <div className="stat-card-change">Utilisateurs inscrits</div>
        </div>
      </div>

      {/* Section informations */}
      <div className="admin-table-container">
        <h2 style={{ marginBottom: '1rem', color: 'var(--text-dark)' }}>
          <Image 
            src="/congratulation.png" 
            alt="Bienvenue" 
            width={32} 
            height={32} 
            style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }}
          />
          Bienvenue dans votre Dashboard Admin !
        </h2>
        <p style={{ color: 'var(--text-light)', lineHeight: '1.6' }}>
          Utilisez le menu de gauche pour naviguer entre les différentes sections :
        </p>
        <ul style={{ marginTop: '1rem', color: 'var(--text-light)', lineHeight: '2' }}>
          <li>
            <Image src="/delivery-box.png" alt="" width={20} height={20} style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />
            <strong>Commandes</strong> : Gérer et suivre toutes les commandes
          </li>
          <li>
            <Image src="/shopping.png" alt="" width={20} height={20} style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />
            <strong>Produits</strong> : Ajouter, modifier ou supprimer des produits
          </li>
          <li>
            <Image src="/users.png" alt="" width={20} height={20} style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />
            <strong>Utilisateurs</strong> : Voir la liste des clients
          </li>
        </ul>
      </div>
    </>
  );
}