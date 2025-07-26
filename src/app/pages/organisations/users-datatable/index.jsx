import { useState, useEffect, useCallback, useMemo } from 'react';
import { Phone, Search, User2, Eye, X, Star, Gift, Pause, Play, Tag } from 'lucide-react';
import { PiMotorcycle } from 'react-icons/pi';
import { RiBikeLine } from 'react-icons/ri';
import { AddUserModal } from 'components/AddUserModal';
import { Page } from 'components/shared/Page';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthContext } from 'app/contexts/auth/context';

const API_URL = 'https://wegoadmin-c5c82e2c5d80.herokuapp.com/api/v1';
// https://wegoadmin-c5c82e2c5d80.herokuapp.com/api/v1
const UsersTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToSuspend, setUserToSuspend] = useState(null);
  const [userForPromo, setUserForPromo] = useState(null);
  const [users, setUsers] = useState([]);
  const [paginationMeta, setPaginationMeta] = useState({
    total: 0,
    per_page: 8,
    current_page: 1,
    last_page: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activePromos, setActivePromos] = useState({});
  const [isExporting, setIsExporting] = useState(false);
  const {user } = useAuthContext();
  const usersPerPage = 8;

  const rolesOptions = [
    { value: 'all', label: 'Tous les rôles', color: 'bg-gray-100 text-gray-800' },
    { value: 'client', label: 'Client', color: 'bg-blue-100 text-blue-800' },
    { value: 'driver', label: 'Chauffeur', color: 'bg-purple-100 text-purple-800' },
    { value: 'admin', label: 'Admin', color: 'bg-red-100 text-red-800' }
  ];

  const timeOptions = [
    { value: 'all', label: 'Toutes périodes' },
    { value: 'day', label: 'Aujourd\'hui' },
    { value: 'week', label: 'Cette semaine' },
    { value: 'month', label: 'Ce mois' },
    { value: 'year', label: 'Cette année' },
  ];

  const vehicleTypes = {
    'moto-taxi': { label: 'Moto-taxi', icon: <PiMotorcycle className="w-4 h-4 mr-1" />, color: 'bg-purple-100 text-purple-800' },
    'tricycle': { label: 'Trycycle', icon: <RiBikeLine className="w-4 h-4 mr-1" />, color: 'bg-green-100 text-green-800' }
  };

  // Mémoire des promos actives pour éviter des requêtes inutiles
  const activePromosCache = useCallback(async (userIds) => {
    try {
      const response = await axios.post(`${API_URL}/users/check-active-promos`, { userIds });
      setActivePromos(prev => ({
        ...prev,
        ...response.data.data
      }));
console.log("userIds" ,userIds)
      console.log("response des active promo" ,response)
    } catch (err) {
      console.error('Error checking active promos:', err);
    }
  }, []);

  // Correction: Utilisation de blocs {} pour isoler les déclarations
  const getDateRange = useMemo(() => {
    const now = new Date();
    switch (timeFilter) {
      case 'day': {
        return {
          start: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
          end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
        };
      }
      case 'week': {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
        return {
          start: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate()),
          end: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 7)
        };
      }
      case 'month': {
        return {
          start: new Date(now.getFullYear(), now.getMonth(), 1),
          end: new Date(now.getFullYear(), now.getMonth() + 1, 1)
        };
      }
      case 'year': {
        return {
          start: new Date(now.getFullYear(), 0, 1),
          end: new Date(now.getFullYear() + 1, 0, 1)
        };
      }
      default: {
        return null;
      }
    }
  }, [timeFilter]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: usersPerPage,
        search: searchTerm,
        role: roleFilter !== 'all' ? roleFilter : undefined
      };

      // Ajouter les filtres de date si nécessaire
      if (timeFilter !== 'all' && getDateRange) {
        params.start_date = getDateRange.start.toISOString().split('T')[0];
        params.end_date = getDateRange.end.toISOString().split('T')[0];
      }

      const response = await axios.get(`${API_URL}/users`, { params });
