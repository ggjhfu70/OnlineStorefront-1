
import { BaseHybridService } from './baseService';
import { PurchaseOrder } from '../types';
import { mockPurchaseOrders } from '../data/centralizedMockData';

class PurchaseOrderService extends BaseHybridService {
  private purchaseOrders: PurchaseOrder[] = [...mockPurchaseOrders];

  async getAll(): Promise<PurchaseOrder[]> {
    const mockFallback = async () => {
      return new Promise<PurchaseOrder[]>((resolve) => {
        setTimeout(() => resolve([...this.purchaseOrders]), this.getMockDelay());
      });
    };

    try {
      return await this.apiRequest<PurchaseOrder[]>(
        '/purchase-orders',
        { method: 'GET' },
        mockFallback
      );
    } catch (error) {
      return await mockFallback();
    }
  }

  async getById(id: string): Promise<PurchaseOrder | null> {
    const mockFallback = async () => {
      return new Promise<PurchaseOrder | null>((resolve) => {
        setTimeout(() => {
          const po = this.purchaseOrders.find(p => p.id === id) || null;
          resolve(po);
        }, this.getMockDelay());
      });
    };

    try {
      return await this.apiRequest<PurchaseOrder | null>(
        `/purchase-orders/${id}`,
        { method: 'GET' },
        mockFallback
      );
    } catch (error) {
      return await mockFallback();
    }
  }

  async create(poData: Omit<PurchaseOrder, 'id' | 'poNumber' | 'createdAt' | 'updatedAt'>): Promise<PurchaseOrder> {
    const mockFallback = async () => {
      return new Promise<PurchaseOrder>((resolve) => {
        setTimeout(() => {
          const newPO: PurchaseOrder = {
            ...poData,
            id: `PO-${Date.now().toString().slice(-6)}`,
            poNumber: `PO-${Date.now().toString().slice(-6)}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          this.purchaseOrders.push(newPO);
          resolve(newPO);
        }, this.getMockDelay());
      });
    };

    try {
      return await this.apiRequest<PurchaseOrder>(
        '/purchase-orders',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(poData)
        },
        mockFallback
      );
    } catch (error) {
      return await mockFallback();
    }
  }

  async update(id: string, updates: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
    const mockFallback = async () => {
      return new Promise<PurchaseOrder>((resolve, reject) => {
        setTimeout(() => {
          const index = this.purchaseOrders.findIndex(p => p.id === id);
          if (index === -1) {
            reject(new Error('Purchase Order not found'));
            return;
          }

          const updatedPO = {
            ...this.purchaseOrders[index],
            ...updates,
            updatedAt: new Date().toISOString()
          };

          this.purchaseOrders[index] = updatedPO;
          resolve(updatedPO);
        }, this.getMockDelay());
      });
    };

    try {
      return await this.apiRequest<PurchaseOrder>(
        `/purchase-orders/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        },
        mockFallback
      );
    } catch (error) {
      return await mockFallback();
    }
  }

  async updateStatus(id: string, status: PurchaseOrder['status']): Promise<PurchaseOrder> {
    return this.update(id, { status });
  }

  async delete(id: string): Promise<void> {
    const mockFallback = async () => {
      return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          const index = this.purchaseOrders.findIndex(p => p.id === id);
          if (index === -1) {
            reject(new Error('Purchase Order not found'));
            return;
          }
          this.purchaseOrders.splice(index, 1);
          resolve();
        }, this.getMockDelay());
      });
    };

    try {
      await this.apiRequest(
        `/purchase-orders/${id}`,
        { method: 'DELETE' },
        mockFallback
      );
    } catch (error) {
      return await mockFallback();
    }
  }

  async getByStatus(status: PurchaseOrder['status']): Promise<PurchaseOrder[]> {
    const all = await this.getAll();
    return all.filter(po => po.status === status);
  }

  async getBySupplier(supplierId: string): Promise<PurchaseOrder[]> {
    const all = await this.getAll();
    return all.filter(po => po.supplierId === supplierId);
  }
}

export const purchaseOrderService = new PurchaseOrderService();
