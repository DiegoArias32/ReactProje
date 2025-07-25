// Src/Screen/ClientListScreen.tsx
import React, { useCallback, useEffect, useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  RefreshControl, 
  ActivityIndicator,
  TextInput 
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ClientStackParamList } from "../navigation/types";
import { getClients } from "../api/services/ClientServices";
import { IClient } from "../api/types/IClient";
import ClientCard from "../Components/ClientCard";
import { CyberStyles, CyberColors } from "../styles/CyberStyles";

type ClientScreenNavigationProp = NativeStackNavigationProp<
  ClientStackParamList,
  "ClientList"
>;

const ClientListScreen: React.FC = () => {
  const [clients, setClients] = useState<IClient[]>([]);
  const [filteredClients, setFilteredClients] = useState<IClient[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation<ClientScreenNavigationProp>();

  useEffect(() => {
    fetchClients();
  }, []);

  // Filtrar clientes según búsqueda
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter(client => {
        const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
        const email = client.email.toLowerCase();
        const phone = client.phone.toLowerCase();
        const query = searchQuery.toLowerCase();
        
        return fullName.includes(query) || 
               email.includes(query) || 
               phone.includes(query);
      });
      setFilteredClients(filtered);
    }
  }, [searchQuery, clients]);

  // Recargar la lista cuando la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      fetchClients();
    }, [])
  );

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await getClients();
      console.log("📋 Clientes obtenidos:", data);
      setClients(data);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchClients();
    setRefreshing(false);
  }, []);

  const renderHeader = () => (
    <View style={CyberStyles.cyberHeader}>
      <Text style={CyberStyles.headerTitle}>CLIENT MATRIX</Text>
      <Text style={CyberStyles.headerSubtitle}>
        Manage your digital customers in cyberspace
      </Text>
    </View>
  );

  const renderSearchBar = () => (
    <View style={{ padding: 20 }}>
      <Text style={CyberStyles.inputLabel}>Search in the Matrix</Text>
      <TextInput
        style={[
          CyberStyles.cyberInput,
          searchQuery ? CyberStyles.inputFocused : {}
        ]}
        placeholder="Search clients..."
        placeholderTextColor={CyberColors.textMuted}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    </View>
  );

  const renderAddButton = () => (
    <View style={{ paddingHorizontal: 20, paddingBottom: 10 }}>
      <TouchableOpacity
        style={[CyberStyles.cyberButton, CyberStyles.primaryButton]}
        onPress={() => navigation.navigate("ClientRegister")}
        activeOpacity={0.8}
      >
        <Text style={[CyberStyles.buttonText, CyberStyles.primaryButtonText]}>
          + ADD NEW CLIENT
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderClientStats = () => (
    <View style={{ 
      flexDirection: 'row', 
      justifyContent: 'space-around', 
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: CyberColors.cardBg,
      marginHorizontal: 10,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: CyberColors.borderGlow,
      marginBottom: 10
    }}>
      <View style={{ alignItems: 'center' }}>
        <Text style={[CyberStyles.headerTitle, { fontSize: 24 }]}>
          {clients.length}
        </Text>
        <Text style={CyberStyles.secondaryText}>TOTAL CLIENTS</Text>
      </View>
      <View style={{ alignItems: 'center' }}>
        <Text style={[CyberStyles.headerTitle, { fontSize: 24 }]}>
          {filteredClients.length}
        </Text>
        <Text style={CyberStyles.secondaryText}>FILTERED</Text>
      </View>
    </View>
  );

  const renderLoading = () => (
    <View style={CyberStyles.loadingContainer}>
      <ActivityIndicator size="large" color={CyberColors.primaryNeon} />
      <Text style={CyberStyles.loadingText}>Loading Matrix...</Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={CyberStyles.emptyState}>
      <Text style={[CyberStyles.headerTitle, { fontSize: 60, opacity: 0.3 }]}>
        404
      </Text>
      <Text style={CyberStyles.emptyText}>
        No clients found in the matrix
      </Text>
      <Text style={CyberStyles.emptySubtext}>
        {searchQuery ? 
          "Try adjusting your search parameters" : 
          "Add your first client to get started"
        }
      </Text>
      {!searchQuery && (
        <TouchableOpacity
          style={[
            CyberStyles.cyberButton, 
            CyberStyles.primaryButton,
            { marginTop: 20 }
          ]}
          onPress={() => navigation.navigate("ClientRegister")}
          activeOpacity={0.8}
        >
          <Text style={[CyberStyles.buttonText, CyberStyles.primaryButtonText]}>
            + CREATE FIRST CLIENT
          </Text>
        </TouchableOpacity>
      )}
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
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={CyberColors.primaryNeon}
            colors={[CyberColors.primaryNeon]}
          />
        }
      >
        {renderSearchBar()}
        {renderAddButton()}
        {clients.length > 0 && renderClientStats()}

        {filteredClients.length === 0 ? (
          renderEmptyState()
        ) : (
          filteredClients.map((client) => (
            <ClientCard 
              key={client.id || `client-${Math.random()}`}
              data={client} 
              onRefresh={fetchClients}
            />
          ))
        )}
        
        {/* Espaciado extra al final */}
        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
};

export default ClientListScreen;