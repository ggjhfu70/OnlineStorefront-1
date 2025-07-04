import React from "react";
import { Product } from "../../../types";
import { Edit, Trash2, Package, AlertTriangle, Eye } from "lucide-react";
import Button from "../../../components/ui/Button";

interface ProductCardProps {
  product: Product;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onUpdateStock: (productId: string, variantId: string, stock: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onView,
  onEdit,
  onDelete,
  onUpdateStock,
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
    };
    return categoryMap[categoryId] || categoryId;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 mb-2">SKU: {product.sku}</p>
          <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            {getCategoryName(product.category)}
          </span>
        </div>

        {/* Stock Status Badge */}
        <div className="flex items-center space-x-2">
          {isOutOfStock ? (
            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Hết hàng
            </span>
          ) : isLowStock ? (
            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Sắp hết
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
              <Package className="h-3 w-3 mr-1" />
              Còn hàng
            </span>
          )}
        </div>
      </div>

      {/* Price and Stock Info */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">
            {product.price.toLocaleString("vi-VN")} ₫
          </span>
          <span className="text-sm text-gray-600">SL: {totalStock}</span>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {product.description}
        </p>
      )}

      {/* Total Stock */}
      <div className="mt-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">
            Tổng tồn kho:
          </span>
          <span
            className={`px-2 py-1 rounded text-sm font-medium ${
              totalStock > 0
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {totalStock}
          </span>
        </div>
        {product.variants && product.variants.length > 1 && (
          <p className="text-xs text-gray-500 mt-1">
            {product.variants.length} biến thể
          </p>
        )}
      </div>

      {/* Specifications */}
      {product.specifications.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Thông số:</h4>
          <div className="text-sm text-gray-600">
            {product.specifications.slice(0, 2).map((spec) => (
              <div key={spec.id} className="flex justify-between">
                <span>{spec.name}:</span>
                <span>{spec.value}</span>
              </div>
            ))}
            {product.specifications.length > 2 && (
              <span className="text-xs text-gray-500">
                +{product.specifications.length - 2} thông số khác
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2 pt-4 border-t border-gray-200">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            console.log("View details button clicked for product:", product.id);
            onView(product);
          }}
          className="flex-1"
        >
          <Eye className="h-4 w-4 mr-1" />
          Xem
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            console.log("Edit button in ProductCard clicked for:", product);
            onEdit(product);
          }}
          className="flex-1"
        >
          <Edit className="h-4 w-4 mr-1" />
          Sửa
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => {
            console.log("Delete button clicked for product:", product.id);
            onDelete(product.id);
          }}
          className="flex-1"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Xóa
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;