// Src/Components/EmployeeForm.tsx
import React, { useState } from "react";
import { IEmployee } from "../api/types/IEmployee";
import { ScrollView, TextInput, View, Text } from "react-native";
import { CyberStyles, CyberColors } from "../styles/CyberStyles";

interface Props {
  form: IEmployee;
  handleChange: (field: keyof IEmployee, value: string | number) => void;
}

const EmployeeForm: React.FC<Props> = ({ form, handleChange }) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const renderInput = (
    field: keyof IEmployee,
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
        value={field === 'salary' ? form[field]?.toString() || '' : (form[field] as string) || ''}
        onChangeText={(text) => {
          if (field === 'salary') {
            const numericValue = parseFloat(text) || 0;
            handleChange(field, numericValue);
          } else {
            handleChange(field, text);
          }
        }}
        keyboardType={keyboardType}
        autoCapitalize={field === 'salary' ? 'none' : 'words'}
        onFocus={() => setFocusedField(field)}
        onBlur={() => setFocusedField(null)}
      />
    </View>
  );

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(salary);
  };

  const getInitials = () => {
    const firstName = form.firstName || '';
    const lastName = form.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const fullName = `${form.firstName || ''} ${form.lastName || ''}`.trim();

  return (
    <ScrollView 
      contentContainerStyle={{ padding: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[CyberStyles.cyberCard, { marginHorizontal: 0 }]}>
        <View style={CyberStyles.cardHeader}>
          <Text style={CyberStyles.cardTitle}>EMPLOYEE DATA INPUT</Text>
        </View>

        {renderInput('firstName', 'Enter first name...', 'FIRST NAME')}
        {renderInput('lastName', 'Enter last name...', 'LAST NAME')}
        {renderInput('position', 'Enter position...', 'POSITION')}
        {renderInput('salary', 'Enter salary...', 'SALARY (COP)', 'numeric')}

        {/* Preview del empleado */}
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
              backgroundColor: CyberColors.accentNeon 
            }]}>
              <Text style={[CyberStyles.avatarText, { fontSize: 14 }]}>
                {getInitials()}
              </Text>
            </View>
            
            <View style={{ marginLeft: 15, flex: 1 }}>
              <Text style={CyberStyles.clientName}>
                {fullName || 'Unnamed Employee'}
              </Text>
              <Text style={CyberStyles.clientEmail}>
                {form.position || 'No position assigned'}
              </Text>
              <Text style={[CyberStyles.clientPhone, { 
                color: CyberColors.accentNeon, 
                fontWeight: 'bold' 
              }]}>
                {formatSalary(form.salary || 0)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default EmployeeForm;