import { InventoryItem } from '../types';
import { mockInventory } from '../data/centralizedMockData';
import { BaseHybridService } from './baseService';

class InventoryService extends BaseHybridService {
  private inventory: InventoryItem[] = [...mockInventory];

  async getAll(): Promise<InventoryItem[]> {
    const mockFallback = async () => {
      return new Promise<InventoryItem[]>((resolve) => {
        setTimeout(() => resolve([...this.inventory]), this.getMockDelay());
      });
    };

    try {
      return await this.apiRequest<InventoryItem[]>(
        '/inventory',
        { method: 'GET' },
        mockFallback
      );
    } catch (error) {
      return await mockFallback();
    }
  }

  async getById(id: string): Promise<InventoryItem | null> {
    const mockFallback = async () => {
      return new Promise<InventoryItem | null>((resolve) => {
        setTimeout(() => {
          const item = this.inventory.find(i => i.id === id) || null;
          resolve(item);
        }, this.getMockDelay());
      });
    };

    try {
      return await this.apiRequest<InventoryItem | null>(
        `/inventory/${id}`,
        { method: 'GET' },
        mockFallback
      );
    } catch (error) {
      return await mockFallback();
    }
  }

  async getLowStockItems(): Promise<InventoryItem[]> {
    const mockFallback = async () => {
      return new Promise<InventoryItem[]>((resolve) => {
        setTimeout(() => {
          const lowStock = this.inventory.filter(item => 
            item.sellableStock <= 10 // Ngưỡng cảnh báo tồn kho thấp
          );
          resolve(lowStock);
        }, this.getMockDelay());
      });
    };

    try {
      return await this.apiRequest<InventoryItem[]>(
        '/inventory/low-stock',
        { method: 'GET' },
        mockFallback
      );
    } catch (error) {
      return await mockFallback();
    }
  }

  async updateStock(id: string, quantity: number): Promise<InventoryItem> {
    const mockFallback = async () => {
      return new Promise<InventoryItem>((resolve, reject) => {
        setTimeout(() => {
          const index = this.inventory.findIndex(item => item.id === id);
          if (index === -1) {
            reject(new Error('Inventory item not found'));
            return;
          }
          this.inventory[index] = {
            ...this.inventory[index],
            currentStock: quantity,
            availableStock: quantity - this.inventory[index].reservedStock,
            lastUpdated: new Date().toISOString(),
          };
          resolve(this.inventory[index]);
        }, this.getMockDelay());
      });
    };

    try {
      return await this.apiRequest<InventoryItem>(
        `/inventory/${id}/update-stock`,
        {
          method: 'PUT',
          body: JSON.stringify({ quantity }),
        },
        mockFallback
      );
    } catch (error) {
      return await mockFallback();
    }
  }

  async transferStock(
    id: string, 
    fromStatus: 'sellable' | 'damaged' | 'hold' | 'transit',
    toStatus: 'sellable' | 'damaged' | 'hold' | 'transit',
    quantity: number,
    reason?: string
  ): Promise<InventoryItem> {
    const mockFallback = async () => {
      return new Promise<InventoryItem>((resolve, reject) => {
        setTimeout(() => {
          const index = this.inventory.findIndex(item => item.id === id);
          if (index === -1) {
            reject(new Error('Inventory item not found'));
            return;
          }
          
          const item = this.inventory[index];
          const fromStockKey = `${fromStatus}Stock` as keyof InventoryItem;
          const toStockKey = `${toStatus}Stock` as keyof InventoryItem;
          
          // Kiểm tra đủ hàng để chuyển
          if ((item[fromStockKey] as number) < quantity) {
            reject(new Error(`Không đủ hàng ${fromStatus} để chuyển`));
            return;
          }
          
          // Thực hiện chuyển kho
          this.inventory[index] = {
            ...item,
            [fromStockKey]: (item[fromStockKey] as number) - quantity,
            [toStockKey]: (item[toStockKey] as number) + quantity,
            lastUpdated: new Date().toISOString(),
          };
          
          resolve(this.inventory[index]);
        }, this.getMockDelay());
      });
    };

    try {
      return await this.apiRequest<InventoryItem>(
        `/inventory/${id}/transfer-stock`,
        {
          method: 'POST',
          body: JSON.stringify({ fromStatus, toStatus, quantity, reason }),
        },
        mockFallback
      );
    } catch (error) {
      return await mockFallback();
    }
  }

