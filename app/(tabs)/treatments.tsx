import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Modal, TextInput, Alert } from 'react-native';
import { Calendar, Plus, FileText, History, Info, Bug, Droplets, MapPin, Clock, User, DollarSign, Download, Sprout } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { TreatmentSchedule, InventoryItem, Field } from '@/types/operations';
import { useOperationsContext } from '@/hooks/useOperations';
import { useInventoryContext } from '@/hooks/useInventory';
import { useRequestQueueContext } from '@/hooks/useRequestQueue';
import DateTimePicker from '@react-native-community/datetimepicker';
import Dropdown from '@/components/Dropdown'; // Added Dropdown import

const treatmentTabs = [
  { id: 'calendar', title: 'Calendar', icon: 'calendar' },
  { id: 'schedule', title: 'Schedule', icon: 'plus' },
  { id: 'history', title: 'History', icon: 'history' },
];

// Mock data - in real app, this would come from API
const mockPesticides: InventoryItem[] = [
  {
    id: 1,
    name: 'Organic Pesticide BT',
    category: 'pesticide',
    currentStock: 25,
    unit: 'L',
    reorderThreshold: 30,
    reorderQuantity: 50,
    costPerUnit: 45.00,
    totalValue: 1125,
    msdsInfo: 'Bacillus thuringiensis-based organic pesticide. Safe for beneficial insects when used as directed.',
    usageInstructions: 'Apply 2-3 L/ha during early morning or evening. Do not apply during flowering period.',
  },
  {
    id: 2,
    name: 'Neem Oil Concentrate',
    category: 'pesticide',
    currentStock: 40,
    unit: 'L',
    reorderThreshold: 20,
    reorderQuantity: 60,
    costPerUnit: 32.50,
    totalValue: 1300,
    msdsInfo: 'Natural neem-based pesticide. Biodegradable and safe for organic farming.',
    usageInstructions: 'Mix 1-2 L per 100L water. Apply weekly during pest activity periods.',
  },
];

const mockTreatmentSchedules: TreatmentSchedule[] = [
  {
    id: 1,
    fieldIds: [1, 2],
    fieldNames: ['Field A', 'Field B'],
    cropIds: [1, 2], // Added cropIds
    pesticideId: 1,
    pesticideName: 'Organic Pesticide BT',
    dosage: 2.5,
    unit: 'L/ha',
    scheduledDate: '2025-01-20',
    status: 'scheduled',
    createdBy: 1,
    notes: 'Target aphids and caterpillars',
    weatherConditions: 'Clear, low wind',
  },
  {
    id: 2,
    fieldIds: [3],
    fieldNames: ['Field C'],
    cropIds: [3], // Added cropIds
    pesticideId: 2,
    pesticideName: 'Neem Oil Concentrate',
    dosage: 1.5,
    unit: 'L/ha',
    scheduledDate: '2025-01-22',
    status: 'in_progress',
    createdBy: 1,
    notes: 'Preventive treatment for spider mites',
  },
];

