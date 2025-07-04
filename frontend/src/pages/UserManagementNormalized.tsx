import React, { useState, useEffect } from 'react';
import { Plus, Users, Building, UserCheck, Briefcase, Search, Filter, Grid, List, Eye, Edit, Trash2, User } from 'lucide-react';
import CreateUserForm from '../components/UserManagement/CreateUserForm';
import CreateTeamForm from '../components/UserManagement/CreateTeamForm';
import CreateDepartmentForm from '../components/UserManagement/CreateDepartmentForm';
import { useUserManagement, useUserFilters } from '../hooks/useUserManagement';
import { 
  UserWithDetails, 
  CreateUserRequest, 
  UserFilters as IUserFilters
} from '../types/database';

const UserManagementNormalized: React.FC = () => {
  // Custom hooks
  const {
    users,
    filteredUsers,
    teams,
    departments,
    roles,
    userStats,
    loading,
    error,
    loadData,
    createUser,
    updateUser,
    deleteUser,
    createTeam,
    applyFilters,
    clearError
  } = useUserManagement();

  const {
    searchTerm,
    updateSearch,
    clearFilters
  } = useUserFilters(applyFilters);

  // Local state for UI
  const [activeTab, setActiveTab] = useState<'users' | 'teams' | 'departments'>('users');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Form states
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [isTeamFormOpen, setIsTeamFormOpen] = useState(false);
  const [isDepartmentFormOpen, setIsDepartmentFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithDetails | undefined>();
  const [viewingUser, setViewingUser] = useState<UserWithDetails | undefined>();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateUser = async (userData: CreateUserRequest) => {
    try {
      await createUser(userData);
      setIsUserFormOpen(false);
      setEditingUser(undefined);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleUpdateUser = async (userData: CreateUserRequest) => {
    if (!editingUser) return;

    try {
      await updateUser(editingUser.id, userData);
      setIsUserFormOpen(false);
      setEditingUser(undefined);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
      try {
        await deleteUser(userId);
      } catch (error) {
        // Error handled by hook
      }
    }
  };

  const handleCreateTeam = async (teamData: any) => {
    try {
      await createTeam(teamData);
      setIsTeamFormOpen(false);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleCreateDepartment = async (departmentData: any) => {
    try {
      // Note: Create department method needs to be implemented in service
      console.log('Create department:', departmentData);
      setIsDepartmentFormOpen(false);
    } catch (error) {
      console.error('Error creating department:', error);
    }
  };

  const UserCard = ({ user }: { user: UserWithDetails }) => (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div className="p-5">
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative flex-shrink-0">
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=3B82F6&color=fff`}
              alt={user.fullName}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
            />
            <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
              user.isActive ? 'bg-emerald-500' : 'bg-red-500'
            }`}></div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 truncate">{user.fullName}</h3>
            <p className="text-sm text-gray-600 truncate">@{user.username}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => {
                setViewingUser(user);
                setIsViewModalOpen(true);
              }}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Xem chi tiết"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setEditingUser(user);
                setIsUserFormOpen(true);
              }}
              className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
              title="Chỉnh sửa"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteUser(user.id)}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Xóa tài khoản"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {user.roles?.map((role: any) => {
              const roleColors = {
                admin: 'bg-red-100 text-red-700',
                manager: 'bg-blue-100 text-blue-700', 
                employee: 'bg-green-100 text-green-700'
              };
              return (
                <span
                  key={role.id}
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${roleColors[role.name as keyof typeof roleColors] || 'bg-gray-100 text-gray-700'}`}
                >
                  {role.displayName}
                </span>
              );
            })}
          </div>

          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex items-center">
              <Users className="w-3.5 h-3.5 mr-2 text-gray-400" />
              <span className="truncate">
                {user.teams?.length > 0 
                  ? user.teams.map((t: any) => t.displayName).join(', ')
                  : 'Chưa thuộc nhóm'
                }
              </span>
            </div>
            {user.department && (
              <div className="flex items-center">
                <Building className="w-3.5 h-3.5 mr-2 text-gray-400" />
                <span className="truncate">{user.department?.displayName}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${
          user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
        }`}>
          {user.isActive ? 'Hoạt động' : 'Tạm khóa'}
        </span>
        <span className="text-xs text-gray-500">
          {new Date(user.createdAt).toLocaleDateString('vi-VN')}
        </span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error notification
  const ErrorNotification = () => {
    if (!error) return null;

    return (
      <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50">
        <div className="flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={clearError}
            className="ml-4 text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ErrorNotification />
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý tài khoản</h1>
              <p className="text-gray-600 mt-1">Quản lý tài khoản, nhóm và phòng ban trong tổ chức</p>
            </div>
            <div className="flex space-x-3">
              {activeTab === 'users' && (
                <button
                  onClick={() => setIsUserFormOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm tài khoản</span>
                </button>
              )}
              {activeTab === 'teams' && (
                <button
                  onClick={() => setIsTeamFormOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm nhóm</span>
                </button>
              )}
              {activeTab === 'departments' && (
                <button
                  onClick={() => setIsDepartmentFormOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm phòng ban</span>
                </button>
              )}
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
              <div className="flex items-center">
                <Users className="w-8 h-8 opacity-80" />
                <div className="ml-3">
                  <p className="text-blue-100 text-sm">Tổng tài khoản</p>
                  <p className="text-2xl font-bold">{userStats.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
              <div className="flex items-center">
                <UserCheck className="w-8 h-8 opacity-80" />
                <div className="ml-3">
                  <p className="text-green-100 text-sm">Đang hoạt động</p>
                  <p className="text-2xl font-bold">{userStats.activeUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
              <div className="flex items-center">
                <Briefcase className="w-8 h-8 opacity-80" />
                <div className="ml-3">
                  <p className="text-purple-100 text-sm">Số nhóm</p>
                  <p className="text-2xl font-bold">{teams.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-lg text-white">
              <div className="flex items-center">
                <Building className="w-8 h-8 opacity-80" />
                <div className="ml-3">
                  <p className="text-orange-100 text-sm">Phòng ban</p>
                  <p className="text-2xl font-bold">{departments.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('users')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="w-5 h-5 inline mr-2" />
                Tài khoản ({filteredUsers.length})
              </button>
              <button
                onClick={() => setActiveTab('teams')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'teams'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Briefcase className="w-5 h-5 inline mr-2" />
                Nhóm ({teams.length})
              </button>
              <button
                onClick={() => setActiveTab('departments')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'departments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Building className="w-5 h-5 inline mr-2" />
                Phòng ban ({departments.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm tài khoản..."
                  value={searchTerm}
                  onChange={(e) => updateSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                <span>Bộ lọc</span>
              </button>
            </div>

            {activeTab === 'users' && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Hiển thị:</span>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'users' && (
          <div>
            {filteredUsers.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có tài khoản nào</h3>
                <p className="text-gray-500 mb-6">Bắt đầu bằng cách tạo tài khoản đầu tiên cho tổ chức của bạn.</p>
                <button
                  onClick={() => setIsUserFormOpen(true)}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Tạo tài khoản đầu tiên</span>
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "space-y-3"
              }>
                {filteredUsers.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'teams' && (
          <div>
            {teams.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có nhóm nào</h3>
                <p className="text-gray-500 mb-6">Tạo nhóm làm việc đầu tiên cho tổ chức của bạn.</p>
                <button
                  onClick={() => setIsTeamFormOpen(true)}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Tạo nhóm đầu tiên</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map((team) => (
                  <div key={team.id} className="bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-200 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Briefcase className="w-6 h-6 text-purple-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">{team.displayName}</h3>
                          <p className="text-sm text-gray-600 truncate">{team.name}</p>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-4">{team.description}</p>

                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Building className="w-4 h-4 mr-2 text-gray-400" />
                          <span>Phòng ban: {departments.find(d => d.id === team.departmentId)?.displayName || 'Chưa xác định'}</span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="w-4 h-4 mr-2 text-gray-400" />
                          <span>Thành viên: {team.memberCount || 0}</span>
                        </div>

                        {team.leader && (
                          <div className="flex items-center text-sm text-gray-600">
                            <User className="w-4 h-4 mr-2 text-gray-400" />
                            <span>Trưởng nhóm: {team.leader.fullName}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${
                        team.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {team.isActive ? 'Hoạt động' : 'Tạm dừng'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(team.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'departments' && (
          <div>
            {departments.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có phòng ban nào</h3>
                <p className="text-gray-500 mb-6">Tạo phòng ban đầu tiên cho tổ chức của bạn.</p>
                <button
                  onClick={() => setIsDepartmentFormOpen(true)}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Tạo phòng ban đầu tiên</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map((department) => (
                  <div key={department.id} className="bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-200 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <Building className="w-6 h-6 text-green-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">{department.displayName}</h3>
                          <p className="text-sm text-gray-600 truncate">{department.name}</p>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-4">{department.description}</p>

                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="w-4 h-4 mr-2 text-gray-400" />
                          <span>Nhân viên: {department.userCount || 0}</span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                          <span>Nhóm: {department.teamCount || 0}</span>
                        </div>

                        {department.manager && (
                          <div className="flex items-center text-sm text-gray-600">
                            <User className="w-4 h-4 mr-2 text-gray-400" />
                            <span>Trưởng phòng: {department.manager.fullName}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${
                        department.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {department.isActive ? 'Hoạt động' : 'Tạm dừng'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(department.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Forms */}
        <CreateUserForm
          isOpen={isUserFormOpen}
          onClose={() => {
            setIsUserFormOpen(false);
            setEditingUser(undefined);
          }}
          onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
          teams={teams}
          departments={departments}
          editingUser={editingUser}
        />

        <CreateTeamForm
          isOpen={isTeamFormOpen}
          onClose={() => setIsTeamFormOpen(false)}
          onSubmit={handleCreateTeam}
          departments={departments}
          users={users}
        />

        <CreateDepartmentForm
          isOpen={isDepartmentFormOpen}
          onClose={() => setIsDepartmentFormOpen(false)}
          onSubmit={handleCreateDepartment}
          users={users}
        />

        {/* View User Modal */}
        {viewingUser && (
          <div className={`fixed inset-0 z-50 overflow-y-auto ${isViewModalOpen ? '' : 'hidden'}`}>
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setIsViewModalOpen(false)}></div>

              <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Chi tiết tài khoản</h3>
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  {/* User Avatar and Basic Info */}
                  <div className="flex items-center space-x-4">
                    <img
                      src={viewingUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(viewingUser.fullName)}&background=3B82F6&color=fff`}
                      alt={viewingUser.fullName}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    />
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900">{viewingUser.fullName}</h4>
                      <p className="text-gray-600">@{viewingUser.username}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${
                        viewingUser.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {viewingUser.isActive ? 'Hoạt động' : 'Tạm khóa'}
                      </span>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-gray-900">{viewingUser.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                      <p className="text-gray-900">{viewingUser.phone || 'Chưa cập nhật'}</p>
                    </div>
                  </div>

                  {/* Roles */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vai trò</label>
                    <div className="flex flex-wrap gap-2">
                      {viewingUser.roles?.map((role: any) => {
                        const roleColors = {
                          admin: 'bg-red-100 text-red-700',
                          manager: 'bg-blue-100 text-blue-700',
                          department_head: 'bg-purple-100 text-purple-700',
                          team_leader: 'bg-orange-100 text-orange-700',
                          employee: 'bg-green-100 text-green-700'
                        };
                        return (
                          <span
                            key={role.id}
                            className={`inline-flex px-3 py-1 text-sm font-medium rounded-md ${roleColors[role.name as keyof typeof roleColors] || 'bg-gray-100 text-gray-700'}`}
                          >
                            {role.displayName}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Department */}
                  {viewingUser.department && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phòng ban</label>
                      <p className="text-gray-900">{viewingUser.department.displayName}</p>
                      <p className="text-sm text-gray-600">{viewingUser.department.description}</p>
                    </div>
                  )}

                  {/* Teams */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nhóm</label>
                    {viewingUser.teams && viewingUser.teams.length > 0 ? (
                      <div className="space-y-2">
                        {viewingUser.teams.map((team: any) => (
                          <div key={team.id} className="bg-gray-50 p-3 rounded-lg">
                            <p className="font-medium text-gray-900">{team.displayName}</p>
                            <p className="text-sm text-gray-600">{team.description}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">Chưa thuộc nhóm nào</p>
                    )}
                  </div>

                  {/* Timestamps */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ngày tạo</label>
                      <p className="text-gray-900">{new Date(viewingUser.createdAt).toLocaleDateString('vi-VN')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cập nhật cuối</label>
                      <p className="text-gray-900">{new Date(viewingUser.updatedAt).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
                  <button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      setEditingUser(viewingUser);
                      setIsUserFormOpen(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagementNormalized;