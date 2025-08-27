import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  Building, 
  Calendar, 
  DollarSign, 
  Download,
  Heart,
  TrendingUp,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  Star,
  Eye,
  Percent
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api, Invoice } from '../lib/api';

interface FundingOffer {
  id: string;
  invoiceId: string;
  lenderUserId: string;
  offerAmount: number;
  interestRatePa: number;
  processingFee: number;
  tenorDays: number;
  validUntil: string;
  notes?: string;
  status: string;
  createdAt: string;
}

interface Deal {
  id: string;
  invoiceId: string;
  status: string;
  contactsUnlocked: boolean;
  borrowerContact?: {
    fullName: string;
    companyName: string;
    email: string;
    phone: string;
    address?: string;
    kycVerified: boolean;
  };
  lenderContact?: {
    fullName: string;
    companyName: string;
    email: string;
    phone: string;
    address?: string;
    kycVerified: boolean;
  };
}

// Enhanced UI Components with Beautiful Styling
const Button: React.FC<{ 
  children: React.ReactNode; 
  onClick?: () => void; 
  variant?: 'primary' | 'outline' | 'ghost' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}> = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, className = '' }) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl focus:ring-blue-500',
    outline: 'border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-md hover:shadow-lg focus:ring-gray-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    success: 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl focus:ring-green-500',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl focus:ring-red-500'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

const Card: React.FC<{ children: React.ReactNode; className?: string; hover?: boolean }> = ({ 
  children, 
  className = '', 
  hover = false 
}) => (
  <div className={`bg-white rounded-xl border border-gray-200 shadow-lg ${hover ? 'hover:shadow-xl transition-shadow duration-300' : ''} ${className}`}>
    {children}
  </div>
);

