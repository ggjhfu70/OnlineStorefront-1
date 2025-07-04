
import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useOrders } from "../../hooks/useOrders";
import { useAuth } from "../../hooks/useAuth";
import { useOrderStatus } from "../../hooks/useOrderStatus";
import { useOrderFilters } from "../../hooks/useOrderFilters";
import { Search, Plus, Eye, Filter, Download, Calendar, Users, Building, X, ChevronLeft, ChevronRight, Trash2, RotateCcw, CheckSquare, Square } from "lucide-react";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import EnhancedCreateOrderForm from "./components/EnhancedCreateOrderForm";
import OrderWorkflowActions from "./components/OrderWorkflowActions";
import { EnhancedOrder } from "../../types";
import { format } from "date-fns";

const Orders: React.FC = () => {
  const { t } = useTranslation();
  const {
    orders,
    loading,
    createOrder,
    confirmOrder,
    cancelOrder,
    updateOrderWorkflow,
  } = useOrders();
  const { user, canPerformAction } = useAuth();
  const {
    statuses,
    calculateStats,
    getStatusLabel,
    getStatusColor,
    getStatusBadgeStyle,
    filterOrders
  } = useOrderStatus();
  const {
    departments,
    teams,
    filters,
    updateFilter,
    updateFilters,
    clearFilters,
    getActiveFiltersCount,
    getFilteredTeams
  } = useOrderFilters();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<EnhancedOrder | null>(null);
  const [isOrderDetailModalOpen, setIsOrderDetailModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<EnhancedOrder | null>(null);
  const [orderFormMode, setOrderFormMode] = useState<'create' | 'view' | 'edit'>('create');
  
  // Bulk selection and pagination state
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkActionType, setBulkActionType] = useState<'delete' | 'changeStatus' | null>(null);
  const [bulkTargetStatus, setBulkTargetStatus] = useState<string>('');
  const [isBulkActionModalOpen, setIsBulkActionModalOpen] = useState(false);

  

  const filteredOrders = filterOrders(orders, filters);

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  // Bulk selection logic
  const isAllSelected = paginatedOrders.length > 0 && paginatedOrders.every(order => selectedOrderIds.has(order.id));
  const isPartiallySelected = paginatedOrders.some(order => selectedOrderIds.has(order.id)) && !isAllSelected;

  // Check if all selected orders have the same status for bulk status change
  const selectedOrders = orders.filter(order => selectedOrderIds.has(order.id));
  const canBulkChangeStatus = useMemo(() => {
    if (selectedOrders.length === 0) return false;
    const firstStatus = selectedOrders[0].status;
    return selectedOrders.every(order => order.status === firstStatus);
  }, [selectedOrders]);

  const selectedOrdersStatus = selectedOrders.length > 0 ? selectedOrders[0].status : '';

  // Bulk selection handlers
  const handleSelectAll = () => {
    if (isAllSelected) {
      // Deselect all current page orders
      setSelectedOrderIds(prev => {
        const newSet = new Set(prev);
        paginatedOrders.forEach(order => newSet.delete(order.id));
        return newSet;
      });
    } else {
      // Select all current page orders
      setSelectedOrderIds(prev => {
        const newSet = new Set(prev);
        paginatedOrders.forEach(order => newSet.add(order.id));
        return newSet;
      });
    }
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrderIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const clearSelection = () => {
    setSelectedOrderIds(new Set());
    setShowBulkActions(false);
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    clearSelection(); // Clear selection when changing pages
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
    clearSelection();
  };

  const handleCreateOrder = async (orderData: any) => {
    try {
      await createOrder(orderData);
      setIsCreateModalOpen(false);
      setEditingOrder(null);
      setOrderFormMode('create');
    } catch (error) {
      console.error("Failed to create order:", error);
    }
  };

  const handleCloseOrderForm = () => {
    setIsCreateModalOpen(false);
    setEditingOrder(null);
    setOrderFormMode('create');
  };

  const handleConfirmOrder = async (orderId: string) => {
    try {
      await confirmOrder(orderId);
    } catch (error) {
      console.error("Failed to confirm order:", error);
    }
  };

  const handleCancelOrder = async (orderId: string, reason: string) => {
    try {
      await cancelOrder(orderId, reason);
    } catch (error) {
      console.error("Failed to cancel order:", error);
    }
  };

  const handleWorkflowUpdate = async (
    orderId: string,
    status: EnhancedOrder["status"],
    data?: any,
  ) => {
    try {
      await updateOrderWorkflow(orderId, status, data);
    } catch (error) {
      console.error("Failed to update workflow:", error);
    }
  };

  const handleViewOrderDetails = (order: EnhancedOrder) => {
    setEditingOrder(order);
    setOrderFormMode('view');
    setIsCreateModalOpen(true);
  };

  const handleEditOrder = (order: EnhancedOrder) => {
    console.log("Edit order:", order.id);
    setEditingOrder(order);
    setOrderFormMode('edit');
    setIsCreateModalOpen(true);
  };

  // Bulk action handlers
  const handleBulkDelete = () => {
    setBulkActionType('delete');
    setIsBulkActionModalOpen(true);
  };

  const handleBulkStatusChange = (targetStatus: string) => {
    setBulkActionType('changeStatus');
    setBulkTargetStatus(targetStatus);
    setIsBulkActionModalOpen(true);
  };

  const confirmBulkAction = async () => {
    try {
      if (bulkActionType === 'delete') {
        // Bulk delete logic - in real app, call API
        console.log('Bulk deleting orders:', Array.from(selectedOrderIds));
        // For demo, just remove from local state
        setOrders(prev => prev.filter(order => !selectedOrderIds.has(order.id)));
      } else if (bulkActionType === 'changeStatus') {
        // Bulk status change logic
        console.log('Bulk changing status to:', bulkTargetStatus, 'for orders:', Array.from(selectedOrderIds));
        for (const orderId of selectedOrderIds) {
          await updateOrderStatus(orderId, bulkTargetStatus as EnhancedOrder['status']);
        }
      }
      
      clearSelection();
      setIsBulkActionModalOpen(false);
      setBulkActionType(null);
      setBulkTargetStatus('');
    } catch (error) {
      console.error('Bulk action failed:', error);
    }
  };

  

  const columns = [
    {
      key: "select",
      title: (
        <div className="flex items-center">
          <button
            onClick={handleSelectAll}
            className="p-1 rounded hover:bg-gray-100"
          >
            {isAllSelected ? (
              <CheckSquare className="h-4 w-4 text-blue-600" />
            ) : isPartiallySelected ? (
              <div className="h-4 w-4 border-2 border-blue-600 rounded bg-blue-100 flex items-center justify-center">
                <div className="h-2 w-2 bg-blue-600 rounded-sm" />
              </div>
            ) : (
              <Square className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>
      ),
      render: (value: any, record: EnhancedOrder) => (
        <button
          onClick={() => handleSelectOrder(record.id)}
          className="p-1 rounded hover:bg-gray-100"
        >
          {selectedOrderIds.has(record.id) ? (
            <CheckSquare className="h-4 w-4 text-blue-600" />
          ) : (
            <Square className="h-4 w-4 text-gray-400" />
          )}
        </button>
      ),
    },
    {
      key: "id",
      title: "Đơn hàng",
      render: (value: string, record: EnhancedOrder) => (
        <div className="space-y-1">
          <p className="font-semibold text-gray-900">#{value}</p>
          <p className="text-xs text-gray-500">
            {format(new Date(record.createdAt), "dd/MM/yyyy HH:mm")}
          </p>
        </div>
      ),
    },
    {
      key: "customer",
      title: "Khách hàng",
      render: (value: any, record: EnhancedOrder) => (
        <div className="space-y-1">
          <p className="font-medium text-gray-900">
            {record.customer?.name || "N/A"}
          </p>
          <p className="text-sm text-gray-500">{record.customer?.phone || "N/A"}</p>
        </div>
      ),
    },
    {
      key: "salesPerson",
      title: "Nhân viên bán hàng",
      render: (value: any, record: EnhancedOrder) => (
        <div className="text-sm">
          <p className="font-medium text-gray-700">
            {record.salesPerson?.fullName || "N/A"}
          </p>
          <p className="text-gray-500 capitalize">{record.salesPerson?.role || "N/A"}</p>
        </div>
      ),
    },
    {
      key: "items",
      title: "Sản phẩm",
      render: (value: any[], record: EnhancedOrder) => (
        <div className="text-sm">
          <p className="font-medium text-gray-700">
            {record.items?.length || 0} sản phẩm
          </p>
          <p className="text-gray-500">
            {record.items?.slice(0, 2).map(item => item.productName || item.product?.name || "N/A").join(", ") || "Không có sản phẩm"}
            {record.items && record.items.length > 2 && "..."}
          </p>
        </div>
      ),
    },
    {
      key: "total",
      title: "Tổng tiền",
      render: (value: number, record: EnhancedOrder) => (
        <div className="text-right">
          <p className="font-bold text-gray-900 text-lg">
            {record.total.toLocaleString("vi-VN")} ₫
          </p>
          {record.shippingFee && record.shippingFee > 0 && (
            <p className="text-xs text-gray-500">
              + {record.shippingFee.toLocaleString("vi-VN")} ₫ ship
            </p>
          )}
        </div>
      ),
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (value: string) => (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(value)}`}
        >
          {getStatusLabel(value)}
        </span>
      ),
    },
    {
      key: "actions",
      title: "Thao tác",
      render: (value: any, record: EnhancedOrder) => (
        <OrderWorkflowActions
          order={record}
          onConfirm={handleConfirmOrder}
          onCancel={handleCancelOrder}
          onWorkflowUpdate={handleWorkflowUpdate}
          onViewDetails={handleViewOrderDetails}
          onEdit={handleEditOrder}
        />
      ),
    },
  ];

  const statusStats = calculateStats(filteredOrders);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý đơn hàng
          </h1>
          <p className="text-gray-600 mt-2">
            Theo dõi và quản lý toàn bộ đơn hàng của hệ thống
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary">
            <Download className="h-5 w-5 mr-2" />
            Xuất báo cáo
          </Button>
          <Button onClick={() => {
            setOrderFormMode('create');
            setEditingOrder(null);
            setIsCreateModalOpen(true);
          }}>
            <Plus className="h-5 w-5 mr-2" />
            Tạo đơn hàng
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
        <Card className="col-span-1">
          <div className="text-center p-4">
            <div className="text-2xl font-bold text-gray-900">
              {statusStats.total}
            </div>
            <div className="text-sm text-gray-600 mt-1">Tổng cộng</div>
          </div>
        </Card>

        {Object.entries(statuses)
          .filter(([key]) => key !== "all")
          .map(([status, config]) => (
            <Card 
              key={status} 
              className={`col-span-1 cursor-pointer transition-all hover:shadow-md ${
                filters.status === status ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => updateFilter('status', filters.status === status ? 'all' : status)}
            >
              <div className="text-center p-4">
                <div className={`text-2xl font-bold ${config.color}`}>
                  {statusStats[status as keyof typeof statusStats]}
                </div>
                <div className="text-sm text-gray-600 mt-1">{config.label}</div>
              </div>
            </Card>
          ))}
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col gap-4">
            {/* Primary Filters Row */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng, số điện thoại..."
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={filters.status}
                  onChange={(e) => updateFilter('status', e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-w-[180px]"
                >
                  {Object.entries(statuses).map(([status, config]) => (
                    <option key={status} value={status}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Advanced Filters Toggle */}
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`flex items-center space-x-2 px-4 py-3 border rounded-lg text-sm transition-colors ${
                  showAdvancedFilters || getActiveFiltersCount() > 0
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="h-4 w-4" />
                <span>Lọc nâng cao</span>
                {getActiveFiltersCount() > 0 && (
                  <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </button>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                {/* Date Range */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Từ ngày
                  </label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => updateFilter('startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Đến ngày
                  </label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => updateFilter('endDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                {/* Department Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <Building className="inline h-4 w-4 mr-1" />
                    Bộ phận
                  </label>
                  <select
                    multiple
                    value={filters.departmentIds || []}
                    onChange={(e) => {
                      const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
                      updateFilter('departmentIds', selectedIds);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    size={Math.min(departments.length, 4)}
                  >
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>
                        {dept.displayName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Team Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <Users className="inline h-4 w-4 mr-1" />
                    Nhóm
                  </label>
                  <select
                    multiple
                    value={filters.teamIds || []}
                    onChange={(e) => {
                      const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
                      updateFilter('teamIds', selectedIds);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    size={Math.min(getFilteredTeams(filters.departmentIds || []).length, 4)}
                  >
                    {getFilteredTeams(filters.departmentIds || []).map(team => (
                      <option key={team.id} value={team.id}>
                        {team.displayName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount Range */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Từ số tiền (VND)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.minAmount || ''}
                    onChange={(e) => updateFilter('minAmount', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Đến số tiền (VND)
                  </label>
                  <input
                    type="number"
                    placeholder="999999999"
                    value={filters.maxAmount || ''}
                    onChange={(e) => updateFilter('maxAmount', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                {/* Clear Filters Button */}
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    Xóa tất cả bộ lọc
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Active Filters */}
          {getActiveFiltersCount() > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">Bộ lọc hiện tại:</span>
              
              {filters.status && filters.status !== "all" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Trạng thái: {statuses[filters.status as keyof typeof statuses]?.label || filters.status}
                  <button
                    onClick={() => updateFilter('status', 'all')}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {filters.search && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Tìm kiếm: "{filters.search}"
                  <button
                    onClick={() => updateFilter('search', '')}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {(filters.startDate || filters.endDate) && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Thời gian: {filters.startDate || '...'} - {filters.endDate || '...'}
                  <button
                    onClick={() => updateFilters({ startDate: '', endDate: '' })}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {filters.departmentIds && filters.departmentIds.length > 0 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Bộ phận: {filters.departmentIds.map(id => 
                    departments.find(d => d.id === id)?.displayName || id
                  ).join(', ')}
                  <button
                    onClick={() => updateFilter('departmentIds', [])}
                    className="ml-2 text-orange-600 hover:text-orange-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {filters.teamIds && filters.teamIds.length > 0 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                  Nhóm: {filters.teamIds.map(id => 
                    teams.find(t => t.id === id)?.displayName || id
                  ).join(', ')}
                  <button
                    onClick={() => updateFilter('teamIds', [])}
                    className="ml-2 text-teal-600 hover:text-teal-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {(filters.minAmount !== undefined || filters.maxAmount !== undefined) && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Số tiền: {filters.minAmount?.toLocaleString() || '0'} - {filters.maxAmount?.toLocaleString() || '∞'} VND
                  <button
                    onClick={() => updateFilters({ minAmount: undefined, maxAmount: undefined })}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Bulk Actions Bar */}
        {selectedOrderIds.size > 0 && (
          <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-blue-900">
                  Đã chọn {selectedOrderIds.size} đơn hàng
                </span>
                <button
                  onClick={clearSelection}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Bỏ chọn tất cả
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                {canPerformAction('cancel_order') && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleBulkDelete}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa hàng loạt
                  </Button>
                )}
                
                {canBulkChangeStatus && canPerformAction('update_order_status') && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Đổi trạng thái:</span>
                    <select
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          handleBulkStatusChange(e.target.value);
                        }
                      }}
                      className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Chọn trạng thái</option>
                      {Object.entries(statuses)
                        .filter(([key]) => key !== 'all' && key !== selectedOrdersStatus)
                        .map(([status, config]) => (
                          <option key={status} value={status}>
                            {config.label}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Hiển thị <span className="font-medium">{startIndex + 1}</span> - <span className="font-medium">{Math.min(endIndex, filteredOrders.length)}</span> trên tổng số{" "}
              <span className="font-medium">{filteredOrders.length}</span> đơn hàng
              {getActiveFiltersCount() > 0 && (
                <span> với {getActiveFiltersCount()} bộ lọc được áp dụng</span>
              )}
            </p>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Hiển thị:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-600">mục/trang</span>
            </div>
          </div>
        </div>

        <Table columns={columns} data={paginatedOrders} loading={loading} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Trang {currentPage} / {totalPages}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Trước
                </Button>
                
                {/* Page numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 text-sm rounded ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Sau
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Create/Edit/View Order Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCloseOrderForm}
        title={
          orderFormMode === 'create' ? "Tạo đơn hàng mới" :
          orderFormMode === 'edit' ? "Sửa đơn hàng" :
          "Xem chi tiết đơn hàng"
        }
        size="xl"
      >
        <EnhancedCreateOrderForm
          onSubmit={handleCreateOrder}
          onCancel={handleCloseOrderForm}
          initialOrder={editingOrder}
          mode={orderFormMode}
        />
      </Modal>

      {/* Bulk Action Confirmation Modal */}
      <Modal
        isOpen={isBulkActionModalOpen}
        onClose={() => setIsBulkActionModalOpen(false)}
        title={bulkActionType === 'delete' ? 'Xác nhận xóa hàng loạt' : 'Xác nhận đổi trạng thái hàng loạt'}
        size="md"
      >
        <div className="space-y-4">
          <div className="text-center">
            {bulkActionType === 'delete' ? (
              <div>
                <Trash2 className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Xóa {selectedOrderIds.size} đơn hàng?
                </p>
                <p className="text-gray-600">
                  Hành động này không thể hoàn tác. Tất cả dữ liệu của các đơn hàng sẽ bị xóa vĩnh viễn.
                </p>
              </div>
            ) : (
              <div>
                <RotateCcw className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Đổi trạng thái {selectedOrderIds.size} đơn hàng?
                </p>
                <p className="text-gray-600">
                  Tất cả đơn hàng đã chọn sẽ được đổi từ trạng thái{' '}
                  <span className="font-medium">{getStatusLabel(selectedOrdersStatus)}</span> thành{' '}
                  <span className="font-medium">{getStatusLabel(bulkTargetStatus)}</span>.
                </p>
              </div>
            )}
          </div>

          {/* Selected orders preview */}
          <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg">
            <div className="text-xs text-gray-500 px-3 py-2 bg-gray-50 border-b">
              Đơn hàng được chọn:
            </div>
            {Array.from(selectedOrderIds).slice(0, 5).map(orderId => {
              const order = orders.find(o => o.id === orderId);
              return (
                <div key={orderId} className="px-3 py-2 text-sm border-b border-gray-100 last:border-b-0">
                  <span className="font-medium">#{orderId}</span>
                  {order && (
                    <span className="text-gray-500 ml-2">
                      - {order.customer?.name || 'N/A'}
                    </span>
                  )}
                </div>
              );
            })}
            {selectedOrderIds.size > 5 && (
              <div className="px-3 py-2 text-xs text-gray-500 text-center">
                ... và {selectedOrderIds.size - 5} đơn hàng khác
              </div>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setIsBulkActionModalOpen(false)}
            >
              Hủy bỏ
            </Button>
            <Button
              variant={bulkActionType === 'delete' ? 'danger' : 'primary'}
              className="flex-1"
              onClick={confirmBulkAction}
            >
              {bulkActionType === 'delete' ? 'Xóa hàng loạt' : 'Đổi trạng thái'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Order Details Modal */}
      <Modal
        isOpen={isOrderDetailModalOpen}
        onClose={() => setIsOrderDetailModalOpen(false)}
        title="Chi tiết đơn hàng"
        size="xl"
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Thông tin đơn hàng</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Mã đơn hàng:</span>
                    <span className="font-medium">#{selectedOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Trạng thái:</span>
                    <span className={`font-medium ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusLabel(selectedOrder.status)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Ngày tạo:</span>
                    <span className="font-medium">
                      {format(new Date(selectedOrder.createdAt), "dd/MM/yyyy HH:mm")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Nhân viên bán hàng:</span>
                    <span className="font-medium">{selectedOrder.salesPerson?.fullName || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Thông tin khách hàng</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tên:</span>
                    <span className="font-medium">{selectedOrder.customer?.name || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Số điện thoại:</span>
                    <span className="font-medium">{selectedOrder.customer?.phone || "N/A"}</span>
                  </div>
                  {selectedOrder.customer?.email && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email:</span>
                      <span className="font-medium">{selectedOrder.customer.email}</span>
                    </div>
                  )}
                  {selectedOrder.customer?.address && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Địa chỉ:</span>
                      <span className="font-medium">{selectedOrder.customer.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Sản phẩm</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Đơn giá</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Số lượng</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedOrder.items?.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-4">
                          <div className="text-sm font-medium text-gray-900">{item.productName || item.product?.name || "N/A"}</div>
                          {(item.sku || item.product?.sku) && (
                            <div className="text-sm text-gray-500">SKU: {item.sku || item.product?.sku}</div>
                          )}
                        </td>
                        <td className="px-4 py-4 text-right text-sm text-gray-900">
                          {(item.price || 0).toLocaleString("vi-VN")} ₫
                        </td>
                        <td className="px-4 py-4 text-right text-sm text-gray-900">
                          {item.quantity || 0}
                        </td>
                        <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">
                          {((item.price || 0) * (item.quantity || 0)).toLocaleString("vi-VN")} ₫
                        </td>
                      </tr>
                    )) || (
                      <tr>
                        <td colSpan={4} className="px-4 py-4 text-center text-sm text-gray-500">
                          Không có sản phẩm
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                        Tổng cộng:
                      </td>
                      <td className="px-4 py-3 text-right text-lg font-bold text-gray-900">
                        {selectedOrder.total.toLocaleString("vi-VN")} ₫
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {selectedOrder.notes && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Ghi chú</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedOrder.notes}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;
