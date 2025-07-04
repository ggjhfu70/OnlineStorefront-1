import { 
  User, 
  Role, 
  Department, 
  Team, 
  UserRole, 
  TeamMember,
  UserWithDetails,
  TeamWithDetails,
  DepartmentWithDetails,
  CreateUserRequest,
  UpdateUserRequest,
  CreateTeamRequest,
  CreateDepartmentRequest,
  CreateRoleRequest,
  UserFilters,
  TeamFilters,
  DepartmentFilters,
  UserStats,
  TeamStats,
  DepartmentStats
} from '../types/database';

// Mock data for development
const mockRoles: Role[] = [
  {
    id: 1,
    name: 'admin',
    displayName: 'Quản trị viên',
    description: 'Toàn quyền quản lý hệ thống',
    permissions: ['*'],
    createdAt: new Date('2024-01-01')
  },
  {
    id: 2,
    name: 'manager',
    displayName: 'Quản lý chung',
    description: 'Quản lý toàn bộ hoạt động kinh doanh',
    permissions: ['manage_orders', 'view_reports', 'manage_inventory', 'manage_teams'],
    createdAt: new Date('2024-01-01')
  },
  {
    id: 3,
    name: 'department_head',
    displayName: 'Trưởng phòng',
    description: 'Quản lý một phòng ban cụ thể',
    permissions: ['manage_department', 'view_department_reports', 'manage_department_orders'],
    createdAt: new Date('2024-01-01')
  },
  {
    id: 4,
    name: 'team_leader',
    displayName: 'Trưởng nhóm',
    description: 'Quản lý một nhóm làm việc',
    permissions: ['manage_team', 'view_team_reports', 'manage_team_orders'],
    createdAt: new Date('2024-01-01')
  },
  {
    id: 5,
    name: 'employee',
    displayName: 'Nhân viên',
    description: 'Thực hiện các tác vụ cơ bản',
    permissions: ['create_order', 'view_own_orders', 'update_order_status'],
    createdAt: new Date('2024-01-01')
  },
];

const mockDepartments: Department[] = [
  {
    id: 1,
    name: 'it',
    displayName: 'Công nghệ thông tin',
    description: 'Phòng phát triển và vận hành hệ thống',
    managerId: 1,
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: 2,
    name: 'marketing',
    displayName: 'Marketing',
    description: 'Phòng tiếp thị và quảng cáo',
    managerId: 2,
    isActive: true,
    createdAt: new Date('2024-01-02')
  },
  {
    id: 3,
    name: 'sales',
    displayName: 'Kinh doanh',
    description: 'Phòng bán hàng và chăm sóc khách hàng',
    managerId: 3,
    isActive: true,
    createdAt: new Date('2024-01-03')
  },
  {
    id: 4,
    name: 'hr',
    displayName: 'Nhân sự',
    description: 'Phòng quản lý nguồn nhân lực',
    managerId: 4,
    isActive: true,
    createdAt: new Date('2024-01-04')
  }
];

const mockTeams: Team[] = [
  {
    id: 1,
    name: 'it_admin',
    displayName: 'IT Admin',
    description: 'Nhóm quản trị hệ thống',
    departmentId: 1,
    leaderId: 1,
    isActive: true,
    createdAt: new Date('2024-01-05')
  },
  {
    id: 2,
    name: 'marketing_team',
    displayName: 'Marketing Team',
    description: 'Nhóm marketing chính',
    departmentId: 2,
    leaderId: 2,
    isActive: true,
    createdAt: new Date('2024-01-06')
  },
  {
    id: 3,
    name: 'sales_team_a',
    displayName: 'Sales Team A',
    description: 'Nhóm bán hàng khu vực A',
    departmentId: 3,
    leaderId: 3,
    isActive: true,
    createdAt: new Date('2024-01-07')
  },
  {
    id: 4,
    name: 'hr_team',
    displayName: 'HR Team',
    description: 'Nhóm quản lý nhân sự',
    departmentId: 4,
    leaderId: 4,
    isActive: true,
    createdAt: new Date('2024-01-08')
  }
];

const mockUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@company.com',
    fullName: 'Quản trị viên hệ thống',
    phone: '0901234567',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-06-20')
  },
  {
    id: 2,
    username: 'manager',
    email: 'manager@company.com',
    fullName: 'Nguyễn Văn Quản lý',
    phone: '0907654321',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    isActive: true,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-06-18')
  },
  {
    id: 3,
    username: 'dept_head1',
    email: 'depthead1@company.com',
    fullName: 'Trần Thị Trưởng phòng',
    phone: '0905555555',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    isActive: true,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-06-15')
  },
  {
    id: 4,
    username: 'team_leader1',
    email: 'teamlead1@company.com',
    fullName: 'Lê Văn Trưởng nhóm',
    phone: '0906666666',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    isActive: true,
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-06-12')
  },
  {
    id: 5,
    username: 'employee1',
    email: 'employee1@company.com',
    fullName: 'Phạm Thị Nhân viên',
    phone: '0909876543',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    isActive: true,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-06-10')
  },
  {
    id: 6,
    username: 'employee2',
    email: 'employee2@company.com',
    fullName: 'Hoàng Văn Nhân viên 2',
    phone: '0908765432',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    isActive: false,
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-06-08')
  }
];

const mockUserRoles: UserRole[] = [
  { id: 1, userId: 1, roleId: 1, assignedAt: new Date('2024-01-01') }, // admin -> admin
  { id: 2, userId: 2, roleId: 2, assignedAt: new Date('2024-01-02') }, // manager -> manager
  { id: 3, userId: 3, roleId: 3, assignedAt: new Date('2024-01-03') }, // dept_head1 -> department_head
  { id: 4, userId: 4, roleId: 4, assignedAt: new Date('2024-01-04') }, // team_leader1 -> team_leader
  { id: 5, userId: 5, roleId: 5, assignedAt: new Date('2024-01-05') }, // employee1 -> employee
  { id: 6, userId: 6, roleId: 5, assignedAt: new Date('2024-01-06') }, // employee2 -> employee
];

const mockTeamMembers: TeamMember[] = [
  { id: 1, teamId: 1, userId: 1, joinedAt: new Date('2024-01-10') },
  { id: 2, teamId: 2, userId: 2, joinedAt: new Date('2024-02-15') },
  { id: 3, teamId: 2, userId: 4, joinedAt: new Date('2024-04-10') },
  { id: 4, teamId: 3, userId: 3, joinedAt: new Date('2024-03-20') },
  { id: 5, teamId: 3, userId: 5, joinedAt: new Date('2024-05-05') },
  { id: 6, teamId: 4, userId: 6, joinedAt: new Date('2024-06-01') }
];

class NormalizedUserService {
  private users = [...mockUsers];
  private roles = [...mockRoles];
  private departments = [...mockDepartments];
  private teams = [...mockTeams];
  private userRoles = [...mockUserRoles];
  private teamMembers = [...mockTeamMembers];
  private nextUserId = 7;
  private nextRoleId = 6;
  private nextDepartmentId = 5;
  private nextTeamId = 5;

  // User operations
  async getUsers(filters?: UserFilters): Promise<UserWithDetails[]> {
    await this.simulateDelay();

    let filteredUsers = [...this.users];

    if (filters) {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredUsers = filteredUsers.filter(user =>
          user.fullName.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search) ||
          user.username.toLowerCase().includes(search)
        );
      }

      if (filters.isActive !== undefined) {
        filteredUsers = filteredUsers.filter(user => user.isActive === filters.isActive);
      }

      if (filters.roleIds && filters.roleIds.length > 0) {
        const userIdsWithRoles = this.userRoles
          .filter(ur => filters.roleIds!.includes(ur.roleId))
          .map(ur => ur.userId);
        filteredUsers = filteredUsers.filter(user => userIdsWithRoles.includes(user.id));
      }

      if (filters.teamIds && filters.teamIds.length > 0) {
        const userIdsInTeams = this.teamMembers
          .filter(tm => filters.teamIds!.includes(tm.teamId))
          .map(tm => tm.userId);
        filteredUsers = filteredUsers.filter(user => userIdsInTeams.includes(user.id));
      }

