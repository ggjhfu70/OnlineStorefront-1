
import { BaseHybridService } from './baseService';
import { Customer } from '../types';
import { mockCustomers } from '../data/centralizedMockData';

class CustomerService extends BaseHybridService {
  private customers: Customer[] = [...mockCustomers];

  async getAll(): Promise<Customer[]> {
    const mockFallback = async () => {
      return new Promise<Customer[]>((resolve) => {
        setTimeout(() => resolve([...this.customers]), this.getMockDelay());
      });
    };

    try {
      return await this.apiRequest<Customer[]>(
        '/customers',
        { method: 'GET' },
        mockFallback
      );
    } catch (error) {
      return await mockFallback();
    }
  }

  async getById(id: string): Promise<Customer | null> {
    const mockFallback = async () => {
      return new Promise<Customer | null>((resolve) => {
        setTimeout(() => {
          const customer = this.customers.find(c => c.id === id) || null;
          resolve(customer);
        }, this.getMockDelay());
      });
    };

    try {
      return await this.apiRequest<Customer | null>(
        `/customers/${id}`,
        { method: 'GET' },
        mockFallback
      );
    } catch (error) {
      return await mockFallback();
    }
  }

  async create(customerData: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> {
    const mockFallback = async () => {
      return new Promise<Customer>((resolve) => {
        setTimeout(() => {
          const newCustomer: Customer = {
            ...customerData,
            id: Date.now().toString(),
            totalOrders: 0,
            totalSpent: 0,
            createdAt: new Date().toISOString()
          };
          this.customers.push(newCustomer);
          resolve(newCustomer);
        }, this.getMockDelay());
      });
    };

    try {
      return await this.apiRequest<Customer>(
        '/customers',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(customerData)
        },
        mockFallback
      );
    } catch (error) {
      return await mockFallback();
    }
  }

  async update(id: string, updates: Partial<Customer>): Promise<Customer> {
    const mockFallback = async () => {
      return new Promise<Customer>((resolve, reject) => {
        setTimeout(() => {
          const index = this.customers.findIndex(c => c.id === id);
          if (index === -1) {
            reject(new Error('Customer not found'));
            return;
          }

          const updatedCustomer = {
            ...this.customers[index],
            ...updates
          };

          this.customers[index] = updatedCustomer;
          resolve(updatedCustomer);
        }, this.getMockDelay());
      });
    };

    try {
      return await this.apiRequest<Customer>(
        `/customers/${id}`,
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
          const index = this.customers.findIndex(c => c.id === id);
          if (index === -1) {
            reject(new Error('Customer not found'));
            return;
          }
          this.customers.splice(index, 1);
          resolve();
        }, this.getMockDelay());
      });
    };

    try {
      await this.apiRequest(
        `/customers/${id}`,
        { method: 'DELETE' },
        mockFallback
      );
    } catch (error) {
      return await mockFallback();
    }
  }

  async search(query: string): Promise<Customer[]> {
    const all = await this.getAll();
    const queryLower = query.toLowerCase();
    return all.filter(customer =>
      customer.name.toLowerCase().includes(queryLower) ||
      customer.email.toLowerCase().includes(queryLower) ||
      customer.phone.includes(query)
    );
  }

  async getByType(type: Customer['customerType']): Promise<Customer[]> {
    const all = await this.getAll();
    return all.filter(customer => customer.customerType === type);
  }
}

export const customerService = new CustomerService();
