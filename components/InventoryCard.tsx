import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Package, TriangleAlert as AlertTriangle, TrendingDown } from 'lucide-react-native';

interface InventoryCardProps {
  item: {
    id: number;
    name: string;
    category: string;
    stock: number;
    unit: string;
    minStock: number;
    status: string;
    costPerUnit: number;
    totalValue: number;
    supplier: string;
    location: string;
    expiryDate?: string;
  };
  onPress?: () => void;
}

export default function InventoryCard({ item, onPress }: InventoryCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Good': return '#10B981';
      case 'Low': return '#F59E0B';
      case 'Critical': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Good': return <Package size={20} color="#10B981" />;
      case 'Low': return <AlertTriangle size={20} color="#F59E0B" />;
      case 'Critical': return <TrendingDown size={20} color="#EF4444" />;
      default: return <Package size={20} color="#6B7280" />;
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          {getStatusIcon(item.status)}
          <View style={styles.titleText}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.category}>{item.category}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.stockInfo}>
        <View style={styles.stockContainer}>
          <Text style={styles.stockValue}>{item.stock}</Text>
          <Text style={styles.stockUnit}>{item.unit}</Text>
        </View>
        <Text style={styles.minStock}>Min: {item.minStock} {item.unit}</Text>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Value:</Text>
          <Text style={styles.detailValue}>${item.totalValue.toLocaleString()}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Unit Cost:</Text>
          <Text style={styles.detailValue}>${item.costPerUnit}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Supplier:</Text>
          <Text style={styles.detailValue}>{item.supplier}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Location:</Text>
          <Text style={styles.detailValue}>📍 {item.location}</Text>
        </View>
        {item.expiryDate && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Expires:</Text>
            <Text style={styles.detailValue}>{item.expiryDate}</Text>
          </View>
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  titleText: {
    marginLeft: 12,
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  category: {
    fontSize: 12,
    color: '#6B7280',
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
  stockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  stockValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  stockUnit: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  minStock: {
    fontSize: 12,
    color: '#6B7280',
  },
  details: {
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111827',
  },
});