
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ChartData } from '../types';

const ORANGE_MAIN = '#f97316'; // Orange-500
const ORANGE_LIGHT = '#ffedd5'; // Orange-100
const SLATE_TEXT = '#94a3b8';

interface ChartProps {
  data: ChartData[];
  total?: number;
}

// Helper to calculate percentage for Tooltip
const getPercent = (value: number, total: number) => {
  if (!total) return '0%';
  return `${((value / total) * 100).toFixed(1)}%`;
};

// Custom Tooltip Style
const tooltipStyle = {
  borderRadius: '8px',
  border: 'none',
  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
  backgroundColor: '#fff',
  padding: '8px 12px',
  fontSize: '12px',
  fontWeight: 600,
  color: '#334155'
};

// 1. Severity / Level Chart (Reference: Lollipop/Stick style)
export const LevelBarChart: React.FC<ChartProps> = ({ data }) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: SLATE_TEXT, fontSize: 11, fontWeight: 600 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: SLATE_TEXT, fontSize: 11 }} />
        <Tooltip 
          cursor={{fill: 'transparent'}}
          contentStyle={tooltipStyle}
          formatter={(value: number) => [`${value} (${getPercent(value, total)})`, 'Tickets']}
        />
        <Bar dataKey="value" barSize={6} radius={[10, 10, 10, 10]}>
           {data.map((entry, index) => (
             <Cell key={`cell-${index}`} fill={ORANGE_MAIN} />
           ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

// 2. Custom Status List
export const StatusProgressChart: React.FC<ChartProps> = ({ data, total = 1 }) => {
  return (
    <div className="flex flex-col space-y-5 h-full overflow-y-auto pr-2 custom-scrollbar">
      {data.map((item, idx) => {
        const percentage = Math.round((item.value / total) * 100);
        return (
          <div key={idx} className="flex flex-col space-y-2 group cursor-default">
             <div className="flex justify-between items-end">
                <span className="text-sm font-semibold text-slate-600 group-hover:text-orange-600 transition-colors">{item.name}</span>
                <span className="text-sm font-bold text-slate-800">{item.value} <span className="text-xs text-slate-400 font-normal">({percentage}%)</span></span>
             </div>
             <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-500 group-hover:bg-orange-600" 
                  style={{ width: `${percentage}%`, backgroundColor: ORANGE_MAIN, opacity: 1 - (idx * 0.15) }}
                ></div>
             </div>
          </div>
        )
      })}
    </div>
  );
};

// 3. Top Clients (Horizontal Bars)
export const TopClientsBarChart: React.FC<ChartProps> = ({ data }) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
        <XAxis type="number" hide />
        <YAxis 
          dataKey="name" 
          type="category" 
          width={110} 
          tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} 
          interval={0} 
        />
        <Tooltip 
           contentStyle={tooltipStyle}
           cursor={{fill: '#fff7ed'}}
           formatter={(value: number) => [`${value} tickets`, 'Volume']}
           labelFormatter={(label) => `${label} (${getPercent(data.find(d => d.name === label)?.value || 0, total)})`}
        />
        <Bar dataKey="value" fill={ORANGE_MAIN} radius={[0, 4, 4, 0]} barSize={12} />
      </BarChart>
    </ResponsiveContainer>
  );
};

// 4. Categories
export const TopTagsBarChart: React.FC<ChartProps> = ({ data }) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="flex flex-col space-y-4">
      {data.map((item, idx) => {
         const percent = getPercent(item.value, total);
         return (
          <div key={idx} className="relative group cursor-help">
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 min-w-[140px] px-3 py-2 bg-slate-800 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 text-center">
                <div className="font-bold text-orange-300 mb-1 border-b border-slate-600 pb-1">{item.name}</div>
                <div className="flex justify-between items-center text-[10px] text-slate-300 px-1">
                   <span>Volume: <b className="text-white text-xs">{item.value}</b></span>
                   <span className="w-px h-3 bg-slate-600 mx-2"></span>
                   <span>Share: <b className="text-white text-xs">{percent}</b></span>
                </div>
                {/* Arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45 -mt-1"></div>
            </div>

            <div className="flex justify-between mb-1">
                <span className="text-xs font-bold text-white absolute z-10 left-3 top-1.5 drop-shadow-md pointer-events-none">{item.name}</span>
                <span className="text-xs font-bold text-slate-600 absolute right-0 top-1.5 group-hover:text-orange-600 transition-colors">
                  {item.value} <span className="text-[10px] font-normal text-slate-400">({percent})</span>
                </span>
            </div>
            <div className="h-7 w-full bg-slate-100 rounded-full overflow-hidden relative">
                <div 
                  className="h-full absolute top-0 left-0 rounded-full flex items-center transition-all duration-500 group-hover:brightness-110"
                  style={{ width: '100%', maxWidth: `${Math.max(item.value * 5, 40)}%`, backgroundColor: ORANGE_MAIN }}
                >
                </div>
            </div>
          </div>
      )})}
    </div>
  );
};

// 5. SLA Histogram (Vertical Bars)
export const SLAHistogram: React.FC<ChartProps> = ({ data }) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{top: 10}}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: SLATE_TEXT, fontSize: 10 }} dy={5} />
        <Tooltip 
          cursor={{fill: '#fff7ed'}}
          contentStyle={tooltipStyle}
          formatter={(value: number) => [`${value} (${getPercent(value, total)})`, 'Tickets']}
        />
        <Bar dataKey="value" fill="#818cf8" radius={[4, 4, 4, 4]} barSize={24}>
            {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#f59e0b' : ORANGE_MAIN} />
            ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
