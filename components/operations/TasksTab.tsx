import React, { useState } from 'react';
import { useOperationsContext } from '@/hooks/useOperations';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { Plus, CreditCard as Edit3, X, TriangleAlert as AlertTriangle, Trash2 } from 'lucide-react-native';
import FormField from '@/components/FormField';
import Dropdown from '@/components/Dropdown';

export default function TasksTab() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignee: '',
    priority: 'Medium',
    fieldId: '',
  });

  const { fields, tasks, addTask, updateTask, deleteTask, getOverdueTasks } = useOperationsContext();

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      assignee: '',
      priority: 'Medium',
      fieldId: '',
    });
    setEditingTask(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEdit = (task: any) => {
    setFormData({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      assignee: task.assignee,
      priority: task.priority,
      fieldId: task.fieldId?.toString() || '',
    });
    setEditingTask(task);
    setShowAddModal(true);
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            const result = await deleteTask(id);
            if (result) {
              Alert.alert('Success', 'Task deleted successfully');
            }
          }
        },
      ]
    );
  };

  const handleSave = async () => {
    if (!formData.title || !formData.dueDate || !formData.assignee) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const taskData = {
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate,
      assignee: formData.assignee,
      status: editingTask ? editingTask.status : 'To Do' as const,
      priority: formData.priority as 'High' | 'Medium' | 'Low',
      fieldId: formData.fieldId ? parseInt(formData.fieldId) : undefined,
      attachments: [],
      type: editingTask ? editingTask.type : 'General', // or set a default type as appropriate
    };

    let result;
    if (editingTask) {
      result = await updateTask(editingTask.id, taskData);
    } else {
      result = await addTask(taskData);
    }

    if (result) {
      setShowAddModal(false);
      resetForm();
      Alert.alert('Success', `Task ${editingTask ? 'updated' : 'added'} successfully`);
    }
  };

  const handleStatusChange = async (taskId: number, newStatus: string) => {
    await updateTask(taskId, { status: newStatus as 'To Do' | 'In Progress' | 'Done' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'To Do': return '#F59E0B';
      case 'In Progress': return '#3B82F6';
      case 'Done': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return '#EF4444';
      case 'Medium': return '#F59E0B';
      case 'Low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const overdueTasks = getOverdueTasks();
  const fieldOptions = fields.map((field: any) => ({ 
    label: `${field.name} (${field.farmName})`, 
    value: field.id.toString() 
  }));

  return (
    <View style={styles.contentContainer}>
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Task Management</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Plus size={16} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Task</Text>
        </TouchableOpacity>
      </View>

      {overdueTasks.length > 0 && (
        <View style={styles.alertContainer}>
          <AlertTriangle size={20} color="#EF4444" />
          <Text style={styles.alertText}>
            {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''}
          </Text>
        </View>
      )}

      {tasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No tasks created yet</Text>
          <Text style={styles.emptyStateSubtext}>Add your first task to get started</Text>
        </View>
      ) : (
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>Task</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>Due Date</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>Assignee</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>Priority</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>Status</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>Actions</Text>
          </View>

          {tasks.map((task: any) => (
            <View key={task.id} style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskDescription}>{task.description}</Text>
              </View>
              <Text style={styles.tableCell}>{task.dueDate}</Text>
              <Text style={styles.tableCell}>{task.assignee}</Text>
              <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) + '20' }]}>
                <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
                  {task.priority}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) + '20' }]}
                onPress={() => {
                  const statuses = ['To Do', 'In Progress', 'Done'];
                  const currentIndex = statuses.indexOf(task.status);
                  const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                  handleStatusChange(task.id, nextStatus);
                }}
              >
                <Text style={[styles.statusText, { color: getStatusColor(task.status) }]}>
                  {task.status}
                </Text>
              </TouchableOpacity>
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleEdit(task)}
                >
                  <Edit3 size={16} color="#3B82F6" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleDelete(task.id)}
                >
                  <Trash2 size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Add/Edit Task Modal */}
      <Modal visible={showAddModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingTask ? 'Edit Task' : 'Add Task'}
            </Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <FormField
              label="Task Title"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              placeholder="Enter task title"
              required
            />

            <FormField
              label="Description"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Enter task description"
              multiline
            />

            <FormField
              label="Due Date"
              value={formData.dueDate}
              onChangeText={(text) => setFormData({ ...formData, dueDate: text })}
              placeholder="YYYY-MM-DD"
              required
            />

            <FormField
              label="Assignee"
              value={formData.assignee}
              onChangeText={(text) => setFormData({ ...formData, assignee: text })}
              placeholder="Enter assignee name"
              required
            />

            <Dropdown
              label="Priority"
              options={[
                { label: 'High', value: 'High' },
                { label: 'Medium', value: 'Medium' },
                { label: 'Low', value: 'Low' },
              ]}
              value={formData.priority}
              onSelect={(value) => setFormData({ ...formData, priority: value })}
              placeholder="Select priority"
            />

            <Dropdown
              label="Field (Optional)"
              options={fieldOptions}
              value={formData.fieldId}
              onSelect={(value) => setFormData({ ...formData, fieldId: value })}
              placeholder="Select field"
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
                {editingTask ? 'Update' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
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
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  alertText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '500',
    marginLeft: 8,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
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
  taskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  taskDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    flex: 1,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
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
});