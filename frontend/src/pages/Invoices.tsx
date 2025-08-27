import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  Filter, 
  Plus, 
  FileText, 
  Eye, 
  Edit, 
  Trash2, 
  Download,
  Calendar,
  DollarSign,
  Building,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ArrowUpDown,
  MoreHorizontal,
  Star,
  Heart,
  Share2,
  BarChart3,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  buyerName: string;
  buyerGstin?: string;
  invoiceDate: string;
  dueDate: string;
  invoiceAmount: number;
  requestedAmount: number;
  minAcceptAmount: number;
  expectedInterestRate: number;
  currency: string;
  location?: string;
  status: string;
  type: string;
  createdAt: string;
  isFavorited?: boolean;
}

const Invoices: React.FC = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockInvoices: Invoice[] = [
      {
        id: '1',
        invoiceNumber: 'INV-2024-001',
        buyerName: 'Tech Solutions Ltd',
        buyerGstin: '27AABCT1234Z1Z5',
        invoiceDate: '2024-01-15',
        dueDate: '2024-02-15',
        invoiceAmount: 250000,
        requestedAmount: 200000,
        minAcceptAmount: 180000,
        expectedInterestRate: 12.5,
        currency: 'INR',
        location: 'Mumbai, Maharashtra',
        status: 'OPEN',
        type: 'TRADE',
        createdAt: '2024-01-15T10:00:00Z',
        isFavorited: true
      },
      {
        id: '2',
        invoiceNumber: 'INV-2024-002',
        buyerName: 'Global Exports',
        buyerGstin: '29DEFGH5678Y9Y3',
        invoiceDate: '2024-01-18',
        dueDate: '2024-02-18',
        invoiceAmount: 180000,
        requestedAmount: 150000,
        minAcceptAmount: 135000,
        expectedInterestRate: 11.8,
        currency: 'INR',
        location: 'Delhi, NCR',
        status: 'FUNDED',
        type: 'SERVICE',
        createdAt: '2024-01-18T14:30:00Z',
        isFavorited: false
      },
      {
        id: '3',
        invoiceNumber: 'INV-2024-003',
        buyerName: 'Innovation Corp',
        buyerGstin: '33IJKLM9012X7X1',
        invoiceDate: '2024-01-20',
        dueDate: '2024-02-20',
        invoiceAmount: 320000,
        requestedAmount: 280000,
        minAcceptAmount: 252000,
        expectedInterestRate: 13.2,
        currency: 'INR',
        location: 'Bangalore, Karnataka',
        status: 'PENDING',
        type: 'MIXED',
        createdAt: '2024-01-20T09:15:00Z',
        isFavorited: true
      },
      {
        id: '4',
        invoiceNumber: 'INV-2024-004',
        buyerName: 'Manufacturing Plus',
        buyerGstin: '22NOPQR3456W5W9',
        invoiceDate: '2024-01-22',
        dueDate: '2024-02-22',
        invoiceAmount: 450000,
        requestedAmount: 400000,
        minAcceptAmount: 360000,
        expectedInterestRate: 12.0,
        currency: 'INR',
        location: 'Chennai, Tamil Nadu',
        status: 'OPEN',
        type: 'TRADE',
        createdAt: '2024-01-22T16:45:00Z',
        isFavorited: false
      }
    ];
    
    setInvoices(mockInvoices);
    setFilteredInvoices(mockInvoices);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = invoices;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(invoice =>
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.buyerGstin?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(invoice => invoice.type === typeFilter);
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Invoice];
      let bValue: any = b[sortBy as keyof Invoice];

      if (sortBy === 'createdAt' || sortBy === 'invoiceDate' || sortBy === 'dueDate') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredInvoices(filtered);
  }, [invoices, searchTerm, statusFilter, typeFilter, sortBy, sortOrder]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'FUNDED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <Clock className="w-4 h-4" />;
      case 'FUNDED':
        return <CheckCircle className="w-4 h-4" />;
      case 'PENDING':
        return <AlertCircle className="w-4 h-4" />;
      case 'CLOSED':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'TRADE':
        return 'bg-purple-100 text-purple-800';
      case 'SERVICE':
        return 'bg-indigo-100 text-indigo-800';
      case 'MIXED':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleFavorite = (invoiceId: string) => {
    setInvoices(prev => prev.map(invoice =>
      invoice.id === invoiceId
        ? { ...invoice, isFavorited: !invoice.isFavorited }
        : invoice
    ));
  };

  const getDaysLeft = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `${diffDays} days left`;
  };

  const getDaysLeftColor = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-red-600';
    if (diffDays <= 7) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Invoice Management</h1>
            <p className="text-gray-600">
              Manage your invoices, track financing requests, and monitor your cash flow
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link to="/invoices/new" className="btn btn-primary">
              <Plus className="w-4 h-4" />
              Create Invoice
            </Link>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FileText className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Invoices</p>
                <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +12% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Open Requests</p>
                <p className="text-2xl font-bold text-gray-900">
                  {invoices.filter(i => i.status === 'OPEN').length}
                </p>
                <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3" />
                  Awaiting funding
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(invoices.reduce((sum, i) => sum + i.invoiceAmount, 0))}
                </p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +8% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Funded Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(invoices.filter(i => i.status === 'FUNDED').reduce((sum, i) => sum + i.requestedAmount, 0))}
                </p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <CheckCircle className="w-3 h-3" />
                  Successfully funded
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search invoices, buyers, or GSTIN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="OPEN">Open</option>
              <option value="PENDING">Pending</option>
              <option value="FUNDED">Funded</option>
              <option value="CLOSED">Closed</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="TRADE">Trade</option>
              <option value="SERVICE">Service</option>
              <option value="MIXED">Mixed</option>
            </select>

            {/* Sort */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order as 'asc' | 'desc');
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="invoiceAmount-desc">Amount High to Low</option>
              <option value="invoiceAmount-asc">Amount Low to High</option>
              <option value="dueDate-asc">Due Date</option>
            </select>
          </div>
        </div>

        {/* Invoices Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInvoices.map((invoice) => (
              <div key={invoice.id} className="card group hover:scale-105 transition-all duration-300">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
                      {getStatusIcon(invoice.status)}
                      {invoice.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(invoice.type)}`}>
                      {invoice.type}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFavorite(invoice.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        invoice.isFavorited 
                          ? 'text-red-500 bg-red-50' 
                          : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${invoice.isFavorited ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Invoice Number */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">{invoice.invoiceNumber}</h3>

                {/* Buyer Info */}
                <div className="flex items-center gap-2 mb-3">
                  <Building className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 font-medium">{invoice.buyerName}</span>
                </div>

                {/* Amount */}
                <div className="mb-4">
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {formatCurrency(invoice.invoiceAmount)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Requesting: {formatCurrency(invoice.requestedAmount)}
                  </p>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Due: {formatDate(invoice.dueDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>Rate: {invoice.expectedInterestRate}%</span>
                  </div>
                  {invoice.location && (
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      <span>{invoice.location}</span>
                    </div>
                  )}
                </div>

                {/* Due Date Warning */}
                <div className={`text-sm font-medium mb-4 ${getDaysLeftColor(invoice.dueDate)}`}>
                  {getDaysLeft(invoice.dueDate)}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    to={`/invoices/${invoice.id}`}
                    className="btn btn-primary btn-sm flex-1"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </Link>
                  <button className="btn btn-outline btn-sm">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Invoice</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Buyer</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Due Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
                          <p className="text-sm text-gray-500">{formatDate(invoice.createdAt)}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{invoice.buyerName}</p>
                          {invoice.buyerGstin && (
                            <p className="text-sm text-gray-500">{invoice.buyerGstin}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{formatCurrency(invoice.invoiceAmount)}</p>
                          <p className="text-sm text-gray-500">
                            Request: {formatCurrency(invoice.requestedAmount)}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{formatDate(invoice.dueDate)}</p>
                          <p className={`text-sm font-medium ${getDaysLeftColor(invoice.dueDate)}`}>
                            {getDaysLeft(invoice.dueDate)}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
                          {getStatusIcon(invoice.status)}
                          {invoice.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(invoice.type)}`}>
                          {invoice.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/invoices/${invoice.id}`}
                            className="btn btn-primary btn-sm"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Link>
                          <button
                            onClick={() => toggleFavorite(invoice.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              invoice.isFavorited 
                                ? 'text-red-500 bg-red-50' 
                                : 'text-gray-400 hover:text-red-500 hover:bg-gray-50'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${invoice.isFavorited ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredInvoices.length === 0 && (
          <div className="card text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No invoices found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your filters or search terms'
                : 'Get started by creating your first invoice'
              }
            </p>
            <Link to="/invoices/new" className="btn btn-primary">
              <Plus className="w-4 h-4" />
              Create Invoice
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoices;

