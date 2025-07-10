import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ClientStackParamList } from "../navigation/types";
import { IClient } from "../api/types/IClient";
import { createClient } from "../api/services/ClientServices";
import ClientForm from "../Components/ClientForm";

type ClientRegisterNavigationProp = NativeStackNavigationProp<
  ClientStackParamList,
  "ClientRegister"
>;

const ClientRegisterScreen: React.FC = () => {
  const navigation = useNavigation<ClientRegisterNavigationProp>();
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

    try {
      console.log("📝 Enviando datos al servidor:", form);
      const result = await createClient(form);
      console.log("✅ Cliente creado exitosamente:", result);
      
      Alert.alert(
        "Éxito",
        "Cliente registrado correctamente",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error("❌ Error al registrar cliente:", error);
      Alert.alert("Error", "No se pudo registrar el cliente");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nuevo Cliente</Text>
      <ClientForm form={form} handleChange={handleChange} />
      <View style={styles.buttonContainer}>
        <Button title="Guardar Cliente" onPress={registerClient} />
        <Button 
          title="Cancelar" 
          onPress={() => navigation.goBack()} 
          color="#999"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
  buttonContainer: {
    padding: 20,
    gap: 10,
  },
});

export default ClientRegisterScreen;