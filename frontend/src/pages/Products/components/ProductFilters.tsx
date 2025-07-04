import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import Button from '../../../components/ui/Button';

interface FilterState {
  search: string;
  category: string;
  priceMin: string;
  priceMax: string;
  inStock: boolean | null;
}

interface ProductFiltersProps {
  categories: Array<{ id: string; name: string }>;
  onSearch: (query: string) => void;
  onFilterByCategory: (categoryId: string) => void;
  onFilterByPrice: (priceMin?: number, priceMax?: number) => void;
  onFilterInStock: (inStock: boolean) => void;
  onReset: () => void;
  loading?: boolean;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  onSearch,
  onFilterByCategory,
  onFilterByPrice,
  onFilterInStock,
  onReset,
  loading = false
}) => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    priceMin: '',
    priceMax: '',
    inStock: null
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
    onSearch(value);
  };

  const handleCategoryChange = (categoryId: string) => {
    setFilters(prev => ({ ...prev, category: categoryId }));
    onFilterByCategory(categoryId);
  };

  const handlePriceFilter = () => {
    const priceMin = filters.priceMin ? parseFloat(filters.priceMin) : undefined;
    const priceMax = filters.priceMax ? parseFloat(filters.priceMax) : undefined;
    onFilterByPrice(priceMin, priceMax);
  };

  const handleStockFilter = (inStock: boolean) => {
    setFilters(prev => ({ ...prev, inStock }));
    onFilterInStock(inStock);
  };

  const handleReset = () => {
    setFilters({
      search: '',
      category: '',
      priceMin: '',
      priceMax: '',
      inStock: null
    });
    setShowAdvancedFilters(false);
    onReset();
  };

  const hasActiveFilters = filters.search || filters.category || filters.priceMin || filters.priceMax || filters.inStock !== null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      {/* Basic Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Tìm kiếm theo tên sản phẩm, SKU..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            Bộ lọc
          </Button>
          
          {hasActiveFilters && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleReset}
              className="flex items-center"
            >
              <X className="h-4 w-4 mr-2" />
              Xóa bộ lọc
            </Button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="border-t border-gray-200 pt-4 space-y-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
            <select
              value={filters.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="">Tất cả danh mục</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Giá từ (₫)</label>
              <input
                type="number"
                value={filters.priceMin}
                onChange={(e) => setFilters(prev => ({ ...prev, priceMin: e.target.value }))}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Giá đến (₫)</label>
              <input
                type="number"
                value={filters.priceMax}
                onChange={(e) => setFilters(prev => ({ ...prev, priceMax: e.target.value }))}
                placeholder="999999999"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
          </div>

          {/* Apply Price Filter Button */}
          {(filters.priceMin || filters.priceMax) && (
            <div>
              <Button
                type="button"
                onClick={handlePriceFilter}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                Áp dụng bộ lọc giá
              </Button>
            </div>
          )}

          {/* Stock Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tình trạng tồn kho</label>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={filters.inStock === null ? "primary" : "secondary"}
                size="sm"
                onClick={() => setFilters(prev => ({ ...prev, inStock: null }))}
                disabled={loading}
              >
                Tất cả
              </Button>
              <Button
                type="button"
                variant={filters.inStock === true ? "primary" : "secondary"}
                size="sm"
                onClick={() => handleStockFilter(true)}
                disabled={loading}
              >
                Còn hàng
              </Button>
              <Button
                type="button"
                variant={filters.inStock === false ? "primary" : "secondary"}
                size="sm"
                onClick={() => handleStockFilter(false)}
                disabled={loading}
              >
                Hết hàng
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700">Bộ lọc đang áp dụng:</span>
            
            {filters.search && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Tìm kiếm: {filters.search}
              </span>
            )}
            
            {filters.category && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Danh mục: {categories.find(c => c.id === filters.category)?.name}
              </span>
            )}
            
            {(filters.priceMin || filters.priceMax) && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Giá: {filters.priceMin || 0} - {filters.priceMax || '∞'} ₫
              </span>
            )}
            
            {filters.inStock !== null && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {filters.inStock ? 'Còn hàng' : 'Hết hàng'}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;