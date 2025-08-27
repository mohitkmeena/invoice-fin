import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, CreateInvoiceRequest } from '../lib/api';

const CreateInvoice: React.FC = () => {
  const [formData, setFormData] = useState<CreateInvoiceRequest>({
    type: 'INVOICE',
    invoiceNumber: '',
    buyerName: '',
    buyerGstin: '',
    invoiceDate: '',
    dueDate: '',
    invoiceAmount: 0,
    requestedAmount: 0,
    minAcceptAmount: 0,
    expectedInterestRate: 12.0,
    currency: 'INR',
    location: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name.includes('Amount') || name === 'expectedInterestRate') ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.createInvoice(formData);
      if (response.success) {
        navigate('/invoices');
      } else {
        setError(response.message || 'Failed to create invoice');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Create Invoice Request</h1>
          <p className="card-description">Submit your invoice for financing</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label htmlFor="type" className="label">Document Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="select"
                required
              >
                <option value="TRADE">Trade Invoice</option>
                <option value="SERVICE">Service Invoice</option>
                <option value="MIXED">Mixed Invoice</option>
                <option value="INVOICE">General Invoice</option>
                <option value="PURCHASE_ORDER">Purchase Order</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="invoiceNumber" className="label">Invoice Number</label>
              <input
                id="invoiceNumber"
                name="invoiceNumber"
                type="text"
                value={formData.invoiceNumber}
                onChange={handleChange}
                className="input"
                required
                placeholder="INV-001"
              />
            </div>

            <div className="form-group">
              <label htmlFor="buyerName" className="label">Buyer Name</label>
              <input
                id="buyerName"
                name="buyerName"
                type="text"
                value={formData.buyerName}
                onChange={handleChange}
                className="input"
                required
                placeholder="Company Name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="buyerGstin" className="label">Buyer GSTIN</label>
              <input
                id="buyerGstin"
                name="buyerGstin"
                type="text"
                value={formData.buyerGstin}
                onChange={handleChange}
                className="input"
                placeholder="22AAAAA0000A1Z5"
              />
            </div>

            <div className="form-group">
              <label htmlFor="invoiceDate" className="label">Invoice Date</label>
              <input
                id="invoiceDate"
                name="invoiceDate"
                type="date"
                value={formData.invoiceDate}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="dueDate" className="label">Due Date</label>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="invoiceAmount" className="label">Invoice Amount (₹)</label>
              <input
                id="invoiceAmount"
                name="invoiceAmount"
                type="number"
                value={formData.invoiceAmount}
                onChange={handleChange}
                className="input"
                required
                min="1"
                step="0.01"
                placeholder="100000"
              />
            </div>

            <div className="form-group">
              <label htmlFor="requestedAmount" className="label">Requested Amount (₹)</label>
              <input
                id="requestedAmount"
                name="requestedAmount"
                type="number"
                value={formData.requestedAmount}
                onChange={handleChange}
                className="input"
                required
                min="1"
                step="0.01"
                placeholder="80000"
              />
            </div>

            <div className="form-group">
              <label htmlFor="minAcceptAmount" className="label">Minimum Accept Amount (₹)</label>
              <input
                id="minAcceptAmount"
                name="minAcceptAmount"
                type="number"
                value={formData.minAcceptAmount}
                onChange={handleChange}
                className="input"
                required
                min="1"
                step="0.01"
                placeholder="50000"
              />
            </div>

            <div className="form-group">
              <label htmlFor="expectedInterestRate" className="label">Expected Interest Rate (% p.a.)</label>
              <input
                id="expectedInterestRate"
                name="expectedInterestRate"
                type="number"
                value={formData.expectedInterestRate}
                onChange={handleChange}
                className="input"
                required
                min="0.01"
                max="36"
                step="0.01"
                placeholder="12.00"
              />
              <small className="text-gray-600 mt-1">
                This is your expected interest rate. Lenders will see this and make competitive offers.
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="location" className="label">Location</label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                className="input"
                placeholder="Mumbai, Maharashtra"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? <span className="spinner"></span> : 'Create Invoice Request'}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/invoices')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoice;


