import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { DollarSign, CreditCard, Receipt, Users, FileText, Calculator, TrendingUp } from 'lucide-react-native';

const financeTabs = [
  { id: 'accounts', title: 'Accounts', icon: 'creditcard' },
  { id: 'transactions', title: 'Transactions', icon: 'dollarsign' },
  { id: 'invoices', title: 'Invoices', icon: 'receipt' },
  { id: 'payroll', title: 'Payroll', icon: 'users' },
  { id: 'reports', title: 'Reports', icon: 'filetext' },
];

const accountsData = [
  { id: 1, name: 'Cash Account', type: 'Asset', balance: 45000, currency: 'USD' },
  { id: 2, name: 'Equipment', type: 'Asset', balance: 120000, currency: 'USD' },
  { id: 3, name: 'Fertilizer Expenses', type: 'Expense', balance: 8500, currency: 'USD' },
  { id: 4, name: 'Crop Sales', type: 'Revenue', balance: 65000, currency: 'USD' },
  { id: 5, name: 'Bank Loan', type: 'Liability', balance: 25000, currency: 'USD' },
];

const transactionsData = [
  { id: 1, date: '2025-01-14', description: 'Fertilizer Purchase', account: 'Fertilizer Expenses', amount: 1500, type: 'Expense' },
  { id: 2, date: '2025-01-13', description: 'Tomato Sales', account: 'Crop Sales', amount: 3200, type: 'Revenue' },
  { id: 3, date: '2025-01-12', description: 'Equipment Maintenance', account: 'Equipment', amount: 800, type: 'Expense' },
  { id: 4, date: '2025-01-11', description: 'Seed Purchase', account: 'Crop Expenses', amount: 600, type: 'Expense' },
];

const invoicesData = [
  { id: 1, number: 'INV-001', client: 'Green Market Co.', amount: 3200, dueDate: '2025-01-20', status: 'Paid' },
  { id: 2, number: 'INV-002', client: 'Fresh Foods Ltd.', amount: 2800, dueDate: '2025-01-25', status: 'Pending' },
  { id: 3, number: 'INV-003', client: 'Organic Distributors', amount: 4500, dueDate: '2025-01-30', status: 'Overdue' },
  { id: 4, number: 'INV-004', client: 'Local Restaurant', amount: 1200, dueDate: '2025-02-05', status: 'Draft' },
];

const payrollData = [
  { id: 1, employee: 'John Smith', position: 'Farm Manager', salary: 4500, period: 'January 2025', status: 'Paid' },
  { id: 2, employee: 'Sarah Johnson', position: 'Field Supervisor', salary: 3800, period: 'January 2025', status: 'Paid' },
  { id: 3, employee: 'Mike Davis', position: 'Equipment Operator', salary: 3200, period: 'January 2025', status: 'Pending' },
  { id: 4, employee: 'Lisa Wilson', position: 'Quality Controller', salary: 3500, period: 'January 2025', status: 'Pending' },
];

