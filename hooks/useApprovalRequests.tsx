import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ApprovalRequest, RequestStatus } from '../types/auth';
import { useAuth } from './useAuth';

interface ApprovalRequestsContextType {
  requests: ApprovalRequest[];
  isLoading: boolean;
  createRequest: (request: Omit<ApprovalRequest, 'id' | 'requestedBy' | 'requestedByName' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<ApprovalRequest>;
  approveRequest: (requestId: number, comment?: string) => Promise<void>;
  rejectRequest: (requestId: number, reason: string) => Promise<void>;
  getRequestsByStatus: (status: RequestStatus) => ApprovalRequest[];
  getMyRequests: () => ApprovalRequest[];
  getPendingRequestsForApproval: () => ApprovalRequest[];
  refreshRequests: () => Promise<void>;
}

const ApprovalRequestsContext = createContext<ApprovalRequestsContextType | undefined>(undefined);

export const useApprovalRequests = () => {
  const context = useContext(ApprovalRequestsContext);
  if (!context) {
    throw new Error('useApprovalRequests must be used within an ApprovalRequestsProvider');
  }
  return context;
};

export const useApprovalRequestsProvider = () => {
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, canApprove } = useAuth();

  // Mock initial requests for demo
  const initialRequests: ApprovalRequest[] = [
    {
      id: 1,
      type: 'fertilization',
      title: 'Nitrogen Fertilization - Field A',
      description: 'Apply nitrogen fertilizer to Field A to support corn growth during vegetative stage',
      requestedBy: 3,
      requestedByName: 'Field Agronomist',
      status: 'pending',
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2024-01-15T08:00:00Z',
      data: {
        fieldId: 1,
        fieldName: 'Field A',
        fertilizer: 'Urea 46-0-0',
        rate: 150,
        unit: 'kg/ha',
        applicationMethod: 'Broadcast',
        targetDate: '2024-01-20T00:00:00Z'
      },
      estimatedCost: 2500,
      priority: 'medium'
    },
    {
      id: 2,
      type: 'treatment',
      title: 'Pesticide Application - Field B',
      description: 'Apply insecticide treatment for aphid control in soybean field',
      requestedBy: 3,
      requestedByName: 'Field Agronomist',
      status: 'approved',
      createdAt: '2024-01-10T09:00:00Z',
      updatedAt: '2024-01-12T14:30:00Z',
      approvedBy: 2,
      approvedByName: 'Farm Manager',
      approvedAt: '2024-01-12T14:30:00Z',
      data: {
        fieldId: 2,
        fieldName: 'Field B',
        pesticide: 'Lambda-cyhalothrin',
        rate: 0.5,
        unit: 'L/ha',
        targetPest: 'Aphids',
        applicationMethod: 'Spray',
        targetDate: '2024-01-13T00:00:00Z'
      },
      estimatedCost: 1200,
      priority: 'high'
    },
    {
      id: 3,
      type: 'irrigation',
      title: 'Irrigation Schedule - Greenhouse Section 1',
      description: 'Increase irrigation frequency for tomato plants in greenhouse section 1',
      requestedBy: 3,
      requestedByName: 'Field Agronomist',
      status: 'rejected',
      createdAt: '2024-01-08T10:00:00Z',
      updatedAt: '2024-01-09T16:20:00Z',
      rejectedBy: 2,
      rejectedByName: 'Farm Manager',
      rejectedAt: '2024-01-09T16:20:00Z',
      rejectionReason: 'Water allocation already at maximum for this section. Please optimize current schedule first.',
      data: {
        fieldId: 3,
        fieldName: 'Greenhouse Section 1',
        crop: 'Tomatoes',
        currentFrequency: '2 times/day',
        proposedFrequency: '3 times/day',
        duration: 30,
        startDate: '2024-01-10T00:00:00Z'
      },
      estimatedCost: 300,
      priority: 'low'
    }
  ];

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setRequests(initialRequests);
    } catch (error) {
      console.error('Error loading approval requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createRequest = async (
    requestData: Omit<ApprovalRequest, 'id' | 'requestedBy' | 'requestedByName' | 'createdAt' | 'updatedAt' | 'status'>
  ): Promise<ApprovalRequest> => {
    if (!user) {
      throw new Error('User must be authenticated to create requests');
    }

    const newRequest: ApprovalRequest = {
      ...requestData,
      id: Math.max(...requests.map(r => r.id), 0) + 1,
      requestedBy: user.id,
      requestedByName: user.name,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRequests(prev => [newRequest, ...prev]);
    return newRequest;
  };

  const approveRequest = async (requestId: number, comment?: string): Promise<void> => {
    if (!user || !canApprove()) {
      throw new Error('User does not have permission to approve requests');
    }

    setRequests(prev => prev.map(request => 
      request.id === requestId 
        ? {
            ...request,
            status: 'approved' as RequestStatus,
            approvedBy: user.id,
            approvedByName: user.name,
            approvedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        : request
    ));
  };

  const rejectRequest = async (requestId: number, reason: string): Promise<void> => {
    if (!user || !canApprove()) {
      throw new Error('User does not have permission to reject requests');
    }

    if (!reason.trim()) {
      throw new Error('Rejection reason is required');
    }

    setRequests(prev => prev.map(request => 
      request.id === requestId 
        ? {
            ...request,
            status: 'rejected' as RequestStatus,
            rejectedBy: user.id,
            rejectedByName: user.name,
            rejectedAt: new Date().toISOString(),
            rejectionReason: reason,
            updatedAt: new Date().toISOString(),
          }
        : request
    ));
  };

  const getRequestsByStatus = (status: RequestStatus): ApprovalRequest[] => {
    return requests.filter(request => request.status === status);
  };

  const getMyRequests = (): ApprovalRequest[] => {
    if (!user) return [];
    return requests.filter(request => request.requestedBy === user.id);
  };

  const getPendingRequestsForApproval = (): ApprovalRequest[] => {
    if (!user || !canApprove()) return [];
    return requests.filter(request => 
      request.status === 'pending' && request.requestedBy !== user.id
    );
  };

  const refreshRequests = async (): Promise<void> => {
    await loadRequests();
  };

  return {
    requests,
    isLoading,
    createRequest,
    approveRequest,
    rejectRequest,
    getRequestsByStatus,
    getMyRequests,
    getPendingRequestsForApproval,
    refreshRequests,
  };
};

interface ApprovalRequestsProviderProps {
  children: ReactNode;
}

export function ApprovalRequestsProvider({ children }: ApprovalRequestsProviderProps) {
  const value = useApprovalRequestsProvider();
  return (
    <ApprovalRequestsContext.Provider value={value}>
      {children}
    </ApprovalRequestsContext.Provider>
  );
}