import { useState } from 'react';
import { Download, FileText,  BarChart2, Users, DollarSign, ChevronDown,  } from 'lucide-react';

const ReportsDashboard = () => {
  const [selectedReport, setSelectedReport] = useState(null);

  const reportTypes = [
    {
      id: 'financial',
      title: 'Rapport financier',
      description: 'Revenus, commissions et performances financières',
      icon: DollarSign,
      frequency: ['Quotidien', 'Hebdomadaire', 'Mensuel']
    },
    {
      id: 'drivers',
      title: 'Rapport chauffeurs',
      description: 'Performance et activité des chauffeurs',
      icon: Users,
      frequency: ['Hebdomadaire', 'Mensuel']
    },
    // Ajouter 3-4 autres types...
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Génération de rapports</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {reportTypes.map((report) => (
          <div 
            key={report.id} 
            className={`border rounded-lg p-6 hover:border-green-300 transition-colors cursor-pointer ${
              selectedReport === report.id ? 'border-green-500 bg-green-50' : 'border-gray-200'
            }`}
            onClick={() => setSelectedReport(report.id)}
          >
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <report.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-medium">{report.title}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">{report.description}</p>
            <div className="flex flex-wrap gap-2">
              {report.frequency.map((freq) => (
                <span key={freq} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {freq}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedReport && (
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              {reportTypes.find(r => r.id === selectedReport)?.title}
            </h2>
            <div className="flex space-x-3">
              <div className="relative">
                <select
                  className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  defaultValue=""
                >
                  <option value="">Sélectionner une période</option>
                  <option value="7days">7 derniers jours</option>
                  <option value="30days">30 derniers jours</option>
                  <option value="month">Mois en cours</option>
                </select>
                <ChevronDown className="h-4 w-4 absolute right-3 top-2.5 text-gray-400" />
              </div>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                <Download className="h-4 w-4 mr-2" />
                Générer le rapport
              </button>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 h-96 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <BarChart2 className="h-10 w-10 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">Aperçu du rapport</p>
              <p className="text-sm text-gray-400 mt-2">
                Sélectionnez une période et générez le rapport pour voir les données
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-blue-800">Format disponible</p>
              <div className="mt-2 space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-gray-800 border border-gray-300">
                  PDF
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-gray-800 border border-gray-300">
                  Excel
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-gray-800 border border-gray-300">
                  CSV
                </span>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg md:col-span-2">
              <p className="text-sm font-medium text-green-800">Derniers rapports générés</p>
              <ul className="mt-2 space-y-1">
                <li className="text-sm text-gray-600 flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-gray-400" />
                  Rapport_{selectedReport}_2023-06-15.pdf
                </li>
                <li className="text-sm text-gray-600 flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-gray-400" />
                  Rapport_{selectedReport}_2023-06-01.xlsx
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsDashboard;