// import { useEffect, useState } from 'react'
// import axios from 'axios'
// import { toast } from 'react-toastify'
// import { socket } from 'app/pages/dashboards/home'
// import { Page } from 'components/shared/Page'

// const OrdersComponent = () => {
//   const [orders, setOrders] = useState([])
//   const [allOrders, setAllOrders] = useState([])
//   const [filteredOrders, setFilteredOrders] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [statusFilter, setStatusFilter] = useState('pending')
//   const [isExporting, setIsExporting] = useState(false)
//   const [pagination, setPagination] = useState({
//     page: 1,
//     perPage: 4,
//     total: 0,
//     lastPage: 1
//   })
//   console.log("orders", orders)
//   const API_URL = "https://wegoadmin-c5c82e2c5d80.herokuapp.com/api/v1"

//   const statusOptions = [
//     { value: 'all', label: 'Tous les statuts' },
//     { value: 'pending', label: 'En attente' },
//     { value: 'preparing', label: 'En préparation' },
//     { value: 'delivering', label: 'En livraison' },
//     { value: 'delivered', label: 'Livrées' },
//     { value: 'cancelled', label: 'Annulées' }
//   ]

//   const fetchOrders = async (page = 1, search = '') => {
//     try {
//       setLoading(true)
//       const response = await axios.get(`${API_URL}/orders`, {
//         params: {
//           page,
//           per_page: pagination.perPage,
//           search
//         }
//       })
      
//       const { data, meta } = response.data
//       setOrders(data || [])
//       setAllOrders(data || [])
//       setFilteredOrders(data || [])
//       setPagination({
//         page: meta.current_page,
//         perPage: meta.per_page,
//         total: meta.total,
//         lastPage: meta.last_page
//       })
//       setError(null)
//     } catch (err) {
//       setError(err.message)
//       toast.error('Erreur lors du chargement des commandes')
//       console.error("Fetch error:", err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleExport = async () => {
//     setIsExporting(true)
//     try {
//       const response = await axios.get(`${API_URL}/orders/export`, {
//         responseType: 'blob',
//       })

//       const url = window.URL.createObjectURL(new Blob([response.data]))
//       const link = document.createElement('a')
//       link.href = url
//       link.setAttribute('download', 'commandes_export.xlsx')
//       document.body.appendChild(link)
//       link.click()
//       document.body.removeChild(link)
//       window.URL.revokeObjectURL(url)
//     } catch (err) {
//       setError(err.message)
//       console.error('Error exporting orders:', err)
//       toast.error("Erreur lors de l'exportation des données")
//     } finally {
//       setIsExporting(false)
//     }
//   }

//   const applyFilters = () => {
//     let filtered = [...allOrders]

//     if (statusFilter !== 'all') {
//       filtered = filtered.filter(order => order.status === statusFilter)
//     }

//     if (searchTerm) {
//       const term = searchTerm.toLowerCase()
//       filtered = filtered.filter(order => 
//         (order.client?.first_name?.toLowerCase().includes(term)) ||
//         (order.restaurant?.name?.toLowerCase().includes(term)) ||
//         (order.status?.toLowerCase().includes(term)) ||
//         (order.id?.toString().includes(term))
//       )
//     }

//     setFilteredOrders(filtered)
//     setPagination(prev => ({
//       ...prev,
//       total: filtered.length,
//       page: 1
//     }))
//   }

//   // Calcul des commandes à afficher en fonction de la pagination
//   const getPaginatedOrders = () => {
//     const startIndex = (pagination.page - 1) * pagination.perPage
//     const endIndex = startIndex + pagination.perPage
//     return filteredOrders.slice(startIndex, endIndex)
//   }

//   useEffect(() => {
//     applyFilters()
//   }, [statusFilter, searchTerm, allOrders])

//   useEffect(() => {
//     fetchOrders()
//   }, [])

//   useEffect(() => {
//     if (!socket) return

//     const handleNewOrder = (newOrder) => {
//       setAllOrders(prev => [newOrder, ...prev])
//       toast.info('Nouvelle commande reçue !')
//     }

//     const handleStatusChange = (updatedOrder) => {
//       setAllOrders(prev => prev.map(order => 
//         order.id === updatedOrder.id ? updatedOrder : order
//       ))
//       // toast.info(`Commande #${updatedOrder.id} mise à jour: ${updatedOrder.status}`)
//     }

