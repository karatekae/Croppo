import { UserRole, ApplicationModule, PermissionAction, hasPermission } from '../types/auth';

/**
 * Backend Authorization Middleware for API Endpoint Protection
 * This demonstrates the server-side implementation of the RBAC system
 */

export interface AuthenticatedRequest {
  user: {
    id: number;
    role: UserRole;
    farmId: number;
    isActive: boolean;
  };
  headers: Record<string, string>;
  body: any;
  params: any;
  query: any;
}

export interface AuthorizationError extends Error {
  statusCode: number;
  code: string;
}

/**
 * Creates an authorization error
 */
const createAuthError = (message: string, code: string, statusCode: number = 403): AuthorizationError => {
  const error = new Error(message) as AuthorizationError;
  error.statusCode = statusCode;
  error.code = code;
  return error;
};

/**
 * Middleware factory for checking specific permissions
 */
export const requirePermission = (
  module: ApplicationModule, 
  action: PermissionAction
) => {
  return (req: AuthenticatedRequest, next: () => void) => {
    // Check if user is authenticated
    if (!req.user) {
      throw createAuthError('Authentication required', 'AUTH_REQUIRED', 401);
    }

    // Check if user account is active
    if (!req.user.isActive) {
      throw createAuthError('Account is inactive', 'ACCOUNT_INACTIVE', 403);
    }

    // Check permission
    if (!hasPermission(req.user.role, module, action)) {
      throw createAuthError(
        `Insufficient permissions: ${action} on ${module}`,
        'INSUFFICIENT_PERMISSIONS',
        403
      );
    }

    // Permission granted, continue to next middleware/handler
    next();
  };
};

/**
 * Middleware factory for checking multiple permissions (OR logic)
 */
export const requireAnyPermission = (
  permissions: Array<{ module: ApplicationModule; action: PermissionAction }>
) => {
  return (req: AuthenticatedRequest, next: () => void) => {
    if (!req.user) {
      throw createAuthError('Authentication required', 'AUTH_REQUIRED', 401);
    }

    if (!req.user.isActive) {
      throw createAuthError('Account is inactive', 'ACCOUNT_INACTIVE', 403);
    }

    const hasAnyPermission = permissions.some(({ module, action }) => 
      hasPermission(req.user.role, module, action)
    );

    if (!hasAnyPermission) {
      throw createAuthError(
        'Insufficient permissions for this operation',
        'INSUFFICIENT_PERMISSIONS',
        403
      );
    }

    next();
  };
};

/**
 * Middleware factory for role-based access control
 */
export const requireRole = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, next: () => void) => {
    if (!req.user) {
      throw createAuthError('Authentication required', 'AUTH_REQUIRED', 401);
    }

    if (!roles.includes(req.user.role)) {
      throw createAuthError(
        `Access denied. Required roles: ${roles.join(', ')}`,
        'ROLE_ACCESS_DENIED',
        403
      );
    }

    next();
  };
};

/**
 * Middleware for admin-only access
 */
export const requireAdmin = requireRole('Admin');

/**
 * Middleware for management access (Admin or Manager)
 */
export const requireManagement = requireRole('Admin', 'Manager');

/**
 * Resource ownership middleware
 * Ensures users can only access resources they own or have permission to access
 */
export const requireResourceOwnership = (
  resourceUserIdField: string = 'userId',
  allowManagement: boolean = true
) => {
  return (req: AuthenticatedRequest, next: () => void) => {
    if (!req.user) {
      throw createAuthError('Authentication required', 'AUTH_REQUIRED', 401);
    }

    // Admin always has access
    if (req.user.role === 'Admin') {
      return next();
    }

    // Managers have access if allowManagement is true
    if (allowManagement && req.user.role === 'Manager') {
      return next();
    }

    // Check resource ownership
    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
    if (resourceUserId && parseInt(resourceUserId) !== req.user.id) {
      throw createAuthError(
        'Access denied. You can only access your own resources.',
        'RESOURCE_OWNERSHIP_DENIED',
        403
      );
    }

    next();
  };
};

/**
 * Farm-level access control
 * Ensures users can only access resources within their farm
 */
export const requireFarmAccess = (farmIdField: string = 'farmId') => {
  return (req: AuthenticatedRequest, next: () => void) => {
    if (!req.user) {
      throw createAuthError('Authentication required', 'AUTH_REQUIRED', 401);
    }

    const resourceFarmId = req.params[farmIdField] || req.body[farmIdField] || req.query[farmIdField];
    
    if (resourceFarmId && parseInt(resourceFarmId) !== req.user.farmId) {
      throw createAuthError(
        'Access denied. Resource belongs to a different farm.',
        'FARM_ACCESS_DENIED',
        403
      );
    }

    next();
  };
};

/**
 * Approval workflow middleware
 * Handles permission checking for approval workflows
 */
export const requireApprovalPermission = (action: 'create' | 'approve' | 'reject') => {
  return (req: AuthenticatedRequest, next: () => void) => {
    if (!req.user) {
      throw createAuthError('Authentication required', 'AUTH_REQUIRED', 401);
    }

    switch (action) {
      case 'create':
        // Agronomists can create requests, Managers/Admins can create and auto-approve
        if (!['Agronomist', 'Manager', 'Admin'].includes(req.user.role)) {
          throw createAuthError(
            'Only Agronomists, Managers, and Admins can create approval requests',
            'CREATE_REQUEST_DENIED',
            403
          );
        }
        break;

      case 'approve':
      case 'reject':
        // Only Managers and Admins can approve/reject requests
        if (!hasPermission(req.user.role, 'approvalRequests', 'approve')) {
          throw createAuthError(
            'Insufficient permissions to approve/reject requests',
            'APPROVAL_PERMISSION_DENIED',
            403
          );
        }
        break;

      default:
        throw createAuthError('Invalid approval action', 'INVALID_ACTION', 400);
    }

    next();
  };
};