export default function TreatmentPlanner() {
  const [activeTab, setActiveTab] = useState('calendar');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showMSDSModal, setShowMSDSModal] = useState(false);
  const [selectedPesticide, setSelectedPesticide] = useState<InventoryItem | null>(null);
  // In scheduleForm, use fieldId and cropId as strings
  const [scheduleForm, setScheduleForm] = useState({
    fieldId: '',
    cropId: '',
    pesticideId: 0,
    dosage: '',
    scheduledDate: '',
    notes: '',
    quantityUsed: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const { hasPermission } = useAuth();
  const canCreateTreatment = hasPermission('treatments', 'create');
  const canExportData = hasPermission('treatments', 'export');

  const operations = useOperationsContext();
  const fields = operations.fields;
  const crops = operations.crops;
  const inventory = useInventoryContext();
  const pesticides = inventory.inventoryItems.filter(item => item.category.toLowerCase().includes('pesticide'));
  const requestQueue = useRequestQueueContext();

  // Build fieldOptions and cropOptions from context
  const fieldOptions = fields.map((field: any) => ({
    label: `${field.name} (${field.farmName})`,
    value: field.id.toString(),
  }));
  const cropOptions = crops.map((crop: any) => ({
    label: `${crop.name} - ${crop.variety}`,
    value: crop.id.toString(),
  }));

  const renderTabButton = (tab: any) => (
    <TouchableOpacity
      key={tab.id}
      style={[styles.tabButton, activeTab === tab.id && styles.tabButtonActive]}
      onPress={() => setActiveTab(tab.id)}
    >
      <View style={styles.tabIcon}>
        {tab.icon === 'calendar' && <Calendar size={20} color={activeTab === tab.id ? '#FFFFFF' : '#6B7280'} />}
        {tab.icon === 'plus' && <Plus size={20} color={activeTab === tab.id ? '#FFFFFF' : '#6B7280'} />}
        {tab.icon === 'history' && <History size={20} color={activeTab === tab.id ? '#FFFFFF' : '#6B7280'} />}
      </View>
      <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
        {tab.title}
      </Text>
    </TouchableOpacity>
  );

  const handleScheduleTreatment = () => {
    if (!canCreateTreatment) {
      Alert.alert('Permission Denied', 'You do not have permission to schedule treatments.');
      return;
    }
    setShowScheduleModal(true);
  };

  const handleSaveSchedule = () => {
    // Validate form
    if (!scheduleForm.fieldId || !scheduleForm.pesticideId || !scheduleForm.dosage || !scheduleForm.scheduledDate) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    // Add a pending inventory request instead of deducting inventory
    const selectedPesticide = pesticides.find(p => p.id === scheduleForm.pesticideId);
    if (selectedPesticide) {
      const qty = parseFloat(scheduleForm.quantityUsed) || 1;
      requestQueue.addRequest({
        type: 'treatment',
        operationId: Date.now(), // Use timestamp as a unique operation id for now
        productId: selectedPesticide.id,
        quantity: qty,
      });
    }
    // Reset form and close modal
    setScheduleForm({
      fieldId: '',
      cropId: '',
      pesticideId: 0,
      dosage: '',
      scheduledDate: '',
      notes: '',
      quantityUsed: '',
    });
    setShowScheduleModal(false);
    Alert.alert('Success', 'Treatment scheduled successfully!');
  };

  const showMSDSInfo = (pesticide: InventoryItem) => {
    setSelectedPesticide(pesticide);
    setShowMSDSModal(true);
  };

  const exportTreatmentHistory = () => {
    if (!canExportData) {
      Alert.alert('Permission Denied', 'You do not have permission to export data.');
      return;
    }
    
    // In real app, this would call GET /api/treatments/export?format=pdf
    Alert.alert('Export', 'Treatment history exported successfully!');
  };

  const renderCalendarView = () => (
    <View style={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Treatment Calendar</Text>
        {canCreateTreatment && (
          <TouchableOpacity style={styles.scheduleButton} onPress={handleScheduleTreatment}>
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.scheduleButtonText}>Schedule Treatment</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.calendarContainer}>
        {mockTreatmentSchedules.map((schedule) => (
          <View key={schedule.id} style={styles.treatmentCard}>
            <View style={styles.treatmentHeader}>
              <View style={styles.treatmentInfo}>
                <Text style={styles.treatmentDate}>{schedule.scheduledDate}</Text>
                <Text style={styles.treatmentName}>{schedule.pesticideName}</Text>
              </View>
              <View style={[styles.statusBadge, 
                schedule.status === 'scheduled' && styles.statusScheduled,
                schedule.status === 'in_progress' && styles.statusInProgress,
                schedule.status === 'completed' && styles.statusCompleted
              ]}>
                <Text style={styles.statusText}>{schedule.status.replace('_', ' ')}</Text>
              </View>
            </View>

            <View style={styles.treatmentDetails}>
              <View style={styles.detailRow}>
                <MapPin size={16} color="#6B7280" />
                <Text style={styles.detailText}>{schedule.fieldNames.join(', ')}</Text>
              </View>
              {schedule.cropIds && schedule.cropIds.length > 0 && (
                <View style={styles.detailRow}>
                  <Sprout size={16} color="#6B7280" />
                  <Text style={styles.detailText}>
                    {schedule.cropIds.map(
                      (id: number) => (operations.crops.find(c => c.id === id)?.name || '')
                    ).join(', ')}
                  </Text>
                </View>
              )}
              <View style={styles.detailRow}>
                <Droplets size={16} color="#6B7280" />
                <Text style={styles.detailText}>{schedule.dosage} {schedule.unit}</Text>
              </View>
              {schedule.notes && (
                <View style={styles.detailRow}>
                  <FileText size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{schedule.notes}</Text>
                </View>
              )}
            </View>

            <View style={styles.treatmentActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => showMSDSInfo(mockPesticides.find(p => p.id === schedule.pesticideId)!)}
              >
                <Info size={16} color="#3B82F6" />
                <Text style={styles.actionButtonText}>Label Info</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderScheduleForm = () => (
    <Modal visible={showScheduleModal} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Schedule Treatment</Text>
          <TouchableOpacity onPress={() => setShowScheduleModal(false)}>
            <Text style={styles.modalClose}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Select Field *</Text>
            <Dropdown
              label="Field *"
              options={fieldOptions}
              value={scheduleForm.fieldId}
              onSelect={value => setScheduleForm(prev => ({ ...prev, fieldId: value }))}
              placeholder="Select field"
              required
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Select Crop</Text>
            <Dropdown
              label="Crop"
              options={cropOptions}
              value={scheduleForm.cropId}
              onSelect={value => setScheduleForm(prev => ({ ...prev, cropId: value }))}
              placeholder="Select crop"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Select Pesticide *</Text>
            <View style={styles.pesticideContainer}>
              {pesticides.map((pesticide) => (
                <TouchableOpacity
                  key={pesticide.id}
                  style={[styles.pesticideItem, scheduleForm.pesticideId === pesticide.id && styles.pesticideSelected]}
                  onPress={() => setScheduleForm(prev => ({ ...prev, pesticideId: pesticide.id }))}
                >
                  <View style={styles.pesticideInfo}>
                    <Text style={styles.pesticideName}>{pesticide.name}</Text>
                    <Text style={styles.pesticideStock}>Stock: {pesticide.currentStock} {pesticide.unit}</Text>
                  </View>
                  <TouchableOpacity onPress={() => showMSDSInfo(pesticide)}>
                    <Info size={20} color="#3B82F6" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Dosage (L/ha) *</Text>
            <TextInput
              style={styles.formInput}
              value={scheduleForm.dosage}
              onChangeText={(text) => setScheduleForm(prev => ({ ...prev, dosage: text }))}
              placeholder="Enter dosage"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Scheduled Date *</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.formInput}>
              <Text>{scheduleForm.scheduledDate}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={new Date(scheduleForm.scheduledDate)}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setScheduleForm(prev => ({ ...prev, scheduledDate: selectedDate.toISOString().split('T')[0] }));
                  }
                }}
              />
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Quantity Used *</Text>
            <TextInput
              style={styles.formInput}
              value={scheduleForm.quantityUsed}
              onChangeText={text => setScheduleForm(prev => ({ ...prev, quantityUsed: text }))}
              placeholder="Enter quantity used"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Notes</Text>
            <TextInput
              style={[styles.formInput, styles.textArea]}
              value={scheduleForm.notes}
              onChangeText={(text) => setScheduleForm(prev => ({ ...prev, notes: text }))}
              placeholder="Treatment notes..."
              multiline
              numberOfLines={3}
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveSchedule}>
            <Text style={styles.saveButtonText}>Schedule Treatment</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderMSDSModal = () => (
    <Modal visible={showMSDSModal} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Label Information</Text>
          <TouchableOpacity onPress={() => setShowMSDSModal(false)}>
            <Text style={styles.modalClose}>Close</Text>
          </TouchableOpacity>
        </View>

        {selectedPesticide && (
          <ScrollView style={styles.modalContent}>
            <View style={styles.msdsContainer}>
              <Text style={styles.msdsTitle}>{selectedPesticide.name}</Text>
              
              <View style={styles.msdsSection}>
                <Text style={styles.msdsSectionTitle}>MSDS Information</Text>
                <Text style={styles.msdsText}>{selectedPesticide.msdsInfo}</Text>
              </View>

              <View style={styles.msdsSection}>
                <Text style={styles.msdsSectionTitle}>Usage Instructions</Text>
                <Text style={styles.msdsText}>{selectedPesticide.usageInstructions}</Text>
              </View>

              <View style={styles.msdsSection}>
                <Text style={styles.msdsSectionTitle}>Stock Information</Text>
                <Text style={styles.msdsText}>
                  Current Stock: {selectedPesticide.currentStock} {selectedPesticide.unit}
                </Text>
                <Text style={styles.msdsText}>
                  Cost per Unit: ${selectedPesticide.costPerUnit}
                </Text>
              </View>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );

  const renderHistoryView = () => (
    <View style={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Treatment History</Text>
        {canExportData && (
          <TouchableOpacity style={styles.exportButton} onPress={exportTreatmentHistory}>
            <Download size={20} color="#FFFFFF" />
            <Text style={styles.exportButtonText}>Export</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.historyContainer}>
        <View style={styles.historyTable}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Date</Text>
            <Text style={styles.tableHeaderText}>Field</Text>
            <Text style={styles.tableHeaderText}>Product</Text>
            <Text style={styles.tableHeaderText}>Status</Text>
          </View>
          
          {mockTreatmentSchedules.map((schedule) => (
            <View key={schedule.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{schedule.scheduledDate}</Text>
              <Text style={styles.tableCell}>{schedule.fieldNames.join(', ')}</Text>
              <Text style={styles.tableCell}>{schedule.pesticideName}</Text>
              <Text style={[styles.tableCell, styles.statusCell]}>{schedule.status}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Treatment Planner</Text>
      </View>

      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
          {treatmentTabs.map(renderTabButton)}
        </ScrollView>
      </View>

      {activeTab === 'calendar' && renderCalendarView()}
      {activeTab === 'schedule' && renderScheduleForm()}
      {activeTab === 'history' && renderHistoryView()}
      
      {renderScheduleForm()}
      {renderMSDSModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  tabContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabScroll: {
    paddingHorizontal: 20,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  tabButtonActive: {
    backgroundColor: '#10B981',
  },
  tabIcon: {
    marginRight: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  scheduleButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  exportButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  calendarContainer: {
    flex: 1,
    marginTop: 16,
  },
  treatmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  treatmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  treatmentInfo: {
    flex: 1,
  },
  treatmentDate: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  treatmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusScheduled: {
    backgroundColor: '#FEF3C7',
  },
  statusInProgress: {
    backgroundColor: '#DBEAFE',
  },
  statusCompleted: {
    backgroundColor: '#D1FAE5',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  treatmentDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  treatmentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#3B82F6',
    marginLeft: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  modalClose: {
    fontSize: 16,
    color: '#3B82F6',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  checkboxContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checkboxMark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#111827',
  },
  pesticideContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
  },
  pesticideItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#F9FAFB',
  },
  pesticideSelected: {
    backgroundColor: '#EDF2F7',
    borderWidth: 2,
    borderColor: '#10B981',
  },
  pesticideInfo: {
    flex: 1,
  },
  pesticideName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  pesticideStock: {
    fontSize: 14,
    color: '#6B7280',
  },
  saveButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  msdsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
  },
  msdsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 20,
  },
  msdsSection: {
    marginBottom: 20,
  },
  msdsSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  msdsText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  historyContainer: {
    flex: 1,
    marginTop: 16,
  },
  historyTable: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
  },
  statusCell: {
    textTransform: 'capitalize',
  },
});