import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Plus, Mail, Phone, Building, MapPin, Tag, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { useClient, useClientStats } from '../../hooks/useClients';
import { useInvoices } from '../../hooks/useInvoices';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';

const ViewClient: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: client, isLoading: clientLoading } = useClient(id!);
  const { data: stats, isLoading: statsLoading } = useClientStats(id!);
  const { data: invoicesData } = useInvoices(0, 10, '', id);

  const invoices = invoicesData?.content || [];

  if (clientLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Client not found</h2>
        <p className="text-gray-600">The client you're looking for doesn't exist.</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Receivable',
      value: formatCurrency(stats?.totalReceivable || 0),
      icon: DollarSign,
      color: 'orange',
    },
    {
      title: 'Total Received',
      value: formatCurrency(stats?.totalReceived || 0),
      icon: CheckCircle,
      color: 'green',
    },
    {
      title: 'Average Payment Time',
      value: stats?.averagePaymentTime ? `${stats.averagePaymentTime} days` : 'N/A',
      icon: Clock,
      color: 'blue',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard/clients')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
            <p className="text-gray-600 mt-1">{client.company || 'No company specified'}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => navigate(`/dashboard/clients/${client.id}/edit`)}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </Button>
          <Button
            onClick={() => navigate('/dashboard/invoices/create', { state: { clientId: client.id } })}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Invoice</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  card.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  card.color === 'green' ? 'bg-green-100 text-green-600' :
                  'bg-orange-100 text-orange-600'
                }`}>
                  <card.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Client Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">{client.email}</p>
                </div>
              </div>
              
              {client.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <p className="text-sm text-gray-600">{client.phone}</p>
                  </div>
                </div>
              )}
              
              {client.company && (
                <div className="flex items-center space-x-3">
                  <Building className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Company</p>
                    <p className="text-sm text-gray-600">{client.company}</p>
                  </div>
                </div>
              )}
              
              {client.address && (
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Address</p>
                    <p className="text-sm text-gray-600">{client.address}</p>
                  </div>
                </div>
              )}
              
              {client.tags && (
                <div className="flex items-start space-x-3">
                  <Tag className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Tags</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {client.tags.split(',').map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {client.upiId && (
                <div>
                  <p className="text-sm font-medium text-gray-900">UPI ID</p>
                  <p className="text-sm text-gray-600">{client.upiId}</p>
                </div>
              )}
              
              {client.bankName && (
                <div>
                  <p className="text-sm font-medium text-gray-900">Bank Name</p>
                  <p className="text-sm text-gray-600">{client.bankName}</p>
                </div>
              )}
              
              {client.accountNumber && (
                <div>
                  <p className="text-sm font-medium text-gray-900">Account Number</p>
                  <p className="text-sm text-gray-600">{client.accountNumber}</p>
                </div>
              )}
              
              {client.ifscCode && (
                <div>
                  <p className="text-sm font-medium text-gray-900">IFSC Code</p>
                  <p className="text-sm text-gray-600">{client.ifscCode}</p>
                </div>
              )}
              
              {client.gstNumber && (
                <div>
                  <p className="text-sm font-medium text-gray-900">GST Number</p>
                  <p className="text-sm text-gray-600">{client.gstNumber}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Invoices</CardTitle>
            <Button
              onClick={() => navigate('/dashboard/invoices', { state: { clientId: client.id } })}
              variant="outline"
              size="sm"
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {invoices.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.slice(0, 5).map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <div className="text-sm font-medium text-gray-900">
                        {invoice.invoiceNumber}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {formatDate(invoice.issueDate)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(invoice.total)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        invoice.status === 'PAID' ? 'bg-green-100 text-green-800' :
                        invoice.status === 'SENT' ? 'bg-blue-100 text-blue-800' :
                        invoice.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {invoice.status.replace('_', ' ')}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/dashboard/invoices/${invoice.id}`)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices yet</h3>
              <p className="text-gray-600 mb-4">Create the first invoice for this client</p>
              <Button
                onClick={() => navigate('/dashboard/invoices/create', { state: { clientId: client.id } })}
              >
                Create Invoice
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewClient; 