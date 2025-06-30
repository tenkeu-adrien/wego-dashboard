import { Clock, Check, Truck, X, Smartphone, WifiPen ,especes  } from "lucide-react";

export const orderStatusOptions = [
  {
    value: 'en_cours',
    label: 'En cours',
    color: 'bg-blue-100 text-blue-800',
    icon: Truck
  },
  {
    value: 'en_attente',
    label: 'En attente',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock
  },
  {
    value: 'termine',
    label: 'Terminé',
    color: 'bg-green-100 text-green-800',
    icon: Check
  },
  {
    value: 'annule',
    label: 'Annulé',
    color: 'bg-red-100 text-red-800',
    icon: X
  }
];

export const paymentMethodOptions = [
  {
    value: 'cash',
    label: 'Espèces',
    color: 'bg-green-100 text-green-800',
    icon: especes
  },
  {
    value: 'orange_money',
    label: 'Orange Money',
    color: 'bg-orange-100 text-orange-800',
    icon: Smartphone
  },
  {
    value: 'mobile_money',
    label: 'Mobile Money',
    color: 'bg-blue-100 text-blue-800',
    icon: WifiPen
  }
];

export const vehicleOptions = [
  {
    value: 'moto-taxi',
    label: 'Moto-taxi'
  },
  {
    value: 'trycycle',
    label: 'Trycycle'
  }
];

export const deliveryOptions = [
  {
    value: 'normal',
    label: 'Course normale'
  },
  {
    value: 'delivery',
    label: 'Livraison'
  }
];

export const ordersList = [
  {
    order_id: "CMD001",
    client: "Jean Dupont",
    chauffeur: "Pierre Martin",
    vehicule: "moto-taxi",
    pickup_address: "Bonamoussadi, Douala",
    destination_address: "Akwa, Douala",
    status: "en_cours",
    payment_method: "cash",
    is_delivery: false,
    distance: "7.5 km",
    duration: "20 min",
    amount: "1 500 FCFA",
    date: "24/05/2023 08:30"
  },
  {
    order_id: "CMD002",
    client: "Marie Laurent",
    chauffeur: "Sophie Dubois",
    vehicule: "trycycle",
    pickup_address: "Deïdo, Douala",
    destination_address: "Bonabéri, Douala",
    status: "termine",
    payment_method: "orange_money",
    is_delivery: true,
    recipient_phone: "677889900",
    distance: "12.3 km",
    duration: "35 min",
    amount: "2 800 FCFA",
    date: "23/05/2023 14:15"
  },
  {
    order_id: "CMD003",
    client: "Thomas Bernard",
    chauffeur: "Lucas Petit",
    vehicule: "moto-taxi",
    pickup_address: "New Bell, Douala",
    destination_address: "Bali, Douala",
    status: "en_attente",
    payment_method: "mobile_money",
    is_delivery: false,
    distance: "5.8 km",
    duration: "15 min",
    amount: "1 200 FCFA",
    date: "24/05/2023 10:45"
  },
  {
    order_id: "CMD004",
    client: "Emma Moreau",
    chauffeur: "Julie Blanc",
    vehicule: "trycycle",
    pickup_address: "Makepe, Douala",
    destination_address: "Bonapriso, Douala",
    status: "en_cours",
    payment_method: "cash",
    is_delivery: true,
    recipient_phone: "655443322",
    distance: "8.2 km",
    duration: "25 min",
    amount: "2 000 FCFA",
    date: "24/05/2023 09:30"
  },
  {
    order_id: "CMD005",
    client: "Paul Lefevre",
    chauffeur: "Marc Durand",
    vehicule: "moto-taxi",
    pickup_address: "Logbessou, Douala",
    destination_address: "Kotto, Douala",
    status: "termine",
    payment_method: "cash",
    is_delivery: false,
    distance: "9.7 km",
    duration: "30 min",
    amount: "2 300 FCFA",
    date: "22/05/2023 16:20"
  },
  {
    order_id: "CMD006",
    client: "Julie Martin",
    chauffeur: "Antoine Leroy",
    vehicule: "trycycle",
    pickup_address: "Bépanda, Douala",
    destination_address: "Yassa, Douala",
    status: "en_attente",
    payment_method: "orange_money",
    is_delivery: true,
    recipient_phone: "699887766",
    distance: "6.5 km",
    duration: "18 min",
    amount: "1 800 FCFA",
    date: "24/05/2023 11:15"
  },
  {
    order_id: "CMD007",
    client: "Pierre Dubois",
    chauffeur: "Camille Moreau",
    vehicule: "moto-taxi",
    pickup_address: "Ndogbong, Douala",
    destination_address: "Bonanjo, Douala",
    status: "en_cours",
    payment_method: "cash",
    is_delivery: false,
    distance: "4.3 km",
    duration: "12 min",
    amount: "1 000 FCFA",
    date: "24/05/2023 13:45"
  },
  {
    order_id: "CMD008",
    client: "Sophie Bernard",
    chauffeur: "Nicolas Petit",
    vehicule: "trycycle",
    pickup_address: "Logpom, Douala",
    destination_address: "Ndogpassi, Douala",
    status: "termine",
    payment_method: "cash",
    is_delivery: false,
    distance: "7.8 km",
    duration: "22 min",
    amount: "1 700 FCFA",
    date: "21/05/2023 17:30"
  },
  {
    order_id: "CMD009",
    client: "Lucas Moreau",
    chauffeur: "Emma Durand",
    vehicule: "moto-taxi",
    pickup_address: "Denver, Douala",
    destination_address: "Bonamoussadi, Douala",
    status: "en_attente",
    payment_method: "mobile_money",
    is_delivery: true,
    recipient_phone: "655332211",
    distance: "5.1 km",
    duration: "14 min",
    amount: "1 300 FCFA",
    date: "24/05/2023 12:00"
  },
  {
    order_id: "CMD010",
    client: "Marie Petit",
    chauffeur: "Thomas Leroy",
    vehicule: "trycycle",
    pickup_address: "Akwa, Douala",
    destination_address: "Deïdo, Douala",
    status: "en_cours",
    payment_method: "cash",
    is_delivery: false,
    distance: "3.7 km",
    duration: "10 min",
    amount: "900 FCFA",
    date: "24/05/2023 14:30"
  }
];