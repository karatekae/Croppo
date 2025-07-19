# Phase 1: RBAC System Implementation

## Overview

This document describes the complete implementation of Phase 1 of the Role-Based Access Control (RBAC) system for the Croppo application. The implementation establishes a foundational structure for user management with five distinct roles and a comprehensive permission matrix that ensures secure, role-appropriate access to application features.

## 🎯 Key Features Implemented

### 1. Core Roles Definition
- **Farm Administrator (Admin)**: Full system control and oversight
- **Farm Manager (Manager)**: Day-to-day operations and approval authority
- **Agronomist**: Crop health and scientific practices
- **Inventory Manager**: Input/output management and procurement
- **Accountant/Finance Officer**: Financial transactions and reporting

### 2. Comprehensive Permission Matrix
- Granular permissions across 12 application modules
- 7 different permission actions (create, read, update, delete, approve, reject, export)
- Role-specific access patterns aligned with farm organizational structure

### 3. Approval Workflow System
- Request creation and management
- Multi-level approval process
- Status tracking and audit trail
- Role-based approval permissions

### 4. Frontend UI Control
- Permission-based component rendering
- Role-specific navigation
- Conditional action buttons
- Real-time permission checking

### 5. Backend Authorization Middleware
- API endpoint protection
- JWT token validation
- Resource ownership verification
- Farm-level access control

## 🏗️ System Architecture

### Core Types and Interfaces

```typescript
// Core role definitions
export type UserRole = 'Admin' | 'Manager' | 'Agronomist' | 'InventoryManager' | 'Accountant';

// Permission system
export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'approve' | 'reject' | 'export';
export type ApplicationModule = 'userManagement' | 'farmSettings' | 'fieldsAndCrops' | /* ... */;

// Approval workflow
export interface ApprovalRequest {
  id: number;
  type: 'fertilization' | 'treatment' | 'irrigation' | 'purchase' | 'budget';
  status: 'pending' | 'approved' | 'rejected' | 'draft';
  // ... other fields
}
```

### Key Components

1. **Authentication System** (`hooks/useAuth.tsx`)
   - User authentication and session management
   - Role switching for demo purposes
   - Permission checking integration

2. **Permission Management** (`hooks/usePermissions.tsx`)
   - UI control helpers
   - Role-specific utilities
   - Navigation and workflow helpers

3. **Approval Requests** (`hooks/useApprovalRequests.tsx`)
   - Request lifecycle management
   - Approval/rejection workflow
   - Status tracking and filtering

4. **Authorization Middleware** (`services/authMiddleware.ts`)
   - API endpoint protection
   - Permission validation
   - Resource access control

## 📋 Detailed Permission Matrix

| Module | Admin | Manager | Agronomist | Inventory Manager | Accountant |
|--------|-------|---------|------------|-------------------|------------|
| User Management | CRUD | R | R | R | R |
| Farm Settings | CRUD | R | R | R | R |
| Fields & Crops | CRUD | CRUD | CRUD | R | R |
| Operations | CRUD | CRUD | CRUD | R | R |
| Fertilization Plans | CRUD | CR,A/Rj | CR | R | R |
| Treatment Plans | CRUD | CR,A/Rj | CR | R | R |
| Irrigation Plans | CRUD | CR,A/Rj | CR | R | R |
| Inventory Management | CRUD | CRUD | R | CRUD | R |
| Financial Transactions | CRUD | CR | R | R | CRUD |
| Budgeting | CRUD | CRUD | R | R | CR |
| Reports | CR | CR | CR | CR | CR |
| Approval Requests | CR | CR,A/Rj | CR | R | R |

**Legend:**
- C: Create, R: Read, U: Update, D: Delete
- A/Rj: Approve/Reject
- CR: Create and Read only

## 🚀 Getting Started

### 1. Demo Access

Navigate to the main dashboard and click the "RBAC Demo" button to explore the permission system:

```typescript
// Switch between roles to see different permissions
const mockUsers = [
  { id: 1, name: 'Farm Administrator', role: 'Admin' },
  { id: 2, name: 'Farm Manager', role: 'Manager' },
  { id: 3, name: 'Field Agronomist', role: 'Agronomist' },
  { id: 4, name: 'Inventory Manager', role: 'InventoryManager' },
  { id: 5, name: 'Farm Accountant', role: 'Accountant' },
];
```

### 2. Using Permission Checks

```typescript
import { usePermissions } from '@/hooks/usePermissions';

const MyComponent = () => {
  const { can, role, workflow } = usePermissions();
  
  return (
    <div>
      {can('fertilizationPlans', 'create') && (
        <button>Create Fertilization Plan</button>
      )}
      
      {role.isManagement() && (
        <button>Management Action</button>
      )}
      
      {workflow.canApproveRequests() && (
        <button>Approve Requests</button>
      )}
    </div>
  );
};
```

### 3. Permission Gate Component

