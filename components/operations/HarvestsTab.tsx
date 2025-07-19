import React, { useState } from 'react';
import { useOperationsContext } from '@/hooks/useOperations';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { Plus, CreditCard as Edit3, Trash2, X } from 'lucide-react-native';
import FormField from '@/components/FormField';
import Dropdown from '@/components/Dropdown';

export default function HarvestsTab() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHarvest, setEditingHarvest] = useState<any>(null);
  const [formData, setFormData] = useState({
    date: '',
    fieldId: '',
    cropId: '',
    yield: '',
    moisture: '',
    grade: '',
    operator: '',
    weather: '',
    qualityNotes: '',
  });

  const { harvests, fields, crops, addHarvest, updateHarvest, deleteHarvest } = useOperationsContext();

  const resetForm = () => {
    setFormData({
      date: '',
      fieldId: '',
      cropId: '',
      yield: '',
      moisture: '',
      grade: '',
      operator: '',
      weather: '',
      qualityNotes: '',
    });
    setEditingHarvest(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEdit = (harvest: any) => {
    setFormData({
      date: harvest.date,
      fieldId: harvest.fieldId?.toString() || '',
      cropId: harvest.cropId?.toString() || '',
      yield: harvest.yield?.toString() || '',
      moisture: harvest.moisture?.toString() || '',
      grade: harvest.grade,
      operator: harvest.operator,
      weather: harvest.weather || '',
      qualityNotes: harvest.qualityNotes || '',
    });
    setEditingHarvest(harvest);
    setShowAddModal(true);
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      'Delete Harvest',
      'Are you sure you want to delete this harvest record?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            const result = await deleteHarvest(id);
            if (result) {
              Alert.alert('Success', 'Harvest deleted successfully');
            }
          }
        },
      ]
    );
  };

  const handleSave = async () => {
    if (!formData.date || !formData.fieldId || !formData.yield || !formData.operator) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const harvestData = {
      date: formData.date,
      fieldId: parseInt(formData.fieldId),
      cropId: formData.cropId ? parseInt(formData.cropId) : 0,
      yield: parseFloat(formData.yield),
      yieldPerHectare: 0, // Calculate based on field area
      moisture: formData.moisture ? parseFloat(formData.moisture) : 0,
      grade: formData.grade,
      operator: formData.operator,
      weather: formData.weather,
      qualityNotes: formData.qualityNotes,
      attachments: [],
    };

    let result;
    if (editingHarvest) {
      result = await updateHarvest(editingHarvest.id, harvestData);
    } else {
      result = await addHarvest(harvestData);
    }

    if (result) {
      setShowAddModal(false);
      resetForm();
      Alert.alert('Success', `Harvest ${editingHarvest ? 'updated' : 'added'} successfully`);
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

  const gradeOptions = [
    { label: 'Grade 1', value: 'Grade 1' },
    { label: 'Grade 2', value: 'Grade 2' },
    { label: 'Grade 3', value: 'Grade 3' },
    { label: 'Premium', value: 'Premium' },
    { label: 'Standard', value: 'Standard' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.contentContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Harvests</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <Plus size={16} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add Harvest</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>Date</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>Field</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>Crop</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>Yield</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>Grade</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>Actions</Text>
          </View>

          {harvests.map((harvest: any) => (
            <View key={harvest.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{harvest.date}</Text>
              <Text style={styles.tableCell}>{harvest.fieldName}</Text>
              <Text style={styles.tableCell}>{harvest.cropName}</Text>
              <Text style={styles.tableCell}>{harvest.yield} t</Text>
              <Text style={styles.tableCell}>{harvest.grade}</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleEdit(harvest)}
                >
                  <Edit3 size={16} color="#3B82F6" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleDelete(harvest.id)}
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
                {editingHarvest ? 'Edit Harvest' : 'Schedule Harvest'}
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
              <Text style={styles.sectionHeader}>Harvest Details</Text>
              <FormField
                label="Date"
                value={formData.date}
                onChangeText={(text) => setFormData({ ...formData, date: text })}
                placeholder="YYYY-MM-DD"
                required
              />
              <FormField
                label="Yield"
                value={formData.yield}
                onChangeText={(text) => setFormData({ ...formData, yield: text })}
                placeholder="Enter yield"
                keyboardType="numeric"
                required
              />
              <FormField
                label="Moisture (%)"
                value={formData.moisture}
                onChangeText={(text) => setFormData({ ...formData, moisture: text })}
                placeholder="Enter moisture content"
                keyboardType="numeric"
              />
              <Dropdown
                label="Grade"
                options={gradeOptions}
                value={formData.grade}
                onSelect={(value) => setFormData({ ...formData, grade: value })}
                placeholder="Select grade"
              />
              <FormField
                label="Operator"
                value={formData.operator}
                onChangeText={(text) => setFormData({ ...formData, operator: text })}
                placeholder="Enter operator name"
                required
              />
              <FormField
                label="Weather"
                value={formData.weather}
                onChangeText={(text) => setFormData({ ...formData, weather: text })}
                placeholder="Enter weather conditions"
              />
              <FormField
                label="Quality Notes"
                value={formData.qualityNotes}
                onChangeText={(text) => setFormData({ ...formData, qualityNotes: text })}
                placeholder="Enter quality notes"
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
                  {editingHarvest ? 'Update' : 'Save'}
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