export interface Farm {
  id: number;
  name: string;
  area: number;
  location: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Field {
  id: number;
  name: string;
  farmId: number;
  farmName: string;
  area: number;
  crop?: string;
  variety?: string;
  plantingDate?: string;
  soilType?: string;
  gpsCoordinates?: {
    lat: number;
    lng: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Crop {
  id: number;
  name: string;
  variety: string;
  fieldId: number;
  fieldName: string;
  plantingDate?: string;
  expectedHarvestDate?: string;
  growthStage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Planting {
  id: number;
  date: string;
  fieldId: number;
  fieldName: string;
  cropId: number;
  cropName: string;
  variety: string;
  operator: string;
  density: number;
  spacing: string;
  notes: string;
  seedBatchId?: number;
  quantityUsed?: number;
  gpsLocation?: {
    lat: number;
    lng: number;
  };
  weatherConditions?: string;
  soilConditions?: string;
  attachments: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Harvest {
  id: number;
  date: string;
  fieldId: number;
  fieldName: string;
  cropId: number;
  cropName: string;
  yield: number;
  yieldPerHectare: number;
  moisture: number;
  grade: string;
  operator: string;
  weather: string;
  qualityNotes: string;
  storageLocation?: string;
  marketPrice?: number;
  totalValue?: number;
  attachments: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Treatment {
  id: number;
  date: string;
  fieldId: number;
  fieldName: string;
  cropId: number;
  cropName: string;
  productId: number;
  productName: string;
  target: string;
  rate: number;
  unit: string;
  method: string;
  operator: string;
  effectiveness?: number;
  quantityUsed: number;
  cost?: number;
  weatherConditions?: string;
  windSpeed?: number;
  windDirection?: string;
  temperature?: number;
  humidity?: number;
  attachments: string[];
  taskId?: number; // Link to Task as per PRD
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt?: string;
  updatedAt?: string;
}

export interface Fertilization {
  id: number;
  date: string;
  fieldId: number;
  fieldName: string;
  cropId: number;
  cropName: string;
  productId: number;
  productName: string;
  rate: number;
  unit: string;
  npkRatio: string;
  cost: number;
  operator: string;
  quantityUsed: number;
  applicationMethod: string;
  soilTestRecommendation?: string;
  expectedResponse?: string;
  actualResponse?: string;
  attachments: string[];
  taskId?: number; // Link to Task as per PRD
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt?: string;
  updatedAt?: string;
}

export interface Irrigation {
  id: number;
  date: string;
  fieldId: number;
  fieldName: string;
  duration: number;
  waterApplied: number;
  soilMoisture: string;
  cost: number;
  operator: string;
  method: string;
  flowRate?: number;
  pressure?: number;
  energyCost?: number;
  efficiency?: number;
  weatherConditions?: string;
  taskId?: number; // Link to Task as per PRD
  sensorThreshold?: number; // As per PRD irrigation scheduler
  scheduledStartTime?: string;
  manualOverride?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  type: 'Treatment' | 'Fertilization' | 'Irrigation' | 'Planting' | 'Harvest' | 'Custom';
  dueDate: string;
  dateStart?: string;
  dateEnd?: string;
  assignedUserId?: number; // User assignment as per PRD
  assignee: string;
  status: 'To Do' | 'In Progress' | 'Done';
  priority: 'High' | 'Medium' | 'Low';
  fieldId?: number;
  fieldName?: string;
  gpsLocation?: {
    lat: number;
    lng: number;
  };
  timeSpent?: number;
  laborCost?: number;
  attachments: string[];
  completedDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPMRecord {
  id: number;
  date: string;
  fieldId: number;
  fieldName: string;
  pest: string;
  count: number;
  threshold: number;
  severity: 'Low' | 'Medium' | 'High';
  action: string;
  notes: string;
  treatmentId?: number;
  scoutingMethod?: string;
  weatherConditions?: string;
  cropGrowthStage?: string;
  economicThreshold?: number;
  actionThreshold?: number;
  attachments: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BatchOperation {
  id: number;
  name: string;
  operationType: 'Fertilization' | 'Treatment' | 'Irrigation' | 'Custom';
  fieldIds: number[];
  fieldNames: string[];
  date: string;
  operator: string;
  productId?: number;
  productName?: string;
  rate?: number;
  unit?: string;
  notes: string;
  status: 'Planned' | 'In Progress' | 'Completed';
  totalCost?: number;
  createdAt?: string;
  updatedAt?: string;
}

// PRD-specified InventoryMovement entity
export interface InventoryMovement {
  id: number;
  inventoryItemId: number;
  itemName: string;
  movementType: 'in' | 'out' | 'adjustment';
  quantity: number;
  unit: string;
  cost?: number;
  reason: string;
  operator: string;
  date: string;
  batchNumber?: string;
  expiryDate?: string;
  supplier?: string;
  invoiceNumber?: string;
  taskId?: number; // Link to Task as per PRD
  treatmentId?: number; // Link to Treatment
  fertilizationId?: number; // Link to Fertilization
  createdAt?: string;
  updatedAt?: string;
}

// Enhanced InventoryItem with PRD requirements
export interface InventoryItem {
  id: number;
  name: string;
  category: 'fertilizer' | 'pesticide' | 'seed' | 'equipment' | 'other';
  currentStock: number;
  unit: string;
  reorderThreshold: number;
  reorderQuantity: number;
  costPerUnit: number;
  totalValue: number;
  supplier?: string;
  barcode?: string;
  location?: string;
  msdsInfo?: string; // MSDS information as per PRD
  usageInstructions?: string; // Label info as per PRD
  createdAt?: string;
  updatedAt?: string;
}

// PRD-specified FinancialTransaction entity
export interface FinancialTransaction {
  id: number;
  date: string;
  type: 'expense' | 'income' | 'depreciation';
  amount: number;
  currency: string;
  description: string;
  account: string;
  category: string;
  taskId?: number; // Link to Task as per PRD
  inventoryMovementId?: number; // Link to InventoryMovement as per PRD
  treatmentId?: number;
  fertilizationId?: number;
  irrigationId?: number;
  isReconciled: boolean;
  reconciliationDate?: string;
  attachments: string[];
  createdBy: number; // User ID
  createdAt?: string;
  updatedAt?: string;
}

// Legacy - keeping for backward compatibility
export interface InventoryTransaction {
  id: number;
  itemId: number;
  itemName: string;
  type: 'Stock In' | 'Stock Out' | 'Adjustment';
  quantity: number;
  unit: string;
  reason: string;
  operator: string;
  date: string;
  cost?: number;
  batchNumber?: string;
  expiryDate?: string;
  supplier?: string;
  invoiceNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WeatherData {
  date: string;
  temperature: {
    min: number;
    max: number;
    avg: number;
  };
  humidity: number;
  precipitation: number;
  windSpeed: number;
  windDirection: string;
  pressure: number;
  conditions: string;
}

export interface SoilTest {
  id: number;
  fieldId: number;
  fieldName: string;
  date: string;
  ph: number;
  organicMatter: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  recommendations: string;
  labName: string;
  reportUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

// PRD-specified Dashboard KPI metrics
export interface DashboardMetrics {
  costPerHectare: number;
  waterUsage: number;
  completedTasks: number;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  activeFields: number;
  overdueTasksCount: number;
  lowStockItemsCount: number;
  lastUpdated: string;
}

// PRD-specified Alert system
export interface Alert {
  id: number;
  type: 'overdue_task' | 'low_stock' | 'system' | 'weather';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  entityId?: number;
  entityType?: string;
  isRead: boolean;
  createdAt: string;
  expiresAt?: string;
}

// PRD-specified Treatment Schedule
export interface TreatmentSchedule {
  id: number;
  fieldIds: number[];
  fieldNames: string[];
  cropIds: number[]; // Added for real-time crop selection
  pesticideId: number;
  pesticideName: string;
  dosage: number;
  unit: string;
  scheduledDate: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  createdBy: number;
  notes?: string;
  weatherConditions?: string;
  createdAt?: string;
  updatedAt?: string;
}

// PRD-specified Fertilizer Plan
export interface FertilizerPlan {
  id: number;
  fieldId: number;
  fieldName: string;
  soilTestId?: number;
  recommendedNPK: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
  plannedApplications: {
    date: string;
    fertilizerId: number;
    fertilizerName: string;
    rate: number;
    unit: string;
    cost: number;
  }[];
  totalCost: number;
  status: 'draft' | 'approved' | 'in_progress' | 'completed';
  createdBy: number;
  approvedBy?: number;
  createdAt?: string;
  updatedAt?: string;
}

// PRD-specified Irrigation Event
export interface IrrigationEvent {
  id: number;
  fieldId: number;
  fieldName: string;
  startTime: string;
  duration: number; // in minutes
  sensorThreshold?: number;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  actualStartTime?: string;
  actualDuration?: number;
  waterApplied?: number;
  energyCost?: number;
  manualOverride: boolean;
  createdBy: number;
  createdAt?: string;
  updatedAt?: string;
}

// PRD-specified Sensor Data
export interface SensorData {
  id: number;
  irrigationEventId: number;
  sensorType: 'soil_moisture' | 'temperature' | 'humidity' | 'flow_rate';
  value: number;
  unit: string;
  timestamp: string;
  location?: {
    lat: number;
    lng: number;
  };
}

// PRD-specified Report Configuration
export interface ReportConfig {
  id: number;
  name: string;
  type: 'custom' | 'template';
  modules: string[];
  fields: string[];
  filters: {
    dateFrom?: string;
    dateTo?: string;
    fieldIds?: number[];
    [key: string]: any;
  };
  format: 'pdf' | 'excel' | 'csv';
  isScheduled: boolean;
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
    nextRun?: string;
  };
  createdBy: number;
  createdAt?: string;
  updatedAt?: string;
}

// PRD-specified Audit Log
export interface AuditLog {
  id: number;
  userId: number;
  userName: string;
  action: 'create' | 'update' | 'delete';
  entityType: string;
  entityId: number;
  changes?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}