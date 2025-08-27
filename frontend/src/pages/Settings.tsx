import React, { useState } from 'react';
import { User, Building, Bell, Shield, CreditCard, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company: user?.company || '',
  });

  const [businessData, setBusinessData] = useState({
    businessName: '',
    address: '',
    gstNumber: '',
    panNumber: '',
    upiId: '',
    bankAccount: '',
    ifscCode: '',
    bankName: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    invoiceViewed: true,
    paymentReceived: true,
    overdueReminders: true,
  });

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // API call to update profile
      console.log('Updating profile:', profileData);
      // await apiClient.updateProfile(profileData);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBusiness = async () => {
    setLoading(true);
    try {
      // API call to update business settings
      console.log('Updating business settings:', businessData);
      // await apiClient.updateBusinessSettings(businessData);
    } catch (error) {
      console.error('Failed to update business settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    try {
      // API call to update notification settings
      console.log('Updating notification settings:', notificationSettings);
      // await apiClient.updateNotificationSettings(notificationSettings);
    } catch (error) {
      console.error('Failed to update notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'business', label: 'Business', icon: Building },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and application preferences</p>
      </div>

      <div className="flex space-x-8">
        {/* Sidebar */}
        <div className="w-64 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-2 text-left rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={profileData.company}
                    onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                  />
                </div>

                <Button onClick={handleSaveProfile} disabled={loading} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'business' && (
            <Card>
              <CardHeader>
                <CardTitle>Business Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={businessData.businessName}
                    onChange={(e) => setBusinessData(prev => ({ ...prev, businessName: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={businessData.address}
                    onChange={(e) => setBusinessData(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gstNumber">GST Number</Label>
                    <Input
                      id="gstNumber"
                      value={businessData.gstNumber}
                      onChange={(e) => setBusinessData(prev => ({ ...prev, gstNumber: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="panNumber">PAN Number</Label>
                    <Input
                      id="panNumber"
                      value={businessData.panNumber}
                      onChange={(e) => setBusinessData(prev => ({ ...prev, panNumber: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    value={businessData.upiId}
                    onChange={(e) => setBusinessData(prev => ({ ...prev, upiId: e.target.value }))}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="bankAccount">Bank Account</Label>
                    <Input
                      id="bankAccount"
                      value={businessData.bankAccount}
                      onChange={(e) => setBusinessData(prev => ({ ...prev, bankAccount: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ifscCode">IFSC Code</Label>
                    <Input
                      id="ifscCode"
                      value={businessData.ifscCode}
                      onChange={(e) => setBusinessData(prev => ({ ...prev, ifscCode: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      value={businessData.bankName}
                      onChange={(e) => setBusinessData(prev => ({ ...prev, bankName: e.target.value }))}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveBusiness} disabled={loading} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-600">Receive notifications via email</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.smsNotifications}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, smsNotifications: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Invoice Viewed</Label>
                      <p className="text-sm text-gray-600">Notify when clients view invoices</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.invoiceViewed}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, invoiceViewed: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Payment Received</Label>
                      <p className="text-sm text-gray-600">Notify when payments are received</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.paymentReceived}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, paymentReceived: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Overdue Reminders</Label>
                      <p className="text-sm text-gray-600">Notify about overdue invoices</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.overdueReminders}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, overdueReminders: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </div>

                <Button onClick={handleSaveNotifications} disabled={loading} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Security settings will be implemented in a future update.</p>
              </CardContent>
            </Card>
          )}

          {activeTab === 'billing' && (
            <Card>
              <CardHeader>
                <CardTitle>Billing & Subscription</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Billing settings will be implemented in a future update.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
