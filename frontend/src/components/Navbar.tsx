import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Home, 
  FileText, 
  Users, 
  User, 
  BarChart3, 
  Menu, 
  X,
  Settings,
  LogOut,
  ChevronDown,
  Zap,
  DollarSign,
  Mail,
  Building2,
  Shield,
  TrendingUp,
  Globe,
  Search,
  Bell
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle scroll effect with enhanced glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Features', href: '/#features', icon: Zap },
    { name: 'Pricing', href: '/#pricing', icon: DollarSign },
    { name: 'About', href: '/#about', icon: Users },
    { name: 'Contact', href: '/#contact', icon: Mail },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileDropdownOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'glass backdrop-blur-xl shadow-xl border-b border-white/20' 
        : 'bg-white/80 backdrop-blur-md border-b border-white/50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Enhanced Logo with Glow Effect */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-4 group">
              {/* Premium Gradient Logo with overlapping elements and glow */}
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 via-secondary-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-glow group-hover:shadow-glow-hover transition-all duration-500 group-hover:scale-110">
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                </div>
                {/* Enhanced floating elements with premium colors */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-teal-400 to-teal-500 rounded-full animate-pulse shadow-glow"></div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-r from-secondary-400 to-secondary-500 rounded-full animate-pulse delay-1000 shadow-glow"></div>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-secondary-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-teal-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                  Invoice Finance
                </span>
                <span className="text-xs text-medium font-medium bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                  Powered by FinTech
                </span>
              </div>
            </Link>
          </div>

          {/* Enhanced Desktop Navigation with Glassmorphism */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                    isActive(item.href)
                      ? 'text-white bg-gradient-to-r from-primary-600 via-secondary-600 to-teal-600 shadow-glow'
                      : 'text-medium hover:text-primary-600 hover:bg-white/50 backdrop-blur-sm'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-all duration-300 group-hover:scale-110 ${
                    isActive(item.href) ? 'text-white' : 'text-medium group-hover:text-primary-600'
                  }`} />
                  <span>{item.name}</span>
                  {isActive(item.href) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-secondary-600 to-teal-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  )}
                  {/* Hover underline effect */}
                  <div className={`absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-300 group-hover:w-full ${
                    isActive(item.href) ? 'w-full' : ''
                  }`}></div>
                </Link>
              );
            })}
          </div>

          {/* Enhanced Profile Section with Premium Styling */}
          <div className="flex items-center space-x-4">
            {/* Search Bar with Glassmorphism */}
            <div className="hidden md:block relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-medium" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-sm placeholder-medium focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-300"
                />
              </div>
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-medium hover:text-primary-600 hover:bg-white/20 rounded-xl transition-all duration-300 group">
              <Bell className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></div>
            </button>

            {user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  className="flex items-center space-x-3 p-3 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all duration-300 group border border-white/20"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                >
                  <div className="relative">
                    <Avatar className="w-9 h-9 ring-2 ring-white/30 group-hover:ring-primary-500/50 transition-all duration-300">
                      <AvatarImage src={user.profileImageUrl} alt={user.fullName || user.email} />
                      <AvatarFallback className="bg-gradient-to-br from-primary-500 via-secondary-500 to-teal-500 text-white font-semibold">
                        {user.fullName?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    {/* Enhanced online status indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-green-400 to-teal-500 border-2 border-white rounded-full shadow-glow"></div>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-semibold text-dark">{user.fullName || 'User'}</p>
                    <p className="text-xs text-medium">{user.roles?.[0] || 'Member'}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-medium transition-transform duration-300 ${
                    isProfileDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </Button>

                {/* Enhanced Profile Dropdown with Glassmorphism */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-72 glass rounded-2xl shadow-2xl border border-white/20 py-3 z-50 animate-in slide-in-from-top-2 duration-200">
                    {/* Enhanced User Info Header */}
                    <div className="px-4 py-3 border-b border-white/20">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12 ring-2 ring-primary-500/30">
                          <AvatarImage src={user.profileImageUrl} alt={user.fullName || user.email} />
                          <AvatarFallback className="bg-gradient-to-br from-primary-500 via-secondary-500 to-teal-500 text-white">
                            {user.fullName?.charAt(0) || user.email?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold text-dark">{user.fullName || 'User'}</p>
                          <p className="text-xs text-medium">{user.email}</p>
                        </div>
                      </div>
                      {user.kycStatus && (
                        <div className="mt-2">
                          <Badge variant={user.kycStatus === 'VERIFIED' ? 'default' : 'secondary'} className="text-xs bg-gradient-to-r from-green-500 to-teal-500 text-white border-0">
                            {user.kycStatus === 'VERIFIED' ? '✓ KYC Verified' : '⏳ KYC Pending'}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Enhanced Menu Items */}
                    <div className="py-2">
                      {[
                        { icon: BarChart3, label: 'Dashboard', href: '/dashboard', color: 'from-primary-500 to-primary-600' },
                        { icon: User, label: 'My Profile', href: '/profile', color: 'from-secondary-500 to-secondary-600' },
                        { icon: FileText, label: 'My Invoices', href: '/invoices', color: 'from-teal-500 to-teal-600' },
                        { icon: Settings, label: 'Settings', href: '/settings', color: 'from-medium to-medium' }
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.label}
                            to={item.href}
                            className="flex items-center space-x-3 px-4 py-3 text-sm text-medium hover:bg-white/20 transition-colors duration-200 group"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <div className={`w-8 h-8 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <span className="group-hover:text-dark transition-colors duration-200">{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>

                    {/* Enhanced Divider */}
                    <div className="border-t border-white/20 my-2"></div>

                    {/* Enhanced Logout */}
                    <div className="px-4">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50/20 rounded-xl transition-colors duration-200 group"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                          <LogOut className="w-4 h-4 text-white" />
                        </div>
                        <span className="group-hover:text-red-700 transition-colors duration-200">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-medium hover:text-primary-600 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl transition-all duration-300 border border-white/20">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-gradient-to-r from-primary-600 via-secondary-600 to-teal-600 hover:from-primary-700 hover:via-secondary-700 hover:to-teal-700 text-white px-6 py-2 rounded-xl shadow-glow hover:shadow-glow-hover transition-all duration-300 transform hover:scale-105">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Enhanced Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all duration-300 border border-white/20"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation with Glassmorphism */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-white/20 py-4 animate-in slide-in-from-top-2 duration-200">
            {/* Mobile Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-medium" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-sm placeholder-medium focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-300"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive(item.href)
                        ? 'text-white bg-gradient-to-r from-primary-600 via-secondary-600 to-teal-600 shadow-glow'
                        : 'text-medium hover:text-primary-600 hover:bg-white/20 backdrop-blur-sm'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
