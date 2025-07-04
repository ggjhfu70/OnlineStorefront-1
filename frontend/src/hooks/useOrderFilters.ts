import { useState, useEffect } from 'react';
import { serviceFactory } from '../services/serviceFactory';
import type { DepartmentFilter, TeamFilter } from '../services/departmentTeamService';
import { OrderFilters } from '../services/orderStatusService';

export const useOrderFilters = () => {
  const [departments, setDepartments] = useState<DepartmentFilter[]>([]);
  const [teams, setTeams] = useState<TeamFilter[]>([]);
  const [filters, setFilters] = useState<OrderFilters>({
    search: '',
    status: 'all',
    startDate: '',
    endDate: '',
    departmentIds: [],
    teamIds: [],
    salesPersonIds: [],
    minAmount: undefined,
    maxAmount: undefined,
  });

  useEffect(() => {
    const loadDepartmentsAndTeams = async () => {
      try {
        const departmentTeamService = serviceFactory.getService('departmentTeam');
        const [depts, allTeams] = await Promise.all([
          departmentTeamService.getDepartments(),
          departmentTeamService.getTeams()
        ]);

        setDepartments(depts);
        setTeams(allTeams);
      } catch (error) {
        console.error('Failed to load departments and teams:', error);
      }
    };

    loadDepartmentsAndTeams();
  }, []);

  const updateFilter = (key: keyof OrderFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateFilters = (newFilters: Partial<OrderFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      startDate: '',
      endDate: '',
      departmentIds: [],
      teamIds: [],
      salesPersonIds: [],
      minAmount: undefined,
      maxAmount: undefined,
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;

    if (filters.search) count++;
    if (filters.status && filters.status !== 'all') count++;
    if (filters.startDate || filters.endDate) count++;
    if (filters.departmentIds && filters.departmentIds.length > 0) count++;
    if (filters.teamIds && filters.teamIds.length > 0) count++;
    if (filters.salesPersonIds && filters.salesPersonIds.length > 0) count++;
    if (filters.minAmount !== undefined || filters.maxAmount !== undefined) count++;

    return count;
  };

  const getFilteredTeams = (departmentIds: string[]) => {
    if (departmentIds.length === 0) return teams;
    return teams.filter(team => departmentIds.includes(team.departmentId));
  };

  return {
    departments,
    teams,
    filters,
    updateFilter,
    updateFilters,
    clearFilters,
    getActiveFiltersCount,
    getFilteredTeams,
  };
};