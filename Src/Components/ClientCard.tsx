import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { IClient } from "../api/types/IClient";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ClientStackParamList } from "../navigation/types";
import { deleteClient } from "../api/services/ClientServices";

interface Props {
    data: IClient;
    onRefresh?: () => void; // Callback para actualizar la lista
}

const ClientCard: React.FC<Props> = ({ data, onRefresh }) => {
    const navigation =
        useNavigation<NativeStackNavigationProp<ClientStackParamList>>();

    // Debug: Verificar que los datos lleguen correctamente
    console.log("🔍 ClientCard data:", data);

    const handleEdit = () => {
        console.log("✏️ BOTÓN EDITAR PRESIONADO");
        console.log("🔍 ID para editar:", data.id);
        
        if (!data.id) {
            Alert.alert("Error", "ID del cliente no válido");
            return;
        }
        navigation.navigate("ClientUpdate", { id: data.id });
    };

    const handleDelete = async () => {
        console.log("🚨 BOTÓN ELIMINAR PRESIONADO");
        console.log("🔍 DATOS COMPLETOS DEL CLIENTE:", JSON.stringify(data, null, 2));
        console.log("🔍 ID del cliente:", data.id);
        console.log("🔍 Tipo del ID:", typeof data.id);
        
        // Validar que el ID existe antes de intentar eliminar
        if (!data.id) {
            console.error("❌ ID del cliente no válido:", data);
            Alert.alert("Error", "ID del cliente no válido");
            return;
        }

        console.log("🔥 ELIMINANDO DIRECTAMENTE (SIN CONFIRMACIÓN)");
        
        try {
            console.log("🗑️ Iniciando eliminación del cliente...");
            console.log("🔍 ID que se enviará:", data.id);
            
            // Asegurar que el ID sea string
            const idString = String(data.id);
            console.log("🔍 ID convertido a string:", idString);
            
            // Llamar al servicio de eliminación
            console.log("📡 Llamando a deleteClient...");
            await deleteClient(idString);
            
            console.log("✅ Cliente eliminado del servidor exitosamente");
            
            // Forzar actualización de la lista
            console.log("🔄 Refrescando lista de clientes...");
            if (onRefresh) {
                console.log("✅ Llamando a onRefresh()");
                onRefresh();
            } else {
                console.warn("⚠️ onRefresh no está definido");
            }
            
        } catch (error) {
            console.error("❌ Error completo al eliminar cliente:", error);
            console.error("❌ Tipo de error:", typeof error);
            console.error("❌ Error stringificado:", JSON.stringify(error, null, 2));
            
            let errorMessage = 'Error desconocido';
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === 'string') {
                errorMessage = error;
            } else if (typeof error === 'object' && error !== null && 'message' in error) {
                errorMessage = (error as { message: string }).message;
            }
            
            Alert.alert(
                "Error", 
                `No se pudo eliminar el cliente: ${errorMessage}`
            );
        }
    };

    const handleViewDetails = () => {
        console.log("👁️ BOTÓN VER PRESIONADO");
        console.log("🔍 ID para ver detalles:", data.id);
        
        if (!data.id) {
            Alert.alert("Error", "ID del cliente no válido");
            return;
        }
        navigation.navigate("Details", { id: data.id });
    };

    // Mostrar el nombre completo si existe
    const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();

    // Debug: Logs adicionales para verificar el estado del componente
    console.log("🏗️ ClientCard renderizando...");
    console.log("🔍 fullName:", fullName);
    console.log("🔍 onRefresh disponible:", !!onRefresh);

    return (
        <View style={styles.card}>
            {/* Mostrar nombre completo si existe */}
            {fullName && (
                <Text style={styles.title}>{fullName}</Text>
            )}
            
            <Text style={styles.text}>Email: {data.email || 'No especificado'}</Text>
            <Text style={styles.text}>Teléfono: {data.phone || 'No especificado'}</Text>
            
            {/* Debug: Mostrar ID (opcional, puedes remover después) */}
            <Text style={styles.debugText}>ID: {data.id || 'ID no disponible'}</Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={styles.buttonView} 
                    onPress={handleViewDetails}
                    activeOpacity={0.7}
                >
                    <Text style={styles.buttonText}>Ver</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.buttonEdit} 
                    onPress={handleEdit}
                    activeOpacity={0.7}
                >
                    <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.buttonDelete} 
                    onPress={handleDelete}
                    activeOpacity={0.7}
                >
                    <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#f8f8f8",
        padding: 16,
        margin: 8,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 6,
        color: "#333",
    },
    text: {
        fontSize: 14,
        color: "#666",
        marginBottom: 4,
    },
    debugText: {
        fontSize: 12,
        color: "#999",
        marginBottom: 4,
        fontStyle: "italic",
    },
    buttonContainer: {
        flexDirection: "row",
        marginTop: 12,
        justifyContent: "space-between",
    },
    buttonView: {
        backgroundColor: "#4CAF50",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    buttonEdit: {
        backgroundColor: "#1e90ff",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    buttonDelete: {
        backgroundColor: "#ff4d4d",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 12,
    },
});

export default ClientCard;