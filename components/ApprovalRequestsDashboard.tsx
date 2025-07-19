import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Modal, StyleSheet } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useApprovalRequests } from '@/hooks/useApprovalRequests';
import { usePermissions, PermissionGate } from '@/hooks/usePermissions';
import { ApprovalRequest, RequestStatus, UserRole, ROLE_DESCRIPTIONS } from '@/types/auth';

export const ApprovalRequestsDashboard: React.FC = () => {
  const { user, switchUser } = useAuth();
  const { 
    requests, 
    isLoading, 
    createRequest, 
    approveRequest, 
    rejectRequest,
    getMyRequests,
    getPendingRequestsForApproval 
  } = useApprovalRequests();
  
  const { can, role, workflow, ui } = usePermissions();
  
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [showCreateRequest, setShowCreateRequest] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);

  // Mock users for role switching
  const mockUsers = [
    { id: 1, name: 'Farm Administrator', role: 'Admin' as UserRole },
    { id: 2, name: 'Farm Manager', role: 'Manager' as UserRole },
    { id: 3, name: 'Field Agronomist', role: 'Agronomist' as UserRole },
    { id: 4, name: 'Inventory Manager', role: 'InventoryManager' as UserRole },
    { id: 5, name: 'Farm Accountant', role: 'Accountant' as UserRole },
  ];

  const handleRoleSwitch = (userId: number) => {
    switchUser(userId);
    setShowRoleSwitcher(false);
  };

  const handleApprove = async (requestId: number) => {
    try {
      await approveRequest(requestId);
      Alert.alert('Success', 'Request approved successfully');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to approve request');
    }
  };

  const handleReject = async (requestId: number) => {
    const reason = 'Request does not meet current operational requirements';
    try {
      await rejectRequest(requestId, reason);
      Alert.alert('Success', 'Request rejected');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to reject request');
    }
  };

  const handleCreateRequest = async () => {
    try {
      await createRequest({
        type: 'fertilization',
        title: 'New Fertilization Request',
        description: 'Sample fertilization request created for demo',
        data: { fieldId: 1, fertilizer: 'NPK 20-20-20', rate: 100 },
        estimatedCost: 1500,
        priority: 'medium'
      });
      setShowCreateRequest(false);
      Alert.alert('Success', 'Request created successfully');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create request');
    }
  };

  const getStatusColor = (status: RequestStatus): string => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'urgent': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#d97706';
      case 'low': return '#65a30d';
      default: return '#6b7280';
    }
  };

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.grayText}>Please log in to continue</Text>
      </View>
    );
  }

  const myRequests = getMyRequests();
  const pendingApprovals = getPendingRequestsForApproval();

  return (
    <ScrollView style={styles.container}>
      {/* Header with Role Information */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>RBAC Dashboard</Text>
          <TouchableOpacity
            onPress={() => setShowRoleSwitcher(true)}
            style={styles.switchButton}
          >
            <Text style={styles.switchButtonText}>Switch Role</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.roleInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userRole}>{user.role}</Text>
          <Text style={styles.roleDescription}>
            {ROLE_DESCRIPTIONS[user.role]}
          </Text>
        </View>
      </View>

      {/* Permission Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Permissions</Text>
        <View style={styles.badgeContainer}>
          {can('approvalRequests', 'approve') && (
            <View style={[styles.badge, styles.greenBadge]}>
              <Text style={styles.greenBadgeText}>Can Approve</Text>
            </View>
          )}
          {workflow.canCreateRequests() && (
            <View style={[styles.badge, styles.blueBadge]}>
              <Text style={styles.blueBadgeText}>Can Create Requests</Text>
            </View>
          )}
          {can('userManagement', 'create') && (
            <View style={[styles.badge, styles.purpleBadge]}>
              <Text style={styles.purpleBadgeText}>User Management</Text>
            </View>
          )}
          {can('financialTransactions', 'create') && (
            <View style={[styles.badge, styles.yellowBadge]}>
              <Text style={styles.yellowBadgeText}>Financial Access</Text>
            </View>
          )}
          {can('inventoryManagement', 'create') && (
            <View style={[styles.badge, styles.orangeBadge]}>
              <Text style={styles.orangeBadgeText}>Inventory Management</Text>
            </View>
          )}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <PermissionGate 
          module="fertilizationPlans" 
          action="create"
          fallback={
            <View style={styles.disabledButton}>
              <Text style={styles.disabledButtonText}>Create Request (No Permission)</Text>
            </View>
          }
        >
          <TouchableOpacity
            onPress={() => setShowCreateRequest(true)}
            style={styles.createButton}
          >
            <Text style={styles.buttonText}>Create Request</Text>
          </TouchableOpacity>
        </PermissionGate>

        <PermissionGate 
          module="reports" 
          action="export"
          fallback={
            <View style={styles.disabledButton}>
              <Text style={styles.disabledButtonText}>Export (No Permission)</Text>
            </View>
          }
        >
          <TouchableOpacity style={styles.exportButton}>
            <Text style={styles.buttonText}>Export Reports</Text>
          </TouchableOpacity>
        </PermissionGate>
      </View>

      {/* My Requests Section */}
      {myRequests.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Requests</Text>
          {myRequests.map((request) => (
            <TouchableOpacity
              key={request.id}
              onPress={() => setSelectedRequest(request)}
              style={styles.requestCard}
            >
              <View style={styles.requestHeader}>
                <Text style={styles.requestTitle}>{request.title}</Text>
                <View style={styles.requestBadges}>
                  <View 
                    style={[styles.priorityBadge, { backgroundColor: `${getPriorityColor(request.priority)}20` }]}
                  >
                    <Text 
                      style={[styles.badgeTextSmall, { color: getPriorityColor(request.priority) }]}
                    >
                      {request.priority}
                    </Text>
                  </View>
                  <View 
                    style={[styles.statusBadge, { backgroundColor: `${getStatusColor(request.status)}20` }]}
                  >
                    <Text 
                      style={[styles.badgeTextSmall, { color: getStatusColor(request.status) }]}
                    >
                      {request.status}
                    </Text>
                  </View>
                </View>
              </View>
              <Text style={styles.requestDescription}>{request.description}</Text>
              <Text style={styles.requestDate}>
                Created: {new Date(request.createdAt).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Pending Approvals Section */}
      {pendingApprovals.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pending Approvals</Text>
          {pendingApprovals.map((request) => (
            <View
              key={request.id}
              style={styles.requestCard}
            >
              <View style={styles.requestHeader}>
                <Text style={styles.requestTitle}>{request.title}</Text>
                <View style={styles.requestBadges}>
                  <View 
                    style={[styles.priorityBadge, { backgroundColor: `${getPriorityColor(request.priority)}20` }]}
                  >
                    <Text 
                      style={[styles.badgeTextSmall, { color: getPriorityColor(request.priority) }]}
                    >
                      {request.priority}
                    </Text>
                  </View>
                  <Text style={styles.costText}>
                    ${request.estimatedCost?.toLocaleString()}
                  </Text>
                </View>
              </View>
              <Text style={styles.requestDescription}>{request.description}</Text>
              <Text style={styles.requestMeta}>
                Requested by: {request.requestedByName} • {new Date(request.createdAt).toLocaleDateString()}
              </Text>
              
              <PermissionGate module="approvalRequests" action="approve">
                <View style={styles.approvalButtons}>
                  <TouchableOpacity
                    onPress={() => handleApprove(request.id)}
                    style={styles.approveButton}
                  >
                    <Text style={styles.buttonText}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleReject(request.id)}
                    style={styles.rejectButton}
                  >
                    <Text style={styles.buttonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </PermissionGate>
            </View>
          ))}
        </View>
      )}

      {/* All Requests Section */}
      <View style={[styles.section, styles.lastSection]}>
        <Text style={styles.sectionTitle}>All Requests</Text>
        {requests.map((request) => (
          <TouchableOpacity
            key={request.id}
            onPress={() => setSelectedRequest(request)}
            style={styles.requestCard}
          >
            <View style={styles.requestHeaderSimple}>
              <Text style={styles.requestTitle}>{request.title}</Text>
              <View 
                style={[styles.statusBadge, { backgroundColor: `${getStatusColor(request.status)}20` }]}
              >
                <Text 
                  style={[styles.badgeTextSmall, { color: getStatusColor(request.status) }]}
                >
                  {request.status}
                </Text>
              </View>
            </View>
            <Text style={styles.requestMeta}>
              {request.requestedByName} • {new Date(request.createdAt).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Role Switcher Modal */}
      <Modal
        visible={showRoleSwitcher}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRoleSwitcher(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Switch Role (Demo)</Text>
            {mockUsers.map((mockUser) => (
              <TouchableOpacity
                key={mockUser.id}
                onPress={() => handleRoleSwitch(mockUser.id)}
                style={[
                  styles.roleOption,
                  user?.id === mockUser.id && styles.activeRoleOption
                ]}
              >
                <Text style={styles.roleOptionName}>{mockUser.name}</Text>
                <Text style={styles.roleOptionRole}>{mockUser.role}</Text>
                <Text style={styles.roleOptionDescription}>
                  {ROLE_DESCRIPTIONS[mockUser.role]}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setShowRoleSwitcher(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Create Request Modal */}
      <Modal
        visible={showCreateRequest}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateRequest(false)}
      >
        <View style={styles.modalOverlayCentered}>
          <View style={styles.modalContentCentered}>
            <Text style={styles.modalTitle}>Create Request</Text>
            <Text style={styles.modalDescription}>
              This will create a sample fertilization request that requires approval.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={handleCreateRequest}
                style={styles.createButton}
              >
                <Text style={styles.buttonText}>Create</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowCreateRequest(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Request Details Modal */}
      <Modal
        visible={!!selectedRequest}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedRequest(null)}
      >
        {selectedRequest && (
          <View style={styles.modalOverlayCentered}>
            <View style={[styles.modalContentCentered, styles.detailsModal]}>
              <ScrollView>
                <Text style={styles.modalTitle}>{selectedRequest.title}</Text>
                <Text style={styles.modalDescription}>{selectedRequest.description}</Text>
                
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Status</Text>
                  <Text 
                    style={[styles.detailValue, { color: getStatusColor(selectedRequest.status) }]}
                  >
                    {selectedRequest.status}
                  </Text>
                </View>
                
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Requested By</Text>
                  <Text style={styles.detailValue}>{selectedRequest.requestedByName}</Text>
                </View>
                
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Estimated Cost</Text>
                  <Text style={styles.detailValue}>${selectedRequest.estimatedCost?.toLocaleString()}</Text>
                </View>
                
                {selectedRequest.status === 'rejected' && selectedRequest.rejectionReason && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Rejection Reason</Text>
                    <Text style={styles.rejectionReason}>{selectedRequest.rejectionReason}</Text>
                  </View>
                )}
              </ScrollView>
              
              <TouchableOpacity
                onPress={() => setSelectedRequest(null)}
                style={styles.cancelButton}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  switchButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  switchButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  roleInfo: {
    backgroundColor: '#EBF8FF',
    padding: 12,
    borderRadius: 8,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E40AF',
  },
  userRole: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  roleDescription: {
    color: '#2563EB',
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  lastSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  greenBadge: {
    backgroundColor: '#D1FAE5',
  },
  greenBadgeText: {
    color: '#065F46',
    fontSize: 12,
    fontWeight: '500',
  },
  blueBadge: {
    backgroundColor: '#DBEAFE',
  },
  blueBadgeText: {
    color: '#1E40AF',
    fontSize: 12,
    fontWeight: '500',
  },
  purpleBadge: {
    backgroundColor: '#EDE9FE',
  },
  purpleBadgeText: {
    color: '#6B21A8',
    fontSize: 12,
    fontWeight: '500',
  },
  yellowBadge: {
    backgroundColor: '#FEF3C7',
  },
  yellowBadgeText: {
    color: '#92400E',
    fontSize: 12,
    fontWeight: '500',
  },
  orangeBadge: {
    backgroundColor: '#FED7AA',
  },
  orangeBadgeText: {
    color: '#C2410C',
    fontSize: 12,
    fontWeight: '500',
  },
  actionContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    flexDirection: 'row',
    gap: 8,
  },
  createButton: {
    flex: 1,
    backgroundColor: '#10B981',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  exportButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  disabledButtonText: {
    color: '#6B7280',
    textAlign: 'center',
  },
  requestCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  requestHeaderSimple: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  requestTitle: {
    fontWeight: '500',
    color: '#111827',
    flex: 1,
  },
  requestBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeTextSmall: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  costText: {
    color: '#6B7280',
    fontSize: 10,
  },
  requestDescription: {
    color: '#6B7280',
    fontSize: 14,
  },
  requestDate: {
    color: '#9CA3AF',
    fontSize: 10,
    marginTop: 4,
  },
  requestMeta: {
    color: '#9CA3AF',
    fontSize: 10,
    marginBottom: 12,
  },
  approvalButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  approveButton: {
    flex: 1,
    backgroundColor: '#10B981',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalOverlayCentered: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: 16,
  },
  modalContentCentered: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
  },
  detailsModal: {
    maxHeight: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  modalDescription: {
    color: '#6B7280',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  roleOption: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#F9FAFB',
  },
  activeRoleOption: {
    backgroundColor: '#DBEAFE',
  },
  roleOptionName: {
    fontWeight: '500',
    color: '#111827',
  },
  roleOptionRole: {
    color: '#6B7280',
  },
  roleOptionDescription: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 4,
  },
  cancelButton: {
    backgroundColor: '#6B7280',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  detailSection: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  detailValue: {
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  rejectionReason: {
    color: '#DC2626',
  },
  grayText: {
    color: '#9CA3AF',
  },
});