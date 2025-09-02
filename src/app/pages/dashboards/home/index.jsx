// Local Imports
import AdminDashboard from "components/AdminDashboard";
import { Page } from "components/shared/Page";
// import ApexBarChart from "components/ui/ApexBarChart";
import MiniMap from "components/ui/MiniMap";
import DriverPerformanceChart from "components/ui/MonthlySalesChart";
// import MonthlySalesChart from "components/ui/MonthlySalesChart";
import { useEffect} from "react";
import { io } from 'socket.io-client'
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
export const socket = io('https://wegoadmin-c5c82e2c5d80.herokuapp.com', {
  transports: ['websocket'],
  // Ajoutez d'autres options si besoin (auth, etc)
})
// https://wegoadmin-c5c82e2c5d80.herokuapp.com
socket.on('connect', () => {
  console.log('Connecté au serveur socket !', socket.id)
  // Test ping-pong
  socket.emit('test:ping', { hello: 'worl' })
})

socket.on('test:pong', (data) => {
  console.log('Réponse du serveur:', data)
})

export default function Sales() {
 
  
  // const vehicleStats = {
  //   motoTaxis: 65,
  //   trycycles: 35
  // };
  

// https://wegoadmin-c5c82e2c5d80.herokuapp.com/api/v1
 


  
  // const dailyStats = {
  //   rides: 156,
  //   km: 1024

  // };

  
    useEffect(() => {
      // 🚀 Tu pourras activer cette partie pour charger les top chauffeurs depuis ton API AdonisJS :
      /*
      fetch("https://ton-api.com/api/drivers/top")
        .then((res) => res.json())
        .then((data) => setDrivers(data))
        .catch((err) => console.error("Erreur chargement chauffeurs :", err))
      */
    }, [])
  
    useEffect(() => {
      // 🚀 Tu pourras activer cette partie pour charger les meilleurs clients :
      /*
      fetch("https://ton-api.com/api/clients/top")
        .then((res) => res.json())
        .then((data) => setClients(data))
        .catch((err) => console.error("Erreur chargement clients :", err))
      */
    }, [])
  
    useEffect(() => {
      // 🚀 Tu pourras activer cette partie pour charger les statistiques des courses :
      /*
      fetch("https://ton-api.com/api/rides/stats")
        .then((res) => res.json())
        .then((data) => setRideStats(data))
        .catch((err) => console.error("Erreur chargement stats :", err))
      */
    }, [])
  return (
    <Page title="Wego Dashboard">
     
      <AdminDashboard />

<div className="transition-content overflow-hidden px-[--margin-x] pb-8">
  

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


</div>

    </Page>
  );
}
