// Hệ thống danh mục phân cấp chi tiết
export interface CategoryHierarchy {
  id: string;
  name: string;
  description: string;
  parent?: string;
  children?: CategoryHierarchy[];
  attributes: CategoryAttribute[];
}

export interface CategoryAttribute {
  id: string;
  name: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  required: boolean;
  group: string;
  unit?: string;
  options?: string[];
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

// Danh mục thời trang phân theo giới tính và loại sản phẩm
export const CATEGORY_HIERARCHY: CategoryHierarchy[] = [
  {
    id: 'fashion_men',
    name: 'Thời trang nam',
    description: 'Quần áo, giày dép, phụ kiện dành cho nam',
    attributes: [
      {
        id: 'material',
        name: 'Chất liệu chính',
        type: 'select',
        required: true,
        group: 'Vật liệu',
        options: ['Cotton', 'Polyester', 'Vải pha', 'Denim', 'Linen', 'Wool', 'Leather']
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
        group: 'Sử dụng',
        options: ['Xuân', 'Hạ', 'Thu', 'Đông', '4 mùa']
      },
      {
        id: 'style',
        name: 'Phong cách',
        type: 'select',
        required: false,
        group: 'Thiết kế',
        options: ['Casual', 'Formal', 'Sport', 'Vintage', 'Street style']
      },
      {
        id: 'care_instructions',
        name: 'Hướng dẫn bảo quản',
        type: 'text',
        required: false,
        group: 'Chăm sóc',
        placeholder: 'VD: Giặt máy 30°C, không sấy khô'
      }
    ]
  },
  {
    id: 'fashion_women',
    name: 'Thời trang nữ',
    description: 'Quần áo, giày dép, phụ kiện dành cho nữ',
    attributes: [
      {
        id: 'material',
        name: 'Chất liệu chính',
        type: 'select',
        required: true,
        group: 'Vật liệu',
        options: ['Cotton', 'Polyester', 'Vải pha', 'Silk', 'Linen', 'Chiffon', 'Lace', 'Denim']
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
        group: 'Sử dụng',
        options: ['Xuân', 'Hạ', 'Thu', 'Đông', '4 mùa']
      },
      {
        id: 'style',
        name: 'Phong cách',
        type: 'select',
        required: false,
        group: 'Thiết kế',
        options: ['Casual', 'Elegant', 'Bohemian', 'Vintage', 'Office wear', 'Party dress']
      },
      {
        id: 'care_instructions',
        name: 'Hướng dẫn bảo quản',
        type: 'text',
        required: false,
        group: 'Chăm sóc',
        placeholder: 'VD: Giặt tay, phơi nơi thoáng mát'
      }
    ]
  },
  {
    id: 'electronics_mobile',
    name: 'Điện thoại & Tablet',
    description: 'Smartphone, tablet và phụ kiện',
    attributes: [
      {
        id: 'brand',
        name: 'Thương hiệu',
        type: 'select',
        required: true,
        group: 'Thông tin chung',
        options: ['Apple', 'Samsung', 'Xiaomi', 'OPPO', 'Vivo', 'Huawei', 'OnePlus', 'Google']
      },
      {
        id: 'model',
        name: 'Model',
        type: 'text',
        required: true,
        group: 'Thông tin chung',
        placeholder: 'VD: iPhone 15 Pro Max'
      },
      {
        id: 'operating_system',
        name: 'Hệ điều hành',
        type: 'select',
        required: true,
        group: 'Thông số kỹ thuật',
        options: ['iOS', 'Android', 'HarmonyOS', 'Windows']
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
        id: 'origin',
        name: 'Xuất xứ',
        type: 'select',
        required: false,
        group: 'Thông tin chung',
        options: ['Chính hãng VN', 'Nhập khẩu', 'Xách tay']
      }
    ]
  },
  {
    id: 'electronics_laptop',
    name: 'Laptop & Máy tính',
    description: 'Laptop, PC, và thiết bị máy tính',
    attributes: [
      {
        id: 'brand',
        name: 'Thương hiệu',
        type: 'select',
        required: true,
        group: 'Thông tin chung',
        options: ['Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'MSI', 'LG', 'Microsoft']
      },
      {
        id: 'model',
        name: 'Model',
        type: 'text',
        required: true,
        group: 'Thông tin chung',
        placeholder: 'VD: MacBook Air M2'
      },
      {
        id: 'operating_system',
        name: 'Hệ điều hành',
        type: 'select',
        required: true,
        group: 'Thông số kỹ thuật',
        options: ['macOS', 'Windows 11', 'Windows 10', 'Linux', 'Chrome OS']
      },
      {
        id: 'usage_purpose',
        name: 'Mục đích sử dụng',
        type: 'select',
        required: false,
        group: 'Phân loại',
        options: ['Văn phòng', 'Gaming', 'Đồ họa', 'Học tập', 'Lập trình', 'Đa mục đích']
      },
      {
        id: 'warranty',
        name: 'Bảo hành',
        type: 'number',
        required: true,
        group: 'Bảo hành',
        unit: 'tháng',
        validation: { min: 0, max: 60 }
      }
    ]
  },
  {
    id: 'home_furniture',
    name: 'Nội thất',
    description: 'Bàn, ghế, tủ, kệ và đồ nội thất',
    attributes: [
      {
        id: 'material',
        name: 'Chất liệu chính',
        type: 'select',
        required: true,
        group: 'Vật liệu',
        options: ['Gỗ tự nhiên', 'Gỗ công nghiệp', 'Kim loại', 'Nhựa', 'Thủy tinh', 'Da', 'Vải']
      },
      {
        id: 'room_type',
        name: 'Phòng sử dụng',
        type: 'select',
        required: true,
        group: 'Sử dụng',
        options: ['Phòng khách', 'Phòng ngủ', 'Nhà bếp', 'Phòng làm việc', 'Phòng ăn', 'Phòng tắm']
      },
      {
        id: 'style',
        name: 'Phong cách',
        type: 'select',
        required: false,
        group: 'Thiết kế',
        options: ['Hiện đại', 'Cổ điển', 'Tối giản', 'Vintage', 'Bắc Âu', 'Châu Á', 'Industrial']
      },
      {
        id: 'assembly_required',
        name: 'Cần lắp ráp',
        type: 'boolean',
        required: false,
        group: 'Thông tin khác'
      },
      {
        id: 'weight_capacity',
        name: 'Trọng lượng chịu tải',
        type: 'number',
        required: false,
        group: 'Thông số kỹ thuật',
        unit: 'kg',
        validation: { min: 0 }
      }
    ]
  },
  {
    id: 'home_kitchen',
    name: 'Đồ gia dụng nhà bếp',
    description: 'Nồi, chảo, đồ dùng nhà bếp',
    attributes: [
      {
        id: 'material',
        name: 'Chất liệu',
        type: 'select',
        required: true,
        group: 'Vật liệu',
        options: ['Inox', 'Nhôm', 'Ceramic', 'Thủy tinh', 'Nhựa', 'Gỗ', 'Silicon']
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
        id: 'dishwasher_safe',
        name: 'An toàn với máy rửa bát',
        type: 'boolean',
        required: false,
        group: 'Tính năng'
      },
      {
        id: 'microwave_safe',
        name: 'An toàn với lò vi sóng',
        type: 'boolean',
        required: false,
        group: 'Tính năng'
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
    id: 'sports_fitness',
    name: 'Thể thao & Fitness',
    description: 'Dụng cụ tập gym, thể thao',
    attributes: [
      {
        id: 'sport_type',
        name: 'Loại thể thao',
        type: 'select',
        required: true,
        group: 'Phân loại',
        options: ['Gym & Fitness', 'Chạy bộ', 'Yoga', 'Bóng đá', 'Bóng rổ', 'Tennis', 'Cầu lông', 'Bơi lội']
      },
      {
        id: 'material',
        name: 'Chất liệu',
        type: 'select',
        required: true,
        group: 'Vật liệu',
        options: ['Thép', 'Nhựa', 'Cao su', 'Nylon', 'Cotton', 'Polyester', 'Da']
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
        id: 'skill_level',
        name: 'Cấp độ',
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
    id: 'food_packaged',
    name: 'Thực phẩm đóng gói',
    description: 'Gạo, mì, bánh kẹo, đồ khô',
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
        id: 'shelf_life',
        name: 'Hạn sử dụng',
        type: 'text',
        required: true,
        group: 'Thời hạn',
        placeholder: 'VD: 12 tháng kể từ NSX'
      },
      {
        id: 'storage_conditions',
        name: 'Điều kiện bảo quản',
        type: 'select',
        required: true,
        group: 'Bảo quản',
        options: ['Nhiệt độ phòng', 'Mát (2-8°C)', 'Đông lạnh (-18°C)', 'Khô ráo', 'Tránh ánh sáng']
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
        name: 'Thích hợp cho người ăn chay',
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
    id: 'beauty_skincare',
    name: 'Chăm sóc da',
    description: 'Kem dưỡng, serum, mặt nạ, sữa rửa mặt',
    attributes: [
      {
        id: 'skin_type',
        name: 'Loại da phù hợp',
        type: 'select',
        required: false,
        group: 'Phù hợp',
        options: ['Da thường', 'Da khô', 'Da dầu', 'Da hỗn hợp', 'Da nhạy cảm', 'Mọi loại da']
      },
      {
        id: 'age_group',
        name: 'Độ tuổi phù hợp',
        type: 'select',
        required: false,
        group: 'Phù hợp',
        options: ['Dưới 20', '20-30', '30-40', '40-50', 'Trên 50', 'Mọi lứa tuổi']
      },
      {
        id: 'main_benefit',
        name: 'Công dụng chính',
        type: 'select',
        required: true,
        group: 'Tính năng',
        options: ['Dưỡng ẩm', 'Chống lão hóa', 'Làm sáng da', 'Trị mụn', 'Chống nắng', 'Làm sạch']
      },
      {
        id: 'natural_ingredients',
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
    id: 'books_educational',
    name: 'Sách giáo dục',
    description: 'Sách giáo khoa, tham khảo, học ngoại ngữ',
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
        id: 'education_level',
        name: 'Cấp học',
        type: 'select',
        required: false,
        group: 'Phân loại',
        options: ['Mầm non', 'Tiểu học', 'THCS', 'THPT', 'Đại học', 'Người đi làm']
      },
      {
        id: 'subject',
        name: 'Môn học',
        type: 'select',
        required: false,
        group: 'Phân loại',
        options: ['Toán', 'Văn', 'Anh', 'Lý', 'Hóa', 'Sinh', 'Sử', 'Địa', 'Tin học', 'Khác']
      }
    ]
  }
];

// Helper functions
export const getCategoryAttributes = (categoryId: string): CategoryAttribute[] => {
  const category = CATEGORY_HIERARCHY.find(cat => cat.id === categoryId);
  return category ? category.attributes : [];
};

export const getCategoryInfo = (categoryId: string) => {
  return CATEGORY_HIERARCHY.find(cat => cat.id === categoryId) || null;
};

export const getAllCategories = (): { id: string; name: string }[] => {
  return CATEGORY_HIERARCHY.map(cat => ({ id: cat.id, name: cat.name }));
};