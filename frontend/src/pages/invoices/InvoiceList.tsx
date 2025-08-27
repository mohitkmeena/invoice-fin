import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Eye, Send, Download, MoreHorizontal, Filter, Search } from 'lucide-react';
import { useInvoices, useSendInvoice } from '../../hooks/useInvoices';
import { formatCurrency, formatDate, getStatusColor } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';

const InvoiceList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();
  const { data: invoicesData, isLoading: loading } = useInvoices(currentPage, 10, statusFilter);
  const sendInvoiceMutation = useSendInvoice();

  const invoices = invoicesData?.content || [];
  const totalPages = invoicesData?.totalPages || 0;

  const handleSendInvoice = async (invoiceId: string) => {
    sendInvoiceMutation.mutate({ id: invoiceId, method: 'EMAIL' });
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && currentPage === 0) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <Card>
            <CardContent className="p-6 h-96" />
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600 mt-1">Manage your invoices and track payments</p>
        </div>
        <Button
          onClick={() => navigate('/dashboard/invoices/create')}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Invoice</span>
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="DRAFT">Draft</option>
                  <option value="SENT">Sent</option>
                  <option value="VIEWED">Viewed</option>
                  <option value="PENDING_CONFIRMATION">Pending</option>
                  <option value="PAID">Paid</option>
                  <option value="OVERDUE">Overdue</option>
                </select>
                <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            <div className="text-sm text-gray-600">
              {filteredInvoices.length} invoice{filteredInvoices.length !== 1 ? 's' : ''}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  Invoice
                </TableHead>
                <TableHead>
                  Client
                </TableHead>
                <TableHead>
                  Amount
                </TableHead>
                <TableHead>
                  Status
                </TableHead>
                <TableHead>
                  Due Date
                </TableHead>
                <TableHead className="text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {invoice.invoiceNumber}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(invoice.issueDate)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {invoice.clientName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {invoice.clientEmail}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(invoice.total)}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {invoice.status.replace('_', ' ')}
                    </span>
                  </TableCell>
                  <TableCell>
                    {formatDate(invoice.dueDate)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => navigate(`/dashboard/invoices/${invoice.id}`)}
                        className="text-blue-600 hover:text-blue-700 p-1"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {(invoice.status === 'DRAFT' || invoice.status === 'SENT') && (
                        <button
                          onClick={() => handleSendInvoice(invoice.id)}
                          className="text-green-600 hover:text-green-700 p-1"
                          title="Send"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      )}
                      
                      {invoice.pdfUrl && (
                        <a
                          href={invoice.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-700 p-1"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      )}
                      
                      <button
                        className="text-gray-400 hover:text-gray-600 p-1"
                        title="More options"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first invoice</p>
            <Button
              onClick={() => navigate('/dashboard/invoices/create')}
            >
              Create Invoice
            </Button>
          </div>
        )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Page {currentPage + 1} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceList;