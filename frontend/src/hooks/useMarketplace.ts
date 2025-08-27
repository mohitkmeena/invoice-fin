import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import { CreateFundingOfferForm, FundingOffer } from '../types';

export const useMarketplace = () => {
  const queryClient = useQueryClient();

  const discoverInvoices = (filters?: {
    minAmount?: number;
    maxAmount?: number;
    maxRateBp?: number;
    tenorDays?: number;
    buyerGstin?: string;
    search?: string;
  }) => {
    return useQuery({
      queryKey: ['marketplace-invoices', filters],
      queryFn: async () => {
        const response = await apiClient.discoverInvoices(filters);
        return response.data || [];
      },
      enabled: true,
    });
  };

  const createFundingOfferMutation = useMutation({
    mutationFn: (data: CreateFundingOfferForm) => apiClient.createFundingOffer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-invoices'] });
      queryClient.invalidateQueries({ queryKey: ['my-offers'] });
    },
  });

  const getInvoiceOffers = (invoiceId: string) => {
    return useQuery({
      queryKey: ['invoice-offers', invoiceId],
      queryFn: async () => {
        const response = await apiClient.getInvoiceOffers(invoiceId);
        return response.data || [];
      },
      enabled: !!invoiceId,
    });
  };

  const acceptOfferMutation = useMutation({
    mutationFn: (offerId: string) => apiClient.acceptOffer(offerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoice-offers'] });
      queryClient.invalidateQueries({ queryKey: ['my-deals'] });
      queryClient.invalidateQueries({ queryKey: ['financing-requests'] });
    },
  });

  return {
    discoverInvoices,
    createFundingOffer: createFundingOfferMutation.mutate,
    createFundingOfferAsync: createFundingOfferMutation.mutateAsync,
    isCreatingOffer: createFundingOfferMutation.isPending,
    getInvoiceOffers,
    acceptOffer: acceptOfferMutation.mutate,
    acceptOfferAsync: acceptOfferMutation.mutateAsync,
    isAcceptingOffer: acceptOfferMutation.isPending,
  };
};