```typescript
import { PermissionGate } from '@/hooks/usePermissions';

<PermissionGate 
  module="userManagement" 
  action="create"
  fallback={<div>Access Denied</div>}
>
  <CreateUserForm />
</PermissionGate>
```

### 4. Backend Route Protection

```typescript
import { requirePermission, requireApprovalPermission } from '@/services/authMiddleware';

// Protect API endpoints
app.get('/api/users', requirePermission('userManagement', 'read'));
app.post('/api/fertilization-plans', requirePermission('fertilizationPlans', 'create'));
app.put('/api/approval-requests/:id/approve', requireApprovalPermission('approve'));
```

## 🔧 Implementation Details

### Role Definitions and Responsibilities

#### 1. Farm Administrator (Admin)
- **Purpose**: Complete system oversight and configuration
- **Permissions**: Full CRUD access to all modules
- **Key Functions**:
  - User account management
  - System configuration
  - Override any restrictions
  - Access all reports and data

#### 2. Farm Manager (Manager)
- **Purpose**: Operational oversight and strategic planning
- **Permissions**: Comprehensive operational access with approval authority
- **Key Functions**:
  - Approve/reject operational requests
  - Access financial and operational reports
  - Manage day-to-day operations
  - Oversee inventory and labor

#### 3. Agronomist
- **Purpose**: Crop health and scientific practices
- **Permissions**: Create operational plans requiring approval
- **Key Functions**:
  - Create fertilization, treatment, and irrigation plans
  - Record field observations and data
  - Access historical operational data
  - Generate agronomy reports

#### 4. Inventory Manager
- **Purpose**: Supply chain and resource management
- **Permissions**: Full inventory control with operational awareness
- **Key Functions**:
  - Manage all inventory items
  - Track stock levels and procurement
  - View operational requests for planning
  - Generate inventory reports

#### 5. Accountant/Finance Officer
- **Purpose**: Financial management and reporting
- **Permissions**: Complete financial system access
- **Key Functions**:
  - Record all financial transactions
  - Manage accounts and budgets
  - Generate financial reports
  - View operational costs for allocation

### Approval Workflow

The system implements a structured approval workflow:

1. **Request Creation**: Agronomists create operational requests
2. **Approval Queue**: Managers and Admins see pending requests
3. **Review Process**: Approvers can approve or reject with reasons
4. **Status Tracking**: All stakeholders can view request status
5. **Audit Trail**: Complete history of approvals and rejections

### Security Features

1. **Multi-layer Protection**:
   - Frontend UI controls
   - Backend API validation
   - Database-level constraints

2. **Resource Isolation**:
   - Farm-level access control
   - User ownership verification
   - Role-based data filtering

3. **Audit and Compliance**:
   - Action logging
   - Permission change tracking
   - Access attempt monitoring

## 🧪 Testing the System

### Role-Based Testing Scenarios

1. **Admin User**:
   - Can access all features
   - Can create and manage users
   - Can approve any request
   - Has override capabilities

2. **Manager User**:
   - Can view and approve requests
   - Cannot access user management
   - Has comprehensive operational access
   - Can generate most reports

3. **Agronomist User**:
   - Can create requests requiring approval
   - Cannot approve requests
   - Limited to operational modules
   - Cannot access financial data

4. **Inventory Manager User**:
   - Full inventory access
   - Can view but not create operational plans
   - Cannot access financial transactions
   - Cannot approve requests

5. **Accountant User**:
   - Full financial system access
   - Cannot create operational plans
   - Cannot manage inventory
   - Cannot approve operational requests

### Demo Features

The RBAC dashboard includes:
- **Real-time role switching** to test different permissions
- **Permission badge display** showing current user capabilities
- **Interactive approval workflow** with sample requests
- **Conditional UI elements** that appear/disappear based on permissions
- **Request creation and management** demonstrating the approval process

## 🔄 Future Enhancements (Phase 2+)

The current implementation provides a solid foundation for:

1. **Advanced Workflows**: Multi-step approval processes
2. **Dynamic Permissions**: Context-aware permission assignment
3. **Team Management**: Department-based access control
4. **Integration**: Third-party system authentication
5. **Analytics**: Permission usage and security monitoring

## 📚 Technical Reference

### Key Files Structure
```
├── types/auth.ts                     # Core type definitions
├── hooks/useAuth.tsx                 # Authentication management
├── hooks/useApprovalRequests.tsx     # Approval workflow
├── hooks/usePermissions.tsx          # Permission utilities
├── services/authMiddleware.ts        # Backend authorization
├── components/ApprovalRequestsDashboard.tsx  # Demo interface
└── app/(tabs)/index.tsx             # Integration example
```

### Environment Configuration
```typescript
// Required environment variables
EXPO_PUBLIC_API_URL=http://localhost:3000/api
JWT_SECRET=your-secret-key
DB_CONNECTION_STRING=your-database-url
```

This comprehensive RBAC implementation ensures that the Croppo application maintains strict security boundaries while providing intuitive, role-appropriate access to its features. The system is designed to scale and adapt as the application grows and additional features are added.