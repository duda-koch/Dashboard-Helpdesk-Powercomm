
import React, { useState, useEffect } from 'react';
import { SupportTicket } from '../types';
import { Search, Filter, ChevronLeft, ChevronRight, Clock, HelpCircle, LayoutGrid, List, Calendar, User, AlertCircle } from 'lucide-react';

interface TicketTableProps {
  tickets: SupportTicket[];
  onTicketClick: (ticket: SupportTicket) => void;
  compact?: boolean;
}

const TicketTable: React.FC<TicketTableProps> = ({ tickets, onTicketClick, compact = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  // Update items per page based on mode (Compact Dashboard = 20, Full Table = 10)
  const itemsPerPage = compact ? 20 : 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [tickets]);

  const filteredTickets = tickets.filter(ticket => 
    ticket.nomeTicket.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.tecnico.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTickets = filteredTickets.slice(startIndex, startIndex + itemsPerPage);

  const getPriorityBadge = (p: string) => {
    const base = "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide";
    switch (p.toLowerCase()) {
      case 'urgente': return `${base} bg-red-100 text-red-600 border border-red-200`;
      case 'alta': return `${base} bg-orange-100 text-orange-600 border border-orange-200`;
      case 'média': return `${base} bg-yellow-100 text-yellow-600 border border-yellow-200`;
      default: return `${base} bg-slate-100 text-slate-500 border border-slate-200`;
    }
  };

  const getStatusBadge = (status: string) => {
    if (status.includes('Resolvido')) return <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-md text-xs font-semibold border border-green-100">Resolvido</span>;
    if (status.includes('Backlog')) return <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded-md text-xs font-semibold border border-red-100">Backlog</span>;
    if (status.includes('atendimento')) return <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md text-xs font-semibold border border-blue-100">Em Atendimento</span>;
    return <span className="text-gray-600 bg-gray-50 px-2 py-0.5 rounded-md text-xs font-semibold border border-gray-100">{status}</span>;
  };

  return (
    <div className={`bg-white rounded-xl ${!compact && 'shadow-sm border border-gray-100'} flex flex-col h-full`}>
      {/* Header - Only show in full mode */}
      {!compact && (
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3 w-full">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Buscar tickets..." 
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-full transition-shadow"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
            
            <div className="flex items-center space-x-2 border-l border-gray-200 pl-3">
               <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-orange-50 text-orange-600' : 'text-gray-400 hover:bg-gray-50'}`}
                title="Visualização em Lista"
               >
                 <List size={18} />
               </button>
               <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-orange-50 text-orange-600' : 'text-gray-400 hover:bg-gray-50'}`}
                title="Visualização em Cards"
               >
                 <LayoutGrid size={18} />
               </button>
            </div>

            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
              <Filter size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="overflow-auto flex-1 custom-scrollbar bg-white relative">
        
        {/* --- LIST VIEW --- */}
        {viewMode === 'list' && (
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white z-10 shadow-sm">
              <tr className="bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider font-bold border-b border-gray-100">
                 {compact ? (
                   <>
                     <th className="px-6 py-3">Cliente</th>
                     <th className="px-4 py-3">Categoria</th>
                     <th className="px-4 py-3">Abertura</th>
                     <th className="px-4 py-3">Status</th>
                     <th className="px-4 py-3">Técnico</th>
                     <th className="px-4 py-3 text-right">SLA</th>
                   </>
                 ) : (
                   <>
                     <th className="px-6 py-3">Status</th>
                     <th className="px-6 py-3">Prioridade</th>
                     <th className="px-6 py-3">Cliente</th>
                     <th className="px-6 py-3 w-1/3">Assunto</th>
                     <th className="px-6 py-3">Técnico</th>
                     <th className="px-6 py-3 text-right">SLA</th>
                   </>
                 )}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50 text-sm text-gray-600">
              {currentTickets.map((ticket, idx) => (
                <tr 
                  key={idx} 
                  onClick={() => onTicketClick(ticket)}
                  className="hover:bg-orange-50/50 cursor-pointer transition-colors group border-l-2 border-l-transparent hover:border-l-orange-500"
                >
                  {compact ? (
                    // --- Dashboard View (Compact) ---
                    <>
                      <td className="px-6 py-3 font-bold text-slate-700 whitespace-nowrap">
                        {ticket.cliente}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                          {ticket.tag || 'Geral'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                         {ticket.dataAbertura.split(' ')[0]}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {getStatusBadge(ticket.status)}
                      </td>
                      <td className="px-4 py-3 text-xs font-medium text-indigo-600 whitespace-nowrap">
                        {ticket.tecnico}
                      </td>
                      <td className="px-4 py-3 text-right relative group/sla">
                         <div className="flex items-center justify-end space-x-1 cursor-help">
                            <span className={`font-mono font-bold ${ticket.sla > 24 ? 'text-red-500' : 'text-slate-600'}`}>{ticket.sla}h</span>
                            {/* SLA Tooltip */}
                            <div className="absolute bottom-full right-0 mb-2 w-32 p-2.5 bg-slate-800 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover/sla:opacity-100 transition-all duration-200 pointer-events-none z-50 text-center transform translate-y-1 group-hover/sla:translate-y-0">
                              <span className="block text-[10px] text-slate-400 mb-1 uppercase tracking-wide">Resolução</span>
                              <span className="font-bold text-orange-300 text-sm">{ticket.sla} horas</span>
                              <div className="absolute top-full right-4 w-2 h-2 bg-slate-800 transform rotate-45 -mt-1"></div>
                            </div>
                         </div>
                      </td>
                    </>
                  ) : (
                    // --- Full View (Rows) ---
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                         {getStatusBadge(ticket.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getPriorityBadge(ticket.prioridade)}>
                          {ticket.prioridade}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-700 whitespace-nowrap">{ticket.cliente}</td>
                      <td className="px-6 py-4 truncate max-w-xs text-gray-700 font-medium group-hover:text-orange-700 transition-colors">
                        {ticket.nomeTicket}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs">
                        {ticket.tecnico}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right relative group/sla">
                          <div className="cursor-help inline-block">
                              <span className="font-mono text-slate-500">{ticket.sla}h</span>
                               {/* SLA Tooltip */}
                               <div className="absolute bottom-full right-0 mb-2 w-max px-3 py-2 bg-slate-800 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover/sla:opacity-100 transition-all duration-200 pointer-events-none z-50 transform translate-y-1 group-hover/sla:translate-y-0">
                                  Tempo de Resolução: <span className="font-bold text-orange-300 ml-1">{ticket.sla} horas</span>
                                  <div className="absolute top-full right-3 w-2 h-2 bg-slate-800 transform rotate-45 -mt-1"></div>
                                </div>
                          </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* --- GRID VIEW --- */}
        {viewMode === 'grid' && (
           <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
             {currentTickets.map((ticket, idx) => (
               <div 
                  key={idx}
                  onClick={() => onTicketClick(ticket)}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-orange-300 transition-all cursor-pointer group flex flex-col"
               >
                  <div className="flex justify-between items-start mb-3">
                     {getStatusBadge(ticket.status)}
                     <span className={getPriorityBadge(ticket.prioridade)}>{ticket.prioridade}</span>
                  </div>
                  
                  <h4 className="text-sm font-bold text-gray-800 mb-1 line-clamp-2 group-hover:text-orange-600 transition-colors h-[40px]">
                    {ticket.nomeTicket}
                  </h4>
                  <div className="text-xs text-gray-500 mb-4 font-medium">{ticket.cliente}</div>

                  <div className="mt-auto space-y-2 pt-3 border-t border-gray-50">
                     <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                           <User size={14} className="mr-1.5 text-gray-400" />
                           <span className="text-indigo-600 font-medium">{ticket.tecnico.split(' ')[0]}</span>
                        </div>
                        <div className="flex items-center">
                           <Calendar size={14} className="mr-1.5 text-gray-400" />
                           <span>{ticket.dataAbertura.split(' ')[0]}</span>
                        </div>
                     </div>
                     
                     <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center text-gray-500">
                           <AlertCircle size={14} className="mr-1.5 text-gray-400" />
                           <span className="truncate max-w-[100px]">{ticket.tag || 'Geral'}</span>
                        </div>
                        <div className="flex items-center text-gray-600 font-mono relative group/sla">
                           <Clock size={14} className="mr-1.5 text-gray-400" />
                           <span className={ticket.sla > 24 ? 'text-red-600 font-bold' : ''}>{ticket.sla}h</span>
                           
                           {/* SLA Tooltip for Grid */}
                           <div className="absolute bottom-full right-0 mb-2 w-max px-3 py-2 bg-slate-800 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover/sla:opacity-100 transition-all duration-200 pointer-events-none z-50 transform translate-y-1 group-hover/sla:translate-y-0">
                              Resolução: <span className="font-bold text-orange-300 ml-1">{ticket.sla} horas</span>
                              <div className="absolute top-full right-3 w-2 h-2 bg-slate-800 transform rotate-45 -mt-1"></div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
             ))}
           </div>
        )}

        {currentTickets.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 text-sm">
              <HelpCircle size={32} className="mb-2 opacity-20"/>
              Nenhum ticket encontrado.
            </div>
        )}
      </div>

      {/* Pagination */}
      <div className="px-6 py-3 border-t border-gray-50 flex items-center justify-between bg-white rounded-b-xl">
        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
           Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredTickets.length)} de {filteredTickets.length}
        </span>
        <div className="flex items-center space-x-1">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 text-slate-500 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 text-slate-500 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketTable;
