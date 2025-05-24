export const rolesOptions = [
  {
    value: 'all',
    label: 'Tous les rôles',
    color: 'bg-gray-100 text-gray-800'
  },
  {
    value: 'client',
    label: 'Client',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    value: 'moto-taxi',
    label: 'Moto-taxi',
    color: 'bg-purple-100 text-purple-800'
  },
  {
    value: 'trycycle',
    label: 'Trycycle',
    color: 'bg-green-100 text-green-800'
  }
];

export const regionsOptions = [
  {
    value: 'all',
    label: 'Tous les arrondissements'
  },
  {
    value: 'douala1',
    label: 'Douala I'
  },
  {
    value: 'douala2',
    label: 'Douala II'
  },
  {
    value: 'douala3',
    label: 'Douala III'
  },
  {
    value: 'douala4',
    label: 'Douala IV'
  },
  {
    value: 'douala5',
    label: 'Douala V'
  }
];

export const usersList = [
  {
    id: 1,
    name: "Jean Dupont",
    phone: "+237 6 12 34 56 78",
    role: "client",
    ville: "Douala I",
    reduction: "Premium (20%)",
    avatar: "/images/avatars/1.png",
    totalRides: 24,
    totalKm: 156,
    preferredVehicle: "moto-taxi",
    motoTaxiRides: 18,
    trycycleRides: 6
  },
  {
    id: 2,
    name: "Marie Martin",
    phone: "+237 6 23 45 67 89",
    role: "moto-taxi",
    ville: "Douala II",
    avatar: "/images/avatars/2.png",
    totalRides: 128,
    totalKm: 842,
    vehicleType: "moto-taxi"
  },
  {
    id: 3,
    name: "Pierre Durand",
    phone: "+237 6 34 56 78 90",
    role: "trycycle",
    ville: "Douala III",
    avatar: "/images/avatars/3.png",
    totalRides: 95,
    totalKm: 523,
    vehicleType: "trycycle"
  },
  {
    id: 4,
    name: "Sophie Lambert",
    phone: "+237 6 45 67 89 01",
    role: "client",
    ville: "Douala IV",
    reduction: "Standard (10%)",
    avatar: "/images/avatars/4.png",
    totalRides: 42,
    totalKm: 287,
    preferredVehicle: "trycycle",
    motoTaxiRides: 15,
    trycycleRides: 27
  },
  {
    id: 5,
    name: "Thomas Moreau",
    phone: "+237 6 56 78 90 12",
    role: "moto-taxi",
    ville: "Douala V",
    avatar: "/images/avatars/5.png",
    totalRides: 156,
    totalKm: 1024,
    vehicleType: "moto-taxi"
  },
  {
    id: 6,
    name: "Julie Lefevre",
    phone: "+237 6 67 89 01 23",
    role: "trycycle",
    ville: "Douala I",
    avatar: "/images/avatars/6.png",
    totalRides: 87,
    totalKm: 478,
    vehicleType: "trycycle"
  },
  {
    id: 7,
    name: "David Bernard",
    phone: "+237 6 78 90 12 34",
    role: "client",
    ville: "Douala II",
    reduction: "Occasionnel (5%)",
    avatar: "/images/avatars/7.png",
    totalRides: 12,
    totalKm: 78,
    preferredVehicle: "moto-taxi",
    motoTaxiRides: 9,
    trycycleRides: 3
  },
  {
    id: 8,
    name: "Emma Petit",
    phone: "+237 6 89 01 23 45",
    role: "moto-taxi",
    ville: "Douala III",
    avatar: "/images/avatars/8.png",
    totalRides: 203,
    totalKm: 1336,
    vehicleType: "moto-taxi"
  },
  {
    id: 9,
    name: "Lucas Roux",
    phone: "+237 6 90 12 34 56",
    role: "trycycle",
    ville: "Douala IV",
    avatar: "/images/avatars/9.png",
    totalRides: 112,
    totalKm: 615,
    vehicleType: "trycycle"
  },
  {
    id: 10,
    name: "Camille Fournier",
    phone: "+237 6 01 23 45 67",
    role: "client",
    ville: "Douala V",
    avatar: "/images/avatars/10.png",
    totalRides: 36,
    totalKm: 234,
    preferredVehicle: "trycycle",
    motoTaxiRides: 10,
    trycycleRides: 26
  }
];