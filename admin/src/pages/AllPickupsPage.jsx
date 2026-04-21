import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';
import { Activity, Search, ArrowLeft, Trash2, Clock, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const map = {
    completed: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    pending:   'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    requested: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    assigned:  'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${map[status] || 'bg-gray-100 text-gray-600 ring-1 ring-gray-200'}`}>
      {status}
    </span>
  );
};

const AllPickupsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pickups, setPickups]       = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    const fetchPickups = async () => {
      try {
        const { data } = await api.get('/pickups');
        setPickups(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch pickups', err);
        setLoading(false);
      }
    };
    fetchPickups();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium text-sm">Loading pickups…</p>
        </div>
      </div>
    );
  }

  const filteredPickups = pickups.filter(p =>
    p.assignedTo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.bin?.binId?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <Activity className="w-4 h-4 text-emerald-500" />
          <h1 className="text-base font-bold text-slate-800">All Pickup Actions</h1>
          <span className="ml-auto text-xs text-slate-400">{filteredPickups.length} records</span>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-6 space-y-5">

        {/* Search */}
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 shadow-sm max-w-lg">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by operator, bin ID, or location…"
            className="flex-1 py-3 text-sm bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {filteredPickups.length === 0 ? (
            <div className="text-center py-16">
              <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-400">No pickups found</p>
              <p className="text-xs text-slate-300 mt-1">Try adjusting your search.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {/* Column headers */}
              <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 bg-slate-50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <div className="col-span-1"></div>
                <div className="col-span-4">Operator / Request</div>
                <div className="col-span-4">Location</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1 text-right">Updated</div>
              </div>

              {filteredPickups.map((activity) => (
                <div key={activity._id} className="sm:grid sm:grid-cols-12 sm:gap-4 flex flex-col gap-2 px-5 py-4 hover:bg-slate-50 transition-colors items-center">
                  {/* Icon */}
                  <div className="col-span-1 hidden sm:flex">
                    <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center">
                      {activity.status === 'completed'
                        ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        : <Clock className="w-4 h-4 text-amber-500" />
                      }
                    </div>
                  </div>

                  {/* Operator */}
                  <div className="col-span-4">
                    <p className="text-sm font-semibold text-slate-800">
                      {activity.status === 'pending' ? 'Unassigned Request' : (activity.assignedTo?.name || 'Unknown Operator')}
                    </p>
                    {activity.bin?.binId && (
                      <p className="text-xs text-slate-400 font-mono mt-0.5">BIN: {activity.bin.binId}</p>
                    )}
                  </div>

                  {/* Location */}
                  <div className="col-span-4">
                    <p className="text-sm text-slate-600 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{activity.location || activity.bin?.location || 'Unknown Location'}</span>
                    </p>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <StatusBadge status={activity.status} />
                  </div>

                  {/* Time */}
                  <div className="col-span-1 text-right">
                    <p className="text-xs text-slate-400">{new Date(activity.updatedAt).toLocaleDateString()}</p>
                    <p className="text-xs text-slate-300">{new Date(activity.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default AllPickupsPage;
