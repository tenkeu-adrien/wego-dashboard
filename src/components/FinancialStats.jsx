import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, PieChart, CreditCard } from 'lucide-react';
import axios from 'axios';

const FinancialStats = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
// https://wegoadmin-c5c82e2c5d80.herokuapp.com/api/v1/dashboard/financial-stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:3333/api/v1/dashboard/financial-stats');
        setStats(response.data.map(stat => ({
          ...stat,
          // Formatage des valeurs
          value: stat.id.includes('revenue') || stat.id.includes('payment') || stat.id.includes('commission')
            ? `${Number(stat.value).toLocaleString('fr-FR')} FCFA`
            : Number(stat.value).toLocaleString('fr-FR')
        })));
      } catch (err) {
        setError('Erreur lors du chargement des données financières' ,err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-8">
        {error}
      </div>
    );
  }

  const iconMap = {
    total_revenue: DollarSign,
    total_rides: TrendingUp,
    commission: PieChart,
    driver_payments: CreditCard
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => {
        const Icon = iconMap[stat.id];
        return (
          <div key={stat.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className="p-3 rounded-full bg-gray-100">
                <Icon className="h-6 w-6 text-gray-600" />
              </div>
            </div>
            <p className={`text-sm mt-2 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {stat.change} vs période précédente
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default FinancialStats;