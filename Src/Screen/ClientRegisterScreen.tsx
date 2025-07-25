// Src/Screen/ClientRegisterScreen.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ClientStackParamList } from "../navigation/types";
import { IClient } from "../api/types/IClient";
import { createClient } from "../api/services/ClientServices";
import ClientForm from "../Components/ClientForm";
import { CyberStyles, CyberColors } from "../styles/CyberStyles";

type ClientRegisterNavigationProp = NativeStackNavigationProp<
  ClientStackParamList,
  "ClientRegister"
>;

const ClientRegisterScreen: React.FC = () => {
  const navigation = useNavigation<ClientRegisterNavigationProp>();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<IClient>({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const handleChange = (field: keyof IClient, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const registerClient = async () => {
    // Validaciones básicas
    if (!form.firstName.trim()) {
      Alert.alert("Error", "El primer nombre es obligatorio");
      return;
    }
    if (!form.lastName.trim()) {
      Alert.alert("Error", "El apellido es obligatorio");
      return;
    }
    if (!form.email.trim()) {
      Alert.alert("Error", "El email es obligatorio");
      return;
    }
    if (!form.phone.trim()) {
      Alert.alert("Error", "El teléfono es obligatorio");
      return;
    }

    // Validación de email básica
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      Alert.alert("Error", "Por favor ingresa un email válido");
      return;
    }

    try {
      setLoading(true);
      const result = await createClient(form);
      
      // Navegar de regreso tras éxito
      navigation.goBack();
      
    } catch (error) {
      console.error("❌ Error al registrar cliente:", error);
      Alert.alert("Error", "No se pudo registrar el cliente en la matriz");
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => (
    <View style={CyberStyles.cyberHeader}>
      <Text style={CyberStyles.headerTitle}>NEW CLIENT</Text>
      <Text style={CyberStyles.headerSubtitle}>
        Add a new entity to the matrix
      </Text>
    </View>
  );

  const renderFooter = () => (
    <View style={{ padding: 20, gap: 15 }}>
      <TouchableOpacity
        style={[
          CyberStyles.cyberButton, 
          CyberStyles.primaryButton,
          loading && { opacity: 0.7 }
        ]}
        onPress={() => {
          registerClient();
        }}
        disabled={loading}
        activeOpacity={0.8}
      >
        <Text style={[CyberStyles.buttonText, CyberStyles.primaryButtonText]}>
          {loading ? "UPLOADING TO MATRIX..." : "SAVE CLIENT"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[CyberStyles.cyberButton, CyberStyles.secondaryButton]}
        onPress={() => {
          navigation.goBack();
        }}
        disabled={loading}
        activeOpacity={0.8}
      >
        <Text style={[CyberStyles.buttonText, CyberStyles.secondaryButtonText]}>
          CANCEL
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={CyberStyles.cyberContainer}>
      {renderHeader()}
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <ClientForm form={form} handleChange={handleChange} />
        {renderFooter()}
      </ScrollView>
    </View>
  );
};

export default ClientRegisterScreen;