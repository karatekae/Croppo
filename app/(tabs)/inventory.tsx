import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Switch, TextInput, Modal } from 'react-native';
import { Package, ArrowUp, ArrowDown, TriangleAlert as AlertTriangle, TrendingDown, Plus, Search, Filter, Calendar, Camera, Scan, Users, DollarSign, Clock, MapPin, X } from 'lucide-react-native';
import { useRequestQueueContext } from '@/hooks/useRequestQueue';
import { useInventoryContext } from '@/hooks/useInventory';

const inventoryTabs = [
  { id: 'items', title: 'Items', icon: 'package' },
  { id: 'transactions', title: 'Transactions', icon: 'arrow' },
  { id: 'alerts', title: 'Alerts', icon: 'alert' },
  { id: 'suppliers', title: 'Suppliers', icon: 'users' },
  { id: 'valuation', title: 'Valuation', icon: 'dollarsign' },
  { id: 'requests', title: 'Requests', icon: 'alert' },
];

const inventoryItems = [
  { 
    id: 1, 
    name: 'NPK Fertilizer 20-10-10', 
    category: 'Fertilizers', 
    stock: 150, 
    unit: 'kg', 
    minStock: 50, 
    reorderQty: 200,
    costPerUnit: 2.50,
    totalValue: 375,
    supplier: 'AgriSupply Co.',
    barcode: '123456789012',
    expiryDate: '2025-12-31',
    status: 'Good',
    location: 'Warehouse A-1'
  },
  { 
    id: 2, 
    name: 'Organic Pesticide BT', 
    category: 'Pesticides', 
    stock: 25, 
    unit: 'L', 
    minStock: 30, 
    reorderQty: 50,
    costPerUnit: 45.00,
    totalValue: 1125,
    supplier: 'BioControl Ltd.',
    barcode: '234567890123',
    expiryDate: '2025-06-15',
    status: 'Low',
    location: 'Chemical Store B-2'
  },
  { 
    id: 3, 
    name: 'Tomato Seeds - Hybrid Variety', 
    category: 'Seeds', 
    stock: 500, 
    unit: 'packs', 
    minStock: 100, 
    reorderQty: 300,
    costPerUnit: 12.00,
    totalValue: 6000,
    supplier: 'Premium Seeds Inc.',
    barcode: '345678901234',
    expiryDate: '2026-03-01',
    status: 'Good',
    location: 'Seed Storage C-1'
  },
  { 
    id: 4, 
    name: 'Irrigation Pipes 4-inch', 
    category: 'Equipment', 
    stock: 12, 
    unit: 'pcs', 
    minStock: 20, 
    reorderQty: 50,
    costPerUnit: 85.00,
    totalValue: 1020,
    supplier: 'IrriTech Solutions',
    barcode: '456789012345',
    expiryDate: null,
    status: 'Critical',
    location: 'Equipment Yard D-1'
  },
];

const transactions = [
  { 
    id: 1, 
    date: '2025-01-14', 
    time: '09:30',
    item: 'NPK Fertilizer 20-10-10', 
    type: 'Stock Out', 
    quantity: 25, 
    operator: 'John Smith', 
    reason: 'Field A Fertilization',
    field: 'Field A',
    costImpact: -62.50,
    batchNumber: 'BATCH-2025-001'
  },
  { 
    id: 2, 
    date: '2025-01-13', 
    time: '14:15',
    item: 'Organic Pesticide BT', 
    type: 'Stock In', 
    quantity: 50, 
    operator: 'Sarah Johnson', 
    reason: 'New Purchase - Invoice #INV-2025-045',
    supplier: 'BioControl Ltd.',
    costImpact: 2250.00,
    batchNumber: 'BATCH-2025-002'
  },
  { 
    id: 3, 
    date: '2025-01-12', 
    time: '11:45',
    item: 'Tomato Seeds - Hybrid Variety', 
    type: 'Stock Out', 
    quantity: 10, 
    operator: 'Mike Davis', 
    reason: 'Field B Planting',
    field: 'Field B',
    costImpact: -120.00,
    batchNumber: 'BATCH-2025-003'
  },
];

