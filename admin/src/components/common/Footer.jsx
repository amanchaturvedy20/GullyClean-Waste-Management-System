import React from 'react';
import { ShieldCheck, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-auto text-slate-300">
      <div className="max-w-[1400px] mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand & Description */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white leading-none">GullyClean</h2>
                <p className="text-xs text-emerald-400 mt-1 font-medium tracking-wider uppercase">Enterprise Admin</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering municipalities with data-driven waste management infrastructure to build smarter, cleaner, and more sustainable cities.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors duration-300"><Twitter size={16} /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors duration-300"><Linkedin size={16} /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors duration-300"><Facebook size={16} /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors duration-300"><Instagram size={16} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Operations</h3>
            <ul className="space-y-3.5">
              <li><a href="#" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors inline-block">Dashboard Overview</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors inline-block">Bin Infrastructure</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors inline-block">System Analytics</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors inline-block">Audit Logs</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Command Center</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-400 leading-relaxed">Level 4, City Tech Park,<br/>Smart City Avenue, 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-emerald-500 shrink-0" />
                <span className="text-sm text-slate-400">+1 (800) 555-0199</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-emerald-500 shrink-0" />
                <span className="text-sm text-slate-400">admin@gullyclean.dev</span>
              </li>
            </ul>
          </div>

          {/* Command Center Info */}
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm self-start">
            <h3 className="text-white font-bold mb-2">Secure Access Area</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              This portal is restricted to authorized GullyClean administrative personnel only.
            </p>
          </div>

        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-[1400px] mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} GullyClean Systems Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-slate-500 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