      if (filters.departmentIds && filters.departmentIds.length > 0) {
        const teamsInDepts = this.teams.filter(team => filters.departmentIds!.includes(team.departmentId));
        const userIdsInDepts = this.teamMembers
          .filter(tm => teamsInDepts.some(team => team.id === tm.teamId))
          .map(tm => tm.userId);
        filteredUsers = filteredUsers.filter(user => userIdsInDepts.includes(user.id));
      }
    }

    return filteredUsers.map(user => this.enrichUser(user));
  }

  async getUserById(id: number): Promise<UserWithDetails | null> {
    await this.simulateDelay();
    const user = this.users.find(u => u.id === id);
    return user ? this.enrichUser(user) : null;
  }

  async createUser(userData: CreateUserRequest): Promise<UserWithDetails> {
    await this.simulateDelay();

    const newUser: User = {
      id: this.nextUserId++,
      username: userData.username,
      email: userData.email,
      fullName: userData.fullName,
      phone: userData.phone,
      avatar: userData.avatar,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.users.push(newUser);

    // Assign roles
    userData.roleIds.forEach(roleId => {
      this.userRoles.push({
        id: this.userRoles.length + 1,
        userId: newUser.id,
        roleId,
        assignedAt: new Date()
      });
    });

    // Assign to teams
    if (userData.teamIds) {
      userData.teamIds.forEach(teamId => {
        this.teamMembers.push({
          id: this.teamMembers.length + 1,
          teamId,
          userId: newUser.id,
          joinedAt: new Date()
        });
      });
    }

    return this.enrichUser(newUser);
  }

  async updateUser(id: number, userData: UpdateUserRequest): Promise<UserWithDetails | null> {
    await this.simulateDelay();

    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) return null;

    // Update user basic info
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...userData,
      updatedAt: new Date()
    };

    // Update roles if provided
    if (userData.roleIds) {
      this.userRoles = this.userRoles.filter(ur => ur.userId !== id);
      userData.roleIds.forEach(roleId => {
        this.userRoles.push({
          id: this.userRoles.length + 1,
          userId: id,
          roleId,
          assignedAt: new Date()
        });
      });
    }

    // Update teams if provided
    if (userData.teamIds) {
      this.teamMembers = this.teamMembers.filter(tm => tm.userId !== id);
      userData.teamIds.forEach(teamId => {
        this.teamMembers.push({
          id: this.teamMembers.length + 1,
          teamId,
          userId: id,
          joinedAt: new Date()
        });
      });
    }

    return this.enrichUser(this.users[userIndex]);
  }

  async deleteUser(id: number): Promise<boolean> {
    await this.simulateDelay();

    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) return false;

    // Remove from users
    this.users.splice(userIndex, 1);

    // Remove roles and team memberships
    this.userRoles = this.userRoles.filter(ur => ur.userId !== id);
    this.teamMembers = this.teamMembers.filter(tm => tm.userId !== id);

    return true;
  }

  // Team operations
  async getTeams(filters?: TeamFilters): Promise<TeamWithDetails[]> {
    await this.simulateDelay();

    let filteredTeams = [...this.teams];

    if (filters) {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredTeams = filteredTeams.filter(team =>
          team.name.toLowerCase().includes(search) ||
          team.displayName.toLowerCase().includes(search)
        );
      }

      if (filters.departmentIds && filters.departmentIds.length > 0) {
        filteredTeams = filteredTeams.filter(team => 
          filters.departmentIds!.includes(team.departmentId)
        );
      }

      if (filters.isActive !== undefined) {
        filteredTeams = filteredTeams.filter(team => team.isActive === filters.isActive);
      }
    }

    return filteredTeams.map(team => this.enrichTeam(team));
  }

  async createTeam(teamData: CreateTeamRequest): Promise<TeamWithDetails> {
    await this.simulateDelay();

    const newTeam: Team = {
      id: this.nextTeamId++,
      name: teamData.name,
      displayName: teamData.displayName,
      description: teamData.description,
      departmentId: teamData.departmentId,
      leaderId: teamData.leaderId,
      isActive: true,
      createdAt: new Date()
    };

    this.teams.push(newTeam);
    return this.enrichTeam(newTeam);
  }

  async updateTeam(id: number, teamData: Partial<CreateTeamRequest>): Promise<TeamWithDetails | null> {
    await this.simulateDelay();

    const teamIndex = this.teams.findIndex(t => t.id === id);
    if (teamIndex === -1) return null;

    this.teams[teamIndex] = {
      ...this.teams[teamIndex],
      ...teamData
    };

    return this.enrichTeam(this.teams[teamIndex]);
  }

  async deleteTeam(id: number): Promise<boolean> {
    await this.simulateDelay();

    const teamIndex = this.teams.findIndex(t => t.id === id);
    if (teamIndex === -1) return false;

    // Remove team members
    this.teamMembers = this.teamMembers.filter(tm => tm.teamId !== id);

    // Remove the team
    this.teams.splice(teamIndex, 1);

    return true;
  }

  // Department operations
  async getDepartments(filters?: DepartmentFilters): Promise<DepartmentWithDetails[]> {
    await this.simulateDelay();

    let filteredDepts = [...this.departments];

    if (filters) {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredDepts = filteredDepts.filter(dept =>
          dept.name.toLowerCase().includes(search) ||
          dept.displayName.toLowerCase().includes(search)
        );
      }

      if (filters.isActive !== undefined) {
        filteredDepts = filteredDepts.filter(dept => dept.isActive === filters.isActive);
      }
    }

    return filteredDepts.map(dept => this.enrichDepartment(dept));
  }

  async createDepartment(deptData: CreateDepartmentRequest): Promise<DepartmentWithDetails> {
    await this.simulateDelay();

    const newDepartment: Department = {
      id: this.nextDepartmentId++,
      name: deptData.name,
      displayName: deptData.displayName,
      description: deptData.description,
      managerId: deptData.managerId,
      isActive: true,
      createdAt: new Date()
    };

    this.departments.push(newDepartment);
    return this.enrichDepartment(newDepartment);
  }

  async updateDepartment(id: number, deptData: Partial<CreateDepartmentRequest>): Promise<DepartmentWithDetails | null> {
    await this.simulateDelay();

    const deptIndex = this.departments.findIndex(d => d.id === id);
    if (deptIndex === -1) return null;

    this.departments[deptIndex] = {
      ...this.departments[deptIndex],
      ...deptData
    };

    return this.enrichDepartment(this.departments[deptIndex]);
  }

  async deleteDepartment(id: number): Promise<boolean> {
    await this.simulateDelay();

    const deptIndex = this.departments.findIndex(d => d.id === id);
    if (deptIndex === -1) return false;

    // Check if department has teams
    const hasTeams = this.teams.some(t => t.departmentId === id);
    if (hasTeams) {
      throw new Error('Không thể xóa phòng ban có nhóm làm việc');
    }

    // Remove the department
    this.departments.splice(deptIndex, 1);

    return true;
  }

  // Role operations
  async getRoles(): Promise<Role[]> {
    await this.simulateDelay();
    return [...this.roles];
  }

  // Statistics
  async getUserStats(): Promise<UserStats> {
    await this.simulateDelay();

    const totalUsers = this.users.length;
    const activeUsers = this.users.filter(u => u.isActive).length;
    const inactiveUsers = totalUsers - activeUsers;

    const usersByRole: Record<string, number> = {};
    this.roles.forEach(role => {
      const count = this.userRoles.filter(ur => ur.roleId === role.id).length;
      usersByRole[role.displayName] = count;
    });

    const usersByDepartment: Record<string, number> = {};
    this.departments.forEach(dept => {
      const teamsInDept = this.teams.filter(t => t.departmentId === dept.id);
      const userCount = this.teamMembers.filter(tm => 
        teamsInDept.some(team => team.id === tm.teamId)
      ).length;
      usersByDepartment[dept.displayName] = userCount;
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentJoins = this.users.filter(u => u.createdAt > thirtyDaysAgo).length;

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      usersByRole,
      usersByDepartment,
      recentJoins
    };
  }

  // Helper methods
  private enrichUser(user: User): UserWithDetails {
    const userRoleIds = this.userRoles.filter(ur => ur.userId === user.id).map(ur => ur.roleId);
    const roles = this.roles.filter(r => userRoleIds.includes(r.id));

    const userTeamIds = this.teamMembers.filter(tm => tm.userId === user.id).map(tm => tm.teamId);
    const teams = this.teams
      .filter(t => userTeamIds.includes(t.id))
      .map(team => ({
        ...team,
        department: this.departments.find(d => d.id === team.departmentId)!
      }));

    const primaryRole = roles.find(r => r.name === 'admin') || roles[0];
    const department = teams.length > 0 ? teams[0].department : undefined;

    return {
      ...user,
      roles,
      teams,
      department,
      primaryRole
    };
  }

  private enrichTeam(team: Team): TeamWithDetails {
    const department = this.departments.find(d => d.id === team.departmentId)!;
    const leader = team.leaderId ? this.users.find(u => u.id === team.leaderId) : undefined;

    const memberIds = this.teamMembers.filter(tm => tm.teamId === team.id).map(tm => tm.userId);
    const members = this.users.filter(u => memberIds.includes(u.id));

    return {
      ...team,
      department,
      leader,
      members,
      memberCount: members.length
    };
  }

  private enrichDepartment(dept: Department): DepartmentWithDetails {
    const manager = dept.managerId ? this.users.find(u => u.id === dept.managerId) : undefined;
    const teams = this.teams.filter(t => t.departmentId === dept.id);

    const userCount = this.teamMembers.filter(tm => 
      teams.some(team => team.id === tm.teamId)
    ).length;

    return {
      ...dept,
      manager,
      teams,
      userCount,
      teamCount: teams.length
    };
  }

  private async simulateDelay(): Promise<void> {
    const delay = Math.random() * 300 + 100;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

export const normalizedUserService = new NormalizedUserService();