import { BaseHybridService } from './baseService';

export interface OrderStatus {
  key: string;
  label: string;
  color: string;
  badgeStyle: string;
  allowedNextStatuses: string[];
  requiredRoles: string[];
}

export interface OrderStatusStats {
  total: number;
  draft: number;
  confirmed: number;
  preparing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

export interface OrderStatusConfig {
  label: string;
  color: string;
  badgeStyle: string;
}

export interface OrderFilters {
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  departmentIds?: string[];
  teamIds?: string[];
  salesPersonIds?: string[];
  minAmount?: number;
  maxAmount?: number;
}

export interface OrderStatusService {
  getStatuses(): Record<string, OrderStatusConfig>;
  calculateStats(orders: EnhancedOrder[]): OrderStats;
  getStatusLabel(status: string): string;
  getStatusColor(status: string): string;
  getStatusBadgeStyle(status: string): string;
  filterOrders(orders: EnhancedOrder[], filters: OrderFilters): EnhancedOrder[];
}

class OrderStatusService extends BaseHybridService {
  private statusConfig: Record<string, OrderStatus> = {
    all: {
      key: 'all',
      label: 'Tất cả',
      color: 'text-gray-600',
      badgeStyle: 'bg-gray-100 text-gray-800 border border-gray-200',
      allowedNextStatuses: [],
      requiredRoles: []
    },
    draft: {
      key: 'draft',
      label: 'Nháp',
      color: 'text-gray-600',
      badgeStyle: 'bg-gray-100 text-gray-800 border border-gray-200',
      allowedNextStatuses: ['confirmed', 'cancelled'],
      requiredRoles: ['admin', 'manager', 'employee']
    },
    confirmed: {
      key: 'confirmed',
      label: 'Đã xác nhận',
      color: 'text-blue-600',
      badgeStyle: 'bg-blue-100 text-blue-800 border border-blue-200',
      allowedNextStatuses: ['preparing', 'cancelled'],
      requiredRoles: ['admin', 'manager']
    },
    preparing: {
      key: 'preparing',
      label: 'Đang chuẩn bị',
      color: 'text-indigo-600',
      badgeStyle: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
      allowedNextStatuses: ['shipped', 'cancelled'],
      requiredRoles: ['admin', 'manager', 'employee']
    },
    shipped: {
      key: 'shipped',
      label: 'Đã giao vận',
      color: 'text-green-600',
      badgeStyle: 'bg-green-100 text-green-800 border border-green-200',
      allowedNextStatuses: ['delivered'],
      requiredRoles: ['admin', 'manager', 'employee']
    },
    delivered: {
      key: 'delivered',
      label: 'Đã giao hàng',
      color: 'text-emerald-600',
      badgeStyle: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
      allowedNextStatuses: [],
      requiredRoles: ['admin', 'manager', 'department_head', 'team_leader', 'employee']
    },
    cancelled: {
      key: 'cancelled',
      label: 'Đã hủy',
      color: 'text-red-600',
      badgeStyle: 'bg-red-100 text-red-800 border border-red-200',
      allowedNextStatuses: [],
      requiredRoles: ['admin', 'manager', 'department_head']
    }
  };

  async getAllStatuses(): Promise<Record<string, OrderStatus>> {
    const mockFallback = async () => {
      return new Promise<Record<string, OrderStatus>>((resolve) => {
        setTimeout(() => resolve({ ...this.statusConfig }), this.getMockDelay());
      });
    };

    try {
      return await this.apiRequest<Record<string, OrderStatus>>(
        '/order-statuses',
        { method: 'GET' },
        mockFallback
      );
    } catch (error) {
      return await mockFallback();
    }
  }

  async getStatus(statusKey: string): Promise<OrderStatus | null> {
    const mockFallback = async () => {
      return new Promise<OrderStatus | null>((resolve) => {
        setTimeout(() => {
          const status = this.statusConfig[statusKey] || null;
          resolve(status);
        }, this.getMockDelay());
      });
    };

    try {
      return await this.apiRequest<OrderStatus | null>(
        `/order-statuses/${statusKey}`,
        { method: 'GET' },
        mockFallback
      );
    } catch (error) {
      return await mockFallback();
    }
  }

  async getStatusesForFilter(): Promise<OrderStatus[]> {
    const statuses = await this.getAllStatuses();
    return Object.values(statuses);
  }

  async getStatusesExcludingAll(): Promise<OrderStatus[]> {
    const statuses = await this.getAllStatuses();
    const { all, ...otherStatuses } = statuses;
    return Object.values(otherStatuses);
  }

