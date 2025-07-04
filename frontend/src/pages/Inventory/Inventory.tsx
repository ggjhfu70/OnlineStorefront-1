import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useInventory } from "../../hooks/useInventory";
import { Search, AlertTriangle, Package, Edit } from "lucide-react";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { InventoryItem } from "../../types";
import { format } from "date-fns";
import StockTransferForm from "./components/StockTransferForm";
import VariantTransferForm from "./components/VariantTransferForm";

const Inventory: React.FC = () => {
  const { t } = useTranslation();
  const { inventory, loading, updateStock } = useInventory();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "low" && item.availableStock <= item.minStock) ||
      (filterStatus === "out" && item.availableStock === 0);

    return matchesSearch && matchesFilter;
  });

  const handleStockAdjustment = async (itemId: string, newStock: number) => {
    try {
      await updateStock(itemId, newStock);
      setIsModalOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error("Failed to update stock:", error);
    }
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.sellableStock === 0) {
      return {
        status: t("inventory.outOfStock"),
        color: "text-red-600 bg-red-100",
      };
    } else if (item.sellableStock <= item.minStock) {
      return {
        status: t("inventory.lowStock"),
        color: "text-orange-600 bg-orange-100",
      };
    } else {
      return {
        status: t("inventory.inStock"),
        color: "text-green-600 bg-green-100",
      };
    }
  };

  // Use filtered inventory directly
  const displayInventory = filteredInventory.map(item => ({
    ...item,
    isVariant: !!item.variantId,
    isDefault: !item.variantId || item.variantId === 'v0'
  }));

  const columns = [
    {
      key: "productName",
      title: t("inventory.product"),
      render: (value: string, record: any) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">SKU: {record.sku}</p>
          {record.isVariant && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs mt-1 ${
              record.isDefault 
                ? 'bg-gray-100 text-gray-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {record.isDefault ? 'Gốc' : 'Biến thể'}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "warehouse",
      title: t("inventory.location"),
      render: (value: string, record: any) => (
        <div>
          <p className="text-sm text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{record.location}</p>
        </div>
      ),
    },
    {
      key: "totalStock",
      title: "Tổng tồn kho",
      render: (value: number, record: any) => (
        <div>
          <span className="font-medium text-gray-900">{value || 0}</span>
          {record.isVariant && (
            <p className="text-xs text-gray-500">{record.variantName}</p>
          )}
        </div>
      ),
    },
    {
      key: "sellableStock",
      title: "Hàng bán",
      render: (value: number) => (
        <span className="font-medium text-green-600">{value || 0}</span>
      ),
    },
    {
      key: "damagedStock",
      title: "Hàng hủy",
      render: (value: number) => (
        <span className="text-sm text-red-600">{value || 0}</span>
      ),
    },
    {
      key: "holdStock",
      title: "Hàng giữ",
      render: (value: number) => (
        <span className="text-sm text-orange-600">{value || 0}</span>
      ),
    },
    {
      key: "transitStock",
      title: "Đang vận chuyển",
      render: (value: number) => (
        <span className="text-sm text-blue-600">{value || 0}</span>
      ),
    },
    {
      key: "status",
      title: t("common.status"),
      render: (_: any, record: any) => {
        const { status, color } = getStockStatus(record);
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}
          >
            {record.availableStock <= record.minStock &&
              record.availableStock > 0 && (
                <AlertTriangle className="h-3 w-3 mr-1" />
              )}
            {status}
          </span>
        );
      },
    },
    {
      key: "lastUpdated",
      title: t("common.lastUpdated"),
      render: (value: string) => (
        <span className="text-sm text-gray-500">
          {format(new Date(value), "MMM dd, yyyy")}
        </span>
      ),
    },
    {
      key: "actions",
      title: t("common.actions"),
      render: (_: any, record: any) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setSelectedItem(record);
              setIsModalOpen(true);
            }}
            title="Chuyển kho"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedItem(record);
              setIsVariantModalOpen(true);
            }}
            title="Chuyển đổi biến thể"
            className="text-purple-600 border-purple-200 hover:bg-purple-50"
          >
            🔄
          </Button>
        </div>
      ),
    },
  ];

  const lowStockCount = inventory.filter(
    (item) => item.sellableStock <= item.minStock,
  ).length;
  const outOfStockCount = inventory.filter(
    (item) => item.sellableStock === 0,
  ).length;

  const handleStockTransfer = async (
    fromStatus: 'sellable' | 'damaged' | 'hold' | 'transit',
    toStatus: 'sellable' | 'damaged' | 'hold' | 'transit',
    quantity: number,
    reason?: string
  ) => {
    if (!selectedItem) return;
    
    try {
      const { transferStock } = useInventory();
      await transferStock(selectedItem.id, fromStatus, toStatus, quantity, reason);
      setIsModalOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error("Stock transfer failed:", error);
      throw error;
    }
  };

  const handleVariantTransfer = async (
    fromVariantId: string,
    toVariantId: string,
    quantity: number,
    reason?: string
  ) => {
    try {
      // Implement variant transfer logic here
      // This would need to be added to the inventory service
      console.log("Variant transfer:", { fromVariantId, toVariantId, quantity, reason });
      
      // For now, just close the modal and refresh
      setIsVariantModalOpen(false);
      setSelectedItem(null);
      
      // Refresh inventory
      await fetchInventory();
    } catch (error) {
      console.error("Variant transfer failed:", error);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t("inventory.title")}
        </h1>
        <p className="text-gray-600 mt-2">{t("inventory.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {inventory.length}
              </h3>
              <p className="text-sm text-gray-600">
                {t("inventory.totalItems")}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {lowStockCount}
              </h3>
              <p className="text-sm text-gray-600">
                {t("inventory.lowStockItems")}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <Package className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {outOfStockCount}
              </h3>
              <p className="text-sm text-gray-600">
                {t("inventory.outOfStock")}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        {selectedItem && (
          <>
            <StockTransferForm
              item={selectedItem}
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setSelectedItem(null);
              }}
              onTransfer={handleStockTransfer}
            />
            <VariantTransferForm
              item={selectedItem}
              isOpen={isVariantModalOpen}
              onClose={() => {
                setIsVariantModalOpen(false);
                setSelectedItem(null);
              }}
              onTransfer={handleVariantTransfer}
            />
          </>
        )}
        <Table columns={columns} data={displayInventory} loading={loading} />
      </Card>
    </div>
  );
};

export default Inventory;