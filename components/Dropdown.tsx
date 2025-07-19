import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';

interface DropdownOption {
  label: string;
  value: any;
}

interface DropdownProps {
  label: string;
  options: DropdownOption[];
  value: any;
  onSelect: (value: any) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

export default function Dropdown({
  label,
  options,
  value,
  onSelect,
  placeholder = 'Select an option',
  required = false,
  error
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option.value === value);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      
      <TouchableOpacity
        style={[styles.dropdown, error && styles.dropdownError]}
        onPress={() => setIsOpen(true)}
      >
        <Text style={[styles.dropdownText, !selectedOption && styles.placeholder]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <ChevronDown size={20} color="#6B7280" />
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal visible={isOpen} transparent animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modal}>
            <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false}>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.option,
                    option.value === value && styles.selectedOption
                  ]}
                  onPress={() => {
                    onSelect(option.value);
                    setIsOpen(false);
                  }}
                >
                  <Text style={[
                    styles.optionText,
                    option.value === value && styles.selectedOptionText
                  ]}>
                    {option.label}
                  </Text>
                  {option.value === value && (
                    <Check size={16} color="#10B981" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  dropdownError: {
    borderColor: '#EF4444',
  },
  dropdownText: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
  },
  placeholder: {
    color: '#9CA3AF',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    maxHeight: 300,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  optionsList: {
    maxHeight: 250,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectedOption: {
    backgroundColor: '#10B981' + '20',
  },
  optionText: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
  },
  selectedOptionText: {
    color: '#10B981',
    fontWeight: '500',
  },
});