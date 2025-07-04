// Database schema types for normalized user management

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: number;
  name: 'admin' | 'manager' | 'department_head' | 'team_leader' | 'employee';
  displayName: string;
  description?: string;
  permissions: string[];
  createdAt: Date;
}

export interface Department {
  id: number;
  name: string;
  displayName: string;
  description?: string;
  managerId?: number;
  isActive: boolean;
  createdAt: Date;
}

export interface Team {
  id: number;
  name: string;
  displayName: string;
  description?: string;
  departmentId: number;
  leaderId?: number;
  isActive: boolean;
  createdAt: Date;
}

export interface UserRole {
  id: number;
  userId: number;
  roleId: number;
  assignedAt: Date;
  assignedBy?: number;
}

export interface TeamMember {
  id: number;
  teamId: number;
  userId: number;
  joinedAt: Date;
  addedBy?: number;
}

// Enhanced types for UI
export interface UserWithDetails extends User {
  roles: Role[];
  teams: (Team & { department: Department })[];
  department?: Department;
  primaryRole?: Role;
}

export interface TeamWithDetails extends Team {
  department: Department;
  leader?: User;
  members: User[];
  memberCount: number;
}

export interface DepartmentWithDetails extends Department {
  manager?: User;
  teams: Team[];
  userCount: number;
  teamCount: number;
}

// Request types
export interface CreateUserRequest {
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  roleIds: number[];
  teamIds?: number[];
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  fullName?: string;
  phone?: string;
  avatar?: string;
  isActive?: boolean;
  roleIds?: number[];
  teamIds?: number[];
}

export interface CreateTeamRequest {
  name: string;
  displayName: string;
  description?: string;
  departmentId: number;
  leaderId?: number;
}

export interface CreateDepartmentRequest {
  name: string;
  displayName: string;
  description: string;
  managerId?: number;
}

export interface CreateDepartmentRequest {
  name: string;
  displayName: string;
  description?: string;
  managerId?: number;
}

export interface CreateDepartmentRequest {
  name: string;
  displayName: string;
  description?: string;
  managerId?: number;
}

export interface CreateRoleRequest {
  name: string;
  displayName: string;
  description?: string;
  permissions: string[];
}

// Filter types
export interface UserFilters {
  search?: string;
  roleIds?: number[];
  departmentIds?: number[];
  teamIds?: number[];
  isActive?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
}

export interface TeamFilters {
  search?: string;
  departmentIds?: number[];
  isActive?: boolean;
}

export interface DepartmentFilters {
  search?: string;
  isActive?: boolean;
}

// Statistics types
export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  usersByRole: Record<string, number>;
  usersByDepartment: Record<string, number>;
  recentJoins: number;
}

export interface TeamStats {
  totalTeams: number;
  activeTeams: number;
  teamsByDepartment: Record<string, number>;
  averageTeamSize: number;
  largestTeam: number;
}

export interface DepartmentStats {
  totalDepartments: number;
  activeDepartments: number;
  departmentSizes: Record<string, number>;
}