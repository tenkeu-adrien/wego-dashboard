// Import Dependencies


// Local Imports
import { Page } from "components/shared/Page";
import { useState } from 'react';
import { Mail, Phone, MessageSquare, User, Clock, CheckCircle2, Search, Filter } from 'lucide-react';

// ----------------------------------------------------------------------

export default function UsersDatatable() {


    
    // Assurez-vous que 'role' est une chaîne de caractères, pas un tableau
  

    const [activeTab, setActiveTab] = useState('open');
    const [searchTerm, setSearchTerm] = useState('');

 



    // <div title="Support Client">
    

  const tickets = [
    {
      id: 'T-1001',
      customer: 'Fatoumata Diop',
      subject: 'Problème de paiement',
      date: '15/06/2023 09:30',
      channel: 'email',
      status: 'open',
      priority: 'high'
    },
    // Ajouter 7-10 autres tickets...
  ];

  const filteredTickets = tickets.filter(ticket => 
    (activeTab === 'all' || ticket.status === activeTab) &&
    (ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
     ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getChannelIcon = (channel) => {
    switch(channel) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <Page title="Support client">
    <div className="container mx-auto mt-5 px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4">Support Client</h1>
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            <Filter className="h-4 w-4 mr-1" />
            Filtres
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            <MessageSquare className="h-4 w-4 mr-2" />
            Nouveau ticket
          </button>
        </div>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'open', label: 'Ouverts', icon: Clock, count: tickets.filter(t => t.status === 'open').length },
            { id: 'resolved', label: 'Résolus', icon: CheckCircle2, count: tickets.filter(t => t.status === 'resolved').length },
            { id: 'all', label: 'Tous les tickets', icon: Mail, count: tickets.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 flex items-center text-sm font-medium border-b-2 ${activeTab === tab.id ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID Ticket
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sujet
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Canal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priorité
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {ticket.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      {ticket.customer}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ticket.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getChannelIcon(ticket.channel)}
                      <span className="ml-2 capitalize">{ticket.channel}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      ticket.priority === 'high' 
                        ? 'bg-red-100 text-red-800' 
                        : ticket.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {ticket.priority === 'high' ? 'Haute' : ticket.priority === 'medium' ? 'Moyenne' : 'Basse'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ticket.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-green-600 hover:text-green-900">
                      Répondre
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  Aucun ticket trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Détail du ticket sélectionné */}
      {filteredTickets.length > 0 && (
        <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-medium">Conversation du ticket {filteredTickets[0].id}</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <User className="h-5 w-5" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {filteredTickets[0].customer}
                    <span className="ml-2 text-xs text-gray-500">{filteredTickets[0].date}</span>
                  </div>
                  <div className="mt-1 text-sm text-gray-700">
                    <p>Bonjour, je n&apos;arrive pas à effectuer un paiement pour ma course. Le système me renvoie une erreur à chaque tentative.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <span className="text-sm font-medium">AD</span>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    Support VTC
                    <span className="ml-2 text-xs text-gray-500">15/06/2023 10:15</span>
                  </div>
                  <div className="mt-1 text-sm text-gray-700">
                    <p>Bonjour Madame Diop,</p>
                    <p className="mt-1">Nous avons vérifié votre compte et tout semble normal. Pourriez-vous nous envoyer une capture d&apos;écran de l&apos;erreur que vous rencontrez ?</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-4">
              <form>
                <div className="mb-4">
                  <label htmlFor="response" className="block text-sm font-medium text-gray-700 mb-1">
                    Réponse
                  </label>
                  <textarea
                    id="response"
                    rows={3}
                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                    placeholder="Écrivez votre réponse..."
                    defaultValue={''}
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Marquer comme résolu
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Envoyer la réponse
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
    </Page>
  );
};
    // </div>
 
