import React, { useState } from 'react';
import { useOperationsContext } from '@/hooks/useOperations';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { Plus, CreditCard as Edit3, Trash2, X } from 'lucide-react-native';
import FormField from '@/components/FormField';
import Dropdown from '@/components/Dropdown';

export default function PlantingsTab() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPlanting, setEditingPlanting] = useState<any>(null);
  const [formData, setFormData] = useState({
    date: '',
    fieldId: '',
    cropId: '',
    variety: '',
    operator: '',
    density: '',
    spacing: '',
    notes: '',
  });

  const { plantings, fields, crops, addPlanting, updatePlanting, deletePlanting } = useOperationsContext();

  const resetForm = () => {
    setFormData({
      date: '',
      fieldId: '',
      cropId: '',
      variety: '',
      operator: '',
      density: '',
      spacing: '',
      notes: '',
    });
    setEditingPlanting(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEdit = (planting: any) => {
    setFormData({
      date: planting.date,
      fieldId: planting.fieldId?.toString() || '',
      cropId: planting.cropId?.toString() || '',
      variety: planting.variety,
      operator: planting.operator,
      density: planting.density?.toString() || '',
      spacing: planting.spacing,
      notes: planting.notes || '',
    });
    setEditingPlanting(planting);
    setShowAddModal(true);
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      'Delete Planting',
      'Are you sure you want to delete this planting record?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            const result = await deletePlanting(id);
            if (result) {
              Alert.alert('Success', 'Planting deleted successfully');
            }
          }
        },
      ]
    );
  };

  const handleSave = async () => {
    if (!formData.date || !formData.fieldId || !formData.operator) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const plantingData = {
      date: formData.date,
      fieldId: parseInt(formData.fieldId),
      cropId: formData.cropId ? parseInt(formData.cropId) : 0,
      variety: formData.variety,
      operator: formData.operator,
      density: formData.density ? parseInt(formData.density) : 0,
      spacing: formData.spacing,
      notes: formData.notes,
      attachments: [],
    };

    let result;
    if (editingPlanting) {
      result = await updatePlanting(editingPlanting.id, plantingData);
    } else {
      result = await addPlanting(plantingData);
    }

    if (result) {
      setShowAddModal(false);
      resetForm();
      Alert.alert('Success', `Planting ${editingPlanting ? 'updated' : 'added'} successfully`);
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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.contentContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Plantings</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <Plus size={16} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add Planting</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>Date</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>Field</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>Crop</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>Variety</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>Operator</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>Actions</Text>
          </View>

          {plantings.map((planting: any) => (
            <View key={planting.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{planting.date}</Text>
              <Text style={styles.tableCell}>{planting.fieldName}</Text>
              <Text style={styles.tableCell}>{planting.cropName}</Text>
              <Text style={styles.tableCell}>{planting.variety}</Text>
              <Text style={styles.tableCell}>{planting.operator}</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleEdit(planting)}
                >
                  <Edit3 size={16} color="#3B82F6" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleDelete(planting.id)}
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
                {editingPlanting ? 'Edit Planting' : 'Schedule Planting'}
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
              <Text style={styles.sectionHeader}>Planting Details</Text>
              <FormField
                label="Date"
                value={formData.date}
                onChangeText={(text) => setFormData({ ...formData, date: text })}
                placeholder="YYYY-MM-DD"
                required
              />
              <FormField
                label="Variety"
                value={formData.variety}
                onChangeText={(text) => setFormData({ ...formData, variety: text })}
                placeholder="Enter variety"
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
                label="Density"
                value={formData.density}
                onChangeText={(text) => setFormData({ ...formData, density: text })}
                placeholder="Enter density"
                keyboardType="numeric"
              />
              <FormField
                label="Spacing"
                value={formData.spacing}
                onChangeText={(text) => setFormData({ ...formData, spacing: text })}
                placeholder="Enter spacing"
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
                  {editingPlanting ? 'Update' : 'Save'}
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