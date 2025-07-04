import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { ClientStackParamList } from '../navigation/types';
import { useEffect, useState } from 'react';
import { getClientById, deleteClient } from '../api/services/ClientServices';
import { IClient } from '../api/types/IClient';
import { Alert } from 'react-native';

type DetailsScreenProps = NativeStackScreenProps<ClientStackParamList, 'Details'>;
type DetailsScreenNavigationProps = NativeStackNavigationProp<ClientStackParamList, 'Details'>;

export default function Details() {
  const navigation = useNavigation<DetailsScreenNavigationProps>();
  const route = useRoute<DetailsScreenProps['route']>();
  const { id } = route.params;

  const [client, setClient] = useState<IClient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        console.log("📋 Obteniendo detalles del cliente:", id);
        const clientData = await getClientById(id);
        console.log("✅ Cliente obtenido:", clientData);
        setClient(clientData);
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
      "Confirmar eliminación",
      "¿Estás seguro de que quieres eliminar este cliente?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteClient(id);
              console.log("✅ Cliente eliminado exitosamente");
              Alert.alert("Éxito", "Cliente eliminado correctamente", [
                { text: "OK", onPress: () => navigation.goBack() }
              ]);
            } catch (error) {
              console.error("❌ Error al eliminar cliente:", error);
              Alert.alert("Error", "No se pudo eliminar el cliente");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text1}>Cargando...</Text>
      </View>
    );
  }

  if (!client) {
    return (
      <View style={styles.container}>
        <Text style={styles.text1}>Cliente no encontrado</Text>
        <Pressable 
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.text2}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  const fullName = `${client.first_name} ${client.last_name}`.trim();

  return (
    <View style={styles.container}>
      <Text style={styles.text1}>Detalles del Cliente</Text>
      
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Nombre:</Text>
        <Text style={styles.value}>{fullName}</Text>
        
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{client.email}</Text>
        
        <Text style={styles.label}>Teléfono:</Text>
        <Text style={styles.value}>{client.phone}</Text>
        
        <Text style={styles.label}>ID:</Text>
        <Text style={styles.value}>{client.id}</Text>
      </View>

      <StatusBar style="auto" />
      
      <View style={styles.buttonContainer}>
        <Pressable 
          style={[styles.button, styles.backButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.text2}>Volver a Lista</Text>
        </Pressable>
        
        <Pressable 
          style={[styles.button, styles.editButton]}
          onPress={handleEdit}
        >
          <Text style={styles.text2}>Editar Cliente</Text>
        </Pressable>
        
        <Pressable 
          style={[styles.button, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={styles.text2}>Eliminar Cliente</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgreen',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text1: {
    fontFamily: 'Roboto',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    width: '100%',
    maxWidth: 300,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#4CAF50',
  },
  editButton: {
    backgroundColor: '#1e90ff',
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
  },
  text2: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});