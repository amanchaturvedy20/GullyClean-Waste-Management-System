// src/components/worker/WorkerDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPickups, completePickup } from '../../store/pickupSlice';
import { Clock, ClipboardList, MapPin, CheckCircle2, Navigation, Calendar, Camera, Upload, X } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../api/api';

function CompletionModal({ pickup, onClose, onConfirm, isSubmitting }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
        setFile(selectedFile);
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
    }
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      onConfirm(pickup, file);
  };

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <CheckCircle2 className="text-emerald-500" />
                      Complete Pickup
                  </h3>
                  <button onClick={onClose} disabled={isSubmitting} className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100 disabled:opacity-50">
                      <X size={20} />
                  </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div className="text-center space-y-2">
                      <p className="font-medium text-gray-900">Bin #{pickup.bin ? pickup.bin._id : pickup.binId}</p>
                      <p className="text-sm text-gray-500">Please provide a photo of the empty bin to confirm completion.</p>
                  </div>

                  {/* Photo Upload Area */}
                  <div className={`w-full relative border-2 border-dashed rounded-3xl p-6 transition-all duration-300 text-center ${previewUrl ? 'border-emerald-300 bg-emerald-50/30' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'}`}>
                      {previewUrl ? (
                          <div className="relative inline-block">
                              <img src={previewUrl} alt="Empty bin preview" className="max-h-40 rounded-2xl shadow-sm border-4 border-white" />
                              <button 
                                  type="button" 
                                  onClick={() => { setFile(null); setPreviewUrl(null); }}
                                  disabled={isSubmitting}
                                  className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-all disabled:opacity-50"
                              >
                                  <X size={14} strokeWidth={3} />
                              </button>
                          </div>
                      ) : (
                          <div className="flex flex-col items-center justify-center space-y-2">
                              <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center text-emerald-500 mb-1">
                                  <Camera size={24} />
                              </div>
                              <p className="text-gray-600 font-medium text-sm">Upload proof photo</p>
                              <p className="text-xs text-gray-400">JPG, PNG, max 5MB</p>
                              <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleFileChange}
                                  disabled={isSubmitting}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                              />
                          </div>
                      )}
                  </div>

                  <div className="flex gap-3 pt-2">
                      <button 
                          type="button" 
                          onClick={onClose} 
                          disabled={isSubmitting}
                          className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                      >
                          Cancel
                      </button>
                      <button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-all shadow-sm flex justify-center items-center disabled:opacity-70"
                      >
                          {isSubmitting ? (
                              <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                          ) : (
                              'Confirm Empty'
                          )}
                      </button>
                  </div>
              </form>
          </div>
      </div>
  );
}

