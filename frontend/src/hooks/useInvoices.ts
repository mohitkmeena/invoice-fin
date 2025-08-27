import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';

export const useInvoices = (page = 0, size = 10, status?: string) => {
  return useQuery({
    queryKey: ['invoices', page, size, status],
    queryFn: () => apiClient.getInvoices(page, size, status),
  });
};

export const useInvoice = (id: string) => {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: () => apiClient.getInvoice(id),
    enabled: !!id,
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => apiClient.createInvoice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiClient.updateInvoice(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useSendInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, method }: { id: string; method: 'EMAIL' | 'WHATSAPP' }) => 
      apiClient.sendInvoice(id, method),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
};

export const usePublicInvoice = (shareToken: string) => {
  return useQuery({
    queryKey: ['publicInvoice', shareToken],
    queryFn: () => apiClient.getPublicInvoice(shareToken),
    enabled: !!shareToken,
  });
};

export const useMarkInvoicePaid = () => {
  return useMutation({
    mutationFn: ({ shareToken, paymentData }: { shareToken: string; paymentData: any }) => 
      apiClient.markInvoicePaid(shareToken, paymentData),
  });
};