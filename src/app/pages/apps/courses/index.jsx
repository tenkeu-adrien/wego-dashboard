import { useState, useMemo, useEffect, useCallback } from 'react';
import { Eye, Trash, X, MapPin, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { PiMotorcycleBold } from 'react-icons/pi';
import { RiBikeFill } from 'react-icons/ri';
import axios from 'axios';
import { useAuthContext } from 'app/contexts/auth/context';
import { toast } from 'react-toastify';

// Options pour les filtres
const orderStatusOptions = [
  { value: 'all', label: 'Tous' },
  { value: 'pending', label: 'En attente', icon: Eye, color: 'bg-yellow-100 text-yellow-800' },
  { value: 'in_progress', label: 'En cours', icon: Eye, color: 'bg-blue-100 text-blue-800' },
  { value: 'completed', label: 'Terminé', icon: Eye, color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Annulé', icon: Eye, color: 'bg-red-100 text-red-800' }
];

const periodOptions = [
  { value: 'all', label: 'Toutes périodes' },
  { value: 'today', label: 'Aujourd\'hui' },
  { value: 'week', label: 'Cette semaine' },
  { value: 'month', label: 'Ce mois' },
  { value: 'year', label: 'Cette année' },
  { value: 'custom', label: 'Personnalisée' }
];

const paymentTypeOptions = [
  { value: 'all', label: 'Tous' },
  { value: 'cash', label: 'Espèces' },
  { value: 'mobile_money', label: 'Mobile Money' },
  { value: 'orange_money', label: 'Orange Money' },
  { value: 'mpesa', label: 'M-Pesa' }
];

const vehicleTypeOptions = [
  { value: 'all', label: 'Tous' },
  { value: 'moto-taxi', label: 'Moto-taxi' },
  { value: 'tricycle', label: 'Trycycle' }
];

const rideTypeOptions = [
  { value: 'all', label: 'Tous' },
  { value: 'normal', label: 'Course normale' },
  { value: 'delivery', label: 'Livraison' }
];

const OrdersTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [paymentTypeFilter, setPaymentTypeFilter] = useState('all');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('all');
  const [rideTypeFilter, setRideTypeFilter] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const {user } = useAuthContext();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_URL = 'https://wegoadmin-c5c82e2c5d80.herokuapp.com/api/v1'
  // https://wegoadmin-c5c82e2c5d80.herokuapp.com/api/v1
  // http://localhost:3333/api/v1
  const [meta, setMeta] = useState({
    total: 0,
    per_page: 8,
    current_page: 1,
    last_page: 1
  });
  const [isExporting, setIsExporting] = useState(false);

  // Fonction pour transformer les données de l'API
  const transformApiData = useCallback((apiOrders) => {
    const statusMapping = {
      pending: { value: 'pending', label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
      accepted: { value: 'pending', label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
      in_progress: { value: 'in_progress', label: 'En cours', color: 'bg-blue-100 text-blue-800' },
      completed: { value: 'completed', label: 'Terminé', color: 'bg-green-100 text-green-800' },
      cancelled: { value: 'cancelled', label: 'Annulé', color: 'bg-red-100 text-red-800' }
    };

    return apiOrders.map(order => ({
      id: order.id.toString(),
      client: order.client?.first_name || 'Client inconnu',
      client_phone: order.client?.phone || 'N/A',
      driver: order.driver?.first_name || 'Non assigné',
      vehicle_type: order.vehicle_type || 'moto-taxi',
      pickup_address: JSON.parse(order.pickup_location)?.address || 'Adresse inconnue', 
      destination_address: JSON.parse(order.destination_location)?.address || 'Adresse inconnue',
      status: statusMapping[order.status]?.value || 'pending',
      statusDetails: statusMapping[order.status] || statusMapping.pending,
      payment_method: order.payment_method || 'cash',
      is_delivery: order.recipient ? '1' : '0',
      recipient: order.recipient,
      distance: order.distance ? `${order.distance} km` : 'N/A',
      duration: order.duration || 'N/A',
      amount: order.price ? `${order.price.toLocaleString()} FCFA` : '0 FCFA',
      date: new Date(order.created_at).toLocaleString('fr-FR'),
      created_at: order.created_at,
      is_paid: order.is_paid,
      apiData: order
    }));
  }, []);

  // Fonction pour générer les dates en fonction de la période sélectionnée
  const getDateRange = useCallback(() => {
    const now = new Date();
    let startDate, endDate;

    switch (periodFilter) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        endDate = new Date(now.setHours(23, 59, 59, 999));
        break;
      case 'week': {
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        startDate = new Date(now.setDate(diff));
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(now.setDate(diff + 6));
        endDate.setHours(23, 59, 59, 999);
        break;
      }
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'custom':
        if (customStartDate && customEndDate) {
          startDate = new Date(customStartDate);
          endDate = new Date(customEndDate);
          endDate.setHours(23, 59, 59, 999);
        }
        break;
      default:
        return null;
    }

    return { startDate, endDate };
  }, [periodFilter, customStartDate, customEndDate]);

  // Fonction de debounce pour limiter les appels API
  const debounce = (func, delay) => {
    let timeoutId;
    return function(...args) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  // Chargement des données avec filtrage côté serveur
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const dateRange = getDateRange();
      
      const params = {
        page: currentPage,
        per_page: meta.per_page,
        search: searchTerm,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        payment_method: paymentTypeFilter !== 'all' ? paymentTypeFilter : undefined,
        vehicle_type: vehicleTypeFilter !== 'all' ? vehicleTypeFilter : undefined,
        ride_type: rideTypeFilter !== 'all' ? (rideTypeFilter === 'delivery' ? '1' : '0') : undefined,
        start_date: dateRange?.startDate?.toISOString(),
        end_date: dateRange?.endDate?.toISOString()
      };

      // Nettoyer les paramètres undefined
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

      const response = await axios.get(`${API_URL}/rides/historyy`, { params });
      
      const transformedData = transformApiData(response.data.rides.data);
      setOrders(transformedData);
      setMeta(response.data.rides.meta);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage, 
    meta.per_page, 
    searchTerm, 
    statusFilter,
    paymentTypeFilter,
    vehicleTypeFilter,
    rideTypeFilter,
    periodFilter,
    customStartDate,
    customEndDate,
    getDateRange,
    transformApiData
  ]);

  // Version debounced de fetchOrders pour les changements de filtre
  const debouncedFetchOrders = useMemo(() => debounce(fetchOrders, 300), [fetchOrders]);

  useEffect(() => {
    debouncedFetchOrders();
  }, [debouncedFetchOrders]);

  // Filtrage côté client (seulement pour la recherche)
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const searchMatch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.is_delivery && order.recipient?.phone?.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return searchMatch;
    });
  }, [orders, searchTerm]);

  // Fonctions utilitaires
  const getStatusBadge = (status) => {
    const statusOption = orderStatusOptions.find(opt => opt.value === status);
    if (!statusOption) return null;
    const { color, label } = statusOption;
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${color}`}>
        {label}
      </span>
    );
  };

  const getPaymentBadge = (method, isPaid) => {
    const colors = {
      cash: 'bg-gray-100 text-gray-800',
      mobile_money: 'bg-purple-100 text-purple-800',
      orange_money: 'bg-orange-100 text-orange-800',
      mpesa: 'bg-blue-100 text-blue-800'
    };
    
    const labels = {
      cash: 'Espèces',
      mobile_money: 'Mobile Money',
      orange_money: 'Orange Money',
      mpesa: 'M-Pesa'
    };

    return (
      <div className="flex flex-col">
        <span className={`px-2 py-1 text-xs rounded-full ${colors[method] || 'bg-gray-100 text-gray-800'}`}>
          {labels[method] || method}
        </span>
        {isPaid ? (
          <span className="text-xs text-green-600 mt-1">Payé</span>
        ) : (
          <span className="text-xs text-red-600 mt-1">Non payé</span>
        )}
      </div>
    );
  };

  const getVehicleIcon = (vehicleType) => {
    return vehicleType === 'moto-taxi' 
      ? <PiMotorcycleBold className="w-5 h-5 text-blue-600" />
      : <RiBikeFill className="w-5 h-5 text-green-600" />;
  };

  const getDeliveryIcon = (isDelivery) => {
    return isDelivery 
      ? <Package className="w-5 h-5 text-purple-600" />
      : <MapPin className="w-5 h-5 text-gray-600" />;
  };

  // Gestion des actions
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleDeleteOrder = (order) => {
    setOrderToDelete(order);
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
  
      const response = await axios.get(`${API_URL}/rides/export`, {
        responseType: 'blob'
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'rides_export.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erreur exportation:', err);
      setError("Échec de l'exportation");
    } finally {
      setIsExporting(false);
    }
  };
  
  const confirmDelete = async () => {
    // const userId = localStorage.getItem('userId');
 
     if(user.role !== 'admin') return toast.info('Vous n\'avez pas le droit de supprimer une course');
    try {
      await axios.delete(`${API_URL}/rides/${orderToDelete.apiData.id}`);
      fetchOrders(); // Recharger les données après suppression
      setOrderToDelete(null);
    } catch (err) {
      console.error('Error deleting order:', err);
      setError('Échec de la suppression');
    }
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setOrderToDelete(null);
  };

  // Pagination
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= meta.last_page) {
      setCurrentPage(pageNumber);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F4C509]"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Erreur !</strong>
      <span className="block sm:inline"> {error}</span>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Gestion des Courses</h1>
      
      {/* Filtres et recherche */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {orderStatusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Période</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
            >
              {periodOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de paiement</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              value={paymentTypeFilter}
              onChange={(e) => setPaymentTypeFilter(e.target.value)}
            >
              {paymentTypeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de véhicule</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              value={vehicleTypeFilter}
              onChange={(e) => setVehicleTypeFilter(e.target.value)}
            >
              {vehicleTypeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de course</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              value={rideTypeFilter}
              onChange={(e) => setRideTypeFilter(e.target.value)}
            >
              {rideTypeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          
          {periodFilter === 'custom' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Début</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fin</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                />
              </div>
            </div>
          )}
          
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Rechercher</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="ID, client, chauffeur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="mb-4">
        <button
          onClick={handleExport}
          className="bg-[#F4C509] text-white px-4 py-2 rounded-md hover:bg-[rgb(250, 202, 8)] transition-colors"
          disabled={isExporting}
        >
          {isExporting ? 'Exportation en cours...' : 'Exporter les données'}
        </button>
      </div>

      {/* Tableau des courses - Hauteur fixe */}
      <div className="bg-white shadow rounded-lg overflow-hidden min-h-[600px] flex flex-col">
        <div className="overflow-hidden flex-grow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chauffeur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Véhicule</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Départ</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrivée</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paiement</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#</td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.client}</div>
                      <div className="text-xs text-gray-500">{order.client_phone}</div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{order.driver}</td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getVehicleIcon(order.vehicle_type)}
                        <span className="ml-2 text-sm text-gray-900">
                          {order.vehicle_type === 'moto-taxi' ? 'Moto-taxi' : 'Tricycle'}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">{order.pickup_address}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">{order.destination_address}</td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getDeliveryIcon(order.is_delivery)}
                        {order.is_delivery && (
                          <span className="ml-2 text-xs text-gray-500 truncate max-w-xs">
                            {order.recipient?.name || order.recipient?.phone || 'Livraison'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">{getStatusBadge(order.status)}</td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {getPaymentBadge(order.payment_method, order.is_paid)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="text-green-600 hover:text-green-900"
                          title="Voir détails"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order)}
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                        >
                          <Trash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="px-6 py-4 text-center text-sm text-gray-500">
                    Aucune course trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta.total > meta.per_page && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Affichage de <span className="font-medium">{(meta.current_page - 1) * meta.per_page + 1}</span> à{' '}
                  <span className="font-medium">
                    {Math.min(meta.current_page * meta.per_page, meta.total)}
                  </span>{' '}
                  sur <span className="font-medium">{meta.total}</span> résultats
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => paginate(meta.current_page - 1)}
                    disabled={meta.current_page === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      meta.current_page === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Précédent</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  
                  {Array.from({ length: Math.min(5, meta.last_page) }, (_, i) => {
                    let pageNum;
                    if (meta.last_page <= 5) {
                      pageNum = i + 1;
                    } else if (meta.current_page <= 3) {
                      pageNum = i + 1;
                    } else if (meta.current_page >= meta.last_page - 2) {
                      pageNum = meta.last_page - 4 + i;
                    } else {
                      pageNum = meta.current_page - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => paginate(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          meta.current_page === pageNum
                            ? 'z-10 bg-green-50 border-green-500 text-green-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => paginate(meta.current_page + 1)}
                    disabled={meta.current_page === meta.last_page}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      meta.current_page === meta.last_page ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Suivant</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-gray-500 opacity-50 transition-opacity" onClick={closeModal}></div>
          <div className="fixed inset-y-0 right-0 max-w-full flex">
            <div className="relative w-screen max-w-md">
              <div className="h-full flex flex-col bg-white shadow-xl">
                <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-medium text-gray-900">Détails de la course #{selectedOrder.id}</h2>
                    <button
                      type="button"
                      className="-mr-2 p-2 text-gray-400 hover:text-gray-500"
                      onClick={closeModal}
                    >
                      <X className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="mt-8">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-md font-medium text-gray-900 mb-3">Informations de base</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="mt-1 text-sm text-gray-900">{selectedOrder.date}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Statut</p>
                            <p className="mt-1">{getStatusBadge(selectedOrder.status)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Client</p>
                            <p className="mt-1 text-sm text-gray-900">{selectedOrder.client}</p>
                            <p className="mt-1 text-xs text-gray-500">{selectedOrder.client_phone}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Chauffeur</p>
                            <p className="mt-1 text-sm text-gray-900">{selectedOrder.driver}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Véhicule</p>
                            <div className="mt-1 flex items-center">
                              {getVehicleIcon(selectedOrder.vehicle_type)}
                              <span className="ml-2 text-sm text-gray-900">
                                {selectedOrder.vehicle_type === 'moto-taxi' ? 'Moto-taxi' : 'Trycycle'}
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Paiement</p>
                            <div className="mt-1">
                              {getPaymentBadge(selectedOrder.payment_method, selectedOrder.is_paid)}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Type de course</p>
                            <div className="mt-1 flex items-center">
                              {getDeliveryIcon(selectedOrder.is_delivery)}
                              <span className="ml-2 text-sm text-gray-900">
                                {selectedOrder.is_delivery ? 'Livraison' : 'Course normale'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-md font-medium text-gray-900 mb-3">Itinéraire</h3>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-gray-500">Départ</p>
                            <p className="mt-1 text-sm text-gray-900">{selectedOrder.pickup_address}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Destination</p>
                            <p className="mt-1 text-sm text-gray-900">{selectedOrder.destination_address}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Distance</p>
                              <p className="mt-1 text-sm text-gray-900">{selectedOrder.distance}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Durée</p>
                              <p className="mt-1 text-sm text-gray-900">{selectedOrder.duration}</p>
                            </div>
                          </div>
                          {selectedOrder.is_delivery && (
                            <div>
                              <p className="text-sm text-gray-500">Livraison</p>
                              <div className="mt-1 bg-gray-50 p-3 rounded-md">
                                <p className="text-sm text-gray-900 font-medium">{selectedOrder.recipient?.name || 'Sans nom'}</p>
                                <p className="text-sm text-gray-500">{selectedOrder.recipient?.phone}</p>
                                {selectedOrder.recipient?.comment && (
                                  <p className="mt-2 text-sm text-gray-700">
                                    <span className="font-medium">Commentaire:</span> {selectedOrder.recipient.comment}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-md font-medium text-gray-900 mb-3">Prix</h3>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-lg font-bold text-gray-900">{selectedOrder.amount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="w-full bg-[#F4C509] border border-transparent rounded-md py-2 px-4 text-sm font-medium text-white hover:bg-[rgb(250, 202, 8)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {orderToDelete && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-50" onClick={closeModal}></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Supprimer la course</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Êtes-vous sûr de vouloir supprimer la course #{orderToDelete.id} ? Cette action est irréversible.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Supprimer
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;