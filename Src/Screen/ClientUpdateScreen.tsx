// Src/Screen/ClientUpdateScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ClientStackParamList } from "../navigation/types";
import { getClientById, updateClient } from "../api/services/ClientServices";
import { IClient } from "../api/types/IClient";
import ClientForm from "../Components/ClientForm";
import { CyberStyles, CyberColors } from "../styles/CyberStyles";

type ClientUpdateRouteProp = RouteProp<ClientStackParamList, "ClientUpdate">;
type ClientUpdateNavigationProp = NativeStackNavigationProp<
  ClientStackParamList,
  "ClientUpdate"
>;

const ClientUpdateScreen: React.FC = () => {
  const route = useRoute<ClientUpdateRouteProp>();
  const navigation = useNavigation<ClientUpdateNavigationProp>();
  const { id } = route.params;

  const [form, setForm] = useState<IClient>({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        console.log("📋 Obteniendo cliente por ID:", id);
        setLoading(true);
        const client = await getClientById(id);
        console.log("✅ Cliente obtenido:", client);
        
        // Mapear los campos correctamente
        setForm({
          id: client.id,
          firstName: client.firstName || client.firstName || "",
          lastName: client.lastName || client.lastName || "",
          email: client.email || "",
          phone: client.phone || "",
        });
      } catch (error) {
        console.error("❌ Error al obtener cliente:", error);
        Alert.alert("Error", "No se pudo cargar la información del cliente");
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  const handleChange = (field: keyof IClient, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const updateClientData = async () => {
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
      setUpdating(true);
      console.log("📝 Actualizando cliente:", form);
      const result = await updateClient(id, form);
      console.log("✅ Cliente actualizado exitosamente:", result);
      
      Alert.alert(
        "Éxito",
        "Cliente actualizado en la matriz correctamente",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error("❌ Error al actualizar cliente:", error);
      Alert.alert("Error", "No se pudo actualizar el cliente en la matriz");
    } finally {
      setUpdating(false);
    }
  };

  const renderHeader = () => (
    <View style={CyberStyles.cyberHeader}>
      <Text style={CyberStyles.headerTitle}>EDIT CLIENT</Text>
      <Text style={CyberStyles.headerSubtitle}>
        Modify entity data in the matrix
      </Text>
    </View>
  );

  const renderLoading = () => (
    <View style={CyberStyles.loadingContainer}>
      <ActivityIndicator size="large" color={CyberColors.primaryNeon} />
      <Text style={CyberStyles.loadingText}>Loading Client Data...</Text>
    </View>
  );

  const renderFooter = () => (
    <View style={{ padding: 20, gap: 15 }}>
      <TouchableOpacity
        style={[
          CyberStyles.cyberButton, 
          CyberStyles.primaryButton,
          updating && { opacity: 0.7 }
        ]}
        onPress={updateClientData}
        disabled={updating}
        activeOpacity={0.8}
      >
        <Text style={[CyberStyles.buttonText, CyberStyles.primaryButtonText]}>
          {updating ? "UPDATING MATRIX..." : "SAVE CHANGES"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[CyberStyles.cyberButton, CyberStyles.secondaryButton]}
        onPress={() => navigation.goBack()}
        disabled={updating}
        activeOpacity={0.8}
      >
        <Text style={[CyberStyles.buttonText, CyberStyles.secondaryButtonText]}>
          CANCEL
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={CyberStyles.cyberContainer}>
        {renderHeader()}
        {renderLoading()}
      </View>
    );
  }

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

export default ClientUpdateScreen;