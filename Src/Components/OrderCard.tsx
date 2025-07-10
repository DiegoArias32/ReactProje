// Src/Components/OrderCard.tsx
import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { IOrder } from "../api/types/IOrder";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { OrderStackParamList } from "../navigation/types";
import { deleteOrder } from "../api/services/OrderServices";
import { CyberStyles, CyberColors } from "../styles/CyberStyles";

interface Props {
    data: IOrder;
    onRefresh?: () => void;
}

const OrderCard: React.FC<Props> = ({ data, onRefresh }) => {
    const navigation =
        useNavigation<NativeStackNavigationProp<OrderStackParamList>>();

    const handleEdit = () => {
        if (!data.id) {
            Alert.alert("Error", "ID de la orden no válido");
            return;
        }
        navigation.navigate("OrderUpdate", { id: data.id });
    };

    const handleDelete = async () => {
        if (!data.id) {
            Alert.alert("Error", "ID de la orden no válido");
            return;
        }

        try {
            const idString = String(data.id);
            await deleteOrder(idString);
            
            if (onRefresh) {
                onRefresh();
            }
            
        } catch (error) {
            console.error("❌ Error al eliminar orden:", error);
            
            let errorMessage = 'Error desconocido';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            
            Alert.alert("Error", `No se pudo eliminar la orden: ${errorMessage}`);
        }
    };

    const handleViewDetails = () => {
        if (!data.id) {
            Alert.alert("Error", "ID de la orden no válido");
            return;
        }
        navigation.navigate("OrderDetails", { id: data.id });
    };

    // Formatear fecha
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Fecha inválida';
        }
    };

    // Obtener color del estado
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
            case 'pendiente':
                return CyberColors.warningNeon;
            case 'completed':
            case 'completado':
                return CyberColors.primaryNeon;
            case 'cancelled':
            case 'cancelado':
                return CyberColors.dangerNeon;
            default:
                return CyberColors.textSecondary;
        }
    };

    // Generar iniciales para el avatar
    const getInitials = () => {
        const orderId = data.id || '';
        return `#${orderId.slice(-3)}`.toUpperCase();
    };

    return (
        <View style={CyberStyles.clientCard}>
            {/* Información de la orden */}
            <View style={CyberStyles.clientInfo}>
                {/* Avatar futurista */}
                <View style={[CyberStyles.cyberAvatar, { backgroundColor: CyberColors.secondaryNeon }]}>
                    <Text style={CyberStyles.avatarText}>{getInitials()}</Text>
                </View>
                
                {/* Detalles de la orden */}
                <View style={CyberStyles.clientDetails}>
                    <Text style={CyberStyles.clientName}>
                        Orden #{data.id || 'N/A'}
                    </Text>
                    <Text style={CyberStyles.clientEmail}>
                        Cliente: {data.idCustomer || 'N/A'}
                    </Text>
                    <Text style={CyberStyles.clientPhone}>
                        {formatDate(data.date || '')}
                    </Text>
                </View>

                {/* Badge de estado */}
                <View style={[
                    CyberStyles.statusBadge,
                    { 
                        backgroundColor: `${getStatusColor(data.status || '')}20`,
                        borderColor: getStatusColor(data.status || ''),
                    }
                ]}>
                    <Text style={[
                        CyberStyles.statusText,
                        { color: getStatusColor(data.status || '') }
                    ]}>
                        {(data.status || 'UNKNOWN').toUpperCase()}
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

export default OrderCard;