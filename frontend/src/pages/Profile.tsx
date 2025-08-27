import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Shield, 
  Upload, 
  Edit, 
  Save, 
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  Camera,
  Globe,
  CreditCard,
  Award,
  Star,
  TrendingUp,
  Settings,
  Download,
  Eye
} from 'lucide-react';

interface ProfileFormData {
  fullName: string;
  phone: string;
  companyName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  website: string;
  gstin: string;
  pan: string;
  sector: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'kyc' | 'documents' | 'security'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    companyName: user?.companyName || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || '',
    website: user?.website || '',
    gstin: user?.gstin || '',
    pan: user?.pan || '',
    sector: user?.sector || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // TODO: Implement API call to save profile
    setIsEditing(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    // TODO: Implement file upload API call
    setTimeout(() => {
      setIsUploading(false);
      setSelectedFile(null);
    }, 2000);
  };

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getKycStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'REJECTED':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const documents = [
    {
      id: '1',
      name: 'Aadhaar Card',
      type: 'ID Proof',
      status: 'VERIFIED',
      uploadedAt: '2024-01-15',
      fileSize: '2.1 MB'
    },
    {
      id: '2',
      name: 'PAN Card',
      type: 'ID Proof',
      status: 'VERIFIED',
      uploadedAt: '2024-01-15',
      fileSize: '1.8 MB'
    },
    {
      id: '3',
      name: 'Business Registration',
      type: 'Business Proof',
      status: 'PENDING',
      uploadedAt: '2024-01-20',
      fileSize: '3.2 MB'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="container py-8">
        {/* Profile Header */}
        <div className="card mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            {/* Profile Picture */}
            <div className="relative group">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user?.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt={user.fullName || user.email} 
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'
                )}
              </div>
              
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {user?.fullName || 'Complete Your Profile'}
                </h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getKycStatusColor(user?.kycStatus || 'PENDING')}`}>
                  {user?.kycStatus || 'PENDING'} KYC
                </span>
              </div>
              
              <p className="text-gray-600 mb-4">
                {user?.email} • Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
              </p>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {user?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user?.companyName && (
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    <span>{user.companyName}</span>
                  </div>
                )}
                {user?.city && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{user.city}, {user.state}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="btn btn-primary"
              >
                {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
              {isEditing && (
                <button 
                  onClick={handleSave}
                  className="btn btn-success"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'kyc', label: 'KYC Documents', icon: Shield },
                { id: 'documents', label: 'Documents', icon: FileText },
                { id: 'security', label: 'Security', icon: Settings }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="py-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="form-input"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="form-input"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Company Name</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="form-input"
                      placeholder="Enter your company name"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="form-input"
                      placeholder="https://yourcompany.com"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">GSTIN</label>
                    <input
                      type="text"
                      name="gstin"
                      value={formData.gstin}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="form-input"
                      placeholder="Enter your GSTIN"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">PAN</label>
                    <input
                      type="text"
                      name="pan"
                      value={formData.pan}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="form-input"
                      placeholder="Enter your PAN"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Sector</label>
                    <input
                      type="text"
                      name="sector"
                      value={formData.sector}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="form-input"
                      placeholder="e.g., Technology, Manufacturing"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="form-input"
                    placeholder="Enter your complete address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="form-input"
                      placeholder="Enter your city"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="form-input"
                      placeholder="Enter your state"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="form-input"
                      placeholder="Enter your pincode"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* KYC Tab */}
            {activeTab === 'kyc' && (
              <div className="space-y-6">
                {/* KYC Status Card */}
                <div className="card bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                  <div className="flex items-center gap-4 mb-4">
                    {getKycStatusIcon(user?.kycStatus || 'PENDING')}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">KYC Verification Status</h3>
                      <p className="text-gray-600">
                        {user?.kycStatus === 'VERIFIED' 
                          ? 'Your identity has been verified successfully!'
                          : user?.kycStatus === 'PENDING'
                          ? 'Your documents are under review. This usually takes 24-48 hours.'
                          : 'Your KYC verification was rejected. Please upload new documents.'
                        }
                      </p>
                    </div>
                  </div>
                  
                  {user?.kycStatus === 'REJECTED' && user?.kycRejectionReason && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800 text-sm">
                        <strong>Reason for rejection:</strong> {user.kycRejectionReason}
                      </p>
                    </div>
                  )}
                </div>

                {/* Upload Section */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload KYC Documents</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">
                          {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                        </p>
                        <input
                          type="file"
                          onChange={handleFileSelect}
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          id="kyc-upload"
                        />
                        <label htmlFor="kyc-upload" className="btn btn-outline cursor-pointer">
                          Choose File
                        </label>
                      </div>
                    </div>

                    {selectedFile && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-gray-900">{selectedFile.name}</p>
                            <p className="text-sm text-gray-600">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleUpload}
                          disabled={isUploading}
                          className="btn btn-primary btn-sm"
                        >
                          {isUploading ? 'Uploading...' : 'Upload'}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Required Documents:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Government-issued ID proof (Aadhaar, PAN, Passport)</li>
                      <li>• Business registration documents</li>
                      <li>• Address proof (Utility bill, Bank statement)</li>
                      <li>• Recent photograph</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Uploaded Documents</h3>
                  <button className="btn btn-primary btn-sm">
                    <Upload className="w-4 h-4" />
                    Upload New
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="card p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getKycStatusColor(doc.status)}`}>
                          {doc.status}
                        </span>
                      </div>
                      
                      <h4 className="font-medium text-gray-900 mb-1">{doc.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{doc.type}</p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{doc.fileSize}</span>
                        <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="mt-3 flex gap-2">
                        <button className="btn btn-outline btn-sm flex-1">
                          <Download className="w-3 h-3" />
                          Download
                        </button>
                        <button className="btn btn-outline btn-sm">
                          <Eye className="w-3 h-3" />
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Security</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Shield className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                        </div>
                      </div>
                      <button className="btn btn-outline btn-sm">Enable</button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Mail className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Email Notifications</p>
                          <p className="text-sm text-gray-600">Get notified about important account activities</p>
                        </div>
                      </div>
                      <button className="btn btn-outline btn-sm">Configure</button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Clock className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Login History</p>
                          <p className="text-sm text-gray-600">View your recent login activities</p>
                        </div>
                      </div>
                      <button className="btn btn-outline btn-sm">View</button>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                  
                  <div className="space-y-4">
                    <div className="form-group">
                      <label className="form-label">Current Password</label>
                      <input type="password" className="form-input" placeholder="Enter current password" />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">New Password</label>
                      <input type="password" className="form-input" placeholder="Enter new password" />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Confirm New Password</label>
                      <input type="password" className="form-input" placeholder="Confirm new password" />
                    </div>
                    
                    <button className="btn btn-primary">Update Password</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
