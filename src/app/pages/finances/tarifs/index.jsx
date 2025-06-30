import { useState, useEffect } from 'react';
import { 
  // financialStats, 
  paymentMethods 
} from './data';
import { 
  Calendar,
  ChevronDown, Clock, Download, Filter, Search, 
  Users2
} from 'lucide-react';
import Chart from 'react-apexcharts';
import axios from 'axios';
import FinancialStats from 'components/FinancialStats';

const FinanceDashboard = () => {
  const [activeTab, setActiveTab] = useState('vue-globale');
  const [dateRange, setDateRange] = useState('7days');
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [transactionsMeta, setTransactionsMeta] = useState({});
  const [payoutsMeta, setPayoutsMeta] = useState({});
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [payoutsLoading, setPayoutsLoading] = useState(false);
  const [transactionsCurrentPage, setTransactionsCurrentPage] = useState(1);
  const [payoutsCurrentPage, setPayoutsCurrentPage] = useState(1);
  const [revenueData, setRevenueData] = useState([]);
  const [paymentDistribution, setPaymentDistribution] = useState([]);
  const [loadingCharts, setLoadingCharts] = useState(false);

  // Charger les données pour les graphiques
  const fetchChartsData = async () => {
    try {
      setLoadingCharts(true);
      const [revenueRes, distributionRes] = await Promise.all([
        axios.get('https://wegoadmin-c5c82e2c5d80.herokuapp.com/api/v1/rides/revenue-stats'),
        axios.get('https://wegoadmin-c5c82e2c5d80.herokuapp.com/api/v1/rides/payment-distribution')
      ]);
      
      setRevenueData(revenueRes.data);
      setPaymentDistribution(distributionRes.data);
    } catch (error) {
      console.error('Error fetching charts data:', error);
    } finally {
      setLoadingCharts(false);
    }
  };

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
    data: revenueData.length > 0 
      ? revenueData 
      : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  }];

  // Options et données pour le graphique camembert
  const paymentDistributionOptions = {
    chart: {
      type: 'donut',
      height: 350
    },
    labels: paymentDistribution.length > 0 
      ? paymentDistribution.map(item => item.method) 
      : ['Mobile Money', 'Espèces', 'Orange Money'],
    colors: ['#3B82F6', '#10B981', '#F59E0B'],
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
              formatter: () => {
                const total = paymentDistribution.reduce((sum, item) => sum + item.amount, 0);
                return `${(total / 1000).toFixed(1)}k FCFA`;
              }
            }
          }
        }
      }
    }
  };

  const paymentDistributionSeries = paymentDistribution.length > 0 
    ? paymentDistribution.map(item => item.amount)
    : [0, 0, 0];

  // Charger les transactions depuis l'API
  const fetchTransactions = async (page = 1, search = '') => {
    try {
      setTransactionsLoading(true);
      const response = await axios.get('https://wegoadmin-c5c82e2c5d80.herokuapp.com/api/v1/transactions', {
        params: {
          page,
          search,
          perPage: 5
        }
      });
      setTransactions(response.data.data);
      setTransactionsMeta(response.data.meta);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setTransactionsLoading(false);
    }
  };

  // Charger les paiements chauffeurs depuis l'API
  const fetchPayouts = async (page = 1, search = '') => {
    try {
      setPayoutsLoading(true);
      const response = await axios.get('https://wegoadmin-c5c82e2c5d80.herokuapp.com/api/v1/driver-payouts', {
        params: {
          page,
          search,
          perPage: 5
        }
      });
      setPayouts(response.data.data);
      setPayoutsMeta(response.data.meta);
    } catch (error) {
      console.error('Error fetching payouts:', error);
    } finally {
      setPayoutsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'transactions') {
      fetchTransactions(transactionsCurrentPage, searchTerm);
    } else if (activeTab === 'paiements-chauffeurs') {
      fetchPayouts(payoutsCurrentPage, searchTerm);
    } else if (activeTab === 'vue-globale') {
      fetchChartsData();
    }
  }, [activeTab, transactionsCurrentPage, payoutsCurrentPage, searchTerm]);

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fonction pour formater le montant
  const formatAmount = (amount) => {
    return parseFloat(amount).toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + ' FCFA';
  };

  // Fonction pour gérer la recherche
  const handleSearch = (e) => {
    e.preventDefault();
    if (activeTab === 'transactions') {
      fetchTransactions(1, searchTerm);
      setTransactionsCurrentPage(1);
    } else if (activeTab === 'paiements-chauffeurs') {
      fetchPayouts(1, searchTerm);
      setPayoutsCurrentPage(1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord financier</h1>
      



      {/* Statistiques rapides */}

      
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"> */}
        {/* {financialStats.map((stat, index) => (
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
        ))} */}
        <FinancialStats />
      {/* </div> */}




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
            <form onSubmit={handleSearch} className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <Download className="h-4 w-4 mr-1" />
              Exporter
            </button>
          </div>
        </div>

        {/* Transactions récentes */}
        {activeTab === 'transactions' && (
          <div className="overflow-x-auto">
            {transactionsLoading ? (
              <div className="p-6 text-center">Chargement des transactions...</div>
            ) : (
              <>
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
                    {transactions.map((transaction) => {
                      const method = paymentMethods.find(m => m.value === transaction.payment_method);
                      return (
                        <tr key={transaction.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {transaction.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(transaction.transaction_date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.driver?.first_name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.client?.first_name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatAmount(transaction.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatAmount(transaction.commission)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {method ? (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${method.color}`}>
                                <method.icon className="h-3 w-3 mr-1" />
                                {method.label}
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {transaction.payment_method}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Complété
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {transactionsMeta.last_page > 1 && (
                  <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => setTransactionsCurrentPage(transactionsCurrentPage - 1)}
                        disabled={transactionsCurrentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Précédent
                      </button>
                      <button
                        onClick={() => setTransactionsCurrentPage(transactionsCurrentPage + 1)}
                        disabled={transactionsCurrentPage === transactionsMeta.last_page}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Suivant
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Affichage de <span className="font-medium">{(transactionsCurrentPage - 1) * transactionsMeta.per_page + 1}</span> à <span className="font-medium">{Math.min(transactionsCurrentPage * transactionsMeta.per_page, transactionsMeta.total)}</span> sur <span className="font-medium">{transactionsMeta.total}</span> résultats
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                          <button
                            onClick={() => setTransactionsCurrentPage(transactionsCurrentPage - 1)}
                            disabled={transactionsCurrentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                          >
                            <span className="sr-only">Précédent</span>
                            <ChevronDown className="h-5 w-5 transform rotate-90" aria-hidden="true" />
                          </button>
                          {Array.from({ length: transactionsMeta.last_page }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => setTransactionsCurrentPage(page)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${transactionsCurrentPage === page ? 'z-10 bg-green-50 border-green-500 text-green-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                            >
                              {page}
                            </button>
                          ))}
                          <button
                            onClick={() => setTransactionsCurrentPage(transactionsCurrentPage + 1)}
                            disabled={transactionsCurrentPage === transactionsMeta.last_page}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                          >
                            <span className="sr-only">Suivant</span>
                            <ChevronDown className="h-5 w-5 transform -rotate-90" aria-hidden="true" />
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Paiements aux chauffeurs */}
        {activeTab === 'paiements-chauffeurs' && (
          <div className="overflow-x-auto">
            {payoutsLoading ? (
              <div className="p-6 text-center">Chargement des paiements...</div>
            ) : (
              <>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Référence
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
                    {payouts.map((payout) => (
                      <tr key={payout.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {payout.payout_reference}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payout.driver?.first_name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatAmount(payout.total_earnings)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatAmount(payout.platform_cut)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          {formatAmount(payout.payout_amount)}
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
                          {formatDate(payout.payout_date)}
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
                {payoutsMeta.last_page > 1 && (
                  <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => setPayoutsCurrentPage(payoutsCurrentPage - 1)}
                        disabled={payoutsCurrentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Précédent
                      </button>
                      <button
                        onClick={() => setPayoutsCurrentPage(payoutsCurrentPage + 1)}
                        disabled={payoutsCurrentPage === payoutsMeta.last_page}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Suivant
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Affichage de <span className="font-medium">{(payoutsCurrentPage - 1) * payoutsMeta.per_page + 1}</span> à <span className="font-medium">{Math.min(payoutsCurrentPage * payoutsMeta.per_page, payoutsMeta.total)}</span> sur <span className="font-medium">{payoutsMeta.total}</span> résultats
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                          <button
                            onClick={() => setPayoutsCurrentPage(payoutsCurrentPage - 1)}
                            disabled={payoutsCurrentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                          >
                            <span className="sr-only">Précédent</span>
                            <ChevronDown className="h-5 w-5 transform rotate-90" aria-hidden="true" />
                          </button>
                          {Array.from({ length: payoutsMeta.last_page }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => setPayoutsCurrentPage(page)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${payoutsCurrentPage === page ? 'z-10 bg-green-50 border-green-500 text-green-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                            >
                              {page}
                            </button>
                          ))}
                          <button
                            onClick={() => setPayoutsCurrentPage(payoutsCurrentPage + 1)}
                            disabled={payoutsCurrentPage === payoutsMeta.last_page}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                          >
                            <span className="sr-only">Suivant</span>
                            <ChevronDown className="h-5 w-5 transform -rotate-90" aria-hidden="true" />
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Vue globale avec graphiques */}
        {activeTab === 'vue-globale' && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Revenus mensuels</h3>
                {loadingCharts ? (
                  <div className="flex items-center justify-center h-80">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                  </div>
                ) : (
                  <Chart 
                    options={revenueChartOptions} 
                    series={revenueChartSeries} 
                    type="area" 
                    height={350}
                  />
                )}
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Répartition des paiements</h3>
                {loadingCharts ? (
                  <div className="flex items-center justify-center h-80">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                  </div>
                ) : (
                  <Chart 
                    options={paymentDistributionOptions} 
                    series={paymentDistributionSeries} 
                    type="donut" 
                    height={350}
                  />
                )}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Activité récente</h3>
              <div className="space-y-4">
                {transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="bg-white p-4 rounded shadow-sm border border-gray-100">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{transaction.driver?.first_name || 'N/A'} → {transaction.client?.first_name || 'N/A'}</p>
                        <p className="text-sm text-gray-500">{formatDate(transaction.transaction_date)} • {transaction.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatAmount(transaction.amount)}</p>
                        <p className="text-sm text-green-600">+{formatAmount(transaction.commission)}</p>
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