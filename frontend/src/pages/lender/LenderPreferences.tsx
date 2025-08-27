import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { useLenderPreferences } from '../../hooks/useLenderPreferences';
import { LenderPreference } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Card } from '../../components/ui/Card';
import { AlertCircle, Save, ArrowLeft, CheckCircle } from 'lucide-react';

const lenderPreferencesSchema = z.object({
  sectorsAllowed: z.array(z.string()).min(1, 'At least one sector must be selected'),
  minAmount: z.number().min(10000, 'Minimum amount must be at least ₹10,000'),
  maxAmount: z.number().min(10000, 'Maximum amount must be at least ₹10,000'),
  maxTenorDays: z.number().min(30, 'Maximum tenor must be at least 30 days').max(365, 'Maximum tenor cannot exceed 365 days'),
  rateRangeMin: z.number().min(0, 'Minimum rate cannot be negative'),
  rateRangeMax: z.number().min(0, 'Maximum rate cannot be negative'),
  minCreditScore: z.number().min(300, 'Minimum credit score must be at least 300').max(900, 'Maximum credit score cannot exceed 900').optional(),
  statesAllowed: z.array(z.string()).min(1, 'At least one state must be selected'),
});

type LenderPreferencesFormData = z.infer<typeof lenderPreferencesSchema>;

const sectors = [
  'Manufacturing', 'Technology', 'Healthcare', 'Finance', 'Retail',
  'Construction', 'Transportation', 'Energy', 'Agriculture', 'Education',
  'Real Estate', 'Media', 'Telecommunications', 'Food & Beverage', 'Automotive'
];

const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir',
  'Ladakh', 'Chandigarh', 'Dadra & Nagar Haveli', 'Daman & Diu', 'Lakshadweep',
  'Puducherry', 'Andaman & Nicobar Islands'
];

const LenderPreferences: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { preferences, updatePreferences, isUpdating } = useLenderPreferences();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LenderPreferencesFormData>({
    resolver: zodResolver(lenderPreferencesSchema),
    defaultValues: {
      sectorsAllowed: [],
      minAmount: 100000,
      maxAmount: 10000000,
      maxTenorDays: 90,
      rateRangeMin: 12,
      rateRangeMax: 24,
      minCreditScore: 650,
      statesAllowed: [],
    },
  });

  // Load existing preferences when component mounts
  useEffect(() => {
    if (preferences) {
      setValue('sectorsAllowed', preferences.sectorsAllowed || []);
      setValue('minAmount', preferences.minAmount || 100000);
      setValue('maxAmount', preferences.maxAmount || 10000000);
      setValue('maxTenorDays', preferences.maxTenorDays || 90);
      setValue('rateRangeMin', preferences.rateRangeMin || 12);
      setValue('rateRangeMax', preferences.rateRangeMax || 24);
      setValue('minCreditScore', preferences.minCreditScore || 650);
      setValue('statesAllowed', preferences.statesAllowed || []);
    }
  }, [preferences, setValue]);

  const onSubmit = async (data: LenderPreferencesFormData) => {
    try {
      setError(null);
      setSuccess(null);

      await updatePreferences(data);
      setSuccess('Preferences updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update preferences');
    }
  };

  if (!user?.roles.includes('LENDER')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">Only lenders can access this page.</p>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Lender Preferences</h1>
          </div>
          <p className="text-gray-600">
            Configure your lending preferences to receive better invoice matches
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

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                {success}
              </div>
            )}

            {/* Sectors */}
            <div>
              <Label>Sectors You're Interested In</Label>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
                {sectors.map((sector) => (
                  <label key={sector} className="flex items-center">
                    <input
                      type="checkbox"
                      value={sector}
                      {...register('sectorsAllowed')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{sector}</span>
                  </label>
                ))}
              </div>
              {errors.sectorsAllowed && (
                <p className="text-red-600 text-sm mt-1">{errors.sectorsAllowed.message}</p>
              )}
            </div>

            {/* Amount Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="minAmount">Minimum Amount (₹)</Label>
                <Input
                  id="minAmount"
                  type="number"
                  step="10000"
                  {...register('minAmount', { valueAsNumber: true })}
                  placeholder="100000"
                />
                {errors.minAmount && (
                  <p className="text-red-600 text-sm mt-1">{errors.minAmount.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="maxAmount">Maximum Amount (₹)</Label>
                <Input
                  id="maxAmount"
                  type="number"
                  step="100000"
                  {...register('maxAmount', { valueAsNumber: true })}
                  placeholder="10000000"
                />
                {errors.maxAmount && (
                  <p className="text-red-600 text-sm mt-1">{errors.maxAmount.message}</p>
                )}
              </div>
            </div>

            {/* Tenor */}
            <div>
              <Label htmlFor="maxTenorDays">Maximum Tenor (Days)</Label>
              <Input
                id="maxTenorDays"
                type="number"
                step="15"
                {...register('maxTenorDays', { valueAsNumber: true })}
                placeholder="90"
              />
              {errors.maxTenorDays && (
                <p className="text-red-600 text-sm mt-1">{errors.maxTenorDays.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Maximum number of days you're willing to wait for repayment
              </p>
            </div>

            {/* Interest Rate Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="rateRangeMin">Minimum Interest Rate (% p.a.)</Label>
                <Input
                  id="rateRangeMin"
                  type="number"
                  step="0.5"
                  {...register('rateRangeMin', { valueAsNumber: true })}
                  placeholder="12"
                />
                {errors.rateRangeMin && (
                  <p className="text-red-600 text-sm mt-1">{errors.rateRangeMin.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="rateRangeMax">Maximum Interest Rate (% p.a.)</Label>
                <Input
                  id="rateRangeMax"
                  type="number"
                  step="0.5"
                  {...register('rateRangeMax', { valueAsNumber: true })}
                  placeholder="24"
                />
                {errors.rateRangeMax && (
                  <p className="text-red-600 text-sm mt-1">{errors.rateRangeMax.message}</p>
                )}
              </div>
            </div>

            {/* Credit Score */}
            <div>
              <Label htmlFor="minCreditScore">Minimum Credit Score (Optional)</Label>
              <Input
                id="minCreditScore"
                type="number"
                step="50"
                {...register('minCreditScore', { valueAsNumber: true })}
                placeholder="650"
              />
              {errors.minCreditScore && (
                <p className="text-red-600 text-sm mt-1">{errors.minCreditScore.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Leave empty if you don't want to filter by credit score
              </p>
            </div>

            {/* States */}
            <div>
              <Label>States You're Interested In</Label>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                {states.map((state) => (
                  <label key={state} className="flex items-center">
                    <input
                      type="checkbox"
                      value={state}
                      {...register('statesAllowed')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{state}</span>
                  </label>
                ))}
              </div>
              {errors.statesAllowed && (
                <p className="text-red-600 text-sm mt-1">{errors.statesAllowed.message}</p>
              )}
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
                disabled={isUpdating}
              >
                <Save className="w-4 h-4 mr-2" />
                {isUpdating ? 'Saving...' : 'Save Preferences'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LenderPreferences;
