
import React from 'react';
import { X, AlertTriangle, TrendingUp, CheckSquare, Sparkles, Activity } from 'lucide-react';
import { InsightResponse } from '../types';

interface AIReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: any | null; // Relaxed type for flexible display
  isLoading: boolean;
}

const AIReportModal: React.FC<AIReportModalProps> = ({ isOpen, onClose, title, data, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-indigo-900">
          <div className="flex items-center text-white">
            <Sparkles className="mr-2" size={20} />
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
          <button onClick={onClose} className="text-indigo-300 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-gray-500 font-medium">Gerando insights...</p>
            </div>
          ) : data ? (
            <div className="space-y-6">
              
              {/* Summary */}
              <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
                <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-2">Resumo Executivo</h3>
                <p className="text-indigo-800 leading-relaxed text-sm md:text-base">{data.summary}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Risks */}
                <div>
                  <div className="flex items-center text-red-600 mb-3">
                    <AlertTriangle size={18} className="mr-2" />
                    <h4 className="font-semibold">Principais Riscos</h4>
                  </div>
                  <ul className="space-y-2 bg-red-50 p-4 rounded-lg border border-red-100">
                    {data.risks && data.risks.map((risk: string, i: number) => (
                      <li key={i} className="flex items-start text-sm text-gray-700">
                        <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></span>
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottlenecks / Opportunities */}
                <div>
                  <div className="flex items-center text-amber-600 mb-3">
                    <Activity size={18} className="mr-2" />
                    <h4 className="font-semibold">Gargalos</h4>
                  </div>
                  <ul className="space-y-2 bg-amber-50 p-4 rounded-lg border border-amber-100">
                    {data.opportunities && data.opportunities.map((opp: string, i: number) => (
                      <li key={i} className="flex items-start text-sm text-gray-700">
                        <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0"></span>
                        {opp}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-gray-100 pt-6">
                <div className="flex items-center text-green-700 mb-3">
                  <CheckSquare size={18} className="mr-2" />
                  <h4 className="font-semibold">Ações Prioritárias (Esta Semana)</h4>
                </div>
                <div className="grid gap-3">
                   {data.recommendedActions && data.recommendedActions.map((action: string, i: number) => (
                      <div key={i} className="flex items-center p-3 bg-green-50 rounded-lg border border-green-100">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-200 text-green-800 text-xs font-bold mr-3">
                          {i + 1}
                        </div>
                        <span className="text-sm text-gray-800 font-medium">{action}</span>
                      </div>
                    ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
                Falha ao gerar análise. Tente novamente.
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-end">
            <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm">
                Fechar
            </button>
        </div>
      </div>
    </div>
  );
};

export default AIReportModal;
