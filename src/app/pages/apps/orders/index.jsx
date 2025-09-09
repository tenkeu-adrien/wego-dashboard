import { useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { socket } from 'app/pages/dashboards/home'
import { Page } from 'components/shared/Page'

const OrdersComponent = () => {
  const [orders, setOrders] = useState([])
  const [allOrders, setAllOrders] = useState([]) // Stocker toutes les commandes pour le filtrage côté client
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  // const [isExporting, setIsExporting] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    total: 0,
    lastPage: 1
  })

  // Nouveaux états pour les fonctionnalités ajoutées
  const [availableDrivers, setAvailableDrivers] = useState([])
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  })
  const [showDriverModal, setShowDriverModal] = useState(false)
  const [currentOrderId, setCurrentOrderId] = useState(null)

  // console.log("isExporting" ,isExporting)
  // console.log()

  const API_URL = "https://wegoadmin-c5c82e2c5d80.herokuapp.com/api/v1"
  // https://wegoadmin-c5c82e2c5d80.herokuapp.com/api/v1
// http://localhost:3333/api/v1
  const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'pending', label: 'En attente' },
    { value: 'preparing', label: 'En préparation' },
    { value: 'delivering', label: 'En livraison' },
    { value: 'delivered', label: 'Livrées' },
    { value: 'cancelled', label: 'Annulées' }
  ]

  const statusClasses = {
    pending: 'bg-yellow-100 text-yellow-800',
    preparing: 'bg-blue-100 text-blue-800',
    delivering: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }

  const statusLabels = {
    pending: 'En attente',
    preparing: 'En préparation',
    delivering: 'En livraison',
    delivered: 'Livrée',
    cancelled: 'Annulée'
  }

  const statusIcons = {
    pending: '⏳',
    preparing: '👨‍🍳',
    delivering: '🚚',
    delivered: '✅',
    cancelled: '❌'
  }

  // Filtrer les commandes en fonction du terme de recherche, du filtre de statut et de la date
  const filteredOrders = useMemo(() => {
    let result = [...allOrders];

    // Filtre par statut
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }

    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order => 
        (order.client?.first_name?.toLowerCase().includes(term)) ||
        (order.restaurant?.name?.toLowerCase().includes(term)) ||
        (order.status?.toLowerCase().includes(term)) ||
        (order.id?.toString().includes(term)) ||
        (order.delivery_address?.toLowerCase().includes(term)) ||
        (order.driver?.name?.toLowerCase().includes(term)) // Recherche par nom de livreur
      );
    }

    // Filtre par date (nouveau)
    if (dateRange.start || dateRange.end) {
      result = result.filter(order => {
        const orderDate = new Date(order.created_at);
        const startDate = dateRange.start ? new Date(dateRange.start) : null;
        const endDate = dateRange.end ? new Date(dateRange.end) : null;
        
        if (startDate && endDate) {
          // Ajouter un jour à la date de fin pour inclure toute la journée
          endDate.setDate(endDate.getDate() + 1);
          return orderDate >= startDate && orderDate <= endDate;
        } else if (startDate) {
          return orderDate >= startDate;
        } else if (endDate) {
          // Ajouter un jour à la date de fin pour inclure toute la journée
          endDate.setDate(endDate.getDate() + 1);
          return orderDate <= endDate;
        }
        return true;
      });
    }

    return result;
  }, [allOrders, statusFilter, searchTerm, dateRange]);

  // Paginer les commandes filtrées
  const paginatedOrders = useMemo(() => filteredOrders, [filteredOrders]);

