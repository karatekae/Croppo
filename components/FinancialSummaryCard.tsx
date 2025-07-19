import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react-native';

interface FinancialSummaryCardProps {
  title: string;
  amount: number;
  change?: number;
  changeType?: 'increase' | 'decrease';
  icon?: 'revenue' | 'expense' | 'profit';
  currency?: string;
}

export default function FinancialSummaryCard({ 
  title, 
  amount, 
  change, 
  changeType, 
  icon = 'revenue',
  currency = 'USD'
}: FinancialSummaryCardProps) {
  const getIconComponent = () => {
    switch (icon) {
      case 'revenue':
        return <TrendingUp size={24} color="#10B981" />;
      case 'expense':
        return <TrendingDown size={24} color="#EF4444" />;
      case 'profit':
        return <DollarSign size={24} color="#3B82F6" />;
      default:
        return <DollarSign size={24} color="#6B7280" />;
    }
  };

  const getChangeColor = () => {
    if (!change) return '#6B7280';
    return changeType === 'increase' ? '#10B981' : '#EF4444';
  };

  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {getIconComponent()}
        <Text style={styles.title}>{title}</Text>
      </View>
      
      <Text style={styles.amount}>{formatAmount(amount)}</Text>
      
      {change !== undefined && (
        <View style={styles.changeContainer}>
          {changeType === 'increase' ? (
            <TrendingUp size={16} color={getChangeColor()} />
          ) : (
            <TrendingDown size={16} color={getChangeColor()} />
          )}
          <Text style={[styles.changeText, { color: getChangeColor() }]}>
            {Math.abs(change)}% from last month
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flex: 1,
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
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    fontWeight: '500',
  },
  amount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
});