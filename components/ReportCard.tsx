import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FileText, Download, Clock, CircleCheck as CheckCircle } from 'lucide-react-native';

interface ReportCardProps {
  report: {
    id: number;
    name: string;
    date: string;
    size: string;
    status: string;
    type?: string;
  };
  onDownload?: () => void;
  onView?: () => void;
}

export default function ReportCard({ report, onDownload, onView }: ReportCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready': return '#10B981';
      case 'Processing': return '#F59E0B';
      case 'Failed': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Ready': return <CheckCircle size={16} color="#10B981" />;
      case 'Processing': return <Clock size={16} color="#F59E0B" />;
      case 'Failed': return <Clock size={16} color="#EF4444" />;
      default: return <Clock size={16} color="#6B7280" />;
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onView}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <FileText size={20} color="#10B981" />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.reportName}>{report.name}</Text>
          <Text style={styles.reportMeta}>{report.date} • {report.size}</Text>
          {report.type && (
            <Text style={styles.reportType}>{report.type}</Text>
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.statusContainer}>
          {getStatusIcon(report.status)}
          <Text style={[styles.statusText, { color: getStatusColor(report.status) }]}>
            {report.status}
          </Text>
        </View>

        {report.status === 'Ready' && onDownload && (
          <TouchableOpacity style={styles.downloadButton} onPress={onDownload}>
            <Download size={16} color="#10B981" />
            <Text style={styles.downloadText}>Download</Text>
          </TouchableOpacity>
        )}
      </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#10B981' + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  reportName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  reportMeta: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  reportType: {
    fontSize: 11,
    color: '#3B82F6',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981' + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  downloadText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#10B981',
    marginLeft: 4,
  },
});