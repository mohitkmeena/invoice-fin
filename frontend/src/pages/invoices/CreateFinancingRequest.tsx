import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { useFinancingRequests } from '../../hooks/useFinancingRequests';
import { CreateFinancingRequestForm } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Card } from '../../components/ui/Card';
import { FileText, Upload, AlertCircle } from 'lucide-react';

const financingRequestSchema = z.object({
  type: z.enum(['INVOICE', 'PURCHASE_ORDER']),
  invoiceNumber: z.string().min(1, 'Invoice/PO number is required'),
  buyerName: z.string().min(1, 'Buyer name is required'),
  buyerGstin: z.string().optional(),
  invoiceDate: z.string().min(1, 'Invoice date is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  invoiceAmount: z.number().min(1, 'Invoice amount must be greater than 0'),
  requestedAmount: z.number().min(1, 'Requested amount must be greater than 0'),
  minAcceptAmount: z.number().min(1, 'Minimum accept amount must be greater than 0'),
  currency: z.string().default('INR'),
  location: z.string().optional(),
});

type FinancingRequestFormData = z.infer<typeof financingRequestSchema>;

const CreateFinancingRequest: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createFinancingRequestAsync, isCreating } = useFinancingRequests();
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<FinancingRequestFormData>({
    resolver: zodResolver(financingRequestSchema),
    defaultValues: {
      currency: 'INR',
      type: 'INVOICE',
    },
  });

  const watchedType = watch('type');
  const watchedInvoiceAmount = watch('invoiceAmount');

  // Auto-calculate requested amount as 80% of invoice amount
  React.useEffect(() => {
    if (watchedInvoiceAmount) {
      const requested = Math.floor(watchedInvoiceAmount * 0.8);
      const minAccept = Math.floor(watchedInvoiceAmount * 0.7);
      setValue('requestedAmount', requested);
      setValue('minAcceptAmount', minAccept);
    }
  }, [watchedInvoiceAmount, setValue]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File size must be less than 10MB');
        return;
      }
      if (!file.type.includes('pdf')) {
        setError('Only PDF files are allowed');
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const onSubmit = async (data: FinancingRequestFormData) => {
    if (!selectedFile) {
      setError('Please select a document to upload');
      return;
    }

    try {
      setError(null);

      // TODO: Implement file upload and financing request creation
      // 1. Get presigned URL for document upload
      // 2. Upload document to S3
      // 3. Create financing request
      
      console.log('Creating financing request:', data);
      console.log('Selected file:', selectedFile);

      // For now, just navigate back
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create financing request');
    }
  };

  if (!user?.roles.includes('BORROWER')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">Only borrowers can create financing requests.</p>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Financing Request</h1>
          <p className="text-gray-600 mt-2">
            Upload your invoice or purchase order to get financing from lenders
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </div>
            )}

            {/* Document Type */}
            <div>
              <Label>Document Type</Label>
              <div className="mt-2 space-y-3">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="invoice"
                    value="INVOICE"
                    {...register('type')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <Label htmlFor="invoice" className="ml-2 text-sm font-medium text-gray-700">
                    Invoice
                  </Label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="po"
                    value="PURCHASE_ORDER"
                    {...register('type')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <Label htmlFor="po" className="ml-2 text-sm font-medium text-gray-700">
                    Purchase Order
                  </Label>
                </div>
              </div>
            </div>

            {/* Document Upload */}
            <div>
              <Label>Upload Document</Label>
              <div className="mt-2">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="document-upload"
                  />
                  <label
                    htmlFor="document-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mb-4" />
                    <span className="text-sm text-gray-600">
                      {selectedFile ? selectedFile.name : 'Click to upload PDF document'}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      Maximum file size: 10MB
                    </span>
                  </label>
                </div>
                {selectedFile && (
                  <div className="mt-2 flex items-center text-sm text-gray-600">
                    <FileText className="w-4 h-4 mr-2" />
                    {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
              </div>
            </div>

            {/* Document Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="invoiceNumber">
                  {watchedType === 'INVOICE' ? 'Invoice Number' : 'PO Number'}
                </Label>
                <Input
                  id="invoiceNumber"
                  {...register('invoiceNumber')}
                  error={errors.invoiceNumber?.message}
                  placeholder={`Enter ${watchedType === 'INVOICE' ? 'invoice' : 'PO'} number`}
                />
              </div>

              <div>
                <Label htmlFor="buyerName">Buyer Name</Label>
                <Input
                  id="buyerName"
                  {...register('buyerName')}
                  error={errors.buyerName?.message}
                  placeholder="Enter buyer/company name"
                />
              </div>

              <div>
                <Label htmlFor="buyerGstin">Buyer GSTIN (Optional)</Label>
                <Input
                  id="buyerGstin"
                  {...register('buyerGstin')}
                  error={errors.buyerGstin?.message}
                  placeholder="Enter buyer GSTIN"
                />
              </div>

              <div>
                <Label htmlFor="location">Location (Optional)</Label>
                <Input
                  id="location"
                  {...register('location')}
                  error={errors.location?.message}
                  placeholder="Enter city/state"
                />
              </div>

              <div>
                <Label htmlFor="invoiceDate">
                  {watchedType === 'INVOICE' ? 'Invoice' : 'PO'} Date
                </Label>
                <Input
                  id="invoiceDate"
                  type="date"
                  {...register('invoiceDate')}
                  error={errors.invoiceDate?.message}
                />
              </div>

              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  {...register('dueDate')}
                  error={errors.dueDate?.message}
                />
              </div>

              <div>
                <Label htmlFor="invoiceAmount">
                  {watchedType === 'INVOICE' ? 'Invoice' : 'PO'} Amount (₹)
                </Label>
                <Input
                  id="invoiceAmount"
                  type="number"
                  step="0.01"
                  {...register('invoiceAmount', { valueAsNumber: true })}
                  error={errors.invoiceAmount?.message}
                  placeholder="Enter total amount"
                />
              </div>

              <div>
                <Label htmlFor="currency">Currency</Label>
                <select
                  id="currency"
                  {...register('currency')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="INR">Indian Rupee (₹)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
              </div>

              <div>
                <Label htmlFor="requestedAmount">Requested Amount (₹)</Label>
                <Input
                  id="requestedAmount"
                  type="number"
                  step="0.01"
                  {...register('requestedAmount', { valueAsNumber: true })}
                  error={errors.requestedAmount?.message}
                  placeholder="Amount you need"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: 80% of invoice amount
                </p>
              </div>

              <div>
                <Label htmlFor="minAcceptAmount">Minimum Accept Amount (₹)</Label>
                <Input
                  id="minAcceptAmount"
                  type="number"
                  step="0.01"
                  {...register('minAcceptAmount', { valueAsNumber: true })}
                  error={errors.minAcceptAmount?.message}
                  placeholder="Lowest acceptable amount"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: 70% of invoice amount
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating}
              >
                {isCreating ? 'Creating Request...' : 'Create Financing Request'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateFinancingRequest;



