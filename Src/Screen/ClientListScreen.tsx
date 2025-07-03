import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, RefreshControl } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ClientStackParamList } from "../navigation/types";
import { getClients } from "../api/services/ClientServices";
import { IClient } from "../api/types/IClient";
import ClientCard from "../Components/ClientCard";

type ClientScreenNavigationProp = NativeStackNavigationProp<
  ClientStackParamList,
  "ClientList"
>;

const ClientListScreen: React.FC = () => {
  const [clients, setClients] = useState<IClient[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<ClientScreenNavigationProp>();

  useEffect(() => {
    fetchClients();
  }, []);

  // Recargar la lista cuando la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      fetchClients();
    }, [])
  );

  const fetchClients = async () => {
    try {
      const data = await getClients();
      setClients(data);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchClients();
    setRefreshing(false);
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Gestión de Clientes</Text>
        <Pressable
          style={styles.addButton}
          onPress={() => navigation.navigate("ClientRegister")}
        >
          <Text style={styles.addButtonText}>+ Agregar Cliente</Text>
        </Pressable>
      </View>

      {clients.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.noDataText}>No hay clientes disponibles.</Text>
          <Text style={styles.noDataSubtext}>
            Agrega tu primer cliente presionando el botón de arriba
          </Text>
        </View>
      ) : (
        clients.map((client) => (
          <ClientCard key={client.id} data={client} />
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  header: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    padding: 20,
  },
  noDataText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  noDataSubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});

export default ClientListScreen;