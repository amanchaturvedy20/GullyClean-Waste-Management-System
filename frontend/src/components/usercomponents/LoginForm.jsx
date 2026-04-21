import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { login, reset } from '../../store/authSlice';
import { toast } from 'react-toastify';
import { Eye, EyeOff, LogIn, CheckCircle, Leaf, Mail, Lock } from 'lucide-react';

// Validation schema
const schema = yup.object({
  identifier: yup
    .string()
    .required('Email or phone is required')
    .test('email-or-phone', 'Please enter a valid email or phone number', (value) => {
      if (!value) return false;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      return emailRegex.test(value) || phoneRegex.test(value);
    }),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset: resetForm,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  useEffect(() => {
    if (error) {
      toast.error(`Login Failed: ${error}`);
      dispatch(reset());
    }
    
    if (user) {
      setShowSuccess(true);
      toast.success('Successfully logged in!');
      setTimeout(() => {
        if (user.role === 'admin') {
          window.location.href = 'http://localhost:5175';
        } else if (user.role === 'worker') {
          window.location.href = 'http://localhost:5174';
        } else {
          navigate('/');
        }
      }, 1500);
    }
  }, [user, error, navigate, dispatch]);

  const onSubmit = async (data) => {
    await dispatch(login(data)); 
  };

  const isLoading = status === 'loading' || isSubmitting;

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl text-center border border-emerald-100">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-emerald-500 w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Welcome Back!</h2>
          <p className="text-gray-500 mb-8">Routing you to your dashboard...</p>
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ---------------- Image Side Panel (Hidden on Mobile) ---------------- */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-emerald-900">
        <img 
          src="https://images.unsplash.com/photo-1496850849310-721473faec4c?auto=format&fit=crop&q=80&w=2000" 
          alt="Sustainable Future" 
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/80 to-teal-900/90" />
        
        <div className="relative z-10 flex flex-col justify-between h-full p-16 text-white max-w-2xl">
          <Link to="/" className="flex items-center gap-3 w-fit">
            <div className="w-12 h-12 bg-white/10 rounded-xl backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl">
              <Leaf className="w-7 h-7 text-emerald-300" />
            </div>
            <span className="text-2xl font-black tracking-tight drop-shadow-md">Gully Clean</span>
          </Link>

          <div>
            <h1 className="text-5xl font-black mb-6 leading-tight tracking-tight text-white drop-shadow-sm">
              Welcome back.
            </h1>
            <p className="text-emerald-50/80 text-lg leading-relaxed max-w-md mb-12 font-medium">
              Log in to track your reported bins, request pickups, and see your ecological impact.
            </p>
          </div>
          
          <p className="text-sm font-medium text-emerald-200/60">
            © {new Date().getFullYear()} Gully Clean Project. All rights reserved.
          </p>
        </div>
      </div>

      {/* ---------------- Form Side Panel ---------------- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 relative">
        <div className="w-full max-w-md">
          {/* Mobile Logo Only */}
          <Link to="/" className="lg:hidden flex items-center gap-3 w-fit mb-12">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tight">Gully Clean</span>
          </Link>

          <div className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3 tracking-tight">Sign In</h2>
            <p className="text-gray-500 font-medium tracking-wide">Enter your credentials to access your account.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Email/Phone */}
            <div>
              <div className="relative">
                
                <input
                  {...register('identifier')}
                  type="text"
                  placeholder="Email or Phone Number"
                  className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border rounded-xl text-gray-900 text-sm font-medium placeholder-gray-400 transition-all focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white ${
                    errors.identifier ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.identifier && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.identifier.message}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className={`w-full pl-11 pr-12 py-3.5 bg-gray-50 border rounded-xl text-gray-900 text-sm font-medium placeholder-gray-400 transition-all focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white ${
                    errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-emerald-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.password.message}</p>}
              
              <div className="flex justify-end mt-2">
                <a href="#" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 hover:underline">
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!isValid || isLoading}
              className={`w-full py-4 mt-6 flex items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                !isValid || isLoading
                  ? 'bg-gray-100/80 text-gray-400 cursor-not-allowed border border-gray-200'
                  : 'text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-sm font-medium text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
