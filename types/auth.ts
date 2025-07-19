export type UserRole = 'Admin' | 'Manager' | 'Agronomist' | 'Accountant';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Permission {
  module: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'export';
  allowed: boolean;
}

// Role-based permissions as specified in PRD
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  Admin: [
    { module: '*', action: 'create', allowed: true },
    { module: '*', action: 'read', allowed: true },
    { module: '*', action: 'update', allowed: true },
    { module: '*', action: 'delete', allowed: true },
    { module: '*', action: 'export', allowed: true },
  ],
  Manager: [
    { module: 'operations', action: 'create', allowed: true },
    { module: 'operations', action: 'read', allowed: true },
    { module: 'operations', action: 'update', allowed: true },
    { module: 'operations', action: 'delete', allowed: false },
    { module: 'reports', action: 'read', allowed: true },
    { module: 'reports', action: 'export', allowed: true },
    { module: 'dashboard', action: 'read', allowed: true },
  ],
  Agronomist: [
    { module: 'operations', action: 'create', allowed: true },
    { module: 'operations', action: 'read', allowed: true },
    { module: 'operations', action: 'update', allowed: true },
    { module: 'operations', action: 'delete', allowed: false },
    { module: 'treatments', action: 'create', allowed: true },
    { module: 'treatments', action: 'read', allowed: true },
    { module: 'treatments', action: 'update', allowed: true },
    { module: 'fertilization', action: 'create', allowed: true },
    { module: 'fertilization', action: 'read', allowed: true },
    { module: 'fertilization', action: 'update', allowed: true },
    { module: 'irrigation', action: 'create', allowed: true },
    { module: 'irrigation', action: 'read', allowed: true },
    { module: 'irrigation', action: 'update', allowed: true },
    { module: 'dashboard', action: 'read', allowed: true },
  ],
  Accountant: [
    { module: 'inventory', action: 'create', allowed: true },
    { module: 'inventory', action: 'read', allowed: true },
    { module: 'inventory', action: 'update', allowed: true },
    { module: 'inventory', action: 'delete', allowed: false },
    { module: 'finance', action: 'create', allowed: true },
    { module: 'finance', action: 'read', allowed: true },
    { module: 'finance', action: 'update', allowed: true },
    { module: 'finance', action: 'delete', allowed: false },
    { module: 'reports', action: 'read', allowed: true },
    { module: 'reports', action: 'export', allowed: true },
    { module: 'dashboard', action: 'read', allowed: true },
  ],
};