import { 
  Farm, 
  Field, 
  Crop, 
  Planting, 
  Harvest, 
  Treatment, 
  Fertilization, 
  Irrigation, 
  Task, 
  IPMRecord, 
  BatchOperation,
  InventoryTransaction,
  InventoryMovement,
  InventoryItem,
  FinancialTransaction,
  DashboardMetrics,
  Alert,
  TreatmentSchedule,
  FertilizerPlan,
  IrrigationEvent,
  SensorData,
  ReportConfig,
  AuditLog
} from '../types/operations';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

class OperationsAPI {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Farms API
  async getFarms(): Promise<Farm[]> {
    return this.request<Farm[]>('/farms');
  }

  async createFarm(farm: Omit<Farm, 'id'>): Promise<Farm> {
    return this.request<Farm>('/farms', {
      method: 'POST',
      body: JSON.stringify(farm),
    });
  }

  async updateFarm(id: number, farm: Partial<Farm>): Promise<Farm> {
    return this.request<Farm>(`/farms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(farm),
    });
  }

  async deleteFarm(id: number): Promise<void> {
    return this.request<void>(`/farms/${id}`, {
      method: 'DELETE',
    });
  }

  // Fields API
  async getFields(): Promise<Field[]> {
    return this.request<Field[]>('/fields');
  }

  async getFieldsByFarm(farmId: number): Promise<Field[]> {
    return this.request<Field[]>(`/fields?farmId=${farmId}`);
  }

  async createField(field: Omit<Field, 'id' | 'farmName'>): Promise<Field> {
    return this.request<Field>('/fields', {
      method: 'POST',
      body: JSON.stringify(field),
    });
  }

  async updateField(id: number, field: Partial<Field>): Promise<Field> {
    return this.request<Field>(`/fields/${id}`, {
      method: 'PUT',
      body: JSON.stringify(field),
    });
  }

  async deleteField(id: number): Promise<void> {
    return this.request<void>(`/fields/${id}`, {
      method: 'DELETE',
    });
  }

  // Crops API
  async getCrops(): Promise<Crop[]> {
    return this.request<Crop[]>('/crops');
  }

  async getCropsByField(fieldId: number): Promise<Crop[]> {
    return this.request<Crop[]>(`/crops?fieldId=${fieldId}`);
  }

  async createCrop(crop: Omit<Crop, 'id' | 'fieldName'>): Promise<Crop> {
    return this.request<Crop>('/crops', {
      method: 'POST',
      body: JSON.stringify(crop),
    });
  }

  async updateCrop(id: number, crop: Partial<Crop>): Promise<Crop> {
    return this.request<Crop>(`/crops/${id}`, {
      method: 'PUT',
      body: JSON.stringify(crop),
    });
  }

  async deleteCrop(id: number): Promise<void> {
    return this.request<void>(`/crops/${id}`, {
      method: 'DELETE',
    });
  }

  // Plantings API
  async getPlantings(): Promise<Planting[]> {
    return this.request<Planting[]>('/plantings');
  }

  async createPlanting(planting: Omit<Planting, 'id' | 'fieldName' | 'cropName'>): Promise<Planting> {
    return this.request<Planting>('/plantings', {
      method: 'POST',
      body: JSON.stringify(planting),
    });
  }

  async updatePlanting(id: number, planting: Partial<Planting>): Promise<Planting> {
    return this.request<Planting>(`/plantings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(planting),
    });
  }

  async deletePlanting(id: number): Promise<void> {
    return this.request<void>(`/plantings/${id}`, {
      method: 'DELETE',
    });
  }

  // Harvests API
  async getHarvests(): Promise<Harvest[]> {
    return this.request<Harvest[]>('/harvests');
  }

  async createHarvest(harvest: Omit<Harvest, 'id' | 'fieldName' | 'cropName'>): Promise<Harvest> {
    return this.request<Harvest>('/harvests', {
      method: 'POST',
      body: JSON.stringify(harvest),
    });
  }

  async updateHarvest(id: number, harvest: Partial<Harvest>): Promise<Harvest> {
    return this.request<Harvest>(`/harvests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(harvest),
    });
  }

  async deleteHarvest(id: number): Promise<void> {
    return this.request<void>(`/harvests/${id}`, {
      method: 'DELETE',
    });
  }

  // Treatments API
  async getTreatments(): Promise<Treatment[]> {
    return this.request<Treatment[]>('/operations/treatments');
  }

  async createTreatment(treatment: Omit<Treatment, 'id' | 'fieldName' | 'cropName' | 'productName'>): Promise<Treatment> {
    return this.request<Treatment>('/operations/treatments', {
      method: 'POST',
      body: JSON.stringify(treatment),
    });
  }

  async updateTreatment(id: number, treatment: Partial<Treatment>): Promise<Treatment> {
    return this.request<Treatment>(`/operations/treatments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(treatment),
    });
  }

  async deleteTreatment(id: number): Promise<void> {
    return this.request<void>(`/operations/treatments/${id}`, {
      method: 'DELETE',
    });
  }

  // Fertilizations API
  async getFertilizations(): Promise<Fertilization[]> {
    return this.request<Fertilization[]>('/operations/fertilizations');
  }

  async createFertilization(fertilization: Omit<Fertilization, 'id' | 'fieldName' | 'cropName' | 'productName'>): Promise<Fertilization> {
    return this.request<Fertilization>('/operations/fertilizations', {
      method: 'POST',
      body: JSON.stringify(fertilization),
    });
  }

  async updateFertilization(id: number, fertilization: Partial<Fertilization>): Promise<Fertilization> {
    return this.request<Fertilization>(`/operations/fertilizations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(fertilization),
    });
  }

  async deleteFertilization(id: number): Promise<void> {
    return this.request<void>(`/operations/fertilizations/${id}`, {
      method: 'DELETE',
    });
  }

  // Irrigations API
  async getIrrigations(): Promise<Irrigation[]> {
    return this.request<Irrigation[]>('/operations/irrigations');
  }

  async createIrrigation(irrigation: Omit<Irrigation, 'id' | 'fieldName'>): Promise<Irrigation> {
    return this.request<Irrigation>('/operations/irrigations', {
      method: 'POST',
      body: JSON.stringify(irrigation),
    });
  }

  async updateIrrigation(id: number, irrigation: Partial<Irrigation>): Promise<Irrigation> {
    return this.request<Irrigation>(`/operations/irrigations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(irrigation),
    });
  }

  async deleteIrrigation(id: number): Promise<void> {
    return this.request<void>(`/operations/irrigations/${id}`, {
      method: 'DELETE',
    });
  }

  // Tasks API
  async getTasks(): Promise<Task[]> {
    return this.request<Task[]>('/tasks');
  }

  async createTask(task: Omit<Task, 'id' | 'fieldName'>): Promise<Task> {
    return this.request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async updateTask(id: number, task: Partial<Task>): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    });
  }

  async deleteTask(id: number): Promise<void> {
    return this.request<void>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // IPM API
  async getIPMRecords(): Promise<IPMRecord[]> {
    return this.request<IPMRecord[]>('/ipm/scouting');
  }

  async createIPMRecord(record: Omit<IPMRecord, 'id' | 'fieldName'>): Promise<IPMRecord> {
    return this.request<IPMRecord>('/ipm/scouting', {
      method: 'POST',
      body: JSON.stringify(record),
    });
  }

  async updateIPMRecord(id: number, record: Partial<IPMRecord>): Promise<IPMRecord> {
    return this.request<IPMRecord>(`/ipm/scouting/${id}`, {
      method: 'PUT',
      body: JSON.stringify(record),
    });
  }

  async deleteIPMRecord(id: number): Promise<void> {
    return this.request<void>(`/ipm/scouting/${id}`, {
      method: 'DELETE',
    });
  }

  // Batch Operations API
  async getBatchOperations(): Promise<BatchOperation[]> {
    return this.request<BatchOperation[]>('/operations/batch');
  }

  async createBatchOperation(operation: Omit<BatchOperation, 'id'>): Promise<BatchOperation> {
    return this.request<BatchOperation>('/operations/batch', {
      method: 'POST',
      body: JSON.stringify(operation),
    });
  }

  async updateBatchOperation(id: number, operation: Partial<BatchOperation>): Promise<BatchOperation> {
    return this.request<BatchOperation>(`/operations/batch/${id}`, {
      method: 'PUT',
      body: JSON.stringify(operation),
    });
  }

  async deleteBatchOperation(id: number): Promise<void> {
    return this.request<void>(`/operations/batch/${id}`, {
      method: 'DELETE',
    });
  }

  // Inventory Transactions API
  async createInventoryTransaction(transaction: Omit<InventoryTransaction, 'id'>): Promise<InventoryTransaction> {
    return this.request<InventoryTransaction>('/inventory/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  }

  async getInventoryTransactions(): Promise<InventoryTransaction[]> {
    return this.request<InventoryTransaction[]>('/inventory/transactions');
  }

  // PRD-specified Dashboard API
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    return this.request<DashboardMetrics>('/dashboard');
  }

  // PRD-specified Alerts API
  async getAlerts(): Promise<Alert[]> {
    return this.request<Alert[]>('/alerts');
  }

  // PRD-specified Inventory Movements API
  async getInventoryMovements(): Promise<InventoryMovement[]> {
    return this.request<InventoryMovement[]>('/inventory/movements');
  }

  async createInventoryMovement(movement: Omit<InventoryMovement, 'id'>): Promise<InventoryMovement> {
    return this.request<InventoryMovement>('/inventory/movements', {
      method: 'POST',
      body: JSON.stringify(movement),
    });
  }

  // PRD-specified Financial Transactions API
  async getFinancialTransactions(): Promise<FinancialTransaction[]> {
    return this.request<FinancialTransaction[]>('/transactions');
  }

  async createFinancialTransaction(transaction: Omit<FinancialTransaction, 'id'>): Promise<FinancialTransaction> {
    return this.request<FinancialTransaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  }

  async reconcileTransaction(id: number): Promise<FinancialTransaction> {
    return this.request<FinancialTransaction>(`/transactions/${id}/reconcile`, {
      method: 'PATCH',
    });
  }

  // PRD-specified Treatment Schedules API
  async getTreatmentSchedules(): Promise<TreatmentSchedule[]> {
    return this.request<TreatmentSchedule[]>('/treatments');
  }

  async createTreatmentSchedule(schedule: Omit<TreatmentSchedule, 'id'>): Promise<TreatmentSchedule> {
    return this.request<TreatmentSchedule>('/treatments', {
      method: 'POST',
      body: JSON.stringify(schedule),
    });
  }

  async exportTreatmentHistory(format: 'pdf' | 'excel' | 'csv', fields?: string[]): Promise<Blob> {
    const params = new URLSearchParams();
    params.append('format', format);
    if (fields) {
      params.append('fields', fields.join(','));
    }
    
    return this.request<Blob>(`/treatments/export?${params.toString()}`);
  }

  // PRD-specified Fertilizer Plans API
  async getFertilizerPlans(): Promise<FertilizerPlan[]> {
    return this.request<FertilizerPlan[]>('/fertilizations/plans');
  }

  async createFertilizerPlan(plan: Omit<FertilizerPlan, 'id'>): Promise<FertilizerPlan> {
    return this.request<FertilizerPlan>('/fertilizations/plans', {
      method: 'POST',
      body: JSON.stringify(plan),
    });
  }

  async importSoilTest(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.request<any>('/soiltests', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it for FormData
    });
  }

  // PRD-specified Irrigation Events API
  async getIrrigationEvents(): Promise<IrrigationEvent[]> {
    return this.request<IrrigationEvent[]>('/irrigations');
  }

  async createIrrigationEvent(event: Omit<IrrigationEvent, 'id'>): Promise<IrrigationEvent> {
    return this.request<IrrigationEvent>('/irrigations', {
      method: 'POST',
      body: JSON.stringify(event),
    });
  }

  async overrideIrrigationEvent(id: number): Promise<IrrigationEvent> {
    return this.request<IrrigationEvent>(`/irrigations/${id}/override`, {
      method: 'PATCH',
    });
  }

  async getSensorData(irrigationEventId: number): Promise<SensorData[]> {
    return this.request<SensorData[]>(`/irrigations/${irrigationEventId}/sensors`);
  }

  // PRD-specified Reports API
  async getReportConfigs(): Promise<ReportConfig[]> {
    return this.request<ReportConfig[]>('/reports');
  }

  async generateReport(config: Omit<ReportConfig, 'id'>): Promise<any> {
    return this.request<any>('/reports/generate', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  async previewReport(id: number): Promise<Blob> {
    return this.request<Blob>(`/reports/${id}/preview`);
  }

  async scheduleReport(config: ReportConfig): Promise<ReportConfig> {
    return this.request<ReportConfig>('/reports/schedules', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  // PRD-specified Audit Logs API
  async getAuditLogs(): Promise<AuditLog[]> {
    return this.request<AuditLog[]>('/audit');
  }

  async createAuditLog(log: Omit<AuditLog, 'id'>): Promise<AuditLog> {
    return this.request<AuditLog>('/audit', {
      method: 'POST',
      body: JSON.stringify(log),
    });
  }

  // PRD-specified Ledger API
  async getLedger(account?: string, from?: string, to?: string): Promise<any> {
    const params = new URLSearchParams();
    if (account) params.append('account', account);
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    
    return this.request<any>(`/ledger?${params.toString()}`);
  }

  // PRD-specified Task completion workflow
  async completeTask(id: number): Promise<Task> {
    return this.request<Task>(`/tasks/${id}/complete`, {
      method: 'PATCH',
    });
  }

  // PRD-specified filtered queries
  async getTasksFiltered(field?: string, type?: string, dateFrom?: string, dateTo?: string): Promise<Task[]> {
    const params = new URLSearchParams();
    if (field) params.append('field', field);
    if (type) params.append('type', type);
    if (dateFrom) params.append('date_from', dateFrom);
    if (dateTo) params.append('date_to', dateTo);
    
    return this.request<Task[]>(`/tasks?${params.toString()}`);
  }
}

export const operationsApi = new OperationsAPI();