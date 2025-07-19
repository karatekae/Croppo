import React, { useState } from 'react';
import { useOperationsContext } from '@/hooks/useOperations';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { Plus, CreditCard as Edit3, Trash2, X } from 'lucide-react-native';
import FormField from '@/components/FormField';
import Dropdown from '@/components/Dropdown';

export default function BatchOperationsTab() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingOperation, setEditingOperation] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    operationType: 'Fertilization',
    fieldIds: [] as string[],
    date: '',
    operator: '',
    productName: '',
    rate: '',
    unit: '',
    notes: '',
  });

  const { batchOperations, fields, addBatchOperation, updateBatchOperation, deleteBatchOperation } = useOperationsContext();

  const resetForm = () => {
    setFormData({
      name: '',
      operationType: 'Fertilization',
      fieldIds: [],
      date: '',
      operator: '',
      productName: '',
      rate: '',
      unit: '',
      notes: '',
    });
    setEditingOperation(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEdit = (operation: any) => {
    setFormData({
      name: operation.name,
      operationType: operation.operationType,
      fieldIds: operation.fieldIds?.map((id: number) => id.toString()) || [],
      date: operation.date,
      operator: operation.operator,
      productName: operation.productName || '',
      rate: operation.rate?.toString() || '',
      unit: operation.unit || '',
      notes: operation.notes || '',
    });
    setEditingOperation(operation);
    setShowAddModal(true);
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      'Delete Batch Operation',
      'Are you sure you want to delete this batch operation?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            const result = await deleteBatchOperation(id);
            if (result) {
              Alert.alert('Success', 'Batch operation deleted successfully');
            }
          }
        },
      ]
    );
  };

  const handleSave = async () => {
    if (!formData.name || !formData.operationType || formData.fieldIds.length === 0 || !formData.date || !formData.operator) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const operationData = {
      name: formData.name,
      operationType: formData.operationType as 'Fertilization' | 'Treatment' | 'Irrigation' | 'Custom',
      fieldIds: formData.fieldIds.map(id => parseInt(id)),
      fieldNames: formData.fieldIds.map(id => {
        const field = fields.find((f: any) => f.id.toString() === id);
        return field?.name || '';
      }),
      date: formData.date,
      operator: formData.operator,
      productName: formData.productName,
      rate: formData.rate ? parseFloat(formData.rate) : undefined,
      unit: formData.unit,
      notes: formData.notes,
      status: 'Planned' as const,
    };

    let result;
    if (editingOperation) {
      result = await updateBatchOperation(editingOperation.id, operationData);
    } else {
      result = await addBatchOperation(operationData);
    }

    if (result) {
      setShowAddModal(false);
      resetForm();
      Alert.alert('Success', `Batch operation ${editingOperation ? 'updated' : 'added'} successfully`);
    }
  };

  const fieldOptions = fields.map((field: any) => ({ 
    label: `${field.name} (${field.farmName})`, 
    value: field.id.toString() 
  }));

  const operationTypeOptions = [
    { label: 'Fertilization', value: 'Fertilization' },
    { label: 'Treatment', value: 'Treatment' },
    { label: 'Irrigation', value: 'Irrigation' },
    { label: 'Custom', value: 'Custom' },
  ];

  const unitOptions = [
    { label: 'kg/ha', value: 'kg/ha' },
    { label: 'L/ha', value: 'L/ha' },
    { label: 'g/ha', value: 'g/ha' },
    { label: 'mL/ha', value: 'mL/ha' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planned': return '#F59E0B';
      case 'In Progress': return '#3B82F6';
      case 'Completed': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.contentContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Batch Operations</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <Plus size={16} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Create Batch Operation</Text>
          </TouchableOpacity>
        </View>

        {batchOperations && batchOperations.length > 0 ? (
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableCellHeader]}>Name</Text>
              <Text style={[styles.tableCell, styles.tableCellHeader]}>Type</Text>
              <Text style={[styles.tableCell, styles.tableCellHeader]}>Date</Text>
              <Text style={[styles.tableCell, styles.tableCellHeader]}>Fields</Text>
              <Text style={[styles.tableCell, styles.tableCellHeader]}>Status</Text>
              <Text style={[styles.tableCell, styles.tableCellHeader]}>Actions</Text>
            </View>

            {batchOperations.map((operation: any) => (
              <View key={operation.id} style={styles.tableRow}>
                <Text style={styles.tableCell}>{operation.name}</Text>
                <Text style={styles.tableCell}>{operation.operationType}</Text>
                <Text style={styles.tableCell}>{operation.date}</Text>
                <Text style={styles.tableCell}>{operation.fieldNames?.join(', ') || 'N/A'}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(operation.status) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(operation.status) }]}>
                    {operation.status}
                  </Text>
                </View>
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleEdit(operation)}
                  >
                    <Edit3 size={16} color="#3B82F6" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleDelete(operation.id)}
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>No batch operations yet</Text>
            <Text style={styles.placeholderSubtext}>
              Create operations across multiple fields simultaneously
            </Text>
          </View>
        )}

        {/* Add/Edit Modal */}
        <Modal visible={showAddModal} animationType="slide" presentationStyle="pageSheet">
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingOperation ? 'Edit Batch Operation' : 'Schedule Batch Operation'}
              </Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Text style={{ color: '#3B82F6', fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent}>
              <Text style={styles.sectionHeader}>Select Fields *</Text>
              <View style={styles.fieldSelection}>
                {fieldOptions.map((field: any) => (
                  <TouchableOpacity
                    key={field.value}
                    style={[
                      styles.fieldOption,
                      formData.fieldIds.includes(field.value) && styles.fieldOptionSelected
                    ]}
                    onPress={() => {
                      const isSelected = formData.fieldIds.includes(field.value);
                      if (isSelected) {
                        setFormData({
                          ...formData,
                          fieldIds: formData.fieldIds.filter(id => id !== field.value)
                        });
                      } else {
                        setFormData({
                          ...formData,
                          fieldIds: [...formData.fieldIds, field.value]
                        });
                      }
                    }}
                  >
                    <Text style={[
                      styles.fieldOptionText,
                      formData.fieldIds.includes(field.value) && styles.fieldOptionTextSelected
                    ]}>
                      {field.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.sectionHeader}>Batch Operation Details</Text>
              <FormField
                label="Name"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Enter operation name"
                required
              />
              <Dropdown
                label="Operation Type"
                options={operationTypeOptions}
                value={formData.operationType}
                onSelect={(value) => setFormData({ ...formData, operationType: value })}
                placeholder="Select operation type"
                required
              />
              <FormField
                label="Date"
                value={formData.date}
                onChangeText={(text) => setFormData({ ...formData, date: text })}
                placeholder="YYYY-MM-DD"
                required
              />
              <FormField
                label="Operator"
                value={formData.operator}
                onChangeText={(text) => setFormData({ ...formData, operator: text })}
                placeholder="Enter operator name"
                required
              />
              <FormField
                label="Product Name"
                value={formData.productName}
                onChangeText={(text) => setFormData({ ...formData, productName: text })}
                placeholder="Enter product name"
              />
              <FormField
                label="Rate"
                value={formData.rate}
                onChangeText={(text) => setFormData({ ...formData, rate: text })}
                placeholder="Enter application rate"
                keyboardType="numeric"
              />
              <Dropdown
                label="Unit"
                options={unitOptions}
                value={formData.unit}
                onSelect={(value) => setFormData({ ...formData, unit: value })}
                placeholder="Select unit"
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
                  {editingOperation ? 'Update' : 'Save'}
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
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    flex: 1,
  },
  statusText: {
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
  placeholderContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
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
  fieldSelectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  fieldSelection: {
    marginBottom: 16,
  },
  fieldOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  fieldOptionSelected: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  fieldOptionText: {
    fontSize: 14,
    color: '#111827',
  },
  fieldOptionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '500',
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
    marginBottom: 8,
    marginTop: 16,
  },
});