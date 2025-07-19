import React, { useState } from 'react';
import { useOperationsContext } from '@/hooks/useOperations';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { Calendar, Plus, FileText, Info, Droplets, MapPin, Download, Sprout, Edit3, Trash2, X } from 'lucide-react-native';
import FormField from '@/components/FormField';
import Dropdown from '@/components/Dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function IrrigationTab() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIrrigation, setEditingIrrigation] = useState<any>(null);
  const [formData, setFormData] = useState({
    date: '',
    fieldId: '',
    duration: '',
    waterApplied: '',
    soilMoisture: '',
    cost: '',
    operator: '',
    method: '',
    flowRate: '',
    pressure: '',
    weatherConditions: '',
    quantityUsed: '',
  });
  const [activeTab, setActiveTab] = useState('calendar');
  const irrigationTabs = [
    { id: 'calendar', title: 'Calendar', icon: 'calendar' },
    { id: 'schedule', title: 'Schedule', icon: 'plus' },
    { id: 'history', title: 'History', icon: 'history' },
  ];
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { irrigations, fields, addIrrigation, updateIrrigation, deleteIrrigation } = useOperationsContext();

  const resetForm = () => {
    setFormData({
      date: '',
      fieldId: '',
      duration: '',
      waterApplied: '',
      soilMoisture: '',
      cost: '',
      operator: '',
      method: '',
      flowRate: '',
      pressure: '',
      weatherConditions: '',
      quantityUsed: '',
    });
    setEditingIrrigation(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEdit = (irrigation: any) => {
    setFormData({
      date: irrigation.date,
      fieldId: irrigation.fieldId?.toString() || '',
      duration: irrigation.duration?.toString() || '',
      waterApplied: irrigation.waterApplied?.toString() || '',
      soilMoisture: irrigation.soilMoisture,
      cost: irrigation.cost?.toString() || '',
      operator: irrigation.operator,
      method: irrigation.method,
      flowRate: irrigation.flowRate?.toString() || '',
      pressure: irrigation.pressure?.toString() || '',
      weatherConditions: irrigation.weatherConditions || '',
      quantityUsed: irrigation.quantityUsed?.toString() || '',
    });
    setEditingIrrigation(irrigation);
    setShowAddModal(true);
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      'Delete Irrigation',
      'Are you sure you want to delete this irrigation record?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            const result = await deleteIrrigation(id);
            if (result) {
              Alert.alert('Success', 'Irrigation deleted successfully');
            }
          }
        },
      ]
    );
  };

  const handleSave = async () => {
    if (!formData.date || !formData.fieldId || !formData.duration || !formData.operator) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const irrigationData = {
      date: formData.date,
      fieldId: parseInt(formData.fieldId),
      duration: formData.duration ? parseFloat(formData.duration) : 0,
      waterApplied: formData.waterApplied ? parseFloat(formData.waterApplied) : 0,
      soilMoisture: formData.soilMoisture,
      cost: formData.cost ? parseFloat(formData.cost) : 0,
      operator: formData.operator,
      method: formData.method,
      flowRate: formData.flowRate ? parseFloat(formData.flowRate) : undefined,
      pressure: formData.pressure ? parseFloat(formData.pressure) : undefined,
      weatherConditions: formData.weatherConditions,
      quantityUsed: formData.quantityUsed ? parseFloat(formData.quantityUsed) : undefined,
    };

    let result;
    if (editingIrrigation) {
      result = await updateIrrigation(editingIrrigation.id, irrigationData);
    } else {
      result = await addIrrigation(irrigationData);
    }

    if (result) {
      setShowAddModal(false);
      resetForm();
      Alert.alert('Success', `Irrigation ${editingIrrigation ? 'updated' : 'added'} successfully`);
    }
  };

  const fieldOptions = fields.map((field: any) => ({ 
    label: `${field.name} (${field.farmName})`, 
    value: field.id.toString() 
  }));

  const methodOptions = [
    { label: 'Pivot', value: 'Pivot' },
    { label: 'Drip', value: 'Drip' },
    { label: 'Sprinkler', value: 'Sprinkler' },
    { label: 'Flood', value: 'Flood' },
    { label: 'Furrow', value: 'Furrow' },
    { label: 'Micro-spray', value: 'Micro-spray' },
  ];

  const soilMoistureOptions = [
    { label: 'Dry', value: 'Dry' },
    { label: 'Adequate', value: 'Adequate' },
    { label: 'Moist', value: 'Moist' },
    { label: 'Saturated', value: 'Saturated' },
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
        <Text style={styles.sectionTitle}>Irrigation Calendar</Text>
        <TouchableOpacity style={styles.scheduleButton} onPress={() => setShowAddModal(true)}>
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.scheduleButtonText}>Schedule Irrigation</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
        {irrigations.map((irrigation: any) => (
          <View key={irrigation.id} style={styles.irrigationCard}>
            <View style={styles.irrigationHeader}>
              <View style={styles.irrigationInfo}>
                <Text style={styles.irrigationDate}>{irrigation.date}</Text>
                <Text style={styles.irrigationName}>{irrigation.method}</Text>
              </View>
              <View style={styles.statusBadge}><Text style={styles.statusText}>Scheduled</Text></View>
            </View>
            <View style={styles.irrigationDetails}>
              <View style={styles.detailRow}>
                <MapPin size={16} color="#6B7280" />
                <Text style={styles.detailText}>{irrigation.fieldName}</Text>
              </View>
              <View style={styles.detailRow}>
                <Droplets size={16} color="#6B7280" />
                <Text style={styles.detailText}>Water: {irrigation.waterApplied} mm</Text>
              </View>
              <View style={styles.detailRow}>
                <Sprout size={16} color="#6B7280" />
                <Text style={styles.detailText}>Duration: {irrigation.duration} hrs</Text>
              </View>
              {irrigation.weatherConditions && (
                <View style={styles.detailRow}>
                  <Info size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{irrigation.weatherConditions}</Text>
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
          <Text style={styles.modalTitle}>Schedule Irrigation</Text>
          <TouchableOpacity onPress={() => { setShowAddModal(false); setActiveTab('calendar'); }}>
            <Text style={styles.modalClose}>Cancel</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.modalContent}>
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
          <View style={styles.formGroup}><Text style={styles.formLabel}>Select Field *</Text>
            <Dropdown label="Field *" options={fieldOptions} value={formData.fieldId} onSelect={(value) => setFormData({ ...formData, fieldId: value })} placeholder="Select field" required />
          </View>
          <View style={styles.formGroup}><Text style={styles.formLabel}>Irrigation Method *</Text>
            <Dropdown label="Method *" options={methodOptions} value={formData.method} onSelect={(value) => setFormData({ ...formData, method: value })} placeholder="Select method" required />
          </View>
          <View style={styles.formGroup}><Text style={styles.formLabel}>Duration (hours) *</Text>
            <FormField label="Duration *" value={formData.duration} onChangeText={(text) => setFormData({ ...formData, duration: text })} placeholder="Enter duration in hours" keyboardType="numeric" required />
          </View>
          <View style={styles.formGroup}><Text style={styles.formLabel}>Water Applied (mm) *</Text>
            <FormField label="Water Applied *" value={formData.waterApplied} onChangeText={(text) => setFormData({ ...formData, waterApplied: text })} placeholder="Enter water applied in mm" keyboardType="numeric" required />
          </View>
          <View style={styles.formGroup}><Text style={styles.formLabel}>Soil Moisture *</Text>
            <Dropdown label="Soil Moisture *" options={soilMoistureOptions} value={formData.soilMoisture} onSelect={(value) => setFormData({ ...formData, soilMoisture: value })} placeholder="Select soil moisture level" required />
          </View>
          <View style={styles.formGroup}><Text style={styles.formLabel}>Operator *</Text>
            <FormField label="Operator *" value={formData.operator} onChangeText={(text) => setFormData({ ...formData, operator: text })} placeholder="Enter operator name" required />
          </View>
          <View style={styles.formGroup}><Text style={styles.formLabel}>Flow Rate (L/min)</Text>
            <FormField label="Flow Rate" value={formData.flowRate} onChangeText={(text) => setFormData({ ...formData, flowRate: text })} placeholder="Enter flow rate" keyboardType="numeric" />
          </View>
          <View style={styles.formGroup}><Text style={styles.formLabel}>Pressure (bar)</Text>
            <FormField label="Pressure" value={formData.pressure} onChangeText={(text) => setFormData({ ...formData, pressure: text })} placeholder="Enter pressure" keyboardType="numeric" />
          </View>
          <View style={styles.formGroup}><Text style={styles.formLabel}>Cost</Text>
            <FormField label="Cost" value={formData.cost} onChangeText={(text) => setFormData({ ...formData, cost: text })} placeholder="Enter total cost" keyboardType="numeric" />
          </View>
          <View style={styles.formGroup}><Text style={styles.formLabel}>Weather Conditions</Text>
            <FormField label="Weather Conditions" value={formData.weatherConditions} onChangeText={(text) => setFormData({ ...formData, weatherConditions: text })} placeholder="Enter weather conditions" multiline />
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
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Schedule Irrigation</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );

  // 4. History sub-tab (card-based, like Calendar)
  const renderHistoryView = () => (
    <View style={styles.contentContainer}>
      <View style={styles.headerRow}><Text style={styles.sectionTitle}>Irrigation History</Text></View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
        {irrigations.map((irrigation: any) => (
          <View key={irrigation.id} style={styles.irrigationCard}>
            <View style={styles.irrigationHeader}>
              <View style={styles.irrigationInfo}>
                <Text style={styles.irrigationDate}>{irrigation.date}</Text>
                <Text style={styles.irrigationName}>{irrigation.method}</Text>
              </View>
              <View style={styles.statusBadge}><Text style={styles.statusText}>Completed</Text></View>
            </View>
            <View style={styles.irrigationDetails}>
              <View style={styles.detailRow}>
                <MapPin size={16} color="#6B7280" />
                <Text style={styles.detailText}>{irrigation.fieldName}</Text>
              </View>
              <View style={styles.detailRow}>
                <Droplets size={16} color="#6B7280" />
                <Text style={styles.detailText}>Water: {irrigation.waterApplied} mm</Text>
              </View>
              <View style={styles.detailRow}>
                <Sprout size={16} color="#6B7280" />
                <Text style={styles.detailText}>Duration: {irrigation.duration} hrs</Text>
              </View>
              {irrigation.weatherConditions && (
                <View style={styles.detailRow}>
                  <Info size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{irrigation.weatherConditions}</Text>
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
      <View style={styles.header}><Text style={styles.title}>Irrigation Planner</Text></View>
      <View style={styles.tabContainer}><ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>{irrigationTabs.map(renderTabButton)}</ScrollView></View>
      {activeTab === 'calendar' && renderCalendarView()}
      {activeTab === 'schedule' && renderScheduleForm()}
      {activeTab === 'history' && renderHistoryView()}
      {/* Add/Edit Modal */}
      <Modal visible={showAddModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingIrrigation ? 'Edit Irrigation' : 'Schedule Irrigation'}
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
            <Text style={styles.sectionHeader}>Irrigation Details</Text>
            <FormField
              label="Date"
              value={formData.date}
              onChangeText={(text) => setFormData({ ...formData, date: text })}
              placeholder="YYYY-MM-DD"
              required
            />
            <FormField
              label="Duration (hours)"
              value={formData.duration}
              onChangeText={(text) => setFormData({ ...formData, duration: text })}
              placeholder="Enter duration"
              keyboardType="numeric"
              required
            />
            <FormField
              label="Water Applied (mm)"
              value={formData.waterApplied}
              onChangeText={(text) => setFormData({ ...formData, waterApplied: text })}
              placeholder="Enter water applied"
              keyboardType="numeric"
            />
            <Dropdown
              label="Soil Moisture"
              options={soilMoistureOptions}
              value={formData.soilMoisture}
              onSelect={(value) => setFormData({ ...formData, soilMoisture: value })}
              placeholder="Select soil moisture"
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
            <Dropdown
              label="Method"
              options={methodOptions}
              value={formData.method}
              onSelect={(value) => setFormData({ ...formData, method: value })}
              placeholder="Select method"
            />
            <FormField
              label="Flow Rate (L/s)"
              value={formData.flowRate}
              onChangeText={(text) => setFormData({ ...formData, flowRate: text })}
              placeholder="Enter flow rate"
              keyboardType="numeric"
            />
            <FormField
              label="Pressure (bar)"
              value={formData.pressure}
              onChangeText={(text) => setFormData({ ...formData, pressure: text })}
              placeholder="Enter pressure"
              keyboardType="numeric"
            />
            <FormField
              label="Weather Conditions"
              value={formData.weatherConditions}
              onChangeText={(text) => setFormData({ ...formData, weatherConditions: text })}
              placeholder="Enter weather conditions"
              multiline
            />
            <FormField
              label="Quantity Used"
              value={formData.quantityUsed}
              onChangeText={(text) => setFormData({ ...formData, quantityUsed: text })}
              placeholder="Enter quantity used"
              keyboardType="numeric"
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
                {editingIrrigation ? 'Update' : 'Save'}
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
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  tabContainer: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  tabScroll: {
    // Add any specific styles for the scroll view if needed
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
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
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  irrigationCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  irrigationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  irrigationInfo: {
    flex: 1,
  },
  irrigationDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  irrigationName: {
    fontSize: 14,
    color: '#6B7280',
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
    color: '#10B981',
  },
  irrigationDetails: {
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
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 20,
    marginBottom: 8,
  },
});