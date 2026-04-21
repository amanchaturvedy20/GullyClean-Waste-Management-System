import React from 'react';
import { Recycle, Mail, Phone, MapPin, Heart, Twitter, Facebook, Instagram, Linkedin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative bg-gray-900 pt-20 pb-10 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="flex items-center gap-3 inline-block">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-500/20">
                <Recycle className="text-white w-7 h-7" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold tracking-tight text-white">
                  Gully Clean
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Smart City Waste
                </span>
              </div>
            </Link>
            <p className="text-gray-400 leading-relaxed max-w-sm">
              Empowering communities with smart waste management solutions. Join us in building cleaner, healthier, and more sustainable cities for future generations.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-white transition-all duration-300 transform hover:-translate-y-1">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-white transition-all duration-300 transform hover:-translate-y-1">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-white transition-all duration-300 transform hover:-translate-y-1">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-white transition-all duration-300 transform hover:-translate-y-1">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 lg:col-start-6">
            <h3 className="text-white font-semibold uppercase tracking-wider mb-6">Services</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/bins" className="group flex items-center text-gray-400 hover:text-emerald-400 transition-colors">
                  <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 mr-2 transition-all duration-300" />
                  Bin Monitoring
                </Link>
              </li>
              <li>
                <Link to="/request-pickup" className="group flex items-center text-gray-400 hover:text-emerald-400 transition-colors">
                  <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 mr-2 transition-all duration-300" />
                  Request a Pickup
                </Link>
              </li>
              <li>
                <a href="#" className="group flex items-center text-gray-400 hover:text-emerald-400 transition-colors">
                  <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 mr-2 transition-all duration-300" />
                  Route Optimization
                </a>
              </li>
              <li>
                <a href="#" className="group flex items-center text-gray-400 hover:text-emerald-400 transition-colors">
                  <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 mr-2 transition-all duration-300" />
                  Waste Analytics
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold uppercase tracking-wider mb-6">Company</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">About Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Careers</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2">
                  Blog <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">NEW</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Press</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold uppercase tracking-wider mb-6">Contact</h3>
            <ul className="space-y-4">
              <li>
                <a href="mailto:support@gullyclean.com" className="group flex items-start gap-3 text-gray-400 hover:text-white transition-colors">
                  <Mail size={18} className="text-emerald-500 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span>support@gullyclean.com</span>
                </a>
              </li>
              <li>
                <a href="tel:+11234567890" className="group flex items-start gap-3 text-gray-400 hover:text-white transition-colors">
                  <Phone size={18} className="text-emerald-500 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span>+1 (123) 456-7890</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-gray-400">
                  <MapPin size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>123 Eco Avenue,<br/>Green City, Earth 90210</span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm flex items-center gap-1.5">
            © {new Date().getFullYear()} Gully Clean Inc. Made with <Heart size={14} className="text-red-500 animate-pulse" /> for a greener planet.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;