console.log("response users" ,response)
      const fetchedUsers = response.data.data.users;
      console.log("fetchedUsers" ,fetchedUsers)
      setUsers(fetchedUsers);
      setPaginationMeta(response.data.data.meta);

      // Vérifier les promos actives uniquement pour les clients
      const clientIds = fetchedUsers
        .filter(user => user.role === 'client')
        .map(user => user.id);
      
      if (clientIds.length > 0) {
        await activePromosCache(clientIds);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, roleFilter, timeFilter, getDateRange, activePromosCache]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const getRoleBadge = (user) => {
    const roleOption = rolesOptions.find(opt => opt.value === user.role);
    if (!roleOption) return null;
    
    if (user.role === 'driver' && user.vehicule_type) {
      const vehicle = vehicleTypes[user.vehicule_type];
      return (
        <div className={`flex items-center px-2 py-1 rounded-full ${vehicle?.color}`}>
          {vehicle?.icon}
          <span className="text-sm font-medium">{vehicle?.label}</span>
        </div>
      );
    }
    
    return (
      <div className={`flex items-center px-2 py-1 rounded-full ${roleOption.color}`}>
        <User2 className="w-4 h-4 mr-1" />
        <span className="text-sm font-medium">{roleOption.label}</span>
      </div>
    );
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  const closeSuspendModal = () => {
    setUserToSuspend(null);
  };

  const closePromoModal = () => {
    setUserForPromo(null);
  };

  const handleViewUser = async (user) => {
    setSelectedUser(user);
    // Charger les infos promo si c'est un client et qu'on n'a pas encore les infos
    if (user.role === 'client' && !activePromos[user.id]) {
      try {
        const response = await axios.get(`${API_URL}/users/${user.id}/active-promo`);
        setActivePromos(prev => ({
          ...prev,
          [user.id]: response.data.data
        }));
      } catch (err) {
        console.error('Error fetching promo details:', err);
      }
    }
  };

  const handleSuspendUser = async () => {
    if(user?.role !== 'admin') return     toast.info(
      userToSuspend.is_deleted 
        ? `Vous n'avez pas le droit de réactiver ${userToSuspend.first_name}` 
        : `Vous n'avez pas le droit de suspendre ${userToSuspend.first_name}`
    );
    setIsSubmitting(true);
    try {
      await axios.patch(`${API_URL}/users/update/${userToSuspend.id}/`, {
        is_deleted: !userToSuspend.is_deleted
      });
      await fetchUsers();
      setUserToSuspend(null);
      toast.success(
        userToSuspend.is_deleted 
          ? `Utilisateur ${userToSuspend.first_name} réactivé avec succès` 
          : `Utilisateur ${userToSuspend.first_name} suspendu avec succès`,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    } catch (err) {
      setError(err.message);
      console.error('Error suspending/reactivating user:', err);
      toast.error(
        `Erreur lors de ${userToSuspend.is_deleted ? 'la réactivation' : 'la suspension'} de l'utilisateur`,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await axios.get(`${API_URL}/users/export`, {
        responseType: 'blob',
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'users_export.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
      console.error('Error exporting users:', err);
      toast.error("Erreur lors de l'exportation des données", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleAddPromo = async (promoData) => {
    setIsSubmitting(true);
    try {
      console.log("userForPromo.id" ,userForPromo.id)
      console.log("promo-data" ,promoData)
      await axios.post(`${API_URL}/users/${userForPromo.id}/promo-codes`, {
        code: promoData.code,
        discount: parseFloat(promoData.discount),
        rides_count: parseInt(promoData.rides_count),
        start_date: promoData.start_date,
        end_date: promoData.end_date
      });
      await fetchUsers();
      setUserForPromo(null);
      toast.success(`Code promo ajouté avec succès pour ${userForPromo.first_name}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (err) {
      setError(err.message);
      console.error('Error adding promo code:', err);
      toast.error("Erreur lors de l'ajout du code promo", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="w-5 h-5 text-yellow-400 fill-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-5 h-5 text-yellow-400 fill-yellow-400/50" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />);
    }
    
    return stars;
  };

  if (loading) {
    return (
      <Page title="Wego Dashboard">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F4C509]"></div>
          </div>
        </div>
      </Page>
    );
  }

  if (error) {
    return (
      <Page title="Wego Dashboard">
        <div className="container mx-auto px-4 py-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Erreur !</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        </div>
      </Page>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-2xl font-bold mb-3">Gestion des Utilisateurs</h1>
        
        {/* Filters and Search */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-4 flex-wrap">
            <div className="w-full md:w-48">
              <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Rôle
              </label>
              <select
                id="role-filter"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {rolesOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full md:w-48">
              <label htmlFor="time-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Période
              </label>
              <select
                id="time-filter"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={timeFilter}
                onChange={(e) => {
                  setTimeFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {timeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex items-end gap-2">
            <div className="relative w-full md:w-64">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Rechercher
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
            <AddUserModal API_URL={API_URL} fetchUsers={fetchUsers}/>
            <button
              onClick={handleExport}
              className="ml-4 bg-[#F4C509] text-white px-4 py-2 rounded-md hover:bg-[rgb(243, 196, 6)] transition-colors"
              disabled={isExporting}
            >
              {isExporting ? 'Exportation en cours...' : 'Exporter les données'}
            </button>
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto shadow-md rounded-lg" style={{ maxHeight: '600px', overflowY: 'auto' }}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Téléphone
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle / Véhicule
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Courses
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className={`hover:bg-gray-50 ${user.is_deleted ? 'bg-gray-100' : ''}`}>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User2 className="h-6 w-6 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 flex items-center">
                            {user.first_name}
                            {activePromos[user.id] && (
                              <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full flex items-center">
                                <Tag className="h-3 w-3 mr-1" />
                                Promo active
                              </span>
                            )}
                            {user.is_deleted ? (
                              <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">
                                Suspendu
                              </span>
                            ) : ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Phone className="w-4 h-4 mr-2 text-gray-500" />
                        {user.phone}
                      </div>
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      {getRoleBadge(user)}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap ">
                      <div className="text-sm text-gray-900">
                        {user.rides_stats?.count.total || 0} courses
                      </div>
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="text-[#06A257] hover:text-[#06A257] p-1 rounded"
                        title="Voir détails"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {user.role === 'client' && (
                        <button
                          onClick={() => setUserForPromo(user)}
                          className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50"
                          title="Ajouter code promo"
                        >
                          <Gift className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setUserToSuspend(user)}
                        className={`${user.is_deleted ? 'text-green-600 hover:text-green-900 hover:bg-green-50' : 'text-orange-600 hover:text-orange-900 hover:bg-orange-50'} p-1 rounded`}
                        title={user.is_deleted ? "Réactiver" : "Suspendre"}
                      >
                        {user.is_deleted ? (
                          <Play className="h-4 w-4" />
                        ) : (
                          <Pause className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-3 whitespace-nowrap text-center h-64">
                    <div className="flex flex-col items-center justify-center h-full">
                      <User2 className="h-12 w-12 text-gray-400 mb-2" />
                      <div className="text-sm text-gray-500">Aucun utilisateur trouvé</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {paginationMeta.total > usersPerPage && (
          <div className="mt-4 flex justify-center">
            <nav className="inline-flex rounded-md shadow">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Précédent
              </button>
              {Array.from({ length: paginationMeta.last_page }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 border-t border-b border-gray-300 bg-white text-sm font-medium ${
                    currentPage === page 
                      ? 'bg-indigo-100 text-indigo-600' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === paginationMeta.last_page}
                className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Suivant
              </button>
            </nav>
          </div>
        )}

        {/* User Details Modal */}
        {selectedUser && (
          <>
            <div 
              className="fixed inset-0 bg-gray-500 opacity-50 backdrop-blur-sm z-40 transition-opacity duration-300"
              onClick={closeModal}
            ></div>
            
            <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md transform transition-transform duration-300 ease-in-out">
              <div className="h-full bg-white shadow-xl overflow-y-auto">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-xl font-bold">Détails de l&apos;utilisateur</h2>
                    <button
                      onClick={closeModal}
                      className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="flex flex-col items-center mb-6">
                      <div className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                        <User2 className="h-12 w-12 text-gray-500" />
                      </div>
                      
                      <h3 className="text-lg font-bold">
                        {selectedUser.first_name}
                        {selectedUser.is_deleted && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">
                            Suspendu
                          </span>
                        )}
                      </h3>
                      <div className="mt-1 flex items-center justify-center flex-wrap gap-2">
                        {getRoleBadge(selectedUser)}
                        {selectedUser.role === 'driver' && selectedUser.matricule && (
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            <span className="hidden sm:inline">Matricule: </span>
                            {selectedUser.matricule}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Téléphone</p>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          <Phone className="inline h-4 w-4 mr-2 text-gray-500" />
                          {selectedUser.phone}
                        </p>
                      </div>

                      {selectedUser.role == 'driver' && selectedUser.vehiculeType && (
                        <div>
                          <p className="text-sm text-gray-500">Type de véhicule</p>
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            {vehicleTypes[selectedUser.vehiculeType]?.label || selectedUser.vehiculeType}
                          </p>
                        </div>
                      )}
                      
                      {selectedUser.role == 'client' && activePromos[selectedUser.id] && (
                        <div className="pt-4 border-t">
                          <h4 className="font-medium text-gray-900 mb-2">Promotion active</h4>
                          <div className="bg-green-50 p-4 rounded-lg">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-500">Code</p>
                                <p className="mt-1 text-sm font-medium text-gray-900">
                                  {activePromos[selectedUser.id].code}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Réduction</p>
                                <p className="mt-1 text-sm font-medium text-gray-900">
                                  {activePromos[selectedUser.id].discount}%
                                </p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                              <div>
                                <p className="text-sm text-gray-500">Courses restantes</p>
                                <p className="mt-1 text-sm font-medium text-gray-900">
                                  {activePromos[selectedUser.id].rides_count - activePromos[selectedUser.id].used_count}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Valide jusqu&apos;au</p>
                                <p className="mt-1 text-sm font-medium text-gray-900">
                                  {new Date(activePromos[selectedUser.id].end_date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {selectedUser.role === 'driver' && (
                        <>
                          <div className="pt-4 border-t">
                            <h4 className="font-medium text-gray-900 mb-2">Performance</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-500">Note moyenne</p>
                                <div className="flex items-center mt-1">
                                  {renderStars(selectedUser.average_rating || 0)}
                                  <span className="ml-2 text-sm font-medium text-gray-900">
                                    ({selectedUser.average_rating?.toFixed(1) || '0.0'}/5.0)
                                  </span>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Chiffre d&apos;affaires</p>
                                <p className="mt-1 text-lg font-bold text-gray-900">
                                  {selectedUser.revenue?.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' }) || '0 FCFA'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      
                      <div className="pt-4 border-t">
                        <h4 className="font-medium text-gray-900 mb-2">Statistiques des courses</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Courses effectuées</p>
                            <p className="mt-1 text-lg font-bold text-gray-900">
                              {selectedUser.rides_stats?.count.total || 0}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Kilomètres totaux</p>
                            <p className="mt-1 text-lg font-bold text-gray-900">
                              {selectedUser.rides_stats?.distance.total || 0} km
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-1 gap-4">
                          {selectedUser.role === 'client' && (
                            <div>
                              <p className="text-sm text-gray-500">En tant que client</p>
                              <p className="mt-1 text-sm text-gray-900">
                                {selectedUser.rides_stats?.count.as_client || 0} courses
                              </p>
                            </div>
                          )}
                          {selectedUser.role === 'driver' && (
                            <div>
                              <p className="text-sm text-gray-500">En tant que chauffeur</p>
                              <p className="mt-1 text-sm text-gray-900">
                                {selectedUser.rides_stats?.count.as_driver || 0} courses
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-6 py-4 border-t flex justify-end">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 bg-[#F4C509] text-white rounded-md hover:bg-[rgb(243, 196, 6)]"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Suspend/Reactivate Confirmation Modal */}
        {userToSuspend && (
          <>
            <div 
              className="fixed inset-0 bg-gray-500 opacity-50 z-40 transition-opacity duration-300"
              onClick={closeSuspendModal}
            ></div>
            
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">
                    {userToSuspend.is_deleted ? 'Confirmer la réactivation' : 'Confirmer la suspension'}
                  </h2>
                  <button
                    onClick={closeSuspendModal}
                    className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <p className="mb-6">
                  Êtes-vous sûr de vouloir {userToSuspend.is_deleted ? 'réactiver' : 'suspendre'} l&apos;utilisateur <strong>{userToSuspend.first_name}</strong> ?
                </p>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={closeSuspendModal}
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSuspendUser}
                    disabled={isSubmitting}
                    className={`px-4 py-2 text-white rounded-md hover:bg-opacity-90 flex items-center justify-center ${
                      userToSuspend.is_deleted ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {userToSuspend.is_deleted ? 'Réactivation...' : 'Suspension...'}
                      </div>
                    ) : (
                      userToSuspend.is_deleted ? 'Réactiver' : 'Suspendre'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Promo Code Modal */}
        {userForPromo && (
          <>
            <div 
              className="fixed inset-0 bg-gray-500 opacity-50  z-40 transition-opacity duration-300"
              onClick={closePromoModal}
            ></div>
            
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Ajouter un code promo</h2>
                  <button
                    onClick={closePromoModal}
                    className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleAddPromo({
                    code: formData.get('code'),
                    discount: formData.get('discount'),
                    rides_count: formData.get('rides_count'),
                    start_date: formData.get('start_date'),
                    end_date: formData.get('end_date')
                  });
                }}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Code promo
                      </label>
                      <input
                        type="text"
                        name="code"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Ex: WEGO25"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Réduction (%)
                      </label>
                      <input
                        type="number"
                        name="discount"
                        min="1"
                        max="100"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="10"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre de courses concernées
                      </label>
                      <input
                        type="number"
                        name="rides_count"
                        min="1"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="5"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date de début
                        </label>
                        <input
                          type="date"
                          name="start_date"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date de fin
                        </label>
                        <input
                          type="date"
                          name="end_date"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={closePromoModal}
                      disabled={isSubmitting}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-[#F4C509] text-white rounded-md hover:bg-[rgb(243, 196, 6)] flex items-center justify-center disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Enregistrement...
                        </div>
                      ) : (
                        'Enregistrer'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
  );
};

export default UsersTable;