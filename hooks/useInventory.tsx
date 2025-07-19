import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { InventoryItem as InventoryItemType } from '../types/operations';

export type InventoryItem = InventoryItemType;

const mockInventory: InventoryItem[] = [
  {
    id: 1,
    name: 'NPK Fertilizer 20-10-10',
    category: 'fertilizer',
    currentStock: 150,
    unit: 'kg',
    reorderThreshold: 50,
    reorderQuantity: 200,
    costPerUnit: 2.5,
    totalValue: 375,
    supplier: 'AgriSupply Co.',
    barcode: '123456789012',
    location: 'Warehouse A-1',
  },
  {
    id: 2,
    name: 'Organic Pesticide BT',
    category: 'pesticide',
    currentStock: 25,
    unit: 'L',
    reorderThreshold: 30,
    reorderQuantity: 50,
    costPerUnit: 45.0,
    totalValue: 1125,
    supplier: 'BioControl Ltd.',
    barcode: '234567890123',
    location: 'Chemical Store B-2',
  },
  {
    id: 3,
    name: 'Tomato Seeds - Hybrid Variety',
    category: 'seed',
    currentStock: 500,
    unit: 'packs',
    reorderThreshold: 100,
    reorderQuantity: 300,
    costPerUnit: 12.0,
    totalValue: 6000,
    supplier: 'Premium Seeds Inc.',
    barcode: '345678901234',
    location: 'Seed Storage C-1',
  },
  {
    id: 4,
    name: 'Irrigation Pipes 4-inch',
    category: 'equipment',
    currentStock: 12,
    unit: 'pcs',
    reorderThreshold: 20,
    reorderQuantity: 50,
    costPerUnit: 85.0,
    totalValue: 1020,
    supplier: 'IrriTech Solutions',
    barcode: '456789012345',
    location: 'Equipment Yard D-1',
  },
];

interface InventoryContextType {
  inventoryItems: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (id: number, item: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: number) => void;
  deductInventoryQuantity: (itemId: number, quantity: number) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(mockInventory);

  const addInventoryItem = useCallback((item: Omit<InventoryItem, 'id'>) => {
    setInventoryItems(prev => [
      ...prev,
      { ...item, id: Math.max(0, ...prev.map(i => i.id)) + 1 },
    ]);
  }, []);

  const updateInventoryItem = useCallback((id: number, item: Partial<InventoryItem>) => {
    setInventoryItems(prev => prev.map(i => (i.id === id ? { ...i, ...item } : i)));
  }, []);

  const deleteInventoryItem = useCallback((id: number) => {
    setInventoryItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const deductInventoryQuantity = useCallback((itemId: number, quantity: number) => {
    setInventoryItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, currentStock: Math.max(0, item.currentStock - quantity) } : item
    ));
  }, []);

  return (
    <InventoryContext.Provider value={{ inventoryItems, addInventoryItem, updateInventoryItem, deleteInventoryItem, deductInventoryQuantity }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventoryContext() {
  const context = useContext(InventoryContext);
  if (!context) throw new Error('useInventoryContext must be used within an InventoryProvider');
  return context;
} 