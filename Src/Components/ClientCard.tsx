// Src/Components/ClientCard.tsx
import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { IClient } from "../api/types/IClient";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ClientStackParamList } from "../navigation/types";
import { deleteClient } from "../api/services/ClientServices";
import { CyberStyles, CyberColors } from "../styles/CyberStyles";

interface Props {
    data: IClient;
    onRefresh?: () => void;
}

const ClientCard: React.FC<Props> = ({ data, onRefresh }) => {
    const navigation =
        useNavigation<NativeStackNavigationProp<ClientStackParamList>>();

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
        console.log("🔍 ID del cliente:", data.id);
        
        if (!data.id) {
            console.error("❌ ID del cliente no válido:", data);
            Alert.alert("Error", "ID del cliente no válido");
            return;
        }

        try {
            console.log("🗑️ Iniciando eliminación del cliente...");
            const idString = String(data.id);
            
            await deleteClient(idString);
            console.log("✅ Cliente eliminado del servidor exitosamente");
            
            if (onRefresh) {
                console.log("✅ Llamando a onRefresh()");
                onRefresh();
            }
            
        } catch (error) {
            console.error("❌ Error al eliminar cliente:", error);
            
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

    // Generar iniciales para el avatar
    const getInitials = () => {
        const firstName = data.firstName || '';
        const lastName = data.lastName || '';
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();

    return (
        <View style={CyberStyles.clientCard}>
            {/* Información del cliente */}
            <View style={CyberStyles.clientInfo}>
                {/* Avatar futurista */}
                <View style={CyberStyles.cyberAvatar}>
                    <Text style={CyberStyles.avatarText}>{getInitials()}</Text>
                </View>
                
                {/* Detalles del cliente */}
                <View style={CyberStyles.clientDetails}>
                    {fullName && (
                        <Text style={CyberStyles.clientName}>{fullName}</Text>
                    )}
                    <Text style={CyberStyles.clientEmail}>
                        {data.email || 'No especificado'}
                    </Text>
                    <Text style={CyberStyles.clientPhone}>
                        {data.phone || 'No especificado'}
                    </Text>
                </View>

                {/* Badge de estado */}
                <View style={[
                    CyberStyles.statusBadge,
                    CyberStyles.statusActive // Puedes cambiar según el estado
                ]}>
                    <Text style={[
                        CyberStyles.statusText,
                        CyberStyles.statusActiveText
                    ]}>
                        ACTIVE
                    </Text>
                </View>
            </View>

            {/* Botones de acción */}
            <View style={CyberStyles.actionButtons}>
                <TouchableOpacity 
                    style={[CyberStyles.actionButton, CyberStyles.viewButton]} 
                    onPress={handleViewDetails}
                    activeOpacity={0.7}
                >
                    <Text style={[
                        CyberStyles.actionButtonText, 
                        CyberStyles.viewButtonText
                    ]}>
                        VIEW
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[CyberStyles.actionButton, CyberStyles.editButton]} 
                    onPress={handleEdit}
                    activeOpacity={0.7}
                >
                    <Text style={[
                        CyberStyles.actionButtonText, 
                        CyberStyles.editButtonText
                    ]}>
                        EDIT
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[CyberStyles.actionButton, CyberStyles.deleteButton]} 
                    onPress={handleDelete}
                    activeOpacity={0.7}
                >
                    <Text style={[
                        CyberStyles.actionButtonText, 
                        CyberStyles.deleteButtonText
                    ]}>
                        DELETE
                    </Text>
                </TouchableOpacity>
            </View>

            {/* ID debug (opcional) */}
            <Text style={[CyberStyles.mutedText, { fontSize: 10, textAlign: 'center', marginTop: 8 }]}>
                ID: {data.id || 'N/A'}
            </Text>
        </View>
    );
};

export default ClientCard;