  async canTransitionTo(fromStatus: string, toStatus: string, userRole: string): Promise<boolean> {
    const mockFallback = async () => {
      return new Promise<boolean>((resolve) => {
        setTimeout(() => {
          const statusConfig = this.statusConfig[fromStatus];
          if (!statusConfig) {
            resolve(false);
            return;
          }

          const targetConfig = this.statusConfig[toStatus];
          if (!targetConfig) {
            resolve(false);
            return;
          }

          // Check if transition is allowed
          const isTransitionAllowed = statusConfig.allowedNextStatuses.includes(toStatus);

          // Check if user role has permission for target status
          const hasRolePermission = targetConfig.requiredRoles.length === 0 || 
                                   targetConfig.requiredRoles.includes(userRole);

          resolve(isTransitionAllowed && hasRolePermission);
        }, this.getMockDelay());
      });
    };

    try {
      return await this.apiRequest<boolean>(
        `/order-statuses/can-transition?from=${fromStatus}&to=${toStatus}&role=${userRole}`,
        { method: 'GET' },
        mockFallback
      );
    } catch (error) {
      return await mockFallback();
    }
  }

  async getAvailableTransitions(currentStatus: string, userRole: string): Promise<OrderStatus[]> {
    const mockFallback = async () => {
      return new Promise<OrderStatus[]>((resolve) => {
        setTimeout(async () => {
          const statusConfig = this.statusConfig[currentStatus];
          if (!statusConfig) {
            resolve([]);
            return;
          }

          const availableStatuses: OrderStatus[] = [];

          for (const nextStatusKey of statusConfig.allowedNextStatuses) {
            const canTransition = await this.canTransitionTo(currentStatus, nextStatusKey, userRole);
            if (canTransition) {
              const nextStatus = this.statusConfig[nextStatusKey];
              if (nextStatus) {
                availableStatuses.push(nextStatus);
              }
            }
          }

          resolve(availableStatuses);
        }, this.getMockDelay());
      });
    };

    try {
      return await this.apiRequest<OrderStatus[]>(
        `/order-statuses/transitions?current=${currentStatus}&role=${userRole}`,
        { method: 'GET' },
        mockFallback
      );
    } catch (error) {
      return await mockFallback();
    }
  }

  // Utility methods for easy access
  getStatusLabel(statusKey: string): string {
    return this.statusConfig[statusKey]?.label || statusKey;
  }

  getStatusColor(statusKey: string): string {
    return this.statusConfig[statusKey]?.color || 'text-gray-600';
  }

  getStatusBadgeStyle(statusKey: string): string {
    return this.statusConfig[statusKey]?.badgeStyle || 'bg-gray-100 text-gray-800 border border-gray-200';
  }

  // Calculate stats from orders data
  calculateStats(orders: any[]): OrderStatusStats {
    return {
      total: orders.length,
      draft: orders.filter(o => o.status === 'draft').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      preparing: orders.filter(o => o.status === 'preparing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    };
  }

  filterOrders(orders: EnhancedOrder[], filters: OrderFilters): EnhancedOrder[] {
    let filteredOrders = [...orders];

    // Text search
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredOrders = filteredOrders.filter(order =>
        order.id.toLowerCase().includes(searchTerm) ||
        (order.customer?.name || "").toLowerCase().includes(searchTerm) ||
        (order.customer?.phone || "").includes(searchTerm) ||
        (order.salesPerson?.fullName || "").toLowerCase().includes(searchTerm)
      );
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.status === filters.status);
    }

    // Date range filter
    if (filters.startDate || filters.endDate) {
      filteredOrders = filteredOrders.filter(order => {
        const orderDate = new Date(order.createdAt);

        if (filters.startDate && new Date(filters.startDate) > orderDate) {
          return false;
        }

        if (filters.endDate) {
          const endDate = new Date(filters.endDate);
          endDate.setHours(23, 59, 59, 999); // End of day
          if (endDate < orderDate) {
            return false;
          }
        }

        return true;
      });
    }

    // Department filter
    if (filters.departmentIds && filters.departmentIds.length > 0) {
      filteredOrders = filteredOrders.filter(order => {
        // Assuming salesPerson has department info
        const salesPersonDept = order.salesPerson?.department || order.salesPerson?.departmentId;
        return salesPersonDept && filters.departmentIds!.includes(salesPersonDept.toString());
      });
    }

    // Team filter
    if (filters.teamIds && filters.teamIds.length > 0) {
      filteredOrders = filteredOrders.filter(order => {
        // Assuming salesPerson has team info
        const salesPersonTeam = order.salesPerson?.team || order.salesPerson?.teamId;
        return salesPersonTeam && filters.teamIds!.includes(salesPersonTeam.toString());
      });
    }

    // Sales person filter
    if (filters.salesPersonIds && filters.salesPersonIds.length > 0) {
      filteredOrders = filteredOrders.filter(order => 
        filters.salesPersonIds!.includes(order.salesPerson?.id || '')
      );
    }

    // Amount range filter
    if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
      filteredOrders = filteredOrders.filter(order => {
        const total = order.total;

        if (filters.minAmount !== undefined && total < filters.minAmount) {
          return false;
        }

        if (filters.maxAmount !== undefined && total > filters.maxAmount) {
          return false;
        }

        return true;
      });
    }

    return filteredOrders;
  }
}

export const orderStatusService = new OrderStatusService();