const Badge: React.FC<{ children: React.ReactNode; variant?: 'success' | 'warning' | 'info' | 'danger' }> = ({ 
  children, 
  variant = 'info' 
}) => {
  const variants = {
    success: 'bg-green-100 text-green-800 border border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    info: 'bg-blue-100 text-blue-800 border border-blue-200',
    danger: 'bg-red-100 text-red-800 border border-red-200'
  };
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

const Input: React.FC<{
  id?: string;
  type?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  min?: string | number;
  max?: string | number;
  step?: string;
  className?: string;
}> = ({ className = '', ...props }) => (
  <input
    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-500 transition-all duration-200 ${className}`}
    {...props}
  />
);

const Label: React.FC<{ htmlFor?: string; children: React.ReactNode }> = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="block text-sm font-semibold text-gray-700 mb-2">
    {children}
  </label>
);

const InvoiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [offers, setOffers] = useState<FundingOffer[]>([]);
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerLoading, setOfferLoading] = useState(false);
  
  const [offerForm, setOfferForm] = useState({
    offerAmount: 0,
    interestRatePa: 0,
    processingFee: 0,
    tenorDays: 30,
    validUntil: '',
    notes: ''
  });

  useEffect(() => {
    if (id) {
      fetchInvoiceDetails();
      fetchOffers();
      fetchDeal();
    }
  }, [id]);

  const fetchInvoiceDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.getInvoice(id!);
      
      if (response.success && response.data) {
        setInvoice(response.data);
        // Initialize offer form with invoice data
        const defaultValidUntil = new Date();
        defaultValidUntil.setDate(defaultValidUntil.getDate() + 7); // Default to 7 days from now
        
        setOfferForm(prev => ({
          ...prev,
          offerAmount: response.data!.requestedAmount,
          interestRatePa: response.data!.expectedInterestRate || 12,
          validUntil: defaultValidUntil.toISOString().slice(0, 16) // Format for datetime-local input
        }));
      } else {
        setError(response.message || 'Failed to fetch invoice details');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch invoice details');
      console.error('Error fetching invoice:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOffers = async () => {
    try {
      const response = await api.getInvoiceOffers(id!);
      if (response.success && response.data) {
        setOffers(response.data);
      }
    } catch (err) {
      console.error('Error fetching offers:', err);
    }
  };

  const fetchDeal = async () => {
    try {
      const response = await api.getMyDeals();
      if (response.success && response.data) {
        // Find deal for this invoice (backend uses financingRequestId)
        const invoiceDeal = response.data.find((d: any) => d.financingRequestId === id);
        if (invoiceDeal) {
          setDeal(invoiceDeal);
        }
      }
    } catch (err) {
      console.error('Error fetching deal:', err);
    }
  };

  const handleMakeOffer = async () => {
    if (!user?.roles.includes('LENDER')) {
      alert('Only lenders can make offers');
      return;
    }

    try {
      setOfferLoading(true);
      
      const response = await api.createOffer({
        financingRequestId: id!,
        offerAmount: offerForm.offerAmount,
        interestRatePa: offerForm.interestRatePa,
        processingFee: offerForm.processingFee,
        tenorDays: offerForm.tenorDays,
        validUntil: new Date(offerForm.validUntil).toISOString(),
        notes: offerForm.notes
      });

      if (response.success) {
        setShowOfferModal(false);
        await fetchOffers();
        alert('Offer submitted successfully!');
      } else {
        alert('Failed to submit offer: ' + response.message);
      }
    } catch (err: any) {
      alert('Failed to submit offer: ' + err.message);
    } finally {
      setOfferLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const response = isFavorite 
        ? await api.removeFromFavorites(id!)
        : await api.addToFavorites(id!);
      
      if (response.success) {
        setIsFavorite(!isFavorite);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handleAcceptOffer = async (offerId: string) => {
    if (!user?.roles.includes('BORROWER')) {
      alert('Only borrowers can accept offers');
      return;
    }

    if (!window.confirm('Are you sure you want to accept this offer? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await api.acceptOffer(offerId);
      if (response.success) {
        alert('Offer accepted successfully! A deal has been created. Complete your KYC to unlock contact details.');
        // Refresh data
        await Promise.all([fetchInvoiceDetails(), fetchOffers(), fetchDeal()]);
      } else {
        alert('Failed to accept offer: ' + response.message);
      }
    } catch (err: any) {
      alert('Failed to accept offer: ' + err.message);
    }
  };

  const calculateNetAmount = () => {
    return offerForm.offerAmount - offerForm.processingFee;
  };

  const calculateTenorDays = () => {
    if (!invoice) return 0;
    const invoiceDate = new Date(invoice.invoiceDate);
    const dueDate = new Date(invoice.dueDate);
    const diffTime = Math.abs(dueDate.getTime() - invoiceDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading invoice details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <Card className="max-w-md w-full p-8 text-center">
          <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Error Loading Invoice</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <div className="space-y-3">
            <Button onClick={fetchInvoiceDetails} className="w-full">
              <TrendingUp className="w-4 h-4 mr-2" />
              Retry
            </Button>
            <Button variant="outline" onClick={() => navigate('/invoices')} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Invoices
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <Card className="max-w-md w-full p-8 text-center">
          <FileText className="w-20 h-20 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Invoice Not Found</h2>
          <p className="text-gray-600 mb-8">The invoice you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/invoices')} className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Invoices
          </Button>
        </Card>
      </div>
    );
  }

  const isLender = user?.roles.includes('LENDER');
  const isBorrower = user?.roles.includes('BORROWER');
  const isMyInvoice = isBorrower && invoice.borrowerUserId === user?.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(-1)}
                className="text-white border-white hover:bg-white hover:text-blue-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  Invoice {invoice.invoiceNumber}
                </h1>
                <p className="text-blue-100 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Created {new Date(invoice.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              {isLender && (
                <>
                  <Button
                    variant="outline"
                    onClick={handleToggleFavorite}
                    className="text-white border-white hover:bg-white hover:text-blue-600"
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'text-red-500 fill-current' : ''}`} />
                    {isFavorite ? 'Favorited' : 'Add to Favorites'}
                  </Button>
                  
                  <Button
                    variant="success"
                    onClick={() => setShowOfferModal(true)}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Make Offer
                  </Button>
                </>
              )}
              
              {invoice.documentDownloadUrl && (
                <Button
                  variant="outline"
                  onClick={() => window.open(invoice.documentDownloadUrl, '_blank')}
                  className="text-white border-white hover:bg-white hover:text-blue-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Invoice Information Card */}
            <Card className="p-8" hover>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <FileText className="w-6 h-6 mr-3 text-blue-600" />
                  Invoice Details
                </h2>
                <Badge variant={invoice.status === 'OPEN' ? 'success' : 'warning'}>
                  {invoice.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Type</div>
                          <div className="font-medium">{invoice.type}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Due Date</div>
                          <div className="font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <DollarSign className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Currency</div>
                          <div className="font-medium">{invoice.currency}</div>
                        </div>
                      </div>
                      {invoice.location && (
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <MapPin className="w-5 h-5 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-500">Location</div>
                            <div className="font-medium">{invoice.location}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Buyer Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                        <Building className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-sm text-blue-600">Company</div>
                          <div className="font-semibold text-gray-900">{invoice.buyerName}</div>
                        </div>
                      </div>
                      {invoice.buyerGstin && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-500">GSTIN</div>
                          <div className="font-mono text-sm">{invoice.buyerGstin}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Amount Breakdown Card */}
            <Card className="p-8" hover>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <DollarSign className="w-6 h-6 mr-3 text-green-600" />
                Amount Breakdown
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-blue-100">Invoice Amount</div>
                    <Eye className="w-5 h-5 text-blue-200" />
                  </div>
                  <div className="text-3xl font-bold">
                    ₹{invoice.invoiceAmount.toLocaleString()}
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-green-100">Requested Amount</div>
                    <TrendingUp className="w-5 h-5 text-green-200" />
                  </div>
                  <div className="text-3xl font-bold">
                    ₹{invoice.requestedAmount.toLocaleString()}
                  </div>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-orange-100">Min Accept Amount</div>
                    <Star className="w-5 h-5 text-orange-200" />
                  </div>
                  <div className="text-3xl font-bold">
                    ₹{invoice.minAcceptAmount.toLocaleString()}
                  </div>
                </div>
              </div>
            </Card>

            {/* Offers Section (for borrowers) */}
            {isMyInvoice && (
              <Card className="p-8" hover>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-3 text-purple-600" />
                  Funding Offers
                </h2>
                
                {offers.length > 0 ? (
                  <div className="space-y-4">
                    {offers.map((offer) => (
                      <div key={offer.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="text-2xl font-bold text-green-600">₹{offer.offerAmount.toLocaleString()}</div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span className="flex items-center">
                                <Percent className="w-4 h-4 mr-1" />
                                {offer.interestRatePa}% p.a.
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {offer.tenorDays} days
                              </span>
                            </div>
                            {offer.notes && (
                              <div className="text-gray-700 bg-gray-50 p-3 rounded-lg mt-3">{offer.notes}</div>
                            )}
                          </div>
                          <div className="flex space-x-3">
                            <Button 
                              size="sm" 
                              variant="success"
                              onClick={() => handleAcceptOffer(offer.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Accept
                            </Button>
                            <Button variant="outline" size="sm">
                              Negotiate
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No offers received yet</h3>
                    <p className="text-gray-600">Lenders will see your invoice in the marketplace and can make offers.</p>
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Expected Interest Rate */}
            <Card className="p-6 text-center" hover>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center justify-center">
                <Percent className="w-5 h-5 mr-2 text-green-600" />
                Expected Interest Rate
              </h3>
              <div className="bg-gradient-to-r from-green-100 to-green-200 p-6 rounded-xl">
                <div className="text-5xl font-bold text-green-700 mb-2">
                  {invoice.expectedInterestRate}%
                </div>
                <div className="text-green-600 font-medium">per annum</div>
                <div className="text-xs text-green-500 mt-2 flex items-center justify-center">
                  <Clock className="w-3 h-3 mr-1" />
                  Tenor: {calculateTenorDays()} days
                </div>
              </div>
            </Card>

            {/* Borrower Information */}
            <Card className="p-6" hover>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Borrower
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Building className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-sm text-blue-600">Company</div>
                    <div className="font-semibold text-gray-900">
                      {invoice.borrowerCompanyName || invoice.borrowerFullName || 'Company Name'}
                    </div>
                  </div>
                </div>
                {invoice.borrowerCompanyName && invoice.borrowerFullName && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="text-sm text-gray-500">Contact Person</div>
                      <div className="font-medium text-gray-900">{invoice.borrowerFullName}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Information Section */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                {deal ? (
                  <>
                    {deal.contactsUnlocked ? (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                          Contact Details Unlocked
                        </h4>
                        <div className="space-y-3">
                          {isLender && deal.borrowerContact && (
                            <>
                              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                                <Mail className="w-4 h-4 text-green-600" />
                                <a 
                                  href={`mailto:${deal.borrowerContact.email}`}
                                  className="text-sm text-green-700 hover:text-green-800 font-medium"
                                >
                                  {deal.borrowerContact.email}
                                </a>
                              </div>
                              {deal.borrowerContact.phone && (
                                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                                  <Phone className="w-4 h-4 text-green-600" />
                                  <a 
                                    href={`tel:${deal.borrowerContact.phone}`}
                                    className="text-sm text-green-700 hover:text-green-800 font-medium"
                                  >
                                    {deal.borrowerContact.phone}
                                  </a>
                                </div>
                              )}
                            </>
                          )}
                          {isBorrower && deal.lenderContact && (
                            <>
                              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                                <Mail className="w-4 h-4 text-green-600" />
                                <a 
                                  href={`mailto:${deal.lenderContact.email}`}
                                  className="text-sm text-green-700 hover:text-green-800 font-medium"
                                >
                                  {deal.lenderContact.email}
                                </a>
                              </div>
                              {deal.lenderContact.phone && (
                                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                                  <Phone className="w-4 h-4 text-green-600" />
                                  <a 
                                    href={`tel:${deal.lenderContact.phone}`}
                                    className="text-sm text-green-700 hover:text-green-800 font-medium"
                                  >
                                    {deal.lenderContact.phone}
                                  </a>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                        <h4 className="text-sm font-semibold text-yellow-800 mb-1">KYC Verification Pending</h4>
                        <p className="text-xs text-yellow-700">
                          Contact details will be revealed once both parties complete KYC verification.
                        </p>
                        <div className="mt-3 text-xs">
                          <div className="text-yellow-600">Deal Status: {deal.status}</div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No active deal for this invoice</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Status Card */}
            <Card className="p-6" hover>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Status</h3>
              <div className="space-y-4">
                <div className="text-center">
                  <Badge variant={invoice.status === 'OPEN' ? 'success' : 'warning'}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {invoice.status}
                  </Badge>
                </div>
                <div className="text-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  Last updated: {new Date(invoice.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Make Offer Modal */}
        {showOfferModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                <TrendingUp className="w-8 h-8 inline mr-3 text-blue-600" />
                Make Funding Offer
              </h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="offerAmount">Offer Amount (₹)</Label>
                    <Input
                      id="offerAmount"
                      type="number"
                      value={offerForm.offerAmount}
                      onChange={(e) => setOfferForm(prev => ({ ...prev, offerAmount: parseFloat(e.target.value) || 0 }))}
                      min={invoice.minAcceptAmount}
                      max={invoice.requestedAmount}
                    />
                    <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded">
                      Min: ₹{invoice.minAcceptAmount.toLocaleString()} • Max: ₹{invoice.requestedAmount.toLocaleString()}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="interestRate">Interest Rate (% p.a.)</Label>
                    <Input
                      id="interestRate"
                      type="number"
                      step="0.01"
                      value={offerForm.interestRatePa}
                      onChange={(e) => setOfferForm(prev => ({ ...prev, interestRatePa: parseFloat(e.target.value) || 0 }))}
                      min="0.01"
                      max="36"
                    />
                    <div className="text-xs text-gray-500 mt-2 p-2 bg-blue-50 rounded">
                      Borrower expects: {invoice.expectedInterestRate}% p.a.
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="processingFee">Processing Fee (₹)</Label>
                    <Input
                      id="processingFee"
                      type="number"
                      value={offerForm.processingFee}
                      onChange={(e) => setOfferForm(prev => ({ ...prev, processingFee: parseFloat(e.target.value) || 0 }))}
                      min="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tenorDays">Tenor (Days)</Label>
                    <Input
                      id="tenorDays"
                      type="number"
                      value={offerForm.tenorDays}
                      onChange={(e) => setOfferForm(prev => ({ ...prev, tenorDays: parseInt(e.target.value) || 30 }))}
                      min="1"
                      max="365"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="validUntil">Valid Until</Label>
                  <Input
                    id="validUntil"
                    type="datetime-local"
                    value={offerForm.validUntil}
                    onChange={(e) => setOfferForm(prev => ({ ...prev, validUntil: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <textarea
                    id="notes"
                    value={offerForm.notes}
                    onChange={(e) => setOfferForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-500 transition-all duration-200"
                    rows={4}
                    placeholder="Any additional terms or conditions..."
                  />
                </div>

                {/* Net Amount Summary */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-blue-200">
                  <div className="text-lg font-bold text-gray-900 mb-4 text-center">Offer Summary</div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Offer Amount:</span>
                      <span className="font-semibold text-lg">₹{offerForm.offerAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Processing Fee:</span>
                      <span className="font-semibold text-lg text-red-600">-₹{offerForm.processingFee.toLocaleString()}</span>
                    </div>
                    <div className="border-t-2 border-blue-300 pt-3 flex justify-between items-center">
                      <span className="font-bold text-gray-900">Net Amount:</span>
                      <span className="font-bold text-2xl text-green-600">₹{calculateNetAmount().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 mt-8">
                <Button
                  onClick={handleMakeOffer}
                  disabled={offerLoading}
                  className="flex-1"
                  size="lg"
                >
                  {offerLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Submit Offer
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowOfferModal(false)}
                  className="flex-1"
                  size="lg"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetail;