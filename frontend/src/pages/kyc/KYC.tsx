import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { KYCRequest } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Card } from '../../components/ui/Card';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';

const KYC: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [kycStatus, setKycStatus] = useState<KYCRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [aadhaarLast4, setAadhaarLast4] = useState('');
  const [panLast4, setPanLast4] = useState('');
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [panFile, setPanFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // File upload states
  const [aadhaarUploadProgress, setAadhaarUploadProgress] = useState(0);
  const [panUploadProgress, setPanUploadProgress] = useState(0);

  useEffect(() => {
    if (user) {
      fetchKYCStatus();
    }
  }, [user]);

  const fetchKYCStatus = async () => {
    try {
      setLoading(true);
      // TODO: Implement API call to fetch KYC status
      // const response = await apiClient.getKYCStatus(user.id);
      // setKycStatus(response.data);
      
      // Mock data for now
      setKycStatus({
        id: 'kyc1',
        userId: user?.id || '',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch KYC status');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (type: 'aadhaar' | 'pan', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size must be less than 5MB');
        return;
      }
      if (!file.type.includes('image/')) {
        setError('Only image files are allowed');
        return;
      }
      
      if (type === 'aadhaar') {
        setAadhaarFile(file);
      } else {
        setPanFile(file);
      }
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!aadhaarLast4 || !panLast4 || !aadhaarFile || !panFile) {
      setError('Please fill all required fields and upload both documents');
      return;
    }

    if (aadhaarLast4.length !== 4 || panLast4.length !== 4) {
      setError('Please enter the last 4 digits of your Aadhaar and PAN numbers');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // TODO: Implement KYC submission
      // 1. Upload Aadhaar image to S3
      // 2. Upload PAN image to S3
      // 3. Submit KYC request
      
      console.log('Submitting KYC:', {
        aadhaarLast4,
        panLast4,
        aadhaarFile,
        panFile
      });

      // For now, just update status
      setKycStatus(prev => prev ? {
        ...prev,
        status: 'PENDING'
      } : null);

      // Navigate back to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to submit KYC');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'REJECTED':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'PENDING':
        return <Clock className="w-5 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading KYC status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">KYC Verification</h1>
          <p className="text-gray-600 mt-2">
            Complete your identity verification to access all platform features
          </p>
        </div>

        {/* Current Status */}
        {kycStatus && (
          <Card className="p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Current Status</h3>
                <p className="text-gray-600 mt-1">
                  Your KYC verification is currently being processed
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(kycStatus.status)}
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(kycStatus.status)}`}>
                  {kycStatus.status}
                </span>
              </div>
            </div>
            
            {kycStatus.remarks && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700">
                  <strong>Remarks:</strong> {kycStatus.remarks}
                </p>
              </div>
            )}
          </Card>
        )}

        {/* KYC Form */}
        {(!kycStatus || kycStatus.status === 'REJECTED') && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              {kycStatus?.status === 'REJECTED' ? 'Resubmit KYC Documents' : 'Submit KYC Documents'}
            </h3>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
              {/* Aadhaar Section */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Aadhaar Card
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="aadhaarLast4">Last 4 Digits of Aadhaar</Label>
                    <Input
                      id="aadhaarLast4"
                      type="text"
                      maxLength={4}
                      value={aadhaarLast4}
                      onChange={(e) => setAadhaarLast4(e.target.value.replace(/\D/g, ''))}
                      placeholder="1234"
                      className="font-mono"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter only the last 4 digits for security
                    </p>
                  </div>

                  <div>
                    <Label>Upload Aadhaar Image</Label>
                    <div className="mt-2">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileSelect('aadhaar', e)}
                          className="hidden"
                          id="aadhaar-upload"
                        />
                        <label
                          htmlFor="aadhaar-upload"
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">
                            {aadhaarFile ? aadhaarFile.name : 'Click to upload Aadhaar image'}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            Max 5MB, JPG/PNG
                          </span>
                        </label>
                      </div>
                      {aadhaarFile && (
                        <div className="mt-2 flex items-center text-sm text-gray-600">
                          <FileText className="w-4 h-4 mr-2" />
                          {aadhaarFile.name} ({(aadhaarFile.size / 1024 / 1024).toFixed(2)} MB)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* PAN Section */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-green-600" />
                  PAN Card
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="panLast4">Last 4 Digits of PAN</Label>
                    <Input
                      id="panLast4"
                      type="text"
                      maxLength={4}
                      value={panLast4}
                      onChange={(e) => setPanLast4(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                      placeholder="ABCD"
                      className="font-mono"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter only the last 4 digits for security
                    </p>
                  </div>

                  <div>
                    <Label>Upload PAN Image</Label>
                    <div className="mt-2">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileSelect('pan', e)}
                          className="hidden"
                          id="pan-upload"
                        />
                        <label
                          htmlFor="pan-upload"
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">
                            {panFile ? panFile.name : 'Click to upload PAN image'}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            Max 5MB, JPG/PNG
                          </span>
                        </label>
                      </div>
                      {panFile && (
                        <div className="mt-2 flex items-center text-sm text-gray-600">
                          <FileText className="w-4 h-4 mr-2" />
                          {panFile.name} ({(panFile.size / 1024 / 1024).toFixed(2)} MB)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-blue-800">Important Information</h4>
                    <div className="mt-2 text-sm text-blue-700">
                      <ul className="list-disc list-inside space-y-1">
                        <li>Only the last 4 digits of your documents are stored for verification</li>
                        <li>Document images are encrypted and stored securely</li>
                        <li>KYC verification typically takes 24-48 hours</li>
                        <li>You'll be notified once verification is complete</li>
                      </ul>
                    </div>
                  </div>
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit KYC Documents'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* KYC Verified - Show Success */}
        {kycStatus?.status === 'VERIFIED' && (
          <Card className="p-6 bg-green-50 border-green-200">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-900 mb-2">
                KYC Verification Complete!
              </h3>
              <p className="text-green-700 mb-6">
                Your identity has been verified successfully. You now have access to all platform features.
              </p>
              <Button onClick={() => navigate('/dashboard')}>
                Continue to Dashboard
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default KYC;




