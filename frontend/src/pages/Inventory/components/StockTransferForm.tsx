import React, { useState } from "react";
import { InventoryItem } from "../../../types";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";

interface StockTransferFormProps {
  item: InventoryItem;
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (
    fromStatus: "sellable" | "damaged" | "hold" | "transit",
    toStatus: "sellable" | "damaged" | "hold" | "transit",
    quantity: number,
    reason?: string,
  ) => Promise<void>;
}

const StockTransferForm: React.FC<StockTransferFormProps> = ({
  item,
  isOpen,
  onClose,
  onTransfer,
}) => {
  const [fromStatus, setFromStatus] = useState<
    "sellable" | "damaged" | "hold" | "transit"
  >("sellable");
  const [toStatus, setToStatus] = useState<
    "sellable" | "damaged" | "hold" | "transit"
  >("damaged");
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const statusLabels = {
    sellable: "Hàng bán",
    damaged: "Hàng hỏng",
    hold: "Tạm giữ",
    transit: "Đang vận chuyển",
  };

  const statusColors = {
    sellable: "text-green-600 bg-green-50 border-green-200",
    damaged: "text-red-600 bg-red-50 border-red-200",
    hold: "text-yellow-600 bg-yellow-50 border-yellow-200",
    transit: "text-blue-600 bg-blue-50 border-blue-200",
  };

  const getStockByStatus = (
    status: "sellable" | "damaged" | "hold" | "transit",
  ) => {
    switch (status) {
      case "sellable":
        return item.sellableStock;
      case "damaged":
        return item.damagedStock;
      case "hold":
        return item.holdStock;
      case "transit":
        return item.transitStock;
      default:
        return 0;
    }
  };

  const getMaxQuantity = () => {
    return getStockByStatus(fromStatus);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) {
      alert("Số lượng phải lớn hơn 0");
      return;
    }

    if (fromStatus === toStatus) {
      alert("Không thể chuyển trong cùng một trạng thái");
      return;
    }

    if (quantity > getStockByStatus(fromStatus)) {
      alert(
        `Không đủ hàng ${statusLabels[fromStatus].toLowerCase()} để chuyển`,
      );
      return;
    }

    try {
      setLoading(true);
      await onTransfer(fromStatus, toStatus, quantity, reason);

      // Reset form
      setQuantity(1);
      setReason("");
      setFromStatus("sellable");
      setToStatus("damaged");

      onClose();
    } catch (error) {
      console.error("Transfer failed:", error);
      alert("Có lỗi xảy ra khi thực hiện chuyển kho");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Điều chỉnh tồn kho">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">{item.productName}</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">SKU:</span>
              <span className="ml-2 font-medium">{item.sku}</span>
            </div>
            <div>
              <span className="text-gray-600">Tổng tồn kho:</span>
              <span className="ml-2 font-medium">{item.totalStock}</span>
            </div>
          </div>
        </div>

        {/* From Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Từ
          </label>
          <div className="space-y-2">
            <select
              value={fromStatus}
              onChange={(e) => setFromStatus(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(statusLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <div
              className={`px-3 py-2 rounded-lg border ${statusColors[fromStatus]}`}
            >
              <span className="text-sm font-medium">
                Tồn hiện tại: {getStockByStatus(fromStatus)}
              </span>
            </div>
          </div>
        </div>

        {/* To Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Đến
          </label>
          <div className="space-y-2">
            <select
              value={toStatus}
              onChange={(e) => setToStatus(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(statusLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <div
              className={`px-3 py-2 rounded-lg border ${statusColors[toStatus]}`}
            >
              <span className="text-sm font-medium">
                Tồn hiện tại: {getStockByStatus(toStatus)}
              </span>
            </div>
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số lượng
          </label>
          <input
            type="number"
            min="1"
            max={getMaxQuantity()}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Tối đa: {getStockByStatus(fromStatus)}
          </p>
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ghi chú
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập lý do điều chỉnh..."
          />
        </div>

        

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button type="button" variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={
              loading ||
              quantity <= 0 ||
              fromStatus === toStatus ||
              quantity > getStockByStatus(fromStatus)
            }
          >
            {loading ? "Đang xử lý..." : "Chuyển kho"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default StockTransferForm;