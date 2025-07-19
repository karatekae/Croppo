import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Switch } from 'react-native';
import { FileText, Download, Filter, Calendar, SquareCheck as CheckSquare, ChartBar as BarChart3, ChartPie as PieChart } from 'lucide-react-native';

const reportSections = [
  { id: 'operations', title: 'Operations', description: 'Field activities, treatments, and tasks', enabled: true },
  { id: 'inventory', title: 'Inventory', description: 'Stock levels, transactions, and usage', enabled: true },
  { id: 'finance', title: 'Finance', description: 'Financial statements and transactions', enabled: false },
  { id: 'labor', title: 'Labor', description: 'Workforce and payroll information', enabled: false },
];

const reportTemplates = [
  { id: 1, name: 'Monthly Operations Summary', type: 'Operations', frequency: 'Monthly', lastGenerated: '2025-01-01' },
  { id: 2, name: 'Inventory Status Report', type: 'Inventory', frequency: 'Weekly', lastGenerated: '2025-01-10' },
  { id: 3, name: 'Financial Statement', type: 'Finance', frequency: 'Monthly', lastGenerated: '2025-01-01' },
  { id: 4, name: 'Crop Performance Analysis', type: 'Operations', frequency: 'Quarterly', lastGenerated: '2024-12-31' },
];

const recentReports = [
  { id: 1, name: 'Weekly Operations Report', date: '2025-01-14', size: '2.4 MB', status: 'Ready' },
  { id: 2, name: 'Inventory Analysis', date: '2025-01-13', size: '1.8 MB', status: 'Ready' },
  { id: 3, name: 'Monthly Financial Summary', date: '2025-01-12', size: '3.2 MB', status: 'Processing' },
  { id: 4, name: 'Crop Yield Report', date: '2025-01-11', size: '4.1 MB', status: 'Ready' },
];

