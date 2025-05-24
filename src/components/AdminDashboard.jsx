import { useState } from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  // BarChart2, 
  // Calendar, 
  Navigation, 
  Activity, 
  Zap 
} from 'lucide-react';
import Chart from 'react-apexcharts'; // ✅ Remplacé next/dynamic
import { adminStats, platformStats, recentActivities, keyMetrics, alerts } from './data';

const AdminDashboard = () => {
  // const [timeRange, setTimeRange] = useState('monthly');
  const [statView, setStatView] = useState('overview');

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
    labels: ['Moto-taxis', 'Trycycles'],
    colors: ['#10B981', '#3B82F6', '#6366F1'],
    legend: { position: 'bottom' },
    responsive: [{ breakpoint: 480, options: { chart: { width: 200 } } }]
  };

  const vehicleDistributionSeries = [65, 35];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold">Tableau de bord administrateur</h1>
        {/* <div className="flex space-x-2 mt-4 md:mt-0">
          <button onClick={() => setTimeRange('monthly')} className={`px-3 py-1 rounded-md text-sm flex items-center ${timeRange === 'monthly' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            <Calendar className="h-4 w-4 mr-1" />
            Mensuel
          </button>
          <button onClick={() => setTimeRange('global')} className={`px-3 py-1 rounded-md text-sm flex items-center ${timeRange === 'global' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            <BarChart2 className="h-4 w-4 mr-1" />
            Global
          </button>
        </div> */}
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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
      </div>

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
            {recentActivities.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${activity.color}`}>
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{activity.type}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
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
          {alerts.map((alert, index) => (
            <div key={index} className={`border-l-4 ${alert.borderColor} ${alert.bgColor} p-4 rounded-r`}>
              <div className="flex items-start">
                <div className={`p-1.5 rounded-full ${alert.iconColor} mr-3`}>
                  <alert.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">{alert.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                  {/* <button className="text-xs mt-2 text-white bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded">
                    {alert.action}
                  </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
