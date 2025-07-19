import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type RequestStatus = 'pending' | 'accepted' | 'rejected';
export type RequestType = 'treatment' | 'fertilization';

export interface InventoryRequest {
  id: number;
  type: RequestType;
  operationId: number;
  productId: number;
  quantity: number;
  status: RequestStatus;
  createdAt: string;
  updatedAt?: string;
}

interface RequestQueueContextType {
  requests: InventoryRequest[];
  addRequest: (req: Omit<InventoryRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => number;
  acceptRequest: (id: number) => void;
  rejectRequest: (id: number) => void;
}

const RequestQueueContext = createContext<RequestQueueContextType | undefined>(undefined);

export function RequestQueueProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<InventoryRequest[]>([]);

  const addRequest = useCallback((req: Omit<InventoryRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    const id = Math.max(0, ...requests.map(r => r.id)) + 1;
    setRequests(prev => [
      ...prev,
      {
        ...req,
        id,
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
    ]);
    return id;
  }, [requests]);

  const acceptRequest = useCallback((id: number) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'accepted', updatedAt: new Date().toISOString() } : r));
  }, []);

  const rejectRequest = useCallback((id: number) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected', updatedAt: new Date().toISOString() } : r));
  }, []);

  return (
    <RequestQueueContext.Provider value={{ requests, addRequest, acceptRequest, rejectRequest }}>
      {children}
    </RequestQueueContext.Provider>
  );
}

export function useRequestQueueContext() {
  const context = useContext(RequestQueueContext);
  if (!context) throw new Error('useRequestQueueContext must be used within a RequestQueueProvider');
  return context;
} 