// Src/Components/EmployeeCard.tsx
import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { IEmployee } from "../api/types/IEmployee";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { EmployeeStackParamList } from "../navigation/types";
import { deleteEmployee } from "../api/services/EmployeeServices";
import { CyberStyles, CyberColors } from "../styles/CyberStyles";

interface Props {
    data: IEmployee;
    onRefresh?: () => void;
}

const EmployeeCard: React.FC<Props> = ({ data, onRefresh }) => {
    const navigation =
        useNavigation<NativeStackNavigationProp<EmployeeStackParamList>>();

    const handleEdit = () => {
        if (!data.id) {
            Alert.alert("Error", "ID del empleado no válido");
            return;
        }
        navigation.navigate("EmployeeUpdate", { id: data.id });
    };

    const handleDelete = async () => {
        if (!data.id) {
            Alert.alert("Error", "ID del empleado no válido");
            return;
        }

        try {
            const idString = String(data.id);
            await deleteEmployee(idString);
            
            if (onRefresh) {
                onRefresh();
            }
            
        } catch (error) {
            console.error("❌ Error al eliminar empleado:", error);
            
            let errorMessage = 'Error desconocido';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            
            Alert.alert("Error", `No se pudo eliminar el empleado: ${errorMessage}`);
        }
    };

    const handleViewDetails = () => {
        if (!data.id) {
            Alert.alert("Error", "ID del empleado no válido");
            return;
        }
        navigation.navigate("EmployeeDetails", { id: data.id });
    };

    // Generar iniciales para el avatar
    const getInitials = () => {
        const firstName = data.firstName || '';
        const lastName = data.lastName || '';
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    // Formatear salario
    const formatSalary = (salary: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(salary);
    };

    const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();

    return (
        <View style={CyberStyles.clientCard}>
            {/* Información del empleado */}
            <View style={CyberStyles.clientInfo}>
                {/* Avatar futurista */}
                <View style={[CyberStyles.cyberAvatar, { backgroundColor: CyberColors.accentNeon }]}>
                    <Text style={CyberStyles.avatarText}>{getInitials()}</Text>
                </View>
                
                {/* Detalles del empleado */}
                <View style={CyberStyles.clientDetails}>
                    <Text style={CyberStyles.clientName}>
                        {fullName || 'Empleado sin nombre'}
                    </Text>
                    <Text style={CyberStyles.clientEmail}>
                        {data.position || 'Sin posición asignada'}
                    </Text>
                    <Text style={[CyberStyles.clientPhone, { 
                        color: CyberColors.accentNeon, 
                        fontWeight: 'bold' 
                    }]}>
                        {formatSalary(data.salary || 0)}
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

            {/* ID debug */}
            <Text style={[CyberStyles.mutedText, { fontSize: 10, textAlign: 'center', marginTop: 8 }]}>
                ID: {data.id || 'N/A'}
            </Text>
        </View>
    );
};

export default EmployeeCard;