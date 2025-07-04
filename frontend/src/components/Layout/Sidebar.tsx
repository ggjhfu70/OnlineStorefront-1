import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { 
  LayoutDashboard, 
  Package, 
  Warehouse, 
  ShoppingCart, 
  Users, 
  BarChart3,
  Store,
  Truck,
  FileText,

  Menu,
  ChevronLeft,
  UserCog
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const { canPerformAction } = useAuth();

  const allNavigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, action: null },
    { name: 'Sản phẩm', href: '/products', icon: Package, action: 'manage_inventory' },
    { name: 'Kho hàng', href: '/inventory', icon: Warehouse, action: 'manage_inventory' },
    { name: 'Đơn hàng', href: '/orders', icon: ShoppingCart, action: null },
    { name: 'Khách hàng', href: '/customers', icon: Users, action: 'search_customers' },
    { name: 'Quản lý tài khoản', href: '/users', icon: UserCog, action: 'manage_users' },
    { name: 'Nhà cung cấp', href: '/suppliers', icon: Truck, action: 'manage_inventory' },
    { name: 'Đơn mua hàng', href: '/purchase-orders', icon: FileText, action: 'manage_inventory' },
    { name: 'Báo cáo', href: '/reports', icon: BarChart3, action: 'view_reports' },
  ];

  // Filter navigation based on user permissions
  const navigation = allNavigation.filter(item => 
    !item.action || canPerformAction(item.action)
  );

  return (
    <div className={`fixed inset-y-0 left-0 z-50 bg-white shadow-lg transition-all duration-300 ${
      isOpen ? 'w-64' : 'w-16'
    }`}>
      {/* Header */}
      <div className="flex h-16 items-center justify-center border-b border-gray-200 px-3">
        <div className={`flex items-center space-x-2 transition-opacity duration-200 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}>
          <Store className="h-8 w-8 text-blue-600" />
          {isOpen && (
            <span className="text-xl font-bold text-gray-900">{t('sidebar.inventoryPro')}</span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`group flex items-center px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:scale-105'
                  }`}
                  title={!isOpen ? item.name : undefined}
                >
                  <item.icon
                    className={`${isOpen ? 'mr-4' : 'mx-auto'} h-6 w-6 transition-all duration-200 ${
                      isActive ? 'text-white' : 'text-blue-500 group-hover:text-blue-600'
                    }`}
                  />
                  {isOpen && (
                    <span className="transition-opacity duration-200 font-medium">{item.name}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Toggle button in middle of sidebar */}
      <div className="absolute top-1/2 -right-3 transform -translate-y-1/2">
        <button
          onClick={onToggle}
          className="w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
          title={isOpen ? 'Thu gọn sidebar' : 'Mở rộng sidebar'}
        >
          {isOpen ? (
            <ChevronLeft className="h-3 w-3" />
          ) : (
            <Menu className="h-3 w-3" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;