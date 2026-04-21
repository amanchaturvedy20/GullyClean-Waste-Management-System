import React from 'react';
import { useDispatch } from 'react-redux';
import { adminLogout } from '../../store/authSlice';
import adminService from '../../services/adminService';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { LogOut, Users, Trash2, ShieldCheck, Activity, Target, TrendingUp, Cpu, Server, MapPin, Clock, AlertCircle, ArrowRight, CheckCircle2, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../common/Footer';

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

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: adminService.getAdminStats,
  });

  const { data: workerStats = [], isLoading: workersLoading } = useQuery({
    queryKey: ['adminWorkerStats'],
    queryFn: adminService.getWorkerStats,
  });

  const loading = statsLoading || workersLoading;

  const handleLogout = () => {
    dispatch(adminLogout());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium text-sm">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  const userRoleData = [
    { name: 'Citizens', value: stats?.users?.citizens || 0 },
    { name: 'Workers',  value: stats?.users?.workers  || 0 },
    { name: 'Admins',   value: (stats?.users?.total || 0) - ((stats?.users?.citizens || 0) + (stats?.users?.workers || 0)) }
  ];

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6'];

  const binStatusData = [
    { name: 'Empty',     count: stats?.bins?.empty     || 0 },
    { name: 'Requested', count: stats?.bins?.requested || 0 }
  ];

  const recentActivityPreview = stats?.recentActivity?.slice(0, 5) || [];
  const workerStatsPreview    = workerStats?.slice(0, 4) || [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">

      {/* Enterprise Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 shadow-lg">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-400/30">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight leading-none">GullyClean</h1>
              <p className="text-[11px] text-emerald-400 mt-1 font-bold uppercase tracking-widest">Admin Command Center</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2.5 px-4 py-2 bg-slate-800/80 border border-slate-700 rounded-full">
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </div>
              <span className="text-xs font-bold text-slate-300 tracking-wide">SYSTEM SECURE</span>
            </div>
            <div className="h-8 w-px bg-slate-700 hidden sm:block"></div>
            <button
              onClick={handleLogout}
              className="group flex items-center gap-2.5 px-5 py-2.5 bg-slate-800 hover:bg-rose-500/10 hover:text-rose-400 rounded-xl text-sm font-bold transition-all border border-slate-700 hover:border-rose-500/30 text-slate-300"
            >
              <LogOut size={16} className="text-slate-400 group-hover:text-rose-400 transition-colors" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">

        {/* Page Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
              <p className="text-sm text-slate-500 mt-0.5">City operations and workforce metrics at a glance.</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 font-medium">{new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Total Users */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">All Users</span>
            </div>
            <p className="text-4xl font-bold text-slate-800 mb-1">{stats?.users?.total || 0}</p>
            <p className="text-sm text-slate-500 mb-4">Registered users</p>
            <div className="flex gap-2 text-xs">
              <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">{stats?.users?.citizens || 0} Citizens</span>
              <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">{stats?.users?.workers || 0} Workers</span>
            </div>
          </div>

          {/* Total Bins */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">Infrastructure</span>
            </div>
            <p className="text-4xl font-bold text-slate-800 mb-1">{stats?.bins?.total || 0}</p>
            <p className="text-sm text-slate-500 mb-4">Smart bins deployed</p>
            <div className="flex gap-2 text-xs">
              <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-medium">{stats?.bins?.empty || 0} Available</span>
              <span className="bg-red-50 text-red-600 px-2.5 py-1 rounded-full font-medium">{(stats?.bins?.full || 0) + (stats?.bins?.overflowing || 0)} Critical</span>
            </div>
          </div>

          {/* Pending Pickups */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-amber-500" />
              </div>
              <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">Pickups</span>
            </div>
            <p className="text-4xl font-bold text-slate-800 mb-1">{stats?.pickups?.pending || 0}</p>
            <p className="text-sm text-slate-500 mb-4">Pending operations</p>
            <div className="flex gap-2 text-xs">
              <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                <CheckCircle2 size={11} /> {stats?.pickups?.completed || 0} Completed
              </span>
            </div>
          </div>

        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Pie Chart */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Cpu className="w-5 h-5 text-slate-400" />
              <h3 className="text-base font-semibold text-slate-700">User Role Distribution</h3>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userRoleData}
                    cx="50%" cy="50%"
                    innerRadius={70} outerRadius={105}
                    paddingAngle={6}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={6}
                  >
                    {userRoleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '0.75rem', fontSize: '13px', fontWeight: 600, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '16px', fontWeight: 600, color: '#64748b', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-slate-400" />
              <h3 className="text-base font-semibold text-slate-700">Bin Infrastructure Status</h3>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={binStatusData} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} tick={{ fontWeight: 600, fontSize: 12 }} dy={8} />
                  <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} tick={{ fontWeight: 600, fontSize: 12 }} dx={-4} />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '0.75rem', fontSize: '13px', fontWeight: 600, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={60}>
                    {binStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.name === 'Requested' ? '#f59e0b' : '#10b981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Recent Pickups Activity */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-800">Recent Pickup Activity</h3>
                <p className="text-xs text-slate-400">Latest 5 operations</p>
              </div>
            </div>
            <Link to="/dashboard/pickups" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 transition-colors">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {recentActivityPreview.length === 0 ? (
              <div className="text-center py-14">
                <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-400">No recent activity yet</p>
                <p className="text-xs text-slate-300 mt-1">Pickup actions will appear here.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentActivityPreview.map((activity) => (
                  <div key={activity._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3 mb-2 sm:mb-0">
                      <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        {activity.status === 'completed'
                          ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          : <Clock className="w-4 h-4 text-amber-500" />
                        }
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {activity.status === 'pending' ? 'Unassigned Request' : (activity.assignedTo?.name || 'Unknown Operator')}
                        </p>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {activity.location || activity.bin?.location || 'Unknown Location'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pl-12 sm:pl-0">
                      <StatusBadge status={activity.status} />
                      <span className="text-xs text-slate-400">{new Date(activity.updatedAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Workers Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-800">Field Operators</h3>
                <p className="text-xs text-slate-400">{workerStats.length} workers registered</p>
              </div>
            </div>
            <Link to="/dashboard/workers" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 transition-colors">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {workerStatsPreview.map((ws) => (
              <div key={ws.worker._id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-center gap-5">
                
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

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{ws.worker.name || 'Unnamed Operator'}</p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">#{ws.worker._id.substring(0, 8)}</p>
                </div>

                {/* Stats */}
                <div className="flex gap-4 text-center flex-shrink-0">
                  <div>
                    <p className="text-xl font-bold text-blue-600">{ws.dailyAssigned}</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Assigned</p>
                    <p className="text-xs text-slate-300 mt-0.5">{ws.totalAssigned} total</p>
                  </div>
                  <div className="w-px bg-slate-100"></div>
                  <div>
                    <p className="text-xl font-bold text-emerald-600">{ws.dailyCompleted}</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Done</p>
                    <p className="text-xs text-slate-300 mt-0.5">{ws.totalCompleted} total</p>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
