import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Building, Users, Save, Eye, EyeOff } from 'lucide-react';
import { CreateUserRequest, UserWithDetails, TeamWithDetails, DepartmentWithDetails } from '../../types/database';

interface CreateUserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: CreateUserRequest) => void;
  teams: TeamWithDetails[];
  departments: DepartmentWithDetails[];
  editingUser?: UserWithDetails;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  teams,
  departments,
  editingUser,
}) => {
  const [formData, setFormData] = useState<CreateUserRequest>({
    username: '',
    email: '',
    fullName: '',
    phone: '',
    avatar: '',
    roleIds: [],
    teamIds: []
  });

  const [selectedRole, setSelectedRole] = useState<string>('employee');
  const [selectedTeamIds, setSelectedTeamIds] = useState<number[]>([]);

  // Initialize form data when editing
  useEffect(() => {
    if (editingUser) {
      const primaryRoleName = editingUser.roles?.[0]?.name || 'employee';
      const teamIds = editingUser.teams?.map(t => t.id) || [];
      
      setFormData({
        username: editingUser.username,
        email: editingUser.email,
        fullName: editingUser.fullName,
        phone: editingUser.phone || '',
        avatar: editingUser.avatar || '',
        roleIds: editingUser.roles?.map(r => r.id) || [],
        teamIds: teamIds
      });
      
      setSelectedRole(primaryRoleName);
      setSelectedTeamIds(teamIds);
    } else {
      setFormData({
        username: '',
        email: '',
        fullName: '',
        phone: '',
        avatar: '',
        roleIds: [],
        teamIds: []
      });
      setSelectedRole('employee');
      setSelectedTeamIds([]);
    }
  }, [editingUser, isOpen]);

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const roles = [
    { value: 'admin', label: 'Quản trị viên', color: 'bg-red-100 text-red-800', id: 1 },
    { value: 'manager', label: 'Quản lý', color: 'bg-blue-100 text-blue-800', id: 2 },
    { value: 'employee', label: 'Nhân viên', color: 'bg-green-100 text-green-800', id: 3 }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) newErrors.username = 'Tên đăng nhập không được để trống';
    if (!formData.email.trim()) newErrors.email = 'Email không được để trống';
    if (!formData.fullName.trim()) newErrors.fullName = 'Họ tên không được để trống';
    if (!editingUser && (!formData.password || formData.password.length < 6)) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const selectedRoleObj = roles.find(r => r.value === selectedRole);
      const submitData: CreateUserRequest = {
        ...formData,
        roleIds: selectedRoleObj ? [selectedRoleObj.id] : [3], // default to employee
        teamIds: selectedTeamIds
      };
      
      onSubmit(submitData);
      
      if (!editingUser) {
        setFormData({
          username: '',
          email: '',
          fullName: '',
          phone: '',
          avatar: '',
          roleIds: [],
          teamIds: []
        });
        setSelectedRole('employee');
        setSelectedTeamIds([]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 rounded-lg p-2">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {editingUser ? 'Sửa tài khoản' : 'Tạo tài khoản mới'}
                </h2>
                <p className="text-blue-100 text-sm">
                  {editingUser ? 'Cập nhật thông tin thành viên' : 'Thêm thành viên mới vào hệ thống'}
                </p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <User className="w-4 h-4 inline mr-2" />
                Tên đăng nhập *
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.username ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Nhập tên đăng nhập"
              />
              {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <Mail className="w-4 h-4 inline mr-2" />
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Nhập địa chỉ email"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Họ và tên *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Nhập họ và tên"
              />
              {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Mật khẩu {editingUser ? '(để trống nếu không đổi)' : '*'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password || ''}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder={editingUser ? "Để trống nếu không thay đổi" : "Nhập mật khẩu"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <Phone className="w-4 h-4 inline mr-2" />
                Số điện thoại
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Nhập số điện thoại"
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Vai trò *
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {roles.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Teams - Multiple selection */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                <Users className="w-4 h-4 inline mr-2" />
                Nhóm làm việc
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
                {teams.map(team => (
                  <label key={team.id} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedTeamIds.includes(team.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTeamIds([...selectedTeamIds, team.id]);
                        } else {
                          setSelectedTeamIds(selectedTeamIds.filter(id => id !== team.id));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="truncate">
                      {team.displayName}
                      <span className="text-gray-500 text-xs ml-1">
                        ({team.department.displayName})
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-2">Vai trò được chọn:</p>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  roles.find(r => r.value === selectedRole)?.color || 'bg-gray-100 text-gray-800'
                }`}>
                  {roles.find(r => r.value === selectedRole)?.label || 'Chưa chọn'}
                </span>
              </div>
              
              {selectedTeamIds.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Nhóm được chọn:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTeamIds.map(teamId => {
                      const team = teams.find(t => t.id === teamId);
                      return team ? (
                        <span key={teamId} className="inline-flex px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                          {team.displayName}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
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
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105"
            >
              <Save className="w-5 h-5" />
              <span>{editingUser ? 'Cập nhật' : 'Tạo tài khoản'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserForm;