import React from 'react';
import { Customer, HealthStatus } from '../types';
import { MoreHorizontal, AlertCircle, CheckCircle, AlertTriangle, Wand2 } from 'lucide-react';

interface CustomerTableProps {
  customers: Customer[];
  onAnalyze: (customer: Customer) => void;
}

const CustomerTable: React.FC<CustomerTableProps> = ({ customers, onAnalyze }) => {
  
  const getStatusBadge = (status: HealthStatus) => {
    switch (status) {
      case HealthStatus.HEALTHY:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle size={12} className="mr-1"/> Healthy</span>;
      case HealthStatus.WARNING:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><AlertTriangle size={12} className="mr-1"/> Warning</span>;
      case HealthStatus.CRITICAL:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><AlertCircle size={12} className="mr-1"/> Critical</span>;
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Accounts at Risk & Watchlist</h3>
        <button className="text-sm text-indigo-600 font-medium hover:text-indigo-800">View All Accounts</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Health</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ARR</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Open Tickets</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">CSM</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img className="h-8 w-8 rounded-full object-cover mr-3" src={customer.logo} alt={customer.name} />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                      <div className="text-xs text-gray-500">{customer.plan}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(customer.status)}
                  <div className="text-xs text-gray-400 mt-1">Score: {customer.healthScore}/100</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatCurrency(customer.arr)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${customer.openTickets > 5 ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                     {customer.openTickets}
                   </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {customer.csm}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => onAnalyze(customer)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3 inline-flex items-center transition-colors"
                    title="Analyze with AI"
                  >
                    <Wand2 size={16} className="mr-1" /> Analyze
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerTable;