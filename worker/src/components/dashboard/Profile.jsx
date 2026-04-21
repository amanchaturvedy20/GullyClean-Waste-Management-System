import React from 'react';
import { useSelector } from 'react-redux';
import { User, Mail, Phone, Award, Calendar, Shield } from 'lucide-react';

const Profile = () => {
    const { workerUser: user } = useSelector((state) => state.auth);

    if (!user) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // Dynamic role badges
    const getRoleBadge = (role) => {
        switch(role) {
            case 'admin':
                return { icon: <Shield size={16} />, color: "bg-red-100 text-red-700 border-red-200" };
            case 'worker':
                return { icon: <Award size={16} />, color: "bg-amber-100 text-amber-700 border-amber-200" };
            default:
                return { icon: <User size={16} />, color: "bg-blue-100 text-blue-700 border-blue-200" };
        }
    };

    const roleData = getRoleBadge(user.role || 'worker');

    return (
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden max-w-2xl mx-auto">
            {/* Header Banner */}
            <div className="h-40 bg-gradient-to-r from-blue-500 to-indigo-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                {/* Decorative circles */}
                <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-[-50px] right-[-50px] w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>
            </div>

            <div className="px-8 pb-10 relative">
                {/* Avatar */}
                <div className="flex justify-center -mt-20 mb-6">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-white rounded-full scale-110 shadow-xl group-hover:scale-115 transition-transform duration-300"></div>
                        <img 
                            src={`https://ui-avatars.com/api/?name=${user.name?.replace(/\s/g, '+')}&background=0f172a&color=fff&size=128&bold=true`} 
                            alt="User Avatar" 
                            className="relative w-32 h-32 rounded-full border-4 border-white shadow-md object-cover bg-white z-10"
                        />
                        {/* Status dot */}
                        <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-4 border-white rounded-full z-20"></div>
                    </div>
                </div>

                {/* Main Info */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                        {user.name}
                    </h2>
                    
                    <div className="flex items-center justify-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${roleData.color}`}>
                            {roleData.icon}
                            {user.role || 'worker'}
                        </span>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="space-y-4 max-w-md mx-auto">
                    {/* Detail Item */}
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-blue-50/50 hover:border-blue-100 transition-colors group">
                        <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm group-hover:bg-blue-100/50 group-hover:border-blue-200 transition-colors">
                            <Mail className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address</p>
                            <p className="text-sm font-semibold text-gray-900">{user.email}</p>
                        </div>
                    </div>

                    {/* Detail Item */}
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-blue-50/50 hover:border-blue-100 transition-colors group">
                        <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm group-hover:bg-blue-100/50 group-hover:border-blue-200 transition-colors">
                            <Phone className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phone Number</p>
                            <p className="text-sm font-semibold text-gray-900">{user.phone || 'Not provided'}</p>
                        </div>
                    </div>

                    {/* Detail Item */}
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-blue-50/50 hover:border-blue-100 transition-colors group">
                        <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm group-hover:bg-blue-100/50 group-hover:border-blue-200 transition-colors">
                            <Calendar className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Member Since</p>
                            <p className="text-sm font-semibold text-gray-900">
                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
