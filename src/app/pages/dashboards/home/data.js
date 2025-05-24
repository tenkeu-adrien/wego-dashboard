import { 
    Users, 
    Car, 
    Clock, 
    DollarSign, 
    MapPin, 
    // PieChart, 
    // TrendingUp, 
    // Calendar,
    Smartphone,
    ShieldCheck
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
    }
  ];
  
  export const platformStats = [
    {
      title: "Couverture zones",
      value: "85%",
      icon: MapPin,
      progress: 85,
      description: "Abidjan et périphérie"
    },
    {
      title: "App mobile",
      value: "72%",
      icon: Smartphone,
      progress: 72,
      description: "Utilisation via mobile"
    },
    {
      title: "Satisfaction",
      value: "4.8/5",
      icon: ShieldCheck,
      progress: 96,
      description: "Basé sur 1,024 avis"
    }
  ];
  
  export const recentActivities = [
    {
      id: "ACT001",
      type: "Nouveau chauffeur",
      description: "Karim Diop a rejoint la plateforme",
      time: "Il y a 15 min",
      icon: Users
    },
    {
      id: "ACT002",
      type: "Paiement effectué",
      description: "Paiement de 285,000 FCFA à Aïcha Koné",
      time: "Il y a 2h",
      icon: DollarSign
    },
    // Ajouter 3-5 autres activités...
  ];