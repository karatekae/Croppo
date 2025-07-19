import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, AuthState, LoginRequest, Permission, ROLE_PERMISSIONS } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  hasPermission: (module: string, action: string) => boolean;
  isRole: (role: UserRole) => boolean;
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

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      // Simulate a default admin user
      const mockUser: User = {
        id: 1,
        email: 'admin@farm.com',
        name: 'Farm Administrator',
        role: 'Admin',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setAuthState({
        user: mockUser,
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
      // Mock login - in real app, this would call the API
      const mockUsers: User[] = [
        {
          id: 1,
          email: 'admin@farm.com',
          name: 'Farm Administrator',
          role: 'Admin',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 2,
          email: 'manager@farm.com',
          name: 'Farm Manager',
          role: 'Manager',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 3,
          email: 'agronomist@farm.com',
          name: 'Field Agronomist',
          role: 'Agronomist',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 4,
          email: 'accountant@farm.com',
          name: 'Farm Accountant',
          role: 'Accountant',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      const user = mockUsers.find(u => u.email === credentials.email);
      if (!user) {
        throw new Error('Invalid credentials');
      }
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

  const hasPermission = (module: string, action: string): boolean => {
    if (!authState.user) return false;
    const userPermissions = ROLE_PERMISSIONS[authState.user.role];
    // Check for wildcard permissions (Admin)
    const wildcardPermission = userPermissions.find(
      p => p.module === '*' && p.action === action
    );
    if (wildcardPermission?.allowed) return true;
    // Check for specific module permissions
    const modulePermission = userPermissions.find(
      p => p.module === module && p.action === action
    );
    return modulePermission?.allowed || false;
  };

  const isRole = (role: UserRole): boolean => {
    return authState.user?.role === role;
  };

  return {
    ...authState,
    login,
    logout,
    hasPermission,
    isRole,
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