console.log("orders",orders)
  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true)
      const params = {
        page,
        per_page: pagination.perPage, // Utiliser la valeur actuelle de perPage
      }
  
      const response = await axios.get(`${API_URL}/orders`, { params })
      
      console.log("response" ,response)
      const { data, meta } = response.data
      setOrders(data || [])
      setAllOrders(data || []) // Pour le filtrage côté client
      
      setPagination(prev => ({
        ...prev,
        page: meta.current_page,
        perPage: meta.per_page,
        total: meta.total,
        lastPage: meta.last_page
      }))
      
      setError(null)
    } catch (err) {
      setError(err.message)
      toast.error('Erreur lors du chargement des commandes')
      console.error("Fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  // Fonction pour récupérer les livreurs disponibles
  const fetchAvailableDrivers = async () => {
    try {
      const response = await axios.get(`${API_URL}/drivers/available`)
      console.log("driver data" ,response)
      setAvailableDrivers(response.data.data || [])
    } catch (err) {
      console.error("Erreur lors de la récupération des livreurs:", err)
      toast.error('Erreur lors du chargement des livreurs disponibles')
    }
  }

  const handlePageChange = (newPage) => {
    fetchOrders(newPage)
  }

  const handlePreviousPage = () => {
    if (pagination.page > 1) {
      fetchOrders(pagination.page - 1)
    }
  }

  const handleNextPage = () => {
    if (pagination.page < pagination.lastPage) {
      fetchOrders(pagination.page + 1)
    }
  }

  // Fonction pour mettre à jour le statut d'une commande
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // Si on passe en livraison, ouvrir la modal pour sélectionner un livreur
      if (newStatus === 'delivering') {
        setCurrentOrderId(orderId)
        await fetchAvailableDrivers()
        setShowDriverModal(true)
        return
      }
      
      // Pour les autres statuts, procéder normalement
      await axios.patch(`${API_URL}/orders/${orderId}`, {
        status: newStatus
      })  
      
      let successMessage = ''
      switch (newStatus) {
        case 'preparing':
          successMessage = 'Commande en cours de préparation'
          break
        case 'delivering':
          successMessage = 'Commande en cours de livraison'
          break
        case 'delivered':
          successMessage = 'Commande marquée comme livrée'
          break
        default:
          return
      }
      
      toast.success(successMessage)
      
      // Mettre à jour localement le statut
      setAllOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ))
      
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
      console.error("Status update error:", error)
    }
  }

  // Fonction pour confirmer la livraison avec livreur
  const confirmDeliveryWithDriver = async () => {
    if (!selectedDriver) {
      toast.error('Veuillez sélectionner un livreur')
      return
    }
    
    try {
      await axios.patch(`${API_URL}/orders/${currentOrderId}`, {
        status: 'delivering',
        driver_id: selectedDriver
      })  
        fetchOrders(1)
      toast.success('Commande en cours de livraison')
    
      // Mettre à jour localement le statut et le livreur
      setAllOrders(prev => prev.map(order => 
        order.id === currentOrderId ? { 
          ...order, 
          status: 'delivering',
          driver_id: selectedDriver 
        } : order
      ))
      
      // Fermer la modal et réinitialiser
      setShowDriverModal(false)
      setSelectedDriver(null)
      setCurrentOrderId(null)
      
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
      console.error("Delivery confirmation error:", error)
    }
  }

  const handleStatusFilterChange = (e) => {
    const newStatus = e.target.value
    setStatusFilter(newStatus)
    setPagination(prev => ({ ...prev, page: 1 })) // Reset à la première page lors du changement de filtre
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setPagination(prev => ({ ...prev, page: 1 })) // Reset à la première page lors de la recherche
  }

  // Fonctions de gestion des dates
  const handleDateChange = (type, value) => {
    setDateRange(prev => ({
      ...prev,
      [type]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 })) // Reset à la première page
  }

  const clearDateFilter = () => {
    setDateRange({ start: '', end: '' });
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const clearSearch = () => {
    setSearchTerm('')
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  useEffect(() => {
    fetchOrders(1)
  }, [])

  useEffect(() => {
    if (!socket) return

    const handleNewOrder = (newOrder) => {
      // Ajouter la nouvelle commande et mettre à jour le total
      setAllOrders(prev => [newOrder, ...prev])
      setPagination(prev => ({ ...prev, total: prev.total + 1 }))
      toast.info('Nouvelle commande reçue !')
    }

    const handleStatusChange = (updatedOrder) => {
      setAllOrders(prev => prev.map(order => 
        order.id === updatedOrder.id ? updatedOrder : order
      ))
    }

    socket.on('order:store', handleNewOrder)
    // socket.on('order:status', handleStatusChange)
    socket.on('order:delivered', handleStatusChange)

    return () => {
      socket.off('order:store', handleNewOrder)
      // socket.off('order:status', handleStatusChange)
      socket.off('order:delivered', handleStatusChange)
    }
  }, [socket])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F4C509]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Erreur !</strong>
        <span className="block sm:inline"> {error}</span>
        <button 
          onClick={() => fetchOrders(pagination.page)}
          className="mt-2 bg-[#F4C509] text-white px-4 py-1 rounded"
        >
          Réessayer
        </button>
      </div>
    )
  }

  return (
    <Page title="Commandes">
      <div className="container mx-auto px-4 py-8">
        {/* Header avec recherche et filtres */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Gestion des Commandes</h2>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <select
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F4C509] focus:border-[#F4C509]"
                value={statusFilter}
                onChange={handleStatusFilterChange}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Rechercher par client, restaurant ou statut..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F4C509] focus:border-[#F4C509]"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {searchTerm && (
                <button 
                  onClick={clearSearch}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>

            {/* Nouveau: Filtre par date */}
            <div className="flex flex-col md:flex-row gap-2 items-center">
              <div className="relative">
                <input
                  type="date"
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F4C509] focus:border-[#F4C509]"
                  value={dateRange.start}
                  onChange={(e) => handleDateChange('start', e.target.value)}
                  placeholder="Date de début"
                />
              </div>
              <span className="text-gray-500">au</span>
              <div className="relative">
                <input
                  type="date"
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F4C509] focus:border-[#F4C509]"
                  value={dateRange.end}
                  onChange={(e) => handleDateChange('end', e.target.value)}
                  placeholder="Date de fin"
                />
              </div>
              {(dateRange.start || dateRange.end) && (
                <button 
                  onClick={clearDateFilter}
                  className="text-gray-400 hover:text-gray-600"
                  title="Effacer le filtre de date"
                >
                  ×
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Indicateur de statut avec instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 极速加速器v2ray 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Instructions</h3>
              <div className="mt-1 text-sm text-blue-700">
                <p>Cliquez sur les boutons de statut pour faire évoluer une commande :</p>
                <div className="flex flex-wrap gap-3 mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    ⏳ En attente → 👨‍🍳 En préparation
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    👨‍🍳 En préparation → 🚚 En livraison
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    🚚 En livraison → ✅ Livrée
                  </span>
                </div>
                <p className="mt-2">Pour les commandes en livraison, sélectionnez un livreur disponible.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Grille de commandes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {paginatedOrders.length > 0 ? (
            paginatedOrders.map(order => (
              <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                {/* En-tête de la commande */}
                <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Commande #{order.id}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusClasses[order.status]}`}>
                    {statusIcons[order.status]} {statusLabels[order.status]}
                  </span>
                </div>

                {/* Corps de la commande */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Client</h4>
                      <p className="text-gray-800">{order.client?.first_name || 'Non spécifié'}</p>
                      <p className="text-sm text-gray-500 mt-1">{order.delivery_address}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Restaurant</h4>
                      <p className="text-gray-800">{order.restaurant?.name || 'Non spécifié'}</p>
                      <p className="text-sm text-gray-500 mt-1">{order.restaurant?.address || 'Non spécifié'}</p>
                      <p className="text-sm text-gray-500 mt-1">{order.restaurant?.phone || 'Non spécifié'}</p>
                    </div>
                  </div>

                  {/* Nouveau: Affichage du livreur */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Livreur</h4>
                    <p className="text-gray-800">
                      {order.driver?.first_name || 'Aucun livreur assigné'}
                    </p>
                    {order.driver?.phone && (
                      <p className="text-sm text-gray-500 mt-1">{order.driver.phone}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Plats</h4>
                    <ul className="space-y-2">
                      {order.items?.map(item => (
                        <li key={item.id} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                          <div className="flex items-center">
                            <span className="text-gray-800"> quantité: {item.quantity} x</span>
                            <span className="ml-2 text-gray-700"> {item.dish?.name || 'Plat inconnu'}</span>
                          </div>
                          <span className="font-medium text-gray-900">
                            {Number(item.unit_price * item.quantity).toLocaleString('fr-FR')} FCFA
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Total</h4>
                      <p className="text-xl font-bold text-gray-800">
                        {order.total_price
                          ? Number(order.total_price).toLocaleString('fr-FR')
                          : '0'} FCFA
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
                          title="Cliquer pour mettre en préparation"
                        >
                          <span className="text-lg">👨‍🍳</span>
                          <span>Préparer</span>
                        </button>
                      )}
                      
                      {order.status === 'preparing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'delivering')}
                          className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded text-sm transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
                          title="Cliquer pour mettre en livraison"
                        >
                          <span className="text-lg">🚚</span>
                          <span>Livrer</span>
                        </button>
                      )}
                      
                      {order.status === 'delivering' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
                          title="Cliquer pour marquer comme livrée"
                        >
                          <span className="text-lg">✅</span>
                          <span>Livrée</span>
                        </button>
                      )}
                      
                      {(order.status === 'delivered' || order.status === 'cancelled') && (
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusClasses[order.status]}`}>
                          {statusIcons[order.status]} {statusLabels[order.status]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                {searchTerm || statusFilter !== 'all' || dateRange.start || dateRange.end ? 'Aucune commande trouvée' : 'Aucune commande disponible'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' || dateRange.start || dateRange.end ? 'Essayez de modifier vos critères de recherche' : 'Les nouvelles commandes apparaîtront ici'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.lastPage > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
            <div className="text-sm text-gray-500">
              Affichage de <span className="font-medium">{(pagination.page - 1) * pagination.perPage + 1}</span> à
              <span className="font-medium">
                {Math.min(pagination.page * pagination.perPage, pagination.total)}
              </span>{' '}
              sur <span className="font-medium">{pagination.total}</span> résultats
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handlePreviousPage}
                disabled={pagination.page === 1}
                className={`px-4 py-2 rounded-lg flex items-center gap-1 ${
                  pagination.page === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-[#F4C509] text-white hover:bg-[#e6b800]'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0极速加速器v2ray z" clipRule="evenodd" />
                </svg>
                Précédent
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.lastPage) }, (_, i) => {
                  const pageNum = i + 1
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-lg ${
                        pagination.page === pageNum
                          ? 'bg-[#F4C509] text-white font-medium'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>
              
              <button
                onClick={handleNextPage}
                disabled={pagination.page === pagination.lastPage}
                className={`px-4 py-2 rounded-lg flex items-center gap-1 ${
                  pagination.page === pagination.lastPage 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-[#F4C509] text-white hover:bg-[#e6b800]'
                }`}
              >
                Suivant
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Modal de sélection du livreur */}
        {showDriverModal && (
          <div className="fixed inset-0 bg-gray-600 opacity-90 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Sélectionner un livreur
              </h3>
              
              {availableDrivers.length > 0 ? (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Choisissez un livreur disponible
                    </label>
                    <select
                      className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F4C509] focus:border-[#F4C509]"
                      value={selectedDriver || ''}
                      onChange={(e) => setSelectedDriver(e.target.value)}
                    >
                      <option value="">Sélectionnez un livreur</option>
                      {availableDrivers.map(driver => (
                        <option key={driver.id} value={driver.id}>
                          {driver.first_name} - {driver.phone}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setShowDriverModal(false)
                        setSelectedDriver(null)
                        setCurrentOrderId(null)
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={confirmDeliveryWithDriver}
                      className="px-4 py-2 bg-[#F4C509] text-white rounded-lg hover:bg-[#e6b800]"
                      disabled={!selectedDriver}
                    >
                      Confirmer
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-4">Aucun livreur disponible</p>
                  <button
                    onClick={() => setShowDriverModal(false)}
                    className="px-4 py-2 bg-[#F4C509] text-white rounded-lg hover:bg-[#e6b800]"
                  >
                    Fermer
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Page>
  )
}
export default OrdersComponent