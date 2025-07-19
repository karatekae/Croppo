import React, { useState } from 'react';
import { useOperationsContext } from '@/hooks/useOperations';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { Plus, CreditCard as Edit3, Trash2, X } from 'lucide-react-native';
import FormField from '@/components/FormField';
import Dropdown from '@/components/Dropdown';

export default function IPMTab() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [formData, setFormData] = useState({
    date: '',
    fieldId: '',
    pest: '',
    count: '',
    threshold: '',
    severity: 'Medium',
    action: '',
    notes: '',
    scoutingMethod: '',
    weatherConditions: '',
    cropGrowthStage: '',
  });

  const { ipmRecords, fields, addIPMRecord, updateIPMRecord, deleteIPMRecord } = useOperationsContext();

  const resetForm = () => {
    setFormData({
      date: '',
      fieldId: '',
      pest: '',
      count: '',
      threshold: '',
      severity: 'Medium',
      action: '',
      notes: '',
      scoutingMethod: '',
      weatherConditions: '',
      cropGrowthStage: '',
    });
    setEditingRecord(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEdit = (record: any) => {
    setFormData({
      date: record.date,
      fieldId: record.fieldId?.toString() || '',
      pest: record.pest,
      count: record.count?.toString() || '',
      threshold: record.threshold?.toString() || '',
      severity: record.severity,
      action: record.action,
      notes: record.notes || '',
      scoutingMethod: record.scoutingMethod || '',
      weatherConditions: record.weatherConditions || '',
      cropGrowthStage: record.cropGrowthStage || '',
    });
    setEditingRecord(record);
    setShowAddModal(true);
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      'Delete IPM Record',
      'Are you sure you want to delete this IPM record?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            const result = await deleteIPMRecord(id);
            if (result) {
              Alert.alert('Success', 'IPM record deleted successfully');
            }
          }
        },
      ]
    );
  };

  const handleSave = async () => {
    if (!formData.date || !formData.fieldId || !formData.pest || !formData.action) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const recordData = {
      date: formData.date,
      fieldId: parseInt(formData.fieldId),
      pest: formData.pest,
      count: formData.count ? parseInt(formData.count) : 0,
      threshold: formData.threshold ? parseInt(formData.threshold) : 0,
      severity: formData.severity as 'Low' | 'Medium' | 'High',
      action: formData.action,
      notes: formData.notes,
      scoutingMethod: formData.scoutingMethod,
      weatherConditions: formData.weatherConditions,
      cropGrowthStage: formData.cropGrowthStage,
      attachments: [],
    };

    let result;
    if (editingRecord) {
      result = await updateIPMRecord(editingRecord.id, recordData);
    } else {
      result = await addIPMRecord(recordData);
    }

    if (result) {
      setShowAddModal(false);
      resetForm();
      Alert.alert('Success', `IPM record ${editingRecord ? 'updated' : 'added'} successfully`);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return '#EF4444';
      case 'Medium': return '#F59E0B';
      case 'Low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const fieldOptions = fields.map((field: any) => ({ 
    label: `${field.name} (${field.farmName})`, 
    value: field.id.toString() 
  }));

  const severityOptions = [
    { label: 'Low', value: 'Low' },
    { label: 'Medium', value: 'Medium' },
    { label: 'High', value: 'High' },
  ];

  const pestOptions = [
    { label: 'Aphids', value: 'Aphids' },
    { label: 'Corn Borer', value: 'Corn Borer' },
    { label: 'Cutworm', value: 'Cutworm' },
    { label: 'Thrips', value: 'Thrips' },
    { label: 'Spider Mites', value: 'Spider Mites' },
    { label: 'Whitefly', value: 'Whitefly' },
    { label: 'Caterpillars', value: 'Caterpillars' },
    { label: 'Other', value: 'Other' },
  ];

  const actionOptions = [
    { label: 'Monitor', value: 'Monitor' },
    { label: 'Treatment Required', value: 'Treatment Required' },
    { label: 'Biological Control', value: 'Biological Control' },
    { label: 'Chemical Treatment', value: 'Chemical Treatment' },
    { label: 'Cultural Control', value: 'Cultural Control' },
    { label: 'No Action', value: 'No Action' },
  ];

  const scoutingMethodOptions = [
    { label: 'Visual Inspection', value: 'Visual Inspection' },
    { label: 'Pheromone Traps', value: 'Pheromone Traps' },
    { label: 'Sticky Traps', value: 'Sticky Traps' },
    { label: 'Beat Sheet', value: 'Beat Sheet' },
    { label: 'Sweep Net', value: 'Sweep Net' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.contentContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Integrated Pest Management</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <Plus size={16} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add IPM Record</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>Date</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>Field</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>Pest</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>Count</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>Severity</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>Actions</Text>
          </View>

          {ipmRecords.map((record: any) => (
            <View key={record.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{record.date}</Text>
              <Text style={styles.tableCell}>{record.fieldName}</Text>
              <Text style={styles.tableCell}>{record.pest}</Text>
              <Text style={styles.tableCell}>{record.count}</Text>
              <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(record.severity) + '20' }]}>
                <Text style={[styles.severityText, { color: getSeverityColor(record.severity) }]}>
                  {record.severity}
                </Text>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleEdit(record)}
                >
                  <Edit3 size={16} color="#3B82F6" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleDelete(record.id)}
                >
                  <Trash2 size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Add/Edit Modal */}
        <Modal visible={showAddModal} animationType="slide" presentationStyle="pageSheet">
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingRecord ? 'Edit IPM Record' : 'Schedule IPM Record'}
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
              <Text style={styles.sectionHeader}>IPM Details</Text>
              <FormField
                label="Date"
                value={formData.date}
                onChangeText={(text) => setFormData({ ...formData, date: text })}
                placeholder="YYYY-MM-DD"
                required
              />
              <FormField
                label="Pest"
                value={formData.pest}
                onChangeText={(text) => setFormData({ ...formData, pest: text })}
                placeholder="Enter pest name"
                required
              />
              <FormField
                label="Count"
                value={formData.count}
                onChangeText={(text) => setFormData({ ...formData, count: text })}
                placeholder="Enter pest count"
                keyboardType="numeric"
              />
              <FormField
                label="Threshold"
                value={formData.threshold}
                onChangeText={(text) => setFormData({ ...formData, threshold: text })}
                placeholder="Enter threshold"
                keyboardType="numeric"
              />
              <Dropdown
                label="Severity"
                options={severityOptions}
                value={formData.severity}
                onSelect={(value) => setFormData({ ...formData, severity: value })}
                placeholder="Select severity"
              />
              <Dropdown
                label="Action"
                options={actionOptions}
                value={formData.action}
                onSelect={(value) => setFormData({ ...formData, action: value })}
                placeholder="Select action"
                required
              />
              <FormField
                label="Notes"
                value={formData.notes}
                onChangeText={(text) => setFormData({ ...formData, notes: text })}
                placeholder="Enter notes"
                multiline
              />
              <Dropdown
                label="Scouting Method"
                options={scoutingMethodOptions}
                value={formData.scoutingMethod}
                onSelect={(value) => setFormData({ ...formData, scoutingMethod: value })}
                placeholder="Select scouting method"
              />
              <FormField
                label="Weather Conditions"
                value={formData.weatherConditions}
                onChangeText={(text) => setFormData({ ...formData, weatherConditions: text })}
                placeholder="Enter weather conditions"
                multiline
              />
              <FormField
                label="Crop Growth Stage"
                value={formData.cropGrowthStage}
                onChangeText={(text) => setFormData({ ...formData, cropGrowthStage: text })}
                placeholder="Enter crop growth stage"
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
                  {editingRecord ? 'Update' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
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
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    flex: 1,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
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
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 20,
    marginBottom: 8,
  },
});