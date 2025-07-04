import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ClientStackParamList } from "../navigation/types";
import { getClientById, updateClient } from "../api/services/ClientServices";
import { IClient } from "../api/types/IClient";
import ClientForm from "../Components/ClientForm";

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
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    createdAt: "",
    updatedAt: "",
  });

  useEffect(() => {
    const fetchClient = async () => {
      try {
        console.log("📋 Obteniendo cliente por ID:", id);
        const client = await getClientById(id);
        console.log("✅ Cliente obtenido:", client);
        setForm(client);
      } catch (error) {
        console.error("❌ Error al obtener cliente:", error);
        Alert.alert("Error", "No se pudo cargar la información del cliente");
      }
    };

    fetchClient();
  }, [id]);

  const handleChange = (field: keyof IClient, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const updateClientData = async () => {
    // Validaciones básicas
    if (!form.first_name.trim()) {
      Alert.alert("Error", "El primer nombre es obligatorio");
      return;
    }
    if (!form.last_name.trim()) {
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
      console.log("📝 Actualizando cliente:", form);
      const result = await updateClient(id, form);
      console.log("✅ Cliente actualizado exitosamente:", result);
      
      Alert.alert(
        "Éxito",
        "Cliente actualizado correctamente",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error("❌ Error al actualizar cliente:", error);
      Alert.alert("Error", "No se pudo actualizar el cliente");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Cliente</Text>
      <ClientForm form={form} handleChange={handleChange} />
      <View style={styles.buttonContainer}>
        <Button title="Guardar Cambios" onPress={updateClientData} />
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

export default ClientUpdateScreen;