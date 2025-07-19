import React, { useState } from 'react';
import { useOperationsContext } from '@/hooks/useOperations';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { Calendar, Plus, FileText, Info, Droplets, MapPin, Download, Sprout, Edit3, Trash2, X } from 'lucide-react-native';
import FormField from '@/components/FormField';
import Dropdown from '@/components/Dropdown';
import { useInventoryContext } from '@/hooks/useInventory';
import { useRequestQueueContext } from '@/hooks/useRequestQueue';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function FertilizationTab() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFertilization, setEditingFertilization] = useState<any>(null);
  const [formData, setFormData] = useState({
    date: '',
    fieldId: '',
    cropId: '',
    productId: '',
    rate: '',
    unit: '',
    npkRatio: '',
    cost: '',
    operator: '',
    quantityUsed: '',
    applicationMethod: '',
    notes: '',
  });
  const [activeTab, setActiveTab] = useState('calendar');
  const fertilizationTabs = [
    { id: 'calendar', title: 'Calendar', icon: 'calendar' },
    { id: 'schedule', title: 'Schedule', icon: 'plus' },
    { id: 'history', title: 'History', icon: 'history' },
  ];
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { fertilizations, fields, crops, addFertilization, updateFertilization, deleteFertilization } = useOperationsContext();
  const inventory = useInventoryContext();
  const fertilizers = inventory.inventoryItems.filter(item => item.category.toLowerCase().includes('fertilizer'));
  const requestQueue = useRequestQueueContext();

  const resetForm = () => {
    setFormData({
      date: '',
      fieldId: '',
      cropId: '',
      productId: '',
      rate: '',
      unit: '',
      npkRatio: '',
      cost: '',
      operator: '',
      quantityUsed: '',
      applicationMethod: '',
      notes: '',
    });
    setEditingFertilization(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEdit = (fertilization: any) => {
    setFormData({
      date: fertilization.date,
      fieldId: fertilization.fieldId?.toString() || '',
      cropId: fertilization.cropId?.toString() || '',
      productId: fertilization.productId?.toString() || '',
      rate: fertilization.rate?.toString() || '',
      unit: fertilization.unit,
      npkRatio: fertilization.npkRatio,
      cost: fertilization.cost?.toString() || '',
      operator: fertilization.operator,
      quantityUsed: fertilization.quantityUsed?.toString() || '',
      applicationMethod: fertilization.applicationMethod || '',
      notes: fertilization.notes || '',
    });
    setEditingFertilization(fertilization);
    setShowAddModal(true);
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      'Delete Fertilization',
      'Are you sure you want to delete this fertilization record?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            const result = await deleteFertilization(id);
            if (result) {
              Alert.alert('Success', 'Fertilization deleted successfully');
            }
          }
        },
      ]
    );
  };

  const handleSave = async () => {
    if (!formData.date || !formData.fieldId || !formData.productId || !formData.operator) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const selectedProduct = fertilizers.find(f => f.id.toString() === formData.productId);
    const fertilizationData = {
      date: formData.date,
      fieldId: parseInt(formData.fieldId),
      cropId: formData.cropId ? parseInt(formData.cropId) : undefined,
      productId: selectedProduct ? selectedProduct.id : undefined,
      productName: selectedProduct ? selectedProduct.name : '',
      rate: formData.rate ? parseFloat(formData.rate) : 0,
      unit: formData.unit,
      npkRatio: formData.npkRatio,
      cost: formData.cost ? parseFloat(formData.cost) : 0,
      operator: formData.operator,
      quantityUsed: formData.quantityUsed ? parseFloat(formData.quantityUsed) : 0,
      applicationMethod: formData.applicationMethod,
      notes: formData.notes || '',
      attachments: [],
    };

    let result;
    if (editingFertilization) {
      result = await updateFertilization(editingFertilization.id, fertilizationData);
    } else {
      result = await addFertilization(fertilizationData);
    }

    if (result) {
      setShowAddModal(false);
      resetForm();
      Alert.alert('Success', `Fertilization ${editingFertilization ? 'updated' : 'added'} successfully`);
      if (selectedProduct && formData.quantityUsed) {
        requestQueue.addRequest({
          type: 'fertilization',
          operationId: Date.now(), // Use timestamp as a unique operation id for now
          productId: selectedProduct.id,
          quantity: parseFloat(formData.quantityUsed),
        });
      }
    }
  };

  const fieldOptions = fields.map((field: any) => ({ 
    label: `${field.name} (${field.farmName})`, 
    value: field.id.toString() 
  }));

  const cropOptions = crops.map((crop: any) => ({ 
    label: `${crop.name} - ${crop.variety}`, 
    value: crop.id.toString() 
  }));

  const methodOptions = [
    { label: 'Broadcast', value: 'Broadcast' },
    { label: 'Band Application', value: 'Band Application' },
    { label: 'Foliar Spray', value: 'Foliar Spray' },
    { label: 'Fertigation', value: 'Fertigation' },
    { label: 'Side Dress', value: 'Side Dress' },
  ];

  const unitOptions = [
    { label: 'kg/ha', value: 'kg/ha' },
    { label: 'L/ha', value: 'L/ha' },
    { label: 'g/ha', value: 'g/ha' },
    { label: 'mL/ha', value: 'mL/ha' },
  ];

  const renderTabButton = (tab: any) => (
    <TouchableOpacity
      key={tab.id}
      style={[styles.tabButton, activeTab === tab.id && styles.tabButtonActive]}
      onPress={() => setActiveTab(tab.id)}
    >
      <View style={styles.tabIcon}>
        {tab.icon === 'calendar' && <Calendar size={20} color={activeTab === tab.id ? '#FFFFFF' : '#6B7280'} />}
        {tab.icon === 'plus' && <Plus size={20} color={activeTab === tab.id ? '#FFFFFF' : '#6B7280'} />}
        {tab.icon === 'history' && <FileText size={20} color={activeTab === tab.id ? '#FFFFFF' : '#6B7280'} />}
      </View>
      <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
        {tab.title}
      </Text>
    </TouchableOpacity>
  );

  // 2. Calendar sub-tab (card-based)
  const renderCalendarView = () => (
    <View style={styles.contentContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Fertilization Calendar</Text>
        <TouchableOpacity style={styles.scheduleButton} onPress={() => setShowAddModal(true)}>
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.scheduleButtonText}>Schedule Fertilization</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
        {fertilizations.map((fertilization: any) => (
          <View key={fertilization.id} style={styles.fertilizationCard}>
            <View style={styles.fertilizationHeader}>
              <View style={styles.fertilizationInfo}>
                <Text style={styles.fertilizationDate}>{fertilization.date}</Text>
                <Text style={styles.fertilizationName}>{fertilization.productName || (inventory.inventoryItems.find(f => f.id === fertilization.productId)?.name || '')}</Text>
              </View>
              <View style={styles.statusBadge}><Text style={styles.statusText}>Scheduled</Text></View>
            </View>
            <View style={styles.fertilizationDetails}>
              <View style={styles.detailRow}>
                <MapPin size={16} color="#6B7280" />
                <Text style={styles.detailText}>{fertilization.fieldName}</Text>
              </View>
              {fertilization.npkRatio && (
                <View style={styles.detailRow}>
                  <Droplets size={16} color="#6B7280" />
                  <Text style={styles.detailText}>NPK: {fertilization.npkRatio}</Text>
                </View>
              )}
              <View style={styles.detailRow}>
                <Sprout size={16} color="#6B7280" />
                <Text style={styles.detailText}>{fertilization.rate} {fertilization.unit}</Text>
              </View>
              {fertilization.applicationMethod && (
                <View style={styles.detailRow}>
                  <Info size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{fertilization.applicationMethod}</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  // 3. Schedule sub-tab (modal form, matches Treatments)
  const renderScheduleForm = () => (
    <Modal visible={showAddModal || activeTab === 'schedule'} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Schedule Fertilization</Text>
          <TouchableOpacity onPress={() => { setShowAddModal(false); setActiveTab('calendar'); }}>
            <Text style={styles.modalClose}>Cancel</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.modalContent}>
          <View style={styles.formGroup}><Text style={styles.formLabel}>Select Fields *</Text>
            <Dropdown label="Field *" options={fieldOptions} value={formData.fieldId} onSelect={(value) => setFormData({ ...formData, fieldId: value })} placeholder="Select field" required />
          </View>
          <View style={styles.formGroup}><Text style={styles.formLabel}>Select Crops</Text>
            <Dropdown label="Crop" options={cropOptions} value={formData.cropId} onSelect={(value) => setFormData({ ...formData, cropId: value })} placeholder="Select crop" />
          </View>
          <View style={styles.formGroup}><Text style={styles.formLabel}>Select Fertilizer *</Text>
            {fertilizers.map((fertilizer) => (
              <TouchableOpacity key={fertilizer.id} style={[styles.pesticideItem, formData.productId === fertilizer.id.toString() && styles.pesticideSelected]} onPress={() => setFormData({ ...formData, productId: fertilizer.id.toString() })}>
                <View style={styles.pesticideInfo}>
                  <Text style={styles.pesticideName}>{fertilizer.name}</Text>
                  <Text style={styles.pesticideStock}>Stock: {fertilizer.currentStock} {fertilizer.unit}</Text>
                </View>
                <TouchableOpacity>
                  <Info size={20} color="#3B82F6" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.formGroup}><Text style={styles.formLabel}>Dosage (kg/ha) *</Text>
            <FormField label="Rate *" value={formData.rate} onChangeText={(text) => setFormData({ ...formData, rate: text })} placeholder="Enter application rate" keyboardType="numeric" required />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Scheduled Date *</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.formInput}>
              <Text>{formData.date}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={new Date(formData.date)}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setFormData(prev => ({ ...prev, date: selectedDate.toISOString().split('T')[0] }));
                  }
                }}
              />
            )}
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Quantity Used *</Text>
            <FormField
              label="Quantity Used *"
              value={formData.quantityUsed}
              onChangeText={text => setFormData(prev => ({ ...prev, quantityUsed: text }))}
              placeholder="Enter quantity used"
              keyboardType="numeric"
              required
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Notes</Text>
            <FormField
              label="Notes"
              value={formData.notes}
              onChangeText={(text) => setFormData({ ...formData, notes: text })}
              placeholder="Fertilization notes..."
              multiline
            />
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Schedule Fertilization</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );

  // 4. History sub-tab (card-based, like Calendar)
  const renderHistoryView = () => (
    <View style={styles.contentContainer}>
      <View style={styles.headerRow}><Text style={styles.sectionTitle}>Fertilization History</Text></View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
        {fertilizations.map((fertilization: any) => (
          <View key={fertilization.id} style={styles.fertilizationCard}>
            <View style={styles.fertilizationHeader}>
              <View style={styles.fertilizationInfo}>
                <Text style={styles.fertilizationDate}>{fertilization.date}</Text>
                <Text style={styles.fertilizationName}>{fertilization.productName || (inventory.inventoryItems.find(f => f.id === fertilization.productId)?.name || '')}</Text>
              </View>
              <View style={styles.statusBadge}><Text style={styles.statusText}>Completed</Text></View>
            </View>
            <View style={styles.fertilizationDetails}>
              <View style={styles.detailRow}>
                <MapPin size={16} color="#6B7280" />
                <Text style={styles.detailText}>{fertilization.fieldName}</Text>
              </View>
              {fertilization.npkRatio && (
                <View style={styles.detailRow}>
                  <Droplets size={16} color="#6B7280" />
                  <Text style={styles.detailText}>NPK: {fertilization.npkRatio}</Text>
                </View>
              )}
              <View style={styles.detailRow}>
                <Sprout size={16} color="#6B7280" />
                <Text style={styles.detailText}>{fertilization.rate} {fertilization.unit}</Text>
              </View>
              {fertilization.applicationMethod && (
                <View style={styles.detailRow}>
                  <Info size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{fertilization.applicationMethod}</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  // 5. Main return
  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <View style={styles.header}><Text style={styles.title}>Fertilization Planner</Text></View>
      <View style={styles.tabContainer}><ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>{fertilizationTabs.map(renderTabButton)}</ScrollView></View>
      {activeTab === 'calendar' && renderCalendarView()}
      {activeTab === 'schedule' && renderScheduleForm()}
      {activeTab === 'history' && renderHistoryView()}
      {/* Add/Edit Modal */}
      <Modal visible={showAddModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingFertilization ? 'Edit Fertilization' : 'Schedule Fertilization'}
            </Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={{ color: '#3B82F6', fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.sectionHeader}>Select Field *</Text>
            <Dropdown
              label="Field"
              options={fieldOptions}
              value={formData.fieldId}
              onSelect={(value) => setFormData({ ...formData, fieldId: value })}
              placeholder="Select field"
              required
            />
            <Text style={styles.sectionHeader}>Select Crop</Text>
            <Dropdown
              label="Crop"
              options={cropOptions}
              value={formData.cropId}
              onSelect={(value) => setFormData({ ...formData, cropId: value })}
              placeholder="Select crop"
            />
            <Text style={styles.sectionHeader}>Select Fertilizer *</Text>
            <View style={styles.fertilizerList}>
              {fertilizers.map((f) => (
                <TouchableOpacity
                  key={f.id}
                  style={[
                    styles.fertilizerCard,
                    formData.productId === f.id.toString() && styles.fertilizerCardSelected
                  ]}
                  onPress={() => setFormData({ ...formData, productId: f.id.toString() })}
                >
                  <Text style={styles.fertilizerName}>{f.name}</Text>
                  <Text style={styles.fertilizerStock}>Stock: {f.currentStock} {f.unit || ''}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.sectionHeader}>Fertilization Details</Text>
            <FormField
              label="Date"
              value={formData.date}
              onChangeText={(text) => setFormData({ ...formData, date: text })}
              placeholder="YYYY-MM-DD"
              required
            />
            <FormField
              label="Rate"
              value={formData.rate}
              onChangeText={(text) => setFormData({ ...formData, rate: text })}
              placeholder="Enter application rate"
              keyboardType="numeric"
              required
            />
            <Dropdown
              label="Unit"
              options={unitOptions}
              value={formData.unit}
              onSelect={(value) => setFormData({ ...formData, unit: value })}
              placeholder="Select unit"
              required
            />
            <FormField
              label="NPK Ratio"
              value={formData.npkRatio}
              onChangeText={(text) => setFormData({ ...formData, npkRatio: text })}
              placeholder="Enter NPK ratio"
            />
            <FormField
              label="Cost"
              value={formData.cost}
              onChangeText={(text) => setFormData({ ...formData, cost: text })}
              placeholder="Enter cost"
              keyboardType="numeric"
            />
            <FormField
              label="Operator"
              value={formData.operator}
              onChangeText={(text) => setFormData({ ...formData, operator: text })}
              placeholder="Enter operator name"
              required
            />
            <FormField
              label="Quantity Used"
              value={formData.quantityUsed}
              onChangeText={(text) => setFormData({ ...formData, quantityUsed: text })}
              placeholder="Enter quantity used"
              keyboardType="numeric"
            />
            <Dropdown
              label="Application Method"
              options={methodOptions}
              value={formData.applicationMethod}
              onSelect={(value) => setFormData({ ...formData, applicationMethod: value })}
              placeholder="Select application method"
            />
            <FormField
              label="Notes"
              value={formData.notes}
              onChangeText={(text) => setFormData({ ...formData, notes: text })}
              placeholder="Enter notes"
              multiline
            />
          </ScrollView>
          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setShowAddModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>
                {editingFertilization ? 'Update' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    margin: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tableHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  table: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  tableCellHeader: {
    fontWeight: '600',
    color: '#374151',
    backgroundColor: '#F9FAFB',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#10B981',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 10,
  },
  tabButtonActive: {
    backgroundColor: '#10B981',
  },
  tabIcon: {
    marginRight: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  tabContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  tabScroll: {
    // Add any specific styles for the ScrollView if needed
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  scheduleButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  fertilizationCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  fertilizationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  fertilizationInfo: {
    flex: 1,
  },
  fertilizationDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  fertilizationName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: '#E0F2FE',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  fertilizationDetails: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
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
  pesticideItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  pesticideSelected: {
    backgroundColor: '#E0F2FE',
    borderColor: '#3B82F6',
    borderWidth: 1,
  },
  pesticideInfo: {
    flex: 1,
  },
  pesticideName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  pesticideStock: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  modalClose: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111827',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 20,
    marginBottom: 10,
  },
  fertilizerList: {
    marginBottom: 16,
  },
  fertilizerCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  fertilizerCardSelected: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  fertilizerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  fertilizerStock: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
});