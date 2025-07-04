
import { BaseHybridService } from './baseService';
import { centralizedMockData } from '../data/centralizedMockData';
import type { Department, Team } from '../types';

export interface DepartmentFilter {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  managerId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeamFilter {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  departmentId: string;
  leaderId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Transform centralized mock data to match interface
const transformDepartments = (): DepartmentFilter[] => {
  return centralizedMockData.departments.map(dept => ({
    id: dept.id,
    name: dept.name.toLowerCase().replace(/\s+/g, '_'),
    displayName: dept.name,
    description: dept.description,
    managerId: dept.managerId,
    isActive: dept.active,
    createdAt: dept.createdAt,
    updatedAt: dept.updatedAt,
  }));
};

const transformTeams = (): TeamFilter[] => {
  return centralizedMockData.teams.map(team => ({
    id: team.id,
    name: team.name.toLowerCase().replace(/\s+/g, '_'),
    displayName: team.name,
    description: team.description,
    departmentId: team.departmentId,
    leaderId: team.leaderId,
    isActive: team.active,
    createdAt: team.createdAt,
    updatedAt: team.updatedAt,
  }));
};

class DepartmentTeamService extends BaseHybridService {
  async getDepartments(): Promise<DepartmentFilter[]> {
    const mockFallback = async () => {
      await new Promise(resolve => setTimeout(resolve, this.getMockDelay()));
      return transformDepartments().filter(dept => dept.isActive);
    };

    try {
      return await this.apiRequest<DepartmentFilter[]>(
        '/departments',
        { method: 'GET' },
        mockFallback
      );
    } catch (error) {
      return await mockFallback();
    }
  }

  async getTeams(departmentId?: string): Promise<TeamFilter[]> {
    const mockFallback = async () => {
      await new Promise(resolve => setTimeout(resolve, this.getMockDelay()));
      let teams = transformTeams().filter(team => team.isActive);
      
      if (departmentId) {
        teams = teams.filter(team => team.departmentId === departmentId);
      }
      
      return teams;
    };

    try {
      const url = departmentId ? `/teams?departmentId=${departmentId}` : '/teams';
      return await this.apiRequest<TeamFilter[]>(
        url,
        { method: 'GET' },
        mockFallback
      );
    } catch (error) {
      return await mockFallback();
    }
  }

  async getTeamsByDepartment(): Promise<Record<string, TeamFilter[]>> {
    const teams = await this.getTeams();
    const teamsByDept: Record<string, TeamFilter[]> = {};
    
    teams.forEach(team => {
      if (!teamsByDept[team.departmentId]) {
        teamsByDept[team.departmentId] = [];
      }
      teamsByDept[team.departmentId].push(team);
    });
    
    return teamsByDept;
  }
}

export const departmentTeamService = new DepartmentTeamService();
