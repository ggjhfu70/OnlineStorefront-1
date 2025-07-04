import { Product } from '../types';

// Dữ liệu sản phẩm mẫu sử dụng hệ thống danh mục cố định
export const mockProductsWithCategories: Product[] = [
  {
    id: '1',
    name: 'Áo sơ mi trắng cao cấp',
    sku: 'SM-TRANG-001',
    category: 'fashion',
    description: 'Áo sơ mi trắng chất liệu cotton cao cấp, phù hợp cho văn phòng và sự kiện trang trọng',
    price: 450000,
    cost: 280000,
    currency: 'VND',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'],
    attributes: {},
    specifications: [
      { id: 'material', name: 'Chất liệu', value: 'Cotton', type: 'select', group: 'Vật liệu', displayOrder: 0, required: true, options: ['Cotton', 'Polyester', 'Vải pha', 'Denim', 'Linen', 'Silk', 'Wool', 'Leather'] },
      { id: 'size', name: 'Kích thước', value: 'L', type: 'select', group: 'Kích thước', displayOrder: 1, required: true, options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] },
      { id: 'color', name: 'Màu sắc', value: 'Trắng', type: 'select', group: 'Màu sắc', displayOrder: 2, required: true, options: ['Đen', 'Trắng', 'Xám', 'Đỏ', 'Xanh navy', 'Xanh dương', 'Hồng', 'Vàng', 'Nâu', 'Tím'] },
      { id: 'brand', name: 'Thương hiệu', value: 'VietFashion', type: 'text', group: 'Thông tin chung', displayOrder: 3, required: false },
      { id: 'gender', name: 'Giới tính', value: 'Nam', type: 'select', group: 'Phân loại', displayOrder: 4, required: true, options: ['Nam', 'Nữ', 'Unisex', 'Trẻ em'] },
      { id: 'season', name: 'Mùa', value: '4 mùa', type: 'select', group: 'Phân loại', displayOrder: 5, required: false, options: ['Xuân', 'Hạ', 'Thu', 'Đông', '4 mùa'] }
    ],
    variants: [
      { id: 'v1', name: 'Mặc định', sku: 'SM-TRANG-001-DEF', stock: 50, priceAdjustment: 0, value: 'default', product_id: '1', cost: 280000, packaging_info: '', unit_multiplier: 1, weight: 0.5, dimensions: '', attributes: {}, active: true, created_at: '2024-01-15T08:00:00Z', updated_at: '2024-01-20T10:30:00Z' }
    ],
    stock: 50,
    active: true,
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-20T10:30:00Z'
  },
  {
    id: '2',
    name: 'iPhone 15 Pro Max',
    sku: 'IP15-PROMAX-256',
    category: 'electronics',
    description: 'iPhone 15 Pro Max 256GB - Điện thoại thông minh cao cấp với chip A17 Pro và camera 48MP',
    price: 29990000,
    cost: 22000000,
    currency: 'VND',
    images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400'],
    attributes: {},
    specifications: [
      { id: 'brand', name: 'Thương hiệu', value: 'Apple', type: 'select', group: 'Thông tin chung', displayOrder: 0, required: true, options: ['Apple', 'Samsung', 'Xiaomi', 'OPPO', 'Vivo', 'Huawei', 'LG', 'Sony', 'Canon', 'Nikon'] },
      { id: 'model', name: 'Model', value: 'iPhone 15 Pro Max', type: 'text', group: 'Thông tin chung', displayOrder: 1, required: true },
      { id: 'warranty', name: 'Bảo hành', value: '12', type: 'number', group: 'Bảo hành', displayOrder: 2, required: true, unit: 'tháng', validation: { min: 0, max: 60 } },
      { id: 'power', name: 'Công suất', value: '25', type: 'number', group: 'Thông số kỹ thuật', displayOrder: 3, required: false, unit: 'W', validation: { min: 0 } },
      { id: 'connectivity', name: 'Kết nối', value: 'WiFi', type: 'select', group: 'Thông số kỹ thuật', displayOrder: 4, required: false, options: ['Bluetooth', 'WiFi', 'USB', '3.5mm', 'Lightning', 'Type-C', 'HDMI'] },
      { id: 'battery_life', name: 'Thời lượng pin', value: '29', type: 'number', group: 'Pin', displayOrder: 5, required: false, unit: 'giờ', validation: { min: 0, max: 168 } }
    ],
    variants: [
      { id: 'v2', name: '256GB - Natural Titanium', sku: 'IP15-PROMAX-256-NT', stock: 15, priceAdjustment: 0, value: '256GB', product_id: '2', cost: 22000000, packaging_info: '', unit_multiplier: 1, weight: 0.221, dimensions: '', attributes: { storage: '256GB', color: 'Natural Titanium' }, active: true, created_at: '2024-02-01T09:00:00Z', updated_at: '2024-02-05T14:30:00Z' }
    ],
    stock: 15,
    active: true,
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-05T14:30:00Z'
  },
  {
    id: '3',
    name: 'Sofa góc da thật cao cấp',
    sku: 'SOFA-DA-001',
    category: 'home_garden',
    description: 'Sofa góc bọc da thật, thiết kế hiện đại, phù hợp cho phòng khách rộng rãi',
    price: 18500000,
    cost: 12000000,
    currency: 'VND',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'],
    attributes: {},
    specifications: [
      { id: 'material', name: 'Chất liệu', value: 'Da', type: 'select', group: 'Vật liệu', displayOrder: 0, required: true, options: ['Gỗ', 'Kim loại', 'Nhựa', 'Thủy tinh', 'Ceramic', 'Đá', 'Vải', 'Da'] },
      { id: 'dimensions', name: 'Kích thước', value: '280x180x85 cm', type: 'text', group: 'Kích thước', displayOrder: 1, required: true, placeholder: 'VD: 120x60x75 cm' },
      { id: 'weight', name: 'Trọng lượng', value: '85', type: 'number', group: 'Kích thước', displayOrder: 2, required: false, unit: 'kg', validation: { min: 0 } },
      { id: 'room_type', name: 'Phòng sử dụng', value: 'Phòng khách', type: 'select', group: 'Sử dụng', displayOrder: 3, required: false, options: ['Phòng khách', 'Phòng ngủ', 'Nhà bếp', 'Phòng tắm', 'Sân vườn', 'Văn phòng'] },
      { id: 'style', name: 'Phong cách', value: 'Hiện đại', type: 'select', group: 'Thiết kế', displayOrder: 4, required: false, options: ['Hiện đại', 'Cổ điển', 'Tối giản', 'Vintage', 'Bắc Âu', 'Châu Á'] },
      { id: 'assembly_required', name: 'Cần lắp ráp', value: 'true', type: 'boolean', group: 'Thông tin khác', displayOrder: 5, required: false }
    ],
    variants: [],
    active: true,
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-25T16:00:00Z'
  },
  {
    id: '4',
    name: 'Giày chạy bộ Nike Air Max',
    sku: 'NIKE-AIRMAX-42',
    category: 'sports_outdoor',
    description: 'Giày chạy bộ Nike Air Max với công nghệ đệm khí, phù hợp cho chạy marathon',
    price: 2890000,
    cost: 1800000,
    currency: 'VND',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'],
    attributes: {},
    specifications: [
      { id: 'sport_type', name: 'Loại thể thao', value: 'Chạy bộ', type: 'select', group: 'Phân loại', displayOrder: 0, required: true, options: ['Bóng đá', 'Bóng rổ', 'Tennis', 'Cầu lông', 'Bơi lội', 'Chạy bộ', 'Gym', 'Leo núi', 'Cắm trại'] },
      { id: 'material', name: 'Chất liệu', value: 'Polyester', type: 'select', group: 'Vật liệu', displayOrder: 1, required: true, options: ['Polyester', 'Nylon', 'Cotton', 'Spandex', 'Cao su', 'Kim loại', 'Carbon fiber', 'Nhựa'] },
      { id: 'size', name: 'Kích thước', value: '42', type: 'select', group: 'Kích thước', displayOrder: 2, required: false, options: ['38', '39', '40', '41', '42', '43', '44', '45'] },
      { id: 'weight', name: 'Trọng lượng', value: '0.3', type: 'number', group: 'Thông số', displayOrder: 3, required: false, unit: 'kg', validation: { min: 0 } },
      { id: 'waterproof', name: 'Chống nước', value: 'false', type: 'boolean', group: 'Tính năng', displayOrder: 4, required: false },
      { id: 'level', name: 'Cấp độ', value: 'Trung cấp', type: 'select', group: 'Sử dụng', displayOrder: 5, required: false, options: ['Người mới', 'Trung cấp', 'Chuyên nghiệp'] }
    ],
    variants: [],
    active: true,
    createdAt: '2024-02-10T11:00:00Z',
    updatedAt: '2024-02-15T13:45:00Z'
  },
  {
    id: '5',
    name: 'Gạo ST25 thơm dẻo',
    sku: 'GAO-ST25-5KG',
    category: 'food_beverage',
    description: 'Gạo ST25 thơm dẻo được công nhận là gạo ngon nhất thế giới, túi 5kg',
    price: 180000,
    cost: 120000,
    currency: 'VND',
    images: ['https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400'],
    attributes: {},
    specifications: [
      { id: 'origin', name: 'Xuất xứ', value: 'Việt Nam', type: 'select', group: 'Nguồn gốc', displayOrder: 0, required: true, options: ['Việt Nam', 'Thái Lan', 'Nhật Bản', 'Hàn Quốc', 'Úc', 'New Zealand', 'Mỹ', 'EU'] },
      { id: 'expiry_date', name: 'Hạn sử dụng', value: '18 tháng kể từ NSX', type: 'text', group: 'Thời hạn', displayOrder: 1, required: true, placeholder: 'VD: 12 tháng kể từ NSX' },
      { id: 'storage_temp', name: 'Nhiệt độ bảo quản', value: 'Khô ráo', type: 'select', group: 'Bảo quản', displayOrder: 2, required: true, options: ['Nhiệt độ phòng', 'Mát (2-8°C)', 'Đông lạnh (-18°C)', 'Khô ráo'] },
      { id: 'weight_volume', name: 'Khối lượng/Thể tích', value: '5kg', type: 'text', group: 'Quy cách', displayOrder: 3, required: true, placeholder: 'VD: 500g, 1L, 250ml' },
      { id: 'organic', name: 'Hữu cơ', value: 'true', type: 'boolean', group: 'Chứng nhận', displayOrder: 4, required: false },
      { id: 'vegetarian', name: 'Chay', value: 'true', type: 'boolean', group: 'Phân loại', displayOrder: 5, required: false },
      { id: 'allergens', name: 'Chất gây dị ứng', value: '', type: 'text', group: 'Cảnh báo', displayOrder: 6, required: false, placeholder: 'VD: Chứa gluten, đậu phộng' }
    ],
    variants: [],
    active: true,
    createdAt: '2024-01-30T14:00:00Z',
    updatedAt: '2024-02-08T09:30:00Z'
  },
  {
    id: '6',
    name: 'Kem dưỡng da Vitamin C',
    sku: 'KEM-VITC-50ML',
    category: 'beauty_personal',
    description: 'Kem dưỡng da mặt chứa Vitamin C, giúp làm sáng da và chống lão hóa',
    price: 320000,
    cost: 180000,
    currency: 'VND',
    images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'],
    attributes: {},
    specifications: [
      { id: 'skin_type', name: 'Loại da', value: 'Mọi loại da', type: 'select', group: 'Phù hợp', displayOrder: 0, required: false, options: ['Da thường', 'Da khô', 'Da dầu', 'Da hỗn hợp', 'Da nhạy cảm', 'Mọi loại da'] },
      { id: 'age_group', name: 'Độ tuổi', value: '20-30', type: 'select', group: 'Phù hợp', displayOrder: 1, required: false, options: ['Dưới 20', '20-30', '30-40', '40-50', 'Trên 50', 'Mọi lứa tuổi'] },
      { id: 'volume', name: 'Dung tích', value: '50ml', type: 'text', group: 'Quy cách', displayOrder: 2, required: true, placeholder: 'VD: 50ml, 100g' },
      { id: 'spf', name: 'Chỉ số SPF', value: '', type: 'number', group: 'Tính năng', displayOrder: 3, required: false, validation: { min: 0, max: 100 } },
      { id: 'natural', name: 'Thành phần tự nhiên', value: 'true', type: 'boolean', group: 'Thành phần', displayOrder: 4, required: false },
      { id: 'fragrance_free', name: 'Không mùi', value: 'false', type: 'boolean', group: 'Tính năng', displayOrder: 5, required: false },
      { id: 'main_ingredient', name: 'Thành phần chính', value: 'Vitamin C, Hyaluronic Acid', type: 'text', group: 'Thành phần', displayOrder: 6, required: false, placeholder: 'VD: Hyaluronic Acid, Vitamin C' }
    ],
    variants: [],
    active: true,
    createdAt: '2024-02-05T15:30:00Z',
    updatedAt: '2024-02-12T11:20:00Z'
  },
  {
    id: '7',
    name: 'Sách Atomic Habits',
    sku: 'SACH-ATOMICH-VN',
    category: 'books_media',
    description: 'Sách "Atomic Habits" - Thay đổi tí hon hiệu quả bất ngờ, bản tiếng Việt',
    price: 195000,
    cost: 120000,
    currency: 'VND',
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'],
    attributes: {},
    specifications: [
      { id: 'author', name: 'Tác giả', value: 'James Clear', type: 'text', group: 'Thông tin chung', displayOrder: 0, required: true, placeholder: 'Tên tác giả' },
      { id: 'publisher', name: 'Nhà xuất bản', value: 'NXB Tổng hợp TP.HCM', type: 'text', group: 'Thông tin chung', displayOrder: 1, required: true, placeholder: 'Tên nhà xuất bản' },
      { id: 'publication_year', name: 'Năm xuất bản', value: '2020', type: 'number', group: 'Thông tin chung', displayOrder: 2, required: true, validation: { min: 1900, max: new Date().getFullYear() } },
      { id: 'language', name: 'Ngôn ngữ', value: 'Tiếng Việt', type: 'select', group: 'Ngôn ngữ', displayOrder: 3, required: true, options: ['Tiếng Việt', 'Tiếng Anh', 'Tiếng Nhật', 'Tiếng Hàn', 'Tiếng Trung', 'Tiếng Pháp'] },
      { id: 'pages', name: 'Số trang', value: '320', type: 'number', group: 'Thông số', displayOrder: 4, required: false, validation: { min: 1 } },
      { id: 'format', name: 'Định dạng', value: 'Bìa mềm', type: 'select', group: 'Định dạng', displayOrder: 5, required: true, options: ['Bìa cứng', 'Bìa mềm', 'Ebook', 'Audiobook', 'CD', 'DVD', 'Blu-ray'] },
      { id: 'genre', name: 'Thể loại', value: 'Tâm lý', type: 'select', group: 'Phân loại', displayOrder: 6, required: false, options: ['Tiểu thuyết', 'Khoa học', 'Lịch sử', 'Kinh tế', 'Tâm lý', 'Thiếu nhi', 'Giáo dục', 'Nghệ thuật'] }
    ],
    variants: [],
    active: true,
    createdAt: '2024-01-25T16:45:00Z',
    updatedAt: '2024-02-02T10:15:00Z'
  }
];