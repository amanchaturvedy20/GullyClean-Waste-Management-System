import React, { useState, useEffect } from 'react';
import { useForm as useRHForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { workerRegister, clearError } from '../../store/authSlice';
import { Navigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, HardHat, Phone, CheckCircle, Navigation } from 'lucide-react';
import { toast } from 'react-toastify';

/* ---------------- Validation Schema ---------------- */
const schema = yup.object().shape({
  name: yup.string().required('Name is required').min(2, 'Must be at least 2 characters'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  password: yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const WorkerSignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const dispatch = useDispatch();
  const { status, error, workerUser } = useSelector((state) => state.auth);

  const { register, handleSubmit, formState: { errors } } = useRHForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  /* Handle success/error side effects */
  useEffect(() => {
    if (error) {
       toast.error(`Registration Failed: ${error}`);
       dispatch(clearError());
    }
    
    // Using side effect state to gracefully transition UI instead of immediate Navigate hook
    if (workerUser) {
        setShowSuccess(true);
        toast.success("Account created successfully!");
    }
  }, [workerUser, error, dispatch]);


  const onSubmit = (data) => {
    dispatch(workerRegister(data));
  };

  const isLoading = status === 'loading';

  /* Success Screen before redirect */
  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
         <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl text-center border border-blue-100">
           <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
             <CheckCircle className="text-blue-500 w-10 h-10" />
           </div>
           <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Onboarding Complete!</h2>
           <p className="text-gray-500 mb-8">Preparing your collection routes...</p>
           <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
           {/* Redirect silently after delay */}
           <Navigate to="/dashboard" replace={true} />
         </div>
       </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ---------------- Image Side Panel (Hidden on Mobile) ---------------- */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-blue-900">
        <img 
          src="https://images.unsplash.com/photo-1518667530660-f1d2edab76ed?auto=format&fit=crop&w=2000&q=80" 
          alt="Worker Fleet" 
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
              Keep the city moving.
            </h1>
            <p className="text-blue-50/80 text-lg leading-relaxed max-w-lg mb-12 font-medium">
              Join the official waste management fleet. Receive automated routes, 
              confirm pickups, and track your daily collection impact.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/20 transition-colors">
                <Navigation className="w-8 h-8 text-blue-300 mb-4" />
                <h3 className="font-bold mb-1">Smart Routing</h3>
                <p className="text-blue-100/70 text-sm">Automated pickup assignments.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/20 transition-colors">
                <CheckCircle className="w-8 h-8 text-indigo-300 mb-4" />
                <h3 className="font-bold mb-1">Easy Verification</h3>
                <p className="text-blue-100/70 text-sm">1-tap photo verification.</p>
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
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3 tracking-tight">Worker Registration</h2>
            <p className="text-gray-500 font-medium tracking-wide">Enter your credentials to join the fleet.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div>
              <div className="relative">
                <input
                  type="text"
                  {...register('name')}
                  placeholder="Full Name"
                  className={`w-full pl-4 pr-4 py-3.5 bg-gray-50 border rounded-xl text-gray-900 text-sm font-medium placeholder-gray-400 transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white ${
                    errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                />
              </div>
              {errors.name && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.name.message}</p>}
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

              <div>
                <div className="relative">
                  <input
                    type="tel"
                    {...register('phone')}
                    placeholder="Phone Number"
                    className={`w-full pl-4 pr-4 py-3.5 bg-gray-50 border rounded-xl text-gray-900 text-sm font-medium placeholder-gray-400 transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white ${
                      errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                </div>
                {errors.phone && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.phone.message}</p>}
              </div>
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

            {/* Confirm Password */}
            <div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  placeholder="Confirm Password"
                  className={`w-full pl-4 pr-12 py-3.5 bg-gray-50 border rounded-xl text-gray-900 text-sm font-medium placeholder-gray-400 transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white ${
                    errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.confirmPassword.message}</p>}
            </div>

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
                  Registering...
                </>
              ) : (
                'Create Worker Account'
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-sm font-medium text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold hover:underline">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkerSignupForm;
