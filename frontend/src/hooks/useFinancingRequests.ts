import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import { CreateFinancingRequestForm, FinancingRequest } from '../types';

export const useFinancingRequests = () => {
  const queryClient = useQueryClient();

  const { data: financingRequests, isLoading, error } = useQuery({
    queryKey: ['financing-requests'],
    queryFn: async () => {
      const response = await apiClient.getMyInvoices();
      return response.data || [];
    },
  });

  const createFinancingRequestMutation = useMutation({
    mutationFn: (data: CreateFinancingRequestForm) => apiClient.createFinancingRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financing-requests'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  const getFinancingRequest = (id: string) => {
    return useQuery({
      queryKey: ['financing-request', id],
      queryFn: async () => {
        const response = await apiClient.getInvoice(id);
        return response.data;
      },
      enabled: !!id,
    });
  };

  return {
    financingRequests,
    isLoading,
    error,
    createFinancingRequest: createFinancingRequestMutation.mutate,
    createFinancingRequestAsync: createFinancingRequestMutation.mutateAsync,
    isCreating: createFinancingRequestMutation.isPending,
    getFinancingRequest,
  };
};

