import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FinancingRequest, FundingOffer } from '../../types';
import { api } from '../../lib/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { 
  Search, 
  Filter, 
  DollarSign, 
  Calendar, 
  Building, 
  FileText,
  Eye,
  TrendingUp
} from 'lucide-react';

const Marketplace: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<FinancingRequest[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<FinancingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [maxRate, setMaxRate] = useState('');
  const [tenorDays, setTenorDays] = useState('');

  useEffect(() => {
    if (user?.roles.includes('LENDER')) {
      fetchInvoices();
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [invoices, searchTerm, minAmount, maxAmount, maxRate, tenorDays]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch real invoices from marketplace API
      const response = await api.getMarketplaceInvoices({
        minAmount: minAmount || undefined,
        maxAmount: maxAmount || undefined,
        search: searchTerm || undefined,
      });
      
      if (response.success && response.data) {
        setInvoices(response.data);
      } else {
        setError(response.message || 'Failed to fetch marketplace invoices');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...invoices];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(invoice =>
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.buyerGstin?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Amount filters
    if (minAmount) {
      filtered = filtered.filter(invoice => invoice.requestedAmount >= parseFloat(minAmount));
    }
    if (maxAmount) {
      filtered = filtered.filter(invoice => invoice.requestedAmount <= parseFloat(maxAmount));
    }

    // Rate filter (if we had rate information)
    if (maxRate) {
      // filtered = filtered.filter(invoice => invoice.maxRate <= parseFloat(maxRate));
    }

    // Tenor filter
    if (tenorDays) {
      const days = parseInt(tenorDays);
      filtered = filtered.filter(invoice => {
        const dueDate = new Date(invoice.dueDate);
        const invoiceDate = new Date(invoice.invoiceDate);
        const diffTime = dueDate.getTime() - invoiceDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= days;
      });
    }

    setFilteredInvoices(filtered);
  };

  const calculateTenorDays = (invoice: FinancingRequest) => {
    const dueDate = new Date(invoice.dueDate);
    const invoiceDate = new Date(invoice.invoiceDate);
    const diffTime = dueDate.getTime() - invoiceDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleMakeOffer = (invoice: FinancingRequest) => {
    navigate(`/offers/create/${invoice.id}`);
  };

  const handleViewDetails = (invoice: FinancingRequest) => {
    navigate(`/invoices/${invoice.id}`);
  };

  if (!user?.roles.includes('LENDER')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">Only lenders can access the marketplace.</p>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchInvoices}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Invoice Marketplace</h1>
            <p className="text-gray-600 mt-2">
              Discover financing opportunities and make funding offers
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            <Filter className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Invoice, buyer, GSTIN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="minAmount">Min Amount (₹)</Label>
              <Input
                id="minAmount"
                type="number"
                placeholder="0"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="maxAmount">Max Amount (₹)</Label>
              <Input
                id="maxAmount"
                type="number"
                placeholder="1000000"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="maxRate">Max Rate (% p.a.)</Label>
              <Input
                id="maxRate"
                type="number"
                placeholder="18"
                value={maxRate}
                onChange={(e) => setMaxRate(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="tenorDays">Max Tenor (Days)</Label>
              <Input
                id="tenorDays"
                type="number"
                placeholder="90"
                value={tenorDays}
                onChange={(e) => setTenorDays(e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* Results */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {filteredInvoices.length} Financing Request{filteredInvoices.length !== 1 ? 's' : ''} Found
          </h3>
        </div>

        {/* Invoice Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredInvoices.map((invoice) => (
            <Card key={invoice.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">
                    {invoice.invoiceNumber}
                  </span>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  invoice.status === 'LISTED' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {invoice.status}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                {/* Borrower Information */}
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-xs text-blue-600 font-medium mb-1">Borrower</div>
                  <div className="text-sm font-medium text-gray-900">
                    {invoice.borrowerCompanyName || invoice.borrowerFullName || 'N/A'}
                  </div>
                  {invoice.borrowerCompanyName && invoice.borrowerFullName && (
                    <div className="text-xs text-gray-600">{invoice.borrowerFullName}</div>
                  )}
                </div>

                {/* Buyer Information */}
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Buyer: {invoice.buyerName}</span>
                </div>
                
                {invoice.buyerGstin && (
                  <div className="text-xs text-gray-500">
                    GSTIN: {invoice.buyerGstin}
                  </div>
                )}

                {/* Expected Interest Rate - Highlight this prominently */}
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-800">Expected Rate</span>
                    <span className="text-lg font-bold text-green-600">
                      {invoice.expectedInterestRate}% p.a.
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Due: {new Date(invoice.dueDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Amount: ₹{invoice.invoiceAmount.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Requested: ₹{invoice.requestedAmount.toLocaleString()}
                  </span>
                </div>

                <div className="text-xs text-gray-500">
                  Tenor: {calculateTenorDays(invoice)} days
                </div>

                {invoice.location && (
                  <div className="text-xs text-gray-500">
                    Location: {invoice.location}
                  </div>
                )}

                {/* Download Invoice PDF */}
                {invoice.documentDownloadUrl && (
                  <div className="pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(invoice.documentDownloadUrl, '_blank')}
                      className="w-full"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Invoice PDF
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(invoice)}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleMakeOffer(invoice)}
                  className="flex-1"
                >
                  Make Offer
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
            <p className="text-gray-600">
              Try adjusting your filters or check back later for new opportunities.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;