const alerts = [
  { 
    id: 1, 
    type: 'Low Stock', 
    item: 'Organic Pesticide BT', 
    current: 25, 
    minimum: 30, 
    severity: 'Medium',
    daysUntilEmpty: 15,
    suggestedAction: 'Reorder 50L from BioControl Ltd.'
  },
  { 
    id: 2, 
    type: 'Critical Stock', 
    item: 'Irrigation Pipes 4-inch', 
    current: 12, 
    minimum: 20, 
    severity: 'High',
    daysUntilEmpty: 8,
    suggestedAction: 'Urgent reorder required - 50 pieces'
  },
  { 
    id: 3, 
    type: 'Expiring Soon', 
    item: 'Organic Pesticide BT', 
    expiryDate: '2025-06-15', 
    daysUntilExpiry: 152,
    severity: 'Low',
    suggestedAction: 'Plan usage within 5 months'
  },
];

const suppliers = [
  {
    id: 1,
    name: 'AgriSupply Co.',
    contactPerson: 'Robert Chen',
    phone: '+1-555-0123',
    email: 'robert@agrisupply.com',
    address: '123 Farm Supply Rd, Agriculture City, AC 12345',
    category: 'Fertilizers & Chemicals',
    rating: 4.5,
    totalPurchases: 45000,
    lastOrder: '2025-01-10',
    paymentTerms: 'Net 30'
  },
  {
    id: 2,
    name: 'BioControl Ltd.',
    contactPerson: 'Maria Rodriguez',
    phone: '+1-555-0456',
    email: 'maria@biocontrol.com',
    address: '456 Organic Way, Green Valley, GV 67890',
    category: 'Organic Products',
    rating: 4.8,
    totalPurchases: 28000,
    lastOrder: '2025-01-13',
    paymentTerms: 'Net 15'
  },
];

