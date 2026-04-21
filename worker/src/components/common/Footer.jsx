import React from 'react';
import { HardHat, Phone, MapPin, LifeBuoy, FileText, AlertTriangle } from 'lucide-react';
import InstallPWA from './InstallPWA';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8">
          
          {/* Brand & Identity */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <HardHat className="text-white w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white leading-none">GullyClean</h2>
                <p className="text-xs text-blue-400 mt-1 font-semibold tracking-wider uppercase">Worker Operations</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              The central portal for field operators and logistics teams. Your safety and efficiency drive our city forward.
            </p>
          </div>

          {/* Dispatch Info */}
          <div>
            <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Dispatch Center</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-500 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400 leading-relaxed">Central Yard depot, Sector 4<br/>Gate B, Logistics Wing</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-blue-500 shrink-0" />
                <span className="text-sm text-gray-400">Dispatch: +1 (800) 555-0999</span>
              </li>
              <li className="flex items-center gap-3">
                <AlertTriangle size={18} className="text-orange-500 shrink-0" />
                <span className="text-sm text-orange-400 font-medium">Emergency: +1 (800) 555-9111</span>
              </li>
            </ul>
          </div>

          {/* Quick Actions & PWA */}
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              <a href="#" className="flex items-center gap-2 p-3 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors text-sm font-medium text-gray-300">
                <LifeBuoy size={16} className="text-blue-400" /> Help Desk
              </a>
              <a href="#" className="flex items-center gap-2 p-3 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors text-sm font-medium text-gray-300">
                <FileText size={16} className="text-blue-400" /> Manuals
              </a>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800 to-gray-800/50 p-6 rounded-2xl border border-gray-700">
              <h3 className="text-white font-bold mb-2">Worker App</h3>
              <p className="text-sm text-gray-400 mb-5 leading-relaxed">
                Install the portal app on your device for quick access in the field.
              </p>
              <InstallPWA />
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 font-medium">
            &copy; {new Date().getFullYear()} GullyClean Systems Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm font-medium">
            <span className="text-gray-600 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div> System Online
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
