// Định nghĩa danh mục cố định và thuộc tính cho từng danh mục
export interface CategoryDefinition {
  id: string;
  name: string;
  description: string;
  attributes: CategoryAttribute[];
}

export interface CategoryAttribute {
  id: string;
  name: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  required: boolean;
  group: string;
  unit?: string; // Đơn vị cho loại number
  options?: string[]; // Tùy chọn cho loại select
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

// Định nghĩa các danh mục cố định
export const CATEGORY_DEFINITIONS: CategoryDefinition[] = [
  {
    id: 'fashion',
    name: 'Thời trang',
    description: 'Quần áo, giày dép, phụ kiện thời trang',
    attributes: [
      {
        id: 'material',
        name: 'Chất liệu chính',
        type: 'select',
        required: true,
        group: 'Vật liệu',
        options: ['Cotton', 'Polyester', 'Vải pha', 'Denim', 'Linen', 'Silk', 'Wool', 'Leather', 'Nylon', 'Spandex']
      },
      {
        id: 'brand',
        name: 'Thương hiệu',
        type: 'text',
        required: false,
        group: 'Thông tin chung',
        placeholder: 'Nhập tên thương hiệu'
      },
      {
        id: 'season',
        name: 'Mùa phù hợp',
        type: 'select',
        required: false,
        group: 'Phân loại',
        options: ['Xuân', 'Hạ', 'Thu', 'Đông', '4 mùa']
      },
      {
        id: 'care_instructions',
        name: 'Hướng dẫn bảo quản',
        type: 'text',
        required: false,
        group: 'Chăm sóc',
        placeholder: 'VD: Giặt máy 30°C, không sấy khô'
      },
      {
        id: 'origin',
        name: 'Xuất xứ',
        type: 'select',
        required: false,
        group: 'Thông tin chung',
        options: ['Việt Nam', 'Trung Quốc', 'Thái Lan', 'Bangladesh', 'Ấn Độ', 'Hàn Quốc', 'Nhật Bản']
      }
    ]
  },
  {
    id: 'electronics',
    name: 'Điện tử',
    description: 'Thiết bị điện tử, công nghệ',
    attributes: [
      {
        id: 'brand',
        name: 'Thương hiệu',
        type: 'select',
        required: true,
        group: 'Thông tin chung',
        options: ['Apple', 'Samsung', 'Xiaomi', 'OPPO', 'Vivo', 'Huawei', 'LG', 'Sony', 'Canon', 'Nikon']
      },
      {
        id: 'model',
        name: 'Model',
        type: 'text',
        required: true,
        group: 'Thông tin chung',
        placeholder: 'Nhập model sản phẩm'
      },
      {
        id: 'warranty',
        name: 'Bảo hành',
        type: 'number',
        required: true,
        group: 'Bảo hành',
        unit: 'tháng',
        validation: { min: 0, max: 60 }
      },
      {
        id: 'power',
        name: 'Công suất',
        type: 'number',
        required: false,
        group: 'Thông số kỹ thuật',
        unit: 'W',
        validation: { min: 0 }
      },
      {
        id: 'connectivity',
        name: 'Kết nối',
        type: 'select',
        required: false,
        group: 'Thông số kỹ thuật',
        options: ['Bluetooth', 'WiFi', 'USB', '3.5mm', 'Lightning', 'Type-C', 'HDMI']
      },
      {
        id: 'battery_life',
        name: 'Thời lượng pin',
        type: 'number',
        required: false,
        group: 'Pin',
        unit: 'giờ',
        validation: { min: 0, max: 168 }
      }
    ]
  },
  {
    id: 'home_garden',
    name: 'Nhà cửa & Sân vườn',
    description: 'Nội thất, đồ gia dụng, cây cảnh',
    attributes: [
      {
        id: 'material',
        name: 'Chất liệu',
        type: 'select',
        required: true,
        group: 'Vật liệu',
        options: ['Gỗ', 'Kim loại', 'Nhựa', 'Thủy tinh', 'Ceramic', 'Đá', 'Vải', 'Da']
      },
      {
        id: 'dimensions',
        name: 'Kích thước',
        type: 'text',
        required: true,
        group: 'Kích thước',
        placeholder: 'VD: 120x60x75 cm'
      },
      {
        id: 'weight',
        name: 'Trọng lượng',
        type: 'number',
        required: false,
        group: 'Kích thước',
        unit: 'kg',
        validation: { min: 0 }
      },
      {
        id: 'room_type',
        name: 'Phòng sử dụng',
        type: 'select',
        required: false,
        group: 'Sử dụng',
        options: ['Phòng khách', 'Phòng ngủ', 'Nhà bếp', 'Phòng tắm', 'Sân vườn', 'Văn phòng']
      },
      {
        id: 'style',
        name: 'Phong cách',
        type: 'select',
        required: false,
        group: 'Thiết kế',
        options: ['Hiện đại', 'Cổ điển', 'Tối giản', 'Vintage', 'Bắc Âu', 'Châu Á']
      },
      {
        id: 'assembly_required',
        name: 'Cần lắp ráp',
        type: 'boolean',
        required: false,
        group: 'Thông tin khác'
      }
    ]
  },
  {
    id: 'sports_outdoor',
    name: 'Thể thao & Dã ngoại',
    description: 'Dụng cụ thể thao, thiết bị dã ngoại',
    attributes: [
      {
        id: 'sport_type',
        name: 'Loại thể thao',
        type: 'select',
        required: true,
        group: 'Phân loại',
        options: ['Bóng đá', 'Bóng rổ', 'Tennis', 'Cầu lông', 'Bơi lội', 'Chạy bộ', 'Gym', 'Leo núi', 'Cắm trại']
      },
      {
        id: 'material',
        name: 'Chất liệu chính',
        type: 'select',
        required: true,
        group: 'Vật liệu',
        options: ['Polyester', 'Nylon', 'Cotton', 'Spandex', 'Cao su', 'Kim loại', 'Carbon fiber', 'Nhựa', 'Da']
      },
      {
        id: 'brand',
        name: 'Thương hiệu',
        type: 'text',
        required: false,
        group: 'Thông tin chung',
        placeholder: 'Nhập tên thương hiệu'
      },
      {
        id: 'waterproof',
        name: 'Chống nước',
        type: 'boolean',
        required: false,
        group: 'Tính năng'
      },
      {
        id: 'level',
        name: 'Cấp độ người dùng',
        type: 'select',
        required: false,
        group: 'Phân loại',
        options: ['Người mới', 'Trung cấp', 'Chuyên nghiệp', 'Tất cả cấp độ']
      },
      {
        id: 'warranty',
        name: 'Bảo hành',
        type: 'number',
        required: false,
        group: 'Bảo hành',
        unit: 'tháng',
        validation: { min: 0, max: 60 }
      }
    ]
  },
  {
    id: 'food_beverage',
    name: 'Thực phẩm & Đồ uống',
    description: 'Thực phẩm tươi sống, đồ uống, gia vị',
    attributes: [
      {
        id: 'origin',
        name: 'Xuất xứ',
        type: 'select',
        required: true,
        group: 'Nguồn gốc',
        options: ['Việt Nam', 'Thái Lan', 'Nhật Bản', 'Hàn Quốc', 'Úc', 'New Zealand', 'Mỹ', 'EU']
      },
      {
        id: 'expiry_date',
        name: 'Hạn sử dụng',
        type: 'text',
        required: true,
        group: 'Thời hạn',
        placeholder: 'VD: 12 tháng kể từ NSX'
      },
      {
        id: 'storage_temp',
        name: 'Nhiệt độ bảo quản',
        type: 'select',
        required: true,
        group: 'Bảo quản',
        options: ['Nhiệt độ phòng', 'Mát (2-8°C)', 'Đông lạnh (-18°C)', 'Khô ráo']
      },
      {
        id: 'weight_volume',
        name: 'Khối lượng/Thể tích',
        type: 'text',
        required: true,
        group: 'Quy cách',
        placeholder: 'VD: 500g, 1L, 250ml'
      },
      {
        id: 'organic',
        name: 'Hữu cơ',
        type: 'boolean',
        required: false,
        group: 'Chứng nhận'
      },
      {
        id: 'vegetarian',
        name: 'Chay',
        type: 'boolean',
        required: false,
        group: 'Phân loại'
      },
      {
        id: 'allergens',
        name: 'Chất gây dị ứng',
        type: 'text',
        required: false,
        group: 'Cảnh báo',
        placeholder: 'VD: Chứa gluten, đậu phộng'
      }
    ]
  },
  {
    id: 'beauty_personal',
    name: 'Làm đẹp & Chăm sóc cá nhân',
    description: 'Mỹ phẩm, chăm sóc da, chăm sóc tóc',
    attributes: [
      {
        id: 'skin_type',
        name: 'Loại da',
        type: 'select',
        required: false,
        group: 'Phù hợp',
        options: ['Da thường', 'Da khô', 'Da dầu', 'Da hỗn hợp', 'Da nhạy cảm', 'Mọi loại da']
      },
      {
        id: 'age_group',
        name: 'Độ tuổi',
        type: 'select',
        required: false,
        group: 'Phù hợp',
        options: ['Dưới 20', '20-30', '30-40', '40-50', 'Trên 50', 'Mọi lứa tuổi']
      },
      {
        id: 'volume',
        name: 'Dung tích',
        type: 'text',
        required: true,
        group: 'Quy cách',
        placeholder: 'VD: 50ml, 100g'
      },
      {
        id: 'spf',
        name: 'Chỉ số SPF',
        type: 'number',
        required: false,
        group: 'Tính năng',
        validation: { min: 0, max: 100 }
      },
      {
        id: 'natural',
        name: 'Thành phần tự nhiên',
        type: 'boolean',
        required: false,
        group: 'Thành phần'
      },
      {
        id: 'fragrance_free',
        name: 'Không mùi',
        type: 'boolean',
        required: false,
        group: 'Tính năng'
      },
      {
        id: 'main_ingredient',
        name: 'Thành phần chính',
        type: 'text',
        required: false,
        group: 'Thành phần',
        placeholder: 'VD: Hyaluronic Acid, Vitamin C'
      }
    ]
  },
  {
    id: 'books_media',
    name: 'Sách & Media',
    description: 'Sách, tạp chí, đĩa CD/DVD',
    attributes: [
      {
        id: 'author',
        name: 'Tác giả',
        type: 'text',
        required: true,
        group: 'Thông tin chung',
        placeholder: 'Tên tác giả'
      },
      {
        id: 'publisher',
        name: 'Nhà xuất bản',
        type: 'text',
        required: true,
        group: 'Thông tin chung',
        placeholder: 'Tên nhà xuất bản'
      },
      {
        id: 'publication_year',
        name: 'Năm xuất bản',
        type: 'number',
        required: true,
        group: 'Thông tin chung',
        validation: { min: 1900, max: new Date().getFullYear() }
      },
      {
        id: 'language',
        name: 'Ngôn ngữ',
        type: 'select',
        required: true,
        group: 'Ngôn ngữ',
        options: ['Tiếng Việt', 'Tiếng Anh', 'Tiếng Nhật', 'Tiếng Hàn', 'Tiếng Trung', 'Tiếng Pháp']
      },
      {
        id: 'pages',
        name: 'Số trang',
        type: 'number',
        required: false,
        group: 'Thông số',
        validation: { min: 1 }
      },
      {
        id: 'format',
        name: 'Định dạng',
        type: 'select',
        required: true,
        group: 'Định dạng',
        options: ['Bìa cứng', 'Bìa mềm', 'Ebook', 'Audiobook', 'CD', 'DVD', 'Blu-ray']
      },
      {
        id: 'genre',
        name: 'Thể loại',
        type: 'select',
        required: false,
        group: 'Phân loại',
        options: ['Tiểu thuyết', 'Khoa học', 'Lịch sử', 'Kinh tế', 'Tâm lý', 'Thiếu nhi', 'Giáo dục', 'Nghệ thuật']
      }
    ]
  }
];

// Helper function để lấy thuộc tính của danh mục
export const getCategoryAttributes = (categoryId: string): CategoryAttribute[] => {
  const category = CATEGORY_DEFINITIONS.find(cat => cat.id === categoryId);
  return category ? category.attributes : [];
};

// Helper function để lấy thông tin danh mục
export const getCategoryInfo = (categoryId: string): CategoryDefinition | null => {
  return CATEGORY_DEFINITIONS.find(cat => cat.id === categoryId) || null;
};

// Danh sách tất cả danh mục
export const getAllCategories = (): { id: string; name: string }[] => {
  return CATEGORY_DEFINITIONS.map(cat => ({ id: cat.id, name: cat.name }));
};