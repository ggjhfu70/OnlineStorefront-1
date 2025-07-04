
import React, { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { EnhancedOrder } from "../../../types";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import { 
  Check, 
  Truck, 
  Package, 
  X, 
  AlertTriangle, 
  Eye,
  MoreHorizontal,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  RefreshCw,
  ChevronRight
} from "lucide-react";

interface OrderWorkflowActionsProps {
  order: EnhancedOrder;
  onConfirm: (orderId: string) => Promise<void>;
  onCancel: (orderId: string, reason: string) => Promise<void>;
  onWorkflowUpdate: (
    orderId: string,
    status: EnhancedOrder["status"],
    data?: any,
  ) => Promise<void>;
  onViewDetails?: (order: EnhancedOrder) => void;
  onEdit?: (order: EnhancedOrder) => void;
}

const OrderWorkflowActions: React.FC<OrderWorkflowActionsProps> = ({
  order,
  onConfirm,
  onCancel,
  onWorkflowUpdate,
  onViewDetails,
  onEdit,
}) => {
  const { user, canPerformAction } = useAuth();
  const [isActionsDropdownOpen, setIsActionsDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isShipmentModalOpen, setIsShipmentModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [shipmentData, setShipmentData] = useState({
    trackingCode: "",
    shippingProvider: "",
    notes: "",
  });

  const [cancelReason, setCancelReason] = useState("");

  // Định nghĩa workflow trạng thái
  const STATUS_WORKFLOW = {
    draft: {
      label: "Nháp",
      icon: Clock,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
      nextStatuses: ["confirmed"]
    },
    confirmed: {
      label: "Đã xác nhận",
      icon: CheckCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      nextStatuses: ["preparing", "cancelled"]
    },
    preparing: {
      label: "Đang chuẩn bị",
      icon: Package,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      nextStatuses: ["shipped", "cancelled"]
    },
    shipped: {
      label: "Đã giao vận",
      icon: Truck,
      color: "text-green-600",
      bgColor: "bg-green-100",
      nextStatuses: ["delivered"]
    },
    delivered: {
      label: "Đã giao hàng",
      icon: Check,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      nextStatuses: []
    },
    cancelled: {
      label: "Đã hủy",
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
      nextStatuses: []
    }
  };

  const canChangeStatus = canPerformAction("manage_inventory") || 
                         user?.role === "employee" || 
                         user?.role === "manager" || 
                         user?.role === "admin";

  const canEdit = canPerformAction("edit_order") || user?.role === "manager" || user?.role === "admin";
  const canDelete = canPerformAction("delete_order") || user?.role === "manager" || user?.role === "admin";

  const getAvailableStatuses = () => {
    const currentStatus = STATUS_WORKFLOW[order.status as keyof typeof STATUS_WORKFLOW];
    if (!currentStatus) return [];
    
    return currentStatus.nextStatuses.map(status => ({
      value: status,
      ...STATUS_WORKFLOW[status as keyof typeof STATUS_WORKFLOW]
    }));
  };

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === "shipped") {
      setIsStatusDropdownOpen(false);
      setIsShipmentModalOpen(true);
      return;
    }

    if (newStatus === "cancelled") {
      setIsStatusDropdownOpen(false);
      setIsCancelModalOpen(true);
      return;
    }

    setLoading(true);
    try {
      if (newStatus === "confirmed") {
        await onConfirm(order.id);
      } else {
        await onWorkflowUpdate(order.id, newStatus as EnhancedOrder["status"]);
      }
      setIsStatusDropdownOpen(false);
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShipOrder = async () => {
    if (!shipmentData.trackingCode || !shipmentData.shippingProvider) {
      return;
    }
    
    setLoading(true);
    try {
      await onWorkflowUpdate(order.id, "shipped", shipmentData);
      setIsShipmentModalOpen(false);
      setShipmentData({ trackingCode: "", shippingProvider: "", notes: "" });
    } catch (error) {
      console.error("Failed to ship order:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) return;
    
    setLoading(true);
    try {
      await onCancel(order.id, cancelReason);
      setIsCancelModalOpen(false);
      setCancelReason("");
    } catch (error) {
      console.error("Failed to cancel order:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentStatusConfig = STATUS_WORKFLOW[order.status as keyof typeof STATUS_WORKFLOW];
  const StatusIcon = currentStatusConfig?.icon || Clock;
  const availableStatuses = getAvailableStatuses();

  return (
    <div className="flex items-center justify-start">
      {/* Main Actions Dropdown */}
      <div className="relative">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setIsActionsDropdownOpen(!isActionsDropdownOpen)}
          disabled={loading}
          className="flex items-center space-x-1"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span>Thao tác</span>
        </Button>

        {isActionsDropdownOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsActionsDropdownOpen(false)}
            />
            <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
              <div className="py-2">
                {/* Change Status Action */}
                {canChangeStatus && availableStatuses.length > 0 && (
                  <div className="relative">
                    <button
                      onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                      className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        <RefreshCw className="h-4 w-4 mr-3 text-blue-600" />
                        Chuyển trạng thái
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    
                    {isStatusDropdownOpen && (
                      <div className="absolute right-full top-0 mr-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                        <div className="py-2">
                          <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase border-b border-gray-100">
                            Trạng thái hiện tại: {currentStatusConfig?.label}
                          </div>
                          {availableStatuses.map((status) => {
                            const StatusIcon = status.icon;
                            return (
                              <button
                                key={status.value}
                                onClick={() => handleStatusChange(status.value)}
                                disabled={loading}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                              >
                                <StatusIcon className={`h-4 w-4 mr-3 ${status.color}`} />
                                {status.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* View Details Action */}
                {onViewDetails && (
                  <button
                    onClick={() => {
                      onViewDetails(order);
                      setIsActionsDropdownOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Eye className="h-4 w-4 mr-3 text-gray-600" />
                    Xem chi tiết
                  </button>
                )}

                {/* Edit Action - chỉ cho phép sửa khi status là draft */}
                {canEdit && onEdit && order.status === "draft" && (
                  <button
                    onClick={() => {
                      onEdit(order);
                      setIsActionsDropdownOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Edit className="h-4 w-4 mr-3 text-indigo-600" />
                    Sửa đơn hàng
                  </button>
                )}

                {/* Delete Action */}
                {canDelete && order.status === "draft" && (
                  <button
                    onClick={() => {
                      setIsCancelModalOpen(true);
                      setIsActionsDropdownOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-3" />
                    Xóa đơn hàng
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Shipment Modal */}
      <Modal
        isOpen={isShipmentModalOpen}
        onClose={() => setIsShipmentModalOpen(false)}
        title="Thông tin giao hàng"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mã vận đơn <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={shipmentData.trackingCode}
              onChange={(e) =>
                setShipmentData({
                  ...shipmentData,
                  trackingCode: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập mã vận đơn"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đơn vị vận chuyển <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={shipmentData.shippingProvider}
              onChange={(e) =>
                setShipmentData({
                  ...shipmentData,
                  shippingProvider: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Chọn đơn vị vận chuyển</option>
              <option value="Giao Hàng Nhanh">Giao Hàng Nhanh</option>
              <option value="Giao Hàng Tiết Kiệm">Giao Hàng Tiết Kiệm</option>
              <option value="Viettel Post">Viettel Post</option>
              <option value="Vietnam Post">Vietnam Post</option>
              <option value="J&T Express">J&T Express</option>
              <option value="Shopee Express">Shopee Express</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú
            </label>
            <textarea
              rows={3}
              value={shipmentData.notes}
              onChange={(e) =>
                setShipmentData({ ...shipmentData, notes: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập ghi chú về giao hàng"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsShipmentModalOpen(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              onClick={handleShipOrder}
              disabled={
                loading ||
                !shipmentData.trackingCode ||
                !shipmentData.shippingProvider
              }
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? "Đang xử lý..." : "Xác nhận giao hàng"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Cancel Modal */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title={order.status === "draft" ? "Xóa đơn hàng" : "Hủy đơn hàng"}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {order.status === "draft" ? "Lý do xóa" : "Lý do hủy"} <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder={order.status === "draft" ? "Vui lòng nhập lý do xóa đơn hàng..." : "Vui lòng nhập lý do hủy đơn hàng..."}
            />
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-red-800">
                <p className="font-medium mb-1">Cảnh báo</p>
                <p>
                  {order.status === "draft" 
                    ? "Việc xóa đơn hàng không thể hoàn tác. Đơn hàng sẽ bị xóa hoàn toàn khỏi hệ thống."
                    : "Việc hủy đơn hàng không thể hoàn tác. Đơn hàng sẽ chuyển sang trạng thái 'Đã hủy' và không thể thay đổi sau đó."
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsCancelModalOpen(false)}
              disabled={loading}
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={handleCancelOrder}
              disabled={loading || !cancelReason.trim()}
              variant="danger"
            >
              {loading ? "Đang xử lý..." : (order.status === "draft" ? "Xác nhận xóa" : "Xác nhận hủy đơn hàng")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrderWorkflowActions;
