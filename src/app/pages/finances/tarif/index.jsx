import { useState } from 'react';
import { FiEdit2, FiSave, FiDollarSign, FiClock, FiTrendingUp, FiFileText } from 'react-icons/fi';

export default function PricingDashboard() {
  // Types de véhicules avec options spécifiques
  const vehicleTypes = [
    { 
      id: 1, 
      name: 'Moto-taxi', 
      icon: '🏍️',
      hasDurationOptions: false
    },
    { 
      id: 2, 
      name: 'Trycycle', 
      icon: '🛺',
      hasDurationOptions: true,
      durationOptions: [
        { id: '1h', name: '1 heure', multiplier: 1 },
        { id: '2h', name: '2 heures', multiplier: 1.8 },
        { id: '4h', name: '4 heures', multiplier: 3.2 },
        { id: 'demi-journee', name: 'Demi-journée (6h)', multiplier: 4.5 },
        { id: 'journee', name: 'Journée complète', multiplier: 7 }
      ]
    }
  ];

  // Données de tarification initiale
  const initialPricing = {
    basePrice: 1500,
    pricePerKm: 500,
    peakHoursMultiplier: 1.5,
    deliveryFee: 2000,
    durationPrice: 0
  };

  const [pricing, setPricing] = useState(
    vehicleTypes.reduce((acc, vehicle) => ({ 
      ...acc, 
      [vehicle.id]: {
        ...initialPricing,
        selectedDuration: vehicle.hasDurationOptions ? vehicle.durationOptions[0].id : null
      }
    }), {})
  );

  const [editing, setEditing] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('course');

  // Sauvegarder les modifications
  const handleSave = (vehicleId) => {
    setHistory([...history, {
      date: new Date().toLocaleString(),
      vehicle: vehicleTypes.find(v => v.id === vehicleId).name,
      changes: pricing[vehicleId]
    }]);
    setEditing(null);
  };

  // Calcul des revenus
  const calculateEarnings = (vehicleId, km) => {
    const vehicle = vehicleTypes.find(v => v.id === vehicleId);
    const rates = pricing[vehicleId];
    
    if (vehicle.hasDurationOptions && activeTab === 'course') {
      const durationOption = vehicle.durationOptions.find(d => d.id === rates.selectedDuration);
      return (durationOption.multiplier * rates.basePrice).toLocaleString();
    }
    
    return (rates.basePrice + (rates.pricePerKm * km)).toLocaleString();
  };

  // Calcul du prix de la durée
  // const calculateDurationPrice = (vehicleId) => {
  //   const vehicle = vehicleTypes.find(v => v.id === vehicleId);
  //   if (!vehicle.hasDurationOptions) return null;
    
  //   const durationOption = vehicle.durationOptions.find(d => d.id === pricing[vehicleId].selectedDuration);
  //   return (durationOption.multiplier * pricing[vehicleId].basePrice).toLocaleString();
  // };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black-700">Gestion des Tarifs</h1>
        <p className="text-gray-600">Configurez les prix par type de véhicule et service</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('course')}
          className={`px-4 py-2 font-medium ${activeTab === 'course' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
        >
          <FiDollarSign className="inline mr-2" /> Courses
        </button>
        <button
          onClick={() => setActiveTab('livraison')}
          className={`px-4 py-2 font-medium ${activeTab === 'livraison' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
        >
          <FiFileText className="inline mr-2" /> Livraisons
        </button>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {vehicleTypes.map(vehicle => (
          <div key={vehicle.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-green-100">
            <div className="bg-green-600 p-4 text-white">
              <span className="text-2xl mr-2">{vehicle.icon}</span>
              <span className="font-semibold">{vehicle.name}</span>
            </div>

            <div className="p-4">
              {editing === vehicle.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Prix de base (1h)</label>
                    <input
                      type="number"
                      value={pricing[vehicle.id].basePrice}
                      onChange={(e) => setPricing({
                        ...pricing,
                        [vehicle.id]: {
                          ...pricing[vehicle.id],
                          basePrice: parseInt(e.target.value) || 0
                        }
                      })}
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Prix par km</label>
                    <input
                      type="number"
                      value={pricing[vehicle.id].pricePerKm}
                      onChange={(e) => setPricing({
                        ...pricing,
                        [vehicle.id]: {
                          ...pricing[vehicle.id],
                          pricePerKm: parseInt(e.target.value) || 0
                        }
                      })}
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  {vehicle.hasDurationOptions && activeTab === 'course' && (
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Options de durée</label>
                      <div className="grid grid-cols-2 gap-2">
                        {vehicle.durationOptions.map(option => (
                          <div 
                            key={option.id}
                            onClick={() => setPricing({
                              ...pricing,
                              [vehicle.id]: {
                                ...pricing[vehicle.id],
                                selectedDuration: option.id
                              }
                            })}
                            className={`p-2 border rounded-md cursor-pointer text-center ${
                              pricing[vehicle.id].selectedDuration === option.id 
                                ? 'bg-green-100 border-green-500' 
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="font-medium">{option.name}</div>
                            <div className="text-xs text-gray-500">
                              {Math.round(option.multiplier * pricing[vehicle.id].basePrice)} FCFA
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'course' && !vehicle.hasDurationOptions && (
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Majoration heures de pointe</label>
                      <select
                        value={pricing[vehicle.id].peakHoursMultiplier}
                        onChange={(e) => setPricing({
                          ...pricing,
                          [vehicle.id]: {
                            ...pricing[vehicle.id],
                            peakHoursMultiplier: parseFloat(e.target.value)
                          }
                        })}
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
                      >
                        <option value="1.0">Aucune (x1.0)</option>
                        <option value="1.2">Standard (x1.2)</option>
                        <option value="1.5">Élevée (x1.5)</option>
                      </select>
                    </div>
                  )}

                  {activeTab === 'livraison' && (
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Frais de livraison</label>
                      <input
                        type="number"
                        value={pricing[vehicle.id].deliveryFee}
                        onChange={(e) => setPricing({
                          ...pricing,
                          [vehicle.id]: {
                            ...pricing[vehicle.id],
                            deliveryFee: parseInt(e.target.value) || 0
                          }
                        })}
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  )}

                  <button
                    onClick={() => handleSave(vehicle.id)}
                    className="w-full bg-green-600 text-white py-2 rounded-md flex items-center justify-center hover:bg-green-700 transition"
                  >
                    <FiSave className="mr-2" /> Enregistrer
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prix de base (1h):</span>
                    <span className="font-medium">{pricing[vehicle.id].basePrice.toLocaleString()} FCFA</span>
                  </div>

                  {vehicle.hasDurationOptions && activeTab === 'course' && (
                    <>
                      <div className="pt-2 border-t">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Tarifs durée:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {vehicle.durationOptions.map(option => (
                            <div 
                              key={option.id} 
                              className={`p-2 rounded text-center text-xs ${
                                pricing[vehicle.id].selectedDuration === option.id
                                  ? 'bg-green-100 text-green-800 font-bold'
                                  : 'bg-gray-100'
                              }`}
                            >
                              <div>{option.name}</div>
                              <div>{Math.round(option.multiplier * pricing[vehicle.id].basePrice)} FCFA</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between pt-2">
                        <span className="text-gray-600">Durée sélectionnée:</span>
                        <span className="font-medium">
                          {vehicle.durationOptions.find(d => d.id === pricing[vehicle.id].selectedDuration).name}
                        </span>
                      </div>
                    </>
                  )}

                  {!vehicle.hasDurationOptions && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prix/km:</span>
                      <span className="font-medium">{pricing[vehicle.id].pricePerKm.toLocaleString()} FCFA</span>
                    </div>
                  )}

                  {activeTab === 'course' && !vehicle.hasDurationOptions && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Heures de pointe:</span>
                      <span className="font-medium">x{pricing[vehicle.id].peakHoursMultiplier}</span>
                    </div>
                  )}

                  {activeTab === 'livraison' && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Frais livraison:</span>
                      <span className="font-medium">{pricing[vehicle.id].deliveryFee.toLocaleString()} FCFA</span>
                    </div>
                  )}

                  <button
                    onClick={() => setEditing(vehicle.id)}
                    className="w-full mt-4 border border-green-600 text-green-600 py-2 rounded-md flex items-center justify-center hover:bg-green-50 transition"
                  >
                    <FiEdit2 className="mr-2" /> Modifier
                  </button>

                  {/* Simulateur */}
                  <div className="mt-4 pt-4 border-t">
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <FiTrendingUp className="mr-1" /> 
                      {vehicle.hasDurationOptions && activeTab === 'course' 
                        ? "Tarif durée sélectionnée" 
                        : "Simulateur pour 10km"}
                    </h3>
                    <div className="bg-green-50 p-2 rounded text-center">
                      <span className="text-green-800 font-bold">
                        {calculateEarnings(vehicle.id, 10)} FCFA
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Historique */}
      <div className="mt-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-green-700 mb-4 flex items-center">
          <FiClock className="mr-2" /> Historique des modifications
        </h2>
        {history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Véhicule</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nouveaux tarifs</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.vehicle}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Base: {item.changes.basePrice} FCFA, /km: {item.changes.pricePerKm} FCFA
                      {item.changes.selectedDuration && `, Durée: ${vehicleTypes.find(v => v.name === item.vehicle)?.durationOptions?.find(d => d.id === item.changes.selectedDuration)?.name || ''}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 italic">Aucune modification enregistrée</p>
        )}
      </div>
    </div>
  );
}