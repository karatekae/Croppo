import { Request, Response, NextFunction } from 'express';
import { ROLE_PERMISSIONS, UserRole, Permission } from '../../types/auth';

// Assumes a preceding auth middleware has attached req.user
// with at least { id: number; role: UserRole }

declare global {
  namespace Express {
    interface User {
      id: number;
      role: UserRole;
    }
    interface Request {
      user?: User;
    }
  }
}

/**
 * Factory that returns an Express middleware verifying the caller
 * has the required permission for a given module & action.
 */
export const authorize = (module: string, action: Permission['action']) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const currentUser = req.user;
    if (!currentUser) {
      return res.status(401).json({ message: 'Unauthenticated' });
    }

    const permissions = ROLE_PERMISSIONS[currentUser.role] || [];

    const isAllowed = permissions.some(p => (p.module === module || p.module === '*') && p.action === action && p.allowed);

    if (!isAllowed) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
};