// src/components/admin/AdminDashboard.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBins } from '../../store/binSlice';
import { fetchPickups } from '../../store/pickupSlice';
import { Trash2, MapPin, ClipboardList, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { bins, status: binsStatus } = useSelector((state) => state.bin);
  const { list: pickups, status: pickupsStatus } = useSelector((state) => state.pickup);

  // Fetch data on mount
  useEffect(() => {
    if (binsStatus === 'idle') dispatch(fetchBins());
    if (pickupsStatus === 'idle') dispatch(fetchPickups());
  }, [binsStatus, pickupsStatus, dispatch]);

  // Compute stats
  const totalBins = bins.length;
  const fullBins = bins.filter((b) => b.status === 'full').length;
  const pendingPickups = pickups.filter((p) => p.status === 'pending').length;
  const workersCount = useSelector((state) => state.auth.workers?.length || 0);

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Stat Card 1 */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center space-x-5 group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
             <Trash2 className="text-emerald-500" size={28} strokeWidth={2} />
          </div>
          <div>
            <p className="text-3xl font-black text-gray-900 leading-none mb-1">{totalBins}</p>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Bins</p>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center space-x-5 group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1">
          <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
             <MapPin className="text-red-500" size={28} strokeWidth={2} />
          </div>
          <div>
            <p className="text-3xl font-black text-gray-900 leading-none mb-1">{fullBins}</p>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Full Bins</p>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center space-x-5 group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
             <ClipboardList className="text-blue-500" size={28} strokeWidth={2} />
          </div>
          <div>
            <p className="text-3xl font-black text-gray-900 leading-none mb-1">{pendingPickups}</p>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Pending Pickups</p>
          </div>
        </div>

        {/* Stat Card 4 */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center space-x-5 group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
             <Users className="text-purple-500" size={28} strokeWidth={2} />
          </div>
          <div>
            <p className="text-3xl font-black text-gray-900 leading-none mb-1">{workersCount}</p>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Workers</p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/admin/bins" className="group flex items-center justify-between p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-500 border border-emerald-100 hover:border-emerald-600 transition-all duration-300">
              <span className="font-bold text-emerald-700 group-hover:text-white transition-colors">Manage Bins</span>
              <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center text-emerald-600 group-hover:bg-white/20 group-hover:text-white transition-colors">
                  <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
            
            <Link to="/admin/assignments" className="group flex items-center justify-between p-4 rounded-2xl bg-blue-50 hover:bg-blue-500 border border-blue-100 hover:border-blue-600 transition-all duration-300">
              <span className="font-bold text-blue-700 group-hover:text-white transition-colors">Assign Pickups</span>
              <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center text-blue-600 group-hover:bg-white/20 group-hover:text-white transition-colors">
                  <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
            
            <Link to="/admin/users" className="group flex items-center justify-between p-4 rounded-2xl bg-amber-50 hover:bg-amber-500 border border-amber-100 hover:border-amber-600 transition-all duration-300">
              <span className="font-bold text-amber-700 group-hover:text-white transition-colors">Manage Users</span>
              <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center text-amber-600 group-hover:bg-white/20 group-hover:text-white transition-colors">
                  <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
        </div>
      </div>
    </div>
  );
}
