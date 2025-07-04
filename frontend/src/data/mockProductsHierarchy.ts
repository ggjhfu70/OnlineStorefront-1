import { Product } from '../types';

// Dữ liệu sản phẩm mẫu sử dụng hệ thống danh mục phân cấp
export const mockProductsHierarchy: Product[] = [
  {
    id: '1',
    name: 'Áo sơ mi Oxford trắng',
    sku: 'SM-OXFORD-001',
    category: 'fashion_men',
    description: 'Áo sơ mi Oxford trắng classic fit, chất liệu cotton 100%, phù hợp cho văn phòng',
    price: 450000,
    cost: 280000,
    currency: 'VND',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'],
    attributes: {},
    specifications: [
      { id: 'material', name: 'Chất liệu chính', value: 'Cotton', type: 'select', group: 'Vật liệu', displayOrder: 0, required: true, options: ['Cotton', 'Polyester', 'Vải pha', 'Denim', 'Linen', 'Wool', 'Leather'] },
      { id: 'brand', name: 'Thương hiệu', value: 'Oxford Collection', type: 'text', group: 'Thông tin chung', displayOrder: 1, required: false },
      { id: 'season', name: 'Mùa phù hợp', value: '4 mùa', type: 'select', group: 'Sử dụng', displayOrder: 2, required: false, options: ['Xuân', 'Hạ', 'Thu', 'Đông', '4 mùa'] },
      { id: 'style', name: 'Phong cách', value: 'Formal', type: 'select', group: 'Thiết kế', displayOrder: 3, required: false, options: ['Casual', 'Formal', 'Sport', 'Vintage', 'Street style'] },
      { id: 'care_instructions', name: 'Hướng dẫn bảo quản', value: 'Giặt máy 40°C, ủi nhiệt độ trung bình', type: 'text', group: 'Chăm sóc', displayOrder: 4, required: false }
    ],
    variants: [
      { id: 'v1', name: 'Size S - Trắng', sku: 'SM-OXFORD-001-S-WHITE', price: 450000, stock: 15, attributes: { size: 'S', color: 'Trắng' }, product_id: '1', cost: 280000, packaging_info: '', unit_multiplier: 1, weight: 0.3, dimensions: '' },
      { id: 'v2', name: 'Size M - Trắng', sku: 'SM-OXFORD-001-M-WHITE', price: 450000, stock: 25, attributes: { size: 'M', color: 'Trắng' }, product_id: '1', cost: 280000, packaging_info: '', unit_multiplier: 1, weight: 0.3, dimensions: '' },
      { id: 'v3', name: 'Size L - Trắng', sku: 'SM-OXFORD-001-L-WHITE', price: 450000, stock: 20, attributes: { size: 'L', color: 'Trắng' }, product_id: '1', cost: 280000, packaging_info: '', unit_multiplier: 1, weight: 0.3, dimensions: '' }
    ],
    active: true,
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-20T10:30:00Z'
  },
  {
    id: '2',
    name: 'Váy maxi hoa cổ điển',
    sku: 'DRESS-MAXI-HOA',
    category: 'fashion_women',
    description: 'Váy maxi họa tiết hoa nhỏ, chất liệu chiffon mềm mại, phù hợp dạo phố và dự tiệc',
    price: 680000,
    cost: 420000,
    currency: 'VND',
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400'],
    attributes: {},
    specifications: [
      { id: 'material', name: 'Chất liệu chính', value: 'Chiffon', type: 'select', group: 'Vật liệu', displayOrder: 0, required: true, options: ['Cotton', 'Polyester', 'Vải pha', 'Silk', 'Linen', 'Chiffon', 'Lace', 'Denim'] },
      { id: 'brand', name: 'Thương hiệu', value: 'Elegant Lady', type: 'text', group: 'Thông tin chung', displayOrder: 1, required: false },
      { id: 'season', name: 'Mùa phù hợp', value: 'Hạ', type: 'select', group: 'Sử dụng', displayOrder: 2, required: false, options: ['Xuân', 'Hạ', 'Thu', 'Đông', '4 mùa'] },
      { id: 'style', name: 'Phong cách', value: 'Vintage', type: 'select', group: 'Thiết kế', displayOrder: 3, required: false, options: ['Casual', 'Elegant', 'Bohemian', 'Vintage', 'Office wear', 'Party dress'] },
      { id: 'care_instructions', name: 'Hướng dẫn bảo quản', value: 'Giặt tay, phơi nơi thoáng mát, không vắt mạnh', type: 'text', group: 'Chăm sóc', displayOrder: 4, required: false }
    ],
    variants: [
      { id: 'v1', name: 'Size S - Hoa đỏ', sku: 'DRESS-MAXI-HOA-S-RED', price: 680000, stock: 8, attributes: { size: 'S', color: 'Hoa đỏ' }, product_id: '2', cost: 420000, packaging_info: '', unit_multiplier: 1, weight: 0.4, dimensions: '' },
      { id: 'v2', name: 'Size M - Hoa đỏ', sku: 'DRESS-MAXI-HOA-M-RED', price: 680000, stock: 12, attributes: { size: 'M', color: 'Hoa đỏ' }, product_id: '2', cost: 420000, packaging_info: '', unit_multiplier: 1, weight: 0.4, dimensions: '' },
      { id: 'v3', name: 'Size L - Hoa xanh', sku: 'DRESS-MAXI-HOA-L-BLUE', price: 680000, stock: 6, attributes: { size: 'L', color: 'Hoa xanh' }, product_id: '2', cost: 420000, packaging_info: '', unit_multiplier: 1, weight: 0.4, dimensions: '' }
    ],
    active: true,
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-05T14:30:00Z'
  },
  {
    id: '3',
    name: 'iPhone 15 Pro Max 256GB',
    sku: 'IP15PM-256GB',
    category: 'electronics_mobile',
    description: 'iPhone 15 Pro Max 256GB - Titanium Natural, camera 48MP với zoom quang học 5x',
    price: 29990000,
    cost: 22000000,
    currency: 'VND',
    images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400'],
    attributes: {},
    specifications: [
      { id: 'brand', name: 'Thương hiệu', value: 'Apple', type: 'select', group: 'Thông tin chung', displayOrder: 0, required: true, options: ['Apple', 'Samsung', 'Xiaomi', 'OPPO', 'Vivo', 'Huawei', 'OnePlus', 'Google'] },
      { id: 'model', name: 'Model', value: 'iPhone 15 Pro Max', type: 'text', group: 'Thông tin chung', displayOrder: 1, required: true },
      { id: 'operating_system', name: 'Hệ điều hành', value: 'iOS', type: 'select', group: 'Thông số kỹ thuật', displayOrder: 2, required: true, options: ['iOS', 'Android', 'HarmonyOS', 'Windows'] },
      { id: 'warranty', name: 'Bảo hành', value: '12', type: 'number', group: 'Bảo hành', displayOrder: 3, required: true, unit: 'tháng' },
      { id: 'origin', name: 'Xuất xứ', value: 'Chính hãng VN', type: 'select', group: 'Thông tin chung', displayOrder: 4, required: false, options: ['Chính hãng VN', 'Nhập khẩu', 'Xách tay'] }
    ],
    variants: [
      { id: 'v1', name: '256GB - Titanium Natural', sku: 'IP15PM-256GB-TN', price: 29990000, stock: 5, attributes: { storage: '256GB', color: 'Titanium Natural' }, product_id: '3', cost: 22000000, packaging_info: '', unit_multiplier: 1, weight: 0.22, dimensions: '' },
      { id: 'v2', name: '256GB - Titanium Blue', sku: 'IP15PM-256GB-TB', price: 29990000, stock: 3, attributes: { storage: '256GB', color: 'Titanium Blue' }, product_id: '3', cost: 22000000, packaging_info: '', unit_multiplier: 1, weight: 0.22, dimensions: '' }
    ],
    active: true,
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-02-10T15:30:00Z'
  },
  {
    id: '4',
    name: 'MacBook Air M2 13 inch',
    sku: 'MBA-M2-13',
    category: 'electronics_laptop',
    description: 'MacBook Air với chip M2, màn hình 13.6 inch, RAM 8GB, SSD 256GB, thiết kế mỏng nhẹ',
    price: 27990000,
    cost: 21000000,
    currency: 'VND',
    images: ['https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400'],
    attributes: {},
    specifications: [
      { id: 'brand', name: 'Thương hiệu', value: 'Apple', type: 'select', group: 'Thông tin chung', displayOrder: 0, required: true, options: ['Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'MSI', 'LG', 'Microsoft'] },
      { id: 'model', name: 'Model', value: 'MacBook Air M2 13 inch', type: 'text', group: 'Thông tin chung', displayOrder: 1, required: true },
      { id: 'operating_system', name: 'Hệ điều hành', value: 'macOS', type: 'select', group: 'Thông số kỹ thuật', displayOrder: 2, required: true, options: ['macOS', 'Windows 11', 'Windows 10', 'Linux', 'Chrome OS'] },
      { id: 'usage_purpose', name: 'Mục đích sử dụng', value: 'Đa mục đích', type: 'select', group: 'Phân loại', displayOrder: 3, required: false, options: ['Văn phòng', 'Gaming', 'Đồ họa', 'Học tập', 'Lập trình', 'Đa mục đích'] },
      { id: 'warranty', name: 'Bảo hành', value: '12', type: 'number', group: 'Bảo hành', displayOrder: 4, required: true, unit: 'tháng' }
    ],
    variants: [
      { id: 'v1', name: '8GB RAM - 256GB SSD - Silver', sku: 'MBA-M2-13-8-256-SL', price: 27990000, stock: 7, attributes: { ram: '8GB', storage: '256GB', color: 'Silver' }, product_id: '4', cost: 21000000, packaging_info: '', unit_multiplier: 1, weight: 1.24, dimensions: '' },
      { id: 'v2', name: '8GB RAM - 512GB SSD - Space Gray', sku: 'MBA-M2-13-8-512-SG', price: 32990000, stock: 4, attributes: { ram: '8GB', storage: '512GB', color: 'Space Gray' }, product_id: '4', cost: 25000000, packaging_info: '', unit_multiplier: 1, weight: 1.24, dimensions: '' }
    ],
    active: true,
    createdAt: '2024-02-05T11:00:00Z',
    updatedAt: '2024-02-15T16:45:00Z'
  },
  {
    id: '5',
    name: 'Sofa góc da cao cấp',
    sku: 'SOFA-DA-GOC',
    category: 'home_furniture',
    description: 'Sofa góc bọc da thật 100%, khung gỗ tự nhiên, thiết kế hiện đại cho phòng khách',
    price: 18500000,
    cost: 12000000,
    currency: 'VND',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'],
    attributes: {},
    specifications: [
      { id: 'material', name: 'Chất liệu chính', value: 'Da', type: 'select', group: 'Vật liệu', displayOrder: 0, required: true, options: ['Gỗ tự nhiên', 'Gỗ công nghiệp', 'Kim loại', 'Nhựa', 'Thủy tinh', 'Da', 'Vải'] },
      { id: 'room_type', name: 'Phòng sử dụng', value: 'Phòng khách', type: 'select', group: 'Sử dụng', displayOrder: 1, required: true, options: ['Phòng khách', 'Phòng ngủ', 'Nhà bếp', 'Phòng làm việc', 'Phòng ăn', 'Phòng tắm'] },
      { id: 'style', name: 'Phong cách', value: 'Hiện đại', type: 'select', group: 'Thiết kế', displayOrder: 2, required: false, options: ['Hiện đại', 'Cổ điển', 'Tối giản', 'Vintage', 'Bắc Âu', 'Châu Á', 'Industrial'] },
      { id: 'assembly_required', name: 'Cần lắp ráp', value: 'true', type: 'boolean', group: 'Thông tin khác', displayOrder: 3, required: false },
      { id: 'weight_capacity', name: 'Trọng lượng chịu tải', value: '300', type: 'number', group: 'Thông số kỹ thuật', displayOrder: 4, required: false, unit: 'kg' }
    ],
    variants: [
      { id: 'v1', name: 'Da nâu - Góc trái', sku: 'SOFA-DA-GOC-BROWN-L', price: 18500000, stock: 2, attributes: { color: 'Nâu', direction: 'Góc trái' }, product_id: '5', cost: 12000000, packaging_info: '', unit_multiplier: 1, weight: 85, dimensions: '280x180x85 cm' },
      { id: 'v2', name: 'Da đen - Góc phải', sku: 'SOFA-DA-GOC-BLACK-R', price: 18500000, stock: 1, attributes: { color: 'Đen', direction: 'Góc phải' }, product_id: '5', cost: 12000000, packaging_info: '', unit_multiplier: 1, weight: 85, dimensions: '280x180x85 cm' }
    ],
    active: true,
    createdAt: '2024-01-30T14:00:00Z',
    updatedAt: '2024-02-08T09:30:00Z'
  },
  {
    id: '6',
    name: 'Gạo ST25 thơm dẻo',
    sku: 'GAO-ST25-5KG',
    category: 'food_packaged',
    description: 'Gạo ST25 thơm dẻo được công nhận là gạo ngon nhất thế giới, túi 5kg',
    price: 180000,
    cost: 120000,
    currency: 'VND',
    images: ['https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400'],
    attributes: {},
    specifications: [
      { id: 'origin', name: 'Xuất xứ', value: 'Việt Nam', type: 'select', group: 'Nguồn gốc', displayOrder: 0, required: true, options: ['Việt Nam', 'Thái Lan', 'Nhật Bản', 'Hàn Quốc', 'Úc', 'New Zealand', 'Mỹ', 'EU'] },
      { id: 'shelf_life', name: 'Hạn sử dụng', value: '18 tháng kể từ NSX', type: 'text', group: 'Thời hạn', displayOrder: 1, required: true },
      { id: 'storage_conditions', name: 'Điều kiện bảo quản', value: 'Khô ráo', type: 'select', group: 'Bảo quản', displayOrder: 2, required: true, options: ['Nhiệt độ phòng', 'Mát (2-8°C)', 'Đông lạnh (-18°C)', 'Khô ráo', 'Tránh ánh sáng'] },
      { id: 'organic', name: 'Hữu cơ', value: 'true', type: 'boolean', group: 'Chứng nhận', displayOrder: 3, required: false },
      { id: 'vegetarian', name: 'Thích hợp cho người ăn chay', value: 'true', type: 'boolean', group: 'Phân loại', displayOrder: 4, required: false },
      { id: 'allergens', name: 'Chất gây dị ứng', value: '', type: 'text', group: 'Cảnh báo', displayOrder: 5, required: false }
    ],
    variants: [
      { id: 'v1', name: 'Túi 5kg', sku: 'GAO-ST25-5KG', price: 180000, stock: 50, attributes: { weight: '5kg' }, product_id: '6', cost: 120000, packaging_info: 'Túi nilon', unit_multiplier: 1, weight: 5, dimensions: '' },
      { id: 'v2', name: 'Túi 10kg', sku: 'GAO-ST25-10KG', price: 350000, stock: 25, attributes: { weight: '10kg' }, product_id: '6', cost: 230000, packaging_info: 'Túi nilon', unit_multiplier: 1, weight: 10, dimensions: '' }
    ],
    active: true,
    createdAt: '2024-02-01T16:00:00Z',
    updatedAt: '2024-02-20T12:30:00Z'
  }
];