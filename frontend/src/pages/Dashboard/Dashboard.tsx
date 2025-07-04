import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDashboard } from '../../hooks/useDashboard';
import { useInventory } from '../../hooks/useInventory';
import { useOrders } from '../../hooks/useOrders';
import DashboardStats from './components/DashboardStats';
import SalesChart from './components/SalesChart';
import RecentOrders from './components/RecentOrders';
import LowStockAlert from './components/LowStockAlert';
import Card from "../../components/ui/Card";

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { stats, salesData, loading: statsLoading, salesLoading } = useDashboard();
  const { inventory, loading: inventoryLoading } = useInventory();
  const { orders, loading: ordersLoading } = useOrders();

  const lowStockItems = inventory.filter(item => 
    item.currentStock <= item.minStock
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.title')}</h1>
        <p className="text-gray-600 mt-2">{t('dashboard.subtitle')}</p>
      </div>

      <DashboardStats stats={stats} loading={statsLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title={t('dashboard.salesOverview')} className="lg:col-span-2">
          <SalesChart data={salesData} loading={salesLoading} />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title={t('dashboard.recentOrders')}>
          <RecentOrders orders={orders} loading={ordersLoading} />
        </Card>

        <Card 
          title={t('dashboard.lowStockAlert')} 
          subtitle={`${lowStockItems.length} ${t('dashboard.itemsNeedAttention')}`}
        >
          <LowStockAlert items={lowStockItems} loading={inventoryLoading} />
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;