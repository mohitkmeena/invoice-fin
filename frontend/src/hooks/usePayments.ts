import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';

export const usePendingPayments = () => {
  return useQuery({
    queryKey: ['pendingPayments'],
    queryFn: () => apiClient.getPendingPayments(),
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};

export const useConfirmPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiClient.confirmPayment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingPayments'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useRejectPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiClient.rejectPayment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingPayments'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
};