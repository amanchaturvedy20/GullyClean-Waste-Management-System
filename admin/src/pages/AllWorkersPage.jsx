import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import adminService from '../services/adminService';
import { Link } from 'react-router-dom';
import { Users, Search, ArrowLeft, CheckCircle2, Clock } from 'lucide-react';

const AllWorkersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: workerStats = [], isLoading } = useQuery({
    queryKey: ['adminWorkerStats'],
    queryFn: adminService.getWorkerStats,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium text-sm">Loading workers…</p>
        </div>
      </div>
    );
  }

  const filteredWorkers = workerStats.filter(ws =>
    ws.worker.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ws.worker._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">

      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center gap-3">
          <Link to="/dashboard" className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors mr-2">
            <ArrowLeft size={15} /> Back
          </Link>
          <div className="h-5 w-px bg-slate-200"></div>
          <Users className="w-4 h-4 text-emerald-500" />
          <h1 className="text-base font-bold text-slate-800">All Field Operators</h1>
          <span className="ml-auto text-xs text-slate-400">{filteredWorkers.length} operators</span>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-6 space-y-5">

        {/* Search */}
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 shadow-sm max-w-lg">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by name or ID…"
            className="flex-1 py-3 text-sm bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Workers Grid */}
        {filteredWorkers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm text-center py-16">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-400">No operators found</p>
            <p className="text-xs text-slate-300 mt-1">Try adjusting your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {filteredWorkers.map((ws) => (
              <div key={ws.worker._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 flex items-center gap-5">

                {/* Avatar */}
                <div className="flex-shrink-0 relative">
                  <img
                    src={`https://ui-avatars.com/api/?name=${ws.worker.name?.replace(/\s/g, '+')}&background=e2e8f0&color=475569&bold=true&size=80`}
                    alt="worker"
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                  />
                  {/* Online Indicator */}
                  {ws.worker.isTracking && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm" title="Online (Active)"></div>
                  )}
                </div>

                {/* Name & ID */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{ws.worker.name || 'Unnamed Operator'}</p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">#{ws.worker._id.substring(0, 8)}</p>

                  {/* Mini stats row */}
                  <div className="flex gap-3 mt-3">
                    <div className="text-center">
                      <p className="text-base font-bold text-blue-600">{ws.dailyAssigned}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">Assigned today</p>
                    </div>
                    <div className="w-px bg-slate-100"></div>
                    <div className="text-center">
                      <p className="text-base font-bold text-emerald-600">{ws.dailyCompleted}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">Completed today</p>
                    </div>
                  </div>
                </div>

                {/* Total Stats */}
                <div className="flex-shrink-0 text-right space-y-2">
                  <div className="flex items-center justify-end gap-1.5">
                    <Clock className="w-3 h-3 text-blue-400" />
                    <span className="text-xs text-slate-500 font-medium">{ws.totalAssigned} total assigned</span>
                  </div>
                  <div className="flex items-center justify-end gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span className="text-xs text-slate-500 font-medium">{ws.totalCompleted} total done</span>
                  </div>
                  {ws.totalAssigned > 0 && (
                    <div className="mt-1">
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden ml-auto">
                        <div
                          className="h-full bg-emerald-400 rounded-full transition-all"
                          style={{ width: `${Math.min(100, Math.round((ws.totalCompleted / ws.totalAssigned) * 100))}%` }}
                        ></div>
                      </div>
                      <p className="text-[10px] text-slate-400 text-right mt-0.5">
                        {Math.round((ws.totalCompleted / ws.totalAssigned) * 100)}% completion
                      </p>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
};

export default AllWorkersPage;
