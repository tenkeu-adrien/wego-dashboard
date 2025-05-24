import { useState, useMemo } from 'react';
import { usersList, rolesOptions, regionsOptions } from './data';
import { Phone,  MapPin, Search, User2, Eye, X } from 'lucide-react';
import { PiMotorcycle } from 'react-icons/pi';
import { RiBikeLine } from 'react-icons/ri';
import { AddUserModal } from 'components/AddUserModal';
import { Page } from 'components/shared/Page';

const UsersTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const usersPerPage = 5;

  const filteredUsers = useMemo(() => {
    return usersList.filter(user => {
      const roleMatch = roleFilter === 'all' || user.role === roleFilter;
      const regionMatch = regionFilter === 'all' || user.region === regionFilter;
      const searchMatch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.ville.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.reduction && user.reduction.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return roleMatch && regionMatch && searchMatch;
    });
  }, [searchTerm, roleFilter, regionFilter]);

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getRoleBadge = (role) => {
    const roleOption = rolesOptions.find(opt => opt.value === role);
    if (!roleOption) return null;
    const { color, label } = roleOption;
    
    return (
      <div className={`flex items-center px-2 py-1 rounded-full ${color}`}>
        {role === 'moto-taxi' ? (
          <PiMotorcycle className="w-4 h-4 mr-1" />
        ) : role === 'trycycle' ? (
          <RiBikeLine className="w-4 h-4 mr-1" />
        ) : (
          <User2 className="w-4 h-4 mr-1" />
        )}
        <span className="text-sm font-medium">{label}</span>
      </div>
    );
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  return (
    <Page title="Zego Dashboard">
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Gestion des Utilisateurs</h1>
      
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
            <label htmlFor="region-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Arrondissement
            </label>
            <select
              id="region-filter"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={regionFilter}
              onChange={(e) => {
                setRegionFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              {regionsOptions.map((option) => (
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
          <AddUserModal />
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Réduction
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Téléphone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Arrondissement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rôle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={user.avatar} alt={user.name} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.role === 'client' ? (user.reduction || 'Aucune') : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Phone className="w-4 h-4 mr-2 text-gray-500" />
                      {user.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                      {user.ville}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewUser(user)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Voir détails"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm text-gray-500">Aucun utilisateur trouvé</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {filteredUsers.length > usersPerPage && (
        <div className="mt-4 flex justify-center">
          <nav className="inline-flex rounded-md shadow">
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Précédent
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`px-3 py-1 border-t border-b border-gray-300 bg-white text-sm font-medium ${
                  currentPage === index + 1 
                    ? 'bg-indigo-100 text-indigo-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
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
            className="fixed inset-0 bg-white opacity-70 z-40 transition-opacity duration-300"
            onClick={closeModal}
          ></div>
          
          <div 
            className={`fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
              selectedUser ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h2 className="text-xl font-bold">Détails de l&apos;utilisateur</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="flex flex-col items-center mb-6">
                  <img 
                    className="h-24 w-24 rounded-full mb-4" 
                    src={selectedUser.avatar} 
                    alt={selectedUser.name} 
                  />
                  <h3 className="text-lg font-bold">{selectedUser.name}</h3>
                  <div className="mt-1">
                    {getRoleBadge(selectedUser.role)}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Téléphone</p>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        <Phone className="inline h-4 w-4 mr-2 text-gray-500" />
                        {selectedUser.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Arrondissement</p>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        <MapPin className="inline h-4 w-4 mr-2 text-gray-500" />
                        {selectedUser.ville}
                      </p>
                    </div>
                  </div>
                  
                  {selectedUser.role === 'client' && (
                    <div>
                      <p className="text-sm text-gray-500">Réduction</p>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {selectedUser.reduction || 'Aucune réduction'}
                      </p>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-medium text-gray-900 mb-2">Statistiques</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Courses effectuées</p>
                        <p className="mt-1 text-lg font-bold text-gray-900">
                          {selectedUser.totalRides || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Kilomètres totaux</p>
                        <p className="mt-1 text-lg font-bold text-gray-900">
                          {selectedUser.totalKm || 0} km
                        </p>
                      </div>
                    </div>
                    
                    {selectedUser.role !== 'client' && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-500">Type d&apos;engin</p>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {selectedUser.role === 'moto-taxi' ? (
                            <>
                              <PiMotorcycle className="inline h-4 w-4 mr-2 text-purple-600" />
                              Moto-taxi
                            </>
                          ) : (
                            <>
                              <RiBikeLine className="inline h-4 w-4 mr-2 text-green-600" />
                              Trycycle
                            </>
                          )}
                        </p>
                      </div>
                    )}
                    
                    {selectedUser.role === 'client' && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-500">Préférence d&apos;engin</p>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {selectedUser.preferredVehicle === 'moto-taxi' ? (
                            <>
                              <PiMotorcycle className="inline h-4 w-4 mr-2 text-purple-600" />
                              Moto-taxi ({selectedUser.motoTaxiRides || 0} courses)
                            </>
                          ) : selectedUser.preferredVehicle === 'trycycle' ? (
                            <>
                              <RiBikeLine className="inline h-4 w-4 mr-2 text-green-600" />
                              Trycycle ({selectedUser.trycycleRides || 0} courses)
                            </>
                          ) : (
                            'Aucune préférence'
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Modal Footer */}
              <div className="px-6 py-4 border-t flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
    </Page>
  );
};

export default UsersTable;