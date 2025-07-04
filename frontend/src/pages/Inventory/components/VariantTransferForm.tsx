
import React, { useState, useEffect } from "react";
import { InventoryItem } from "../../../types";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import { serviceFactory } from "../../../services/serviceFactory";

interface VariantTransferFormProps {
  item: InventoryItem;
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (
    fromVariantId: string,
    toVariantId: string,
    quantity: number,
    reason?: string,
  ) => Promise<void>;
}

const VariantTransferForm: React.FC<VariantTransferFormProps> = ({
  item,
  isOpen,
  onClose,
  onTransfer,
}) => {
  const [variants, setVariants] = useState<InventoryItem[]>([]);
  const [fromVariantId, setFromVariantId] = useState<string>("");
  const [toVariantId, setToVariantId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingVariants, setLoadingVariants] = useState(false);

  // Lấy danh sách tất cả variants của sản phẩm
  useEffect(() => {
    if (isOpen && item.productId) {
      fetchProductVariants();
    }
  }, [isOpen, item.productId]);

  const fetchProductVariants = async () => {
    try {
      setLoadingVariants(true);
      const inventoryService = serviceFactory.getService('inventory');
      const allInventory = await inventoryService.getAll();
      
      // Lọc ra tất cả variants của cùng một sản phẩm
      const productVariants = allInventory.filter(
        inv => inv.productId === item.productId
      );
      
      setVariants(productVariants);
      
      // Set default values
      if (productVariants.length > 0) {
        setFromVariantId(item.id);
        const otherVariant = productVariants.find(v => v.id !== item.id);
        if (otherVariant) {
          setToVariantId(otherVariant.id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch variants:", error);
    } finally {
      setLoadingVariants(false);
    }
  };

  const getVariantStock = (variantId: string) => {
    const variant = variants.find(v => v.id === variantId);
    return variant ? variant.sellableStock : 0;
  };

  const getVariantInfo = (variantId: string) => {
    return variants.find(v => v.id === variantId);
  };

  const getMaxQuantity = () => {
    return getVariantStock(fromVariantId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (quantity <= 0) {
      alert("Số lượng phải lớn hơn 0");
      return;
    }

    if (fromVariantId === toVariantId) {
      alert("Không thể chuyển trong cùng một biến thể");
      return;
    }

    if (quantity > getVariantStock(fromVariantId)) {
      alert("Không đủ hàng để chuyển");
      return;
    }

    try {
      setLoading(true);
      await onTransfer(fromVariantId, toVariantId, quantity, reason);

      // Reset form
      setQuantity(1);
      setReason("");

      onClose();
    } catch (error) {
      console.error("Transfer failed:", error);
      alert("Có lỗi xảy ra khi thực hiện chuyển đổi");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (loadingVariants) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Chuyển đổi giữa biến thể">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3">Đang tải danh sách biến thể...</span>
        </div>
      </Modal>
    );
  }

  if (variants.length < 2) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Chuyển đổi giữa biến thể">
        <div className="text-center py-8">
          <p className="text-gray-500">
            Sản phẩm này chỉ có một biến thể. Không thể thực hiện chuyển đổi.
          </p>
          <Button onClick={onClose} className="mt-4">
            Đóng
          </Button>
        </div>
      </Modal>
    );
  }

  const fromVariant = getVariantInfo(fromVariantId);
  const toVariant = getVariantInfo(toVariantId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Chuyển đổi giữa biến thể">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">{item.productName}</h3>
          <p className="text-sm text-gray-600">
            Tổng số biến thể: {variants.length}
          </p>
        </div>

        {/* From Variant */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Từ biến thể
          </label>
          <select
            value={fromVariantId}
            onChange={(e) => setFromVariantId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {variants.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.variantName || variant.productName} (SKU: {variant.sku}) - Tồn: {variant.sellableStock}
              </option>
            ))}
          </select>
          {fromVariant && (
            <div className="mt-2 p-3 bg-blue-50 rounded border">
              <div className="text-sm">
                <p><span className="font-medium">Tồn kho hiện tại:</span> {fromVariant.sellableStock}</p>
                <p><span className="font-medium">Kho:</span> {fromVariant.warehouse}</p>
                <p><span className="font-medium">Vị trí:</span> {fromVariant.location}</p>
              </div>
            </div>
          )}
        </div>

        {/* To Variant */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Đến biến thể
          </label>
          <select
            value={toVariantId}
            onChange={(e) => setToVariantId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {variants.filter(v => v.id !== fromVariantId).map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.variantName || variant.productName} (SKU: {variant.sku}) - Tồn: {variant.sellableStock}
              </option>
            ))}
          </select>
          {toVariant && (
            <div className="mt-2 p-3 bg-green-50 rounded border">
              <div className="text-sm">
                <p><span className="font-medium">Tồn kho hiện tại:</span> {toVariant.sellableStock}</p>
                <p><span className="font-medium">Kho:</span> {toVariant.warehouse}</p>
                <p><span className="font-medium">Vị trí:</span> {toVariant.location}</p>
              </div>
            </div>
          )}
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số lượng chuyển đổi
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
            Tối đa: {getMaxQuantity()}
          </p>
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lý do chuyển đổi
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập lý do chuyển đổi giữa các biến thể..."
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
              fromVariantId === toVariantId ||
              quantity > getMaxQuantity()
            }
          >
            {loading ? "Đang xử lý..." : "Chuyển đổi"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default VariantTransferForm;
