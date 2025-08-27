import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, Invoice } from '../lib/api';

const InvoiceList: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await api.getMyInvoices();
      if (response.success && response.data) {
        setInvoices(response.data);
      }
    } catch (err: any) {
      setError('Failed to fetch invoices');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleListInvoice = async (invoiceId: string) => {
    try {
      const response = await api.listInvoice(invoiceId);
      if (response.success) {
        // Refresh the list
        fetchInvoices();
      }
    } catch (err: any) {
      setError('Failed to list invoice');
      console.error(err);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'listed':
        return 'badge badge-success';
      case 'pending':
        return 'badge badge-warning';
      case 'rejected':
      case 'expired':
        return 'badge badge-danger';
      default:
        return 'badge badge-info';
    }
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="spinner"></div>
        <p>Loading invoices...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="card-title">My Invoices</h1>
            <p className="card-description">Manage your financing requests</p>
          </div>
          <Link to="/invoices/new" className="btn btn-primary">
            Create New Invoice
          </Link>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {invoices.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Type</th>
                <th>Buyer</th>
                <th>Invoice Amount</th>
                <th>Requested Amount</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.invoiceNumber}</td>
                  <td>{invoice.type}</td>
                  <td>{invoice.buyerName}</td>
                  <td>₹{invoice.invoiceAmount.toLocaleString()}</td>
                  <td>₹{invoice.requestedAmount.toLocaleString()}</td>
                  <td>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                  <td>
                    <span className={getStatusBadgeClass(invoice.status)}>
                      {invoice.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <Link 
                        to={`/invoices/${invoice.id}`} 
                        className="btn btn-secondary"
                        style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                      >
                        View
                      </Link>
                      {invoice.status === 'DRAFT' && (
                        <button
                          onClick={() => handleListInvoice(invoice.id)}
                          className="btn btn-success"
                          style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                        >
                          List
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center p-4">
            <p className="mb-4">No invoices found</p>
            <Link to="/invoices/new" className="btn btn-primary">
              Create Your First Invoice
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceList;






