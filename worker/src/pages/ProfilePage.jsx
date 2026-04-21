import React, { useState } from 'react';
import Profile from '../components/dashboard/Profile';
import { Recycle, LogOut, ChevronDown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { workerLogout } from '../store/authSlice';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const { workerUser } = useSelector((state) => state.auth);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    const handleLogout = () => {
        dispatch(workerLogout());
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header matches Worker Dashboard */}
            <header className="fixed w-full top-0 z-50 transition-all duration-300 py-2 bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14">
                        <div className="flex items-center gap-4 sm:gap-6">
                            <Link to="/dashboard" className="flex items-center gap-3 group">
                                <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                                    <Recycle className="text-white w-6 h-6 transform group-hover:-rotate-90 transition-transform duration-500" />
                                </div>
                                <div className="flex flex-col hidden sm:flex">
                                    <span className="text-xl font-extrabold tracking-tight text-gray-900">
                                        Gully Clean
                                    </span>
                                    <span className="text-[10px] font-medium uppercase tracking-wider text-blue-600">
                                        Smart City Waste
                                    </span>
                                </div>
                            </Link>
                            <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
                            <h1 className="text-lg font-bold text-gray-700">
                                Profile Settings
                            </h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <button
                                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
                                >
                                    <img 
                                        alt="Avatar" 
                                        src={`https://ui-avatars.com/api/?name=${workerUser?.name?.replace(/\s/g, '+')}&background=random&color=fff&bold=true`} 
                                        className="w-7 h-7 rounded-full bg-gray-200 shadow-sm"
                                    />
                                    <span className="text-sm font-semibold text-gray-700 hidden sm:block">
                                        {workerUser?.name?.split(' ')[0]}
                                    </span>
                                    <ChevronDown size={14} className={`transition-transform duration-300 text-gray-400 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {userDropdownOpen && (
                                    <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100/50 py-2 z-50 transform origin-top-right transition-all">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-bold text-gray-900 truncate">{workerUser?.name}</p>
                                            <p className="text-xs font-medium text-blue-600 capitalize mt-0.5">{workerUser?.role || 'worker'}</p>
                                        </div>
                                        <div className="p-2">
                                            <button 
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
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

            <main className="max-w-2xl mx-auto pt-28 pb-8 px-4 sm:px-6 lg:px-8">
                <Profile />
            </main>
        </div>
    );
};

export default ProfilePage;