  async addNewStock(
    id: string, 
    status: 'sellable' | 'damaged' | 'hold' | 'transit',
    quantity: number,
    reason?: string
  ): Promise<InventoryItem> {
    const mockFallback = async () => {
      return new Promise<InventoryItem>((resolve, reject) => {
        setTimeout(() => {
          const index = this.inventory.findIndex(item => item.id === id);
          if (index === -1) {
            reject(new Error('Inventory item not found'));
            return;
          }
          
          const item = this.inventory[index];
          const stockKey = `${status}Stock` as keyof InventoryItem;
          
          // Thêm hàng mới vào trạng thái cụ thể
          this.inventory[index] = {
            ...item,
            totalStock: item.totalStock + quantity,
            [stockKey]: (item[stockKey] as number) + quantity,
            lastUpdated: new Date().toISOString(),
          };
          
          resolve(this.inventory[index]);
        }, this.getMockDelay());
      });
    };

    try {
      return await this.apiRequest<InventoryItem>(
        `/inventory/${id}/add-stock`,
        {
          method: 'POST',
          body: JSON.stringify({ status, quantity, reason }),
        },
        mockFallback
      );
    } catch (error) {
      return await mockFallback();
    }
  }

  async transferBetweenVariants(
    fromVariantId: string,
    toVariantId: string,
    quantity: number,
    reason?: string
  ): Promise<{ fromVariant: InventoryItem; toVariant: InventoryItem }> {
    const mockFallback = async () => {
      return new Promise<{ fromVariant: InventoryItem; toVariant: InventoryItem }>((resolve, reject) => {
        setTimeout(() => {
          const fromIndex = this.inventory.findIndex(item => item.id === fromVariantId);
          const toIndex = this.inventory.findIndex(item => item.id === toVariantId);
          
          if (fromIndex === -1 || toIndex === -1) {
            reject(new Error('Inventory variant not found'));
            return;
          }
          
          const fromItem = this.inventory[fromIndex];
          const toItem = this.inventory[toIndex];
          
          // Kiểm tra đủ hàng để chuyển
          if (fromItem.sellableStock < quantity) {
            reject(new Error('Không đủ hàng để chuyển đổi'));
            return;
          }
          
          // Thực hiện chuyển đổi
          this.inventory[fromIndex] = {
            ...fromItem,
            sellableStock: fromItem.sellableStock - quantity,
            totalStock: fromItem.totalStock - quantity,
            lastUpdated: new Date().toISOString(),
          };
          
          this.inventory[toIndex] = {
            ...toItem,
            sellableStock: toItem.sellableStock + quantity,
            totalStock: toItem.totalStock + quantity,
            lastUpdated: new Date().toISOString(),
          };
          
          resolve({
            fromVariant: this.inventory[fromIndex],
            toVariant: this.inventory[toIndex]
          });
        }, this.getMockDelay());
      });
    };

    try {
      return await this.apiRequest<{ fromVariant: InventoryItem; toVariant: InventoryItem }>(
        `/inventory/transfer-variants`,
        {
          method: 'POST',
          body: JSON.stringify({ fromVariantId, toVariantId, quantity, reason }),
        },
        mockFallback
      );
    } catch (error) {
      return await mockFallback();
    }
  }

  async reserveStock(productId: string, variantId: string | undefined, quantity: number): Promise<boolean> {
    const mockFallback = async () => {
      return new Promise<boolean>((resolve) => {
        setTimeout(() => {
          const item = this.inventory.find(i => 
            i.productId === productId && 
            (variantId ? i.variantId === variantId : !i.variantId)
          );

          if (!item || item.availableStock < quantity) {
            resolve(false);
            return;
          }

          item.reservedStock += quantity;
          item.availableStock -= quantity;
          item.lastUpdated = new Date().toISOString();
          resolve(true);
        }, this.getMockDelay());
      });
    };

    try {
      const response = await this.apiRequest<{ success: boolean }>(
        '/inventory/reserve-stock',
        {
          method: 'POST',
          body: JSON.stringify({ productId, variantId, quantity }),
        },
        async () => ({ success: await mockFallback() })
      );
      return response.success;
    } catch (error) {
      return await mockFallback();
    }
  }

  async releaseStock(productId: string, variantId: string | undefined, quantity: number): Promise<boolean> {
    const mockFallback = async () => {
      return new Promise<boolean>((resolve) => {
        setTimeout(() => {
          const item = this.inventory.find(i => 
            i.productId === productId && 
            (variantId ? i.variantId === variantId : !i.variantId)
          );

          if (!item || item.reservedStock < quantity) {
            resolve(false);
            return;
          }

          item.reservedStock -= quantity;
          item.availableStock += quantity;
          item.lastUpdated = new Date().toISOString();
          resolve(true);
        }, this.getMockDelay());
      });
    };

    try {
      const response = await this.apiRequest<{ success: boolean }>(
        '/inventory/release-stock',
        {
          method: 'POST',
          body: JSON.stringify({ productId, variantId, quantity }),
        },
        async () => ({ success: await mockFallback() })
      );
      return response.success;
    } catch (error) {
      return await mockFallback();
    }
  }
}

export const inventoryService = new InventoryService();