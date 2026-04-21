import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { adminLogin, reset } from '../../store/authSlice';
import { Eye, EyeOff, ShieldCheck, LogIn, Activity, Lock, Mail } from 'lucide-react';
import { toast } from 'react-toastify';

const schema = yup.object({
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
});

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
       toast.error(`Login Failed: ${error}`);
       dispatch(reset());
    }
  }, [error, dispatch]);

  const onSubmit = async (data) => {
    dispatch(adminLogin(data));
  };

  const isLoading = status === 'loading' || isSubmitting;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ---------------- Image Side Panel (Hidden on Mobile) ---------------- */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-cyan-900">
        <img 
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2000&q=80" 
          alt="Data and Analytics Dashboard" 
          className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-800/90 to-blue-900/95" />
        
        <div className="relative z-10 flex flex-col justify-between h-full p-16 text-white max-w-2xl">
          <div className="flex items-center gap-3 w-fit">
            <div className="w-12 h-12 bg-white/10 rounded-xl backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl">
              <ShieldCheck className="w-7 h-7 text-cyan-300" />
            </div>
            <span className="text-2xl font-black tracking-tight drop-shadow-md">Gully Clean</span>
          </div>

          <div>
            <h1 className="text-5xl font-black mb-6 leading-tight tracking-tight text-white drop-shadow-sm">
              City Waste Command Center
            </h1>
            <p className="text-cyan-50/80 text-lg leading-relaxed max-w-lg mb-12 font-medium">
              Oversee the entire municipal waste infrastructure. Monitor live bin levels, track worker performance, and coordinate the entire smart fleet.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                <Activity className="w-8 h-8 text-cyan-300 mb-4" />
                <h3 className="font-bold mb-1">Live Metrics</h3>
                <p className="text-cyan-100/60 text-sm">Real-time bin capacity analytics.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                <ShieldCheck className="w-8 h-8 text-blue-300 mb-4" />
                <h3 className="font-bold mb-1">Secure Control</h3>
                <p className="text-cyan-100/60 text-sm">Manage entire fleet operations natively.</p>
              </div>
            </div>
          </div>
          
          <p className="text-sm font-medium text-cyan-200/50 pr-8">
            This system is strictly for authorized municipality staff. Unauthorized access is prohibited.
          </p>
        </div>
      </div>

      {/* ---------------- Form Side Panel ---------------- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 relative bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo Only */}
          <div className="lg:hidden flex items-center gap-3 w-fit mb-12">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tight">Gully Clean</span>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3 tracking-tight">Admin Gateway</h2>
            <p className="text-gray-500 font-medium tracking-wide">Enter your authorized credentials.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 tracking-wide">Administrator Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input 
                  {...register('email')}
                  type="email" 
                  placeholder="admin.terminal@gullyclean.gov"
                  className={`w-full pl-11 pr-4 py-4 bg-gray-50 border rounded-xl text-gray-900 text-sm font-bold placeholder-gray-400 transition-all focus:ring-2 focus:ring-cyan-500 focus:border-transparent focus:bg-white ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                />
              </div>
              {errors.email && <p className="text-sm font-bold text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 tracking-wide">Secure Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input 
                  {...register('password')}
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••••••"
                  className={`w-full pl-11 pr-12 py-4 bg-gray-50 border rounded-xl text-gray-900 text-sm font-bold placeholder-gray-400 transition-all focus:ring-2 focus:ring-cyan-500 focus:border-transparent focus:bg-white ${
                    errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                />
                <button 
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-cyan-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-sm font-bold text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={!isValid || isLoading}
              className={`w-full py-4 mt-8 rounded-xl font-black transition-all flex items-center justify-center gap-2 duration-300 ${
                !isValid || isLoading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-0.5'
              }`}
            >
              {isLoading ? (
                 <>
                   <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                   Authenticating...
                 </>
              ) : (
                <>
                  <LogIn size={20} />
                  Authorize Access
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
