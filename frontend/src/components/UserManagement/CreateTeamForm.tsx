
import React, { useState } from 'react';
import { X, Users, Building, User, Save, FileText } from 'lucide-react';

interface CreateTeamFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (teamData: any) => void;
  departments: any[];
  users: any[];
}

const CreateTeamForm: React.FC<CreateTeamFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  departments,
  users
}) => {
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    departmentId: '',
    leaderId: '',
    color: '#3B82F6'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const teamColors = [
    { value: '#3B82F6', label: 'Xanh dương' },
    { value: '#10B981', label: 'Xanh lá' },
    { value: '#F59E0B', label: 'Cam' },
    { value: '#EF4444', label: 'Đỏ' },
    { value: '#8B5CF6', label: 'Tím' },
    { value: '#EC4899', label: 'Hồng' },
    { value: '#6B7280', label: 'Xám' },
    { value: '#14B8A6', label: 'Xanh ngọc' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Tên nhóm không được để trống';
    if (!formData.displayName.trim()) newErrors.displayName = 'Tên hiển thị không được để trống';
    if (!formData.departmentId) newErrors.departmentId = 'Vui lòng chọn phòng ban';

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
        departmentId: '',
        leaderId: '',
        color: '#3B82F6'
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 rounded-lg p-2">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Tạo nhóm mới</h2>
                <p className="text-purple-100 text-sm">Tạo nhóm làm việc mới cho dự án</p>
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
            {/* Team Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Tên nhóm (slug) *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                    errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="team-development"
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                    errors.displayName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Nhóm Phát triển"
                />
                {errors.displayName && <p className="text-red-500 text-sm">{errors.displayName}</p>}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <FileText className="w-4 h-4 inline mr-2" />
                Mô tả nhóm
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                rows={3}
                placeholder="Mô tả về mục đích và chức năng của nhóm..."
              />
            </div>

            {/* Department and Leader */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <Building className="w-4 h-4 inline mr-2" />
                  Phòng ban *
                </label>
                <select
                  value={formData.departmentId}
                  onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                    errors.departmentId ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Chọn phòng ban</option>
                  <option value="1">Công nghệ thông tin</option>
                  <option value="2">Marketing</option>
                  <option value="3">Kinh doanh</option>
                  <option value="4">Nhân sự</option>
                  <option value="5">Tài chính</option>
                </select>
                {errors.departmentId && <p className="text-red-500 text-sm">{errors.departmentId}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <User className="w-4 h-4 inline mr-2" />
                  Trưởng nhóm
                </label>
                <select
                  value={formData.leaderId}
                  onChange={(e) => setFormData({ ...formData, leaderId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="">Chọn trưởng nhóm</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.fullName} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Team Color */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Màu sắc nhóm
              </label>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                {teamColors.map(color => (
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
              <p className="text-sm text-gray-600 mb-3">Xem trước nhóm:</p>
              <div className="flex items-center space-x-3">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: formData.color }}
                >
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {formData.displayName || 'Tên nhóm'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formData.description || 'Mô tả nhóm'}
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
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-105"
            >
              <Save className="w-5 h-5" />
              <span>Tạo nhóm</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeamForm;