export default function Inventory() {
  const [activeTab, setActiveTab] = useState('items');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Fertilizers', 'Pesticides', 'Seeds', 'Equipment', 'Harvested Goods'];
  const requestQueue = useRequestQueueContext();
  const inventory = useInventoryContext();

  const renderTabButton = (tab: any) => (
    <TouchableOpacity
      key={tab.id}
      style={[styles.tabButton, activeTab === tab.id && styles.tabButtonActive]}
      onPress={() => setActiveTab(tab.id)}
    >
      <View style={styles.tabIcon}>
        {tab.icon === 'package' && <Package size={20} color={activeTab === tab.id ? '#FFFFFF' : '#6B7280'} />}
        {tab.icon === 'arrow' && <ArrowUp size={20} color={activeTab === tab.id ? '#FFFFFF' : '#6B7280'} />}
        {tab.icon === 'alert' && <AlertTriangle size={20} color={activeTab === tab.id ? '#FFFFFF' : '#6B7280'} />}
        {tab.icon === 'users' && <Users size={20} color={activeTab === tab.id ? '#FFFFFF' : '#6B7280'} />}
        {tab.icon === 'dollarsign' && <DollarSign size={20} color={activeTab === tab.id ? '#FFFFFF' : '#6B7280'} />}
      </View>
      <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
        {tab.title}
      </Text>
    </TouchableOpacity>
  );

  const renderInventoryItems = () => (
    <View style={styles.contentContainer}>
      {/* Summary Cards */}
      <View style={styles.summaryCards}>
        <View style={styles.summaryCard}>
          <Package size={24} color="#10B981" />
          <Text style={styles.summaryCardValue}>24</Text>
          <Text style={styles.summaryCardLabel}>Total Items</Text>
          <Text style={styles.summaryCardSubtext}>$45,520 Value</Text>
        </View>
        <View style={styles.summaryCard}>
          <AlertTriangle size={24} color="#F59E0B" />
          <Text style={styles.summaryCardValue}>3</Text>
          <Text style={styles.summaryCardLabel}>Low Stock</Text>
          <Text style={styles.summaryCardSubtext}>Need Reorder</Text>
        </View>
        <View style={styles.summaryCard}>
          <TrendingDown size={24} color="#EF4444" />
          <Text style={styles.summaryCardValue}>1</Text>
          <Text style={styles.summaryCardLabel}>Critical</Text>
          <Text style={styles.summaryCardSubtext}>Urgent Action</Text>
        </View>
        <View style={styles.summaryCard}>
          <Clock size={24} color="#8B5CF6" />
          <Text style={styles.summaryCardValue}>2</Text>
          <Text style={styles.summaryCardLabel}>Expiring</Text>
          <Text style={styles.summaryCardSubtext}>Next 6 Months</Text>
        </View>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search items..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryFilter}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryButton, selectedCategory === category && styles.categoryButtonActive]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[styles.categoryButtonText, selectedCategory === category && styles.categoryButtonTextActive]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Add Item Button */}
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Inventory Items</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.scanButton} onPress={() => setShowBarcodeScanner(true)}>
            <Scan size={16} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
            <Plus size={16} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add Item</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Items List as Cards */}
      <ScrollView
        style={styles.itemsList}
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {inventoryItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.itemCard}>
            <View style={styles.itemCardHeader}>
              <Text style={styles.itemName}>{item.name}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStockStatusColor(item.status) + '20' }]}>
                <Text style={[styles.statusText, { color: getStockStatusColor(item.status) }]}>
                  {item.status}
                </Text>
              </View>
            </View>
            <Text style={styles.itemDetails}>{item.category} • {item.supplier}</Text>
            <Text style={styles.itemLocation}>📍 {item.location}</Text>
            <View style={styles.itemCardRow}>
              <View style={styles.itemCardCol}>
                <Text style={styles.stockText}>{item.stock} {item.unit}</Text>
                <Text style={styles.minStockText}>Min: {item.minStock}</Text>
              </View>
              <View style={styles.itemCardCol}>
                <Text style={styles.valueText}>${item.totalValue.toLocaleString()}</Text>
                <Text style={styles.unitCostText}>${item.costPerUnit}/unit</Text>
              </View>
              <View style={styles.itemCardCol}>
                <Text style={styles.expiryText}>{item.expiryDate ? `Exp: ${item.expiryDate}` : ''}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderTransactions = () => (
    <View style={styles.contentContainer}>
      {/* Transaction Summary */}
      <View style={styles.transactionSummary}>
        <View style={styles.summaryItem}>
          <ArrowUp size={20} color="#10B981" />
          <Text style={styles.summaryLabel}>Stock In Today</Text>
          <Text style={styles.summaryValue}>+$2,250</Text>
        </View>
        <View style={styles.summaryItem}>
          <ArrowDown size={20} color="#EF4444" />
          <Text style={styles.summaryLabel}>Stock Out Today</Text>
          <Text style={styles.summaryValue}>-$182.50</Text>
        </View>
      </View>

      {/* Add Transaction Button */}
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Inventory Transactions</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
          <Plus size={16} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Transaction</Text>
        </TouchableOpacity>
      </View>

      {/* Transactions List as Cards */}
      <ScrollView
        style={styles.transactionsList}
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {transactions.map((transaction) => (
          <TouchableOpacity key={transaction.id} style={styles.transactionCard}>
            <View style={styles.transactionCardHeader}>
              <Text style={styles.itemName}>{transaction.item}</Text>
              <View style={styles.transactionType}>
                {transaction.type === 'Stock In' ? (
                  <ArrowUp size={16} color="#10B981" />
                ) : (
                  <ArrowDown size={16} color="#EF4444" />
                )}
                <Text style={[styles.transactionTypeText, {
                  color: transaction.type === 'Stock In' ? '#10B981' : '#EF4444'
                }]}> {transaction.type}</Text>
              </View>
            </View>
            <Text style={styles.transactionReason}>{transaction.reason}</Text>
            <View style={styles.transactionCardRow}>
              <View style={styles.transactionCardCol}>
                <Text style={styles.dateText}>{transaction.date}</Text>
                <Text style={styles.timeText}>{transaction.time}</Text>
              </View>
              <View style={styles.transactionCardCol}>
                <Text style={styles.operatorText}>By: {transaction.operator}</Text>
                {transaction.field && <Text style={styles.fieldText}>📍 {transaction.field}</Text>}
              </View>
              <View style={styles.transactionCardCol}>
                <Text style={[styles.costImpactText, {
                  color: transaction.costImpact > 0 ? '#10B981' : '#EF4444'
                }]}>${Math.abs(transaction.costImpact).toLocaleString()}</Text>
                <Text style={styles.transactionQuantity}>{transaction.quantity} units</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  // Alerts sub-tab redesign
  const renderAlerts = () => (
    <View style={styles.contentContainer}>
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Inventory Alerts</Text>
        <View style={styles.alertsBadge}>
          <Text style={styles.alertsBadgeText}>{alerts.length} Active Alerts</Text>
        </View>
      </View>
      <ScrollView style={styles.alertsList} contentContainerStyle={{ paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
        {alerts.map((alert) => (
          <View key={alert.id} style={[styles.alertCard, { borderLeftColor: getAlertColor(alert.severity) }]}> 
            <View style={styles.alertHeader}>
              <View style={styles.alertTitleContainer}>
                <AlertTriangle size={20} color={getAlertColor(alert.severity)} />
                <Text style={styles.alertTitle}>{alert.type}</Text>
              </View>
              <View style={[styles.severityBadge, { backgroundColor: getAlertColor(alert.severity) + '20' }]}> 
                <Text style={[styles.severityText, { color: getAlertColor(alert.severity) }]}>{alert.severity}</Text>
              </View>
            </View>
            <Text style={styles.alertItem}>{alert.item}</Text>
            {alert.current && alert.minimum && (
              <Text style={styles.alertDetails}>
                Current: {alert.current} | Minimum: {alert.minimum}
                {alert.daysUntilEmpty && ` | Empty in ${alert.daysUntilEmpty} days`}
              </Text>
            )}
            {alert.expiryDate && (
              <Text style={styles.alertDetails}>
                Expires: {alert.expiryDate} ({alert.daysUntilExpiry} days)
              </Text>
            )}
            {alert.suggestedAction && (
              <View style={styles.suggestedAction}>
                <Text style={styles.suggestedActionLabel}>Suggested Action:</Text>
                <Text style={styles.suggestedActionText}>{alert.suggestedAction}</Text>
              </View>
            )}
            <View style={styles.alertActions}>
              <TouchableOpacity style={styles.alertActionButton}>
                <Text style={styles.alertActionText}>Take Action</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.alertActionButton, styles.alertActionButtonSecondary]}>
                <Text style={[styles.alertActionText, styles.alertActionTextSecondary]}>Dismiss</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  // Suppliers sub-tab redesign
  const renderSuppliers = () => (
    <View style={styles.contentContainer}>
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Supplier Management</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={16} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Supplier</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.suppliersList} contentContainerStyle={{ paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
        {suppliers.map((supplier) => (
          <TouchableOpacity key={supplier.id} style={styles.supplierCard}>
            <View style={styles.supplierHeader}>
              <View style={styles.supplierInfo}>
                <Text style={styles.supplierName}>{supplier.name}</Text>
                <Text style={styles.supplierCategory}>{supplier.category}</Text>
                <View style={styles.supplierRating}>
                  <Text style={styles.ratingText}>⭐ {supplier.rating}</Text>
                </View>
              </View>
              <View style={styles.supplierMeta}>
                <Text style={styles.totalPurchases}>${supplier.totalPurchases.toLocaleString()}</Text>
                <Text style={styles.totalPurchasesLabel}>Total Purchases</Text>
              </View>
            </View>
            <View style={styles.supplierDetails}>
              <View style={styles.contactInfo}>
                <Text style={styles.contactPerson}>👤 {supplier.contactPerson}</Text>
                <Text style={styles.contactDetail}>📞 {supplier.phone}</Text>
                <Text style={styles.contactDetail}>✉️ {supplier.email}</Text>
              </View>
              <View style={styles.orderInfo}>
                <Text style={styles.lastOrder}>Last Order: {supplier.lastOrder}</Text>
                <Text style={styles.paymentTerms}>Terms: {supplier.paymentTerms}</Text>
              </View>
            </View>
            <View style={styles.supplierActions}>
              <TouchableOpacity style={styles.supplierActionButton}>
                <Text style={styles.supplierActionText}>View History</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.supplierActionButton}>
                <Text style={styles.supplierActionText}>Create Order</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.supplierActionButton, styles.supplierActionButtonSecondary]}>
                <Text style={[styles.supplierActionText, styles.supplierActionTextSecondary]}>Contact</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  // Valuation sub-tab redesign
  const renderValuation = () => (
    <View style={styles.contentContainer}>
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Inventory Valuation</Text>
        <View style={styles.valuationDate}>
          <Calendar size={16} color="#6B7280" />
          <Text style={styles.valuationDateText}>As of Jan 15, 2025</Text>
        </View>
      </View>
      <View style={styles.valuationSummary}>
        <View style={styles.valuationCard}>
          <Text style={styles.valuationLabel}>Total Inventory Value</Text>
          <Text style={styles.valuationAmount}>$45,520</Text>
          <Text style={styles.valuationChange}>+5.2% from last month</Text>
        </View>
      </View>
      <Text style={styles.sectionSubtitle}>Valuation by Category</Text>
      <View style={styles.categoryValuation}>
        {[{ category: 'Fertilizers', value: 18500, percentage: 40.6, items: 8 },
          { category: 'Seeds', value: 15200, percentage: 33.4, items: 6 },
          { category: 'Pesticides', value: 8800, percentage: 19.3, items: 5 },
          { category: 'Equipment', value: 3020, percentage: 6.6, items: 5 }
        ].map((item, index) => (
          <View key={index} style={styles.categoryValueRow}>
            <View style={styles.categoryValueInfo}>
              <Text style={styles.categoryValueName}>{item.category}</Text>
              <Text style={styles.categoryValueItems}>{item.items} items</Text>
            </View>
            <View style={styles.categoryValueAmount}>
              <Text style={styles.categoryValuePrice}>${item.value.toLocaleString()}</Text>
              <Text style={styles.categoryValuePercentage}>{item.percentage}%</Text>
            </View>
            <View style={[styles.categoryValueBar, { width: `${item.percentage}%` }]} />
          </View>
        ))}
      </View>
      <View style={styles.valuationMethods}>
        <Text style={styles.sectionSubtitle}>Valuation Method</Text>
        <View style={styles.methodSelector}>
          {['FIFO', 'LIFO', 'Weighted Average', 'Standard Cost'].map((method) => (
            <TouchableOpacity
              key={method}
              style={[styles.methodButton, method === 'FIFO' && styles.methodButtonActive]}
            >
              <Text style={[styles.methodButtonText, method === 'FIFO' && styles.methodButtonTextActive]}>
                {method}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderRequests = () => (
    <View style={styles.contentContainer}>
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Inventory Requests</Text>
      </View>
      <ScrollView style={styles.requestsList} contentContainerStyle={{ paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
        {requestQueue.requests.map((req) => (
          <View key={req.id} style={styles.requestCard}>
            <Text style={styles.requestType}>{req.type.charAt(0).toUpperCase() + req.type.slice(1)}</Text>
            <Text style={styles.requestDetail}>Product ID: {req.productId}</Text>
            <Text style={styles.requestDetail}>Quantity: {req.quantity}</Text>
            <Text style={styles.requestDetail}>Status: {req.status.charAt(0).toUpperCase() + req.status.slice(1)}</Text>
            {req.status === 'pending' && (
              <View style={styles.requestActions}>
                <TouchableOpacity style={styles.acceptButton} onPress={() => {
                  requestQueue.acceptRequest(req.id);
                  inventory.deductInventoryQuantity(req.productId, req.quantity);
                }}>
                  <Text style={styles.acceptButtonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rejectButton} onPress={() => requestQueue.rejectRequest(req.id)}>
                  <Text style={styles.rejectButtonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'items':
        return renderInventoryItems();
      case 'transactions':
        return renderTransactions();
      case 'alerts':
        return renderAlerts();
      case 'suppliers':
        return renderSuppliers();
      case 'valuation':
        return renderValuation();
      case 'requests':
        return renderRequests();
      default:
        return renderInventoryItems();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Inventory Management</Text>
        <Text style={styles.subtitle}>Track and optimize your farm inventory</Text>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer}>
        {inventoryTabs.map(renderTabButton)}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderContent()}
      </ScrollView>

      {/* Barcode Scanner Modal */}
      <Modal visible={showBarcodeScanner} animationType="slide" presentationStyle="fullScreen">
        <View style={styles.scannerModal}>
          <View style={styles.scannerHeader}>
            <TouchableOpacity onPress={() => setShowBarcodeScanner(false)}>
              <Text style={styles.scannerCloseText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.scannerTitle}>Scan Barcode</Text>
            <View style={{ width: 60 }} />
          </View>
          <View style={styles.scannerView}>
            <View style={styles.scannerOverlay}>
              <Text style={styles.scannerInstructions}>Position barcode within the frame</Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add/Edit Item Modal */}
      <Modal visible={showAddModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Item</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            {/* Example input fields, update as needed for your form */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Item Name</Text>
              <TextInput style={styles.input} placeholder="Enter item name" />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Category</Text>
              <TextInput style={styles.input} placeholder="Enter category" />
            </View>
            {/* Add more fields as needed */}
            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function getStockStatusColor(status: string): string {
  switch (status) {
    case 'Good': return '#10B981';
    case 'Low': return '#F59E0B';
    case 'Critical': return '#EF4444';
    default: return '#6B7280';
  }
}

function getAlertColor(severity: string): string {
  switch (severity) {
    case 'High': return '#EF4444';
    case 'Medium': return '#F59E0B';
    case 'Low': return '#10B981';
    default: return '#6B7280';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    alignItems: 'flex-start',
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    minHeight: 36,
    minWidth: 80,
    height: 'auto',
  },
  tabButtonActive: {
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  tabIcon: {
    marginRight: 8,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
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
  headerActions: {
    flexDirection: 'row',
  },
  scanButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
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
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#111827',
  },
  filterButton: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryFilter: {
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  categoryButtonActive: {
    backgroundColor: '#10B981',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  summaryCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  summaryCardValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginVertical: 4,
  },
  summaryCardLabel: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 2,
  },
  summaryCardSubtext: {
    fontSize: 9,
    color: '#9CA3AF',
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
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  itemDetails: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  itemLocation: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  stockText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  minStockText: {
    fontSize: 11,
    color: '#6B7280',
  },
  valueText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  unitCostText: {
    fontSize: 11,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  transactionSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginTop: 2,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  timeText: {
    fontSize: 11,
    color: '#6B7280',
  },
  transactionReason: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  operatorText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  fieldText: {
    fontSize: 11,
    color: '#3B82F6',
  },
  transactionType: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionTypeText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  costImpactText: {
    fontSize: 14,
    fontWeight: '600',
  },
  alertsList: {
    gap: 12,
  },
  alertCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  alertItem: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  alertDetails: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  suggestedAction: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  suggestedActionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1D4ED8',
    marginBottom: 4,
  },
  suggestedActionText: {
    fontSize: 12,
    color: '#1E40AF',
  },
  alertActions: {
    flexDirection: 'row',
    gap: 8,
  },
  alertActionButton: {
    flex: 1,
    backgroundColor: '#10B981',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  alertActionButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  alertActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  alertActionTextSecondary: {
    color: '#6B7280',
  },
  alertsBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  alertsBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#D97706',
  },
  suppliersList: {
    gap: 16,
  },
  supplierCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  supplierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  supplierInfo: {
    flex: 1,
  },
  supplierName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  supplierCategory: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  supplierRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#F59E0B',
  },
  supplierMeta: {
    alignItems: 'flex-end',
  },
  totalPurchases: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
  },
  totalPurchasesLabel: {
    fontSize: 11,
    color: '#6B7280',
  },
  supplierDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactPerson: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 2,
  },
  contactDetail: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 2,
  },
  orderInfo: {
    alignItems: 'flex-end',
  },
  lastOrder: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 2,
  },
  paymentTerms: {
    fontSize: 11,
    color: '#6B7280',
  },
  supplierActions: {
    flexDirection: 'row',
    gap: 8,
  },
  supplierActionButton: {
    flex: 1,
    backgroundColor: '#10B981',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  supplierActionButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  supplierActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  supplierActionTextSecondary: {
    color: '#6B7280',
  },
  valuationDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  valuationDateText: {
    fontSize: 12,
    color: '#6B7280',
  },
  valuationSummary: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  valuationCard: {
    alignItems: 'center',
  },
  valuationLabel: {
    fontSize: 14,
    color: '#166534',
    marginBottom: 8,
  },
  valuationAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#15803D',
    marginBottom: 4,
  },
  valuationChange: {
    fontSize: 12,
    color: '#16A34A',
  },
  categoryValuation: {
    marginBottom: 20,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  categoryValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    position: 'relative',
  },
  categoryValueInfo: {
    flex: 2,
  },
  categoryValueName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  categoryValueItems: {
    fontSize: 12,
    color: '#6B7280',
  },
  categoryValueAmount: {
    flex: 1,
    alignItems: 'flex-end',
  },
  categoryValuePrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  categoryValuePercentage: {
    fontSize: 12,
    color: '#6B7280',
  },
  categoryValueBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 2,
    backgroundColor: '#10B981',
  },
  valuationMethods: {
    marginBottom: 20,
  },
  methodSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  methodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  methodButtonActive: {
    backgroundColor: '#10B981',
  },
  methodButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  methodButtonTextActive: {
    color: '#FFFFFF',
  },
  scannerModal: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  scannerCloseText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  scannerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  scannerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
    borderRadius: 12,
  },
  scannerInstructions: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  itemsList: {
    marginTop: 8,
    marginBottom: 16,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  itemCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 12,
  },
  itemCardCol: {
    flex: 1,
    alignItems: 'flex-start',
  },
  expiryText: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  modalContent: {
    flex: 1,
  },
  formGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },
  saveButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  transactionsList: {
    marginTop: 8,
    marginBottom: 16,
  },
  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  transactionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  transactionCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 12,
  },
  transactionCardCol: {
    flex: 1,
    alignItems: 'flex-start',
  },
  transactionQuantity: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 2,
  },
  requestsList: {
    marginTop: 8,
    marginBottom: 16,
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  requestType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  requestDetail: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  requestActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#10B981',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  acceptButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  rejectButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});