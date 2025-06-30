import { 
  Users, Car, Clock, DollarSign, MapPin, Smartphone, ShieldCheck,
  TrendingUp, Navigation, Package,  BatteryCharging, AlertTriangle,
  FileText, MessageSquare, Download, UserCheck, Settings,
  X
} from 'lucide-react';

export const adminStats = [
  {
    title: "Utilisateurs actifs",
    value: "1,248",
    change: "+8%",
    icon: Users,
    color: "bg-blue-100 text-blue-800",
    trend: 'up',
    detail: "30 jours"
  },
  {
    title: "Courses aujourd'hui",
    value: "156",
    change: "+12%",
    icon: Car,
    color: "bg-green-100 text-green-800",
    trend: 'up',
    detail: "vs hier"
  },
  {
    title: "Revenu journalier",
    value: "2,450,000 FCFA",
    change: "+18%",
    icon: DollarSign,
    color: "bg-purple-100 text-purple-800",
    trend: 'up',
    detail: "Moyenne: 1,850,000 FCFA"
  },
  {
    title: "Temps moyen course",
    value: "18 min",
    change: "-5%",
    icon: Clock,
    color: "bg-amber-100 text-amber-800",
    trend: 'down',
    detail: "Efficacité améliorée"
  },
  {
    title: "Kilomètres moyens",
    value: "7.2 km",
    change: "+3%",
    icon: Navigation,
    color: "bg-indigo-100 text-indigo-800",
    trend: 'up',
    detail: "Par course"
  },
  {
    title: "Kilomètres totaux",
    value: "12,458 km",
    change: "+22%",
    icon: TrendingUp,
    color: "bg-cyan-100 text-cyan-800",
    trend: 'up',
    detail: "Ce mois"
  },
  {
    title: "Temps total",
    value: "468 h",
    change: "+15%",
    icon: Clock,
    color: "bg-orange-100 text-orange-800",
    trend: 'up',
    detail: "Temps de conduite"
  },
  {
    title: "Taux d'occupation",
    value: "78%",
    change: "+7%",
    icon: BatteryCharging,
    color: "bg-emerald-100 text-emerald-800",
    trend: 'up',
    detail: "Utilisation  d'engin motorisé"
  }
];

export const platformStats = [
  {
    title: "Couverture zones",
    value: "85%",
    icon: MapPin,
    color: "bg-blue-100 text-blue-800",
    progress: 85,
    progressColor: "bg-blue-600",
    description: "Douala et périphérie"
  },
  {
    title: "App mobile",
    value: "72%",
    icon: Smartphone,
    color: "bg-purple-100 text-purple-800",
    progress: 72,
    progressColor: "bg-purple-600",
    description: "Utilisation via mobile"
  },
  {
    title: "Satisfaction",
    value: "4.8/5",
    icon: ShieldCheck,
    color: "bg-green-100 text-green-800",
    progress: 96,
    progressColor: "bg-green-600",
    description: "Basé sur 1,024 avis"
  }
];

export const recentActivities = [
  {
    id: "ACT001",
    type: "Nouveau chauffeur",
    description: "Karim Diop a rejoint la plateforme",
    time: "Il y a 15 min",
    icon: UserCheck,
    color: "bg-blue-100 text-blue-600"
  },
  {
    id: "ACT002",
    type: "Paiement effectué",
    description: "Paiement de 285,000 FCFA à Aïcha Koné",
    time: "Il y a 2h",
    icon: DollarSign,
    color: "bg-green-100 text-green-600"
  },
  {
    id: "ACT004",
    type: "Problème signalé",
    description: "Retard de chauffeur à Bonanjo",
    time: "Il y a 5h",
    icon: AlertTriangle,
    color: "bg-amber-100 text-amber-600"
  },
  {
    id: "ACT005",
    type: "Mise à jour",
    description: "Nouvelle version de l'application",
    time: "Aujourd'hui",
    icon: Download,
    color: "bg-indigo-100 text-indigo-600"
  }
];

export const keyMetrics = [
  {
    title: "Taux d'annulation",
    value: "4.2%",
    icon: X,
    color: "bg-red-100 text-red-600",
    progress: 4.2,
    progressColor: "bg-red-600",
    description: "Moins 1.3% vs mois dernier"
  },
  {
    title: "Chauffeurs actifs",
    value: "287",
    icon: Users,
    color: "bg-blue-100 text-blue-600",
    progress: 72,
    progressColor: "bg-blue-600",
    description: "87% des chauffeurs"
  },
  {
    title: "Courses livraison",
    value: "32%",
    icon: Package,
    color: "bg-purple-100 text-purple-600",
    progress: 32,
    progressColor: "bg-purple-600",
    description: "Part des livraisons"
  },
  {
    title: "Retours clients",
    value: "24h",
    icon: Clock,
    color: "bg-cyan-100 text-cyan-600",
    progress: 85,
    progressColor: "bg-cyan-600",
    description: "Temps moyen de réponse"
  }
];

export const alerts = [
  {
    title: "5 chauffeurs en attente",
    description: "Validation des documents requis",
    icon: FileText,
    borderColor: "border-yellow-400",
    bgColor: "bg-yellow-50",
    iconColor: "bg-yellow-100 text-yellow-600",
    action: "Vérifier"
  },
  {
    title: "3 réclamations",
    description: "À traiter aujourd'hui",
    icon: MessageSquare,
    borderColor: "border-blue-400",
    bgColor: "bg-blue-50",
    iconColor: "bg-blue-100 text-blue-600",
    action: "Consulter"
  },
  {
    title: "Mise à jour disponible",
    description: "Version 2.1.0 - Corrections de bugs",
    icon: Settings,
    borderColor: "border-green-400",
    bgColor: "bg-green-50",
    iconColor: "bg-green-100 text-green-600",
    action: "Mettre à jour"
  }
]