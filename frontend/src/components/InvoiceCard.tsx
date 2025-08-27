import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Eye, 
  DollarSign, 
  Calendar, 
  User, 
  Heart,
  TrendingUp,
  FileText
} from 'lucide-react';
import { formatCurrency, formatDate } from '../lib/utils';

interface InvoiceCardProps {
  invoice: {
    id: string | number;
    invoiceNumber: string;
    invoiceAmount: number;
    expectedInterestRate: number;
    dueDate: string;
    borrowerFullName?: string;
    borrowerCompanyName?: string;
    status: string;
    type: string;
  };
  onViewDetails: (id: string | number) => void;
  onMakeOffer: (id: string | number) => void;
  onAddToFavorites: (id: string | number) => void;
  isFavorite?: boolean;
  showActions?: boolean;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({
  invoice,
  onViewDetails,
  onMakeOffer,
  onAddToFavorites,
  isFavorite = false,
  showActions = true
}) => {
  const getStatusVariant = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'warning';
      case 'ACCEPTED':
      case 'VERIFIED':
        return 'success';
      case 'REJECTED':
        return 'error';
      case 'OPEN':
        return 'info';
      case 'CLOSED':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'INVOICE':
        return <FileText className="w-4 h-4" />;
      case 'TRADE':
        return <TrendingUp className="w-4 h-4" />;
      case 'SERVICE':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {getTypeIcon(invoice.type)}
            <CardTitle className="text-lg font-semibold text-gray-900">
              {invoice.invoiceNumber}
            </CardTitle>
          </div>
          <Badge variant={getStatusVariant(invoice.status)} className="text-xs">
            {invoice.status}
          </Badge>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <User className="w-4 h-4" />
          <span>{invoice.borrowerFullName || invoice.borrowerCompanyName || 'Unknown Borrower'}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600">
              {formatCurrency(invoice.invoiceAmount)}
            </div>
            <div className="text-xs text-gray-500">Invoice Amount</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {invoice.expectedInterestRate}%
            </div>
            <div className="text-xs text-gray-500">Interest Rate</div>
          </div>
        </div>

        {/* Due Date */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Due: {formatDate(invoice.dueDate)}</span>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex items-center space-x-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(invoice.id)}
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
            <Button
              size="sm"
              onClick={() => onMakeOffer(invoice.id)}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Make Offer
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddToFavorites(invoice.id)}
              className={`p-2 ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvoiceCard;

