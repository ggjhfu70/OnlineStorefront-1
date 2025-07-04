import { useState, useEffect } from 'react';
import { productService, ProductFilters } from '../services/productService';
import { Product } from '../types';
import { mockProductsWithCategories } from '../data/mockProductsWithCategories';

// Custom hook để quản lý state và tương tác với product service
export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductFilters>({});

  // Load products với filters
  const loadProducts = async (newFilters?: ProductFilters) => {
    try {
      setLoading(true);
      setError(null);
      const currentFilters = newFilters || filters;
      
      try {
        const data = await productService.getAll(currentFilters);
        setProducts(data);
      } catch (serviceError) {
        console.log('Service failed, using mock data:', serviceError);
        // Fallback to mock data
        let filteredProducts = [...mockProductsWithCategories];
        
        // Apply filters to mock data
        if (currentFilters.search) {
          const searchTerm = currentFilters.search.toLowerCase();
          filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.sku.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm)
          );
        }
        
        if (currentFilters.category) {
          filteredProducts = filteredProducts.filter(p => p.category === currentFilters.category);
        }
        
        if (currentFilters.priceMin !== undefined) {
          filteredProducts = filteredProducts.filter(p => p.price >= currentFilters.priceMin!);
        }
        
        if (currentFilters.priceMax !== undefined) {
          filteredProducts = filteredProducts.filter(p => p.price <= currentFilters.priceMax!);
        }
        
        if (currentFilters.inStock !== undefined) {
          filteredProducts = filteredProducts.filter(p => {
            const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
            return currentFilters.inStock ? totalStock > 0 : totalStock === 0;
          });
        }
        
        setProducts(filteredProducts);
      }
      
      if (newFilters) {
        setFilters(newFilters);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải sản phẩm');
      // Last resort: set empty array
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Load categories
  const loadCategories = async () => {
    try {
      const data = await productService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error loading categories, using fallback:', err);
      // Fallback categories
      setCategories([
        { id: 'fashion', name: 'Thời trang' },
        { id: 'electronics', name: 'Điện tử' },
        { id: 'home_garden', name: 'Nhà cửa & Sân vườn' },
        { id: 'sports_outdoor', name: 'Thể thao & Dã ngoại' },
        { id: 'food_beverage', name: 'Thực phẩm & Đồ uống' },
        { id: 'beauty_personal', name: 'Làm đẹp & Chăm sóc cá nhân' },
        { id: 'books_media', name: 'Sách & Media' }
      ]);
    }
  };

  // Tìm kiếm sản phẩm
  const searchProducts = async (query: string) => {
    const searchFilters = { ...filters, search: query };
    await loadProducts(searchFilters);
  };

  // Lọc theo danh mục
  const filterByCategory = async (categoryId: string) => {
    const categoryFilters = { ...filters, category: categoryId };
    await loadProducts(categoryFilters);
  };

  // Lọc theo giá
  const filterByPrice = async (priceMin?: number, priceMax?: number) => {
    const priceFilters = { ...filters, priceMin, priceMax };
    await loadProducts(priceFilters);
  };

  // Lọc sản phẩm còn hàng
  const filterInStock = async (inStock: boolean) => {
    const stockFilters = { ...filters, inStock };
    await loadProducts(stockFilters);
  };

  // Reset filters
  const resetFilters = async () => {
    const emptyFilters = {};
    setFilters(emptyFilters);
    await loadProducts(emptyFilters);
  };

  // Tạo sản phẩm mới
  const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        const newProduct = await productService.create(productData);
        setProducts(prev => [newProduct, ...prev]);
        return newProduct;
      } catch (serviceError) {
        // Fallback: create mock product
        const newProduct: Product = {
          ...productData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setProducts(prev => [newProduct, ...prev]);
        console.log('Created product locally (mock):', newProduct);
        return newProduct;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo sản phẩm';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật sản phẩm
  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedProduct = await productService.update(id, updates);
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      return updatedProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật sản phẩm';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Xóa sản phẩm
  const deleteProduct = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await productService.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi xóa sản phẩm';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Lấy sản phẩm theo ID
  const getProductById = async (id: string): Promise<Product | null> => {
    try {
      return await productService.getById(id);
    } catch (err) {
      console.error('Error getting product by ID:', err);
      return null;
    }
  };

  // Cập nhật stock của variant
  const updateVariantStock = async (productId: string, variantId: string, stock: number) => {
    try {
      setLoading(true);
      setError(null);
      const updatedProduct = await productService.updateVariantStock(productId, variantId, stock);
      setProducts(prev => prev.map(p => p.id === productId ? updatedProduct : p));
      return updatedProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật tồn kho';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Load initial data khi hook được mount
  useEffect(() => {
    console.log('useProducts useEffect - loading products and categories');
    loadProducts();
    loadCategories();
  }, []);

  useEffect(() => {
    console.log('useProducts - categories updated:', categories);
  }, [categories]);

  return {
    // Data
    products,
    categories,
    loading,
    error,
    filters,

    // Actions
    loadProducts,
    searchProducts,
    filterByCategory,
    filterByPrice,
    filterInStock,
    resetFilters,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    updateVariantStock,

    // Stats
    totalProducts: products.length,
    inStockProducts: products.filter(p => p.variants.some(v => v.stock > 0)).length,
    outOfStockProducts: products.filter(p => p.variants.every(v => v.stock === 0)).length,
    lowStockProducts: products.filter(p => 
      p.variants.some(v => v.stock > 0 && v.stock <= 10)
    ).length
  };
};