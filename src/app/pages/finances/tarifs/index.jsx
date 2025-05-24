import { useState } from 'react';
import { 
  financialStats, 
  recentTransactions, 
  driverPayouts,
  paymentMethods 
} from './data';
import { 
  Calendar,
  ChevronDown, Clock, Download, Filter, Search, 
  Users2
} from 'lucide-react';
import Chart from 'react-apexcharts';

const FinanceDashboard = () => {
  const [activeTab, setActiveTab] = useState('vue-globale');
  const [dateRange, setDateRange] = useState('7days');

  // Options et données pour le graphique des revenus
  const revenueChartOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: ['#10B981'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
      }
    },
    xaxis: {
      categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    },
    yaxis: {
      labels: {
        formatter: (val) => `${val/1000}k FCFA`,
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val.toLocaleString()} FCFA`,
      }
    },
    grid: {
      strokeDashArray: 4,
    },
  };

  const revenueChartSeries = [{
    name: 'Revenus',
    data: [1200000, 950000, 1340000, 1100000, 1600000, 1450000, 1780000, 1650000, 1420000, 1700000, 1800000, 1900000],
  }];

  // Options et données pour le graphique camembert
  const paymentDistributionOptions = {
    chart: {
      type: 'donut',
      height: 350
    },
    labels: ['Mobile Money', 'Espèces',  'Orange Money'],
    colors: ['#3B82F6', '#10B981',  '#F59E0B'],
    legend: { position: 'bottom' },
    responsive: [{
      breakpoint: 480,
      options: { chart: { width: 200 } }
    }],
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              formatter: () => '2.8M FCFA'
            }
          }
        }
      }
    }
  };

  const paymentDistributionSeries = [45, 30, 10];

  // Fonction pour filtrer les données selon la période sélectionnée
  const filterDataByDateRange = (data) => {
    switch(dateRange) {
      case '7days':
        return data.slice(0, 7);
      case '30days':
        return data.slice(0, 15);
      case 'month':
        return data.slice(0, 10);
      case 'quarter':
        return data;
      default:
        return data;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord financier</h1>
      
      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {financialStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className="`p-3 rounded-full ">
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
            <p className={`text-sm mt-2 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {stat.change} vs période précédente
            </p>
          </div>
        ))}
      </div>

      {/* Onglets */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          {['Vue globale', 'Transactions', 'Paiements chauffeurs', 'Rapports'].map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(tab.toLowerCase().replace(' ', '-'))}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${activeTab === tab.toLowerCase().replace(' ', '-') ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu des onglets */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Barre d'outils */}
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="7days">7 derniers jours</option>
                <option value="30days">30 derniers jours</option>
                <option value="month">Ce mois</option>
                <option value="quarter">Ce trimestre</option>
              </select>
              <ChevronDown className="h-4 w-4 absolute right-3 top-2.5 text-gray-400" />
            </div>
            <button className="flex items-center text-sm text-gray-700 hover:text-gray-900">
              <Filter className="h-4 w-4 mr-1" />
              Filtres
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                placeholder="Rechercher..."
              />
            </div>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <Download className="h-4 w-4 mr-1" />
              Exporter
            </button>
          </div>
        </div>

        {/* Transactions récentes */}
        {activeTab === 'transactions' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Transaction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chauffeur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Méthode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filterDataByDateRange(recentTransactions).map((transaction) => {
                  const method = paymentMethods.find(m => m.value === transaction.method);
                  return (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.chauffeur}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.client}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.commission}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${method.color}`}>
                          <method.icon className="h-3 w-3 mr-1" />
                          {method.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <transaction.icon className="h-3 w-3 mr-1" />
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Paiements aux chauffeurs */}
        {activeTab === 'paiements-chauffeurs' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Paiement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chauffeur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gains totaux
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant net
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filterDataByDateRange(driverPayouts).map((payout) => (
                  <tr key={payout.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {payout.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payout.driver}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {payout.totalEarnings}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payout.platformCut}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {payout.payoutAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        payout.status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payout.status === 'paid' ? 'Payé' : 'En attente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payout.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-green-600 hover:text-green-900 mr-3">
                        Détails
                      </button>
                      {payout.status !== 'paid' && (
                        <button className="text-indigo-600 hover:text-indigo-900">
                          Payer
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Vue globale avec graphiques */}
        {activeTab === 'vue-globale' && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Revenus mensuels</h3>
                <Chart 
                  options={revenueChartOptions} 
                  series={revenueChartSeries} 
                  type="area" 
                  height={350}
                />
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Répartition des paiements</h3>
                <Chart 
                  options={paymentDistributionOptions} 
                  series={paymentDistributionSeries} 
                  type="donut" 
                  height={350}
                />
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Activité récente</h3>
              <div className="space-y-4">
                {filterDataByDateRange(recentTransactions).slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="bg-white p-4 rounded shadow-sm border border-gray-100">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{transaction.chauffeur} → {transaction.client}</p>
                        <p className="text-sm text-gray-500">{transaction.date} • {transaction.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{transaction.amount}</p>
                        <p className="text-sm text-green-600">+{transaction.commission}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Section Rapports */}
        {activeTab === 'rapports' && (
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Générer des rapports</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Rapport quotidien", icon: Clock, desc: "Transactions du jour" },
                { title: "Rapport mensuel", icon: Calendar, desc: "Performance mensuelle" },
                { title: "Rapport chauffeurs", icon: Users2, desc: "Activité des chauffeurs" }
              ].map((report, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                  <div className="flex items-center mb-3">
                    <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
                      <report.icon className="h-5 w-5" />
                    </div>
                    <h4 className="font-medium">{report.title}</h4>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">{report.desc}</p>
                  <button className="text-sm text-green-600 hover:text-green-800 font-medium">
                    Générer →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceDashboard;