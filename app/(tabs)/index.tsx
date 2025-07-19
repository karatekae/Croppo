import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, RefreshControl } from 'react-native';
import { Calendar, CircleCheck as CheckCircle, Clock, TrendingUp, TriangleAlert as AlertTriangle, Users, Droplets, DollarSign, Sprout, Package } from 'lucide-react-native';
import { useOperations } from '@/hooks/useOperations';
import { useAuth } from '@/hooks/useAuth';
import { DashboardMetrics, Alert } from '@/types/operations';

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  
  const operationsData = useOperations();
  const { user, hasPermission } = useAuth();

  const { 
    farms, 
    fields, 
    tasks, 
    plantings, 
    harvests, 
    treatments, 
    fertilizations, 
    irrigations,
    getOverdueTasks,
    getTasksByStatus 
  } = operationsData;

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    try {
      // In real app, this would call GET /api/dashboard
      const mockMetrics: DashboardMetrics = {
        costPerHectare: 850.75,
        waterUsage: 12500, // liters
        completedTasks: getTasksByStatus('Done').length,
        totalRevenue: 65000,
        totalExpenses: 18400,
        netProfit: 46600,
        activeFields: fields.length,
        overdueTasksCount: getOverdueTasks().length,
        lowStockItemsCount: 3, // Mock data
        lastUpdated: new Date().toISOString(),
      };
      setDashboardMetrics(mockMetrics);

      // Mock alerts
      const mockAlerts: Alert[] = [
        {
          id: 1,
          type: 'overdue_task',
          severity: 'high',
          title: 'Overdue Task',
          message: 'Field A fertilization is 2 days overdue',
          entityId: 1,
          entityType: 'task',
          isRead: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          type: 'low_stock',
          severity: 'medium',
          title: 'Low Stock Alert',
          message: 'Organic Pesticide BT is below reorder threshold',
          entityId: 2,
          entityType: 'inventory',
          isRead: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 3,
          type: 'weather',
          severity: 'low',
          title: 'Weather Alert',
          message: 'Rain expected tomorrow - consider postponing spraying',
          isRead: false,
          createdAt: new Date().toISOString(),
        },
      ];
      setAlerts(mockAlerts);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  // PRD-specified KPI widgets
  const kpiWidgets = [
    { 
      title: 'Cost/Hectare', 
      value: dashboardMetrics ? `$${dashboardMetrics.costPerHectare.toFixed(2)}` : '--', 
      icon: 'dollarsign', 
      color: '#10B981',
      change: '+5.2%'
    },
    { 
      title: 'Water Usage', 
      value: dashboardMetrics ? `${(dashboardMetrics.waterUsage / 1000).toFixed(1)}K L` : '--', 
      icon: 'droplets', 
      color: '#3B82F6',
      change: '-8.1%'
    },
    { 
      title: 'Completed Tasks', 
      value: dashboardMetrics ? dashboardMetrics.completedTasks.toString() : '--', 
      icon: 'checkcircle', 
      color: '#10B981',
      change: '+12.3%'
    },
    { 
      title: 'Active Fields', 
      value: dashboardMetrics ? dashboardMetrics.activeFields.toString() : '--', 
      icon: 'sprout', 
      color: '#F59E0B',
      change: '0%'
    },
  ];

  // Get recent tasks
  const upcomingTasks = tasks.slice(0, 4);

  // Get recent activities from all operations
  const recentActivities = [
    ...plantings.map(p => ({ 
      id: `planting-${p.id}`, 
      activity: `Planted ${p.cropName} in ${p.fieldName}`, 
      time: p.date, 
      type: 'planting' 
    })),
    ...harvests.map(h => ({ 
      id: `harvest-${h.id}`, 
      activity: `Harvested ${h.cropName} from ${h.fieldName}`, 
      time: h.date, 
      type: 'harvest' 
    })),
    ...treatments.map(t => ({ 
      id: `treatment-${t.id}`, 
      activity: `Applied ${t.productName} to ${t.fieldName}`, 
      time: t.date, 
      type: 'treatment' 
    })),
    ...fertilizations.map(f => ({ 
      id: `fertilization-${f.id}`, 
      activity: `Applied ${f.productName} to ${f.fieldName}`, 
      time: f.date, 
      type: 'fertilization' 
    })),
    ...irrigations.map(i => ({ 
      id: `irrigation-${i.id}`, 
      activity: `Irrigated ${i.fieldName} for ${i.duration} hours`, 
      time: i.date, 
      type: 'irrigation' 
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 4);

  const renderKPIWidget = (item: any, index: number) => (
    <View key={index} style={styles.kpiCard}>
      <View style={styles.kpiHeader}>
        <View style={[styles.kpiIcon, { backgroundColor: item.color }]}>
          {item.icon === 'dollarsign' && <DollarSign size={20} color="#FFFFFF" />}
          {item.icon === 'droplets' && <Droplets size={20} color="#FFFFFF" />}
          {item.icon === 'checkcircle' && <CheckCircle size={20} color="#FFFFFF" />}
          {item.icon === 'sprout' && <Sprout size={20} color="#FFFFFF" />}
        </View>
        <View style={styles.kpiValues}>
          <Text style={styles.kpiValue}>{item.value}</Text>
          <Text style={[styles.kpiChange, { color: item.change.startsWith('+') ? '#10B981' : item.change.startsWith('-') ? '#EF4444' : '#6B7280' }]}>
            {item.change}
          </Text>
        </View>
      </View>
      <Text style={styles.kpiTitle}>{item.title}</Text>
    </View>
  );

  const renderAlert = (alert: Alert) => (
    <TouchableOpacity 
      key={alert.id} 
      style={[styles.alertCard, { borderLeftColor: getSeverityColor(alert.severity) }]}
      onPress={() => handleAlertPress(alert)}
    >
      <View style={styles.alertHeader}>
        <View style={styles.alertIcon}>
          {alert.type === 'overdue_task' && <Clock size={16} color={getSeverityColor(alert.severity)} />}
          {alert.type === 'low_stock' && <Package size={16} color={getSeverityColor(alert.severity)} />}
          {alert.type === 'weather' && <AlertTriangle size={16} color={getSeverityColor(alert.severity)} />}
        </View>
        <Text style={styles.alertTitle}>{alert.title}</Text>
      </View>
      <Text style={styles.alertMessage}>{alert.message}</Text>
    </TouchableOpacity>
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#DC2626';
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  const handleAlertPress = (alert: Alert) => {
    // In real app, this would navigate to the relevant module with filter
    console.log('Alert pressed:', alert);
  };

  const renderTaskRow = (task: any) => (
    <View key={task.id} style={styles.taskRow}>
      <View style={styles.taskInfo}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        <Text style={styles.taskDate}>{task.dueDate}</Text>
      </View>
      <View style={styles.taskMeta}>
        <View style={styles.operatorContainer}>
          <Users size={16} color="#6B7280" />
          <Text style={styles.operatorText}>{task.assignee}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(task.status) }]}>{task.status}</Text>
        </View>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) + '20' }]}>
          <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>{task.priority}</Text>
        </View>
      </View>
    </View>
  );

  const renderActivityRow = (activity: any) => (
    <View key={activity.id} style={styles.activityRow}>
      <View style={[styles.activityIcon, { backgroundColor: getActivityColor(activity.type) + '20' }]}>
        <CheckCircle size={16} color={getActivityColor(activity.type)} />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityText}>{activity.activity}</Text>
        <Text style={styles.activityTime}>{activity.time}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#10B981']}
            tintColor="#10B981"
          />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Farm Dashboard</Text>
            <Text style={styles.subtitle}>Welcome back, {user?.name || 'User'}!</Text>
          </View>
          <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {/* KPI Widgets */}
        <View style={styles.kpiContainer}>
          {kpiWidgets.map((item, index) => renderKPIWidget(item, index))}
        </View>

        {/* Alerts Panel */}
        {alerts.length > 0 && (
          <View style={styles.alertsSection}>
            <Text style={styles.sectionTitle}>Alerts</Text>
            <View style={styles.alertsContainer}>
              {alerts.slice(0, 3).map(renderAlert)}
              {alerts.length > 3 && (
                <TouchableOpacity style={styles.viewAllAlertsButton}>
                  <Text style={styles.viewAllAlertsText}>View All Alerts ({alerts.length})</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Charts Section */}
        <View style={styles.chartSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Farm Analytics</Text>
            <View style={styles.periodSelector}>
              {['week', 'month', 'year'].map((period) => (
                <TouchableOpacity
                  key={period}
                  style={[
                    styles.periodButton,
                    selectedPeriod === period && styles.periodButtonActive
                  ]}
                  onPress={() => setSelectedPeriod(period)}
                >
                  <Text style={[
                    styles.periodButtonText,
                    selectedPeriod === period && styles.periodButtonTextActive
                  ]}>
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.chartPlaceholder}>
            <TrendingUp size={48} color="#10B981" />
            <Text style={styles.chartPlaceholderText}>Operations Trend</Text>
            <Text style={styles.chartPlaceholderSubtext}>
              {(plantings.length + harvests.length + treatments.length + fertilizations.length + irrigations.length)} operations this {selectedPeriod}
            </Text>
          </View>
        </View>

        {/* Upcoming Tasks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
          {upcomingTasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No tasks created yet</Text>
              <Text style={styles.emptyStateSubtext}>Create tasks in the Operations tab</Text>
            </View>
          ) : (
            <View style={styles.taskContainer}>
              {upcomingTasks.map(renderTaskRow)}
            </View>
          )}
        </View>

        {/* Recent Activities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>
          {recentActivities.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No activities yet</Text>
              <Text style={styles.emptyStateSubtext}>Start adding operations to see activities</Text>
            </View>
          ) : (
            <View style={styles.activityContainer}>
              {recentActivities.map(renderActivityRow)}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'To Do': return '#F59E0B';
    case 'In Progress': return '#3B82F6';
    case 'Done': return '#10B981';
    default: return '#6B7280';
  }
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'High': return '#EF4444';
    case 'Medium': return '#F59E0B';
    case 'Low': return '#10B981';
    default: return '#6B7280';
  }
}

function getActivityColor(type: string): string {
  switch (type) {
    case 'planting': return '#10B981';
    case 'harvest': return '#F59E0B';
    case 'treatment': return '#EF4444';
    case 'fertilization': return '#3B82F6';
    case 'irrigation': return '#06B6D4';
    default: return '#6B7280';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  refreshButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  kpiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  kpiCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    width: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  kpiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  kpiIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kpiValues: {
    alignItems: 'flex-end',
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  kpiChange: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  kpiTitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  alertsSection: {
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
  alertsContainer: {
    marginTop: 12,
  },
  alertCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertIcon: {
    marginRight: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  alertMessage: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  viewAllAlertsButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewAllAlertsText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  chartSection: {
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 2,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  periodButtonActive: {
    backgroundColor: '#10B981',
  },
  periodButtonText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
  },
  chartPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  chartPlaceholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 8,
  },
  chartPlaceholderSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
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
  emptyState: {
    padding: 20,
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
  taskContainer: {
    marginTop: 16,
  },
  taskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  taskDate: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  taskMeta: {
    alignItems: 'flex-end',
  },
  operatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  operatorText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  activityContainer: {
    marginTop: 16,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
});