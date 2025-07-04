import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePurchaseOrders } from "../../hooks/usePurchaseOrders";
import { Search, Plus, Edit, Trash2, FileText } from "lucide-react";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import PurchaseOrderForm from "./components/PurchaseOrderForm";
import { PurchaseOrder } from "../../types";
import { format } from "date-fns";

const PurchaseOrders: React.FC = () => {
  const { t } = useTranslation();
  const {
    purchaseOrders,
    loading,
    createPurchaseOrder,
    updatePurchaseOrder,
    deletePurchaseOrder,
  } = usePurchaseOrders();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPurchaseOrder, setEditingPurchaseOrder] =
    useState<PurchaseOrder | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit" | "view">(
    "create",
  );

  const filteredPurchaseOrders = purchaseOrders.filter((po) => {
    // Chuyển đổi an toàn các giá trị có thể undefined thành chuỗi rỗng trước khi toLowerCase
    const poNumberForSearch = (po.poNumber ?? "").toLowerCase();
    const supplierNameForSearch = (po.supplierName ?? "").toLowerCase();
    const searchTermForSearch = searchTerm.toLowerCase();

    const matchesSearch =
      poNumberForSearch.includes(searchTermForSearch) ||
      supplierNameForSearch.includes(searchTermForSearch);

    return matchesSearch;
  });

  const handleCreatePurchaseOrder = async (
    poData: Omit<PurchaseOrder, "id" | "createdAt" | "updatedAt">,
  ) => {
    try {
      await createPurchaseOrder(poData);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create purchase order:", error);
    }
  };

  const handleUpdatePurchaseOrder = async (
    poData: Omit<PurchaseOrder, "id" | "createdAt" | "updatedAt">,
  ) => {
    if (!editingPurchaseOrder) return;
    try {
      await updatePurchaseOrder(editingPurchaseOrder.id, poData);
      setEditingPurchaseOrder(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to update purchase order:", error);
    }
  };

  const handleDeletePurchaseOrder = async (id: string) => {
    if (window.confirm(t("purchaseOrders.deleteConfirm"))) {
      try {
        await deletePurchaseOrder(id);
      } catch (error) {
        console.error("Failed to delete purchase order:", error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "ordered":
        return "bg-blue-100 text-blue-800";
      case "partially_received":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const columns = [
    {
      key: "poNumber",
      title: t("purchaseOrders.poNumber"),
      render: (value: string, record: PurchaseOrder) => (
        <div>
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-gray-400" />
            <span className="font-medium text-gray-900">{value}</span>
          </div>
          <p className="text-sm text-gray-500">
            {format(new Date(record.orderDate), "dd/MM/yyyy")}
          </p>
        </div>
      ),
    },
    {
      key: "supplierName",
      title: t("purchaseOrders.supplier"),
      render: (value: string, record: PurchaseOrder) => (
        <div>
          <span className="font-medium text-gray-900">
            {record.supplierName}
          </span>
          <p className="text-sm text-gray-500">
            ID: {record.supplierId}
          </p>
        </div>
      ),
    },
    {
      key: "expectedDate",
      title: t("purchaseOrders.expectedDelivery"),
      render: (value: string) => (
        <span className="text-sm text-gray-600">
          {value ? format(new Date(value), "dd/MM/yyyy") : "-"}
        </span>
      ),
    },
    {
      key: "totalAmount",
      title: t("purchaseOrders.totalCost"),
      render: (value: number) => (
        <span className="font-semibold text-gray-900">
          {value.toLocaleString()} VND
        </span>
      ),
    },
    {
      key: "status",
      title: t("common.status"),
      render: (value: string) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(value)}`}
        >
          {t(`purchaseOrders.${value}`)}
        </span>
      ),
    },
    {
      key: "items",
      title: t("orders.items"),
      render: (value: any[]) => (
        <span className="text-sm text-gray-600">{value.length} sản phẩm</span>
      ),
    },
    {
      key: "actions",
      title: t("common.actions"),
      render: (value: any, record: PurchaseOrder) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setEditingPurchaseOrder(record);
              setFormMode("view");
              setIsModalOpen(true);
            }}
            title="Xem chi tiết"
          >
            <FileText className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setEditingPurchaseOrder(record);
              setFormMode("edit");
              setIsModalOpen(true);
            }}
            title="Chỉnh sửa"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleDeletePurchaseOrder(record.id)}
            title="Xóa"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const poStats = {
    total: purchaseOrders.length,
    draft: purchaseOrders.filter((po) => po.status === "draft").length,
    ordered: purchaseOrders.filter((po) => po.status === "ordered").length,
    completed: purchaseOrders.filter((po) => po.status === "completed").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Phiếu Nhập Kho</h1>
          <p className="text-gray-600 mt-2">
            Quản lý phiếu nhập hàng từ nhà cung cấp vào kho
          </p>
        </div>
        <Button
          onClick={() => {
            setFormMode("create");
            setEditingPurchaseOrder(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="h-5 w-5 mr-2" />
          Tạo phiếu nhập kho
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {poStats.total}
            </div>
            <div className="text-sm text-gray-600">Tổng số phiếu nhập</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {purchaseOrders
                .reduce((sum, po) => sum + po.totalAmount, 0)
                .toLocaleString()}{" "}
              VND
            </div>
            <div className="text-sm text-gray-600">Tổng giá trị nhập kho</div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm theo số phiếu hoặc nhà cung cấp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <Table
          columns={columns}
          data={filteredPurchaseOrders}
          loading={loading}
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPurchaseOrder(null);
          setFormMode("create");
        }}
        title={
          formMode === "create"
            ? "Tạo phiếu nhập kho mới"
            : formMode === "edit"
              ? "Chỉnh sửa phiếu nhập"
              : "Chi tiết phiếu nhập kho"
        }
        size="xl"
      >
        <PurchaseOrderForm
          purchaseOrder={editingPurchaseOrder}
          mode={formMode}
          onSubmit={
            formMode === "edit"
              ? handleUpdatePurchaseOrder
              : handleCreatePurchaseOrder
          }
          onCancel={() => {
            setIsModalOpen(false);
            setEditingPurchaseOrder(null);
            setFormMode("create");
          }}
        />
      </Modal>
    </div>
  );
};

export default PurchaseOrders;