export default function Reports() {
  const [selectedSections, setSelectedSections] = useState(reportSections);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [reportTitle, setReportTitle] = useState('Custom Farm Report');

  const toggleSection = (sectionId: string) => {
    setSelectedSections(prev => 
      prev.map(section => 
        section.id === sectionId 
          ? { ...section, enabled: !section.enabled }
          : section
      )
    );
  };

  const renderSectionToggle = (section: any) => (
    <View key={section.id} style={styles.sectionToggle}>
      <View style={styles.sectionInfo}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
        <Text style={styles.sectionDescription}>{section.description}</Text>
      </View>
      <Switch
        value={section.enabled}
        onValueChange={() => toggleSection(section.id)}
        trackColor={{ false: '#E5E7EB', true: '#10B981' }}
        thumbColor={section.enabled ? '#FFFFFF' : '#FFFFFF'}
      />
    </View>
  );

  const renderPeriodButton = (period: string, label: string) => (
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
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderReportTemplate = (template: any) => (
    <TouchableOpacity key={template.id} style={styles.templateCard}>
      <View style={styles.templateHeader}>
        <View style={styles.templateInfo}>
          <Text style={styles.templateName}>{template.name}</Text>
          <Text style={styles.templateType}>{template.type}</Text>
        </View>
        <View style={styles.templateMeta}>
          <Text style={styles.templateFrequency}>{template.frequency}</Text>
          <Text style={styles.templateDate}>Last: {template.lastGenerated}</Text>
        </View>
      </View>
      <View style={styles.templateActions}>
        <TouchableOpacity style={styles.templateButton}>
          <Text style={styles.templateButtonText}>Generate</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.templateButton, styles.templateButtonSecondary]}>
          <Text style={[styles.templateButtonText, styles.templateButtonTextSecondary]}>Edit</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderRecentReport = (report: any) => (
    <TouchableOpacity key={report.id} style={styles.reportRow}>
      <View style={styles.reportIcon}>
        <FileText size={20} color="#10B981" />
      </View>
      <View style={styles.reportInfo}>
        <Text style={styles.reportName}>{report.name}</Text>
        <Text style={styles.reportMeta}>{report.date} • {report.size}</Text>
      </View>
      <View style={styles.reportActions}>
        <View style={[styles.statusBadge, { backgroundColor: getReportStatusColor(report.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getReportStatusColor(report.status) }]}>
            {report.status}
          </Text>
        </View>
        {report.status === 'Ready' && (
          <TouchableOpacity style={styles.downloadButton}>
            <Download size={16} color="#10B981" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reports & Analytics</Text>
        <Text style={styles.subtitle}>Generate comprehensive farm reports</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Report Generator */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Generate Custom Report</Text>
          
          <View style={styles.reportBuilder}>
            <View style={styles.builderSection}>
              <Text style={styles.builderTitle}>Report Sections</Text>
              <Text style={styles.builderDescription}>Select which sections to include in your report</Text>
              
              <View style={styles.sectionsContainer}>
                {selectedSections.map(renderSectionToggle)}
              </View>
            </View>

            <View style={styles.builderSection}>
              <Text style={styles.builderTitle}>Time Period</Text>
              <Text style={styles.builderDescription}>Choose the reporting period</Text>
              
              <View style={styles.periodSelector}>
                {renderPeriodButton('week', 'This Week')}
                {renderPeriodButton('month', 'This Month')}
                {renderPeriodButton('quarter', 'This Quarter')}
                {renderPeriodButton('year', 'This Year')}
              </View>
            </View>

            <View style={styles.builderSection}>
              <Text style={styles.builderTitle}>Additional Options</Text>
              
              <View style={styles.optionsContainer}>
                <TouchableOpacity style={styles.optionRow}>
                  <Filter size={20} color="#6B7280" />
                  <Text style={styles.optionText}>Advanced Filters</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.optionRow}>
                  <Calendar size={20} color="#6B7280" />
                  <Text style={styles.optionText}>Custom Date Range</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.generateContainer}>
              <TouchableOpacity style={styles.generateButton}>
                <FileText size={20} color="#FFFFFF" />
                <Text style={styles.generateButtonText}>Generate Report</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.previewButton}>
                <Text style={styles.previewButtonText}>Preview</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Report Templates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Report Templates</Text>
          
          <View style={styles.templatesContainer}>
            {reportTemplates.map(renderReportTemplate)}
          </View>
        </View>

        {/* Analytics Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Analytics Overview</Text>
          
          <View style={styles.analyticsContainer}>
            <View style={styles.analyticsCard}>
              <BarChart3 size={32} color="#10B981" />
              <Text style={styles.analyticsTitle}>Operations Trends</Text>
              <Text style={styles.analyticsDescription}>Track field activities over time</Text>
            </View>
            
            <View style={styles.analyticsCard}>
              <PieChart size={32} color="#3B82F6" />
              <Text style={styles.analyticsTitle}>Resource Usage</Text>
              <Text style={styles.analyticsDescription}>Analyze inventory consumption</Text>
            </View>
          </View>
        </View>

        {/* Recent Reports */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Reports</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllButtonText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.recentReportsContainer}>
            {recentReports.map(renderRecentReport)}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getReportStatusColor(status: string): string {
  switch (status) {
    case 'Ready': return '#10B981';
    case 'Processing': return '#F59E0B';
    case 'Failed': return '#EF4444';
    default: return '#6B7280';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
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
  content: {
    flex: 1,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  reportBuilder: {
    gap: 24,
  },
  builderSection: {
    gap: 8,
  },
  builderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  builderDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  sectionsContainer: {
    gap: 12,
  },
  sectionToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  sectionInfo: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  periodSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#10B981',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
  },
  optionsContainer: {
    gap: 12,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 12,
  },
  generateContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  generateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#10B981',
    borderRadius: 12,
    gap: 8,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  previewButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  templatesContainer: {
    gap: 12,
  },
  templateCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  templateInfo: {
    flex: 1,
  },
  templateName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  templateType: {
    fontSize: 14,
    color: '#6B7280',
  },
  templateMeta: {
    alignItems: 'flex-end',
  },
  templateFrequency: {
    fontSize: 12,
    fontWeight: '500',
    color: '#10B981',
  },
  templateDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  templateActions: {
    flexDirection: 'row',
    gap: 8,
  },
  templateButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#10B981',
    borderRadius: 8,
    alignItems: 'center',
  },
  templateButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  templateButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  templateButtonTextSecondary: {
    color: '#6B7280',
  },
  analyticsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  analyticsCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  analyticsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginTop: 12,
    marginBottom: 4,
  },
  analyticsDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  viewAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  viewAllButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  recentReportsContainer: {
    gap: 8,
  },
  reportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  reportIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#10B981' + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reportInfo: {
    flex: 1,
  },
  reportName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  reportMeta: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  reportActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  downloadButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#10B981' + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
});