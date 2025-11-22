
import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  trend?: number;
  invertTrend?: boolean;
  color?: 'orange' | 'blue' | 'green' | 'purple';
  isMain?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  subValue, 
  trend, 
  invertTrend = false,
  color = 'orange',
  isMain = false
}) => {
  // Logic for Trend Color (InvertTrend means lower is better, e.g. SLA)
  let isPositive = trend && trend >= 0;
  if (invertTrend && trend !== undefined) {
    isPositive = trend <= 0;
  }
  
  const trendColor = isPositive ? 'text-green-500' : 'text-red-500';
  const TrendIcon = (trend && trend >= 0) ? ArrowUp : ArrowDown;

  // Mini bar simulation
  const renderMiniBars = () => (
    <div className="flex items-end space-x-1 h-8 ml-4 opacity-50">
      <div className={`w-1 bg-${color === 'orange' ? 'orange' : 'slate'}-400 h-[40%] rounded-t-sm`}></div>
      <div className={`w-1 bg-${color === 'orange' ? 'orange' : 'slate'}-400 h-[70%] rounded-t-sm`}></div>
      <div className={`w-1 bg-${color === 'orange' ? 'orange' : 'slate'}-400 h-[50%] rounded-t-sm`}></div>
      <div className={`w-1 bg-${color === 'orange' ? 'orange' : 'slate'}-500 h-[100%] rounded-t-sm`}></div>
    </div>
  );

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm flex items-stretch relative overflow-hidden group hover:shadow-md transition-shadow border border-slate-100">
       {/* Left Indicator Line */}
       {isMain && <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>}
       
       <div className="flex-1 flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 truncate">{title}</h3>
          <div className="flex items-center justify-between">
             <div>
                <span className="text-2xl font-bold text-slate-800 block tracking-tight">{value}</span>
                {subValue && <span className="text-[11px] text-slate-400 font-medium mt-1 block uppercase">{subValue}</span>}
             </div>
             {/* Right side mini chart visual - Optional based on space */}
             {isMain && renderMiniBars()}
          </div>
       </div>

       {/* Vertical Divider (Trend) */}
       {trend !== undefined && (
          <div className="border-l border-slate-100 ml-4 pl-4 flex flex-col justify-center items-center">
             <span className={`flex items-center text-xs font-bold ${trendColor}`}>
                <TrendIcon size={12} className="mr-0.5" />
                {Math.abs(trend)}%
             </span>
          </div>
       )}
    </div>
  );
};

export default MetricCard;