export default function Finance() {
  const [activeTab, setActiveTab] = useState('accounts');

  const renderTabButton = (tab: any) => (
    <TouchableOpacity
      key={tab.id}
      style={[styles.tabButton, activeTab === tab.id && styles.tabButtonActive]}
      onPress={() => setActiveTab(tab.id)}
    >
      <View style={styles.tabIcon}>
        {tab.icon === 'creditcard' && <CreditCard size={20} color={activeTab === tab.id ? '#FFFFFF' : '#6B7280'} />}
        {tab.icon === 'dollarsign' && <DollarSign size={20} color={activeTab === tab.id ? '#FFFFFF' : '#6B7280'} />}
        {tab.icon === 'receipt' && <Receipt size={20} color={activeTab === tab.id ? '#FFFFFF' : '#6B7280'} />}
        {tab.icon === 'users' && <Users size={20} color={activeTab === tab.id ? '#FFFFFF' : '#6B7280'} />}
        {tab.icon === 'filetext' && <FileText size={20} color={activeTab === tab.id ? '#FFFFFF' : '#6B7280'} />}
      </View>
      <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
        {tab.title}
      </Text>
    </TouchableOpacity>
  );

  const renderFinancialSummary = () => (
    <View style={styles.summaryContainer}>
      <View style={styles.summaryCard}>
        <TrendingUp size={24} color="#10B981" />
        <Text style={styles.summaryValue}>$65,000</Text>
        <Text style={styles.summaryLabel}>Total Revenue</Text>
        <Text style={styles.summaryChange}>+12.5%</Text>
      </View>
      <View style={styles.summaryCard}>
        <Calculator size={24} color="#EF4444" />
        <Text style={styles.summaryValue}>$18,400</Text>
        <Text style={styles.summaryLabel}>Total Expenses</Text>
        <Text style={styles.summaryChange}>+8.3%</Text>
      </View>
      <View style={styles.summaryCard}>
        <DollarSign size={24} color="#3B82F6" />
        <Text style={styles.summaryValue}>$46,600</Text>
        <Text style={styles.summaryLabel}>Net Profit</Text>
        <Text style={styles.summaryChange}>+15.2%</Text>
      </View>
    </View>
  );

  const renderAccountsContent = () => (
    <View style={styles.contentContainer}>
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Chart of Accounts</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Account</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.tableCellHeader]}>Account Name</Text>
          <Text style={[styles.tableCell, styles.tableCellHeader]}>Type</Text>
          <Text style={[styles.tableCell, styles.tableCellHeader]}>Balance</Text>
          <Text style={[styles.tableCell, styles.tableCellHeader]}>Currency</Text>
        </View>
        {accountsData.map((account) => (
          <TouchableOpacity key={account.id} style={styles.tableRow}>
            <Text style={styles.tableCell}>{account.name}</Text>
            <View style={[styles.typeBadge, { backgroundColor: getAccountTypeColor(account.type) + '20' }]}>
              <Text style={[styles.typeText, { color: getAccountTypeColor(account.type) }]}>
                {account.type}
              </Text>
            </View>
            <Text style={[styles.tableCell, styles.balanceText]}>
              ${account.balance.toLocaleString()}
            </Text>
            <Text style={styles.tableCell}>{account.currency}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderTransactionsContent = () => (
    <View style={styles.contentContainer}>
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Recent Transactions</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Transaction</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.tableCellHeader]}>Date</Text>
          <Text style={[styles.tableCell, styles.tableCellHeader]}>Description</Text>
          <Text style={[styles.tableCell, styles.tableCellHeader]}>Account</Text>
          <Text style={[styles.tableCell, styles.tableCellHeader]}>Amount</Text>
          <Text style={[styles.tableCell, styles.tableCellHeader]}>Type</Text>
        </View>
        {transactionsData.map((transaction) => (
          <TouchableOpacity key={transaction.id} style={styles.tableRow}>
            <Text style={styles.tableCell}>{transaction.date}</Text>
            <Text style={styles.tableCell}>{transaction.description}</Text>
            <Text style={styles.tableCell}>{transaction.account}</Text>
            <Text style={[styles.tableCell, styles.amountText, { 
              color: transaction.type === 'Revenue' ? '#10B981' : '#EF4444' 
            }]}>
              ${transaction.amount.toLocaleString()}
            </Text>
            <View style={[styles.typeBadge, { backgroundColor: getTransactionTypeColor(transaction.type) + '20' }]}>
              <Text style={[styles.typeText, { color: getTransactionTypeColor(transaction.type) }]}>
                {transaction.type}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderInvoicesContent = () => (
    <View style={styles.contentContainer}>
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Invoices</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Create Invoice</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.tableCellHeader]}>Invoice #</Text>
          <Text style={[styles.tableCell, styles.tableCellHeader]}>Client</Text>
          <Text style={[styles.tableCell, styles.tableCellHeader]}>Amount</Text>
          <Text style={[styles.tableCell, styles.tableCellHeader]}>Due Date</Text>
          <Text style={[styles.tableCell, styles.tableCellHeader]}>Status</Text>
        </View>
        {invoicesData.map((invoice) => (
          <TouchableOpacity key={invoice.id} style={styles.tableRow}>
            <Text style={styles.tableCell}>{invoice.number}</Text>
            <Text style={styles.tableCell}>{invoice.client}</Text>
            <Text style={[styles.tableCell, styles.amountText]}>
              ${invoice.amount.toLocaleString()}
            </Text>
            <Text style={styles.tableCell}>{invoice.dueDate}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getInvoiceStatusColor(invoice.status) + '20' }]}>
              <Text style={[styles.statusText, { color: getInvoiceStatusColor(invoice.status) }]}>
                {invoice.status}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderPayrollContent = () => (
    <View style={styles.contentContainer}>
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Payroll Management</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Process Payroll</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.tableCellHeader]}>Employee</Text>
          <Text style={[styles.tableCell, styles.tableCellHeader]}>Position</Text>
          <Text style={[styles.tableCell, styles.tableCellHeader]}>Salary</Text>
          <Text style={[styles.tableCell, styles.tableCellHeader]}>Period</Text>
          <Text style={[styles.tableCell, styles.tableCellHeader]}>Status</Text>
        </View>
        {payrollData.map((payroll) => (
          <TouchableOpacity key={payroll.id} style={styles.tableRow}>
            <Text style={styles.tableCell}>{payroll.employee}</Text>
            <Text style={styles.tableCell}>{payroll.position}</Text>
            <Text style={[styles.tableCell, styles.amountText]}>
              ${payroll.salary.toLocaleString()}
            </Text>
            <Text style={styles.tableCell}>{payroll.period}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getPayrollStatusColor(payroll.status) + '20' }]}>
              <Text style={[styles.statusText, { color: getPayrollStatusColor(payroll.status) }]}>
                {payroll.status}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'accounts':
        return renderAccountsContent();
      case 'transactions':
        return renderTransactionsContent();
      case 'invoices':
        return renderInvoicesContent();
      case 'payroll':
        return renderPayrollContent();
      default:
        return (
          <View style={styles.placeholderContainer}>
            <FileText size={48} color="#10B981" />
            <Text style={styles.placeholderText}>Financial Reports</Text>
            <Text style={styles.placeholderSubtext}>Feature coming soon</Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Financial Management</Text>
        <Text style={styles.subtitle}>Track your farm's financial health</Text>
      </View>
      
      {renderFinancialSummary()}
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer}>
        {financeTabs.map(renderTabButton)}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

function getAccountTypeColor(type: string): string {
  switch (type) {
    case 'Asset': return '#10B981';
    case 'Liability': return '#EF4444';
    case 'Revenue': return '#3B82F6';
    case 'Expense': return '#F59E0B';
    default: return '#6B7280';
  }
}

function getTransactionTypeColor(type: string): string {
  switch (type) {
    case 'Revenue': return '#10B981';
    case 'Expense': return '#EF4444';
    default: return '#6B7280';
  }
}

function getInvoiceStatusColor(status: string): string {
  switch (status) {
    case 'Paid': return '#10B981';
    case 'Pending': return '#F59E0B';
    case 'Overdue': return '#EF4444';
    case 'Draft': return '#6B7280';
    default: return '#6B7280';
  }
}

function getPayrollStatusColor(status: string): string {
  switch (status) {
    case 'Paid': return '#10B981';
    case 'Pending': return '#F59E0B';
    case 'Processing': return '#3B82F6';
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
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginVertical: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  summaryChange: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
  },
  tabContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  tabButtonActive: {
    backgroundColor: '#10B981',
  },
  tabIcon: {
    marginRight: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  content: {
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
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    flex: 1,
  },
  typeText: {
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
  balanceText: {
    fontWeight: '600',
    fontSize: 14,
  },
  amountText: {
    fontWeight: '600',
    fontSize: 14,
  },
  placeholderContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
});