function AssignmentCard({ pickup, onOpenCompleteModal }) {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-100',
          badgeBg: 'bg-emerald-100 text-emerald-700 border-emerald-200',
          icon: <CheckCircle2 size={16} className="text-emerald-600 mr-1" />
        };
      case 'assigned':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-100',
          badgeBg: 'bg-blue-100 text-blue-700 border-blue-200',
          icon: <Navigation size={16} className="text-blue-600 mr-1" />
        };
      default:
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-100',
          badgeBg: 'bg-amber-100 text-amber-700 border-amber-200',
          icon: <Clock size={16} className="text-amber-600 mr-1" />
        };
    }
  };

  const statusConfig = getStatusConfig(pickup.status);

  return (
    <div className={`bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 mb-6 group`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        
        {/* Info Section */}
        <div className="flex-1 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${statusConfig.bg} border ${statusConfig.border}`}>
                  <ClipboardList className="text-blue-600" size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 leading-tight">
                    Pickup #{pickup._id ? pickup._id.substring(18).toUpperCase() : pickup.id}
                  </h2>
                  <p className="text-sm font-medium text-gray-500 mt-0.5">Bin ID: {pickup.bin ? pickup.bin._id : pickup.binId}</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusConfig.badgeBg}`}>
                  {statusConfig.icon}
                  {pickup.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                    <MapPin size={18} className="text-emerald-500 mt-0.5" />
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Location</p>
                        <p className="text-sm font-semibold text-gray-900">{pickup.bin && pickup.bin.location ? pickup.bin.location : 'Unknown'}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                    <Clock size={18} className="text-amber-500 mt-0.5" />
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Requested</p>
                        <p className="text-sm font-semibold text-gray-900">{pickup.requestedDate ? new Date(pickup.requestedDate).toLocaleString() : 'N/A'}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Action Section */}
        <div className="w-full md:w-auto flex justify-end md:pl-6 md:border-l border-gray-100">
            {pickup.status !== 'completed' && (
              <button
                onClick={() => onOpenCompleteModal(pickup)}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                <Camera size={18} />
                Empty Bin
              </button>
            )}
        </div>
      </div>
    </div>
  );
}

export default function WorkerDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { pickups, status, error } = useSelector((state) => state.pickup);
  
  const [activeModalPickup, setActiveModalPickup] = useState(null);
  const [isSubmittingPhoto, setIsSubmittingPhoto] = useState(false);

  // Load pickups once
  useEffect(() => {
    dispatch(fetchPickups());
  }, [dispatch]);

  const handleConfirmComplete = async (pickup, file) => {
      setIsSubmittingPhoto(true);
      let workerPhotoUrl = null;

      if (file) {
          try {
              const formData = new FormData();
              formData.append('image', file);
              const { data } = await api.post('/upload', formData, {
                  headers: { 'Content-Type': 'multipart/form-data' },
              });
              workerPhotoUrl = data.imageUrl;
          } catch (err) {
              console.error('Photo upload failed:', err);
              toast.error('Failed to upload proof photo. Try again.');
              setIsSubmittingPhoto(false);
              return;
          }
      }

      dispatch(completePickup({ 
          pickupId: pickup._id || pickup.id, 
          workerPhoto: workerPhotoUrl 
      }))
      .unwrap()
      .then(() => {
          toast.success('Bin marked as empty! Good job.');
          setActiveModalPickup(null);
      })
      .catch((err) => {
          toast.error(err || 'Failed to complete pickup.');
      })
      .finally(() => {
          setIsSubmittingPhoto(false);
      });
  };

  if (status === 'loading') {
    return (
        <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-200 mt-10 text-center font-medium">
        Error loading assignments: {error}
      </div>
    );
  }

  const myAssignments = (pickups || []).filter(
      (p) => p.assignedTo && (p.assignedTo._id === user._id || p.assignedTo === user._id)
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Abstract Dashboard Header */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-50px] left-[-50px] w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-black mb-2">
                Welcome back, {user.name}
                </h1>
                <p className="text-gray-400 font-medium">
                    Here are your assignments for today.
                </p>
            </div>
            <div className="bg-black/20 backdrop-blur-md border border-white/10 px-5 py-3 rounded-2xl flex items-center gap-3">
                <Calendar size={20} className="text-emerald-400" />
                <span className="font-bold">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric'})}</span>
            </div>
        </div>
      </div>

      <div className="mt-8">
          <div className="flex items-center justify-between mb-6 px-2">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Navigation className="text-emerald-500" size={24} />
                Active Routes
                <span className="bg-gray-100 text-gray-600 py-1 px-3 rounded-full text-sm ml-2">
                    {myAssignments.filter(p => p.status !== 'completed').length} Pending
                </span>
            </h2>
          </div>

          {myAssignments.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">All Caught Up!</h3>
                <p className="text-gray-500 max-w-md mx-auto">You have no pending assignments right now. Take a break or check back later.</p>
            </div>
          ) : (
            <div className="space-y-4">
                {myAssignments.map((pickup) => (
                    <AssignmentCard
                        key={pickup._id || pickup.id}
                        pickup={pickup}
                        onOpenCompleteModal={setActiveModalPickup}
                    />
                ))}
            </div>
          )}
      </div>

      {/* Render the modal if active */}
      {activeModalPickup && (
          <CompletionModal 
             pickup={activeModalPickup} 
             onClose={() => !isSubmittingPhoto && setActiveModalPickup(null)} 
             onConfirm={handleConfirmComplete}
             isSubmitting={isSubmittingPhoto}
          />
      )}
    </div>
  );
}
