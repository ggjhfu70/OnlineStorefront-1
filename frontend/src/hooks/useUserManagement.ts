import { useState, useEffect } from 'react';
import { normalizedUserService } from '../services/normalizedUserService';
import { 
  UserWithDetails, 
  TeamWithDetails,
  DepartmentWithDetails,
  Role,
  CreateUserRequest, 
  UpdateUserRequest,
  CreateTeamRequest,
  CreateDepartmentRequest,
  UserFilters,
  UserStats
} from '../types/database';

export const useUserManagement = () => {
  const [users, setUsers] = useState<UserWithDetails[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithDetails[]>([]);
  const [teams, setTeams] = useState<TeamWithDetails[]>([]);
  const [departments, setDepartments] = useState<DepartmentWithDetails[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    usersByRole: {},
    usersByDepartment: {},
    recentJoins: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);
  const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

  // Load initial data with caching
  const loadData = async (force = false) => {
    // Use cache if data is fresh and not forced
    if (!force && users.length > 0 && (Date.now() - lastFetch) < CACHE_TIME) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [usersData, teamsData, departmentsData, rolesData, statsData] = await Promise.all([
        normalizedUserService.getUsers(),
        normalizedUserService.getTeams(),
        normalizedUserService.getDepartments(),
        normalizedUserService.getRoles(),
        normalizedUserService.getUserStats()
      ]);

      setUsers(usersData);
      setTeams(teamsData);
      setDepartments(departmentsData);
      setRoles(rolesData);
      setUserStats(statsData);
      setFilteredUsers(usersData);
      setLastFetch(Date.now());
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  // User CRUD operations
  const createUser = async (userData: CreateUserRequest) => {
    try {
      setLoading(true);
      const newUser = await normalizedUserService.createUser(userData);
      setUsers(prev => [...prev, newUser]);
      setFilteredUsers(prev => [...prev, newUser]);
      await refreshStats();
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Có lỗi xảy ra khi tạo tài khoản');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: number, userData: CreateUserRequest) => {
    try {
      setLoading(true);
      const updatedUser = await normalizedUserService.updateUser(id, userData);
      if (updatedUser) {
        setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
        setFilteredUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
        await refreshStats();
        return updatedUser;
      }
      throw new Error('User not found');
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Có lỗi xảy ra khi cập nhật tài khoản');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: number) => {
    try {
      setLoading(true);
      const success = await normalizedUserService.deleteUser(id);
      if (success) {
        setUsers(prev => prev.filter(user => user.id !== id));
        setFilteredUsers(prev => prev.filter(user => user.id !== id));
        await refreshStats();
        return true;
      }
      throw new Error('Failed to delete user');
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Có lỗi xảy ra khi xóa tài khoản');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Team operations
  const createTeam = async (teamData: CreateTeamRequest) => {
    try {
      setLoading(true);
      const newTeam = await normalizedUserService.createTeam(teamData);
      setTeams(prev => [...prev, newTeam]);
      return newTeam;
    } catch (error) {
      console.error('Error creating team:', error);
      setError('Có lỗi xảy ra khi tạo nhóm');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateTeam = async (id: number, teamData: Partial<CreateTeamRequest>) => {
    try {
      setLoading(true);
      const updatedTeam = await normalizedUserService.updateTeam(id, teamData);
      if (updatedTeam) {
        setTeams(prev => prev.map(team => team.id === id ? updatedTeam : team));
        return updatedTeam;
      }
      throw new Error('Team not found');
    } catch (error) {
      console.error('Error updating team:', error);
      setError('Có lỗi xảy ra khi cập nhật nhóm');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteTeam = async (id: number) => {
    try {
      setLoading(true);
      const success = await normalizedUserService.deleteTeam(id);
      if (success) {
        setTeams(prev => prev.filter(team => team.id !== id));
        return true;
      }
      throw new Error('Failed to delete team');
    } catch (error) {
      console.error('Error deleting team:', error);
      setError('Có lỗi xảy ra khi xóa nhóm');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Department operations
  const createDepartment = async (deptData: CreateDepartmentRequest) => {
    try {
      setLoading(true);
      const newDept = await normalizedUserService.createDepartment(deptData);
      setDepartments(prev => [...prev, newDept]);
      return newDept;
    } catch (error) {
      console.error('Error creating department:', error);
      setError('Có lỗi xảy ra khi tạo phòng ban');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateDepartment = async (id: number, deptData: Partial<CreateDepartmentRequest>) => {
    try {
      setLoading(true);
      const updatedDept = await normalizedUserService.updateDepartment(id, deptData);
      if (updatedDept) {
        setDepartments(prev => prev.map(dept => dept.id === id ? updatedDept : dept));
        return updatedDept;
      }
      throw new Error('Department not found');
    } catch (error) {
      console.error('Error updating department:', error);
      setError('Có lỗi xảy ra khi cập nhật phòng ban');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteDepartment = async (id: number) => {
    try {
      setLoading(true);
      const success = await normalizedUserService.deleteDepartment(id);
      if (success) {
        setDepartments(prev => prev.filter(dept => dept.id !== id));
        return true;
      }
      throw new Error('Failed to delete department');
    } catch (error) {
      console.error('Error deleting department:', error);
      setError('Có lỗi xảy ra khi xóa phòng ban');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Filtering
  const applyFilters = async (filters: UserFilters) => {
    try {
      setLoading(true);
      const filteredData = await normalizedUserService.getUsers(filters);
      setFilteredUsers(filteredData);
    } catch (error) {
      console.error('Error applying filters:', error);
      setError('Có lỗi xảy ra khi lọc dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = async () => {
    try {
      const statsData = await normalizedUserService.getUserStats();
      setUserStats(statsData);
    } catch (error) {
      console.error('Error refreshing stats:', error);
    }
  };

  const clearError = () => setError(null);

  return {
    // State
    users,
    filteredUsers,
    teams,
    departments,
    roles,
    userStats,
    loading,
    error,

    // Actions
    loadData,
    createUser,
    updateUser,
    deleteUser,
    createTeam,
    updateTeam,
    deleteTeam,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    applyFilters,
    refreshStats,
    clearError
  };
};

export const useUserFilters = (onFilterChange: (filters: UserFilters) => void) => {
  const [filters, setFilters] = useState<UserFilters>({});
  const [searchTerm, setSearchTerm] = useState('');

  const updateFilters = (newFilters: Partial<UserFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const updateSearch = (search: string) => {
    setSearchTerm(search);
    const updatedFilters = { ...filters, search };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
    onFilterChange({});
  };

  return {
    filters,
    searchTerm,
    updateFilters,
    updateSearch,
    clearFilters
  };
};