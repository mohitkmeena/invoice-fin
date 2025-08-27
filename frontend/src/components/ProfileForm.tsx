import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { User, Building, MapPin, Globe, Briefcase } from 'lucide-react';

interface ProfileFormProps {
  formData: {
    fullName: string;
    companyName: string;
    gstin: string;
    pan: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    website: string;
    sector: string;
  };
  isEditing: boolean;
  onInputChange: (field: string, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  formData,
  isEditing,
  onInputChange,
  onSave,
  onCancel,
  isLoading = false
}) => {
  return (
    <Card className="rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="w-5 h-5 text-indigo-600" />
          <span>Personal Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Personal Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => onInputChange('fullName', e.target.value)}
              disabled={!isEditing}
              placeholder="Enter your full name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={formData.companyName}
              onChange={(e) => onInputChange('companyName', e.target.value)}
              disabled={!isEditing}
              placeholder="Enter company name"
            />
          </div>
        </div>

        {/* Business Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gstin">GSTIN</Label>
            <Input
              id="gstin"
              value={formData.gstin}
              onChange={(e) => onInputChange('gstin', e.target.value)}
              disabled={!isEditing}
              placeholder="Enter GSTIN"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pan">PAN</Label>
            <Input
              id="pan"
              value={formData.pan}
              onChange={(e) => onInputChange('pan', e.target.value)}
              disabled={!isEditing}
              placeholder="Enter PAN"
            />
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address" className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>Address</span>
          </Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => onInputChange('address', e.target.value)}
            disabled={!isEditing}
            placeholder="Enter your address"
          />
        </div>

        {/* Location Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => onInputChange('city', e.target.value)}
              disabled={!isEditing}
              placeholder="Enter city"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(e) => onInputChange('state', e.target.value)}
              disabled={!isEditing}
              placeholder="Enter state"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pincode">Pincode</Label>
            <Input
              id="pincode"
              value={formData.pincode}
              onChange={(e) => onInputChange('pincode', e.target.value)}
              disabled={!isEditing}
              placeholder="Enter pincode"
            />
          </div>
        </div>

        {/* Business Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="website" className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Website</span>
            </Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => onInputChange('website', e.target.value)}
              disabled={!isEditing}
              placeholder="Enter website URL"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sector" className="flex items-center space-x-2">
              <Briefcase className="w-4 h-4" />
              <span>Sector</span>
            </Label>
            <Input
              id="sector"
              value={formData.sector}
              onChange={(e) => onInputChange('sector', e.target.value)}
              disabled={!isEditing}
              placeholder="Enter business sector"
            />
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex items-center space-x-3 pt-4">
            <Button
              onClick={onSave}
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileForm;

