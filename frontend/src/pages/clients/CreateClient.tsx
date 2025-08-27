import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useCreateClient } from '../../hooks/useClients';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

const CreateClient: React.FC = () => {
  const navigate = useNavigate();
  const createClientMutation = useCreateClient();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    gstNumber: '',
    address: '',
    tags: '',
    upiId: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('=== FORM SUBMISSION STARTED ===');
    console.log('Submitting client data:', formData);

    // Check if required fields are filled
    if (!formData.name || !formData.email) {
      console.error('Required fields missing:', { name: formData.name, email: formData.email });
      alert('Please fill in all required fields (Name and Email)');
      return;
    }

    try {
      console.log('Calling createClientMutation.mutate...');
      
      // Use the mutation directly
      const result = await createClientMutation.mutateAsync(formData);
      console.log('Client created successfully:', result);
      
      // Navigate to the client list
      navigate('/dashboard/clients');
      
    } catch (error: any) {
      console.error('Error creating client:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      alert(`Error creating client: ${error.message}`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/dashboard/clients')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Client</h1>
          <p className="text-gray-600 mt-1">Create a new client profile</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Client Name *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-2"
                  placeholder="Enter client name"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-2"
                  placeholder="client@example.com"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-2"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  className="mt-2"
                  placeholder="Company Ltd."
                />
              </div>

              <div>
                <Label htmlFor="gstNumber">GST Number</Label>
                <Input
                  id="gstNumber"
                  name="gstNumber"
                  type="text"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  className="mt-2"
                  placeholder="22AAAAA0000A1Z5"
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  name="tags"
                  type="text"
                  value={formData.tags}
                  onChange={handleChange}
                  className="mt-2"
                  placeholder="VIP, Regular, Corporate (comma separated)"
                />
              </div>
            </div>

            <div className="mt-6">
              <Label htmlFor="address">Address</Label>
              <textarea
                id="address"
                name="address"
                rows={3}
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
                placeholder="Enter complete address..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="upiId">UPI ID</Label>
                <Input
                  id="upiId"
                  name="upiId"
                  type="text"
                  value={formData.upiId}
                  onChange={handleChange}
                  className="mt-2"
                  placeholder="client@upi"
                />
              </div>

              <div>
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  name="bankName"
                  type="text"
                  value={formData.bankName}
                  onChange={handleChange}
                  className="mt-2"
                  placeholder="HDFC Bank"
                />
              </div>

              <div>
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  name="accountNumber"
                  type="text"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className="mt-2"
                  placeholder="1234567890"
                />
              </div>

              <div>
                <Label htmlFor="ifscCode">IFSC Code</Label>
                <Input
                  id="ifscCode"
                  name="ifscCode"
                  type="text"
                  value={formData.ifscCode}
                  onChange={handleChange}
                  className="mt-2"
                  placeholder="HDFC0001234"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard/clients')}
          >
            Cancel
          </Button>
          

          
          <Button
            type="submit"
            disabled={createClientMutation.isPending}
            className="flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{createClientMutation.isPending ? 'Creating...' : 'Create Client'}</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateClient; 