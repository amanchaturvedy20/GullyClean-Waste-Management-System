import React, { useState, useEffect } from 'react';
import { useForm as useRHForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { workerLogin, clearError } from '../../store/authSlice';
import { Navigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, HardHat, Navigation, CheckCircle } from 'lucide-react';

/* ---------------- Validation Schema ---------------- */
const schema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const WorkerLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { status, error, workerUser } = useSelector((state) => state.auth);

  const { register, handleSubmit, formState: { errors } } = useRHForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = (data) => {
    dispatch(workerLogin(data));
  };

  const isLoading = status === 'loading';

  if (workerUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ---------------- Image Side Panel (Hidden on Mobile) ---------------- */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-blue-900">
        <img 
          src="https://images.unsplash.com/photo-1541888086-2d3340f1a9a8?auto=format&fit=crop&w=2000&q=80" 
          alt="Worker Fleet Login" 
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700/80 to-indigo-900/90" />
        
        <div className="relative z-10 flex flex-col justify-between h-full p-16 text-white max-w-2xl">
          <Link to="/" className="flex items-center gap-3 w-fit">
            <div className="w-12 h-12 bg-white/10 rounded-xl backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl">
              <HardHat className="w-7 h-7 text-blue-300" />
            </div>
            <span className="text-2xl font-black tracking-tight drop-shadow-md">Gully Clean</span>
          </Link>

          <div>
            <h1 className="text-5xl font-black mb-6 leading-tight tracking-tight text-white drop-shadow-sm">
              Welcome back to the fleet.
            </h1>
            <p className="text-blue-50/80 text-lg leading-relaxed max-w-lg mb-12 font-medium">
              Access your daily dashboard. Review assigned routes, complete pickups, and
              keep our city running smoothly.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
               <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/20 transition-colors">
                <Navigation className="w-8 h-8 text-blue-300 mb-4" />
                <h3 className="font-bold mb-1">Live Routing</h3>
                <p className="text-blue-100/70 text-sm">View your immediate tasks.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/20 transition-colors">
                <CheckCircle className="w-8 h-8 text-indigo-300 mb-4" />
                <h3 className="font-bold mb-1">Instant Impact</h3>
                <p className="text-blue-100/70 text-sm">Log collections in real-time.</p>
              </div>
            </div>
          </div>
          
          <p className="text-sm font-medium text-blue-200/60">
            © {new Date().getFullYear()} Gully Clean Worker Portal.
          </p>
        </div>
      </div>

      {/* ---------------- Form Side Panel ---------------- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 relative">
        <div className="w-full max-w-md">
          {/* Mobile Logo Only */}
          <Link to="/" className="lg:hidden flex items-center gap-3 w-fit mb-12">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
              <HardHat className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tight">Gully Clean</span>
          </Link>

          <div className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3 tracking-tight">Worker Portal</h2>
            <p className="text-gray-500 font-medium tracking-wide">Sign in to view your assigned pickups.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <div className="relative">
                <input
                  type="email"
                  {...register('email')}
                  placeholder="Email Address"
                  className={`w-full pl-4 pr-4 py-3.5 bg-gray-50 border rounded-xl text-gray-900 text-sm font-medium placeholder-gray-400 transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="Password"
                  className={`w-full pl-4 pr-12 py-3.5 bg-gray-50 border rounded-xl text-gray-900 text-sm font-medium placeholder-gray-400 transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white ${
                    errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.password.message}</p>}
            </div>

            {error && (
              <div className="bg-red-50/80 border border-red-200 rounded-xl p-4 mt-2">
                <p className="text-red-600 text-sm font-semibold text-center">{typeof error === 'string' ? error : 'Login failed'}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 mt-6 flex items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                isLoading
                  ? 'bg-gray-100/80 text-gray-400 cursor-not-allowed border border-gray-200'
                  : 'text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-sm font-medium text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-bold hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkerLoginForm;
