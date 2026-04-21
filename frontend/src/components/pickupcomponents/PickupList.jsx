import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPickups, assignPickup } from '../../store/pickupSlice';
import { fetchWorkers } from '../../store/authSlice';
import Spinner from '../common/Spinner';
import { UserCheck, Calendar, MapPin, Search, ChevronRight, CheckCircle2, Clock, Truck } from 'lucide-react';

const PickupList = () => {
    const dispatch = useDispatch();
    const { pickups, status } = useSelector(state => state.pickup);
    const { workers } = useSelector(state => state.auth);
    const [selectedPickup, setSelectedPickup] = useState(null);
    const [selectedWorker, setSelectedWorker] = useState('');

    useEffect(() => {
        dispatch(fetchPickups());
        dispatch(fetchWorkers());
    }, [dispatch]);
    
    const handleAssign = () => {
        if (!selectedWorker) return;
        dispatch(assignPickup({ pickupId: selectedPickup._id, workerId: selectedWorker }));
        document.getElementById('assign_modal').close();
    }

    if (status === 'loading') return (
        <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const getStatusStyle = (status) => {
        switch (status) {
            case 'completed':
                return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', icon: <CheckCircle2 size={14} className="mr-1" /> };
            case 'assigned':
                return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', icon: <Truck size={14} className="mr-1" /> };
            default: // pending
                return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', icon: <Clock size={14} className="mr-1" /> };
        }
    };

    return (
        <div className="space-y-6">
            
            {/* Header and Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search locations or users..." 
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Bin Location</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Requested By</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Assigned To</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {pickups.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        No pickups found.
                                    </td>
                                </tr>
                            ) : (
                                pickups.map(pickup => {
                                    const statusStyle = getStatusStyle(pickup.status);
                                    
                                    return (
                                        <tr key={pickup._id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                                                        <MapPin size={18} className="text-emerald-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                                                            {pickup.bin ? pickup.bin.location : 'Unknown Location'}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-0.5 max-w-[200px] truncate">
                                                            ID: {pickup.bin ? pickup.bin._id : 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                                                    {statusStyle.icon}
                                                    {pickup.status}
                                                </span>
                                            </td>
                                            
                                            <td className="px-6 py-4 text-sm font-medium text-gray-700">
                                                {pickup.user ? pickup.user.name : 'Unknown User'}
                                            </td>
                                            
                                            <td className="px-6 py-4">
                                                {pickup.assignedTo ? (
                                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100">
                                                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold">
                                                            {pickup.assignedTo.name.charAt(0)}
                                                        </div>
                                                        <span className="text-sm font-semibold text-gray-700">{pickup.assignedTo.name}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400 italic font-medium">Unassigned</span>
                                                )}
                                            </td>
                                            
                                            <td className="px-6 py-4 text-right">
                                                {pickup.status === 'pending' && (
                                                    <button 
                                                        className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                                                        onClick={() => {
                                                            setSelectedPickup(pickup);
                                                            document.getElementById('assign_modal').showModal();
                                                        }}
                                                    >
                                                        <UserCheck size={16} />
                                                        Assign
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Assign Worker Modal */}
            <dialog id="assign_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box bg-white rounded-3xl p-6 shadow-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                            <UserCheck className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h3 className="font-bold text-xl text-gray-900">Assign Worker</h3>
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-6">
                        Select an available worker to handle the pickup at <span className="font-bold text-gray-700">{selectedPickup?.bin?.location || 'this location'}</span>.
                    </p>

                    <div className="py-2 mb-8">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Select Team Member</label>
                        <select 
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none" 
                            value={selectedWorker} 
                            onChange={e => setSelectedWorker(e.target.value)}
                        >
                            <option disabled value="">Choose a worker...</option>
                            {workers.map(worker => (
                                <option key={worker._id} value={worker._id}>{worker.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-3 justify-end">
                        <button 
                            className="px-5 py-2.5 font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                            onClick={() => document.getElementById('assign_modal').close()}
                        >
                            Cancel
                        </button>
                        <button 
                            className="px-5 py-2.5 font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl shadow-sm hover:shadow-md transition-all gap-2 flex items-center disabled:opacity-50 disabled:cursor-not-allowed" 
                            onClick={handleAssign}
                            disabled={!selectedWorker}
                        >
                            Confirm Assignment <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button className="cursor-default">close</button>
                </form>
            </dialog>
        </div>
    );
};

export default PickupList;