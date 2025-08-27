import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, Download, CheckCircle, Calendar, User, Building } from 'lucide-react';
import { usePublicInvoice, useMarkInvoicePaid } from '../../hooks/useInvoices';
import { formatCurrency, formatDate, getStatusColor } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

const PublicInvoice: React.FC = () => {
  const { shareToken } = useParams<{ shareToken: string }>();
  
  const { data: invoice, isLoading: loading } = usePublicInvoice(shareToken!);
  const markPaidMutation = useMarkInvoicePaid();
  
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentData, setPaymentData] = useState({
    method: 'UPI',
    transactionRef: '',
    notes: '',
    clientName: '',
  });

  const handleMarkAsPaid = async () => {
    if (!paymentData.transactionRef.trim()) {
      alert('Please enter transaction reference');
      return;
    }

    markPaidMutation.mutate({ shareToken: shareToken!, paymentData }, {
      onSuccess: () => {
        setShowPaymentForm(false);
        alert('Payment marked successfully! The business owner will confirm your payment.');
      },
      onError: () => {
        alert('Failed to mark payment. Please try again.');
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invoice not found</h2>
          <p className="text-gray-600">This invoice link may be expired or invalid.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Invoice {invoice.invoiceNumber}</h1>
                  <p className="text-gray-600">Issued on {formatDate(invoice.issueDate)}</p>
                </div>
              </div>
              
              <div className="text-right">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
                  {invoice.status === 'PENDING_CONFIRMATION' ? 'Pending Confirmation' : invoice.status}
                </span>
                {invoice.pdfUrl && (
                  <div className="mt-2">
                    <a
                      href={invoice.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download PDF</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Details */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Bill To</h3>
                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">{invoice.clientName}</p>
                    <p className="text-gray-600">{invoice.clientEmail}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Due Date</h3>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <p className="text-gray-900">{formatDate(invoice.dueDate)}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Total Amount</h3>
                <div className="flex items-center space-x-3">
                  <Building className="w-5 h-5 text-gray-400" />
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(invoice.total)}</p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Invoice Items</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-sm font-medium text-gray-500">Description</th>
                      <th className="text-right py-3 text-sm font-medium text-gray-500">Qty</th>
                      <th className="text-right py-3 text-sm font-medium text-gray-500">Rate</th>
                      <th className="text-right py-3 text-sm font-medium text-gray-500">Tax</th>
                      <th className="text-right py-3 text-sm font-medium text-gray-500">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {invoice.items.map((item, index) => (
                      <tr key={index}>
                        <td className="py-4 text-sm text-gray-900">{item.productName}</td>
                        <td className="py-4 text-sm text-gray-900 text-right">{item.quantity}</td>
                        <td className="py-4 text-sm text-gray-900 text-right">{formatCurrency(item.unitPrice)}</td>
                        <td className="py-4 text-sm text-gray-900 text-right">{item.taxRate}%</td>
                        <td className="py-4 text-sm text-gray-900 text-right font-medium">{formatCurrency(item.amount + item.taxAmount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="mt-6 flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(invoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax:</span>
                    <span>{formatCurrency(invoice.taxAmount)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>{formatCurrency(invoice.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {invoice.notes && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
                <p className="text-gray-700">{invoice.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Section */}
        {invoice.status !== 'PAID' && invoice.status !== 'PENDING_CONFIRMATION' && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">💳 UPI Payment</h4>
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
                    <p className="text-sm font-medium text-gray-800">UPI ID: business@paytm</p>
                    <p className="text-sm text-gray-600 mt-1">📱 Scan QR code or use UPI ID</p>
                    <p className="text-xs text-purple-600 mt-2">✓ Instant payment confirmation</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">🏦 Bank Transfer (NEFT/RTGS)</h4>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                    <div className="text-sm text-gray-700 space-y-1">
                      <p><span className="font-medium">Account:</span> 1234567890</p>
                      <p><span className="font-medium">IFSC:</span> HDFC0001234</p>
                      <p><span className="font-medium">Bank:</span> HDFC Bank</p>
                      <p><span className="font-medium">Branch:</span> Main Branch</p>
                    </div>
                    <p className="text-xs text-green-600 mt-2">✓ Secure bank transfer</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">💰 Cash Payment</h4>
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-sm text-gray-700">Pay in person at our office</p>
                    <p className="text-xs text-orange-600 mt-2">✓ Direct payment option</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">💳 Card Payment</h4>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-700">Credit/Debit card accepted</p>
                    <p className="text-xs text-blue-600 mt-2">✓ Secure online payment</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                {!showPaymentForm ? (
                  <Button
                    onClick={() => setShowPaymentForm(true)}
                    className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>I've Made the Payment</span>
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label>Payment Method</Label>
                      <select
                        value={paymentData.method}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, method: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
                      >
                        <option value="UPI">💳 UPI Payment</option>
                        <option value="BANK_TRANSFER">🏦 Bank Transfer (NEFT/RTGS)</option>
                        <option value="CASH">💰 Cash Payment</option>
                        <option value="CARD">💳 Card Payment</option>
                        <option value="CHEQUE">📝 Cheque</option>
                        <option value="OTHER">🔄 Other</option>
                      </select>
                    </div>

                    <div>
                      <Label>Transaction Reference/ID *</Label>
                      <Input
                        type="text"
                        value={paymentData.transactionRef}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, transactionRef: e.target.value }))}
                        placeholder={
                          paymentData.method === 'UPI' ? 'Enter UPI transaction ID (e.g., 123456789012)' :
                          paymentData.method === 'BANK_TRANSFER' ? 'Enter NEFT/RTGS reference number' :
                          paymentData.method === 'CHEQUE' ? 'Enter cheque number' :
                          'Enter transaction reference'
                        }
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Your Name (Optional)</Label>
                      <Input
                        type="text"
                        value={paymentData.clientName}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, clientName: e.target.value }))}
                        placeholder="Enter your name for reference"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Payment Notes (Optional)</Label>
                      <textarea
                        value={paymentData.notes}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Add any additional notes about the payment..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2 resize-none"
                        rows={3}
                      />
                    </div>

                    <div className="flex space-x-4">
                      <Button
                        variant="outline"
                        onClick={() => setShowPaymentForm(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleMarkAsPaid}
                        disabled={markPaidMutation.isPending || !paymentData.transactionRef.trim()}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        {markPaidMutation.isPending ? 'Submitting...' : 'Mark as Paid'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {invoice.status === 'PENDING_CONFIRMATION' && (
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-yellow-600" />
                <div>
                  <h3 className="text-lg font-medium text-yellow-800">Payment Submitted</h3>
                  <p className="text-yellow-700 mt-1">
                    Your payment has been submitted and is pending confirmation from the business owner. 
                    You will receive a receipt once the payment is confirmed.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {invoice.status === 'PAID' && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="text-lg font-medium text-green-800">Payment Confirmed</h3>
                  <p className="text-green-700 mt-1">
                    Thank you! Your payment has been confirmed. A receipt has been sent to your email.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PublicInvoice;