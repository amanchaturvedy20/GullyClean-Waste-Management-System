import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { workerLogout, toggleLocationTracking } from '../../store/authSlice';
import workerService from '../../services/workerService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LogOut, MapPin, Calendar, CheckCircle, UploadCloud, X, HardHat, User, ChevronDown, Clock, Truck, TrendingUp, Camera, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import InstallPWA from '../common/InstallPWA';
import Footer from '../common/Footer';

const WorkerDashboard = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { workerUser, isLocationEnabled } = useSelector((state) => state.auth);
  
  const [selectedTask, setSelectedTask] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [currentLocationName, setCurrentLocationName] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isLocationEnabled && navigator.geolocation) {
      const fetchLocationName = () => {
         navigator.geolocation.getCurrentPosition(async (position) => {
             const { latitude, longitude } = position.coords;
             try {
                // Inform backend that we are online and tracking
                const locationRes = await workerService.updateLocation(latitude, longitude, true);
                
                // If the server auto-assigned pending pickups to us, refresh the task list
                if (locationRes?.data?.newlyAssigned > 0) {
                  queryClient.invalidateQueries({ queryKey: ['workerTasks'] });
                  queryClient.invalidateQueries({ queryKey: ['workerStats'] });
                  toast.info(`📦 ${locationRes.data.newlyAssigned} new task(s) assigned to you!`);
                }

                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                if (res.ok) {
                   const data = await res.json();
                   if (data && data.display_name) {
                      const parts = data.display_name.split(', ');
                      const shortName = parts.slice(0, 3).join(', ');
                      setCurrentLocationName(shortName);
                      return;
                   }
                }
             } catch (e) {
                console.error("Location update/geocoding failed", e);
             }
             setCurrentLocationName(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
         });
      };
      
      fetchLocationName();
      interval = setInterval(fetchLocationName, 60000); // update every minute
    } else {
      setCurrentLocationName(null);
      // Attempt to tell backend we went offline (providing 0,0 or last known coordinates if we had them)
      try {
        workerService.updateLocation(0, 0, false).catch(() => {});
      } catch (e) {}
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLocationEnabled]);

  // React Query Fetch Tasks
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['workerTasks'],
    queryFn: workerService.getAssignedTasks,
  });

  // React Query Fetch Stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['workerStats'],
    queryFn: workerService.getWorkerStats,
  });

  // React Query Completion Mutation
  const completeMutation = useMutation({
    mutationFn: ({ taskId, photoFile, coordinates }) => workerService.completePickup(taskId, photoFile, coordinates),
    onSuccess: () => {
      setSelectedTask(null);
      setPhoto(null);
      toast.success('Task completed successfully! Great job! 🎉');
      // Invalidate queries to fetch fresh data
      queryClient.invalidateQueries({ queryKey: ['workerTasks'] });
      queryClient.invalidateQueries({ queryKey: ['workerStats'] });
    },
    onError: (error) => {
      console.error('Error completing task:', error);
      toast.error('Failed to complete task. Please try again.');
    },
  });

  const handleComplete = async (e) => {
    e.preventDefault();
    if (!photo) {
      toast.warning("Please upload a photo of the empty bin.");
      return;
    }
    
    if (!navigator.geolocation) {
       toast.warning("Geolocation is not supported. Proximity check skipped.");
       completeMutation.mutate({ taskId: selectedTask._id, photoFile: photo });
       return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
        (position) => {
            setIsLocating(false);
            const coordinates = { lat: position.coords.latitude, lng: position.coords.longitude };
            completeMutation.mutate({ taskId: selectedTask._id, photoFile: photo, coordinates });
        },
        (error) => {
            setIsLocating(false);
            console.error("Geolocation error:", error);
            completeMutation.mutate({ taskId: selectedTask._id, photoFile: photo });
        },
        { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleLogout = () => {
    dispatch(workerLogout());
  };

  return (
    <div className="min-h-screen bg-[#F3F6F8] flex flex-col">
      {/* Navigation */}
      <header className="fixed w-full top-0 z-40 transition-all py-3 bg-gray-900 border-b border-gray-800 shadow-lg">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Brand Logo & Title */}
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-3 group cursor-default">
                <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20 border border-blue-400/30">
                  <HardHat className="text-white w-6 h-6 transform group-hover:-rotate-12 transition-transform duration-500" />
                </div>
                <div className="flex flex-col hidden sm:flex">
                  <span className="text-xl font-bold tracking-tight text-white leading-tight">
                    GullyClean
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-blue-400">
                    Worker Portal
                  </span>
                </div>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-5">
              <div className="hidden lg:block">
                <InstallPWA />
              </div>
              
              {/* Online Indicator Box */}
              <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-gray-800/80 border border-gray-700 rounded-lg">
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                   <span className="text-[10px] uppercase tracking-wider font-bold text-gray-300">Live</span>
                 </div>
              </div>
              
              <div className="h-8 w-px bg-gray-700 hidden sm:block"></div>

              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full border border-gray-700 bg-gray-800 hover:bg-gray-700 hover:border-gray-500 transition-all duration-300"
                >
                  <img 
                    alt="Avatar" 
                    src={`https://ui-avatars.com/api/?name=${workerUser?.name?.replace(/\s/g, '+')}&background=1e3a8a&color=bfdbfe&bold=true`} 
                    className="w-8 h-8 rounded-full shadow-sm border border-gray-600"
                  />
                  <div className="flex flex-col items-start hidden sm:flex">
                    <span className="text-sm font-bold text-gray-100 leading-none">
                      {workerUser?.name?.split(' ')[0]}
                    </span>
                    <span className="text-[10px] font-semibold text-blue-400 mt-0.5 capitalize">
                      {workerUser?.role || 'Worker'}
                    </span>
                  </div>
                  <ChevronDown size={14} className={`transition-transform duration-300 text-gray-400 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-gray-800 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-gray-700 py-2 z-50 transform origin-top-right transition-all animate-in fade-in slide-in-from-top-2">
                    <div className="px-5 py-4 border-b border-gray-700 bg-gray-900/50">
                      <p className="text-sm font-bold text-white truncate">{workerUser?.name}</p>
                      <p className="text-xs font-semibold text-blue-400 capitalize mt-1">{workerUser?.email}</p>
                    </div>
                    <div className="p-2">
                      <Link 
                        to="/profile" 
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors mb-1"
                      >
                        <User size={16} /> My Profile
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors"
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        
        {/* Premium Greeting Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-10 shadow-lg border border-blue-100/50">
           <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-800 z-0"></div>
           {/* Abstract shapes for decoration */}
           <div className="absolute -top-24 -right-24 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl z-0"></div>
           <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-400 opacity-20 rounded-full blur-2xl z-0"></div>
           
           <div className="relative z-10 p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                 <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold tracking-wider mb-4 border border-white/20">
                    SQUAD DASHBOARD
                 </span>
                 <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">
                    Hello, {workerUser?.name?.split(' ')[0]}! 👋
                 </h1>
                 <p className="text-blue-100 font-medium text-lg max-w-xl mb-6">
                    Here is your work for today. Follow the map and take photos when done.
                 </p>
                 <div className="flex items-center gap-4">
                    <button
                        onClick={() => dispatch(toggleLocationTracking())}
                        className={`relative inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 border ${
                            isLocationEnabled 
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-white border-emerald-400 shadow-emerald-500/30' 
                            : 'bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md'
                        }`}
                    >
                        {isLocationEnabled ? (
                            <>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-300 rounded-full border border-white"></div>
                                <MapPin size={18} className="animate-pulse" /> ONLINE & TRACKING
                            </>
                        ) : (
                            <>
                                <MapPin size={18} className="opacity-70" /> GO ONLINE
                            </>
                        )}
                    </button>
                    <p className="text-xs font-semibold text-blue-200/80 max-w-[200px] leading-tight hidden sm:block">
                        {isLocationEnabled ? (
                            <>
                                Your location is being shared with dispatch.
                                {currentLocationName && (
                                    <span className="block mt-1 text-emerald-300 font-bold tracking-wide">
                                        📍 {currentLocationName}
                                    </span>
                                )}
                            </>
                        ) : 'Location tracking is paused.'}
                    </p>
                 </div>
              </div>
              <div className="hidden lg:block">
                 <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner transform rotate-3 hover:rotate-6 transition-all">
                    <Truck className="w-12 h-12 text-white" />
                 </div>
              </div>
           </div>
        </div>

        {/* Worker Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            
            {/* Stat 1 */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex items-center gap-5 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="p-4 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl shadow-inner border border-green-500">
                <CheckCircle className="text-white w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Done Today</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-4xl font-black text-gray-900">{stats.dailyCompleted}</h3>
                </div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex items-center gap-5 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="p-4 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl shadow-inner border border-blue-500">
                <TrendingUp className="text-white w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Total Done</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-4xl font-black text-gray-900">{stats.totalCompleted}</h3>
                </div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="bg-white rounded-3xl shadow-sm border border-orange-200 p-6 flex items-center gap-5 hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden bg-orange-50/30">
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-100 rounded-bl-full -z-0"></div>
              <div className="p-4 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl shadow-lg border border-orange-500 relative z-10 animate-pulse">
                <Clock className="text-white w-8 h-8" />
              </div>
              <div className="relative z-10">
                <p className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-1">To Do Now</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-4xl font-black text-gray-900">{stats.pendingTasks}</h3>
                  {stats.pendingTasks > 0 && (
                    <span className="text-xs font-bold text-orange-600 flex items-center gap-1">
                      <AlertCircle size={14} /> Look Below
                    </span>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Assigned Pickups Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <MapPin className="text-blue-600 w-8 h-8" /> Go to these places
            </h2>
          </div>
        </div>

        {tasksLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-16 w-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center max-w-3xl mx-auto">
            <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-green-200">
               <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-3">All Done! 🎉</h3>
            <p className="text-gray-500 text-xl">You can rest now. No more bins to clean.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div key={task._id} className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-2 border-blue-100 overflow-hidden hover:shadow-2xl hover:border-blue-400 hover:-translate-y-2 transition-all duration-300 flex flex-col">
                <div className="p-2 border-b border-blue-100 bg-blue-600 text-center">
                   <p className="text-white font-black text-lg tracking-widest uppercase">Bin {task.bin?.binId || '123'}</p>
                </div>
                <div className="p-8 flex-1 flex flex-col items-center text-center">
                  
                  <MapPin className="text-red-500 w-12 h-12 mb-3 drop-shadow-sm" />
                  <h3 className="text-2xl font-black text-gray-900 mb-4 leading-snug">
                    {task.location}
                  </h3>
                  
                  {task.notes && (
                    <div className="w-full mt-2 mb-6 bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                      <p className="text-lg text-yellow-800 font-bold">⚠️ "{task.notes}"</p>
                    </div>
                  )}
                  
                  <div className="flex-1"></div>
                  
                  <div className="w-full mt-2">
                    <button
                      onClick={() => setSelectedTask(task)}
                      className="w-full flex justify-center items-center gap-3 px-6 py-5 border-4 border-transparent text-xl font-black rounded-2xl text-white bg-green-500 hover:bg-green-600 hover:scale-105 active:scale-95 shadow-lg shadow-green-500/40 transition-all duration-300 group"
                    >
                      <Camera size={32} className="transform group-hover:rotate-12 transition-transform" />
                      TAKE PHOTO TO FINISH
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Completion Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gray-900/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden flex flex-col max-h-[95vh] border-4 border-blue-500 shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-6 border-b-4 border-blue-100 flex items-center justify-between bg-blue-50">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center">
                  <Camera size={32} />
                </div>
                <h3 className="text-2xl font-black text-gray-900">Take a Photo</h3>
              </div>
              <button 
                onClick={() => { setSelectedTask(null); setPhoto(null); }} 
                className="w-12 h-12 bg-red-100 text-red-600 hover:bg-red-500 hover:text-white flex items-center justify-center rounded-full transition-all border-2 border-red-200 font-bold"
              >
                <X size={28} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {/* Location display strictly visual */}
              <div className="mb-6 bg-gray-50 rounded-2xl p-6 text-center border-2 border-gray-200 shadow-sm">
                <MapPin size={40} className="text-red-500 mx-auto mb-2" /> 
                <p className="text-gray-900 font-black text-2xl leading-tight mb-2">{selectedTask.location}</p>
                <p className="text-xl font-bold text-gray-500 bg-gray-200 inline-block px-4 py-1 rounded-full">Bin ID: {selectedTask.bin?.binId}</p>
              </div>

              {/* Upload Dropzone */}
              <div 
                className={`border-4 border-dashed rounded-3xl p-10 mb-6 cursor-pointer flex flex-col items-center justify-center text-center transition-all duration-300 group ${
                  photo ? 'border-green-500 bg-green-50 hover:bg-green-100' : 'border-blue-300 bg-blue-50 hover:bg-blue-100 hover:border-blue-500 scale-100 active:scale-95'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                {photo ? (
                  <>
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform shadow-lg shadow-green-500/40 border-4 border-white">
                       <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    <p className="font-black text-gray-900 text-2xl truncate max-w-full px-4 mb-2">{photo.name}</p>
                    <p className="text-lg font-bold text-green-700 bg-green-200 px-6 py-2 rounded-full uppercase tracking-wider border-2 border-green-300">Tap to Take Another</p>
                  </>
                ) : (
                  <>
                    <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mb-6 transform group-hover:-translate-y-2 transition-transform shadow-lg shadow-blue-500/40 border-4 border-white">
                       <Camera className="w-12 h-12 text-white" />
                    </div>
                    <p className="font-black text-blue-700 text-3xl mb-2 uppercase">TAP HERE</p>
                    <p className="text-lg font-bold text-gray-600">To open your camera</p>
                  </>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={(e) => setPhoto(e.target.files[0])} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-4 mt-8">
                <button
                  onClick={handleComplete}
                  disabled={completeMutation.isPending || isLocating || !photo}
                  className="w-full py-5 px-6 bg-green-500 hover:bg-green-600 text-white text-2xl font-black rounded-2xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex justify-center items-center gap-3 uppercase tracking-widest border-b-4 border-green-700 active:border-b-0 active:translate-y-1"
                >
                  {completeMutation.isPending || isLocating ? (
                    <>
                      <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                      {isLocating ? 'LOCATING...' : 'UPLOADING...'}
                    </>
                  ) : (
                    <>
                      <CheckCircle size={32} />
                      DONE. SEND IT!
                    </>
                  )}
                </button>
                <button
                  onClick={() => { setSelectedTask(null); setPhoto(null); }}
                  className="w-full py-4 px-4 bg-gray-200 hover:bg-gray-300 text-gray-600 text-xl font-black rounded-2xl transition-all uppercase tracking-wider"
                >
                  CANCEL / GO BACK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default WorkerDashboard;
