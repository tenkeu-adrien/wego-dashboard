import { useState, useEffect } from 'react';
import { FiEdit2, FiSave, FiDollarSign, FiClock, FiTrendingUp, FiFileText, FiPercent } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PricingDashboard() {
  // Types de véhicules avec options spécifiques
  const vehicleTypes = [
    { 
      id: 1, 
      name: 'Moto-taxi', 
      icon: '🏍️',
      availableForDelivery: true
    },
    { 
      id: 2, 
      name: 'Trycycle', 
      icon: '🛺',
      availableForDelivery: false
    }
  ];

  // Données de tarification initiale
  const initialPricing = {
    basePrice: 1500,
    pricePerKm: 500,
    peakHoursMultiplier: 1.5,
    deliveryFee: 2000,
    commissionRate: 10
  };

  const [pricing, setPricing] = useState({});
  const [editing, setEditing] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('course');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({}); // État pour suivre les sauvegardes par véhicule

  // Charger les données depuis l'API
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await fetch('https://wegoadmin-c5c82e2c5d80.herokuapp.com/api/v1/pricing');
        if (!response.ok) throw new Error('Erreur réseau');
        
        const data = await response.json();
        
        const initialData = vehicleTypes.reduce((acc, vehicle) => ({
          ...acc,
          [vehicle.id]: data[vehicle.id] || {
            ...initialPricing,
            selectedDuration: null
          }
        }), {});
        
        setPricing(initialData);
      } catch (error) {
        console.error("Erreur lors du chargement des tarifs:", error);
        toast.error('Erreur lors du chargement des tarifs', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();
  }, []);

  // Sauvegarder les modifications dans l'API
  const handleSave = async (vehicleId) => {
    setSaving(prev => ({ ...prev, [vehicleId]: true }));
    
    try {
      const vehiclePricing = pricing[vehicleId] || initialPricing;
      
      // Validation des données
      if (vehiclePricing.commissionRate < 0 || vehiclePricing.commissionRate > 100) {
        throw new Error('Le taux de commission doit être entre 0 et 100%');
      }

      const response = await fetch(`https://wegoadmin-c5c82e2c5d80.herokuapp.com/api/v1/pricing/${vehicleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehiclePricing)
      });

      if (!response.ok) throw new Error('Erreur lors de la sauvegarde');

      // Mettre à jour l'historique
      setHistory(prev => [{
        date: new Date().toLocaleString(),
        vehicle: vehicleTypes.find(v => v.id === vehicleId).name,
        changes: vehiclePricing
      }, ...prev.slice(0, 9)]); // Garder seulement les 10 dernières modifications

      setEditing(null);
      
      toast.success('Tarifs mis à jour avec succès', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast.error(error.message || 'Erreur lors de la sauvegarde', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setSaving(prev => ({ ...prev, [vehicleId]: false }));
    }
  };

  // Calcul des revenus et commissions
  const calculateEarnings = (vehicleId, km) => {
    const rates = pricing[vehicleId] || initialPricing;
    let total, commission;
    
    if (activeTab === 'livraison') {
      total = rates.deliveryFee;
    } else {
      total = rates.basePrice + (rates.pricePerKm * km);
    }
    
    commission = total * (rates.commissionRate / 100);
    const driverEarnings = total - commission;
    
    return {
      total: total.toLocaleString(),
      commission: commission.toLocaleString(),
      driverEarnings: driverEarnings.toLocaleString()
    };
  };

  // Gestion des changements de valeur
  const handleValueChange = (vehicleId, field, value) => {
    setPricing(prev => ({
      ...prev,
      [vehicleId]: {
        ...prev[vehicleId],
        [field]: value === "" ? "" : field === 'peakHoursMultiplier' ? 
          parseFloat(value) || 0 : parseInt(value) || 0
      }
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Chargement des tarifs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Gestion des Tarifs et Commissions</h1>
        <p className="text-gray-600">Configurez les prix et commissions par type de véhicule</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('course')}
          className={`px-4 py-2 font-medium flex items-center ${
            activeTab === 'course' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FiDollarSign className="mr-2" /> Courses
        </button>
        <button
          onClick={() => setActiveTab('livraison')}
          className={`px-4 py-2 font-medium flex items-center ${
            activeTab === 'livraison' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FiFileText className="mr-2" /> Livraisons
        </button>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {vehicleTypes
          .filter(vehicle => activeTab === 'course' || (activeTab === 'livraison' && vehicle.availableForDelivery))
          .map(vehicle => {
            const earnings = calculateEarnings(vehicle.id, 10);
            return (
              <div key={vehicle.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="bg-green-600 p-4 text-white flex items-center">
                  <span className="text-2xl mr-3">{vehicle.icon}</span>
                  <span className="font-semibold text-lg">{vehicle.name}</span>
                </div>

                <div className="p-5">
                  {editing === vehicle.id ? (
                    <div className="space-y-4">
                      {activeTab === 'course' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prix de base (1h)</label>
                            <input
                              type="number"
                              min="0"
                              value={pricing[vehicle.id]?.basePrice ?? initialPricing.basePrice}
                              onChange={(e) => handleValueChange(vehicle.id, 'basePrice', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prix par km</label>
                            <input
                              type="number"
                              min="0"
                              value={pricing[vehicle.id]?.pricePerKm ?? initialPricing.pricePerKm}
                              onChange={(e) => handleValueChange(vehicle.id, 'pricePerKm', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                          </div>
                        </>
                      )}

                      {activeTab === 'livraison' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Frais de livraison</label>
                          <input
                            type="number"
                            min="0"
                            value={pricing[vehicle.id]?.deliveryFee ?? initialPricing.deliveryFee}
                            onChange={(e) => handleValueChange(vehicle.id, 'deliveryFee', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Commission (%)</label>
                        <div className="relative rounded-md shadow-sm">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={pricing[vehicle.id]?.commissionRate ?? initialPricing.commissionRate}
                            onChange={(e) => handleValueChange(vehicle.id, 'commissionRate', e.target.value)}
                            className="block w-full pr-12 pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <FiPercent className="text-gray-500" />
                          </div>
                        </div>
                      </div>

                      {activeTab === 'course' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Majoration heures de pointe</label>
                          <select
                            value={pricing[vehicle.id]?.peakHoursMultiplier ?? initialPricing.peakHoursMultiplier}
                            onChange={(e) => handleValueChange(vehicle.id, 'peakHoursMultiplier', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          >
                            <option value="1.0">Aucune (x1.0)</option>
                            <option value="1.2">Standard (x1.2)</option>
                            <option value="1.5">Élevée (x1.5)</option>
                          </select>
                        </div>
                      )}

                      <div className="flex space-x-3 pt-2">
                        <button
                          onClick={() => setEditing(null)}
                          className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition flex items-center justify-center"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={() => handleSave(vehicle.id)}
                          disabled={saving[vehicle.id]}
                          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition flex items-center justify-center"
                        >
                          {saving[vehicle.id] ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Enregistrement...
                            </>
                          ) : (
                            <>
                              <FiSave className="mr-2" />
                              Enregistrer
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-3">
                        {activeTab === 'course' ? (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Prix de base (1h):</span>
                              <span className="font-medium">{(pricing[vehicle.id]?.basePrice ?? initialPricing.basePrice).toLocaleString()} FCFA</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Prix par km:</span>
                              <span className="font-medium">{(pricing[vehicle.id]?.pricePerKm ?? initialPricing.pricePerKm).toLocaleString()} FCFA</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Heures de pointe:</span>
                              <span className="font-medium">x{pricing[vehicle.id]?.peakHoursMultiplier ?? initialPricing.peakHoursMultiplier}</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Frais livraison:</span>
                            <span className="font-medium">{(pricing[vehicle.id]?.deliveryFee ?? initialPricing.deliveryFee).toLocaleString()} FCFA</span>
                          </div>
                        )}

                        <div className="flex justify-between">
                          <span className="text-gray-600">Commission:</span>
                          <span className="font-medium">{pricing[vehicle.id]?.commissionRate ?? initialPricing.commissionRate}%</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setEditing(vehicle.id)}
                        className="w-full mt-4 border border-green-600 text-green-600 py-2 rounded-md flex items-center justify-center hover:bg-green-50 transition"
                      >
                        <FiEdit2 className="mr-2" /> Modifier les tarifs
                      </button>

                      {/* Simulateur */}
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                          <FiTrendingUp className="mr-2" />
                          {activeTab === 'livraison' ? "Simulation de livraison" : "Simulation pour 10km"}
                        </h3>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-gray-600">Total:</div>
                            <div className="font-medium text-right">{earnings.total} FCFA</div>
                            
                            <div className="text-gray-600">Commission:</div>
                            <div className="font-medium text-right">{earnings.commission} FCFA</div>
                            
                            <div className="text-gray-600">Gains conducteur:</div>
                            <div className="font-medium text-right text-green-600">{earnings.driverEarnings} FCFA</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* Historique */}
      <div className="mt-12 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FiClock className="mr-2" /> Historique des modifications
          </h2>
          
          {history.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Véhicule</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Détails</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {history.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.vehicle}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {activeTab === 'course' ? (
                          <>
                            <div>Base: {item.changes.basePrice} FCFA</div>
                            <div>Prix/km: {item.changes.pricePerKm} FCFA</div>
                            <div>Commission: {item.changes.commissionRate}%</div>
                          </>
                        ) : (
                          <div>Livraison: {item.changes.deliveryFee} FCFA</div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 italic">Aucune modification enregistrée</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}