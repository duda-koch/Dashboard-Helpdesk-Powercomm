
import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Sparkles,
  Settings,
  Download,
  Globe,
  CalendarRange
} from 'lucide-react';

import { REAL_TICKET_DATA } from './constants';
import { SupportTicket, InsightResponse, ChartData } from './types';
import { analyzeTicketData } from './services/geminiService';

import MetricCard from './components/MetricCard';
import { 
  LevelBarChart, 
  StatusProgressChart, 
  TopClientsBarChart, 
  TopTagsBarChart,
  SLAHistogram
} from './components/DashboardCharts';
import AIReportModal from './components/AIReportModal';
import TicketTable from './components/TicketTable';
import TicketDetailModal from './components/TicketDetailModal';

// Helper to parse date DD/MM/YYYY
const parseDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  const [datePart] = dateStr.split(' '); 
  const parts = datePart.split('/');
  if (parts.length !== 3) return null;
  return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
};

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiData, setAiData] = useState<InsightResponse | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // --- DATA PROCESSING (Nov vs Global) ---
  const { novMetrics, globalMetrics } = useMemo(() => {
    
    // 1. Define Sets
    const globalTickets = REAL_TICKET_DATA;
    const novTickets = REAL_TICKET_DATA.filter(t => {
      const d = parseDate(t.dataAbertura);
      return d && d.getMonth() === 10 && d.getFullYear() === 2025; 
    });

    // 2. Calculation Helper
    const calcMetrics = (dataset: SupportTicket[]) => {
      const total = dataset.length;
      const resolvedList = dataset.filter(t => t.status === 'Resolvido');
      const resolvedCount = resolvedList.length;
      const openCount = total - resolvedCount;
      
      const percentResolved = total > 0 ? Math.round((resolvedCount / total) * 100) : 0;

      // SLA Split Logic
      const resolvedN1 = resolvedList.filter(t => t.nivel.toUpperCase() === 'N1');
      const resolvedN2N3 = resolvedList.filter(t => ['N2', 'N3'].includes(t.nivel.toUpperCase()));

      const avgSlaN1 = resolvedN1.length 
        ? (resolvedN1.reduce((acc, curr) => acc + curr.sla, 0) / resolvedN1.length).toFixed(1) 
        : "0";
      
      const avgSlaN2N3 = resolvedN2N3.length 
        ? (resolvedN2N3.reduce((acc, curr) => acc + curr.sla, 0) / resolvedN2N3.length).toFixed(1) 
        : "0";

      return {
        total,
        open: openCount,
        resolved: resolvedCount,
        percentResolved,
        avgSlaN1,
        avgSlaN2N3,
        dataset // Return dataset for charts
      };
    };

    return {
      globalMetrics: calcMetrics(globalTickets),
      novMetrics: calcMetrics(novTickets)
    };
  }, []);

  // --- CHARTS DATA (Based on November for Operational Dashboard) ---
  const chartsData = useMemo(() => {
    const currentDataset = novMetrics.dataset; // Use November data for charts to keep charts actionable

    // 1. Level (Severity)
    const levelCount: Record<string, number> = { N1: 0, N2: 0, N3: 0 };
    currentDataset.forEach(t => { 
        const lvl = t.nivel.toUpperCase();
        if (levelCount[lvl] !== undefined) levelCount[lvl]++; 
    });
    const levelData: ChartData[] = Object.keys(levelCount).map(k => ({ name: k, value: levelCount[k] }));

    // 2. Status (Progress bars)
    const statusCount: Record<string, number> = {};
    currentDataset.forEach(t => { statusCount[t.status] = (statusCount[t.status] || 0) + 1; });
    const statusData: ChartData[] = Object.keys(statusCount)
      .sort((a, b) => statusCount[b] - statusCount[a])
      .map(k => ({ name: k, value: statusCount[k] }));

    // 3. Top Clients
    const clientCount: Record<string, number> = {};
    currentDataset.forEach(t => { clientCount[t.cliente.trim()] = (clientCount[t.cliente.trim()] || 0) + 1; });
    const clientData: ChartData[] = Object.entries(clientCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(([name, value]) => ({ name, value }));

    // 4. Top Tags (Categories)
    const tagCount: Record<string, number> = {};
    currentDataset.forEach(t => { 
      const tag = t.tag ? t.tag.trim() : "Sem Tag";
      if (tag) tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
    const tagData: ChartData[] = Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));

    // 5. SLA Buckets
    const slaBuckets = { '0-4h': 0, '5-12h': 0, '13-24h': 0, '24h+': 0 };
    currentDataset.filter(t => t.status === 'Resolvido').forEach(t => {
      if (t.sla <= 4) slaBuckets['0-4h']++;
      else if (t.sla <= 12) slaBuckets['5-12h']++;
      else if (t.sla <= 24) slaBuckets['13-24h']++;
      else slaBuckets['24h+']++;
    });
    const slaData: ChartData[] = Object.entries(slaBuckets).map(([name, value]) => ({ name, value }));

    return { levelData, statusData, clientData, tagData, slaData };
  }, [novMetrics.dataset]);


  const handleAiAnalysis = async () => {
    setAiData(null);
    setIsModalOpen(true);
    setIsLoadingAi(true);
    try {
        const result = await analyzeTicketData(novMetrics.dataset);
        const mappedData: any = {
            summary: result?.executiveSummary,
            risks: result?.risks,
            opportunities: result?.bottlenecks, 
            recommendedActions: result?.priorityActions
        };
        setAiData(mappedData);
    } catch (e) {
        console.error(e);
    } finally {
        setIsLoadingAi(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f1f5] font-sans text-slate-600 pb-10">
      
      {/* --- HEADER --- */}
      <div className="bg-white px-8 py-5 shadow-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-orange-200 shadow-md text-white">
               <LayoutDashboard size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 uppercase tracking-wide">Help Desk Dashboard</h1>
              <p className="text-xs text-slate-400 font-medium">BEM-VINDO AO POWERCOMM • NOVEMBRO 2025</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
             <nav className="hidden md:flex space-x-8 mr-4">
                <button className="text-orange-600 font-bold border-b-2 border-orange-500 pb-1">DASHBOARD</button>
                <button className="text-slate-400 hover:text-slate-600 font-medium pb-1 transition-colors">DETALHES</button>
             </nav>
             <div className="flex items-center space-x-2 border-l border-gray-200 pl-6">
                <button 
                  onClick={handleAiAnalysis}
                  className="flex items-center text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-2 rounded-lg text-xs font-bold transition-colors"
                >
                  <Sparkles size={14} className="mr-2" /> IA ANALYST
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-600">
                  <Settings size={18} />
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-600">
                  <Download size={18} />
                </button>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 pt-6">
        
        {/* --- KPI SECTION: DUAL VIEW --- */}
        <div className="mb-8 space-y-6">
            
            {/* Row 1: November Focus (Operational) */}
            <div>
                <div className="flex items-center mb-3 text-orange-600">
                   <CalendarRange size={18} className="mr-2" />
                   <h3 className="text-sm font-bold uppercase tracking-wider">Performance de Novembro (Mensal)</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    <MetricCard 
                        title="TOTAL TICKETS (NOV)" 
                        value={novMetrics.total} 
                        isMain={true}
                        color="orange"
                    />
                    <MetricCard 
                        title="TICKETS ABERTOS" 
                        value={novMetrics.open} 
                        subValue="Novos em Novembro"
                        color="blue" 
                    />
                    <MetricCard 
                        title="TAXA RESOLUÇÃO" 
                        value={`${novMetrics.percentResolved}%`} 
                        subValue="Eficiência Mensal"
                        trend={8} // Mock trend positive
                        color="green" 
                    />
                    <MetricCard 
                        title="SLA MÉDIO (N2/N3)" 
                        value={`${novMetrics.avgSlaN2N3} DIAS`} 
                        subValue="Alta Complexidade"
                        color="orange" 
                    />
                    <MetricCard 
                        title="SLA MÉDIO (N1)" 
                        value={`${novMetrics.avgSlaN1} DIAS`} 
                        subValue="Baixa Complexidade"
                        color="green" 
                    />
                </div>
            </div>

            {/* Row 2: Global Context (Backlog/Historical) */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                <div className="flex items-center mb-3 text-slate-500">
                   <Globe size={16} className="mr-2" />
                   <h3 className="text-xs font-bold uppercase tracking-wider">Visão Global (Acumulado + Histórico)</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                     {/* Secondary/Compact Metric Cards */}
                     <div className="flex flex-col pl-2 border-l-4 border-slate-300">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Total Geral</span>
                        <span className="text-xl font-bold text-slate-700">{globalMetrics.total}</span>
                     </div>
                     <div className="flex flex-col pl-2 border-l-4 border-red-300">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Backlog Total (Abertos)</span>
                        <span className="text-xl font-bold text-red-600">{globalMetrics.open}</span>
                     </div>
                     <div className="flex flex-col pl-2 border-l-4 border-slate-300">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Taxa Resolução Global</span>
                        <span className="text-xl font-bold text-slate-700">{globalMetrics.percentResolved}%</span>
                     </div>
                     <div className="flex flex-col pl-2 border-l-4 border-slate-300">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">SLA Médio Global (N2/N3)</span>
                        <span className="text-xl font-bold text-slate-700">{globalMetrics.avgSlaN2N3} Dias</span>
                     </div>
                     <div className="flex flex-col pl-2 border-l-4 border-slate-300">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">SLA Médio Global (N1)</span>
                        <span className="text-xl font-bold text-slate-700">{globalMetrics.avgSlaN1} Dias</span>
                     </div>
                </div>
            </div>

        </div>

        {/* --- MAIN GRID LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* --- LEFT COLUMN (Status & Category) --- */}
          <div className="lg:col-span-3 flex flex-col space-y-6 h-full">
            {/* By Ticket Status */}
            <div className="bg-white p-6 rounded-xl shadow-sm h-[340px] flex flex-col">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">STATUS (NOVEMBRO)</h3>
              <div className="flex-1 overflow-hidden">
                 <StatusProgressChart data={chartsData.statusData} total={novMetrics.total} />
              </div>
            </div>

            {/* By Issue Category */}
            <div className="bg-white p-6 rounded-xl shadow-sm flex-1 flex flex-col min-h-[300px]">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">CATEGORIAS (TOP 5)</h3>
              <div className="flex-1">
                 <TopTagsBarChart data={chartsData.tagData} />
              </div>
            </div>
          </div>

          {/* --- MIDDLE COLUMN (Trend & List) --- */}
          <div className="lg:col-span-6 flex flex-col space-y-6 h-full">
             {/* Top Clients */}
             <div className="bg-white p-6 rounded-xl shadow-sm h-[340px]">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">TOP CLIENTES (VOLUME NOV)</h3>
                <div className="h-full pb-4">
                  <TopClientsBarChart data={chartsData.clientData} />
                </div>
             </div>

             {/* Table Area */}
             <div className="bg-white rounded-xl shadow-sm flex-1 overflow-hidden flex flex-col min-h-[400px]">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">LISTA DE TICKETS (NOVEMBRO)</h3>
                   <button className="text-xs text-orange-500 font-bold hover:underline">VER TODOS</button>
                </div>
                <div className="flex-1 h-full relative">
                   <div className="absolute inset-0">
                     <TicketTable 
                        tickets={novMetrics.dataset} 
                        onTicketClick={(t) => { setSelectedTicket(t); setIsDetailOpen(true); }}
                        compact={true}
                     />
                   </div>
                </div>
             </div>
          </div>

          {/* --- RIGHT COLUMN (Severity & Open Days) --- */}
          <div className="lg:col-span-3 flex flex-col space-y-6 h-full">
            {/* By Severity (Level) */}
            <div className="bg-white p-6 rounded-xl shadow-sm h-[340px]">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">NÍVEL SUPORTE (NOV)</h3>
               <div className="h-[260px]">
                 <LevelBarChart data={chartsData.levelData} />
               </div>
            </div>

            {/* By SLA (Open Days equivalent) */}
            <div className="bg-white p-6 rounded-xl shadow-sm flex-1 min-h-[300px]">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">SLA RESOLUÇÃO (HORAS)</h3>
               <div className="h-[240px]">
                 <SLAHistogram data={chartsData.slaData} />
               </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modals */}
      <AIReportModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Resumo Executivo (IA)"
        data={aiData}
        isLoading={isLoadingAi}
      />

      <TicketDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        ticket={selectedTicket}
      />
      
    </div>
  );
}

export default App;
