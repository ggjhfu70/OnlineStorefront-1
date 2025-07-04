import React, { useState } from "react";
import { useProducts } from "../../hooks/useProducts";
import { useAuth } from "../../hooks/useAuth";
import ProductCard from "./components/ProductCard";
import ProductFilters from "./components/ProductFilters";
import ProductStats from "./components/ProductStats";
import ProductForm from "./components/ProductForm";
import ProductDetailsView from "./components/ProductDetailsView";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { PlusCircle, Grid, List, Eye, Edit, Trash2 } from "lucide-react";
import { Product } from "../../types";

const Products: React.FC = () => {
  const { user, canPerformAction } = useAuth();
  const {
    products,
    categories,
    loading,
    error,
    totalProducts,
    inStockProducts,
    outOfStockProducts,
    lowStockProducts,
    searchProducts,
    filterByCategory,
    filterByPrice,
    filterInStock,
    resetFilters,
    createProduct,
    updateProduct,
    deleteProduct,
    updateVariantStock
  } = useProducts();

  // UI State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Debug logging
  console.log('Products render - isCreateModalOpen:', isCreateModalOpen);
  console.log('Products render - editingProduct:', editingProduct);
  console.log('Products render - categories:', categories);

  // Handle product actions - Page component quản lý state và truyền xuống components
  const handleCreateProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await createProduct(productData);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Có lỗi xảy ra khi tạo sản phẩm');
    }
  };

  const handleUpdateProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingProduct) return;

    try {
      await updateProduct(editingProduct.id, productData);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Có lỗi xảy ra khi cập nhật sản phẩm');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await deleteProduct(productId);
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Có lỗi xảy ra khi xóa sản phẩm');
      }
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleViewProduct = (product: Product) => {
    setViewingProduct(product);
  };

  const handleUpdateStock = async (productId: string, variantId: string, stock: number) => {
    try {
      await updateVariantStock(productId, variantId, stock);
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Có lỗi xảy ra khi cập nhật tồn kho');
    }
  };

  // Loading state
  if (loading && products.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
            <p className="text-gray-600">Quản lý danh mục sản phẩm và kho hàng</p>
          </div>
        </div>

        <div className="animate-pulse space-y-6">
          <div className="bg-gray-200 h-24 rounded-lg"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
            ))}
          </div>
          <div className="bg-gray-200 h-96 rounded-lg"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
            <p className="text-gray-600">Quản lý danh mục sản phẩm và kho hàng</p>
          </div>
        </div>

        <div className="text-center py-12">
          <div className="text-red-600 text-lg font-medium mb-2">Có lỗi xảy ra</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
          <p className="text-gray-600">Quản lý danh mục sản phẩm và kho hàng</p>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex rounded-lg border border-gray-300">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none border-r-0"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Add Product Button - Always show for debugging */}
          <Button
            onClick={() => {
              console.log('Add product button clicked');
              console.log('Before setIsCreateModalOpen - current state:', isCreateModalOpen);
              setIsCreateModalOpen(true);
              console.log('After setIsCreateModalOpen - setting to true');
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Thêm sản phẩm
          </Button>
        </div>
      </div>

      {/* Stats */}
      <ProductStats
        totalProducts={totalProducts}
        inStockProducts={inStockProducts}
        outOfStockProducts={outOfStockProducts}
        lowStockProducts={lowStockProducts}
        loading={loading}
      />

      {/* Filters */}
      <ProductFilters
        categories={categories}
        onSearch={searchProducts}
        onFilterByCategory={filterByCategory}
        onFilterByPrice={filterByPrice}
        onFilterInStock={filterInStock}
        onReset={resetFilters}
        loading={loading}
      />

      {/* Products Display */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg font-medium mb-2">Không có sản phẩm</div>
          <p className="text-gray-600">Chưa có sản phẩm nào hoặc không tìm thấy sản phẩm phù hợp với bộ lọc.</p>
          {canPerformAction('manage_products') && (
            <Button
              onClick={() => {
                console.log('Add first product button clicked');
                setIsCreateModalOpen(true);
              }}
              className="mt-4 bg-blue-600 hover:bg-blue-700"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Thêm sản phẩm đầu tiên
            </Button>
          )}
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            // Grid View
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onView={(product) => {
                    console.log('View product details:', product);
                    handleViewProduct(product);
                  }}
                  onEdit={(product) => {
                    console.log('Edit product from card:', product);
                    handleEditProduct(product);
                  }}
                  onDelete={handleDeleteProduct}
                  onUpdateStock={handleUpdateStock}
                />
              ))}
            </div>
          ) : (
            // List View
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sản phẩm
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giá
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tồn kho
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => {
                    const totalStock = product.variants.reduce((sum, variant) => sum + variant.stock, 0);
                    const isLowStock = totalStock <= 10;
                    const isOutOfStock = totalStock === 0;

                    return (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.description}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.sku}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.price.toLocaleString('vi-VN')} ₫
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{totalStock}</div>
                            {product.variants.length > 1 && (
                              <div className="text-xs text-gray-500">{product.variants.length} biến thể</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            isOutOfStock 
                              ? 'bg-red-100 text-red-800' 
                              : isLowStock 
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {isOutOfStock ? 'Hết hàng' : isLowStock ? 'Sắp hết' : 'Còn hàng'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              console.log('View details clicked:', product);
                              handleViewProduct(product);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Xem
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              console.log('Edit product clicked:', product);
                              handleEditProduct(product);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Sửa
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Xóa
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Loading overlay for actions */}
      {loading && products.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Đang xử lý...</p>
          </div>
        </div>
      )}

      {/* Create Product Modal */}
      <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Tạo sản phẩm mới"
          size="lg"
        >
        <div className="bg-white rounded-lg shadow-xl  w-full mx-4 max-h-[90vh] overflow-auto">
            <ProductForm
              categories={categories}
              onSubmit={handleCreateProduct}
              onCancel={() => setIsCreateModalOpen(false)}
              loading={loading}
            />
          </div>
        </Modal>

      {/* View Product Details Modal */}
      <Modal
          isOpen={!!viewingProduct}
          onClose={() => setViewingProduct(null)}
          title="Chi tiết sản phẩm"
          size="lg"
        >
        <div className="bg-white rounded-lg shadow-xl w-full mx-4 max-h-[90vh] overflow-auto">
          {viewingProduct && (
            <ProductDetailsView
              product={viewingProduct}
              onClose={() => setViewingProduct(null)}
              onEdit={() => {
                setEditingProduct(viewingProduct);
                setViewingProduct(null);
              }}
            />
          )}
        </div>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          title="Chỉnh sửa sản phẩm"
          size="lg"
        >
        <div className="bg-white rounded-lg shadow-xl  w-full mx-4 max-h-[90vh] overflow-auto">
            <ProductForm
              product={editingProduct}
              categories={categories}
              onSubmit={handleUpdateProduct}
              onCancel={() => setEditingProduct(null)}
              loading={loading}
            />
          </div>
        </Modal>
    </div>
  );
};

export default Products;