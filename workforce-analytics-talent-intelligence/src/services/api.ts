import axios from 'axios';
import { Employee, KPIOverview } from '../types';
import { MOCK_KPIS, MOCK_EMPLOYEES } from '../data/mockData';

const getInitialBaseUrl = (): string => {
  const envUrl =
    typeof import.meta !== "undefined"
      ? (import.meta as any).env?.VITE_API_BASE_URL
      : "";

  return (
    localStorage.getItem("aura_backend_url") ||
    envUrl ||
    "http://127.0.0.1:8000"
  );
};

const apiClient = axios.create({
  baseURL: getInitialBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const getStoredBackendUrl = (): string => {
  return localStorage.getItem('aura_backend_url') || '';
};

export const saveBackendUrl = (url: string): void => {
  const cleanUrl = url.trim();
  if (cleanUrl) {
    localStorage.setItem('aura_backend_url', cleanUrl);
    apiClient.defaults.baseURL = cleanUrl;
  } else {
    localStorage.removeItem('aura_backend_url');
    apiClient.defaults.baseURL = '/api';
  }
};

export const testBackendConnection = async (targetUrl: string): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    const testClient = axios.create({
      baseURL: targetUrl.trim(),
      headers: { 'Content-Type': 'application/json' },
      timeout: 8000,
    });
    // Try health check endpoint or employees endpoint
    const res = await testClient.get('/health').catch(() => testClient.get('/employees')).catch(() => testClient.get('/analytics/kpis'));
    return {
      success: true,
      message: 'Successfully connected to AWS / MongoDB API backend!',
      data: res.data,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message ? `Connection failed: ${err.message}` : 'Failed to reach API endpoint. Please check URL or CORS settings.',
    };
  }
};

const normalizeEmployee = (raw: any): Employee => {
  if (!raw) return raw;
  return {
    id: raw.id || raw.employee_id || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
    name: raw.name || raw.employee_name || (raw.employee_id ? `Employee ${raw.employee_id}` : 'Employee'),
    role: raw.role || raw.job_role || 'Specialist',
    department: raw.department || 'General',
    email: raw.email || `${(raw.employee_id || raw.name || 'employee').toString().toLowerCase().replace(/\s+/g, '.')}@company.com`,
    avatar: raw.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    salary: Number(raw.salary ?? raw.monthly_income ?? (raw.daily_rate ? raw.daily_rate * 25 : 85000)),
    experience: Number(raw.experience ?? raw.total_working_years ?? raw.years_at_company ?? 1),
    gender: raw.gender || 'Not Specified',
    tenure: Number(raw.tenure ?? raw.years_at_company ?? 1),
    performanceScore: Number(raw.performanceScore ?? raw.performance_rating ?? 3),
    promotionEligibility: Boolean(raw.promotionEligibility ?? ((raw.years_since_last_promotion || 0) >= 2)),
    attendance: Number(raw.attendance ?? 95),
    skills: Array.isArray(raw.skills) ? raw.skills : [raw.job_role || 'Analytics', raw.education_field || 'Engineering'],
    projects: Array.isArray(raw.projects) ? raw.projects : ['System Optimization'],
    manager: raw.manager || 'Department Lead',
    lastReviewDate: raw.lastReviewDate || '2026-01-15',
    satisfactionRating: Number(raw.satisfactionRating ?? raw.job_satisfaction ?? raw.environment_satisfaction ?? 4),
    workLifeBalance: Number(raw.workLifeBalance ?? raw.work_life_balance ?? 3),
    overtimeHours: Number(raw.overtimeHours ?? (raw.over_time === 'Yes' ? 10 : 0)),
    location: raw.location || 'HQ',
  };
};

export const fetchEmployees = async (params?: {
  search?: string;
  department?: string;
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<{ employees: Employee[]; total: number; page: number; totalPages: number }> => {
  try {
    const response = await apiClient.get('/employees', { params }).catch(() => apiClient.get('/employees/'));
    const data = response.data;
    if (Array.isArray(data)) {
      const normalizedList = data.map(normalizeEmployee);
      return {
        employees: normalizedList,
        total: normalizedList.length,
        page: 1,
        totalPages: 1,
      };
    }
    const rawEmps = data.employees || [];
    const normalizedList = rawEmps.map(normalizeEmployee);
    if (normalizedList.length === 0) {
      return {
        employees: MOCK_EMPLOYEES,
        total: MOCK_EMPLOYEES.length,
        page: 1,
        totalPages: 1,
      };
    }
    return {
      employees: normalizedList,
      total: data.total ?? normalizedList.length,
      page: data.page || 1,
      totalPages: data.totalPages || 1,
    };
  } catch (err) {
    console.warn('API connection offline or not configured yet, using local mock data:', err);
    return {
      employees: MOCK_EMPLOYEES,
      total: MOCK_EMPLOYEES.length,
      page: 1,
      totalPages: 1,
    };
  }
};

export const fetchEmployeeById = async (id: string): Promise<Employee> => {
  try {
    const response = await apiClient.get(`/employees/${id}`);
    return normalizeEmployee(response.data);
  } catch (err) {
    console.warn(`API error fetching employee ${id}:`, err);
    throw new Error('Employee record not found on connected backend');
  }
};

export const createEmployee = async (data: Partial<Employee>): Promise<Employee> => {
  try {
    const payload = {
      employee_id: data.id || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      department: data.department || 'Engineering',
      job_role: data.role || 'Specialist',
      monthly_income: data.salary || 85000,
      gender: data.gender || 'Male',
      performance_rating: data.performanceScore || 4,
      work_life_balance: data.workLifeBalance || 3,
      job_satisfaction: data.satisfactionRating || 4,
      years_at_company: data.experience || 2,
      ...data,
    };
    const response = await apiClient.post('/employees', payload).catch(() => apiClient.post('/employees/', payload));
    return normalizeEmployee(response.data);
  } catch (err) {
    console.warn('API error creating employee:', err);
    throw new Error('Failed to create employee on backend API');
  }
};

export const updateEmployee = async (id: string, data: Partial<Employee>): Promise<Employee> => {
  try {
    const payload: any = {};
    if (data.department) payload.department = data.department;
    if (data.salary) payload.monthly_income = data.salary;
    if (data.role) payload.job_role = data.role;
    if ((data as any).attrition_status) payload.attrition_status = (data as any).attrition_status;
    
    const response = await apiClient.put(`/employees/${id}`, Object.keys(payload).length > 0 ? payload : data);
    return normalizeEmployee(response.data);
  } catch (err) {
    console.warn(`API error updating employee ${id}:`, err);
    throw new Error('Failed to update employee on backend API');
  }
};

export const deleteEmployee = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await apiClient.delete(`/employees/${id}`);
    return response.data;
  } catch (err) {
    console.warn(`API error deleting employee ${id}:`, err);
    throw new Error('Failed to delete employee on backend API');
  }
};

export const fetchKPIOverview = async (): Promise<KPIOverview> => {
  try {
    const response = await apiClient.get('/analytics/kpis');
    if (response.data && response.data.totalEmployees > 0) {
      return response.data;
    }
    return MOCK_KPIS;
  } catch (err) {
    console.warn('API connection offline or not configured yet:', err);
    return MOCK_KPIS;
  }
};

export const sendChatbotMessage = async (
  message: string,
  history: Array<{ role: "user" | "assistant"; text: string }>
): Promise<string> => {
  try {
    const response = await apiClient.post("/chatbot/", {
      message: message,
    });

    return response.data.reply;
  } catch (err: any) {
    console.error(err);

    return "Unable to connect to the AI assistant.";
  }
};

