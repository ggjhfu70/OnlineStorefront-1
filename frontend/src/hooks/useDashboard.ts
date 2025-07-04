import { useState, useEffect } from 'react';
import { DashboardStats } from '../types';
import { dashboardService } from '../services/dashboardService';
import { useAuth } from './useAuth';

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [salesLoading, setSalesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getStats(user?.id, user?.role);
      setStats(data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch dashboard stats');
      console.error('Dashboard stats error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSalesData = async () => {
    try {
      setSalesLoading(true);
      const data = await dashboardService.getSalesData(user?.id, user?.role);
      setSalesData(data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch sales data');
      console.error('Sales data error:', error);
    } finally {
      setSalesLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStats();
      fetchSalesData();
    }
  }, [user]);

  return {
    stats,
    salesData,
    loading,
    salesLoading,
    error,
    fetchStats,
    fetchSalesData,
    refetch: () => {
      fetchStats();
      fetchSalesData();
    }
  };
};