//     socket.on('order:new', handleNewOrder)
//     socket.on('order:status', handleStatusChange)
//     socket.on('order:delivered', handleStatusChange)

//     return () => {
//       socket.off('order:new', handleNewOrder)
//       socket.off('order:status', handleStatusChange)
//       socket.off('order:delivered', handleStatusChange)
//     }
//   }, [socket])

//   const markAsDelivered = async (orderId) => {
//     try {
//       await axios.patch(`${API_URL}/orders/${orderId}/delivered`)
//       toast.success('Commande marquée comme livrée')
//       fetchOrders()
//     } catch (error) {
//       toast.error('Erreur lors de la mise à jour')
//       console.error("Delivery error:", error)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F4C509]"></div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
//         <strong className="font-bold">Erreur !</strong>
//         <span className="block sm:inline"> {error}</span>
//         <button 
//           onClick={() => fetchOrders(pagination.page, searchTerm)}
//           className="mt-2 bg-[#F4C509] text-white px-4 py-1 rounded"
//         >
//           Réessayer
//         </button>
//       </div>
//     )
//   }

//   return (
//     <Page title="Commandes">
//       <div className="container mx-auto px-4 py-8">
//         {/* Header avec recherche et filtres */}
//         <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
//           <h2 className="text-2xl font-bold text-gray-800">Gestion des Commandes</h2>
          
//           <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
//             <div className="relative w-full md:w-64">
//               <select
//                 className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F4C509] focus:border-[#F4C509]"
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//               >
//                 {statusOptions.map(option => (
//                   <option key={option.value} value={option.value}>{option.label}</option>
//                 ))}
//               </select>
//             </div>
            
//             <div className="relative w-full md:w-96">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
//                 </svg>
//               </div>
//               <input
//                 type="text"
//                 placeholder="Rechercher par client, restaurant ou statut..."
//                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F4C509] focus:border-[#F4C509]"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//               {searchTerm && (
//                 <button 
//                   onClick={() => setSearchTerm('')}
//                   className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
//                 >
//                   ×
//                 </button>
//               )}
//             </div>
            
//             <button
//               onClick={handleExport}
//               disabled={isExporting}
//               className="bg-[#F4C509] hover:bg-[#e6b800] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 whitespace-nowrap"
//             >
//               {isExporting ? (
//                 <>
//                   <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Export en cours...
//                 </>
//               ) : (
//                 <>
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
//                   </svg>
//                   Exporter
//                 </>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Grille de commandes */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//           {getPaginatedOrders().length > 0 ? (
//             getPaginatedOrders().map(order => (
//               <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
//                 {/* En-tête de la commande */}
//                 <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-800">Commande #{order.id}</h3>
//                     <p className="text-sm text-gray-500">
//                       {new Date(order.createdAt).toLocaleString('fr-FR', {
//                         day: '2-digit',
//                         month: '2-digit',
//                         year: 'numeric',
//                         hour: '2-digit',
//                         minute: '2-digit'
//                       })}
//                     </p>
//                   </div>
//                   <span className={`px-3 py-1 text-xs font-medium rounded-full ${
//                     order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                     order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
//                     order.status === 'delivering' ? 'bg-purple-100 text-purple-800' :
//                     order.status === 'delivered' ? 'bg-green-100 text-green-800' :
//                     'bg-red-100 text-red-800'
//                   }`}>
//                     {order.status === 'pending' ? 'En attente' :
//                      order.status === 'preparing' ? 'En préparation' :
//                      order.status === 'delivering' ? 'En livraison' :
//                      order.status === 'delivered' ? 'Livrée' : 'Annulée'}
//                   </span>
//                 </div>

//                 {/* Corps de la commande */}
//                 <div className="p-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                     <div>
//                       <h4 className="text-sm font-medium text-gray-500 mb-1">Client</h4>
//                       <p className="text-gray-800">{order.client?.first_name || 'Non spécifié'}</p>
//                       <p className="text-sm text-gray-500 mt-1">{order.deliveryAddress}</p>
//                     </div>
                    
//                     <div>
//                       <h4 className="text-sm font-medium text-gray-500 mb-1">Restaurant</h4>
//                       <p className="text-gray-800">{order.restaurant?.name || 'Non spécifié'}</p>
//                     </div>
//                   </div>

