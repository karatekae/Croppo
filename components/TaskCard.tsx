import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, Users, MapPin, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle } from 'lucide-react-native';

interface TaskCardProps {
  task: {
    id: number;
    title: string;
    description: string;
    dueDate: string;
    assignee: string;
    status: string;
    priority: string;
    field?: string;
  };
  onPress?: () => void;
  onStatusChange?: (taskId: number, newStatus: string) => void;
}

export default function TaskCard({ task, onPress, onStatusChange }: TaskCardProps) {
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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High': return <AlertTriangle size={16} color="#EF4444" />;
      case 'Medium': return <Clock size={16} color="#F59E0B" />;
      case 'Low': return <CheckCircle size={16} color="#10B981" />;
      default: return <Clock size={16} color="#6B7280" />;
    }
  };

  const isOverdue = () => {
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    return dueDate < today && task.status !== 'Done';
  };

  return (
    <TouchableOpacity style={[styles.card, isOverdue() && styles.overdueCard]} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <View style={styles.priorityContainer}>
            {getPriorityIcon(task.priority)}
            <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
              {task.priority}
            </Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(task.status) }]}>
            {task.status}
          </Text>
        </View>
      </View>

      <Text style={styles.description}>{task.description}</Text>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Clock size={16} color="#6B7280" />
          <Text style={[styles.dueDate, isOverdue() && styles.overdueDueDate]}>
            Due: {task.dueDate}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Users size={16} color="#6B7280" />
          <Text style={styles.assignee}>{task.assignee}</Text>
        </View>

        {task.field && (
          <View style={styles.detailRow}>
            <MapPin size={16} color="#6B7280" />
            <Text style={styles.field}>{task.field}</Text>
          </View>
        )}
      </View>

      {isOverdue() && (
        <View style={styles.overdueAlert}>
          <AlertTriangle size={16} color="#EF4444" />
          <Text style={styles.overdueText}>Overdue</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  overdueCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  details: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDate: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
  },
  overdueDueDate: {
    color: '#EF4444',
    fontWeight: '500',
  },
  assignee: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
  },
  field: {
    fontSize: 12,
    color: '#3B82F6',
    marginLeft: 8,
  },
  overdueAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#FEE2E2',
  },
  overdueText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#EF4444',
    marginLeft: 4,
  },
});