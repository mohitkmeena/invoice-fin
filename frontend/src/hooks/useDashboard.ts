import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api';

export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: apiClient.getDashboardData,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};