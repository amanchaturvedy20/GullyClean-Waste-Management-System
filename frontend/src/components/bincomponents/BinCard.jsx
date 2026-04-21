import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Battery, BatteryFull, BatteryMedium, Calendar, Trash2 } from 'lucide-react';

const BinCard = ({ bin }) => {
  const getStatusConfig = (status) => {
    switch(status) {
      case 'empty':
        return { 
          bg: 'bg-emerald-500/10', 
          border: 'border-emerald-500/20',
          text: 'text-emerald-700', 
          dot: 'bg-emerald-500',
          label: 'Empty', 
          icon: <Battery size={16} className="text-emerald-600"/>,
          gradient: 'from-emerald-500/5 to-transparent'
        };
      case 'half-full':
        return { 
          bg: 'bg-amber-500/10', 
          border: 'border-amber-500/20',
          text: 'text-amber-700', 
          dot: 'bg-amber-500',
          label: 'Half Full', 
          icon: <BatteryMedium size={16} className="text-amber-600"/>,
          gradient: 'from-amber-500/5 to-transparent'
        };
      case 'full':
        return { 
          bg: 'bg-red-500/10', 
          border: 'border-red-500/20',
          text: 'text-red-700', 
          dot: 'bg-red-500',
          label: 'Full', 
          icon: <BatteryFull size={16} className="text-red-600"/>,
          gradient: 'from-red-500/5 to-transparent',
          urgent: true
        };
      case 'requested':
        return { 
          bg: 'bg-[#F58AED]/10', 
          border: 'border-[#F58AED]/20',
          text: 'text-[#F58AED]', 
          dot: 'bg-[#F58AED]',
          label: 'Requested', 
          icon: <Trash2 size={16} color="#F58AED"/>,
          gradient: 'from-[#F58AED]/5 to-transparent',
          urgent: true
        };
      default:
        return { 
          bg: 'bg-gray-500/10', 
          border: 'border-gray-500/20',
          text: 'text-gray-700', 
          dot: 'bg-gray-500',
          label: 'Unknown', 
          icon: <Battery size={16} className="text-gray-600"/>,
          gradient: 'from-gray-500/5 to-transparent'
        };
    }
  };

  const statusConfig = getStatusConfig(bin.status);

  return (
    <div className={`group relative bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 transition-all duration-300 hover:-translate-y-1`}>
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${statusConfig.gradient} opacity-50 transition-opacity group-hover:opacity-100`}></div>
      
      {/* Urgent Pulse (if full) */}
      {statusConfig.urgent && (
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500">
          <div className="absolute top-0 left-0 w-full h-full bg-red-400 animate-pulse"></div>
        </div>
      )}

      <div className="relative p-6">
        {/* Header Region */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${statusConfig.bg} ${statusConfig.border} border backdrop-blur-sm`}>
               <Trash2 className={statusConfig.text} size={24} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Smart Bin</p>
              <h3 className="font-bold text-gray-900 text-lg leading-none">#{(bin.binId || bin._id.substring(18)).toUpperCase()}</h3>
            </div>
          </div>
          
          {/* Status Pill */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${statusConfig.bg} ${statusConfig.border}`}>
            <div className={`w-2 h-2 rounded-full ${statusConfig.dot} ${statusConfig.urgent ? 'animate-pulse' : ''}`}></div>
            <span className={`text-xs font-bold uppercase tracking-wider ${statusConfig.text}`}>
              {statusConfig.label}
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 w-6 flex justify-center">
              <MapPin size={18} className="text-emerald-500" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Location</p>
              <p className="text-sm font-medium text-gray-900 leading-snug">{bin.location}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="mt-0.5 w-6 flex justify-center">
              <Calendar size={18} className="text-blue-500" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Last Emptied</p>
              <p className="text-sm font-medium text-gray-900">
                {bin.lastEmptied ? new Date(bin.lastEmptied).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Never'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Bottom */}
        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <Link 
            to={`/bins/${bin._id}`} 
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors group/link"
          >
            View Details
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center group-hover/link:bg-emerald-100 transition-colors">
              <ArrowRight size={16} className="group-hover/link:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BinCard;