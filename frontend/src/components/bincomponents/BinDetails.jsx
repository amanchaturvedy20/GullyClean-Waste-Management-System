import React from 'react';
import { MapPin, BatteryFull, BatteryMedium, Battery, Clock, Calendar, Navigation, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const BinDetails = ({ bin }) => {
    
    const getStatusConfig = (status) => {
        switch(status) {
          case 'empty':
            return { 
              bg: 'bg-emerald-500/10', 
              border: 'border-emerald-500/20',
              text: 'text-emerald-700', 
              dot: 'bg-emerald-500',
              label: 'Empty', 
              icon: <Battery size={24} className="text-emerald-600"/>,
            };
          case 'half-full':
            return { 
              bg: 'bg-amber-500/10', 
              border: 'border-amber-500/20',
              text: 'text-amber-700', 
              dot: 'bg-amber-500',
              label: 'Half Full', 
              icon: <BatteryMedium size={24} className="text-amber-600"/>,
            };
          case 'full':
            return { 
              bg: 'bg-red-500/10', 
              border: 'border-red-500/20',
              text: 'text-red-700', 
              dot: 'bg-red-500',
              label: 'Full', 
              icon: <BatteryFull size={24} className="text-red-600"/>,
              urgent: true
            };
          case 'requested':
            return { 
              bg: 'bg-[#F58AED]/10', 
              border: 'border-[#F58AED]/20',
              text: 'text-[#F58AED]', 
              dot: 'bg-[#F58AED]',
              label: 'Requested', 
              icon: <Trash2 size={24} color="#F58AED"/>,
              urgent: true
            };
          default:
            return { 
              bg: 'bg-gray-500/10', 
              border: 'border-gray-500/20',
              text: 'text-gray-700', 
              dot: 'bg-gray-500',
              label: 'Unknown', 
              icon: <Battery size={24} className="text-gray-600"/>,
            };
        }
    };

    const statusConfig = getStatusConfig(bin.status);

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden relative">
                
                {/* Header Graphic */}
                <div className="h-48 bg-gray-900 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600 to-teal-500 opacity-90"></div>
                    <div className="absolute inset-0 bg-black/20 mix-blend-overlay"></div>
                    
                    {/* Abstract Shapes */}
                    <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-100px] left-[-20px] w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                    
                    <div className="absolute top-1/2 -translate-y-1/2 left-8 flex items-center gap-6">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl flex items-center justify-center shadow-2xl text-white">
                            <Trash2 size={40} strokeWidth={1.5} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white uppercase tracking-wider border border-white/30">
                                    Smart Bin
                                </span>
                            </div>
                            <h2 className="text-4xl font-black text-white tracking-tight drop-shadow-md">
                                #{bin.binId.toUpperCase()}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    
                    {/* Location Info */}
                    <div className="flex items-center gap-4 mb-8 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                        <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                            <MapPin className="text-emerald-500" size={24} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Precise Location</h3>
                            <p className="text-xl font-bold text-gray-900">{bin.location}</p>
                        </div>
                    </div>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        {/* Status Stat */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex items-start gap-5">
                            <div className={`w-14 h-14 rounded-2xl flex flex-shrink-0 items-center justify-center ${statusConfig.bg} border ${statusConfig.border}`}>
                                {statusConfig.icon}
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Current Status</h3>
                                <div className="flex items-center gap-2">
                                    <h4 className={`text-2xl font-black ${statusConfig.text}`}>{statusConfig.label}</h4>
                                    {statusConfig.urgent && (
                                        <span className="relative flex h-3 w-3 ml-2">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Last Emptied Stat */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex items-start gap-5">
                            <div className="w-14 h-14 rounded-2xl flex flex-shrink-0 items-center justify-center bg-blue-50 border border-blue-100 text-blue-600">
                                <Clock size={24} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Last Emptied</h3>
                                <h4 className="text-xl font-bold text-gray-900 leading-tight">
                                    {bin.lastEmptied ? (
                                        <>
                                            {new Date(bin.lastEmptied).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            <span className="block text-base font-semibold text-gray-500 mt-1">
                                                {new Date(bin.lastEmptied).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </>
                                    ) : 'Never'}
                                </h4>
                            </div>
                        </div>
                    </div>

                    {/* Action Area */}
                    {statusConfig.label !== 'Requested' && (
                        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-end items-center gap-4">
                            <p className="text-sm text-gray-500 font-medium sm:mr-auto">Notice an issue with this bin? Let us know.</p>
                            <Link 
                                to={`/request-pickup?binId=${bin.binId || bin._id.substring(18)}&location=${encodeURIComponent(bin.location)}`} 
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 group"
                            >
                                Request Pickup Here
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    )}
                    {statusConfig.label === 'Requested' && (
                        <div className="pt-6 border-t border-gray-100 flex justify-center items-center">
                            <p className="w-full text-center text-sm text-[#F58AED] font-bold bg-[#F58AED]/10 px-6 py-4 rounded-xl border border-[#F58AED]/20">
                                A pickup has already been requested for this bin.
                            </p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default BinDetails;