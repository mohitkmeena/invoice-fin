import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle, XCircle, Clock, User, CreditCard } from 'lucide-react';
import { apiClient } from '../../lib/api';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

interface Payment {
  id: number;
  invoiceId: number;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  method: string;
  transactionReference: string;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
  submittedAt: string;
  notes?: string;
}

const PaymentList: React.FC = () => {
  const { data: payments = [], isLoading, refetch } = useQuery({
    queryKey: ['payments', 'pending'],
    queryFn: () => apiClient.getPendingPayments(),
  });

  const handleConfirmPayment = async (paymentId: number) => {
    try {
      await apiClient.confirmPayment(paymentId.toString());
      refetch();
    } catch (error) {
      console.error('Failed to confirm payment:', error);
    }
  };

  const handleRejectPayment = async (paymentId: number) => {
    try {
      await apiClient.rejectPayment(paymentId.toString());
      refetch();
    } catch (error) {
      console.error('Failed to reject payment:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Payment Confirmations</h1>
        <div className="text-sm text-gray-500">
          {payments.length} pending confirmation{payments.length !== 1 ? 's' : ''}
        </div>
      </div>

      {payments.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pending payments</h3>
            <p className="text-gray-600">All payments have been processed.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {payments.map((payment: Payment) => (
            <Card key={payment.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{payment.clientName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Invoice #{payment.invoiceNumber}</span>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Amount</p>
                        <p className="text-lg font-semibold text-gray-900">{formatCurrency(payment.amount)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Payment Method</p>
                        <p className="text-sm text-gray-900">{payment.method}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Transaction Reference</p>
                        <p className="text-sm text-gray-900 font-mono">{payment.transactionReference}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-500">Submitted</p>
                      <p className="text-sm text-gray-900">{formatDate(payment.submittedAt)}</p>
                    </div>

                    {payment.notes && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-500">Notes</p>
                        <p className="text-sm text-gray-700">{payment.notes}</p>
                      </div>
                    )}
                  </div>

                  {payment.status === 'PENDING' && (
                    <div className="flex space-x-2 ml-4">
                      <Button
                        onClick={() => handleConfirmPayment(payment.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Confirm
                      </Button>
                      <Button
                        onClick={() => handleRejectPayment(payment.id)}
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        size="sm"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentList;
