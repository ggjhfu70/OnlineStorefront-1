
import React, { useState } from 'react';
import { X, Building, User, Save, FileText, MapPin } from 'lucide-react';

interface CreateDepartmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (departmentData: any) => void;
  users: any[];
}

const CreateDepartmentForm: React.FC<CreateDepartmentFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  users
}) => {
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    managerId: '',
    color: '#059669'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const departmentColors = [
    { value: '#059669', label: 'Xanh lá đậm' },
    { value: '#DC2626', label: 'Đỏ' },
    { value: '#7C3AED', label: 'Tím' },
    { value: '#EA580C', label: 'Cam' },
    { value: '#0284C7', label: 'Xanh dương' },
    { value: '#BE185D', label: 'Hồng đậm' },
    { value: '#374151', label: 'Xám đậm' },
    { value: '#0891B2', label: 'Xanh cyan' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Tên phòng ban không được để trống';
    if (!formData.displayName.trim()) newErrors.displayName = 'Tên hiển thị không được để trống';
    if (!formData.description.trim()) newErrors.description = 'Mô tả không được để trống';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      setFormData({
        name: '',
        displayName: '',
        description: '',
        managerId: '',
        color: '#059669'
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 rounded-lg p-2">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Tạo phòng ban mới</h2>
                <p className="text-green-100 text-sm">Thêm phòng ban mới vào tổ chức</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Department Names */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Tên phòng ban (slug) *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                    errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="information-technology"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                <p className="text-xs text-gray-500">Tên không dấu, không khoảng trắng</p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Tên hiển thị *
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                    errors.displayName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Phòng Công nghệ thông tin"
                />
                {errors.displayName && <p className="text-red-500 text-sm">{errors.displayName}</p>}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <FileText className="w-4 h-4 inline mr-2" />
                Mô tả phòng ban *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                  errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                rows={3}
                placeholder="Mô tả về chức năng, nhiệm vụ chính của phòng ban..."
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>

            {/* Manager */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <User className="w-4 h-4 inline mr-2" />
                Trưởng phòng
              </label>
              <select
                value={formData.managerId}
                onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                <option value="">Chọn trưởng phòng</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.fullName} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Department Color */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Màu sắc phòng ban
              </label>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                {departmentColors.map(color => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: color.value })}
                    className={`w-12 h-12 rounded-lg border-2 transition-all transform hover:scale-110 ${
                      formData.color === color.value 
                        ? 'border-gray-900 shadow-lg' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.label}
                  >
                    {formData.color === color.value && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-3">Xem trước phòng ban:</p>
              <div className="flex items-center space-x-3">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: formData.color }}
                >
                  <Building className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {formData.displayName || 'Tên phòng ban'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formData.description || 'Mô tả phòng ban'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105"
            >
              <Save className="w-5 h-5" />
              <span>Tạo phòng ban</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDepartmentForm;
