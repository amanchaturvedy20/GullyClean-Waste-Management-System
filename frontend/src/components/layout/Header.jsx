import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { Recycle, LogIn, UserPlus, User, LogOut, LayoutDashboard, Truck, Trash2, Menu, X, MapPin, ChevronDown } from 'lucide-react';
import InstallPWA from '../common/InstallPWA';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location]);

  const onLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const navLinks = [
    { to: '/bins', text: 'Smart Bins', icon: <Trash2 size={18} /> },
    { to: '/request-pickup', text: 'Request Pickup', icon: <Truck size={18} /> }
  ];

  const filteredNavLinks = navLinks;

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const isHomePage = location.pathname === '/';

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      scrolled || !isHomePage 
        ? 'py-2 bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50' 
        : 'py-4 bg-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
            onClick={handleLinkClick}
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg group-hover:shadow-emerald-500/30 transition-shadow">
              <Recycle className="text-white w-6 h-6 transform group-hover:-rotate-90 transition-transform duration-500" />
            </div>
            <div className="flex flex-col">
              <span className={`text-xl font-extrabold tracking-tight ${scrolled || !isHomePage ? 'text-gray-900' : 'text-white'}`}>
                Gully Clean
              </span>
              <span className={`text-[10px] font-medium uppercase tracking-wider ${scrolled || !isHomePage ? 'text-emerald-600' : 'text-emerald-200'}`}>
                Smart City Waste
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex items-center gap-2">
              {filteredNavLinks.map(link => (
                <NavLink 
                  key={link.to}
                  to={link.to} 
                  className={({ isActive }) => 
                    `relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 group ${
                      isActive 
                        ? (scrolled || !isHomePage ? 'bg-emerald-50 text-emerald-700' : 'bg-white/20 text-white')
                        : (scrolled || !isHomePage ? 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50' : 'text-white/80 hover:text-white hover:bg-white/10')
                    }`
                  }
                >
                  <span className="opacity-70 group-hover:opacity-100 transition-opacity">{link.icon}</span>
                  {link.text}
                </NavLink>
              ))}
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-4 pl-8 border-l border-gray-200/30">
              <div className="hidden lg:block"><InstallPWA /></div>
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 ${
                      scrolled || !isHomePage 
                        ? 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50' 
                        : 'border-white/30 hover:bg-white/10 text-white'
                    }`}
                  >
                    <img 
                      alt="Avatar" 
                      src={`https://ui-avatars.com/api/?name=${user.name?.replace(/\s/g, '+')}&background=random&color=fff&bold=true`} 
                      className="w-7 h-7 rounded-full bg-gray-200"
                    />
                    <span className={`text-sm font-semibold ${scrolled || !isHomePage ? 'text-gray-700' : 'text-white'}`}>
                      {user.name?.split(' ')[0]}
                    </span>
                    <ChevronDown size={14} className={`transition-transform duration-300 ${userDropdownOpen ? 'rotate-180' : ''} ${scrolled || !isHomePage ? 'text-gray-400' : 'text-white/70'}`} />
                  </button>

                  {/* Dropdown menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100/50 py-2 z-50 transform origin-top-right transition-all">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs font-medium text-emerald-600 capitalize mt-0.5">{user.role}</p>
                      </div>
                      <div className="p-2">
                        <Link 
                          to="/profile" 
                          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors"
                          onClick={handleLinkClick}
                        >
                          <User size={16} /> My Profile
                        </Link>
                        <button 
                          onClick={onLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <LogOut size={16} /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link 
                    to="/login" 
                    className={`text-sm font-semibold px-4 py-2 rounded-full transition-all duration-300 ${
                      scrolled || !isHomePage 
                        ? 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50' 
                        : 'text-white hover:text-emerald-200'
                    }`}
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/signup" 
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-md hover:shadow-xl hover:shadow-emerald-500/20 transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <UserPlus size={16} /> Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 rounded-xl transition-colors ${
              scrolled || !isHomePage ? 'text-gray-600 hover:bg-gray-100' : 'text-white hover:bg-white/20'
            }`}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`fixed inset-y-0 right-0 z-50 w-full sm:w-80 bg-white shadow-2xl transform transition-transform duration-500 ease-in-out lg:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center justify-between mb-8">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600">Gully Clean</span>
            <div className="flex items-center gap-2">
              <InstallPWA />
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
          </div>

          {user && (
            <div className="flex items-center gap-4 mb-8 p-4 bg-emerald-50 rounded-2xl">
              <img 
                src={`https://ui-avatars.com/api/?name=${user.name?.replace(/\s/g, '+')}&background=random&color=fff&bold=true`} 
                alt="Avatar" 
                className="w-12 h-12 rounded-full shadow-sm"
              />
              <div>
                <p className="font-bold text-gray-900">{user.name}</p>
                <p className="text-xs font-semibold text-emerald-600 capitalize">{user.role}</p>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto space-y-2">
            {filteredNavLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-colors ${
                    isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <div className={`${link.to === location.pathname ? 'text-emerald-500' : 'text-gray-400'}`}>
                  {link.icon}
                </div>
                {link.text}
              </NavLink>
            ))}
          </div>

          <div className="pt-6 border-t border-gray-100 mt-auto">
            {user ? (
              <div className="space-y-2">
                <Link to="/profile" onClick={handleLinkClick} className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                  <User size={18} /> Profile Settings
                </Link>
                <button onClick={onLogout} className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors">
                  <LogOut size={18} /> Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link to="/login" onClick={handleLinkClick} className="flex items-center justify-center w-full px-4 py-3 rounded-xl border-2 border-emerald-500 text-emerald-600 font-bold hover:bg-emerald-50 transition-colors">
                  Sign In
                </Link>
                <Link to="/signup" onClick={handleLinkClick} className="flex items-center justify-center w-full px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-lg hover:shadow-xl transition-all">
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}
    </header>
  );
};

export default Header;