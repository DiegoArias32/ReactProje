// Src/Screen/DetailsScreen.tsx
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Alert, 
  ScrollView, 
  ActivityIndicator 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { ClientStackParamList } from '../navigation/types';
import { getClientById, deleteClient } from '../api/services/ClientServices';
import { IClient } from '../api/types/IClient';
import { CyberStyles, CyberColors } from '../styles/CyberStyles';

type DetailsScreenProps = NativeStackScreenProps<ClientStackParamList, 'Details'>;
type DetailsScreenNavigationProps = NativeStackNavigationProp<ClientStackParamList, 'Details'>;

const DetailsScreen: React.FC = () => {
  const navigation = useNavigation<DetailsScreenNavigationProps>();
  const route = useRoute<DetailsScreenProps['route']>();
  const { id } = route.params;

  const [client, setClient] = useState<IClient | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        console.log("📋 Obteniendo detalles del cliente:", id);
        setLoading(true);
        const clientData = await getClientById(id);
        console.log("✅ Cliente obtenido:", clientData);
        
        // Mapear los campos correctamente
        const mappedClient: IClient = {
          id: clientData.id,
          firstName: clientData.firstName || clientData.firstName || "",
          lastName: clientData.lastName || clientData.lastName || "",
          email: clientData.email || "",
          phone: clientData.phone || "",
        };
        
        setClient(mappedClient);
      } catch (error) {
        console.error("❌ Error al obtener cliente:", error);
        Alert.alert("Error", "No se pudo cargar la información del cliente");
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  const handleEdit = () => {
    navigation.navigate("ClientUpdate", { id });
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirmar Eliminación",
      "¿Estás seguro de que quieres eliminar este cliente de la matriz?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              setDeleting(true);
              await deleteClient(id);
              console.log("✅ Cliente eliminado exitosamente");
              Alert.alert("Éxito", "Cliente eliminado de la matriz correctamente", [
                { text: "OK", onPress: () => navigation.goBack() }
              ]);
            } catch (error) {
              console.error("❌ Error al eliminar cliente:", error);
              Alert.alert("Error", "No se pudo eliminar el cliente de la matriz");
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const renderHeader = () => (
    <View style={CyberStyles.cyberHeader}>
      <Text style={CyberStyles.headerTitle}>CLIENT DETAILS</Text>
      <Text style={CyberStyles.headerSubtitle}>
        Entity information from the matrix
      </Text>
    </View>
  );

  const renderLoading = () => (
    <View style={CyberStyles.loadingContainer}>
      <ActivityIndicator size="large" color={CyberColors.primaryNeon} />
      <Text style={CyberStyles.loadingText}>Loading Entity Data...</Text>
    </View>
  );

  const renderClientNotFound = () => (
    <View style={CyberStyles.emptyState}>
      <Text style={[CyberStyles.headerTitle, { fontSize: 60, opacity: 0.3 }]}>
        404
      </Text>
      <Text style={CyberStyles.emptyText}>
        Entity not found in the matrix
      </Text>
      <Text style={CyberStyles.emptySubtext}>
        This client may have been disconnected
      </Text>
      <TouchableOpacity 
        style={[
          CyberStyles.cyberButton, 
          CyberStyles.secondaryButton,
          { marginTop: 20 }
        ]}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <Text style={[CyberStyles.buttonText, CyberStyles.secondaryButtonText]}>
          RETURN TO MATRIX
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderClientDetails = () => {
    if (!client) return null;

    const fullName = `${client.firstName} ${client.lastName}`.trim();
    const initials = `${client.firstName?.charAt(0) || ''}${client.lastName?.charAt(0) || ''}`.toUpperCase();

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Avatar y nombre principal */}
        <View style={[CyberStyles.cyberCard, { alignItems: 'center' }]}>
          <View style={[CyberStyles.cyberAvatar, { width: 100, height: 100 }]}>
            <Text style={[CyberStyles.avatarText, { fontSize: 32 }]}>
              {initials}
            </Text>
          </View>
          
          <Text style={[CyberStyles.headerTitle, { fontSize: 24, marginTop: 15 }]}>
            {fullName || 'Unnamed Entity'}
          </Text>
          
          <View style={[
            CyberStyles.statusBadge,
            CyberStyles.statusActive,
            { marginTop: 10 }
          ]}>
            <Text style={[
              CyberStyles.statusText,
              CyberStyles.statusActiveText
            ]}>
              ACTIVE
            </Text>
          </View>
        </View>

        {/* Información detallada */}
        <View style={CyberStyles.cyberCard}>
          <View style={CyberStyles.cardHeader}>
            <Text style={CyberStyles.cardTitle}>ENTITY DATA</Text>
          </View>
          
          <View style={{ gap: 20 }}>
            {/* ID */}
            <View>
              <Text style={CyberStyles.inputLabel}>ENTITY ID</Text>
              <View style={[CyberStyles.cyberInput, { opacity: 0.7 }]}>
                <Text style={CyberStyles.cyberText}>{client.id || 'N/A'}</Text>
              </View>
            </View>

            {/* Nombre */}
            <View>
              <Text style={CyberStyles.inputLabel}>FIRST NAME</Text>
              <View style={[CyberStyles.cyberInput, { opacity: 0.7 }]}>
                <Text style={CyberStyles.cyberText}>{client.firstName || 'N/A'}</Text>
              </View>
            </View>

            {/* Apellido */}
            <View>
              <Text style={CyberStyles.inputLabel}>LAST NAME</Text>
              <View style={[CyberStyles.cyberInput, { opacity: 0.7 }]}>
                <Text style={CyberStyles.cyberText}>{client.lastName || 'N/A'}</Text>
              </View>
            </View>

            {/* Email */}
            <View>
              <Text style={CyberStyles.inputLabel}>EMAIL ADDRESS</Text>
              <View style={[CyberStyles.cyberInput, { opacity: 0.7 }]}>
                <Text style={CyberStyles.cyberText}>{client.email || 'N/A'}</Text>
              </View>
            </View>

            {/* Teléfono */}
            <View>
              <Text style={CyberStyles.inputLabel}>PHONE NUMBER</Text>
              <View style={[CyberStyles.cyberInput, { opacity: 0.7 }]}>
                <Text style={CyberStyles.cyberText}>{client.phone || 'N/A'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Botones de acción */}
        <View style={{ padding: 20, gap: 15 }}>
          <TouchableOpacity
            style={[CyberStyles.cyberButton, CyberStyles.secondaryButton]}
            onPress={handleEdit}
            disabled={deleting}
            activeOpacity={0.8}
          >
            <Text style={[CyberStyles.buttonText, CyberStyles.secondaryButtonText]}>
              EDIT ENTITY
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              CyberStyles.cyberButton, 
              CyberStyles.dangerButton,
              deleting && { opacity: 0.7 }
            ]}
            onPress={handleDelete}
            disabled={deleting}
            activeOpacity={0.8}
          >
            <Text style={[CyberStyles.buttonText, CyberStyles.dangerButtonText]}>
              {deleting ? "DISCONNECTING..." : "DELETE ENTITY"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[CyberStyles.cyberButton, { 
              backgroundColor: 'transparent',
              borderColor: CyberColors.textSecondary,
            }]}
            onPress={() => navigation.goBack()}
            disabled={deleting}
            activeOpacity={0.8}
          >
            <Text style={[CyberStyles.buttonText, { 
              color: CyberColors.textSecondary 
            }]}>
              RETURN TO LIST
            </Text>
          </TouchableOpacity>
        </View>

        {/* Espaciado extra */}
        <View style={{ height: 50 }} />
      </ScrollView>
    );
  };

  if (loading) {
    return (
      <View style={CyberStyles.cyberContainer}>
        {renderHeader()}
        {renderLoading()}
      </View>
    );
  }

  if (!client) {
    return (
      <View style={CyberStyles.cyberContainer}>
        {renderHeader()}
        {renderClientNotFound()}
      </View>
    );
  }

  return (
    <View style={CyberStyles.cyberContainer}>
      {renderHeader()}
      {renderClientDetails()}
    </View>
  );
};

export default DetailsScreen;