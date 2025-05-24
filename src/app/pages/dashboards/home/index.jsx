// Local Imports
import AdminDashboard from "components/AdminDashboard";
import { Page } from "components/shared/Page";
// import ApexBarChart from "components/ui/ApexBarChart";
import MiniMap from "components/ui/MiniMap";
import DriverPerformanceChart from "components/ui/MonthlySalesChart";
// import MonthlySalesChart from "components/ui/MonthlySalesChart";
import { Activity, CheckCircle, ChevronDown, Gift, XCircle} from "lucide-react";
import { PiMotorcycle } from "react-icons/pi";
import { RiBikeLine } from "react-icons/ri";
// import { Progress } from "components/ui/Progress";
// import { Statistics } from "../Statistics";
// import { ProductsTable } from "../ProductsTable";
// import { TopSellers } from "../TopSellers";
// import { CurrentBalance } from "../CurrentBalance";
// import { TeamActivity } from "../TeamActivity";
// import { Transactions } from "../Transactions";
// import { CountrySource } from "../CountrySource";
// import { SocialSource } from "../SocialSource";

// ----------------------------------------------------------------------

export default function Sales() {
  const drivers = [
    {
      id: 1,
      name: "Jean Mbarga",
      avatar: "/avatars/driver1.jpg",
      rides: 128,
      km: 842,
      rating: 4.8,
      vehicle: "moto-taxi"
    },
    {
      id: 2,
      name: "Marie Ndiaye",
      avatar: "/avatars/driver2.jpg",
      rides: 112,
      km: 756,
      rating: 4.9,
      vehicle: "trycycle"
    },
    {
      id: 3,
      name: "Paul Essomba",
      avatar: "/avatars/driver3.jpg",
      rides: 98,
      km: 645,
      rating: 4.7,
      vehicle: "moto-taxi"
    }
  ];
  
  const clients = [
    {
      id: 1,
      name: "Sarah Diallo",
      avatar: "/avatars/client1.jpg",
      rides: 42,
      km: 287,
      lastRide: "Aujourd'hui"
    },
    {
      id: 2,
      name: "Thomas Owona",
      avatar: "/avatars/client2.jpg",
      rides: 36,
      km: 234,
      lastRide: "Hier"
    },
    {
      id: 3,
      name: "Aïcha Bello",
      avatar: "/avatars/client3.jpg",
      rides: 28,
      km: 189,
      lastRide: "Il y a 3 jours"
    }
  ];
  
  // const vehicleStats = {
  //   motoTaxis: 65,
  //   trycycles: 35
  // };
  
  const rideStats = {
    completed: 92,
    cancelled: 8
  };
  
  // const dailyStats = {
  //   rides: 156,
  //   km: 1024
  // };


  const handleSendPromo = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      // Ici vous intégrerez votre système de notification
      console.log(`Envoi d'une promotion à ${client.name}`);
      alert(`Une promotion a été envoyée à ${client.name} pour le remercier de ses ${client.rides} courses !`);
    }
  };
  return (
    <Page title="Zego Dashboard">
      {/* <div className="transition-content overflow-hidden px-[--margin-x] pb-8">
        <Statistics />
        <div className="mt-4 grid grid-cols-12 gap-4 sm:mt-5 sm:gap-5 lg:mt-6 lg:gap-6">
          <ProductsTable />
          <div className="col-span-12 space-y-4 sm:col-span-6 sm:space-y-5 lg:col-span-4 lg:space-y-6 xl:col-span-3">
            <CurrentBalance />
            <TopSellers />
          </div>
          <TeamActivity />
          <div className="col-span-12 space-y-4 sm:col-span-6 sm:space-y-5 lg:col-span-4 lg:space-y-6">
            <SocialSource />
            <CountrySource />
          </div>
          <Transactions />
        </div>
      </div> */}
      <AdminDashboard />

<div className="transition-content overflow-hidden px-[--margin-x] pb-8">
  {/* Section 0 - Filtres */}
  {/* <div className="flex flex-wrap gap-4 mb-6 justify-between mt-4 items-center">
    <div className="flex flex-wrap gap-2">
      <select className="px-4 py-2 border rounded">
        <option>Secteur</option>
      </select>
      <select className="px-4 py-2 border rounded">
        <option>Forfait</option>
      </select>
      <select className="px-4 py-2 border rounded">
        <option>Année</option>
      </select>
    </div>
  </div> */}

  {/* Section 1 - Carte et Graphique */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
    <div className="bg-white p-4 rounded-lg shadow h-[400px]">
      <h3 className="text-lg font-semibold mb-4">Les Courses par région</h3>
      {/* Composant Carte */}
      <MiniMap />
    </div>
    <div className="bg-white p-4 rounded-lg shadow h-[400px]">
      {/* Composant Graphique mensuel */}
      <DriverPerformanceChart />
    </div>
  </div>

  {/* Section 2 - Secteurs et Forfaits */}
  <div className="flex flex-wrap gap-6 mb-6 mt-[50px] justify-center">
    {/* Ventes par secteur */}
    

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Top Chauffeurs */}
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xl font-semibold">Top Chauffeurs</h3>
      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
        Ce mois-ci
      </span>
    </div>
    
    <div className="space-y-4">
      {drivers.map((driver, index) => (
        <div key={driver.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src={driver.avatar} 
                alt={driver.name} 
                className="w-10 h-10 rounded-full object-cover"
              />
              {index < 3 && (
                <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                  index === 0 ? 'bg-yellow-500' : 
                  index === 1 ? 'bg-gray-400' : 'bg-amber-700'
                }`}>
                  {index + 1}
                </div>
              )}
            </div>
            <div>
              <p className="font-medium">{driver.name}</p>
              <p className="text-xs text-gray-500 flex items-center">
                {driver.vehicle === 'moto-taxi' ? (
                  <PiMotorcycle className="mr-1 text-purple-600" />
                ) : (
                  <RiBikeLine className="mr-1 text-green-600" />
                )}
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

  {/* Principaux Clients */}
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xl font-semibold">Clients Fidèles</h3>
      <div className="relative">
        <select 
          className="appearance-none bg-gray-100 text-gray-700 text-xs px-3 py-1 pr-6 rounded-full focus:outline-none"
          // onChange={(e) => setClientFilter(e.target.value)}
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
            <img 
              src={client.avatar} 
              alt={client.name} 
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-medium">{client.name}</p>
              <p className="text-xs text-gray-500">
                {client.rides} courses | {client.km} km
              </p>
            </div>
          </div>
          <button 
            onClick={() => handleSendPromo(client.id)}
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

  {/* Répartition des Courses */}
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <h3 className="text-xl font-semibold mb-6">Statistiques des Courses</h3>
    
    {/* <div className="grid grid-cols-2 gap-6"> */}
      {/* <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-500">Type d&apos;engin</span>
          <PieChart className="h-4 w-4 text-gray-400" />
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="flex items-center">
                <PiMotorcycle className="mr-1 text-purple-600" />
                Moto-taxis
              </span>
              <span className="font-medium">{vehicleStats.motoTaxis}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full" 
                style={{ width: `${vehicleStats.motoTaxis}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="flex items-center">
                <RiBikeLine className="mr-1 text-green-600" />
                Trycycles
              </span>
              <span className="font-medium">{vehicleStats.trycycles}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${vehicleStats.trycycles}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div> */}

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
              <span className="font-medium">{rideStats.completed}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${rideStats.completed}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="flex items-center">
                <XCircle className="mr-1 text-red-600" />
                Annulées
              </span>
              <span className="font-medium">{rideStats.cancelled}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-600 h-2 rounded-full" 
                style={{ width: `${rideStats.cancelled}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    {/* </div> */}

    {/* <div className="mt-6 grid grid-cols-2 gap-4">
      <div className="bg-indigo-50 p-3 rounded-lg">
        <p className="text-sm text-indigo-600 mb-1">Courses aujourd&apos;hui</p>
        <p className="text-2xl font-bold">{dailyStats.rides}</p>
      </div>
      <div className="bg-green-50 p-3 rounded-lg">
        <p className="text-sm text-green-600 mb-1">Km parcourus</p>
        <p className="text-2xl font-bold">{dailyStats.km}</p>
      </div>
    </div> */}
  </div>
</div>
  </div>
</div>

    </Page>
  );
}
