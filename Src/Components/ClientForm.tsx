// Src/Components/ClientForm.tsx
import React, { useState } from "react";
import { IClient } from "../api/types/IClient";
import { ScrollView, TextInput, View, Text } from "react-native";
import { CyberStyles, CyberColors } from "../styles/CyberStyles";

interface Props {
  form: IClient;
  handleChange: (field: keyof IClient, value: string) => void;
}

const ClientForm: React.FC<Props> = ({ form, handleChange }) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const renderInput = (
    field: keyof IClient,
    placeholder: string,
    label: string,
    keyboardType: 'default' | 'email-address' | 'phone-pad' = 'default'
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
        autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
        onFocus={() => setFocusedField(field)}
        onBlur={() => setFocusedField(null)}
      />
    </View>
  );

  return (
    <ScrollView 
      contentContainerStyle={{ padding: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[CyberStyles.cyberCard, { marginHorizontal: 0 }]}>
        <View style={CyberStyles.cardHeader}>
          <Text style={CyberStyles.cardTitle}>CLIENT DATA INPUT</Text>
        </View>

        {renderInput('firstName', 'Enter first name...', 'FIRST NAME')}
        {renderInput('lastName', 'Enter last name...', 'LAST NAME')}
        {renderInput('email', 'Enter email address...', 'EMAIL ADDRESS', 'email-address')}
        {renderInput('phone', 'Enter phone number...', 'PHONE NUMBER', 'phone-pad')}

        {/* Preview del cliente */}
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
            <View style={[CyberStyles.cyberAvatar, { width: 40, height: 40 }]}>
              <Text style={[CyberStyles.avatarText, { fontSize: 14 }]}>
                {`${form.firstName?.charAt(0) || ''}${form.lastName?.charAt(0) || ''}`.toUpperCase()}
              </Text>
            </View>
            
            <View style={{ marginLeft: 15, flex: 1 }}>
              <Text style={CyberStyles.clientName}>
                {`${form.firstName || ''} ${form.lastName || ''}`.trim() || 'Unnamed Client'}
              </Text>
              <Text style={CyberStyles.clientEmail}>
                {form.email || 'no-email@provided.com'}
              </Text>
              <Text style={CyberStyles.clientPhone}>
                {form.phone || 'No phone provided'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ClientForm;