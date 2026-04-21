import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import BinList from '../components/bincomponents/BinList';
import { ArrowRight, CheckCircle, Map, Truck, TrendingUp, Users, Star, Sparkles, Trash2, Leaf, Target, Shield, Recycle } from 'lucide-react';

const HomePage = () => {
  const { user } = useSelector(state => state.auth);
  const [animated, setAnimated] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);

  useEffect(() => {
    setAnimated(true);
    const interval = setInterval(() => {
      setCurrentStat(prev => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { icon: <Trash2 className="text-emerald-500" />, value: "250+", label: "Smart Bins", color: "from-emerald-400 to-teal-500" },
    { icon: <Users className="text-blue-500" />, value: "5k+", label: "Eco Citizens", color: "from-blue-400 to-cyan-500" },
    { icon: <TrendingUp className="text-purple-500" />, value: "85%", label: "Faster Pickups", color: "from-purple-400 to-indigo-500" },
    { icon: <Recycle className="text-orange-500" />, value: "10k", label: "Tons Recycled", color: "from-orange-400 to-red-500" }
  ];

  const features = [
    {
      icon: <Map className="text-white" size={28} />,
      title: "Real-time Monitoring",
      description: "Live tracking of bin fill levels across the city with instant mapped updates.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Truck className="text-white" size={28} />,
      title: "Smart Routing",
      description: "AI-optimized collection routes to save time, fuel, and reduce urban emissions.",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: <Shield className="text-white" size={28} />,
      title: "Community Driven",
      description: "Join thousands of citizens actively keeping our city clean, green, and healthy.",
      gradient: "from-purple-500 to-indigo-500"
    }
  ];

  return (
    <div className="min-h-screen bg-white selection:bg-emerald-500/20">
      
      {/* 1. Hero Section */}
      <section className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=2000" 
            alt="Clean City" 
            className="w-full h-full object-cover object-center scale-105 transform origin-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/60 to-gray-900/90 backdrop-blur-sm"></div>
        </div>

        {/* Floating Orbs for depth */}
        <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-[80px] animate-pulse"></div>
          <div className="absolute bottom-1/4 -right-10 w-72 h-72 bg-teal-500/20 rounded-full blur-[80px] animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center text-white">
          <div className={`space-y-8 transition-all duration-1000 transform ${animated ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 shadow-xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <Sparkles className="text-emerald-400 w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium tracking-wide">
                Join 5,000+ Eco-Citizens Today
              </span>
            </div>

            {/* Huge Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight leading-[1.1]">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300">
                Smarter Waste.
              </span>
              <br />
              <span className="text-white drop-shadow-xl">
                Cleaner City.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light drop-shadow-md">
              A community-driven revolution in waste management. Report full bins, request instant pickups, and build a sustainable future together.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              {user ? (
                <Link 
                  to="/request-pickup" 
                  className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-gray-900 bg-white rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-100 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Truck className="relative z-10 w-5 h-5 text-emerald-600" />
                  <span className="relative z-10">Request Pickup</span>
                  <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <Link 
                  to="/signup" 
                  className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_-5px_rgba(16,185,129,0.5)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Sparkles className="relative z-10 w-5 h-5" />
                  <span className="relative z-10">Start Tracking Free</span>
                  <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
              <Link 
                to="/bins" 
                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border border-white/30 rounded-full hover:bg-white/10 backdrop-blur-sm transition-all"
              >
                Explore Map
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-default">
          <span className="text-xs uppercase tracking-[0.2em] text-white">Scroll</span>
          <div className="w-0.5 h-12 bg-white/20 overflow-hidden relative">
            <div className="absolute top-0 w-full h-1/2 bg-white animate-[scroll_2s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </section>

      {/* 2. Impact Stats Section */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
              Making a Real <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Impact</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our intelligent routing and community-driven reporting have drastically reduced urban waste overflow. 
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="group relative bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(16,185,129,0.12)] border border-gray-100/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              >
                <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 rounded-full blur-2xl transition-opacity duration-500`}></div>
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} bg-opacity-10 mb-6 shadow-sm`}>
                  <div className="bg-white p-2.5 rounded-xl shadow-sm">
                    {React.cloneElement(stat.icon, { className: 'w-6 h-6' })}
                  </div>
                </div>
                <h3 className="text-4xl font-black text-gray-900 mb-2">{stat.value}</h3>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                
                {/* Active indicator line */}
                <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${stat.color} transition-all duration-700 ${currentStat === index ? 'w-full' : 'w-0'}`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5">
              <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
                Why Choose <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
                  Gully Clean?
                </span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                We combine cutting-edge technology with community power to create the most effective, transparent, and sustainable waste management solution available today.
              </p>
              <Link to="/bins" className="inline-flex items-center gap-2 font-bold text-emerald-600 hover:text-emerald-700 group">
                See it in action 
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`relative p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 group ${index === 2 ? 'sm:col-span-2 sm:w-1/2 sm:mx-auto' : ''}`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br ${feature.gradient} shadow-lg transform group-hover:scale-110 transition-transform`}>
                    {React.cloneElement(feature.icon, { className: "w-6 h-6 text-white" })}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Live Bin Status Map Demo */}
      <section className="py-32 bg-gray-900 relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900 via-gray-900 to-gray-900"></div>
        <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
                Live City Map
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed">
                Real-time monitoring of smart bins across the city. Help us track overflows and ensure rapid response times.
              </p>
            </div>
            <Link 
              to="/bins" 
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md transition-colors border border-white/10 font-medium whitespace-nowrap"
            >
              <Map size={18} /> Open Full Map
            </Link>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-2 sm:p-6 shadow-2xl">
            {/* Reusing the BinList component but making it look premium in dark mode context */}
            <div className="opacity-90 hover:opacity-100 transition-opacity">
               <BinList limit={3} />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Final CTA */}
      <section className="py-24 bg-white relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            {/* Solid Background for readability */}
            <div className="absolute inset-0 bg-teal-900"></div>
            {/* Abstract shapes */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-black/10 rounded-full blur-3xl"></div>
            
            <div className="relative p-12 sm:p-16 text-center text-white">
              <h2 className="text-3xl sm:text-5xl font-black mb-6 tracking-tight">
                Ready to Make a Difference?
              </h2>
              <p className="text-lg sm:text-xl font-medium text-emerald-50 max-w-2xl mx-auto mb-10 leading-relaxed">
                Join thousands of proactive residents transforming urban cleanliness. It takes less than 30 seconds to join.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user ? (
                  <Link 
                    to="/request-pickup" 
                    className="inline-flex items-center justify-center gap-2 bg-white text-emerald-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all w-full sm:w-auto"
                  >
                    <Truck size={20} /> Request Pickup
                  </Link>
                ) : (
                  <Link 
                    to="/signup" 
                    className="inline-flex items-center justify-center gap-2 bg-white text-emerald-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all w-full sm:w-auto"
                  >
                    <Sparkles size={20} /> Create Free Account
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default HomePage;