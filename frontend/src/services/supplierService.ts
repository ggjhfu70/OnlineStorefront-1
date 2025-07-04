
import { BaseHybridService } from './baseService';
import { Supplier } from '../types';
import { mockSuppliers } from '../data/centralizedMockData';

class SupplierService extends BaseHybridService {
  private suppliers: Supplier[] = [...mockSuppliers];

  async getAll(): Promise<Supplier[]> {
    const mockFallback = async () => {
      return new Promise<Supplier[]>((resolve) => {
        setTimeout(() => resolve([...this.suppliers]), this.getMockDelay());
      });
    };

    try {
      return await this.apiRequest<Supplier[]>(
        '/suppliers',
        { method: 'GET' },
        mockFallback
      );
    } catch (error) {
      return await mockFallback();
    }
  }

  async getById(id: string): Promise<Supplier | null> {
    const mockFallback = async () => {
      return new Promise<Supplier | null>((resolve) => {
        setTimeout(() => {
          const supplier = this.suppliers.find(s => s.id === id) || null;
          resolve(supplier);
        }, this.getMockDelay());
      });
    };

    try {
      return await this.apiRequest<Supplier | null>(
        `/suppliers/${id}`,
        { method: 'GET' },
        mockFallback
      );
    } catch (error) {
      return await mockFallback();
    }
  }

  async create(supplierData: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>): Promise<Supplier> {
    const mockFallback = async () => {
      return new Promise<Supplier>((resolve) => {
        setTimeout(() => {
          const newSupplier: Supplier = {
            ...supplierData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          this.suppliers.push(newSupplier);
          resolve(newSupplier);
        }, this.getMockDelay());
      });
    };

    try {
      return await this.apiRequest<Supplier>(
        '/suppliers',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(supplierData)
        },
        mockFallback
      );
    } catch (error) {
      return await mockFallback();
    }
  }

  async update(id: string, updates: Partial<Supplier>): Promise<Supplier> {
    const mockFallback = async () => {
      return new Promise<Supplier>((resolve, reject) => {
        setTimeout(() => {
          const index = this.suppliers.findIndex(s => s.id === id);
          if (index === -1) {
            reject(new Error('Supplier not found'));
            return;
          }

          const updatedSupplier = {
            ...this.suppliers[index],
            ...updates,
            updatedAt: new Date().toISOString()
          };

          this.suppliers[index] = updatedSupplier;
          resolve(updatedSupplier);
        }, this.getMockDelay());
      });
    };

    try {
      return await this.apiRequest<Supplier>(
        `/suppliers/${id}`,
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

  async delete(id: string): Promise<void> {
    const mockFallback = async () => {
      return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          const index = this.suppliers.findIndex(s => s.id === id);
          if (index === -1) {
            reject(new Error('Supplier not found'));
            return;
          }
          this.suppliers.splice(index, 1);
          resolve();
        }, this.getMockDelay());
      });
    };

    try {
      await this.apiRequest(
        `/suppliers/${id}`,
        { method: 'DELETE' },
        mockFallback
      );
    } catch (error) {
      return await mockFallback();
    }
  }

  async search(query: string): Promise<Supplier[]> {
    const all = await this.getAll();
    const queryLower = query.toLowerCase();
    return all.filter(supplier =>
      supplier.name.toLowerCase().includes(queryLower) ||
      supplier.contactPerson.toLowerCase().includes(queryLower) ||
      supplier.email.toLowerCase().includes(queryLower)
    );
  }
}

export const supplierService = new SupplierService();
