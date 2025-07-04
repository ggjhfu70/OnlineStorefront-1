
import React from "react";
import { Product } from "../../../types";
import { Package, Eye } from "lucide-react";
import Button from "../../../components/ui/Button";

interface ProductDetailsViewProps {
  product: Product;
  onClose: () => void;
  onEdit: () => void;
}

const ProductDetailsView: React.FC<ProductDetailsViewProps> = ({
  product,
  onClose,
  onEdit,
}) => {
  const totalStock = product.variants.reduce(
    (sum, variant) => sum + variant.stock,
    0,
  );
  const isLowStock = totalStock <= 10;
  const isOutOfStock = totalStock === 0;

  const getCategoryName = (categoryId: string) => {
    const categoryMap: Record<string, string> = {
      "fashion-men": "Thời trang nam",
      "fashion-women": "Thời trang nữ",
      electronics: "Điện tử",
      sports: "Thể thao",
      beauty: "Làm đẹp",
      home: "Gia dụng",
      fashion: "Thời trang",
    };
    return categoryMap[categoryId] || categoryId;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {product.name}
            </h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>SKU: {product.sku}</span>
              <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {getCategoryName(product.category)}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isOutOfStock ? (
              <span className="inline-flex items-center px-3 py-1 text-sm font-semibold bg-red-100 text-red-800 rounded-full">
                <Package className="h-4 w-4 mr-1" />
                Hết hàng
              </span>
            ) : isLowStock ? (
              <span className="inline-flex items-center px-3 py-1 text-sm font-semibold bg-yellow-100 text-yellow-800 rounded-full">
                <Package className="h-4 w-4 mr-1" />
                Sắp hết
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 text-sm font-semibold bg-green-100 text-green-800 rounded-full">
                <Package className="h-4 w-4 mr-1" />
                Còn hàng
              </span>
            )}
          </div>
        </div>

        {product.description && (
          <p className="text-gray-700 mb-4">{product.description}</p>
        )}
      </div>

      {/* Pricing Information */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          💰 Thông tin giá cả
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Giá bán
            </label>
            <div className="text-lg font-bold text-gray-900">
              {product.price.toLocaleString("vi-VN")} {product.currency}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Giá vốn
            </label>
            <div className="text-lg font-medium text-gray-700">
              {product.cost?.toLocaleString("vi-VN") || "0"} {product.currency}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Lợi nhuận
            </label>
            <div className="text-lg font-medium text-green-600">
              {product.cost && product.price > product.cost
                ? `${(((product.price - product.cost) / product.price) * 100).toFixed(1)}%`
                : "N/A"}
            </div>
          </div>
        </div>
      </div>

      {/* Packaging Information */}
      {product.packaging && product.packaging.length > 0 && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📦 Kiểu đóng gói
          </h3>
          <div className="space-y-2">
            {product.packaging.map((pkg) => (
              <div
                key={pkg.id}
                className={`flex items-center justify-between p-3 border rounded-lg ${
                  pkg.isDefault
                    ? "border-blue-300 bg-blue-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <span className="font-medium">
                  1 {pkg.unit} = {pkg.quantity} sản phẩm
                </span>
                {pkg.isDefault && (
                  <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                    Mặc định
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Variants Information */}
      {product.variants && product.variants.length > 0 && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🔄 Biến thể sản phẩm ({product.variants.length})
          </h3>
          <div className="space-y-3">
            {product.variants.map((variant) => (
              <div
                key={variant.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="font-medium text-gray-900">
                      {variant.name}
                    </span>
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                      SKU: {variant.sku}
                    </span>
                    {variant.isDefault && (
                      <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                        Mặc định
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Giá bán: </span>
                      <span className="font-medium">
                        {variant.price?.toLocaleString("vi-VN") || "0"} {variant.currency || product.currency}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Giá vốn: </span>
                      <span className="font-medium">
                        {variant.cost?.toLocaleString("vi-VN") || "0"} {variant.currency || product.currency}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Tồn kho: </span>
                      <span className={`font-medium ${
                        variant.stock === 0
                          ? "text-red-600"
                          : variant.stock <= 10
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}>
                        {variant.stock}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Trạng thái: </span>
                      <span className={`font-medium ${
                        variant.active ? "text-green-600" : "text-red-600"
                      }`}>
                        {variant.active ? "Hoạt động" : "Ngừng bán"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Specifications */}
      {product.specifications && product.specifications.length > 0 && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            ⚙️ Thuộc tính sản phẩm
          </h3>
          <div className="space-y-4">
            {Object.entries(
              product.specifications.reduce((groups: any, spec) => {
                const group = spec.group || "Khác";
                if (!groups[group]) groups[group] = [];
                groups[group].push(spec);
                return groups;
              }, {}),
            ).map(([groupName, specs]: [string, any]) => (
              <div
                key={groupName}
                className="border border-gray-200 rounded-lg p-4"
              >
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  {groupName}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {specs.map((spec: any) => (
                    <div key={spec.id} className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">
                        {spec.name}:
                      </span>
                      <span className="text-sm text-gray-900 font-medium">
                        {spec.value || "N/A"}
                        {spec.unit && ` ${spec.unit}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Total Stock Summary */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📊 Tổng kết tồn kho
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{totalStock}</div>
            <div className="text-sm text-gray-600">Tổng tồn kho</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {product.variants?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Số biến thể</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              isOutOfStock ? "text-red-600" : isLowStock ? "text-yellow-600" : "text-green-600"
            }`}>
              {isOutOfStock ? "Hết hàng" : isLowStock ? "Sắp hết" : "Còn hàng"}
            </div>
            <div className="text-sm text-gray-600">Trạng thái</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button type="button" variant="secondary" onClick={onClose}>
          Đóng
        </Button>
        <Button type="button" onClick={onEdit}>
          Chỉnh sửa sản phẩm
        </Button>
      </div>
    </div>
  );
};

export default ProductDetailsView;
