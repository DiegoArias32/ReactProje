// Src/Components/DishCard.tsx
import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { IDish } from "../api/types/IDish";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DishStackParamList } from "../navigation/types";
import { deleteDish } from "../api/services/DishServices";
import { CyberStyles, CyberColors } from "../styles/CyberStyles";

interface Props {
    data: IDish;
    onRefresh?: () => void;
}

const DishCard: React.FC<Props> = ({ data, onRefresh }) => {
    const navigation =
        useNavigation<NativeStackNavigationProp<DishStackParamList>>();

    const handleEdit = () => {
        if (!data.id) {
            Alert.alert("Error", "ID del plato no válido");
            return;
        }
        navigation.navigate("DishUpdate", { id: data.id });
    };

    const handleDelete = async () => {
        if (!data.id) {
            Alert.alert("Error", "ID del plato no válido");
            return;
        }

        try {
            const idString = String(data.id);
            await deleteDish(idString);
            
            if (onRefresh) {
                onRefresh();
            }
            
        } catch (error) {
            console.error("❌ Error al eliminar plato:", error);
            
            let errorMessage = 'Error desconocido';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            
            Alert.alert("Error", `No se pudo eliminar el plato: ${errorMessage}`);
        }
    };

    const handleViewDetails = () => {
        if (!data.id) {
            Alert.alert("Error", "ID del plato no válido");
            return;
        }
        navigation.navigate("DishDetails", { id: data.id });
    };

    // Generar iniciales para el avatar
    const getInitials = () => {
        const name = data.name || '';
        const words = name.split(' ');
        if (words.length >= 2) {
            return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Formatear precio
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <View style={CyberStyles.clientCard}>
            {/* Información del plato */}
            <View style={CyberStyles.clientInfo}>
                {/* Avatar futurista */}
                <View style={[CyberStyles.cyberAvatar, { backgroundColor: CyberColors.warningNeon }]}>
                    <Text style={CyberStyles.avatarText}>{getInitials()}</Text>
                </View>
                
                {/* Detalles del plato */}
                <View style={CyberStyles.clientDetails}>
                    <Text style={CyberStyles.clientName}>
                        {data.name || 'Plato sin nombre'}
                    </Text>
                    <Text style={CyberStyles.clientEmail}>
                        {data.description || 'Sin descripción'}
                    </Text>
                    <Text style={[CyberStyles.clientPhone, { color: CyberColors.warningNeon, fontWeight: 'bold' }]}>
                        {formatPrice(data.price || 0)}
                    </Text>
                </View>

                {/* Badge de estado */}
                <View style={[
                    CyberStyles.statusBadge,
                    CyberStyles.statusActive
                ]}>
                    <Text style={[
                        CyberStyles.statusText,
                        CyberStyles.statusActiveText
                    ]}>
                        AVAILABLE
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

            {/* ID debug */}
            <Text style={[CyberStyles.mutedText, { fontSize: 10, textAlign: 'center', marginTop: 8 }]}>
                ID: {data.id || 'N/A'}
            </Text>
        </View>
    );
};

export default DishCard;