import { DollarSign, CreditCard, PieChart, TrendingUp,   CheckCircle, Smartphone } from 'lucide-react';

export const financialStats = [
  {
    title: "Revenu total",
    value: "4,850,000 FCFA",
    change: "+12%",
    trend: "up",
    icon: DollarSign
  },
  {
    title: "Courses",
    value: "1,248",
    change: "+8%",
    trend: "up",
    icon: TrendingUp
  },
  {
    title: "Commission",
    value: "1,210,000 FCFA",
    change: "+15%",
    trend: "up",
    icon: PieChart
  },
  {
    title: "Paiements chauffeurs",
    value: "3,640,000 FCFA",
    change: "+10%",
    trend: "up",
    icon: CreditCard
  }
];

export const recentTransactions = [
  {
    id: "TRX001",
    date: "24/05/2023 08:30",
    chauffeur: "Jean Mbarga",
    client: "Sarah Diallo",
    amount: "1,500 FCFA",
    commission: "375 FCFA",
    method: "mobile_money",
    status: "Complété",
    icon: CheckCircle
  },
  {
    id: "TRX002",
    date: "24/05/2023 09:15",
    chauffeur: "Marie Ndiaye",
    client: "Thomas Owona",
    amount: "2,000 FCFA",
    commission: "500 FCFA",
    method: "cash",
    status: "Complété",
    icon: CheckCircle
  },
  {
    id: "TRX003",
    date: "24/05/2023 10:45",
    chauffeur: "Paul Essomba",
    client: "Aïcha Bello",
    amount: "1,200 FCFA",
    commission: "300 FCFA",
    method: "orange_money",
    status: "Complété",
    icon: CheckCircle
  },
  {
    id: "TRX004",
    date: "24/05/2023 11:30",
    chauffeur: "Julie Lefevre",
    client: "David Bernard",
    amount: "1,800 FCFA",
    commission: "450 FCFA",
    method: "card",
    status: "Complété",
    icon: CheckCircle
  },
  {
    id: "TRX005",
    date: "24/05/2023 13:15",
    chauffeur: "Marc Durand",
    client: "Emma Petit",
    amount: "2,500 FCFA",
    commission: "625 FCFA",
    method: "mobile_money",
    status: "Complété",
    icon: CheckCircle
  },
  {
    id: "TRX006",
    date: "23/05/2023 14:45",
    chauffeur: "Sophie Lambert",
    client: "Lucas Roux",
    amount: "1,700 FCFA",
    commission: "425 FCFA",
    method: "cash",
    status: "Complété",
    icon: CheckCircle
  },
  {
    id: "TRX007",
    date: "23/05/2023 16:20",
    chauffeur: "Thomas Moreau",
    client: "Camille Fournier",
    amount: "2,300 FCFA",
    commission: "575 FCFA",
    method: "orange_money",
    status: "Complété",
    icon: CheckCircle
  }
];

export const driverPayouts = [
  {
    id: "PYT001",
    driver: "Jean Mbarga",
    totalEarnings: "1,250,000 FCFA",
    platformCut: "312,500 FCFA",
    payoutAmount: "937,500 FCFA",
    status: "paid",
    date: "31/05/2023"
  },
  {
    id: "PYT002",
    driver: "Marie Ndiaye",
    totalEarnings: "980,000 FCFA",
    platformCut: "245,000 FCFA",
    payoutAmount: "735,000 FCFA",
    status: "paid",
    date: "31/05/2023"
  },
  {
    id: "PYT003",
    driver: "Paul Essomba",
    totalEarnings: "1,120,000 FCFA",
    platformCut: "280,000 FCFA",
    payoutAmount: "840,000 FCFA",
    status: "pending",
    date: "31/05/2023"
  },
  {
    id: "PYT004",
    driver: "Julie Lefevre",
    totalEarnings: "850,000 FCFA",
    platformCut: "212,500 FCFA",
    payoutAmount: "637,500 FCFA",
    status: "paid",
    date: "30/04/2023"
  },
  {
    id: "PYT005",
    driver: "Marc Durand",
    totalEarnings: "1,050,000 FCFA",
    platformCut: "262,500 FCFA",
    payoutAmount: "787,500 FCFA",
    status: "paid",
    date: "30/04/2023"
  }
];

export const paymentMethods = [
  {
    value: "mobile_money",
    label: "Mobile Money",
    color: "bg-blue-100 text-blue-800",
    icon: Smartphone
  },
  {
    value: "cash",
    label: "Espèces",
    color: "bg-green-100 text-green-800",
    icon: DollarSign
  },
  {
    value: "orange_money",
    label: "Orange Money",
    color: "bg-orange-100 text-orange-800",
    icon: Smartphone
  },
  {
    value: "card",
    label: "Carte Bancaire",
    color: "bg-purple-100 text-purple-800",
    icon: CreditCard
  }
];