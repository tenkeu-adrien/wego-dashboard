// components/TopStatsSection.jsx
import { useEffect, useState } from 'react';
import {
  Activity,
  CheckCircle,
  XCircle,
  Gift,
  ChevronDown,
  PiMotorcycle,
  RiBikeLine
} from 'lucide-react';
import axios from 'axios';
import { JWT_HOST_API } from 'configs/auth.config';

const TopStatsSection = () => {
  const [drivers, setDrivers] = useState([]);
  const [clients, setClients] = useState([]);
  const [rideStats, setRideStats] = useState({ completed: 0, cancelled: 0 });
  const [setSelectedClientId] = useState(null);
  const [filter, setFilter] = useState('month');
  const [showPromoModal, setShowPromoModal] = useState(false);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get(`${JWT_HOST_API}/drivers/top`, {
          params: { filter }
        });
        console.log('Top drivers data:', response.data);
        setDrivers(response.data);
      } catch (err) {
        console.error('Error fetching top drivers:', err.response?.data || err.message);
      }
    };

    fetchDrivers();
  }, [filter]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(`${JWT_HOST_API}/clients/top`, {
          params: { filter }
        });
        console.log('Top clients data:', response.data);
        setClients(response.data);
      } catch (err) {
        console.error('Error fetching top clients:', err.response?.data || err.message);
      }
    };

    fetchClients();
  }, [filter]);

  useEffect(() => {
    const fetchRideStats = async () => {
      try {
        const response = await axios.get(`${JWT_HOST_API}/rides/stats`);
        console.log('Ride stats data:', response.data);
        setRideStats(response.data);
      } catch (err) {
        console.error('Error fetching ride stats:', err.response?.data || err.message);
      }
    };

    fetchRideStats();
  }, []);

  const openPromoModal = (clientId) => {
    setSelectedClientId(clientId);
    setShowPromoModal(true);
  };

  return (
    <div className="flex flex-wrap gap-6 mb-6 mt-[50px] justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Top Chauffeurs */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Top Chauffeurs</h3>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              {filter === 'month' ? 'Ce mois-ci' : filter === 'year' ? 'Cette année' : 'Tous'}
            </span>
          </div>
          <div className="space-y-4">
            {drivers.map((driver, index) => (
              <div key={driver.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img src={driver.avatar} alt={driver.name} className="w-10 h-10 rounded-full object-cover" />
                    {index < 3 && (
                      <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-700'}`}>
                        {index + 1}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{driver.name}</p>
                    <p className="text-xs text-gray-500 flex items-center">
                      {driver.vehicle === 'moto-taxi' ? <PiMotorcycle className="mr-1 text-purple-600" /> : <RiBikeLine className="mr-1 text-green-600" />}
                      {driver.rides} courses
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{driver.km} km</p>
                  <p className="text-xs text-gray-500">{driver.rating}/5</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clients Fidèles */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Clients Fidèles</h3>
            <div className="relative">
              <select
                className="appearance-none bg-gray-100 text-gray-700 text-xs px-3 py-1 pr-6 rounded-full focus:outline-none"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="month">Ce mois-ci</option>
                <option value="year">Cette année</option>
                <option value="all">Tout le temps</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-500" />
            </div>
          </div>
          <div className="space-y-4">
            {clients.map((client) => (
              <div key={client.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <img src={client.avatar} alt={client.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-xs text-gray-500">{client.rides} courses | {client.km} km</p>
                  </div>
                </div>
                <button
                  onClick={() => openPromoModal(client.id)}
                  className="text-xs bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-3 py-1 rounded-full transition-colors"
                  title="Envoyer une réduction"
                >
                  <Gift className="inline mr-1 h-3 w-3" />
                  Récompenser
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Statistiques des courses */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-6">Statistiques des Courses</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">Statut des courses</span>
              <Activity className="h-4 w-4 text-gray-400" />
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="flex items-center">
                    <CheckCircle className="mr-1 text-green-600" />
                    Complétées
                  </span>
                  <span className="font-medium">{rideStats.completed}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${(rideStats.completed / (rideStats.completed + rideStats.cancelled)) * 100 || 0}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="flex items-center">
                    <XCircle className="mr-1 text-red-600" />
                    Annulées
                  </span>
                  <span className="font-medium">{rideStats.cancelled}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full" 
                    style={{ width: `${(rideStats.cancelled / (rideStats.completed + rideStats.cancelled)) * 100 || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showPromoModal && (
        <h1>ok le test est bon</h1>
      )}
    </div>
  );
};

export default TopStatsSection;