//                   <div className="mb-4">
//                     <h4 className="text-sm font-medium text-gray-500 mb-2">Plats</h4>
//                     <ul className="space-y-2">
//                       {order.items?.map(item => (
//                         <li key={item.id} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
//                           <div className="flex items-center">
//                             <span className="text-gray-800"> quantité: {item.quantity} x</span>
//                             <span className="ml-2 text-gray-700"> {item.dish?.name || 'Plat inconnu'}</span>
//                           </div>
//                           <span className="font-medium text-gray-900">
//                             {(item.unit_price * item.quantity)?.toFixed(2)} FCFA
//                           </span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>

//                   <div className="flex justify-between items-center pt-4 border-t border-gray-100">
//                     <div>
//                       <h4 className="text-sm font-medium text-gray-500">Total</h4>
//                       <p className="text-xl font-bold text-gray-800">{order.total_price? order.total_price : '0.00'} FCFA</p>
//                     </div>
                    
//                     {order.status !== 'delivered' && (
//                       <button
//                         onClick={() => markAsDelivered(order.id)}
//                         className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
//                       >
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                           <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                         </svg>
//                         Marquer comme livrée
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="col-span-2 text-center py-12">
//               <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <h3 className="mt-2 text-lg font-medium text-gray-900">
//                 {searchTerm || statusFilter !== 'all' ? 'Aucune commande trouvée' : 'Aucune commande disponible'}
//               </h3>
//               <p className="mt-1 text-sm text-gray-500">
//                 {searchTerm || statusFilter !== 'all' ? 'Essayez de modifier vos critères de recherche' : 'Les nouvelles commandes apparaîtront ici'}
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Pagination */}
//         {filteredOrders.length > pagination.perPage && (
//           <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
//             <div className="text-sm text-gray-500">
//               Affichage de <span className="font-medium">{(pagination.page - 1) * pagination.perPage + 1}</span> à{' '}
//               <span className="font-medium">
//                 {Math.min(pagination.page * pagination.perPage, filteredOrders.length)}
//               </span>{' '}
//               sur <span className="font-medium">{filteredOrders.length}</span> résultats
//             </div>
            
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
//                 disabled={pagination.page === 1}
//                 className={`px-4 py-2 rounded-lg flex items-center gap-1 ${
//                   pagination.page === 1 
//                     ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
//                     : 'bg-[#F4C509] text-white hover:bg-[#e6b800]'
//                 }`}
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
//                 </svg>
//                 Précédent
//               </button>
              
//               <div className="flex items-center gap-1">
//                 {Array.from({ length: Math.min(5, Math.ceil(filteredOrders.length / pagination.perPage)) }, (_, i) => {
//                   let pageNum;
//                   const totalPages = Math.ceil(filteredOrders.length / pagination.perPage)
                  
//                   if (totalPages <= 5) {
//                     pageNum = i + 1
//                   } else if (pagination.page <= 3) {
//                     pageNum = i + 1
//                   } else if (pagination.page >= totalPages - 2) {
//                     pageNum = totalPages - 4 + i
//                   } else {
//                     pageNum = pagination.page - 2 + i
//                   }
                  
//                   return (
//                     <button
//                       key={pageNum}
//                       onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
//                       className={`w-10 h-10 rounded-lg ${
//                         pagination.page === pageNum
//                           ? 'bg-[#F4C509] text-white font-medium'
//                           : 'bg-white text-gray-700 hover:bg-gray-100'
//                       }`}
//                     >
//                       {pageNum}
//                     </button>
//                   )
//                 })}
//               </div>
              
//               <button
//                 onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
//                 disabled={pagination.page === Math.ceil(filteredOrders.length / pagination.perPage)}
//                 className={`px-4 py-2 rounded-lg flex items-center gap-1 ${
//                   pagination.page === Math.ceil(filteredOrders.length / pagination.perPage) 
//                     ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
//                     : 'bg-[#F4C509] text-white hover:bg-[#e6b800]'
//                 }`}
//               >
//                 Suivant
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </Page>
//   )
// }

// export default OrdersComponent



// import React from 'react'

export default function index() {
  return (
    <div>index</div>
  )
}
