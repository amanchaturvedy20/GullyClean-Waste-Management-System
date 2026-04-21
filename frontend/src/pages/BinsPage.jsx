import React from 'react';
import BinList from '../components/bincomponents/BinList';
import { Server, MapPin } from 'lucide-react';

const BinsPage = () => {
    return (
        <div className="w-full min-h-screen relative overflow-hidden bg-[#0B1121]">
            {/* Full-screen Background Image & Overlay */}
            <div className="fixed inset-0 z-0">
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop")' }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#0B1121]/90 via-[#0B1121]/80 to-[#131B2F]/95"></div>
                
                {/* Soft glowing orbs */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3"></div>
            </div>
            
            <div className="relative z-10 pt-20 pb-12 px-4 shadow-2xl mb-12 border-b border-white/5 bg-white/5 backdrop-blur-sm">
                
                <div className="max-w-[1400px] mx-auto flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-6 border border-white/20">
                        <Server size={36} className="text-emerald-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 flex items-center gap-3">
                        City Smart Bins
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 font-medium max-w-2xl flex items-center justify-center gap-2 drop-shadow-md">
                        <MapPin size={20} className="text-emerald-400" /> Live overview of network status and hardware.
                    </p>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 lg:px-6 relative z-10 pb-20">
                <BinList />
            </div>
        </div>
    );
};

export default BinsPage;