import { configService } from './configService';
import { authService } from './authService';
import { enhancedOrderService } from './enhancedOrderService';
import { productService } from './productService';
import { inventoryService } from './inventoryService';
import { customerService } from './customerService';
import { supplierService } from './supplierService';
import { purchaseOrderService } from './purchaseOrderService';
import { dashboardService } from './dashboardService';
import { normalizedUserService } from './normalizedUserService';
import { orderStatusService } from './orderStatusService';
import { departmentTeamService } from './departmentTeamService';
import { inventoryReceiptService } from './inventoryReceiptService';

class ServiceFactory {
  private services: Map<string, any> = new Map();

  constructor() {
    this.initializeServices();
  }

  private initializeServices(): void {
    this.services.set('auth', authService);
    this.services.set('orders', enhancedOrderService);
    this.services.set('customers', customerService);
    this.services.set('products', productService);
    this.services.set('inventory', inventoryService);
    this.services.set('dashboard', dashboardService);
    this.services.set('suppliers', supplierService);
    this.services.set('purchaseOrders', purchaseOrderService);
    this.services.set('inventoryReceipts', inventoryReceiptService);
    this.services.set('users', normalizedUserService);
    this.services.set('orderStatus', orderStatusService);
    this.services.set('departmentTeam', departmentTeamService);
  }

  getService<T>(serviceName: string): T {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }
    return service as T;
  }

  getAllServices(): Map<string, any> {
    return new Map(this.services);
  }

  switchToMockMode(): void {
    configService.updateConfig({ forceMode: 'mock' });
    this.services.forEach((service) => {
      if (service.forceMockMode) {
        service.forceMockMode();
      }
    });
  }

  switchToBackendMode(): void {
    configService.updateConfig({ forceMode: 'backend' });
    this.services.forEach((service) => {
      if (service.forceBackendMode) {
        service.forceBackendMode();
      }
    });
  }

  getServiceStatus(): Record<string, string> {
    const status: Record<string, string> = {};
    this.services.forEach((service, name) => {
      if (service.isUsingBackend) {
        status[name] = service.isUsingBackend() ? 'backend' : 'mock';
      } else {
        status[name] = 'mock-only';
      }
    });
    return status;
  }

  async checkBackendHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${configService.getConfig().apiBaseUrl}/actuator/health`, {
        method: 'GET',
        timeout: 3000,
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async refreshServices(): Promise<void> {
    const isHealthy = await this.checkBackendHealth();
    this.services.forEach((service) => {
      if (service.forceBackendMode && isHealthy) {
        service.forceBackendMode();
      } else if (service.forceMockMode) {
        service.forceMockMode();
      }
    });
  }
}

export const serviceFactory = new ServiceFactory();