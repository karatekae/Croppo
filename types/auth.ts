// Core Roles as defined in Phase 1
export type UserRole = 'Admin' | 'Manager' | 'Agronomist' | 'InventoryManager' | 'Accountant';

// Permission Actions
export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'approve' | 'reject' | 'export';

// Application Modules
export type ApplicationModule = 
  | 'userManagement'
  | 'farmSettings' 
  | 'fieldsAndCrops'
  | 'operations'
  | 'fertilizationPlans'
  | 'treatmentPlans'
  | 'irrigationPlans'
  | 'inventoryManagement'
  | 'financialTransactions'
  | 'budgeting'
  | 'reports'
  | 'approvalRequests'
  | '*'; // Wildcard for admin

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  farmId: number;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  createdBy?: number; // ID of the user who created this account
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
  refreshToken: string;
  expiresAt: string;
}

export interface Permission {
  module: ApplicationModule;
  actions: PermissionAction[];
}

// Request Status for Approval Workflows
export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'draft';

export interface ApprovalRequest {
  id: number;
  type: 'fertilization' | 'treatment' | 'irrigation' | 'purchase' | 'budget';
  title: string;
  description: string;
  requestedBy: number;
  requestedByName: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  approvedBy?: number;
  approvedByName?: string;
  approvedAt?: string;
  rejectedBy?: number;
  rejectedByName?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  data: any; // The actual plan/request data
  estimatedCost?: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

// Comprehensive Role-Based Permission Matrix as per Phase 1 specification
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  Admin: [
    {
      module: '*',
      actions: ['create', 'read', 'update', 'delete', 'approve', 'reject', 'export']
    }
  ],
  Manager: [
    {
      module: 'userManagement',
      actions: ['read']
    },
    {
      module: 'farmSettings',
      actions: ['read']
    },
    {
      module: 'fieldsAndCrops',
      actions: ['create', 'read', 'update', 'delete']
    },
    {
      module: 'operations',
      actions: ['create', 'read', 'update', 'delete']
    },
    {
      module: 'fertilizationPlans',
      actions: ['create', 'read', 'approve', 'reject']
    },
    {
      module: 'treatmentPlans',
      actions: ['create', 'read', 'approve', 'reject']
    },
    {
      module: 'irrigationPlans',
      actions: ['create', 'read', 'approve', 'reject']
    },
    {
      module: 'inventoryManagement',
      actions: ['create', 'read', 'update', 'delete']
    },
    {
      module: 'financialTransactions',
      actions: ['create', 'read']
    },
    {
      module: 'budgeting',
      actions: ['create', 'read', 'update', 'delete']
    },
    {
      module: 'reports',
      actions: ['create', 'read', 'export']
    },
    {
      module: 'approvalRequests',
      actions: ['create', 'read', 'approve', 'reject']
    }
  ],
  Agronomist: [
    {
      module: 'userManagement',
      actions: ['read']
    },
    {
      module: 'farmSettings',
      actions: ['read']
    },
    {
      module: 'fieldsAndCrops',
      actions: ['create', 'read', 'update', 'delete']
    },
    {
      module: 'operations',
      actions: ['create', 'read', 'update', 'delete']
    },
    {
      module: 'fertilizationPlans',
      actions: ['create', 'read']
    },
    {
      module: 'treatmentPlans',
      actions: ['create', 'read']
    },
    {
      module: 'irrigationPlans',
      actions: ['create', 'read']
    },
    {
      module: 'inventoryManagement',
      actions: ['read']
    },
    {
      module: 'financialTransactions',
      actions: ['read']
    },
    {
      module: 'budgeting',
      actions: ['read']
    },
    {
      module: 'reports',
      actions: ['create', 'read', 'export']
    },
    {
      module: 'approvalRequests',
      actions: ['create', 'read']
    }
  ],
  InventoryManager: [
    {
      module: 'userManagement',
      actions: ['read']
    },
    {
      module: 'farmSettings',
      actions: ['read']
    },
    {
      module: 'fieldsAndCrops',
      actions: ['read']
    },
    {
      module: 'operations',
      actions: ['read']
    },
    {
      module: 'fertilizationPlans',
      actions: ['read']
    },
    {
      module: 'treatmentPlans',
      actions: ['read']
    },
    {
      module: 'irrigationPlans',
      actions: ['read']
    },
    {
      module: 'inventoryManagement',
      actions: ['create', 'read', 'update', 'delete']
    },
    {
      module: 'financialTransactions',
      actions: ['read']
    },
    {
      module: 'budgeting',
      actions: ['read']
    },
    {
      module: 'reports',
      actions: ['create', 'read', 'export']
    },
    {
      module: 'approvalRequests',
      actions: ['read']
    }
  ],
  Accountant: [
    {
      module: 'userManagement',
      actions: ['read']
    },
    {
      module: 'farmSettings',
      actions: ['read']
    },
    {
      module: 'fieldsAndCrops',
      actions: ['read']
    },
    {
      module: 'operations',
      actions: ['read']
    },
    {
      module: 'fertilizationPlans',
      actions: ['read']
    },
    {
      module: 'treatmentPlans',
      actions: ['read']
    },
    {
      module: 'irrigationPlans',
      actions: ['read']
    },
    {
      module: 'inventoryManagement',
      actions: ['read']
    },
    {
      module: 'financialTransactions',
      actions: ['create', 'read', 'update', 'delete']
    },
    {
      module: 'budgeting',
      actions: ['create', 'read']
    },
    {
      module: 'reports',
      actions: ['create', 'read', 'export']
    },
    {
      module: 'approvalRequests',
      actions: ['read']
    }
  ]
};

// Role Descriptions as per Phase 1 specification
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  Admin: 'Full control over the Croppo application with system configuration, user management, and data oversight capabilities.',
  Manager: 'Oversees day-to-day operations with comprehensive view of activities and approval authority for operational requests.',
  Agronomist: 'Responsible for crop health and scientific practices, creates operational plans requiring manager approval.',
  InventoryManager: 'Manages farm inputs and outputs, tracks stock levels, and handles procurement processes.',
  Accountant: 'Handles financial transactions, bookkeeping, and provides financial insights to management.'
};

// Helper function to check if a user has permission for a specific action on a module
export const hasPermission = (userRole: UserRole, module: ApplicationModule, action: PermissionAction): boolean => {
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  
  // Check for wildcard permissions (Admin)
  const wildcardPermission = rolePermissions.find(p => p.module === '*');
  if (wildcardPermission && wildcardPermission.actions.includes(action)) {
    return true;
  }
  
  // Check for specific module permissions
  const modulePermission = rolePermissions.find(p => p.module === module);
  return modulePermission ? modulePermission.actions.includes(action) : false;
};

// Helper function to get all permissions for a role
export const getRolePermissions = (userRole: UserRole): Permission[] => {
  return ROLE_PERMISSIONS[userRole];
};

// Helper function to check if a role can approve requests
export const canApproveRequests = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'approvalRequests', 'approve');
};

// Helper function to check if a role can create requests that need approval
export const needsApproval = (userRole: UserRole, requestType: 'fertilization' | 'treatment' | 'irrigation'): boolean => {
  // Agronomists create requests that need Manager/Admin approval
  if (userRole === 'Agronomist') {
    return true;
  }
  // Managers and Admins can approve their own requests or create without approval
  return false;
};