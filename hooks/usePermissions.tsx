import { useAuth } from './useAuth';
import { ApplicationModule, PermissionAction, UserRole } from '../types/auth';

/**
 * Custom hook for managing permissions and UI control based on user roles
 * Provides helper functions for conditional rendering and permission-based actions
 */
export const usePermissions = () => {
  const { user, hasPermission, isRole, canApprove, requiresApproval } = useAuth();

  /**
   * Check if current user can perform an action on a module
   */
  const can = (module: ApplicationModule, action: PermissionAction): boolean => {
    return hasPermission(module, action);
  };

  /**
   * Check if current user cannot perform an action on a module
   */
  const cannot = (module: ApplicationModule, action: PermissionAction): boolean => {
    return !hasPermission(module, action);
  };

  /**
   * Get a list of modules the user can perform a specific action on
   */
  const getAuthorizedModules = (action: PermissionAction): ApplicationModule[] => {
    if (!user) return [];
    
    const modules: ApplicationModule[] = [
      'userManagement',
      'farmSettings',
      'fieldsAndCrops',
      'operations',
      'fertilizationPlans',
      'treatmentPlans',
      'irrigationPlans',
      'inventoryManagement',
      'financialTransactions',
      'budgeting',
      'reports',
      'approvalRequests'
    ];

    return modules.filter(module => hasPermission(module, action));
  };

  /**
   * UI Control helpers for conditional rendering
   */
  const uiControls = {
    // Show element only if user has permission
    showIf: (module: ApplicationModule, action: PermissionAction) => 
      hasPermission(module, action),

    // Hide element if user has permission
    hideIf: (module: ApplicationModule, action: PermissionAction) => 
      !hasPermission(module, action),

    // Show element only for specific roles
    showForRoles: (...roles: UserRole[]) => 
      user ? roles.includes(user.role) : false,

    // Hide element for specific roles
    hideForRoles: (...roles: UserRole[]) => 
      user ? !roles.includes(user.role) : true,

    // Show element only for admins
    adminOnly: () => isRole('Admin'),

    // Show element for managers and above
    managerAndAbove: () => isRole('Admin') || isRole('Manager'),

    // Show element for users who can approve requests
    approversOnly: () => canApprove(),

    // Disable button/input based on permission
    disableIf: (module: ApplicationModule, action: PermissionAction) => 
      !hasPermission(module, action),

    // Get CSS classes for conditional styling
    getConditionalClass: (
      module: ApplicationModule, 
      action: PermissionAction, 
      authorizedClass: string, 
      unauthorizedClass: string = 'opacity-50 cursor-not-allowed'
    ) => hasPermission(module, action) ? authorizedClass : unauthorizedClass,
  };

  /**
   * Role-specific helpers
   */
  const roleHelpers = {
    isAdmin: () => isRole('Admin'),
    isManager: () => isRole('Manager'),
    isAgronomist: () => isRole('Agronomist'),
    isInventoryManager: () => isRole('InventoryManager'),
    isAccountant: () => isRole('Accountant'),
    
    // Check if user has management privileges (Admin or Manager)
    isManagement: () => isRole('Admin') || isRole('Manager'),
    
    // Check if user is operational staff (Agronomist, InventoryManager, Accountant)
    isOperationalStaff: () => 
      isRole('Agronomist') || isRole('InventoryManager') || isRole('Accountant'),
  };

  /**
   * Permission-based navigation helpers
   */
  const navigationHelpers = {
    // Check if user can access a specific route/tab
    canAccessRoute: (route: string): boolean => {
      const routePermissions: Record<string, { module: ApplicationModule; action: PermissionAction }> = {
        'dashboard': { module: 'operations', action: 'read' },
        'operations': { module: 'operations', action: 'read' },
        'treatments': { module: 'treatmentPlans', action: 'read' },
        'inventory': { module: 'inventoryManagement', action: 'read' },
        'finance': { module: 'financialTransactions', action: 'read' },
        'reports': { module: 'reports', action: 'read' },
        'users': { module: 'userManagement', action: 'read' },
        'settings': { module: 'farmSettings', action: 'read' },
        'approvals': { module: 'approvalRequests', action: 'read' },
      };

      const permission = routePermissions[route];
      return permission ? hasPermission(permission.module, permission.action) : false;
    },

    // Get available routes for current user
    getAvailableRoutes: (): string[] => {
      const allRoutes = [
        'dashboard', 'operations', 'treatments', 'inventory', 
        'finance', 'reports', 'users', 'settings', 'approvals'
      ];
      return allRoutes.filter(route => navigationHelpers.canAccessRoute(route));
    },
  };

  /**
   * Request workflow helpers
   */
  const workflowHelpers = {
    // Check if user needs approval for a specific request type
    needsApprovalFor: (requestType: 'fertilization' | 'treatment' | 'irrigation'): boolean => 
      requiresApproval(requestType),

    // Check if user can approve requests
    canApproveRequests: () => canApprove(),

    // Get workflow status for current user
    getWorkflowRole: (): 'creator' | 'approver' | 'viewer' => {
      if (canApprove()) return 'approver';
      if (isRole('Agronomist')) return 'creator';
      return 'viewer';
    },

    // Check if user can perform workflow actions
    canCreateRequests: () => 
      hasPermission('fertilizationPlans', 'create') ||
      hasPermission('treatmentPlans', 'create') ||
      hasPermission('irrigationPlans', 'create'),
  };

  return {
    // Core permission functions
    can,
    cannot,
    getAuthorizedModules,

    // UI control helpers
    ui: uiControls,

    // Role-specific helpers
    role: roleHelpers,

    // Navigation helpers
    navigation: navigationHelpers,

    // Workflow helpers
    workflow: workflowHelpers,

    // Direct access to auth context values
    user,
    hasPermission,
    isRole,
    canApprove,
    requiresApproval,
  };
};

/**
 * React component wrapper for permission-based rendering
 */
export interface PermissionGateProps {
  module: ApplicationModule;
  action: PermissionAction;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  roles?: UserRole[];
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  module,
  action,
  children,
  fallback = null,
  roles,
}) => {
  const { can, role } = usePermissions();

  // Check role-based permission if roles are specified
  if (roles && roles.length > 0) {
    const hasRole = roles.some(r => role.isAdmin() ? true : role[`is${r}` as keyof typeof role]?.());
    if (!hasRole) return <>{fallback}</>;
  }

  // Check module/action permission
  if (!can(module, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

/**
 * HOC for protecting routes based on permissions
 */
export const withPermission = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  module: ApplicationModule,
  action: PermissionAction,
  fallback?: React.ComponentType
) => {
  return (props: P) => {
    const { can } = usePermissions();

    if (!can(module, action)) {
      if (fallback) {
        const FallbackComponent = fallback;
        return <FallbackComponent />;
      }
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access this resource.</p>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};