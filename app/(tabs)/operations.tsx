import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Sprout, Plus, MapPin, Package, Bug, Droplets, Check, Target, FileText, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { OperationsProvider } from '@/hooks/useOperations';
import { useOperationsContext } from '@/hooks/useOperations';
import FarmsFieldsCropsTab from '@/components/operations/FarmsFieldsCropsTab';
import TasksTab from '@/components/operations/TasksTab';
import PlantingsTab from '@/components/operations/PlantingsTab';
import HarvestsTab from '@/components/operations/HarvestsTab';
import TreatmentPlanner from './treatments';
import FertilizationTab from '@/components/operations/FertilizationTab';
import IrrigationTab from '@/components/operations/IrrigationTab';
import IPMTab from '@/components/operations/IPMTab';
import BatchOperationsTab from '@/components/operations/BatchOperationsTab';

const operationsTabs = [
  { id: 'farms-fields-crops', title: 'Farms & Fields', icon: 'mappin' },
  { id: 'plantings', title: 'Plantings', icon: 'sprout' },
  { id: 'harvests', title: 'Harvests', icon: 'package' },
  { id: 'treatments', title: 'Treatments', icon: 'bug' },
  { id: 'fertilization', title: 'Fertilization', icon: 'droplets' },
  { id: 'irrigation', title: 'Irrigation', icon: 'droplets' },
  { id: 'tasks', title: 'Tasks', icon: 'check' },
  { id: 'ipm', title: 'IPM', icon: 'target' },
  { id: 'batch-operations', title: 'Batch Ops', icon: 'filetext' },
];

function OperationsInner() {
  const [activeTab, setActiveTab] = useState('farms-fields-crops');
  const operationsData = useOperationsContext();

  const renderTabButton = (tab: any) => (
    <TouchableOpacity
      key={tab.id}
      style={[styles.tabButton, activeTab === tab.id && styles.tabButtonActive]}
      onPress={() => setActiveTab(tab.id)}
    >
      <View style={styles.tabIcon}>
        {tab.icon === 'mappin' && <MapPin size={18} color={activeTab === tab.id ? '#FFFFFF' : '#6B7280'} />}
        {tab.icon === 'sprout' && <Sprout size={18} color={activeTab === tab.id ? '#FFFFFF' : '#6B7280'} />}
        {tab.icon === 'package' && <Package size={18} color={activeTab === tab.id ? '#FFFFFF' : '#6B7280'} />}
        {tab.icon === 'bug' && <Bug size={18} color={activeTab === tab.id ? '#FFFFFF' : '#6B7280'} />}
        {tab.icon === 'droplets' && <Droplets size={18} color={activeTab === tab.id ? '#FFFFFF' : '#6B7280'} />}
        {tab.icon === 'check' && <Check size={18} color={activeTab === tab.id ? '#FFFFFF' : '#6B7280'} />}
        {tab.icon === 'target' && <Target size={18} color={activeTab === tab.id ? '#FFFFFF' : '#6B7280'} />}
        {tab.icon === 'filetext' && <FileText size={18} color={activeTab === tab.id ? '#FFFFFF' : '#6B7280'} />}
      </View>
      <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
        {tab.title}
      </Text>
    </TouchableOpacity>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'farms-fields-crops':
        return <FarmsFieldsCropsTab />;
      case 'plantings':
        return <PlantingsTab />;
      case 'harvests':
        return <HarvestsTab />;
      case 'treatments':
        return <TreatmentPlanner />;
      case 'fertilization':
        return <FertilizationTab />;
      case 'irrigation':
        return <IrrigationTab />;
      case 'tasks':
        return <TasksTab />;
      case 'ipm':
        return <IPMTab />;
      case 'batch-operations':
        return <BatchOperationsTab />;
      default:
        return <FarmsFieldsCropsTab />;
    }
  };

  if (operationsData.loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading operations...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (operationsData.error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <AlertTriangle size={48} color="#EF4444" />
          <Text style={styles.errorText}>{operationsData.error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Operations Management</Text>
        <Text style={styles.subtitle}>Manage all farm operations and activities</Text>
      </View>

      <View style={styles.tabContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.tabScrollContent}
        >
          {operationsTabs.map(renderTabButton)}
        </ScrollView>
      </View>

      <View style={styles.content}>
        {renderContent()}
      </View>
    </SafeAreaView>
  );
}

export default function Operations() {
  return (
    <OperationsProvider>
      <OperationsInner />
    </OperationsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  tabContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 8,
    maxHeight: 60,
  },
  tabScrollContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    minWidth: 100,
  },
  tabButtonActive: {
    backgroundColor: '#10B981',
  },
  tabIcon: {
    marginRight: 6,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 16,
  },
});