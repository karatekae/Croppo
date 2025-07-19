export type UserRole = 'Admin' | 'Manager' | 'Agronomist' | 'InventoryManager' | 'Accountant';

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

// Supported permission actions
export type ActionType =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'export'
  | 'approve'
  | 'reject';

export interface Permission {
  module: string;
  action: ActionType;
  allowed: boolean;
}

// Role-based permissions as specified in PRD
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  // Farm Administrator – full system access
  Admin: [
    { module: '*', action: 'create', allowed: true },
    { module: '*', action: 'read', allowed: true },
    { module: '*', action: 'update', allowed: true },
    { module: '*', action: 'delete', allowed: true },
    { module: '*', action: 'export', allowed: true },
    { module: '*', action: 'approve', allowed: true },
    { module: '*', action: 'reject', allowed: true },
  ],

  // Farm Manager – broad operational control with approval power
  Manager: [
    // User & farm administration (read-only)
    { module: 'user-management', action: 'read', allowed: true },
    { module: 'farm-settings', action: 'read', allowed: true },

    // Core CRUD modules
    { module: 'fields-crops', action: 'create', allowed: true },
    { module: 'fields-crops', action: 'read', allowed: true },
    { module: 'fields-crops', action: 'update', allowed: true },
    { module: 'fields-crops', action: 'delete', allowed: true },

    { module: 'operations', action: 'create', allowed: true },
    { module: 'operations', action: 'read', allowed: true },
    { module: 'operations', action: 'update', allowed: true },
    { module: 'operations', action: 'delete', allowed: true },

    // Plans with approval workflow
    { module: 'fertilization-plans', action: 'create', allowed: true },
    { module: 'fertilization-plans', action: 'read', allowed: true },
    { module: 'fertilization-plans', action: 'update', allowed: true },
    { module: 'fertilization-plans', action: 'approve', allowed: true },
    { module: 'fertilization-plans', action: 'reject', allowed: true },

    { module: 'treatment-plans', action: 'create', allowed: true },
    { module: 'treatment-plans', action: 'read', allowed: true },
    { module: 'treatment-plans', action: 'update', allowed: true },
    { module: 'treatment-plans', action: 'approve', allowed: true },
    { module: 'treatment-plans', action: 'reject', allowed: true },

    { module: 'irrigation-plans', action: 'create', allowed: true },
    { module: 'irrigation-plans', action: 'read', allowed: true },
    { module: 'irrigation-plans', action: 'update', allowed: true },
    { module: 'irrigation-plans', action: 'approve', allowed: true },
    { module: 'irrigation-plans', action: 'reject', allowed: true },

    // Inventory & finance oversight
    { module: 'inventory-management', action: 'create', allowed: true },
    { module: 'inventory-management', action: 'read', allowed: true },
    { module: 'inventory-management', action: 'update', allowed: true },
    { module: 'inventory-management', action: 'delete', allowed: true },

    { module: 'financial-transactions', action: 'create', allowed: true },
    { module: 'financial-transactions', action: 'read', allowed: true },

    // Budgeting
    { module: 'budgeting', action: 'create', allowed: true },
    { module: 'budgeting', action: 'read', allowed: true },
    { module: 'budgeting', action: 'update', allowed: true },
    { module: 'budgeting', action: 'delete', allowed: true },

    // Reporting & approvals
    { module: 'reports', action: 'read', allowed: true },
    { module: 'reports', action: 'export', allowed: true },
    { module: 'approval-requests', action: 'approve', allowed: true },
    { module: 'approval-requests', action: 'reject', allowed: true },
  ],

  // Agronomist – create operational plans, no approval rights
  Agronomist: [
    // Fields & operations
    { module: 'fields-crops', action: 'create', allowed: true },
    { module: 'fields-crops', action: 'read', allowed: true },
    { module: 'fields-crops', action: 'update', allowed: true },
    { module: 'fields-crops', action: 'delete', allowed: true },

    { module: 'operations', action: 'create', allowed: true },
    { module: 'operations', action: 'read', allowed: true },
    { module: 'operations', action: 'update', allowed: true },
    { module: 'operations', action: 'delete', allowed: true },

    // Plans (create/update only)
    { module: 'fertilization-plans', action: 'create', allowed: true },
    { module: 'fertilization-plans', action: 'read', allowed: true },
    { module: 'fertilization-plans', action: 'update', allowed: true },

    { module: 'treatment-plans', action: 'create', allowed: true },
    { module: 'treatment-plans', action: 'read', allowed: true },
    { module: 'treatment-plans', action: 'update', allowed: true },

    { module: 'irrigation-plans', action: 'create', allowed: true },
    { module: 'irrigation-plans', action: 'read', allowed: true },
    { module: 'irrigation-plans', action: 'update', allowed: true },

    // Reference data
    { module: 'inventory-management', action: 'read', allowed: true },
    { module: 'reports', action: 'create', allowed: true },
    { module: 'reports', action: 'read', allowed: true },
    { module: 'reports', action: 'export', allowed: false },
  ],

  // Inventory Manager – manages stock & procurement
  InventoryManager: [
    { module: 'inventory-management', action: 'create', allowed: true },
    { module: 'inventory-management', action: 'read', allowed: true },
    { module: 'inventory-management', action: 'update', allowed: true },
    { module: 'inventory-management', action: 'delete', allowed: true },

    // Read-only access to operations & plans for demand forecast
    { module: 'operations', action: 'read', allowed: true },
    { module: 'fertilization-plans', action: 'read', allowed: true },
    { module: 'treatment-plans', action: 'read', allowed: true },
    { module: 'irrigation-plans', action: 'read', allowed: true },

    { module: 'reports', action: 'read', allowed: true },
  ],

  // Accountant / Finance Officer
  Accountant: [
    { module: 'financial-transactions', action: 'create', allowed: true },
    { module: 'financial-transactions', action: 'read', allowed: true },
    { module: 'financial-transactions', action: 'update', allowed: true },
    { module: 'financial-transactions', action: 'delete', allowed: true },

    { module: 'inventory-management', action: 'read', allowed: true },

    { module: 'budgeting', action: 'create', allowed: true },
    { module: 'budgeting', action: 'read', allowed: true },
    { module: 'budgeting', action: 'update', allowed: true },

    { module: 'reports', action: 'read', allowed: true },
    { module: 'reports', action: 'export', allowed: true },
  ],
};