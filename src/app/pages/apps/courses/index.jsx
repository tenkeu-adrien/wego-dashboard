import { useState, useMemo } from 'react';
import { ordersList, orderStatusOptions, paymentMethodOptions, deliveryOptions, vehicleOptions } from './data';
import { Eye, Trash,  X,  MapPin, Package } from 'lucide-react';
import { PiMotorcycleBold } from 'react-icons/pi';
import { RiBikeFill } from 'react-icons/ri';

const OrdersTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [vehicleFilter, setVehicleFilter] = useState('all');
  const [deliveryFilter, setDeliveryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const ordersPerPage = 5;

  const filteredOrders = useMemo(() => {
    return ordersList.filter(order => {
      const statusMatch = statusFilter === 'all' || order.status === statusFilter;
      const paymentMatch = paymentFilter === 'all' || order.payment_method === paymentFilter;
      const vehicleMatch = vehicleFilter === 'all' || order.vehicule === vehicleFilter;
      const deliveryMatch = deliveryFilter === 'all' || 
                          (deliveryFilter === 'delivery' && order.is_delivery) || 
                          (deliveryFilter === 'normal' && !order.is_delivery);
      
      const searchMatch = 
        order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.chauffeur.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.is_delivery && order.recipient_phone?.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return statusMatch && paymentMatch && vehicleMatch && deliveryMatch && searchMatch;
    });
  }, [searchTerm, statusFilter, paymentFilter, vehicleFilter, deliveryFilter]);

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getStatusBadge = (status) => {
    const statusOption = orderStatusOptions.find(opt => opt.value === status);
    if (!statusOption) return null;
    const { color, label, icon: Icon } = statusOption;
    return (
      <div className={`flex items-center px-2 py-1 rounded-full ${color}`}>
        <Icon className="w-4 h-4 mr-1" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    );
  };

  const getPaymentMethodBadge = (method) => {
    const paymentOption = paymentMethodOptions.find(opt => opt.value === method);
    if (!paymentOption) return null;
    const { color, label, icon: Icon } = paymentOption;
    return (
      <div className={`flex items-center px-2 py-1 rounded-full ${color}`}>
        <Icon className="w-4 h-4 mr-1" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    );
  };

  const getVehicleIcon = (vehicleType) => {
    return vehicleType === 'moto-taxi' 
      ? <PiMotorcycleBold className="w-5 h-5 mr-1 text-blue-600" />
      : <RiBikeFill className="w-5 h-5 mr-1 text-green-600" />;
  };

  const getDeliveryIcon = (isDelivery) => {
    return isDelivery 
      ? <Package className="w-5 h-5 text-purple-600" />
      : <MapPin className="w-5 h-5 text-gray-600" />;
  };

  const handleViewOrder = (orderId) => {
    const order = ordersList.find(o => o.order_id === orderId);
    setSelectedOrder(order);
  };

  const handleDeleteOrder = (orderId) => {
    const order = ordersList.find(o => o.order_id === orderId);
    setOrderToDelete(order);
  };

  const confirmDelete = () => {
    console.log(`Deleting order ${orderToDelete.order_id}`);
    setOrderToDelete(null);
  };

  // const handleAddOrder = () => {
  //   console.log('Adding new order');
  // };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Gestion des Courses</h1>
      
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4 flex-wrap">
          <div className="w-full md:w-48">
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              id="status-filter"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">Tous les statuts</option>
              {orderStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-48">
            <label htmlFor="payment-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Paiement
            </label>
            <select
              id="payment-filter"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">Tous les paiements</option>
              {paymentMethodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-48">
            <label htmlFor="vehicle-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Véhicule
            </label>
            <select
              id="vehicle-filter"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              value={vehicleFilter}
              onChange={(e) => {
                setVehicleFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">Tous les véhicules</option>
              {vehicleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-48">
            <label htmlFor="delivery-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Type de course
            </label>
            <select
              id="delivery-filter"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              value={deliveryFilter}
              onChange={(e) => {
                setDeliveryFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">Tous les types</option>
              {deliveryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex items-end gap-2">
          <div className="w-full md:w-64">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Rechercher
            </label>
            <input
              type="text"
              id="search"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          {/* <button
            onClick={handleAddOrder}
            className="h-10 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
            title="Ajouter une course"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Ajouter</span>
          </button> */}
        </div>
      </div>
      
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID Course
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Chauffeur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Véhicule
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Départ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Arrivée
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Livraison
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paiement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentOrders.length > 0 ? (
              currentOrders.map((order) => (
                <tr key={order.order_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.order_id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.client}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.chauffeur}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      {getVehicleIcon(order.vehicule)}
                      {order.vehicule === 'moto-taxi' ? 'Moto-taxi' : 'Trycycle'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{order.pickup_address}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{order.destination_address}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getDeliveryIcon(order.is_delivery)}
                      {order.is_delivery && (
                        <span className="ml-1 text-sm text-gray-500">{order.recipient_phone}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPaymentMethodBadge(order.payment_method)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewOrder(order.order_id)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Voir les détails"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order.order_id)}
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
                <td colSpan={10} className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm text-gray-500">Aucune course trouvée</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredOrders.length > ordersPerPage && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Affichage de <span className="font-medium">{indexOfFirstOrder + 1}</span> à
            <span className="font-medium">
              {Math.min(indexOfLastOrder, filteredOrders.length)}
            </span>{' '}
            sur <span className="font-medium">{filteredOrders.length}</span> résultats
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md border flex items-center ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Précédent
            </button>
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-3 py-1 rounded-md border ${
                    currentPage === number
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                  }`}
                >
                  {number}
                </button>
              ))}
            </div>
            <button
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md border flex items-center ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Suivant
            </button>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div 
          className="fixed inset-0 z-50 overflow-hidden"
          onClick={closeModal}
        >
          <div className="absolute inset-0   bg-white opacity-70 transition-opacity"></div>
          <div 
            className={`fixed inset-y-0 right-0 max-w-full flex transform transition-all duration-300 ease-in-out ${
              selectedOrder ? 'translate-x-0' : '-translate-x-full'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-screen max-w-md">
              <div className="flex flex-col h-full bg-white shadow-xl">
                <div className="flex items-center justify-between px-4 py-6 border-b">
                  <h2 className="text-xl font-bold">Détails de la course</h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Informations de base</h3>
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">ID Course</p>
                          <p className="mt-1 text-sm font-medium text-gray-900">{selectedOrder.order_id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Client</p>
                          <p className="mt-1 text-sm font-medium text-gray-900">{selectedOrder.client}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Chauffeur</p>
                          <p className="mt-1 text-sm font-medium text-gray-900">{selectedOrder.chauffeur}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Véhicule</p>
                          <div className="mt-1 flex items-center">
                            {getVehicleIcon(selectedOrder.vehicule)}
                            <span className="ml-1 text-sm font-medium text-gray-900">
                              {selectedOrder.vehicule === 'moto-taxi' ? 'Moto-taxi' : 'Trycycle'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Itinéraire</h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <p className="text-sm text-gray-500">Départ</p>
                          <p className="mt-1 text-sm font-medium text-gray-900">{selectedOrder.pickup_address}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Destination</p>
                          <p className="mt-1 text-sm font-medium text-gray-900">{selectedOrder.destination_address}</p>
                        </div>
                        {selectedOrder.is_delivery && (
                          <div>
                            <p className="text-sm text-gray-500">Livraison à</p>
                            <div className="mt-1 flex items-center">
                              <Package className="h-4 w-4 text-purple-600 mr-2" />
                              <p className="text-sm font-medium text-gray-900">{selectedOrder.recipient_phone}</p>
                            </div>
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Distance</p>
                            <p className="mt-1 text-sm font-medium text-gray-900">{selectedOrder.distance || '5.2 km'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Durée estimée</p>
                            <p className="mt-1 text-sm font-medium text-gray-900">{selectedOrder.duration || '15 min'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Statut et Paiement</h3>
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Statut</p>
                          <div className="mt-1">
                            {getStatusBadge(selectedOrder.status)}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Méthode de paiement</p>
                          <div className="mt-1">
                            {getPaymentMethodBadge(selectedOrder.payment_method)}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Montant</p>
                          <p className="mt-1 text-sm font-medium text-gray-900">{selectedOrder.amount || '1 500 FCFA'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Date</p>
                          <p className="mt-1 text-sm font-medium text-gray-900">{selectedOrder.date || '24/05/2023 15:30'}</p>
                        </div>
                      </div>
                    </div>

                    {selectedOrder.notes && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Notes</h3>
                        <p className="mt-2 text-sm text-gray-700">{selectedOrder.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="border-t px-4 py-4 flex justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {orderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white opacity-90">
          <div 
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold text-gray-900">Confirmer la suppression</h3>
              <button 
                onClick={() => setOrderToDelete(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Êtes-vous sûr de vouloir supprimer la course <span className="font-medium">{orderToDelete.order_id}</span> ? 
                Cette action est irréversible.
              </p>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setOrderToDelete(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;