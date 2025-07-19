import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  UserRole, 
  AuthState, 
  LoginRequest, 
  Permission, 
  ApplicationModule,
  PermissionAction,
  hasPermission as checkUserPermission,
  canApproveRequests as checkCanApproveRequests,
  needsApproval as checkNeedsApproval,
  ApprovalRequest
} from '../types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  hasPermission: (module: ApplicationModule, action: PermissionAction) => boolean;
  isRole: (role: UserRole) => boolean;
  canApprove: () => boolean;
  requiresApproval: (requestType: 'fertilization' | 'treatment' | 'irrigation') => boolean;
  switchUser: (userId: number) => void; // For demo purposes
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthProvider = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Mock users for all roles as defined in Phase 1
  const mockUsers: User[] = [
    {
      id: 1,
      email: 'admin@croppo.com',
      name: 'Farm Administrator',
      role: 'Admin',
      isActive: true,
      farmId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    },
    {
      id: 2,
      email: 'manager@croppo.com',
      name: 'Farm Manager',
      role: 'Manager',
      isActive: true,
      farmId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      createdBy: 1,
    },
    {
      id: 3,
      email: 'agronomist@croppo.com',
      name: 'Field Agronomist',
      role: 'Agronomist',
      isActive: true,
      farmId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      createdBy: 1,
    },
    {
      id: 4,
      email: 'inventory@croppo.com',
      name: 'Inventory Manager',
      role: 'InventoryManager',
      isActive: true,
      farmId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      createdBy: 1,
    },
    {
      id: 5,
      email: 'accountant@croppo.com',
      name: 'Farm Accountant',
      role: 'Accountant',
      isActive: true,
      farmId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      createdBy: 1,
    },
  ];

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      // Simulate checking for existing session - default to Admin for demo
      const defaultUser = mockUsers[0]; // Admin user
      setAuthState({
        user: defaultUser,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const user = mockUsers.find(u => u.email === credentials.email);
      
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      // Update last login time
      user.lastLoginAt = new Date().toISOString();
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      throw error;
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  // Updated permission checking using the new system
  const hasPermissionCheck = (module: ApplicationModule, action: PermissionAction): boolean => {
    if (!authState.user) return false;
    return checkUserPermission(authState.user.role, module, action);
  };

  const isRole = (role: UserRole): boolean => {
    return authState.user?.role === role;
  };

  const canApprove = (): boolean => {
    if (!authState.user) return false;
    return checkCanApproveRequests(authState.user.role);
  };

  const requiresApproval = (requestType: 'fertilization' | 'treatment' | 'irrigation'): boolean => {
    if (!authState.user) return false;
    return checkNeedsApproval(authState.user.role, requestType);
  };

  // Demo function to switch between users for testing
  const switchUser = (userId: number) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      user.lastLoginAt = new Date().toISOString();
      setAuthState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
      }));
    }
  };

  return {
    ...authState,
    login,
    logout,
    hasPermission: hasPermissionCheck,
    isRole,
    canApprove,
    requiresApproval,
    switchUser,
  };
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const value = useAuthProvider();
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 