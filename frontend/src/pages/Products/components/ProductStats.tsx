import React from 'react';
import { Package, AlertTriangle, TrendingUp, Archive } from 'lucide-react';

interface ProductStatsProps {
  totalProducts: number;
  inStockProducts: number;
  outOfStockProducts: number;
  lowStockProducts: number;
  loading?: boolean;
}

const ProductStats: React.FC<ProductStatsProps> = ({
  totalProducts,
  inStockProducts,
  outOfStockProducts,
  lowStockProducts,
  loading = false
}) => {
  const stats = [
    {
      label: 'Tổng sản phẩm',
      value: totalProducts,
      icon: Package,
      color: 'blue'
    },
    {
      label: 'Còn hàng',
      value: inStockProducts,
      icon: TrendingUp,
      color: 'green'
    },
    {
      label: 'Sắp hết hàng',
      value: lowStockProducts,
      icon: AlertTriangle,
      color: 'yellow'
    },
    {
      label: 'Hết hàng',
      value: outOfStockProducts,
      icon: Archive,
      color: 'red'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      red: 'bg-red-50 text-red-700 border-red-200'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const getIconColorClasses = (color: string) => {
    const colorMap = {
      blue: 'text-blue-500',
      green: 'text-green-500',
      yellow: 'text-yellow-500',
      red: 'text-red-500'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-6 w-6 bg-gray-200 rounded"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div 
            key={index}
            className={`border rounded-lg p-4 ${getColorClasses(stat.color)}`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">{stat.label}</h3>
              <Icon className={`h-5 w-5 ${getIconColorClasses(stat.color)}`} />
            </div>
            <div className="text-2xl font-bold">
              {stat.value.toLocaleString('vi-VN')}
            </div>
            
            {/* Percentage indicator */}
            {totalProducts > 0 && (
              <div className="text-xs mt-1 opacity-75">
                {((stat.value / totalProducts) * 100).toFixed(1)}% tổng số
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProductStats;