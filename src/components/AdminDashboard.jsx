// AdminDashboard.tsx

import { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  Navigation, 
  Activity, 
  Zap,
  Users, 
  Car, 
  Clock, 
  DollarSign, 
  // MapPin, 
  // Smartphone, 
  Package,  
  BatteryCharging, 
  // AlertTriangle,
  FileText, 
  MessageSquare, 
  // UserCheck,
  X,
  Download
} from 'lucide-react';
import Chart from 'react-apexcharts';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [statView, setStatView] = useState('overview');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exportPeriod, setExportPeriod] = useState('month');
  const [isExporting, setIsExporting] = useState(false);
  console.log("stats response recentActivities" ,stats?.recentActivities)
  const API_URL = 'https://wegoadmin-c5c82e2c5d80.herokuapp.com/api/v1';
  // https://wegoadmin-c5c82e2c5d80.herokuapp.com/api/v1
// https://wegoadmin-c5c82e2c5d80.herokuapp.com/api/v1
  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await axios.get(`${API_URL}/export`, {
        responseType: 'arraybuffer', // Utilisez arraybuffer au lieu de blob
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      });
  
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `dashboard_export_${new Date().toISOString().slice(0,10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      
      // Nettoyage
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
    } catch (err) {
      console.error('Erreur exportation:', err);
      toast.error("Échec de l'exportation. Veuillez réessayer.", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 
        // https://wegoadmin-c5c82e2c5d80.herokuapp.com/api/v1/dashboard/admin-stats
        const response = await axios.get(`${API_URL}/dashboard/admin-stats`);
        setStats(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return   <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F4C509]"></div>
  </div>
  }

  if (!stats) {
    return <div className="flex justify-center items-center h-screen">Erreur lors du chargement des données</div>;
  }

  // Préparation des données pour les graphiques
  const ridesChartOptions = {
    chart: { type: 'area', height: 350, toolbar: { show: false } },
    colors: ['#10B981'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.3 }
    },
    xaxis: { categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'] },
    tooltip: { y: { formatter: (val) => `${val} courses` } }
  };

  const ridesChartSeries = [{
    name: 'Courses',
    data: [120, 145, 110, 165, 180, 210, 195, 230, 215, 240, 220, 250]
  }];

  const revenueChartOptions = {
    chart: { type: 'bar', height: 350, toolbar: { show: false } },
    colors: ['#3B82F6'],
    plotOptions: { bar: { borderRadius: 4, horizontal: false } },
    dataLabels: { enabled: false },
    xaxis: { categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'] },
    tooltip: { y: { formatter: (val) => `${(val / 1000000).toFixed(2)}M FCFA` } }
  };

  const revenueChartSeries = [{
    name: 'Revenu',
    data: [28, 32, 30, 36, 38, 42, 40, 45, 43, 48, 46, 50].map(v => v * 100000)
  }];

  const vehicleDistributionOptions = {
    chart: { type: 'donut', height: 350 },
    labels: stats.vehicleDistribution.map((v) => 
      v.type === 'moto' ? 'Moto-taxis' : 'Trycycles'),
    colors: ['#10B981', '#3B82F6'],
    legend: { position: 'bottom' },
    responsive: [{ breakpoint: 480, options: { chart: { width: 200 } } }]
  };

  const vehicleDistributionSeries = stats.vehicleDistribution.map((v) => v.count);

  // Formatage des statistiques principales
  const adminStats = [
    {
      title: "Utilisateurs actifs",
      value: stats.mainStats.activeUsers,
      change: "+8%", // À calculer si vous avez les données historiques
      icon: Users,
      color: "bg-blue-100 text-blue-800",
      trend: 'up',
      detail: "Total plateforme"
    },
    {
      title: "Courses aujourd'hui",
      value: stats.mainStats.todayRides,
      change: "+12%", // À calculer
      icon: Car,
      color: "bg-green-100 text-green-800",
      trend: 'up',
      detail: "vs hier"
    },
    {
      title: "Revenu journalier course",
      value: `${stats.mainStats.todayRevenue.toLocaleString()} FCFA`,
      change: "+18%", // À calculer
      icon: DollarSign,
      color: "bg-purple-100 text-purple-800",
      trend: 'up',
      detail: `Moyenne: ${(stats.mainStats.todayRevenue / stats.mainStats.todayRides).toLocaleString()} FCFA`
    },
    {
      title: "Temps moyen course",
      value: `${Math.round(stats.mainStats.avgRideDuration)} min`,
      change: "-5%", // À calculer
      icon: Clock,
      color: "bg-amber-100 text-amber-800",
      trend: 'down',
      detail: "Efficacité améliorée"
    },
    {
      title: "Kilomètres moyens course",
      value: `${stats.mainStats.avgDistance.toFixed(1)} km`,
      change: "+3%", // À calculer
      icon: Navigation,
      color: "bg-indigo-100 text-indigo-800",
      trend: 'up',
      detail: "Par course"
    },
    {
      title: "Kilomètres totaux course",
      value: `${Math.round(stats.mainStats.totalDistance)} km`,
      change: "+22%", // À calculer
      icon: TrendingUp,
      color: "bg-cyan-100 text-cyan-800",
      trend: 'up',
      detail: "Ce mois"
    },
    {
      title: "Temps total course",
      value: `${Math.round(stats.mainStats.totalDuration / 60)} h`,
      change: "+15%", // À calculer
      icon: Clock,
      color: "bg-orange-100 text-orange-800",
      trend: 'up',
      detail: "Temps de conduite"
    },
    {
      title: "Taux d'occupation",
      value: `${stats.mainStats.occupationRate}%`,
      change: "+7%", // À calculer
      icon: BatteryCharging,
      color: "bg-emerald-100 text-emerald-800",
      trend: 'up',
      detail: "Utilisation d'engin motorisé"
    }
  ];

  // const platformStats = [
  //   {
  //     title: "Couverture zones",
  //     value: "85%",
  //     icon: MapPin,
  //     color: "bg-blue-100 text-blue-800",
  //     progress: 85,
  //     progressColor: "bg-blue-600",
  //     description: "Douala et périphérie"
  //   },
  //   {
  //     title: "App mobile",
  //     value: "72%",
  //     icon: Smartphone,
  //     color: "bg-purple-100 text-purple-800",
  //     progress: 72,
  //     progressColor: "bg-purple-600",
  //     description: "Utilisation via mobile"
  //   },
  //   {
  //     title: "Satisfaction",
  //     value: "4.8/5",
  //     icon: ShieldCheck,
  //     color: "bg-green-100 text-green-800",
  //     progress: 96,
  //     progressColor: "bg-green-600",
  //     description: "Basé sur 1,024 avis"
  //   }
  // ];

  const keyMetrics = [
    {
      title: "Taux d'annulation",
      value: `${stats.mainStats.cancellationRate.toFixed(1)}%`,
      icon: X,
      color: "bg-red-100 text-red-600",
      progress: stats.mainStats.cancellationRate,
      progressColor: "bg-red-600",
      description: "Mois en cours"
    },
    {
      title: "Chauffeurs actifs",
      value: stats.mainStats.activeDrivers,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
      progress: (stats.mainStats.activeDrivers / stats.mainStats.activeUsers) * 100,
      progressColor: "bg-blue-600",
      description: "Total chauffeurs"
    },
    {
      title: "Courses livraison",
      value: `${stats.mainStats.deliveryRate.toFixed(1)}%`,
      icon: Package,
      color: "bg-purple-100 text-purple-600",
      progress: stats.mainStats.deliveryRate,
      progressColor: "bg-purple-600",
      description: "Part des livraisons"
    },
    {
      title: "Retours clients",
      value: "24h",
      icon: Clock,
      color: "bg-cyan-100 text-cyan-600",
      progress: 85,
      progressColor: "bg-cyan-600",
      description: "Temps moyen de réponse"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* En-tête */}
   
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold">Tableau de bord administrateur</h1>
        
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <select
            value={exportPeriod}
            onChange={(e) => setExportPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F4C509]"
          >
            <option value="day">Aujourd&apos;hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="year">Cette année</option>
          </select>
          
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center bg-[#F4C509] hover:bg-[#e6b908] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            {isExporting ? (
              'Export en cours...'
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </>
            )}
          </button>
        </div>
      </div>






















      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {adminStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-1">{stat.detail}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </span>
              <span className="text-xs text-gray-500 ml-2">vs période précédente</span>
            </div>
          </div>
        ))}
      </div>

      {/* Plateforme stats */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {platformStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`h-2 rounded-full ${stat.progressColor || 'bg-green-600'}`} style={{ width: `${stat.progress}%` }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
            </div>
          </div>
        ))}
      </div> */}

      {/* Performances */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-lg flex items-center">
              <Activity className="h-5 w-5 mr-2 text-green-600" />
              Performances mensuelles
            </h3>
            <div className="flex space-x-2">
              <button onClick={() => setStatView('rides')} className={`px-3 py-1 rounded-md text-xs ${statView === 'rides' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Courses</button>
              <button onClick={() => setStatView('revenue')} className={`px-3 py-1 rounded-md text-xs ${statView === 'revenue' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Revenus</button>
            </div>
          </div>
          <div className="h-80">
            <Chart
              options={statView === 'rides' ? ridesChartOptions : revenueChartOptions}
              series={statView === 'rides' ? ridesChartSeries : revenueChartSeries}
              type={statView === 'rides' ? 'area' : 'bar'}
              height="100%"
            />
          </div>
        </div>

        {/* Répartition véhicules */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-medium text-lg mb-4 flex items-center">
            <Navigation className="h-5 w-5 mr-2 text-blue-600" />
            Répartition des véhicules
          </h3>
          <div className="h-80">
            <Chart
              options={vehicleDistributionOptions}
              series={vehicleDistributionSeries}
              type="donut"
              height="100%"
            />
          </div>
        </div>
      </div>

      {/* Activité récente et KPI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-medium text-lg flex items-center">
              <Zap className="h-5 w-5 mr-2 text-amber-500" />
              Activité récente
            </h3>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Live</span>
          </div>
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {stats.recentActivities.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${activity.type === 'Livraison' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                    {activity.type === 'Livraison' ? <Package className="h-4 w-4" /> : <Car className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{activity.type}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    {activity.amount && (
                      <p className="text-xs text-green-600 mt-1">{activity.amount.toLocaleString()} FCFA</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h3 className="font-medium text-lg mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
            Indicateurs clés
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {keyMetrics.map((metric, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{metric.title}</p>
                    <p className="text-xl font-bold mt-1">{metric.value}</p>
                  </div>
                  <div className={`p-2 rounded-full ${metric.color}`}>
                    <metric.icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${metric.progressColor}`} style={{ width: `${metric.progress}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{metric.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alertes */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="font-medium text-lg mb-4 flex items-center">
          <ShieldCheck className="h-5 w-5 mr-2 text-blue-600" />
          Alertes et actions prioritaires
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.alerts.map((alert, index) => (
            <div key={index} className={`border-l-4 ${index === 0 ? 'border-yellow-400 bg-yellow-50' : 'border-blue-400 bg-blue-50'} p-4 rounded-r`}>
              <div className="flex items-start">
                <div className={`p-1.5 rounded-full ${index === 0 ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'} mr-3`}>
                  {index === 0 ? <FileText className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                </div>
                <div>
                  <p className="font-medium">{alert.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                </div>
              </div>
            </div>
          ))}
          {/* Ajout d'une alerte statique pour la mise à jour */}
          <div className="border-l-4 border-green-400 bg-green-50 p-4 rounded-r">
            <div className="flex items-start">
              <div className="p-1.5 rounded-full bg-green-100 text-green-600 mr-3">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Mise à jour disponible</p>
                <p className="text-sm text-gray-600 mt-1">Version 2.1.0 - Corrections de bugs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;