
import React from 'react';
import { X, User, Calendar, Tag, AlertCircle, Clock, CheckCircle, MessageSquare, Briefcase, Shield } from 'lucide-react';
import { SupportTicket } from '../types';

interface TicketDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: SupportTicket | null;
}

const TicketDetailModal: React.FC<TicketDetailModalProps> = ({ isOpen, onClose, ticket }) => {
  if (!isOpen || !ticket) return null;

  const getPriorityColor = (p: string) => {
    switch (p.toLowerCase()) {
      case 'urgente': return 'bg-red-100 text-red-800 border-red-200';
      case 'alta': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'média': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-50 text-blue-800 border-blue-200';
    }
  };

  const getStatusColor = (s: string) => {
    if (s.includes('Resolvido')) return 'bg-green-100 text-green-800';
    if (s.includes('Backlog')) return 'bg-red-100 text-red-800';
    return 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-start justify-between bg-white rounded-t-2xl">
          <div className="flex-1 pr-4">
            <div className="flex items-center space-x-3 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getPriorityColor(ticket.prioridade)}`}>
                {ticket.prioridade}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(ticket.status)}`}>
                {ticket.status}
              </span>
              <span className="text-gray-400 text-sm font-mono">SLA: {ticket.sla}h</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">{ticket.nomeTicket}</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left Column: Main Details */}
            <div className="md:col-span-2 space-y-8">
              
              {/* Description Section */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex items-center text-gray-800 mb-4">
                  <MessageSquare size={20} className="mr-2 text-indigo-600" />
                  <h3 className="font-semibold text-lg">Descrição e Resolução</h3>
                </div>
                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed font-sans">
                  {ticket.descricao || "Nenhuma descrição fornecida."}
                </div>
              </div>

              {/* Dates Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-gray-100 rounded-lg">
                   <div className="flex items-center text-gray-500 mb-1 text-xs uppercase font-semibold">
                     <Calendar size={14} className="mr-1.5" /> Abertura
                   </div>
                   <div className="font-medium text-gray-900">{ticket.dataAbertura}</div>
                </div>
                <div className="p-4 border border-gray-100 rounded-lg">
                   <div className="flex items-center text-gray-500 mb-1 text-xs uppercase font-semibold">
                     <CheckCircle size={14} className="mr-1.5" /> Conclusão
                   </div>
                   <div className="font-medium text-gray-900">{ticket.dataTermino || '-'}</div>
                </div>
              </div>
            </div>

            {/* Right Column: Meta Data */}
            <div className="space-y-6">
              
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Informações do Ticket</h4>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Briefcase size={18} className="text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Cliente</p>
                      <p className="font-semibold text-gray-900">{ticket.cliente}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <User size={18} className="text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Solicitante</p>
                      <p className="font-medium text-gray-900">{ticket.solicitante || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Shield size={18} className="text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Técnico</p>
                      <p className="font-medium text-indigo-600">{ticket.tecnico}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Tag size={18} className="text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Categoria (Tag)</p>
                      <p className="font-medium text-gray-900">{ticket.tag || 'Sem categoria'}</p>
                    </div>
                  </div>
                   <div className="flex items-start">
                    <AlertCircle size={18} className="text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Tipo</p>
                      <p className="font-medium text-gray-900">{ticket.tipoTicket}</p>
                    </div>
                  </div>

                   <div className="flex items-start">
                    <Clock size={18} className="text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Nível de Suporte</p>
                      <p className="font-medium text-gray-900">{ticket.nivel}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl flex justify-end space-x-3">
           <button 
             onClick={() => alert('Feature mock: Reatribuir')}
             className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
           >
             Reatribuir Ticket
           </button>
           <button 
             onClick={() => alert('Feature mock: Atualizar status')}
             className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
           >
             Atualizar Status
           </button>
        </div>

      </div>
    </div>
  );
};

export default TicketDetailModal;
