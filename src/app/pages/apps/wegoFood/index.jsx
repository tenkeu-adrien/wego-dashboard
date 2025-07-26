import { useState, useMemo, useEffect, useCallback } from 'react';
import { Eye, Trash, X, Star, Clock, Heart, HeartOff, ChevronLeft, ChevronRight, Plus, Edit } from 'lucide-react';
import axios from 'axios';
import { useAuthContext } from 'app/contexts/auth/context';
import { toast } from 'react-toastify';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from "./../../../../firebase.config.js";
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

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

// Schéma de validation avec Yup
const restaurantSchema = yup.object().shape({
  name: yup.string().required('Le nom du restaurant est requis'),
  image: yup.mixed().test('fileOrUrl', 'Le logo du restaurant est obligatoire', function(value) {
    return typeof value === 'string' || value instanceof File;
  }),
  cuisine: yup.string().required('Le type de cuisine est requis'),
  delivery_time: yup.string().required('Le temps de livraison est requis'),
  is_active: yup.boolean().required('Le statut est requis')
});

const dishSchema = yup.object().shape({
  name: yup.string().required('Le nom du plat est requis'),
  price: yup
    .number()
    .transform((value, originalValue) => originalValue === '' ? undefined : value)
    .required('Le prix est requis')
    .positive('Le prix doit être positif'),
  description: yup.string().required('La description est requise')
});

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
  const [restaurantToToggle, setRestaurantToToggle] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [allRestaurants, setAllRestaurants] = useState([]); // Nouvel état pour stocker tous les restaurants
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_URL = 'https://wegoadmin-c5c82e2c5d80.herokuapp.com/api/v1';
  
  // http://localhost:3333/api/v1
  const [meta, setMeta] = useState({
    total: 0,
    per_page: 8,
    current_page: 1,
    last_page: 1
  });
  const [isExporting, setIsExporting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDishModal, setShowDishModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dishImagesPreview, setDishImagesPreview] = useState([]);
  const [selectedRestaurantForDish, setSelectedRestaurantForDish] = useState(null);

  // Form states
  const { 
    register: registerRestaurant, 
    handleSubmit: handleRestaurantSubmit, 
    reset: resetRestaurantForm,
    formState: { errors: restaurantErrors },
    setValue: setRestaurantValue,
    watch: watchRestaurant,
    trigger: triggerRestaurantValidation
  } = useForm({
    resolver: yupResolver(restaurantSchema),
    defaultValues: {
      name: '',
      cuisine: 'african',
      delivery_time: '30-45 min',
      is_active: true,
      imageFile: null,
      image: null,
    }
  });
  
  const { 
    register: registerDish, 
    handleSubmit: handleDishSubmit, 
    reset: resetDishForm,
    formState: { errors: dishErrors },
  } = useForm({
    resolver: yupResolver(dishSchema)
  });

  const restaurantFormValues = watchRestaurant();

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
        // Retirer searchTerm des paramètres envoyés au backend
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
      setAllRestaurants(transformedData); // Stocker tous les restaurants
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
    // Retirer searchTerm des dépendances
    statusFilter,
    cuisineFilter,
    getDateRange,
    transformApiData
  ]);


  // const handleSearch = (term) => {
  //   setSearchTerm(term);
  //   if (term.trim() === '') {
  //     // Si la recherche est vide, afficher tous les restaurants
  //     setRestaurants(allRestaurants);
  //     // Réinitialiser la pagination aux données originales
  //     setMeta(prev => ({
  //       ...prev,
  //       total: allRestaurants.length,
  //       current_page: 1
  //     }));
  //   } else {
  //     // Filtrer les restaurants en fonction du terme de recherche
  //     const filtered = allRestaurants.filter(restaurant => 
  //       restaurant.name.toLowerCase().includes(term.toLowerCase()) ||
  //       restaurant.cuisine.toLowerCase().includes(term.toLowerCase())
  //     );
  //     setRestaurants(filtered);
  //     // Mettre à jour la pagination pour les résultats filtrés
  //     setMeta(prev => ({
  //       ...prev,
  //       total: filtered.length,
  //       current_page: 1
  //     }));
  //   }
  // };

  // Version debounced de fetchRestaurants pour les changements de filtre
  const debouncedFetchRestaurants = useMemo(() => debounce(fetchRestaurants, 300), [fetchRestaurants]);

  useEffect(() => {
    debouncedFetchRestaurants();
  }, [debouncedFetchRestaurants]);

  // Fonction de recherche côté front-end
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      // Si la recherche est vide, afficher tous les restaurants
      setRestaurants(allRestaurants);
    } else {
      // Filtrer les restaurants en fonction du terme de recherche
      const filtered = allRestaurants.filter(restaurant => 
        restaurant.name.toLowerCase().includes(term.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(term.toLowerCase())
      );
      setRestaurants(filtered);
    }
  };

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

  const handleDeleteDish = async (dishId) => {
    try {
      await axios.delete(`${API_URL}/dishes/${dishId}`);
      toast.success('Plat supprimé avec succès');
      closeModal()
    } catch (error) {
      console.error('Error deleting dish:', error);
      toast.error('Échec de la suppression du plat');
    }
  };

  const toggleFavorite = async (id, isFavorite) => {
    try {
      await axios.post(`${API_URL}/restaurants/${id}/toggle-favorite`, { isFavorite: !isFavorite });
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

  const handleEditRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant);
    resetRestaurantForm({
      name: restaurant.name,
      cuisine: restaurant.cuisine,
      delivery_time: restaurant.deliveryTime,
      image: restaurant.image,
      is_active: restaurant.isActive,
      imageFile: null,
    });
    setShowEditModal(true);
  };

  const handleAddDishes = (restaurant) => {
    setSelectedRestaurantForDish(restaurant);
    resetDishForm({
      name: '',
      price: '',
      description: ''
    });
    setDishImagesPreview([]);
    setShowDishModal(true);
  };

  const handleToggleRestaurant = (restaurant) => {
    setRestaurantToToggle(restaurant);
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
  
  const confirmToggleStatus = async () => {
    if(user.role !== 'admin') return toast.info('Vous n\'avez pas les droits nécessaires');
    
    try {
      await axios.patch(`${API_URL}/restaurants/${restaurantToToggle.apiData.id}/toggle-active`);
      fetchRestaurants(); // Recharger les données après modification
      setRestaurantToToggle(null);
      toast.success(`Restaurant ${restaurantToToggle.isActive ? 'désactivé' : 'réactivé'} avec succès`);
    } catch (err) {
      console.error('Error toggling restaurant status:', err);
      setError('Échec de la modification du statut');
      toast.error('Échec de la modification du statut');
    }
  };

  const closeModal = () => {
    setSelectedRestaurant(null);
    setRestaurantToToggle(null);
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDishModal(false);
    resetRestaurantForm({
      name: '',
      cuisine: 'african',
      delivery_time: '30-45 min',
      is_active: true,
      imageFile: null,
      image: null,
    });
    resetDishForm();
    setDishImagesPreview([]);
  };

  // Gestion des images avec Firebase
  const uploadImage = async (file) => {
    if (!file) return null;
    
    try {
      const storageRef = ref(storage, `restaurants/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const deleteImage = async (url) => {
    try {
      const imageRef = ref(storage, url);
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  // Gestion de l'ajout de restaurant
  const onSubmitAddRestaurant = async (data) => {
    setIsProcessing(true);
    setError(null);

    try {
      // Upload de l'image du restaurant
      let imageUrl = null;
      if (data.imageFile) {
        imageUrl = await uploadImage(data.imageFile);
      }

      // Préparation des données pour l'API
      const payload = {
        name: data.name,
        userId: user?.id,
        cuisine: data.cuisine,
        delivery_time: data.delivery_time,
        image: imageUrl,
        is_active: data.is_active
      };

      await axios.post(`${API_URL}/restaurants`, payload);
      fetchRestaurants();
      closeModal();
      toast.success('Restaurant ajouté avec succès');
    } catch (err) {
      console.error('Error adding restaurant:', err);
      setError(err.response?.data?.message || err.message);
      toast.error('Échec de l\'ajout du restaurant');
    } finally {
      setIsProcessing(false);
    }
  };

  // Gestion de la modification de restaurant
  const onSubmitUpdateRestaurant = async (data) => {
    setIsProcessing(true);
    setError(null);
  
    try {
      // Upload de la nouvelle image si elle a changé
      let imageUrl = selectedRestaurant.image;
      if (data.imageFile) {
        if (selectedRestaurant.image) {
          await deleteImage(selectedRestaurant.image);
        }
        imageUrl = await uploadImage(data.imageFile);
      }
  
      // Préparation des données pour l'API
      const payload = {
        name: data.name,
        cuisine: data.cuisine,
        deliveryTime: data.delivery_time,
        image: imageUrl,
        isActive: data.is_active
      };
  
      await axios.patch(`${API_URL}/restaurants/${selectedRestaurant.apiData.id}`, payload);
      fetchRestaurants();
      closeModal();
      toast.success('Restaurant modifié avec succès');
    } catch (err) {
      console.error('Error updating restaurant:', err);
      setError(err.response?.data?.message || err.message);
      toast.error('Échec de la modification du restaurant');
    } finally {
      setIsProcessing(false);
    }
  };

  // Gestion de l'ajout de plat
  const onSubmitAddDish = async (data) => {
    setIsProcessing(true);
    try {
      // Upload des images du plat
      const images = await Promise.all(
        dishImagesPreview
          .filter(img => img instanceof File || img.startsWith('blob:'))
          .map(file => uploadImage(file))
      );

      const payload = {
        name: data.name,
        price: parseFloat(data.price),
        description: data.description,
        images,
      };

      await axios.post(`${API_URL}/dishes/${selectedRestaurantForDish.apiData.id}`, payload);
      fetchRestaurants();
      closeModal();
      toast.success('Plat ajouté avec succès');
    } catch (error) {
      console.error('Error adding dish:', error);
      toast.error('Erreur lors de l\'ajout du plat');
    } finally {
      setIsProcessing(false);
    }
  };

  // Gestion du changement d'image
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(file => URL.createObjectURL(file));
    setDishImagesPreview([...dishImagesPreview, ...previews]);
  };

  // Suppression d'une image de plat
  const handleRemoveDishImage = (imgIdx) => {
    const updatedPreviews = [...dishImagesPreview];
    updatedPreviews.splice(imgIdx, 1);
    setDishImagesPreview(updatedPreviews);
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
  onChange={(e) => handleSearch(e.target.value)}
/>
          </div>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="mb-4 flex justify-between">
        <button
          onClick={() => {
            setShowAddModal(true);
            resetRestaurantForm({
              name: '',
              cuisine: 'african',
              delivery_time: '30-45 min',
              is_active: true,
              imageFile: null,
              image: null,
            });
          }}
          className="bg-[#F4C509] text-white px-4 py-2 rounded-md hover:bg-[rgb(250, 202, 8)] transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Ajouter un restaurant
        </button>
        
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
                          onClick={() => handleEditRestaurant(restaurant)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Modifier"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleAddDishes(restaurant)}
                          className="text-purple-600 hover:text-purple-900"
                          title="Ajouter des plats"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleToggleRestaurant(restaurant)}
                          className={restaurant.isActive ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"}
                          title={restaurant.isActive ? "Désactiver" : "Activer"}
                        >
                          {restaurant.isActive ? (
                            <Trash className="w-5 h-5" />
                          ) : (
                            <Heart className="w-5 h-5" />
                          )}
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

      {/* Modal de détail du restaurant */}
      {selectedRestaurant && !showEditModal && !showDishModal && (
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
                              <div key={dish.id} className="border rounded-md p-3 relative">
                                <button
                                  onClick={() => handleDeleteDish(dish.id)}
                                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 mt-1"
                                  title="Supprimer le plat"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                                
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
                                      {dish.images.map((image, index) => (
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

      {/* Modal d'ajout de restaurant */}
      {showAddModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-50"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Ajouter un nouveau restaurant</h3>
                    
                    <form onSubmit={handleRestaurantSubmit(onSubmitAddRestaurant)}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nom du restaurant</label>
                          <input
                            type="text"
                            className={`w-full px-3 py-2 border ${restaurantErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                            {...registerRestaurant('name')}
                          />
                          {restaurantErrors.name && (
                            <p className="mt-1 text-sm text-red-600">{restaurantErrors.name.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Type de cuisine</label>
                          <select
                            className={`w-full px-3 py-2 border ${restaurantErrors.cuisine ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                            {...registerRestaurant('cuisine')}
                          >
                            {cuisineTypeOptions.filter(opt => opt.value !== 'all').map(option => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                          {restaurantErrors.cuisine && (
                            <p className="mt-1 text-sm text-red-600">{restaurantErrors.cuisine.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Temps de livraison</label>
                          <input
                            type="text"
                            className={`w-full px-3 py-2 border ${restaurantErrors.delivery_time ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                            {...registerRestaurant('delivery_time')}
                            placeholder="Ex: 30-45 min"
                          />
                          {restaurantErrors.delivery_time && (
                            <p className="mt-1 text-sm text-red-600">{restaurantErrors.delivery_time.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                          <select
                            className={`w-full px-3 py-2 border ${restaurantErrors.is_active ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                            {...registerRestaurant('is_active', { valueAsBoolean: true })}
                          >
                            <option value="true">Actif</option>
                            <option value="false">Inactif</option>
                          </select>
                          {restaurantErrors.is_active && (
                            <p className="mt-1 text-sm text-red-600">{restaurantErrors.is_active.message}</p>
                          )}
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Image du restaurant</label>
                          <input
                            type="file"
                            accept="image/*"
                            className={`w-full px-3 py-2 border ${restaurantErrors.image ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                            onChange={(e) => {
                              if (e.target.files.length > 0) {
                                const file = e.target.files[0];
                                setRestaurantValue('imageFile', file);
                                setRestaurantValue('image', file);
                                triggerRestaurantValidation('image');
                              }
                            }}
                          />
                          {restaurantErrors.image && (
                            <p className="mt-1 text-sm text-red-600">{restaurantErrors.image.message}</p>
                          )}

                          {(restaurantFormValues.imageFile || restaurantFormValues.image) && (
                            <div className="mt-2 flex items-center">
                              <img 
                                src={
                                  restaurantFormValues.imageFile 
                                    ? URL.createObjectURL(restaurantFormValues.imageFile) 
                                    : restaurantFormValues.image || '/placeholder-restaurant.jpg'
                                } 
                                alt="Preview" 
                                className="h-20 w-20 object-cover rounded-md mr-4"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setRestaurantValue('imageFile', null);
                                  setRestaurantValue('image', null);
                                  triggerRestaurantValidation('image');
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse mt-4">
                        <button
                          type="submit"
                          disabled={isProcessing}
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#F4C509] text-base font-medium text-white hover:bg-[rgb(250, 202, 8)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                        >
                          {isProcessing ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                        <button
                          type="button"
                          onClick={closeModal}
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          Annuler
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de modification de restaurant */}
      {showEditModal && selectedRestaurant && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-50"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Modifier le restaurant</h3>
                    
                    <form onSubmit={handleRestaurantSubmit(onSubmitUpdateRestaurant)}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nom du restaurant</label>
                          <input
                            type="text"
                            className={`w-full px-3 py-2 border ${restaurantErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                            {...registerRestaurant('name')}
                          />
                          {restaurantErrors.name && (
                            <p className="mt-1 text-sm text-red-600">{restaurantErrors.name.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Type de cuisine</label>
                          <select
                            className={`w-full px-3 py-2 border ${restaurantErrors.cuisine ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                            {...registerRestaurant('cuisine')}
                          >
                            {cuisineTypeOptions.filter(opt => opt.value !== 'all').map(option => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                          {restaurantErrors.cuisine && (
                            <p className="mt-1 text-sm text-red-600">{restaurantErrors.cuisine.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Temps de livraison</label>
                          <input
                            type="text"
                            className={`w-full px-3 py-2 border ${restaurantErrors.delivery_time ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                            {...registerRestaurant('delivery_time')}
                          />
                          {restaurantErrors.delivery_time && (
                            <p className="mt-1 text-sm text-red-600">{restaurantErrors.delivery_time.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                          <select
                            className={`w-full px-3 py-2 border ${restaurantErrors.is_active ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                            {...registerRestaurant('is_active', { valueAsBoolean: true })}
                          >
                            <option value="true">Actif</option>
                            <option value="false">Inactif</option>
                          </select>
                          {restaurantErrors.is_active && (
                            <p className="mt-1 text-sm text-red-600">{restaurantErrors.is_active.message}</p>
                          )}
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Image du restaurant</label>
                          <input
                            type="file"
                            accept="image/*"
                            className={`w-full px-3 py-2 border ${restaurantErrors.image ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                            onChange={(e) => {
                              if (e.target.files.length > 0) {
                                const file = e.target.files[0];
                                setRestaurantValue('imageFile', file);
                                triggerRestaurantValidation('image');
                              }
                            }}
                          />
                          <div className="mt-2 flex items-center">
                            <img
                              src={restaurantFormValues.imageFile ? URL.createObjectURL(restaurantFormValues.imageFile) : restaurantFormValues.image || '/placeholder-restaurant.jpg'}
                              alt="Preview"
                              className="h-20 w-20 object-cover rounded-md mr-4"
                            />
                            {restaurantFormValues.imageFile && (
                              <button 
                                type="button" 
                                onClick={() => {
                                  setRestaurantValue('imageFile', null);
                                  triggerRestaurantValidation('image');
                                }} 
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                          {restaurantErrors.image && (
                            <p className="mt-1 text-sm text-red-600">{restaurantErrors.image.message}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse mt-4">
                        <button
                          type="submit"
                          disabled={isProcessing}
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#F4C509] text-base font-medium text-white hover:bg-[rgb(250, 202, 8)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                        >
                          {isProcessing ? 'Enregistrement...' : 'Enregistrer les modifications'}
                        </button>
                        <button
                          type="button"
                          onClick={closeModal}
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          Annuler
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'ajout de plat */}
      {showDishModal && selectedRestaurantForDish && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-50"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Ajouter un plat pour {selectedRestaurantForDish.name}
                    </h3>
                    
                    <form onSubmit={handleDishSubmit(onSubmitAddDish)}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nom du plat</label>
                          <input
                            type="text"
                            className={`w-full px-3 py-2 border ${dishErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                            {...registerDish('name')}
                          />
                          {dishErrors.name && (
                            <p className="mt-1 text-sm text-red-600">{dishErrors.name.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA)</label>
                          <input
                            type="number"
                            step="0.01"
                            className={`w-full px-3 py-2 border ${dishErrors.price ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                            {...registerDish('price')}
                          />
                          {dishErrors.price && (
                            <p className="mt-1 text-sm text-red-600">{dishErrors.price.message}</p>
                          )}
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Images du plat</label>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                            onChange={handleImageChange}
                          />
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          className={`w-full px-3 py-2 border ${dishErrors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                          rows={3}
                          {...registerDish('description')}
                        />
                        {dishErrors.description && (
                          <p className="mt-1 text-sm text-red-600">{dishErrors.description.message}</p>
                        )}
                      </div>

                      {/* Prévisualisation des images */}
                      {dishImagesPreview.length > 0 && (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Prévisualisation des images</label>
                          <div className="flex flex-wrap gap-2">
                            {dishImagesPreview.map((img, idx) => (
                              <div key={idx} className="relative">
                                <img
                                  src={img}
                                  alt={`Preview ${idx + 1}`}
                                  className="w-16 h-16 object-cover rounded-md"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveDishImage(idx)}
                                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                                >
                                  <X className="w-3 h-3 text-white" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse mt-4">
                        <button
                          type="submit"
                          disabled={isProcessing}
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#F4C509] text-base font-medium text-white hover:bg-[rgb(250, 202, 8)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                        >
                          {isProcessing ? 'Enregistrement...' : 'Ajouter le plat'}
                        </button>
                        <button
                          type="button"
                          onClick={closeModal}
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          Annuler
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de désactivation/réactivation */}
      {restaurantToToggle && (
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
                    {restaurantToToggle.isActive ? (
                      <Trash className="h-6 w-6 text-red-600" aria-hidden="true" />
                    ) : (
                      <Heart className="h-6 w-6 text-green-600" aria-hidden="true" />
                    )}
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {restaurantToToggle.isActive ? 'Désactiver' : 'Réactiver'} le restaurant
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Êtes-vous sûr de vouloir {restaurantToToggle.isActive ? 'désactiver' : 'réactiver'} le restaurant {restaurantToToggle.name} ?
                        {restaurantToToggle.isActive ? ' Il ne sera plus visible pour les clients.' : ' Il redeviendra visible pour les clients.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmToggleStatus}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {restaurantToToggle.isActive ? 'Désactiver' : 'Réactiver'}
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