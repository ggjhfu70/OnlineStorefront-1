import { useState, useEffect } from 'react';
import { orderStatusService, OrderStatus, OrderStatusStats } from '../services/orderStatusService';
import { useAuth } from './useAuth';

export const useOrderStatus = () => {
  const [statuses, setStatuses] = useState<Record<string, OrderStatus>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchStatuses = async () => {
    try {
      setLoading(true);
      const data = await orderStatusService.getAllStatuses();
      setStatuses(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch order statuses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusesForFilter = async () => {
    try {
      return await orderStatusService.getStatusesForFilter();
    } catch (err) {
      console.error('Failed to get filter statuses:', err);
      return [];
    }
  };

  const getStatusesExcludingAll = async () => {
    try {
      return await orderStatusService.getStatusesExcludingAll();
    } catch (err) {
      console.error('Failed to get statuses excluding all:', err);
      return [];
    }
  };

  const canTransitionTo = async (fromStatus: string, toStatus: string) => {
    if (!user) return false;

    try {
      return await orderStatusService.canTransitionTo(fromStatus, toStatus, user.role);
    } catch (err) {
      console.error('Failed to check transition permission:', err);
      return false;
    }
  };

  const getAvailableTransitions = async (currentStatus: string) => {
    if (!user) return [];

    try {
      return await orderStatusService.getAvailableTransitions(currentStatus, user.role);
    } catch (err) {
      console.error('Failed to get available transitions:', err);
      return [];
    }
  };

  const calculateStats = (orders: any[]): OrderStatusStats => {
    return orderStatusService.calculateStats(orders);
  };

  const getStatusLabel = (statusKey: string): string => {
    return orderStatusService.getStatusLabel(statusKey);
  };

  const getStatusColor = (statusKey: string): string => {
    return orderStatusService.getStatusColor(statusKey);
  };

  const getStatusBadgeStyle = (statusKey: string): string => {
    return orderStatusService.getStatusBadgeStyle(statusKey);
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  return {
    statuses,
    loading,
    error,
    fetchStatuses,
    getStatusesForFilter,
    getStatusesExcludingAll,
    canTransitionTo,
    getAvailableTransitions,
    calculateStats,
    getStatusLabel,
    getStatusColor,
    getStatusBadgeStyle,
    filterOrders: orderStatusService.filterOrders,
  };
};