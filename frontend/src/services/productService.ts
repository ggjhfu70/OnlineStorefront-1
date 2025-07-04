import { BaseHybridService } from './baseService';
import { Product } from '../types';
import { mockProducts, mockCategories } from '../data/centralizedMockData';

interface ProductFilters {
  search?: string;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  inStock?: boolean;
}

class ProductService extends BaseHybridService {
  private products: Product[] = mockProducts;

  // Lấy tất cả sản phẩm với bộ lọc
  async getAll(filters?: ProductFilters): Promise<Product[]> {
    try {
      if (this.isUsingBackend()) {
        const queryParams = new URLSearchParams();
        if (filters?.search) queryParams.append('search', filters.search);
        if (filters?.category) queryParams.append('category', filters.category);
        if (filters?.priceMin) queryParams.append('priceMin', filters.priceMin.toString());
        if (filters?.priceMax) queryParams.append('priceMax', filters.priceMax.toString());
        if (filters?.inStock !== undefined) queryParams.append('inStock', filters.inStock.toString());

        return await this.apiRequest<Product[]>(`/products?${queryParams}`);
      }

      // Mock logic with filters
      await new Promise(resolve => setTimeout(resolve, this.getMockDelay()));

      let filteredProducts = [...this.products];

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
          product.name.toLowerCase().includes(searchLower) ||
          product.sku.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower)
        );
      }

      if (filters?.category) {
        filteredProducts = filteredProducts.filter(product =>
          product.category === filters.category
        );
      }

      if (filters?.priceMin !== undefined) {
        filteredProducts = filteredProducts.filter(product =>
          product.price >= filters.priceMin!
        );
      }

      if (filters?.priceMax !== undefined) {
        filteredProducts = filteredProducts.filter(product =>
          product.price <= filters.priceMax!
        );
      }

      if (filters?.inStock) {
        filteredProducts = filteredProducts.filter(product =>
          product.variants.some(variant => variant.stock > 0)
        );
      }

      return filteredProducts;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  // Lấy sản phẩm theo ID
  async getById(id: string): Promise<Product | null> {
    try {
      if (this.isUsingBackend()) {
        return await this.apiRequest<Product>(`/products/${id}`);
      }

      await new Promise(resolve => setTimeout(resolve, this.getMockDelay()));
      return this.products.find(p => p.id === id) || null;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  // Tạo sản phẩm mới
  async create(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    try {
      if (this.isUsingBackend()) {
        return await this.apiRequest<Product>('/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });
      }

      await new Promise(resolve => setTimeout(resolve, this.getMockDelay()));

      const newProduct: Product = {
        ...productData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.products.push(newProduct);
      return newProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  // Cập nhật sản phẩm
  async update(id: string, updates: Partial<Product>): Promise<Product> {
    try {
      if (this.isUsingBackend()) {
        return await this.apiRequest<Product>(`/products/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });
      }

      await new Promise(resolve => setTimeout(resolve, this.getMockDelay()));

      const index = this.products.findIndex(p => p.id === id);
      if (index === -1) {
        throw new Error('Product not found');
      }

      const updatedProduct = {
        ...this.products[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      this.products[index] = updatedProduct;
      return updatedProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  // Xóa sản phẩm
  async delete(id: string): Promise<void> {
    try {
      if (this.isUsingBackend()) {
        await this.apiRequest(`/products/${id}`, { method: 'DELETE' });
        return;
      }

      await new Promise(resolve => setTimeout(resolve, this.getMockDelay()));

      const index = this.products.findIndex(p => p.id === id);
      if (index === -1) {
        throw new Error('Product not found');
      }

      this.products.splice(index, 1);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // Lấy danh sách danh mục
  async getCategories(): Promise<Array<{ id: string; name: string }>> {
    try {
      if (this.isUsingBackend()) {
        return await this.apiRequest<Array<{ id: string; name: string }>>('/categories');
      }

      await new Promise(resolve => setTimeout(resolve, this.getMockDelay()));
      return [...mockCategories];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  // Tìm kiếm sản phẩm theo tên hoặc SKU
  async search(query: string): Promise<Product[]> {
    return this.getAll({ search: query });
  }

  // Lấy sản phẩm theo danh mục
  async getByCategory(categoryId: string): Promise<Product[]> {
    return this.getAll({ category: categoryId });
  }

  // Cập nhật stock của variant
  async updateVariantStock(productId: string, variantId: string, stock: number): Promise<Product> {
    try {
      if (this.isUsingBackend()) {
        return await this.apiRequest<Product>(`/products/${productId}/variants/${variantId}/stock`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stock })
        });
      }

      await new Promise(resolve => setTimeout(resolve, this.getMockDelay()));

      const productIndex = this.products.findIndex(p => p.id === productId);
      if (productIndex === -1) {
        throw new Error('Product not found');
      }

      const product = this.products[productIndex];
      const variantIndex = product.variants.findIndex(v => v.id === variantId);
      if (variantIndex === -1) {
        throw new Error('Variant not found');
      }

      product.variants[variantIndex].stock = stock;
      product.updatedAt = new Date().toISOString();

      return product;
    } catch (error) {
      console.error('Error updating variant stock:', error);
      throw error;
    }
  }
}

export const productService = new ProductService();
export type { ProductFilters };