/**
 * API Route Protection Examples
 * These demonstrate how to apply the middleware to protect specific API endpoints
 */
export const routeProtections = {
  // User Management Routes
  'GET /api/users': [requirePermission('userManagement', 'read')],
  'POST /api/users': [requirePermission('userManagement', 'create')],
  'PUT /api/users/:id': [requirePermission('userManagement', 'update'), requireResourceOwnership('id')],
  'DELETE /api/users/:id': [requirePermission('userManagement', 'delete'), requireResourceOwnership('id', false)],

  // Farm Settings Routes
  'GET /api/farm/settings': [requirePermission('farmSettings', 'read')],
  'PUT /api/farm/settings': [requirePermission('farmSettings', 'update')],

  // Fields and Crops Routes
  'GET /api/fields': [requirePermission('fieldsAndCrops', 'read'), requireFarmAccess()],
  'POST /api/fields': [requirePermission('fieldsAndCrops', 'create')],
  'PUT /api/fields/:id': [requirePermission('fieldsAndCrops', 'update')],
  'DELETE /api/fields/:id': [requirePermission('fieldsAndCrops', 'delete')],

  // Operations Routes
  'GET /api/operations': [requirePermission('operations', 'read')],
  'POST /api/operations': [requirePermission('operations', 'create')],
  'PUT /api/operations/:id': [requirePermission('operations', 'update')],
  'DELETE /api/operations/:id': [requirePermission('operations', 'delete')],

  // Fertilization Plans Routes
  'GET /api/fertilization-plans': [requirePermission('fertilizationPlans', 'read')],
  'POST /api/fertilization-plans': [requirePermission('fertilizationPlans', 'create')],
  'PUT /api/fertilization-plans/:id/approve': [requireApprovalPermission('approve')],
  'PUT /api/fertilization-plans/:id/reject': [requireApprovalPermission('reject')],

  // Treatment Plans Routes
  'GET /api/treatment-plans': [requirePermission('treatmentPlans', 'read')],
  'POST /api/treatment-plans': [requirePermission('treatmentPlans', 'create')],
  'PUT /api/treatment-plans/:id/approve': [requireApprovalPermission('approve')],
  'PUT /api/treatment-plans/:id/reject': [requireApprovalPermission('reject')],

  // Irrigation Plans Routes
  'GET /api/irrigation-plans': [requirePermission('irrigationPlans', 'read')],
  'POST /api/irrigation-plans': [requirePermission('irrigationPlans', 'create')],
  'PUT /api/irrigation-plans/:id/approve': [requireApprovalPermission('approve')],
  'PUT /api/irrigation-plans/:id/reject': [requireApprovalPermission('reject')],

  // Inventory Management Routes
  'GET /api/inventory': [requirePermission('inventoryManagement', 'read')],
  'POST /api/inventory': [requirePermission('inventoryManagement', 'create')],
  'PUT /api/inventory/:id': [requirePermission('inventoryManagement', 'update')],
  'DELETE /api/inventory/:id': [requirePermission('inventoryManagement', 'delete')],

  // Financial Transactions Routes
  'GET /api/financial/transactions': [requirePermission('financialTransactions', 'read')],
  'POST /api/financial/transactions': [requirePermission('financialTransactions', 'create')],
  'PUT /api/financial/transactions/:id': [requirePermission('financialTransactions', 'update')],
  'DELETE /api/financial/transactions/:id': [requirePermission('financialTransactions', 'delete')],

  // Budgeting Routes
  'GET /api/budgets': [requirePermission('budgeting', 'read')],
  'POST /api/budgets': [requirePermission('budgeting', 'create')],
  'PUT /api/budgets/:id': [requirePermission('budgeting', 'update')],
  'DELETE /api/budgets/:id': [requirePermission('budgeting', 'delete')],

  // Reports Routes
  'GET /api/reports': [requirePermission('reports', 'read')],
  'POST /api/reports': [requirePermission('reports', 'create')],
  'GET /api/reports/:id/export': [requirePermission('reports', 'export')],

  // Approval Requests Routes
  'GET /api/approval-requests': [requirePermission('approvalRequests', 'read')],
  'POST /api/approval-requests': [requireApprovalPermission('create')],
  'PUT /api/approval-requests/:id/approve': [requireApprovalPermission('approve')],
  'PUT /api/approval-requests/:id/reject': [requireApprovalPermission('reject')],
};

/**
 * Error handler for authorization errors
 */
export const handleAuthorizationError = (error: AuthorizationError) => {
  return {
    success: false,
    error: {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
    },
    timestamp: new Date().toISOString(),
  };
};

/**
 * Utility function to check permissions programmatically
 */
export const checkUserPermission = (
  user: { role: UserRole; isActive: boolean },
  module: ApplicationModule,
  action: PermissionAction
): boolean => {
  if (!user.isActive) return false;
  return hasPermission(user.role, module, action);
};

/**
 * JWT Token validation middleware (conceptual)
 */
export const validateToken = (token: string): { user: AuthenticatedRequest['user'] } | null => {
  // This would implement actual JWT validation logic
  // For demo purposes, this is a simplified version
  try {
    // Mock token validation
    if (!token || token === 'invalid') {
      return null;
    }

    // Mock decoded user data
    return {
      user: {
        id: 1,
        role: 'Admin',
        farmId: 1,
        isActive: true,
      }
    };
  } catch (error) {
    return null;
  }
};