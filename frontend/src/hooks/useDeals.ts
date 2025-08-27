import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import { Deal } from '../types';

export const useDeals = () => {
  const queryClient = useQueryClient();

  const { data: deals, isLoading, error } = useQuery({
    queryKey: ['my-deals'],
    queryFn: async () => {
      const response = await apiClient.getMyDeals();
      return response.data || [];
    },
  });

  const getDeal = (id: string) => {
    return useQuery({
      queryKey: ['deal', id],
      queryFn: async () => {
        const response = await apiClient.getDeal(id);
        return response.data;
      },
      enabled: !!id,
    });
  };

  const getDealContacts = (dealId: string) => {
    return useQuery({
      queryKey: ['deal-contacts', dealId],
      queryFn: async () => {
        const response = await apiClient.getDealContacts(dealId);
        return response.data;
      },
      enabled: !!dealId,
    });
  };

  const sendDealMessageMutation = useMutation({
    mutationFn: ({ dealId, message }: { dealId: string; message: string }) =>
      apiClient.sendDealMessage(dealId, message),
    onSuccess: (_, { dealId }) => {
      queryClient.invalidateQueries({ queryKey: ['deal-messages', dealId] });
    },
  });

  const getDealMessages = (dealId: string) => {
    return useQuery({
      queryKey: ['deal-messages', dealId],
      queryFn: async () => {
        const response = await apiClient.getDealMessages(dealId);
        return response.data || [];
      },
      enabled: !!dealId,
    });
  };

  return {
    deals,
    isLoading,
    error,
    getDeal,
    getDealContacts,
    sendDealMessage: sendDealMessageMutation.mutate,
    sendDealMessageAsync: sendDealMessageMutation.mutateAsync,
    isSendingMessage: sendDealMessageMutation.isPending,
    getDealMessages,
  };
};

