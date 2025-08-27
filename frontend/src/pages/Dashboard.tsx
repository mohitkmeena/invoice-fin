import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  FileText, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Eye,
  ArrowRight,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Target,
  Award,
  Zap,
  Shield,
  Globe
} from 'lucide-react';

interface DashboardStats {
  totalInvoices: number;
  activeOffers: number;
  totalFunding: number;
  pendingAmount: number;
  completedDeals: number;
  kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  // Mock data for demonstration
  const stats = {
    totalInvoices: 24,
    activeOffers: 8,
    totalFunding: 1250000,
    pendingAmount: 450000,
    kycStatus: 'PENDING'
  };

  // Enhanced main stats data
  const mainStats = [
    {
      label: 'Total Invoices',
      value: stats.totalInvoices,
      change: '+12% from last month',
      trend: 'up' as const,
      icon: FileText
    },
    {
      label: 'Active Offers',
      value: stats.activeOffers,
      change: `${stats.activeOffers} pending review`,
      trend: 'up' as const,
      icon: Target
    },
    {
      label: 'Total Funding',
      value: formatCurrency(stats.totalFunding),
      change: '+8% from last month',
      trend: 'up' as const,
      icon: DollarSign
    },
    {
      label: 'Pending Amount',
      value: formatCurrency(stats.pendingAmount),
      change: 'Due in 15 days',
      trend: 'down' as const,
      icon: Clock
    }
  ];

  const recentInvoices = [
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      buyerName: 'Tech Solutions Ltd',
      amount: 250000,
      dueDate: '2024-02-15',
      status: 'OPEN',
      daysLeft: 12
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-002',
      buyerName: 'Global Exports',
      amount: 180000,
      dueDate: '2024-02-20',
      status: 'FUNDED',
      daysLeft: 17
    },
    {
      id: '3',
      invoiceNumber: 'INV-2024-003',
      buyerName: 'Innovation Corp',
      amount: 320000,
      dueDate: '2024-02-25',
      status: 'PENDING',
      daysLeft: 22
    }
  ];

  const recentOffers = [
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      lenderName: 'Capital Bank',
      amount: 250000,
      interestRate: 12.5,
      status: 'ACTIVE'
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-002',
      lenderName: 'Finance Corp',
      amount: 180000,
      interestRate: 11.8,
      status: 'ACCEPTED'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-blue-100 text-blue-800';
      case 'FUNDED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ACTIVE':
        return 'bg-purple-100 text-purple-800';
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="container py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="card glass bg-gradient-to-br from-primary-50/50 via-white to-secondary-50/50 border-0">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-dark mb-2">
                  Welcome back, <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-teal-600 bg-clip-text text-transparent">
                    {user?.fullName || user?.email || 'User'}
                  </span>! 👋
                </h1>
                <p className="text-medium text-lg">
                  Here's what's happening with your invoice financing today.
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm text-medium">Current Balance</div>
                  <div className="text-2xl font-bold text-dark">₹2,45,000</div>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 via-secondary-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-glow">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KYC Status Alert */}
        {user?.kycStatus !== 'VERIFIED' && (
          <div className="mb-8">
            <div className="card bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-glow">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-1">Complete Your KYC Verification</h3>
                  <p className="text-yellow-700">
                    Verify your identity to unlock full platform access and higher funding limits.
                  </p>
                </div>
                <Link to="/profile" className="btn btn-secondary btn-sm">
                  Complete KYC
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mainStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="card glass group hover:scale-105 transition-all duration-500 delay-100 group-hover:shadow-glow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-medium text-sm font-medium mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-dark group-hover:text-primary-600 transition-colors duration-300">{stat.value}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <TrendingUp className={`w-4 h-4 ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                      <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 via-secondary-500 to-teal-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-glow group-hover:shadow-glow-hover">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts and Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Funding Trend Chart */}
          <div className="card lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Funding Trend</h3>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">This Month</span>
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-gray-600">Last Month</span>
              </div>
            </div>
            <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <p className="text-gray-600">Interactive chart coming soon</p>
                <p className="text-sm text-gray-500">Monthly funding trends and analytics</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/invoices/new" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Create Invoice</p>
                  <p className="text-sm text-gray-600">Upload new invoice for financing</p>
                </div>
              </Link>
              
              <Link to="/offers" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">View Offers</p>
                  <p className="text-sm text-gray-600">Check financing offers</p>
                </div>
              </Link>
              
              <Link to="/profile" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Complete KYC</p>
                  <p className="text-sm text-gray-600">Verify your identity</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Invoices */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Invoices</h3>
              <Link to="/invoices" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
                      <p className="text-sm text-gray-600">{invoice.buyerName}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(invoice.amount)}</p>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                      <span className="text-xs text-gray-500">{invoice.daysLeft} days left</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Offers */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Offers</h3>
              <Link to="/offers" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentOffers.map((offer) => (
                <div key={offer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{offer.invoiceNumber}</p>
                      <p className="text-sm text-gray-600">{offer.lenderName}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(offer.amount)}</p>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(offer.status)}`}>
                        {offer.status}
                      </span>
                      <span className="text-xs text-gray-500">{offer.interestRate}% rate</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Metrics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.completedDeals}</p>
              <p className="text-sm text-gray-600">Completed Deals</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">98.5%</p>
              <p className="text-sm text-gray-600">Success Rate</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">24hrs</p>
              <p className="text-sm text-gray-600">Avg. Processing</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">4.9/5</p>
              <p className="text-sm text-gray-600">Customer Rating</p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 text-center">
          <div className="card bg-gradient-to-r from-blue-600 to-purple-700 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Scale Your Business?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Get instant access to working capital and grow your business with our 
              innovative invoice financing solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/invoices/new" className="btn bg-white text-blue-600 hover:bg-gray-100">
                Create New Invoice
              </Link>
              <Link to="/contact" className="btn btn-outline border-white text-white hover:bg-white hover:text-blue-600">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;