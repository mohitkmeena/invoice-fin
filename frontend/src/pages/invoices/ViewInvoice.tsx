import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Send, Download, Share2, CheckCircle } from 'lucide-react';
import { useInvoice, useSendInvoice } from '../../hooks/useInvoices';
import { formatCurrency, formatDate, getStatusColor } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

const ViewInvoice: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: invoice, isLoading } = useInvoice(id!);
  const sendInvoiceMutation = useSendInvoice();

  const handleSendInvoice = (method: 'EMAIL' | 'WHATSAPP') => {
    sendInvoiceMutation.mutate({ id: id!, method });
  };

  const copyShareLink = () => {
    if (invoice?.shareToken) {
      const shareUrl = `${window.location.origin}/invoice/${invoice.shareToken}`;
      navigator.clipboard.writeText(shareUrl);
      alert('Share link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <Card>
            <CardContent className="p-6 h-96" />
          </Card>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Invoice not found</h2>
        <p className="text-gray-600 mb-6">The invoice you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/dashboard/invoices')}>
          Back to Invoices
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard/invoices')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invoice {invoice.invoiceNumber}</h1>
            <p className="text-gray-600 mt-1">
              Created on {formatDate(invoice.createdAt)} • Due {formatDate(invoice.dueDate)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
            {invoice.status.replace('_', ' ')}
          </span>
          
          <Button
            variant="outline"
            onClick={() => navigate(`/dashboard/invoices/${id}/edit`)}
            className="flex items-center space-x-2"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </Button>

          {invoice.status !== 'PAID' && (
            <div className="flex space-x-2">
              <Button
                onClick={() => handleSendInvoice('EMAIL')}
                disabled={sendInvoiceMutation.isPending}
                className="flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Email</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleSendInvoice('WHATSAPP')}
                disabled={sendInvoiceMutation.isPending}
                className="flex items-center space-x-2"
              >
                <Share2 className="w-4 h-4" />
                <span>WhatsApp</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Invoice Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Client Info */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Bill To</h3>
                <div>
                  <p className="font-medium text-gray-900">{invoice.clientName}</p>
                  <p className="text-gray-600">{invoice.clientEmail}</p>
                </div>
              </div>

              {/* Items */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Items</h3>
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
                          <td className="py-4 text-sm text-gray-900 text-right font-medium">
                            {formatCurrency(item.amount + item.taxAmount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
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

              {invoice.notes && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
                  <p className="text-gray-700">{invoice.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {invoice.pdfUrl && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.open(invoice.pdfUrl, '_blank')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              )}
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={copyShareLink}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Copy Share Link
              </Button>

              {invoice.shareToken && (
                <div className="text-xs text-gray-500 mt-2">
                  Share URL: {window.location.origin}/invoice/{invoice.shareToken}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Status */}
          {invoice.payments && invoice.payments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {invoice.payments.map((payment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {payment.method} - {formatCurrency(payment.amount)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Ref: {payment.transactionRef}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                        payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Invoice Info */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Created:</span>
                <span className="text-gray-900">{formatDate(invoice.createdAt)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Due Date:</span>
                <span className="text-gray-900">{formatDate(invoice.dueDate)}</span>
              </div>
              {invoice.viewedAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Viewed:</span>
                  <span className="text-gray-900">{formatDate(invoice.viewedAt)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status:</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                  {invoice.status.replace('_', ' ')}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewInvoice;