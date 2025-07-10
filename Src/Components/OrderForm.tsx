// Src/Components/OrderForm.tsx
import React, { useState } from "react";
import { IOrder } from "../api/types/IOrder";
import { ScrollView, TextInput, View, Text, TouchableOpacity } from "react-native";
import { CyberStyles, CyberColors } from "../styles/CyberStyles";

interface Props {
  form: IOrder;
  handleChange: (field: keyof IOrder, value: string) => void;
}

const OrderForm: React.FC<Props> = ({ form, handleChange }) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const orderStatuses = [
    { value: 'pending', label: 'PENDING' },
    { value: 'processing', label: 'PROCESSING' },
    { value: 'completed', label: 'COMPLETED' },
    { value: 'cancelled', label: 'CANCELLED' },
  ];

  const renderInput = (
    field: keyof IOrder,
    placeholder: string,
    label: string,
    keyboardType: 'default' | 'numeric' = 'default'
  ) => (
    <View style={{ marginBottom: 20 }}>
      <Text style={CyberStyles.inputLabel}>{label}</Text>
      <TextInput
        style={[
          CyberStyles.cyberInput,
          focusedField === field ? CyberStyles.inputFocused : {}
        ]}
        placeholder={placeholder}
        placeholderTextColor={CyberColors.textMuted}
        value={form[field] || ''}
        onChangeText={(text) => handleChange(field, text)}
        keyboardType={keyboardType}
        onFocus={() => setFocusedField(field)}
        onBlur={() => setFocusedField(null)}
      />
    </View>
  );

  const renderStatusSelector = () => (
    <View style={{ marginBottom: 20 }}>
      <Text style={CyberStyles.inputLabel}>ORDER STATUS</Text>
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 10,
      }}>
        {orderStatuses.map((status) => (
          <TouchableOpacity
            key={status.value}
            style={[
              {
                paddingHorizontal: 15,
                paddingVertical: 10,
                borderRadius: 20,
                borderWidth: 2,
                minWidth: 80,
                alignItems: 'center',
              },
              form.status === status.value ? {
                backgroundColor: CyberColors.primaryNeon,
                borderColor: CyberColors.primaryNeon,
              } : {
                backgroundColor: 'transparent',
                borderColor: CyberColors.borderGlow,
              }
            ]}
            onPress={() => handleChange('status', status.value)}
            activeOpacity={0.7}
          >
            <Text style={[
              {
                fontSize: 12,
                fontWeight: '600',
                letterSpacing: 1,
              },
              form.status === status.value ? {
                color: CyberColors.darkerBg,
              } : {
                color: CyberColors.textSecondary,
              }
            ]}>
              {status.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return CyberColors.warningNeon;
      case 'processing':
        return CyberColors.accentNeon;
      case 'completed':
        return CyberColors.primaryNeon;
      case 'cancelled':
        return CyberColors.dangerNeon;
      default:
        return CyberColors.textSecondary;
    }
  };

  const getInitials = () => {
    const orderId = form.id || 'NEW';
    return `#${orderId.slice(-3)}`.toUpperCase();
  };

  // Generar fecha actual si no existe
  const currentDate = form.date || new Date().toISOString();

  return (
    <ScrollView 
      contentContainerStyle={{ padding: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[CyberStyles.cyberCard, { marginHorizontal: 0 }]}>
        <View style={CyberStyles.cardHeader}>
          <Text style={CyberStyles.cardTitle}>ORDER DATA INPUT</Text>
        </View>

        {renderInput('idCustomer', 'Enter customer ID...', 'CUSTOMER ID', 'numeric')}
        
        {/* Fecha (solo lectura - se genera automáticamente) */}
        <View style={{ marginBottom: 20 }}>
          <Text style={CyberStyles.inputLabel}>ORDER DATE</Text>
          <View style={[CyberStyles.cyberInput, { opacity: 0.7 }]}>
            <Text style={CyberStyles.cyberText}>
              {formatDate(currentDate)}
            </Text>
          </View>
          <Text style={[CyberStyles.mutedText, { fontSize: 10, marginTop: 5 }]}>
            Auto-generated timestamp
          </Text>
        </View>

        {renderStatusSelector()}

        {/* Preview de la orden */}
        <View style={{
          marginTop: 20,
          padding: 15,
          backgroundColor: CyberColors.darkerBg,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: CyberColors.borderGlow,
        }}>
          <Text style={[CyberStyles.inputLabel, { marginBottom: 10 }]}>
            PREVIEW
          </Text>
          
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={[CyberStyles.cyberAvatar, { 
              width: 40, 
              height: 40, 
              backgroundColor: CyberColors.secondaryNeon 
            }]}>
              <Text style={[CyberStyles.avatarText, { fontSize: 14 }]}>
                {getInitials()}
              </Text>
            </View>
            
            <View style={{ marginLeft: 15, flex: 1 }}>
              <Text style={CyberStyles.clientName}>
                Order {form.id ? `#${form.id}` : '#NEW'}
              </Text>
              <Text style={CyberStyles.clientEmail}>
                Customer: {form.idCustomer || 'Not assigned'}
              </Text>
              <Text style={CyberStyles.clientPhone}>
                {formatDate(currentDate)}
              </Text>
            </View>

            {/* Badge de estado */}
            <View style={[
              CyberStyles.statusBadge,
              { 
                backgroundColor: `${getStatusColor(form.status || 'pending')}20`,
                borderColor: getStatusColor(form.status || 'pending'),
              }
            ]}>
              <Text style={[
                CyberStyles.statusText,
                { color: getStatusColor(form.status || 'pending') }
              ]}>
                {(form.status || 'PENDING').toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default OrderForm;