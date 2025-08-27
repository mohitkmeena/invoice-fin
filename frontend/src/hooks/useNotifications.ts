import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';

export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => apiClient.getNotifications(),
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiClient.markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};