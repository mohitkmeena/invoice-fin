import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import { LenderPreference } from '../types';

export const useLenderPreferences = () => {
  const queryClient = useQueryClient();

  const { data: preferences, isLoading, error } = useQuery({
    queryKey: ['lender-preferences'],
    queryFn: async () => {
      const response = await apiClient.getLenderPreferences();
      return response.data;
    },
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: (data: Partial<LenderPreference>) => apiClient.updateLenderPreferences(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lender-preferences'] });
    },
  });

  return {
    preferences,
    isLoading,
    error,
    updatePreferences: updatePreferencesMutation.mutate,
    updatePreferencesAsync: updatePreferencesMutation.mutateAsync,
    isUpdating: updatePreferencesMutation.isPending,
  };
};

