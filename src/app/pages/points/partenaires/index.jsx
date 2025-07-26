import { useState, useMemo, useEffect, useCallback } from 'react';
import { Eye, Trash, X, Star, Clock, Heart, HeartOff, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { useAuthContext } from 'app/contexts/auth/context';
import { toast } from 'react-toastify';

// Options pour les filtres
const restaurantStatusOptions = [
  { value: 'all', label: 'Tous' },
  { value: 'active', label: 'Actif', color: 'bg-green-100 text-green-800' },
  { value: 'inactive', label: 'Inactif', color: 'bg-red-100 text-red-800' }
];

const cuisineTypeOptions = [
  { value: 'all', label: 'Tous' },
  { value: 'african', label: 'Africaine' },
  { value: 'european', label: 'Européenne' },
  { value: 'asian', label: 'Asiatique' },
  { value: 'american', label: 'Américaine' }
];

const periodOptions = [
  { value: 'all', label: 'Toutes périodes' },
  { value: 'today', label: 'Aujourd\'hui' },
  { value: 'week', label: 'Cette semaine' },
  { value: 'month', label: 'Ce mois' },
  { value: 'year', label: 'Cette année' },
  { value: 'custom', label: 'Personnalisée' }
];

const RestaurantsTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cuisineFilter, setCuisineFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuthContext();
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [restaurantToDelete, setRestaurantToDelete] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_URL = 'http://localhost:3333/api/v1';
  const [meta, setMeta] = useState({
    total: 0,
    per_page: 8,
    current_page: 1,
    last_page: 1
  });
  const [isExporting, setIsExporting] = useState(false);

  // Fonction pour transformer les données de l'API
  const transformApiData = useCallback((apiRestaurants) => {
    return apiRestaurants.map(restaurant => ({
      id: restaurant.id.toString(),
      name: restaurant.name,
      cuisine: restaurant.cuisine,
      rating: restaurant.rating || 0,
      deliveryTime: restaurant.delivery_time || 'N/A',
      image: restaurant.image,
      isActive: restaurant.is_active,
      dishesCount: restaurant.dishes_count || 0,
      createdAt: restaurant.created_at,
      dishes: restaurant.dishes || [],
      apiData: restaurant
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
  const fetchRestaurants = useCallback(async () => {
    try {
      setLoading(true);
      const dateRange = getDateRange();
      
      const params = {
        page: currentPage,
        per_page: meta.per_page,
        search: searchTerm,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        cuisine: cuisineFilter !== 'all' ? cuisineFilter : undefined,
        start_date: dateRange?.startDate?.toISOString(),
        end_date: dateRange?.endDate?.toISOString(),
        with_dishes: true
      };

      // Nettoyer les paramètres undefined
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

      const response = await axios.get(`${API_URL}/restaurants`, { params });
      
      const transformedData = transformApiData(response.data.data);
      setRestaurants(transformedData);
      setMeta(response.data.meta);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching restaurants:', err);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage, 
    meta.per_page, 
    searchTerm, 
    statusFilter,
    cuisineFilter,
    periodFilter,
    customStartDate,
    customEndDate,
    getDateRange,
    transformApiData
  ]);

  // Version debounced de fetchRestaurants pour les changements de filtre
  const debouncedFetchRestaurants = useMemo(() => debounce(fetchRestaurants, 300), [fetchRestaurants]);

  useEffect(() => {
    debouncedFetchRestaurants();
  }, [debouncedFetchRestaurants]);

  // Fonctions utilitaires
  const getStatusBadge = (isActive) => {
    return isActive 
      ? <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Actif</span>
      : <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Inactif</span>;
  };

  const getRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`w-4 h-4 ${i <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
        />
      );
    }
    return <div className="flex">{stars}</div>;
  };

  const toggleFavorite = async (restaurantId) => {
    try {
      await axios.post(`${API_URL}/restaurants/${restaurantId}/toggle-favorite`);
      fetchRestaurants(); // Recharger les données après modification
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setError('Échec de la mise à jour des favoris');
    }
  };

  // Gestion des actions
  const handleViewRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const handleDeleteRestaurant = (restaurant) => {
    setRestaurantToDelete(restaurant);
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
  
      const response = await axios.get(`${API_URL}/restaurants/export`, {
        responseType: 'blob'
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'restaurants_export.xlsx');
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
    if(user.role !== 'admin') return toast.info('Vous n\'avez pas le droit de supprimer un restaurant');
    
    try {
      await axios.delete(`${API_URL}/restaurants/${restaurantToDelete.apiData.id}`);
      fetchRestaurants(); // Recharger les données après suppression
      setRestaurantToDelete(null);
      toast.success('Restaurant supprimé avec succès');
    } catch (err) {
      console.error('Error deleting restaurant:', err);
      setError('Échec de la suppression');
      toast.error('Échec de la suppression du restaurant');
    }
  };

  const closeModal = () => {
    setSelectedRestaurant(null);
    setRestaurantToDelete(null);
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
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Gestion des Restaurants</h1>
      
      {/* Filtres et recherche */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {restaurantStatusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de cuisine</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              value={cuisineFilter}
              onChange={(e) => setCuisineFilter(e.target.value)}
            >
              {cuisineTypeOptions.map(option => (
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
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Rechercher</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="Nom, type de cuisine..."
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

      {/* Tableau des restaurants */}
      <div className="bg-white shadow rounded-lg overflow-hidden min-h-[600px] flex flex-col">
        <div className="overflow-hidden flex-grow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cuisine</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Livraison</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plats</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {restaurants.length > 0 ? (
                restaurants.map((restaurant) => (
                  <tr key={restaurant.id} className="hover:bg-gray-50">
                    <td className="px-3 py-4 whitespace-nowrap">
                      <img 
                        src={restaurant.image || '/placeholder-restaurant.jpg'} 
                        alt={restaurant.name} 
                        className="w-12 h-12 rounded-md object-cover"
                      />
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{restaurant.name}</div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {restaurant.cuisine}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {getRatingStars(restaurant.rating)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {restaurant.deliveryTime}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {restaurant.dishesCount} plats
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {getStatusBadge(restaurant.isActive)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewRestaurant(restaurant)}
                          className="text-green-600 hover:text-green-900"
                          title="Voir détails"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRestaurant(restaurant)}
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                        >
                          <Trash className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => toggleFavorite(restaurant.id, restaurant.isFavorite)}
                          className="text-yellow-600 hover:text-yellow-900"
                          title={restaurant.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                        >
                          {restaurant.isFavorite ? (
                            <Heart className="w-5 h-5 fill-yellow-500" />
                          ) : (
                            <HeartOff className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                    Aucun restaurant trouvé
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
      {selectedRestaurant && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-gray-500 opacity-50 transition-opacity" onClick={closeModal}></div>
          <div className="fixed inset-y-0 right-0 max-w-full flex">
            <div className="relative w-screen max-w-2xl">
              <div className="h-full flex flex-col bg-white shadow-xl">
                <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-medium text-gray-900">{selectedRestaurant.name}</h2>
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
                      <div className="flex items-start">
                        <img 
                          src={selectedRestaurant.image || '/placeholder-restaurant.jpg'} 
                          alt={selectedRestaurant.name} 
                          className="w-32 h-32 rounded-md object-cover mr-4"
                        />
                        <div>
                          <h3 className="text-md font-medium text-gray-900 mb-2">Informations</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Type de cuisine</p>
                              <p className="mt-1 text-sm text-gray-900 capitalize">{selectedRestaurant.cuisine}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Temps de livraison</p>
                              <p className="mt-1 text-sm text-gray-900">{selectedRestaurant.deliveryTime}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Note moyenne</p>
                              <div className="mt-1">
                                {getRatingStars(selectedRestaurant.rating)}
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Statut</p>
                              <p className="mt-1">{getStatusBadge(selectedRestaurant.isActive)}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-md font-medium text-gray-900 mb-3">Menu ({selectedRestaurant.dishes.length} plats)</h3>
                        <div className="space-y-4">
                          {selectedRestaurant.dishes.length > 0 ? (
                            selectedRestaurant.dishes.map(dish => (
                              <div key={dish.id} className="border rounded-md p-3">
                                <div className="flex justify-between">
                                  <div>
                                    <h4 className="font-medium text-gray-900">{dish.name}</h4>
                                    <p className="text-sm text-gray-500">{dish.description}</p>
                                  </div>
                                  <span className="font-bold text-green-600">{dish.price} FCFA</span>
                                </div>
                                <div className="mt-2 flex justify-between items-center">
                                  <div className="flex items-center">
                                    <button 
                                      onClick={() => toggleFavorite(dish.id, dish.isFavorite)}
                                      className="text-yellow-500 hover:text-yellow-600"
                                    >
                                      {dish.isFavorite ? (
                                        <Heart className="w-4 h-4 fill-yellow-500" />
                                      ) : (
                                        <HeartOff className="w-4 h-4" />
                                      )}
                                    </button>
                                    <span className="text-xs text-gray-500 ml-2">
                                      {dish.likes} likes, {dish.dislikes} dislikes
                                    </span>
                                  </div>
                                  {dish.images && dish.images.length > 0 && (
                                    <div className="flex space-x-1">
                                      {dish.images.slice(0, 3).map((image, index) => (
                                        <img 
                                          key={index} 
                                          src={image} 
                                          alt={dish.name} 
                                          className="w-8 h-8 rounded-sm object-cover"
                                        />
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500">Aucun plat disponible pour ce restaurant</p>
                          )}
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

      {restaurantToDelete && (
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
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Supprimer le restaurant</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Êtes-vous sûr de vouloir supprimer le restaurant {restaurantToDelete.name} ? 
                        Cette action supprimera également tous ses plats et est irréversible.
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

export default RestaurantsTable;